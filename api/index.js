import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Gemini API Setup
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Middleware
app.use(cors());
app.use(express.json());

// API Route for Chatbot
app.post("/ask", async (req, res) => {
    try {
        const userQuery = req.body.question;
        if (!userQuery) return res.status(400).json({ error: "Question is required" });

        const result = await model.generateContent(userQuery);
        const botReply = result.response.text();

        res.json({ reply: botReply });
    } catch (error) {
        res.status(500).json({ error: "Something went wrong", details: error.message });
    }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
