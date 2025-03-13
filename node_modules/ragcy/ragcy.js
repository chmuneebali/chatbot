const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');

allowedExtensions = ['json', 'xls', 'xlsx', 'mkv', 'mp4', 'mp3', 'wav', 'pdf', 'txt', 'csv', 'docx', 'doc', 'html'];

class RagcyClient {

    constructor(config) {
      this.apiKey = config.key;
      this.baseUrl = 'https://api.ragcy.com';
    }

    // makeRequest(method, endpoint, data = null) {
    //     return new Promise(async (resolve, reject) => {
    //         const url = `${this.baseUrl}${endpoint}`;
    //         const headers = {
    //           'Authorization': `Bearer ${this.apiKey}`,
    //           'Content-Type': 'application/json'
    //         };
      
    //         const options = {
    //           method,
    //           headers,
    //           body: data ? JSON.stringify(data) : undefined
    //         };
        
    //         const response = await fetch(url, options);
    //         if (!response.ok) {
    //           reject(`HTTP error! status: ${response.status}`);
    //         }
      
    //        data = await response.json();
    //        if (data && !!data.success) {
    //           resolve(data);
    //        } else {
    //           reject(!!data.error ? data.error : 'Something was wrong!');
    //        }
    //     });
    // }

    async makeRequest(method, endpoint, data = null, isFile = false) {
      const url = `${this.baseUrl}${endpoint}`;
      const headers = {
        'authorization': `Bearer ${this.apiKey}`,
        'Content-Type': !isFile ? 'application/json' : 'multipart/form-data'
      };
    
      const config = {
        method: method.toLowerCase(),
        url,
        headers,
        data: data ? (!isFile ? JSON.stringify(data) : data) : undefined
      };

      try {
        let response = null;
        if (!isFile) {
          response = await axios(config);
        } else {
          response = await axios.post(url, data, { headers });
        }

        if (response.data && response.data.success) {
          return response.data;
        } else {
          throw new Error(response.data.error || 'Something went wrong!');
        }
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          throw new Error(`HTTP error! status: ${error.response.status}`);
        } else if (error.request) {
          // The request was made but no response was received
          throw new Error('No response received from the server');
        } else {
          // Something happened in setting up the request that triggered an Error
          throw error;
        }
      }
    }
  
    /**
     * Creates a new corpus.
     * @param {string} category - The category of the corpus.
     * @param {string} name - The name of the corpus.
     * @param {string|null} [welcomeMessage=null] - An optional welcome message for the corpus.
     * @param {string|null} [agentInstruction=null] - Optional instructions for the agent.
     * @param {string|null} [prompt=null] - An optional prompt for the corpus.
     * @returns {Promise<Object>} The created corpus object.
     */
    async createCorpus(category, name, welcomeMessage = null, agentInstruction = null, prompt = null) {
       const data = {
        category,
        name,
        agentInstruction,
        prompt,
        welcomeMessage
      }
      return this.makeRequest('POST', '/corpus', data);
    }
  
    /**
     * Retrieves a list of all corpora.
     * @returns {Promise<Array>} An array of corpus objects.
     */
    async corpusList() {
      return this.makeRequest('GET', `/corpus`);
    }
  
    /**
     * Updates an existing corpus.
     * @param {string} id - The ID of the corpus to update.
     * @param {Object} data - The data to update the corpus with.
     * @returns {Promise<Object>} The updated corpus object.
     */
    async updateCorpus(id, data) {
      return this.makeRequest('PUT', `/corpus/${id}`, data);
    }
  
    /**
     * Deletes a corpus.
     * @param {string} id - The ID of the corpus to delete.
     * @returns {Promise<Object>} The result of the delete operation.
     */
    async deleteCorpus(id) {
      return this.makeRequest('DELETE', `/corpus/${id}`);
    }

    /**
     * Queries a corpus with user input.
     * @param {string} corpusId - The ID of the corpus to query.
     * @param {string} input - The user's input query.
     * @param {string|null} [sessionId=null] - An optional session ID for continuing a conversation.
     * @returns {Promise<Object>} The query response.
     */
    async query(corpusId, input, sessionId = null) {
        let params = `?corpusId=${corpusId}&input=${encodeURIComponent(input)}`;

        if (sessionId) {
            params = params + `&${sessionId}`
        }

        return this.makeRequest('GET', `/corpus/query${params}`);
    }

    /**
     * Adds a data source to a corpus.
     * @param {string} corpusId - The ID of the corpus to add the data source to.
     * @param {string|null} [filePath=null] - The path to the file to upload, if adding a file.
     * @param {string|null} [url=null] - The URL of the data source, if adding a URL.
     * @returns {Promise<Object>|null} The added data source object, or null if invalid input.
     */
    async addDataSource(corpusId, filePath = null, url = null) {
        if (!filePath && !url) {
            return null;
        }

        const form = new FormData();
        let filename = null;
        let size = null;
        let type = null;

        if (url) {
            filename = url;
            type = 'url';
        } else {
            const fileStream = fs.createReadStream(filePath);
            const  stats = fs.statSync(filePath)
            size = stats.size / (1024*1024);
            filename = path.basename(filePath);
            const extension = filename.split('.').pop().toLowerCase();
            type = extension;
            if (!allowedExtensions.includes(extension.toLowerCase())) {
              return 'Please upload a JSON, XLS, XLSX, MKV, MP4, MP3, WAV, PDF, TXT, CSV, DOCX, or DOC file';
            }
       
            form.append('file', fileStream, {
                filename: filename,
                knownLength: stats.size
            });

        }

        form.append('filename', filename);
        form.append('type', type);
        form.append('corpusId', `${corpusId}`);
        if (size) {
            form.append('size', `${size}`);
        }

        return this.makeRequest('POST', '/datasources', form, true);
    }

    /**
     * Retrieves a list of data sources for a specific corpus.
     * @param {string} corpusId - The ID of the corpus to get data sources for.
     * @returns {Promise<Array>} An array of data source objects.
     */
    async dataSourceList(corpusId) {
        return this.makeRequest('GET', `/datasources/${corpusId}`);
    }

    /**
     * Removes a data source.
     * @param {string} id - The ID of the data source to remove.
     * @returns {Promise<Object>} The result of the remove operation.
     */
    async removeDataSource(id) {
        return this.makeRequest('DELETE', `/datasources/${id}`);
    }

    /**
     * Retrieves a list of sessions for a specific corpus.
     * @param {string} corpusId - The ID of the corpus to get sessions for.
     * @returns {Promise<Array>} An array of session objects.
     */
    async sessionList(corpusId) {
        return this.makeRequest('GET', `/sessions/corpus/${corpusId}`);
    }

        /**
     * Retrieves a list of requests for a specific session.
     * @param {string} sessionId - The ID of the session to get requests for.
     * @param {'desc' | 'asc'} order - The ID of the session to get requests for.
     * @returns {Promise<Array>} An array of requests objects.
     */
      async requestList(sessionId, order = 'asc') {
          return this.makeRequest('GET', `/requests/session/${sessionId}?order=${order}`);
      }


  }

  function init(config) {
    return new RagcyClient(config);
  }

//   export { init };
module.exports = { init };
// export default { init };



