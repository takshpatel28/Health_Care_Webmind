const express = require("express");
const RoleRouter = require("./Routes/role.routes");
const TrustyRouter = require("./Routes/trusty.routes");
const cors = require("cors")
const app = express();
require("dotenv").config();
const axios = require('axios');

app.use(express.json());
app.use(cors());

app.use("/api", RoleRouter);
app.use("/api", TrustyRouter);

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
