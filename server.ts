import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini API client on the server
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for non-blocking timeout on Gemini calls
async function callGeminiWithTimeout<T>(promise: Promise<T>, timeoutMs = 3000): Promise<T | null> {
  let timeoutHandle: NodeJS.Timeout | null = null;
  const timeoutPromise = new Promise<null>((resolve) => {
    timeoutHandle = setTimeout(() => resolve(null), timeoutMs);
  });
  try {
    const res = await Promise.race([promise, timeoutPromise]);
    return res as T | null;
  } catch (err) {
    console.warn('Gemini call error or timeout:', err);
    return null;
  } finally {
    if (timeoutHandle) clearTimeout(timeoutHandle);
  }
}

// Endpoint to generate 2000s cyber glam nail consultations & bespoke architecture
app.post('/api/gemini/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'A prompt or nail inspiration concept is required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please check the Secrets panel in AI Studio.',
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        systemInstruction: `You are the lead master nail architect and cyber diva artist at Nails by Soa (NBS Nails) — an elite turn-of-the-millennium Y2K high-fashion nail studio specializing in bespoke 3D sculpting, liquid chrome finishes, cyber glam aesthetics, holographic inlays, and luxury jewel charms.
Respond with high-voltage 2000s cyber glam energy, stylish terminology, and retro ASCII/sparkle accents (✦, ✨, 💿, 💖, ★).

Structure your output cleanly with markdown headers:
### 💿 SET CODENAME & VIBE CHECK
Name the bespoke set with an iconic Y2K cyber name (e.g., "CYBER OPAL LIQUID CHROME 3000 // VIP EDITION") and describe the aesthetic mood.

### 💅 3D NAIL ARCHITECTURE & SCULPTING SPECS
- **Shape & Length:** (e.g., Extreme Stiletto, Tapered Duck, Sculpted Square, or Razor Coffin)
- **Base Material & Texture:** (e.g., Molten mirror chrome, holographic jelly, cat-eye magnetic shimmer)
- **Bespoke 3D Sculpted Charms:** (e.g., Hand-sculpted cyber hearts, chrome spikes, piercing hoops, bubble domes)
- **Airbrush & Cyber Linework:** (e.g., Y2K airbrushed aura gradients, cyber-tribal lines, silver stars)

### 🎨 COLOR CHEMISTRY PALETTE
List 3-4 exact high-voltage colors (e.g., Hot Electric Magenta #FF007F, Cyber Cyan #00F0FF, Molten Mirror Silver #E0E5EC, Deep Obsidian Noir #0E0712).

### 🎧 VIP STUDIO SESSION SOUNDTRACK
Recommend 2-3 iconic 2000s cyber-pop / club tracks to play during the application session.

### 🔒 RETENTION & VIP CARE PROTOCOL
Give 2-3 punchy, humorous, diva-level rules for keeping the 3D set flawless and intact for 4+ weeks.`,
      },
    });

    const text = response.text || '';
    return res.json({ result: text });
  } catch (err: any) {
    console.error('Gemini API Error:', err);
    return res.status(500).json({
      error: err?.message || 'Failed to generate nail architecture from Gemini API.',
    });
  }
});

// In-memory bookings store
interface BookingRecord {
  id: string;
  prestation: string;
  depose: boolean;
  date: string;
  hour: string;
  slot: string;
  instagram: string;
  inspirationNote?: string;
  hasInspirationPhoto?: boolean;
  createdAt: string;
  status: 'PENDING_DM' | 'CONFIRMED';
}

const bookingsStore: BookingRecord[] = [
  {
    id: 'SOA-OCT-2116',
    prestation: 'Gel-X Sur-Mesure (30€-50€)',
    depose: false,
    date: 'Mercredi 21 Octobre',
    hour: '16h00',
    slot: 'Mercredi 21 Octobre à 16h00',
    instagram: 'y2k_babe_paris',
    createdAt: new Date().toISOString(),
    status: 'CONFIRMED',
  },
];

// Endpoint to create a reservation and generate Instagram DM link + AI advice
app.post('/api/booking', async (req, res) => {
  try {
    const {
      prestation = 'Gel-X Sur-Mesure (30€-50€)',
      depose = false,
      date = 'Mercredi 21 Octobre',
      hour = '16h00',
      slot = 'Mercredi 21 Octobre à 16h00',
      instagram = 'babe',
      inspirationNote = '',
      hasInspirationPhoto = false,
    } = req.body;

    const cleanInsta = String(instagram).replace('@', '').trim() || 'babe';
    const cleanPresta = String(prestation).trim();
    const cleanSlot = String(slot).trim();
    const hasDeposeText = depose ? ' (avec Dépose +5€)' : '';

    const bookingId = `NBS-OCT-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking: BookingRecord = {
      id: bookingId,
      prestation: cleanPresta,
      depose: Boolean(depose),
      date: String(date),
      hour: String(hour),
      slot: cleanSlot,
      instagram: `@${cleanInsta}`,
      inspirationNote: String(inspirationNote || ''),
      hasInspirationPhoto: Boolean(hasInspirationPhoto),
      createdAt: new Date().toISOString(),
      status: 'CONFIRMED',
    };

    bookingsStore.unshift(newBooking);

    // Default fallback template in case AI is disabled or fails
    let messageText =
      `Coucou Soa ! 💕 Je souhaite réserver pour :\n\n` +
      `• Prestation : ${cleanPresta}${hasDeposeText}\n` +
      `• Créneau : ${cleanSlot}\n` +
      `• Mon Instagram : @${cleanInsta}\n` +
      `• Réf Réservation : ${bookingId}\n` +
      (inspirationNote ? `• Note inspiration : ${inspirationNote}\n` : '') +
      `\nJe t'envoie mon modèle d'inspiration en photo ! ✨`;

    let aiPrescription = '';

    // Generate complete personalized message recap with Gemini AI
    if (process.env.GEMINI_API_KEY) {
      try {
        const aiPrompt = `Rédige le message Instagram DM complet, chaleureux, chic et pétillant (vibe Y2K McBling) qu'une cliente nommée @${cleanInsta} va envoyer directement à Soa (@nailsbysoa) pour finaliser sa réservation.
Détails obligatoires à inclure dans le récapitulatif :
- Salutation amicale et bienveillante à Soa
- Prestation choisie : ${cleanPresta}${hasDeposeText}
- Créneau réservé : ${cleanSlot}
- Pseudo Instagram : @${cleanInsta}
- Référence de réservation : ${bookingId}
${inspirationNote ? `- Modèle / inspiration : ${inspirationNote}` : '- Inspiration : modèle photo joint ci-dessous'}
- Une phrase enthousiaste mentionnant l'envoi de la photo d'inspiration
- Un court conseil ou clin d'œil Y2K de diva

IMPORTANT : Rends UNIQUEMENT le texte exact du message prêt à être envoyé par la cliente, sans guillemets au début/fin, sans commentaire ni préambule.`;

        const aiRes = await callGeminiWithTimeout(
          ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: aiPrompt,
            config: {
              thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            },
          }),
          3500
        );

        const generatedMsg = aiRes?.text?.trim();
        if (generatedMsg && generatedMsg.length > 20) {
          messageText = generatedMsg;
          aiPrescription = generatedMsg;
        }
      } catch (err) {
        console.warn('AI DM recap generation non-blocking error:', err);
      }
    }

    const igUrl = `https://ig.me/m/nailsbysoa?text=${encodeURIComponent(messageText)}`;

    return res.json({
      success: true,
      bookingId,
      booking: newBooking,
      messageText,
      igUrl,
      aiPrescription,
    });
  } catch (err: any) {
    console.error('Booking API error:', err);
    return res.status(500).json({ error: err?.message || 'Erreur lors de la réservation' });
  }
});

// VIP Pass in-memory store
interface VipPassRecord {
  id: string;
  pseudo: string;
  email: string;
  serial: string;
  createdAt: string;
  aiWelcomeNote?: string;
}

const vipPassStore: VipPassRecord[] = [
  {
    id: 'PASS-8829',
    pseudo: 'CHLOÉ MCBLING',
    email: 'chloe@studio-liege.com',
    serial: '#SOA-8829-VIP',
    createdAt: new Date().toISOString(),
    aiWelcomeNote: 'Bienvenue au club VIP The SOA Drop ! 💖 Accès prioritaire 24h avant chaque drop.',
  },
];

// Endpoint to generate a VIP membership pass
app.post('/api/vip-pass', async (req, res) => {
  try {
    const { pseudo = 'CHLOÉ MCBLING', email = '' } = req.body;
    const cleanPseudo = String(pseudo).trim().toUpperCase() || 'VIP QUEEN';
    const randomSerial = `#SOA-${Math.floor(1000 + Math.random() * 9000)}-VIP`;

    let aiWelcomeNote = `Félicitations ${cleanPseudo} ! ✨ Ton Pass VIP Digital Nails By Soa est actif. Tu as désormais un accès exclusif et prioritaire à nos capsules d'exception ! 💿💖`;

    if (process.env.GEMINI_API_KEY) {
      try {
        const passPrompt = `Rédige un message court et ultra glamour de bienvenue pour la nouvelle membre VIP ${cleanPseudo} qui rejoint le club 'The SOA Drop' (haute onglerie McBling Y2K à Liège & Paris). 2 phrases max, pétillantes avec emojis (✦, 💖, 💿).`;
        const aiRes = await callGeminiWithTimeout(
          ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: passPrompt,
            config: {
              thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            },
          }),
          2500
        );
        if (aiRes?.text?.trim()) {
          aiWelcomeNote = aiRes.text.trim();
        }
      } catch (e) {
        console.warn('AI VIP pass generation note error:', e);
      }
    }

    const passRecord: VipPassRecord = {
      id: `PASS-${randomSerial.replace('#SOA-', '').replace('-VIP', '')}`,
      pseudo: cleanPseudo,
      email: String(email).trim(),
      serial: randomSerial,
      createdAt: new Date().toISOString(),
      aiWelcomeNote,
    };

    vipPassStore.unshift(passRecord);

    return res.json({
      success: true,
      pass: passRecord,
      serial: randomSerial,
      pseudo: cleanPseudo,
      aiWelcomeNote,
    });
  } catch (err: any) {
    console.error('VIP Pass error:', err);
    return res.status(500).json({ error: err?.message || 'Erreur pass VIP' });
  }
});

// Endpoint to list VIP passes
app.get('/api/vip-passes', (req, res) => {
  res.json({ passes: vipPassStore });
});

// Endpoint to list bookings
app.get('/api/bookings', (req, res) => {
  res.json({ bookings: bookingsStore });
});


// Full-stack Vite integration
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
} else {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT} (0.0.0.0)`);
});
