# Ragcy

Ragcy is a Node.js client library for interacting with the Ragcy API. It provides an easy-to-use interface for managing corpora, data sources, sessions, and queries.

## Installation

Install the package using npm:

```properties
npm install ragcy
```

## Usage
First, import and initialize the Ragcy client. Get your API_KEY [here](https://ragcy.com/dashboard/api)

```javascript
const ragcy = require('ragcy');

const client = ragcy.init({ key: 'YOUR_API_KEY' });
```

## Corpus Management
### Create a new corpus:

```javascript
const newCorpus = await client.createCorpus('category', 'name', 'welcome message', 'agent instruction', 'prompt');
```

### List all corpora:

```javascript
const corpusList = await client.corpusList();
```

### Update a corpus:

```javascript
const updatedCorpus = await client.updateCorpus('corpusId', { name: 'New Name' });
````

### Delete a corpus:

```javascript
await client.deleteCorpus('corpusId');
```

## Querying
### Query a corpus:

```javascript
const response = await client.query('corpusId', 'user input', 'sessionId');
```

## Data Source Management
### Add a data source:

```javascript
// Add a file
const fileDataSource = await client.addDataSource('corpusId', '/path/to/file.pdf');

// Add a URL
const urlDataSource = await client.addDataSource('corpusId', null, 'https://example.com/data');

```

### List data sources for a corpus:

```javascript
const dataSources = await client.dataSourceList('corpusId');
```

### Remove a data source:

```javascript
await client.removeDataSource('dataSourceId');
```

## Session Management
### List sessions for a corpus:

```javascript
const sessions = await client.sessionList('corpusId');
```

### List requests for a session:

```javascript
const requests = await client.requestList('sessionId');
````

## Supported File Types
When adding file data sources, the following file extensions are supported:

- json
- xls
- xlsx
- mkv
- mp4
- mp3
- wav
- pdf
- txt
- csv
- docx
- doc

## Error Handling
All methods return promises and throw errors for unsuccessful requests. It's recommended to use try-catch blocks or .catch() methods when calling these functions.

## License
### MIT License

This README provides an overview of the package, installation instructions, usage examples for each main function, information about supported file types, and a note on error handling. You may want to add more details, such as:

1. A more detailed API reference
2. Information about rate limiting
3. Troubleshooting tips
4. Contributing guidelines
5. A changelog

Remember to create a LICENSE file if you haven't already, and consider adding more extensive documentation if the API has more complex features or options.
