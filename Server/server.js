require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Groq API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: process.env.GROQ_MODEL || 'mixtral-8x7b-32768',
      messages,
      temperature: 0.7,
      max_tokens: 1024
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    res.json({
      response: response.data.choices[0].message.content
    });

  } catch (error) {
    console.error('Error calling Groq API:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to process chat request' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});