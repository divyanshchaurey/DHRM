import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaskSchema, insertQuoteSchema, insertBookSchema, insertContactSchema } from "@shared/schema";
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function registerRoutes(app: Express): Promise<Server> {
  // Task Management Routes
  app.get("/api/tasks", async (req, res) => {
    try {
      const tasks = await storage.getTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const validated = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(validated);
      res.json(task);
    } catch (error) {
      res.status(400).json({ error: "Invalid task data" });
    }
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const task = await storage.updateTask(id, req.body);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteTask(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete task" });
    }
  });

  // User Settings Routes (for streak tracking)
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getUserSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.patch("/api/settings", async (req, res) => {
    try {
      const settings = await storage.updateUserSettings(req.body);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  // Quotes Routes
  app.get("/api/quotes/random", async (req, res) => {
    try {
      const quote = await storage.getRandomQuote();
      if (!quote) {
        return res.status(404).json({ error: "No quotes available" });
      }
      res.json(quote);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch quote" });
    }
  });

  app.get("/api/quotes", async (req, res) => {
    try {
      const quotes = await storage.getQuotes();
      res.json(quotes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch quotes" });
    }
  });

  app.post("/api/quotes", async (req, res) => {
    try {
      const validated = insertQuoteSchema.parse(req.body);
      const quote = await storage.createQuote(validated);
      res.json(quote);
    } catch (error) {
      res.status(400).json({ error: "Invalid quote data" });
    }
  });

  // Books Routes
  app.get("/api/books", async (req, res) => {
    try {
      const books = await storage.getBooks();
      res.json(books);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch books" });
    }
  });

  app.get("/api/books/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const book = await storage.getBook(id);
      if (!book) {
        return res.status(404).json({ error: "Book not found" });
      }
      res.json(book);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch book" });
    }
  });

  app.post("/api/books", async (req, res) => {
    try {
      const validated = insertBookSchema.parse(req.body);
      const book = await storage.createBook(validated);
      res.json(book);
    } catch (error) {
      res.status(400).json({ error: "Invalid book data" });
    }
  });

  // Contact Form Route
  app.post("/api/contact", async (req, res) => {
    try {
      const validated = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validated);
      res.json(contact);
    } catch (error) {
      res.status(400).json({ error: "Invalid contact data" });
    }
  });

  // Gemini AI Chat Route
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // System prompt to ensure responses include Sanskrit shlokas
      const systemPrompt = `You are a Vedic philosophical coach specializing in Hindu scriptures and wisdom. 
When responding to questions, ALWAYS include a relevant Sanskrit shloka with:
1. The Sanskrit text (in Devanagari script)
2. The English translation/meaning
3. The specific reference (e.g., "Bhagavad Gita, Chapter 2, Verse 47")

Format your response as JSON with this structure:
{
  "content": "Your philosophical guidance here",
  "shloka": {
    "sanskrit": "Sanskrit text here",
    "meaning": "English translation here",
    "reference": "Source reference here"
  }
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
        },
        contents: message,
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty response from AI");
      }

      const parsedResponse = JSON.parse(responseText);
      res.json(parsedResponse);
    } catch (error) {
      console.error("Gemini AI error:", error);
      res.status(500).json({ 
        error: "Failed to generate response",
        content: "I apologize, but I'm having trouble connecting to provide guidance at this moment. Please try again.",
        shloka: {
          sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।",
          meaning: "You have the right to perform your prescribed duties, but you are not entitled to the fruits of your actions.",
          reference: "Bhagavad Gita, Chapter 2, Verse 47"
        }
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
