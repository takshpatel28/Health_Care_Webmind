require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const Tesseract = require('tesseract.js'); // Import Tesseract.js for OCR
const RoleRouter = require('./Routes/role.routes');
const TrustyRouter = require('./Routes/trusty.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Configure multer for file uploads (X-ray analysis)
const xrayStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const xrayFileFilter = (req, file, cb) => {
  if (!file.mimetype.match(/image\/(jpeg|png|jpg)/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const xrayUpload = multer({ 
  storage: xrayStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: xrayFileFilter
});

// Configure file uploads (medical chat)
const medicalChatUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/gif",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "application/rtf",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only images (JPEG, PNG, JPG, GIF), PDFs, and documents (DOC, DOCX, TXT, RTF) are allowed!"
        ),
        false
      );
    }
  },
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use("/api", RoleRouter);
app.use("/api", TrustyRouter);

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

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
Uncertainty: "This requires a [specialist]'s input."

Ethics:
Never diagnose definitively without tests.
For terminal cases: "Let's discuss goals of care with your doctor."
`;

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Error handling middleware for file uploads
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large. Maximum 5MB allowed.' });
    }
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

// X-ray analysis endpoint
app.post('/api/analyze-xray', xrayUpload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No X-ray image uploaded' });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "meta-llama/llama-4-maverick:free",
        messages: [
          {
            role: "system",
            content: "You are a medical diagnostic assistant specialized in radiology. Analyze X-ray images and provide professional findings in medical terminology. Be concise and focus on abnormalities, potential diagnoses, and recommended next steps."
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Please analyze this X-ray image and provide a diagnostic report." },
              { type: "image_url", image_url: { url: imageUrl } }
            ]
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'Medical Diagnosis App'
        }
      }
    );

    res.json({ 
      report: response.data.choices[0].message.content,
      imageUrl 
    });
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    
    // Clean up uploaded file if there was an error
    if (req.file) {
      fs.unlink(path.join('uploads', req.file.filename), (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    
    res.status(500).json({ error: 'Failed to analyze X-ray. Please try again.' });
  }
});

// Text chat endpoint
app.post('/api/medical-chat', async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "meta-llama/llama-4-maverick:free",
        messages: [
          {
            role: "system",
            content: "You are a medical professional assisting doctors with diagnosis. Provide concise, professional answers using medical terminology. Focus on accuracy and clinical relevance."
          },
          ...messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'Medical Diagnosis App'
        }
      }
    );

    res.json({ 
      message: response.data.choices[0].message.content
    });
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to process medical query' });
  }
});

// Extract text from PDF using pdf-parse
async function extractTextFromPDF(pdfBuffer) {
  try {
    const data = await pdfParse(pdfBuffer);
    return data.text;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error("Could not extract text from PDF");
  }
}

// Extract text from DOCX using mammoth
async function extractTextFromDOCX(docxBuffer) {
  try {
    const result = await mammoth.extractRawText({ buffer: docxBuffer });
    return result.value;
  } catch (error) {
    console.error("Error extracting text from DOCX:", error);
    throw new Error("Could not extract text from DOCX");
  }
}

// Extract text from images using Tesseract.js
async function extractTextFromImage(imageBuffer) {
  try {
    const { data: { text } } = await Tesseract.recognize(imageBuffer, "eng", {
      logger: (info) => console.log(info), // Log OCR progress
    });
    return text;
  } catch (error) {
    console.error("Error extracting text from image:", error);
    throw new Error("Could not extract text from image");
  }
}

app.post("/api/chat", medicalChatUpload.single("file"), async (req, res) => {
  try {
    const { message, chatHistory = [] } = req.body;
    const file = req.file;

    // Parse chat history if it's a string
    const parsedChatHistory =
      Array.isArray(chatHistory) ? chatHistory : [];

    if (!message && !file) {
      return res.status(400).json({ error: "Please send a message or file" });
    }

    const messages = [];

    // Add system prompt only if no file is uploaded
    if (!file) {
      messages.push({ role: "system", content: DOCTOR_SYSTEM_PROMPT });
    }

    // Add previous chat history
    messages.push(
      ...parsedChatHistory.filter((msg) => !(file && msg.role === "system"))
    );

    if (file) {
      let fileContent = "";

      try {
        if (file.mimetype === "application/pdf") {
          fileContent = await extractTextFromPDF(file.buffer);
        } else if (
          file.mimetype ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          fileContent = await extractTextFromDOCX(file.buffer);
        } else if (
          file.mimetype === "text/plain" ||
          file.mimetype === "application/rtf" ||
          file.mimetype === "application/msword"
        ) {
          fileContent = file.buffer.toString("utf-8");
        } else if (file.mimetype.startsWith("image/")) {
          fileContent = await extractTextFromImage(file.buffer); // Use OCR for images
        }
      } catch (error) {
        console.error("Error parsing file:", error.message);
        return res.status(400).json({ error: "Failed to parse the uploaded file" });
      }

      messages.push({
        role: "user",
        content: message
          ? `${message}\n\nFile content (${file.mimetype}):\n${fileContent.substring(
              0,
              2000
            )}...`
          : `Please analyze this document (${file.mimetype}):\n${fileContent.substring(
              0,
              2000
            )}...`,
      });
    } else {
      messages.push({
        role: "user",
        content: message,
      });
    }

    const model =
      file && file.mimetype.startsWith("image/")
        ? "llama-3.2-11b-vision-preview"
        : "llama3-8b-8192";

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        messages,
        model,
        temperature: 0.7,
        max_tokens: 2000,
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      response: response.data.choices[0].message.content,
      chatHistory: [...parsedChatHistory, { role: "user", content: message }],
    });
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.status(500).json({
      error: error.message || "Sorry, something went wrong",
      details: error.response?.data || error.message,
    });
  }
});

// Clean up old files periodically
setInterval(() => {
  const directory = 'uploads';
  const threshold = 24 * 60 * 60 * 1000; // 24 hours

  fs.readdir(directory, (err, files) => {
    if (err) return console.error('Error reading uploads directory:', err);

    files.forEach(file => {
      const filePath = path.join(directory, file);
      fs.stat(filePath, (err, stat) => {
        if (err) return console.error('Error getting file stats:', err);

        const now = new Date().getTime();
        const fileAge = now - stat.mtime.getTime();

        if (fileAge > threshold) {
          fs.unlink(filePath, err => {
            if (err) console.error('Error deleting old file:', err);
            else console.log('Deleted old file:', file);
          });
        }
      });
    });
  });
}, 12 * 60 * 60 * 1000); // Run every 12 hours

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
