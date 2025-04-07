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
// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.match(/image\/(jpeg|png|jpg|gif)/)) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only JPEG, PNG, JPG, or GIF images are allowed!'), false);
//     }
//   }
// });

const DOCTOR_SYSTEM_PROMPT = `
You are Dr. AI, an adaptive medical assistant capable of handling both routine health questions and complex cases (cancer, rare diseases, lab/imaging reports). Adjust your response depth based on the query:

For patients: Use simple, jargon-free language.

For doctors: Provide detailed, guideline-backed analysis (NCCN, WHO, UpToDate).

Rules:

Triage First:

"Is this urgent? Red flags: [chest pain/neuro symptoms/etc.]."

General Health:

Offer likely causes and home care, but always say: "See a doctor if [symptoms] persist/worsen."

Critical Cases (Cancer, etc.):

Analyze reports: "Your [test] shows [X]. Next: [biopsy/MRI/specialist]."

Cite protocols: "NCCN recommends [treatment] for [stage]."

Safety:

Emergencies: "Call EMS NOW for [symptom]."

Uncertainty: "This requires a [specialist]’s input."

Ethics:

Never diagnose definitively without tests.

For terminal cases: "Let's discuss goals of care with your doctor."
`;

// app.post('/api/chat', upload.single('image'), async (req, res) => {
//   try {
//     const { message, chatHistory = [] } = req.body;
//     const imageFile = req.file;

//     // chatHistory = when user send new message we need Old messages to explain things to AI

//     // Parse chatHistory if it's a string
//     const parsedChatHistory = typeof chatHistory === 'string'
//       ? JSON.parse(chatHistory)
//       : chatHistory;

//     if (!message && !imageFile) {
//       return res.status(400).json({ error: 'Please send a message or image' });
//     }

//     // Prepare messages for the AI
//     const messages = [];

//     // Only include system message if NOT sending an image
//     if (!imageFile) {
//       messages.push({ role: 'system', content: DOCTOR_SYSTEM_PROMPT });
//     }

//     // Add chat history (filter out system messages if sending image)
//     messages.push(...parsedChatHistory.filter(msg => {
//       return !(imageFile && msg.role === 'system');
//     }));

//     // Handle image upload
//     if (imageFile) {
//       const base64Image = imageFile.buffer.toString('base64');
//       const imageUrl = `data:${imageFile.mimetype};base64,${base64Image}`;

//       messages.push({
//         role: 'user',
//         content: [
//           { type: 'text', text: message || 'Please analyze this image' },
//           {
//             type: 'image_url',
//             image_url: { url: imageUrl }
//           }
//         ]
//       });
//     } else {
//       messages.push({
//         role: 'user',
//         content: message
//       });
//     }

//     // Determine which model to use
//     const model = imageFile ? 'llama-3.2-11b-vision-preview' : 'llama3-8b-8192';

//     const response = await axios.post(
//       'https://api.groq.com/openai/v1/chat/completions',
//       {
//         messages,
//         model,
//         temperature: 0.7
//       },
//       {
//         headers: {
//           'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
//           'Content-Type': 'application/json'
//         }
//       }
//     );

//     res.json({
//       response: response.data.choices[0].message.content,
//     });

//   } catch (error) {
//     console.error('Error:', error.response?.data || error.message);
//     res.status(500).json({
//       error: 'Sorry, something went wrong',
//       details: error.response?.data || error.message
//     });
//   }
// });


const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.match(/image\/(jpeg|png|jpg|gif)/) || 
      file.mimetype === 'application/pdf'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only images (JPEG, PNG, JPG, GIF) and PDFs are allowed!'), false);
    }
  }
});

app.post('/api/chat', upload.single('file'), async (req, res) => {
  try {
    const { message, chatHistory = [] } = req.body;
    const file = req.file;

    if (!message && !file) {
      return res.status(400).json({ error: 'Please send a message or file' });
    }

    const parsedChatHistory = typeof chatHistory === 'string' 
      ? JSON.parse(chatHistory) 
      : chatHistory;

    const messages = [];

    // Add system prompt only for non-file messages
    if (!file) {
      messages.push({ role: 'system', content: DOCTOR_SYSTEM_PROMPT });
    }

    // Add chat history
    messages.push(...parsedChatHistory.filter(msg => !(file && msg.role === 'system')));

    // Handle file upload
    if (file) {
      const base64File = file.buffer.toString('base64');
      const fileUrl = `data:${file.mimetype};base64,${base64File}`;

      const content = [
        { type: 'text', text: message || 'Please analyze this document' }
      ];

      if (file.mimetype === 'application/pdf') {
        // For PDFs, we'll send both the text info and the actual PDF
        content.push(
          { type: 'text', text: `PDF file: ${file.originalname}` },
          { type: 'pdf_url', pdf_url: { url: fileUrl } }
        );
      } else {
        // For images
        content.push({
          type: 'image_url',
          image_url: { url: fileUrl }
        });
      }

      messages.push({
        role: 'user',
        content: content
      });
    } else {
      messages.push({
        role: 'user',
        content: message
      });
    }

    // Use vision model for images, regular model for PDFs/text
    const model = file && !file.mimetype.includes('pdf') 
      ? 'llama-3.2-11b-vision-preview' 
      : 'llama3-8b-8192';

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
