const express = require('express')
require('dotenv').config()
const app = express()
const ChatbotRoutes = require('./src/routes/ChatRouter')

app.use(express.json())
app.use('/chat',ChatbotRoutes)
const port = process.env.port || 78978
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})