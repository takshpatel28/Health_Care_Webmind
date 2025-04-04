const express = require("express");
const RoleRouter = require("./Routes/role.routes");
const TrustyRouter = require("./Routes/trusty.routes");
const cors = require("cors")
const app = express();
require("dotenv").config();
const axios = require('axios');
const multer = require('multer');

app.use(express.json());
app.use(cors());

app.use("/api", RoleRouter);
app.use("/api", TrustyRouter);

// Configure file uploads
// For Uploading File Client to Server
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.match(/image\/(jpeg|png|jpg|gif)/)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, JPG, or GIF images are allowed!'), false);
    }
  }
});

const DOCTOR_SYSTEM_PROMPT = `
You are Dr. AI, a friendly and knowledgeable medical professional. 
You provide general health information and advice, but always remind patients 
to consult with their real doctor for serious concerns.

Guidelines:
1. Be empathetic and professional
2. Ask clarifying questions when needed
3. Never diagnose serious conditions - suggest seeing a doctor instead
4. Keep explanations clear and simple
5. For emergencies, always advise seeking immediate medical help
`;

app.post('/api/chat', upload.single('image'), async (req, res) => {
  try {
    const { message, chatHistory = [] } = req.body;
    const imageFile = req.file;

    // chatHistory = when user send new message we need Old messages to explain things to AI

    // Parse chatHistory if it's a string
    const parsedChatHistory = typeof chatHistory === 'string'
      ? JSON.parse(chatHistory)
      : chatHistory;

    if (!message && !imageFile) {
      return res.status(400).json({ error: 'Please send a message or image' });
    }

    // Prepare messages for the AI
    const messages = [];

    // Only include system message if NOT sending an image
    if (!imageFile) {
      messages.push({ role: 'system', content: DOCTOR_SYSTEM_PROMPT });
    }

    // Add chat history (filter out system messages if sending image)
    messages.push(...parsedChatHistory.filter(msg => {
      return !(imageFile && msg.role === 'system');
    }));

    // Handle image upload
    if (imageFile) {
      const base64Image = imageFile.buffer.toString('base64');
      const imageUrl = `data:${imageFile.mimetype};base64,${base64Image}`;

      messages.push({
        role: 'user',
        content: [
          { type: 'text', text: message || 'Please analyze this image' },
          {
            type: 'image_url',
            image_url: { url: imageUrl }
          }
        ]
      });
    } else {
      messages.push({
        role: 'user',
        content: message
      });
    }

    // Determine which model to use
    const model = imageFile ? 'llama-3.2-11b-vision-preview' : 'llama3-8b-8192';

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        messages,
        model,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      response: response.data.choices[0].message.content,
    });

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Sorry, something went wrong',
      details: error.response?.data || error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
