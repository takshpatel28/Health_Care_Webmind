const express = require("express");
const RoleRouter = require("./Routes/role.routes");
const TrustyRouter = require("./Routes/trusty.routes");
const cors = require("cors");
const app = express();
require("dotenv").config();
const axios = require("axios");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const Tesseract = require("tesseract.js"); // Import Tesseract.js for OCR

app.use(express.json());
app.use(cors());

app.use("/api", RoleRouter);
app.use("/api", TrustyRouter);

// Configure file uploads
// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = [
//       "image/jpeg",
//       "image/png",
//       "image/jpg",
//       "image/gif",
//       "application/pdf",
//       "application/msword",
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//       "text/plain",
//       "application/rtf",
//     ];

//     if (allowedTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(
//         new Error(
//           "Only images (JPEG, PNG, JPG, GIF), PDFs, and documents (DOC, DOCX, TXT, RTF) are allowed!"
//         ),
//         false
//       );
//     }
//   },
// });

// const DOCTOR_SYSTEM_PROMPT = `
// You are Dr. AI, an adaptive medical assistant capable of handling both routine health questions and complex cases (cancer, rare diseases, lab/imaging reports). Adjust your response depth based on the query:

// For patients: Use simple, jargon-free language.
// For doctors: Provide detailed, guideline-backed analysis (NCCN, WHO, UpToDate).

// Rules:
// Triage First:
// "Is this urgent? Red flags: [chest pain/neuro symptoms/etc.]."

// General Health:
// Offer likely causes and home care, but always say: "See a doctor if [symptoms] persist/worsen."

// Critical Cases (Cancer, etc.):
// Analyze reports: "Your [test] shows [X]. Next: [biopsy/MRI/specialist]."
// Cite protocols: "NCCN recommends [treatment] for [stage]."

// Safety:
// Emergencies: "Call EMS NOW for [symptom]."
// Uncertainty: "This requires a [specialist]'s input."

// Ethics:
// Never diagnose definitively without tests.
// For terminal cases: "Let's discuss goals of care with your doctor."
// `;

// // Extract text from PDF using pdf-parse
// async function extractTextFromPDF(pdfBuffer) {
//   try {
//     const data = await pdfParse(pdfBuffer);
//     return data.text;
//   } catch (error) {
//     console.error("Error extracting text from PDF:", error);
//     throw new Error("Could not extract text from PDF");
//   }
// }

// // Extract text from DOCX using mammoth
// async function extractTextFromDOCX(docxBuffer) {
//   try {
//     const result = await mammoth.extractRawText({ buffer: docxBuffer });
//     return result.value;
//   } catch (error) {
//     console.error("Error extracting text from DOCX:", error);
//     throw new Error("Could not extract text from DOCX");
//   }
// }

// // Extract text from images using Tesseract.js
// async function extractTextFromImage(imageBuffer) {
//   try {
//     const { data: { text } } = await Tesseract.recognize(imageBuffer, "eng", {
//       logger: (info) => console.log(info), // Log OCR progress
//     });
//     return text;
//   } catch (error) {
//     console.error("Error extracting text from image:", error);
//     throw new Error("Could not extract text from image");
//   }
// }

// app.post("/api/chat", upload.single("file"), async (req, res) => {
//   try {
//     const { message, chatHistory = [] } = req.body;
//     const file = req.file;

//     // Parse chat history if it's a string
//     const parsedChatHistory =
//       Array.isArray(chatHistory) ? chatHistory : [];

//     if (!message && !file) {
//       return res.status(400).json({ error: "Please send a message or file" });
//     }

//     const messages = [];

//     // Add system prompt only if no file is uploaded
//     if (!file) {
//       messages.push({ role: "system", content: DOCTOR_SYSTEM_PROMPT });
//     }

//     // Add previous chat history
//     messages.push(
//       ...parsedChatHistory.filter((msg) => !(file && msg.role === "system"))
//     );

//     if (file) {
//       let fileContent = "";

//       try {
//         if (file.mimetype === "application/pdf") {
//           fileContent = await extractTextFromPDF(file.buffer);
//         } else if (
//           file.mimetype ===
//           "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//         ) {
//           fileContent = await extractTextFromDOCX(file.buffer);
//         } else if (
//           file.mimetype === "text/plain" ||
//           file.mimetype === "application/rtf" ||
//           file.mimetype === "application/msword"
//         ) {
//           fileContent = file.buffer.toString("utf-8");
//         } else if (file.mimetype.startsWith("image/")) {
//           fileContent = await extractTextFromImage(file.buffer); // Use OCR for images
//         }
//       } catch (error) {
//         console.error("Error parsing file:", error.message);
//         return res.status(400).json({ error: "Failed to parse the uploaded file" });
//       }

//       messages.push({
//         role: "user",
//         content: message
//           ? `${message}\n\nFile content (${file.mimetype}):\n${fileContent.substring(
//               0,
//               2000
//             )}...`
//           : `Please analyze this document (${file.mimetype}):\n${fileContent.substring(
//               0,
//               2000
//             )}...`,
//       });
//     } else {
//       messages.push({
//         role: "user",
//         content: message,
//       });
//     }

//     const model =
//       file && file.mimetype.startsWith("image/")
//         ? "llama-3.2-11b-vision-preview"
//         : "llama3-8b-8192";

//     const response = await axios.post(
//       "https://api.groq.com/openai/v1/chat/completions",
//       {
//         messages,
//         model,
//         temperature: 0.7,
//         max_tokens: 2000,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     res.json({
//       response: response.data.choices[0].message.content,
//       chatHistory: [...parsedChatHistory, { role: "user", content: message }],
//     });
//   } catch (error) {
//     console.error("Error:", error.response?.data || error.message);
//     res.status(500).json({
//       error: error.message || "Sorry, something went wrong",
//       details: error.response?.data || error.message,
//     });
//   }
// });



let history = [];

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Image analysis using OpenRouter API
async function analyzeImage(imageUrl) {
  try {
    // Get the image file path from URL
    const imagePath = path.join(__dirname, imageUrl.replace(`http://localhost:${PORT}`, ''));
    
    // Read the image file and convert to base64
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
    
    // Call OpenRouter API for image analysis
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "meta-llama/llama-4-maverick:free",
        messages: [
          {
            role: "system",
            content: "You are an AI assistant that helps students. Analyze images and provide useful information in a clear, engaging manner."
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this image and explain it in detail." },
              { type: "image_url", image_url: { url: base64Image } }
            ]
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY || 'sk-or-v1-9a4a1c2f5f9a4c2f9a4a1c2f5f9a4c2f9a4a1c2f5f9a4c2f'}`,
          'HTTP-Referer': `http://localhost:${PORT}`,
          'X-Title': 'Student WebMind',
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error with image handling:", error);
    return "There was a problem analyzing the image. Please try again.";
  }
}

// Enhanced chat endpoint with improved response formatting
app.post('/api/chat', upload.single('image'), async (req, res) => {
  const message = req.body.message;
  let imageUrl = null;
  let imageAnalysis = null;

  if (req.file) {
    imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    imageAnalysis = await analyzeImage(imageUrl);
  }

  const userMessage = {
    role: 'user',
    content: message,
    ...(imageUrl && { 
      image: imageUrl,
      imageAnalysis: imageAnalysis 
    }),
  };

  history.push(userMessage);

  try {
    // Include image analysis in the message if available
    const combinedMessage = imageUrl 
      ? `${message}\n[Image Analysis: ${imageAnalysis}]`
      : message;

    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions',
      {
        model: 'mistral-small',
        messages: history.map(({ role, content, image, imageAnalysis }) => ({
          role,
          content: image ? `${content}\n[Image Analysis: ${imageAnalysis}]` : content
        })),
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.MISTRAL_API_KEY || 'h4fxd9juHwPuRpXoqh2pTzMSxzBl0Vzy'}`,
          'Content-Type': 'application/json',
        }
      }
    );

    const assistantReply = response.data.choices[0].message.content;

    history.push({ role: 'assistant', content: assistantReply });
    res.json({ 
      success: true,
      reply: assistantReply, 
      history,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('There was an error processing your request. Please try again later.');
  }
});


// Get conversation history
app.get('/history', (req, res) => {
  res.json({ 
    success: true,
    history,
    message: "Conversation history retrieved successfully"
  });
});

// Cleanup uploaded files periodically
setInterval(() => {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  fs.readdir('uploads/', (err, files) => {
    if (err) return;
    files.forEach(file => {
      const filePath = path.join('uploads/', file);
      const stat = fs.statSync(filePath);
      if (now - stat.mtimeMs > oneHour) {
        fs.unlinkSync(filePath);
      }
    });
  });
}, 60 * 60 * 1000);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});