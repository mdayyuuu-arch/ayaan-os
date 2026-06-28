require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const app = express();
app.use(cors());
app.use(express.json());
app.post('/api/chat', async (req, res) => {
  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      { model: "llama-3.3-70b-versatile", messages: req.body.messages, max_tokens: 1000 },
      { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` }}
    );
    res.json({ content: [{ text: response.data.choices[0].message.content }] });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.listen(3001, () => console.log('Proxy running on port 3001'));
