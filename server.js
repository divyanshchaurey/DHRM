require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

// Serve static website files from the current folder
app.use(express.static(__dirname));

// API Proxy route for Gemini
app.post('/api/chat', async (req, res) => {
    const { message, focus } = req.body;
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'Gemini API Key is not configured on the server.' });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;
    const userFocus = focus || 'general wisdom';

    const prompt = `You are the "Divine Helper" (DHRM), an AI assistant grounded in ancient Hindu wisdom (Vedas, Upanishads, Puranas, Bhagavad Gita, Ramayana, Mahabharata, etc.).
The user has indicated they are currently seeking: ${userFocus}.
The user will ask for advice or share a struggle.
You MUST respond with a valid JSON object containing exactly these four keys:
1. "solution": A concise, practical solution based on Hindu wisdom.
2. "shlok": The exact Sanskrit shloka or mantra (in Sanskrit script).
3. "reference": The source of the shlok (e.g., 'Bhagavad Gita Chapter 2, Verse 47').
4. "explanation": An explanation of the shlok in Hindi (Devanagari script).

Ensure the response is ONLY valid JSON, without any markdown blocks around it.

User says: "${message}"`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!response.ok) {
            throw new Error(`Google API returned status ${response.status}`);
        }

        const data = await response.json();
        let text = data.candidates[0].content.parts[0].text;
        
        // Clean up markdown blocks if any
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(text);

        res.json({
            solution: parsed.solution || "",
            shlok: parsed.shlok || "",
            reference: parsed.reference || "",
            explanation: parsed.explanation || ""
        });
    } catch (error) {
        console.error("Proxy Server Error:", error);
        res.status(500).json({
            solution: 'That is a deep question. Stay anchored in right action and inner steadiness.', 
            shlok: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।',
            reference: 'Bhagavad Gita 2.47',
            explanation: 'तुम्हें अपना कर्म करने का अधिकार है, किन्तु कर्म के फलों के तुम अधिकारी नहीं हो।'
        });
    }
});

// Load and cache Gita data on startup via require for serverless bundler compatibility
let gitaChapters = [];
let gitaVerses = [];
let gitaTranslations = [];

try {
    gitaChapters = require('./data/chapters.json');
    gitaVerses = require('./data/verses.json');
    gitaTranslations = require('./data/translations.json');
    console.log(`Gita data loaded: ${gitaChapters.length} chapters, ${gitaVerses.length} verses, ${gitaTranslations.length} translations.`);
} catch (err) {
    console.error("Error loading local Gita data:", err);
}

// Gita API Endpoints
app.get('/api/gita/chapters', (req, res) => {
    res.json(gitaChapters);
});

app.get('/api/gita/chapters/:chapNum/verses', (req, res) => {
    const chapNum = parseInt(req.params.chapNum);
    const verses = gitaVerses.filter(v => v.chapter_number === chapNum);
    res.json(verses);
});

app.get('/api/gita/chapters/:chapNum/verses/:verseNum', (req, res) => {
    const chapNum = parseInt(req.params.chapNum);
    const verseNum = parseInt(req.params.verseNum);
    
    const verse = gitaVerses.find(v => v.chapter_number === chapNum && v.verse_number === verseNum);
    if (!verse) {
        return res.status(404).json({ error: 'Verse not found' });
    }
    
    // Find translations matching this verse_id
    const translations = gitaTranslations.filter(t => t.verse_id === verse.id);
    
    res.json({
        ...verse,
        translations
    });
});

// Fallback for SPA routing if needed (optional)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`DHRM server is securely running on http://localhost:${PORT}`);
    });
}

module.exports = app;
