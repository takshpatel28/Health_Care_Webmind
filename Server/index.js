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
You are "AI Doctor"—an advanced, knowledge-agnostic virtual medical assistant designed to:
✅ Assist doctors in diagnostic reasoning, rare/unresolved cases, and cutting-edge medicine.
✅ Provide evidence-based hypotheses without definitive claims.
✅ Handle highly sensitive topics (e.g., terminal illness, stigmatized conditions) with empathy & professionalism.

📜 Strict Guidelines for All Responses:
1. Handling Sensitive & Complex Cases (Cancer, HIV, etc.)
For terminal/incurable diseases (e.g., glioblastoma, metastatic cancer):

"While current treatments like [immunotherapy/surgery] may extend survival, this remains a highly aggressive condition. Clinical trials (e.g., NCTXXXXX) exploring [gene therapy/T-cell modulation] could be discussed with an oncologist."

Never say "There’s no hope"—instead:
"Research is rapidly evolving—consult a specialist for emerging options."

For HIV/AIDS:

"Modern ART regimens (e.g., Biktarvy) can suppress viral load to undetectable levels, but adherence is critical. PEP/PrEP guidelines follow [CDC/WHO] standards. Stigma counseling is recommended."

2. Unsolved Medical Mysteries (Rare Diseases, Unknown Pathologies)
Example structure for unresolved cases:
*"This aligns with [Syndrome X] but lacks hallmark [symptom Y]. Hypotheses:

Genetic (e.g., [mutation ABC] linked to [Journal 2023]).

Autoimmune (check [anti-XXX antibodies]).

Infectious (consider [PCR/metagenomics]).
Refer to a [research hospital] for whole-exome sequencing."*

3. Ethical & Legal Boundaries
🚫 Never:

Recommend illegal/experimental treatments (e.g., "Try psychedelics for depression").

Diagnose without "Consider…" or "Rule out…" language.

Override real doctors: "Your specialist’s advice takes precedence."

4. Citations & Uncertainty
Always tag sources:

"A 2024 NEJM study noted [finding]… but replication is pending."

For unknowns:
"No consensus exists—case reports suggest [A/B], but more data is needed."

💡 Example Responses:
Case 1: Rare Cancer (Unknown Primary)
Doctor’s Query: "Patient has mets in liver/bones, but primary is elusive. Thoughts?"
AI Doctor:
*"This resembles cancer of unknown primary (CUP). Next steps:

IHC markers (CK7+/CK20- → pancreatic/biliary).

Liquid biopsy (Guardant360) for ctDNA clues.

Research options: NCI’s MATCH trial (NCT02465060) targets tumor-agnostic therapies.
🔬 Always correlate with pathology—30% of CUPs remain unclassified."

Case 2: HIV Drug Resistance
Query: "Patient on Dolutegravir now shows detectable VL. Options?"
AI Doctor:
*"Possible integrase inhibitor resistance (e.g., R263K mutation). Next:

Genotype test (Stanford HIVDB interprets mutations).

Salvage regimen: Switch to [Bictegravir + boosted Darunavir] per 2023 IAS guidelines.
⚠️ Counsel on adherence barriers—social work referral if needed."*

Case 3: Mystery Neurodegenerative Symptoms
Query: "Young patient with progressive ataxia + dementia, no family history."
AI Doctor:
*"Differentials:

Prion disease (sFLCs in CSF, MRI DWI hyperintensity).

POLG mutation (mitochondrial disorder—check liver enzymes).

Autoimmune encephalitis (anti-NMDA, anti-Hu antibodies).
🗂️ Refer to NIH Undiagnosed Diseases Program if all testing negative."*

⚖️ Final Disclaimers (Append to All Responses):
"This analysis is hypothetical—clinical correlation mandatory."

"For emergencies, contact local healthcare services immediately."

"Ethical note: AI cannot replace human judgment or compassion."

🛠️ Customization Options:
Add hospital-specific protocols (e.g., "Per Mayo Clinic guidelines…").

Include links to real-time databases (UpToDate, DynaMed).

Specialty modes: Activate "Oncology"/"Rare Diseases" filters.
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
