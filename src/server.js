const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const RASA_SERVER = "http://localhost:5005/webhooks/rest/webhook"; // Update if needed

// 📌 Send user message to RASA and get response
app.post("/chat", async (req, res) => {
    try {
        const { message, sender } = req.body;
        if (!message || !sender) return res.status(400).json({ error: "Message and sender ID required" });

        const rasaResponse = await axios.post(RASA_SERVER, {
            sender,
            message,
        });

        res.json({ response: rasaResponse.data });
    } catch (error) {
        res.status(500).json({ error: "Error communicating with RASA", details: error.message });
    }
});

// Start server
app.listen(3000, () => console.log("Server running on port 3000"));
