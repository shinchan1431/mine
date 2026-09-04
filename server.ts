import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI client with required header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", assistant: "Mine", timestamp: new Date().toISOString() });
});

// AI Chat with tool calling and context awareness
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, context, userPrompt } = req.body;

    const userName = context?.userName || "Shinsu";
    const tasks = context?.tasks || [];
    const reminders = context?.reminders || [];
    const schedule = context?.schedule || [];
    const emails = context?.emails || [];
    const memories = context?.memories || [];

    const systemInstruction = `
You are "Mine", a proactive, highly competent personal AI assistant dedicated to ${userName}.
You operate on the core principle: "AI thinks and proposes; ${userName} decides and approves."

Key Personality & Guidelines:
1. Address the user naturally as ${userName}.
2. You are organized, clear, friendly, and structured. Use short paragraphs and concise bullet points.
3. You have direct awareness of ${userName}'s current tasks, reminders, schedule, emails, and personal memories provided in context.
4. When asked to perform actions, you can propose and trigger tools:
   - create_task: to add a new task with title, priority (high/medium/low), category, due date.
   - complete_task: to mark a task as completed.
   - create_reminder: to schedule a reminder.
   - add_schedule_event: to block time or add a calendar item.
   - draft_email: to draft a reply to an email (DO NOT claim you sent it, inform ${userName} that you've prepared the draft for their approval).
   - save_memory: when ${userName} shares a key preference, fact, routine, or project goal.
   - suggest_briefing: when asked for morning or evening overview.
5. SENSITIVE ACTIONS (like sending an email or deleting tasks): You must NEVER pretend you already sent an email autonomously. You draft the email and politely present it for approval.
6. When ${userName} asks "What should I do today?", analyze their high-priority tasks, upcoming schedule events, and unread urgent emails to provide an intelligent recommendation.

Current User Context:
- Memories stored: ${JSON.stringify(memories)}
- Pending tasks: ${JSON.stringify(tasks.filter((t: any) => t.status === "pending"))}
- Reminders: ${JSON.stringify(reminders)}
- Today's schedule: ${JSON.stringify(schedule)}
- Recent emails: ${JSON.stringify(emails.slice(0, 5).map((e: any) => ({ id: e.id, sender: e.sender, subject: e.subject, category: e.category, requiresResponse: e.requiresResponse })))}
`;

    // Tool declarations
    const tools = [
      {
        functionDeclarations: [
          {
            name: "create_task",
            description: "Create a new task in the user's task list.",
            parameters: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "Title of the task" },
                priority: {
                  type: Type.STRING,
                  enum: ["high", "medium", "low"],
                  description: "Priority level of the task",
                },
                category: {
                  type: Type.STRING,
                  enum: ["work", "study", "project", "personal"],
                  description: "Task category",
                },
                dueAt: { type: Type.STRING, description: "Due date/time description (e.g. 'Today, 10:00 PM' or ISO string)" },
                estimatedMinutes: { type: Type.INTEGER, description: "Estimated duration in minutes" },
              },
              required: ["title", "priority"],
            },
          },
          {
            name: "complete_task",
            description: "Mark a task as completed by its ID or exact title match.",
            parameters: {
              type: Type.OBJECT,
              properties: {
                taskTitleOrId: { type: Type.STRING, description: "Title or ID of the task to complete" },
              },
              required: ["taskTitleOrId"],
            },
          },
          {
            name: "create_reminder",
            description: "Create a reminder with a specific date/time alert.",
            parameters: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "What to remind the user about" },
                remindAt: { type: Type.STRING, description: "Time to remind (e.g. 'Tomorrow at 9:00 AM' or 'in 10 minutes')" },
              },
              required: ["title", "remindAt"],
            },
          },
          {
            name: "add_schedule_event",
            description: "Add a scheduled event or time block to today's or a future schedule.",
            parameters: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "Event title" },
                startTime: { type: Type.STRING, description: "Start time (e.g. '14:00' or '2:00 PM')" },
                endTime: { type: Type.STRING, description: "End time (e.g. '15:30' or '3:30 PM')" },
                category: {
                  type: Type.STRING,
                  enum: ["meeting", "work", "break", "study", "review"],
                  description: "Category of the schedule event",
                },
              },
              required: ["title", "startTime", "endTime"],
            },
          },
          {
            name: "draft_email",
            description: "Draft an email reply for user review. Does NOT send until user confirms.",
            parameters: {
              type: Type.OBJECT,
              properties: {
                emailId: { type: Type.STRING, description: "ID of the email to reply to (if known)" },
                recipient: { type: Type.STRING, description: "Recipient email or name" },
                subject: { type: Type.STRING, description: "Subject line" },
                body: { type: Type.STRING, description: "Proposed draft response text" },
              },
              required: ["recipient", "subject", "body"],
            },
          },
          {
            name: "save_memory",
            description: "Save a persistent fact, preference, routine, or project goal about the user.",
            parameters: {
              type: Type.OBJECT,
              properties: {
                type: {
                  type: Type.STRING,
                  enum: ["preference", "fact", "instruction", "project", "routine"],
                  description: "Type of memory",
                },
                content: { type: Type.STRING, description: "Information to remember" },
                importance: {
                  type: Type.STRING,
                  enum: ["high", "medium", "low"],
                  description: "Importance level",
                },
              },
              required: ["type", "content"],
            },
          },
        ],
      },
    ];

    // Build chat history for Gemini
    const contents: any[] = [];
    if (Array.isArray(messages)) {
      for (const m of messages.slice(-10)) {
        contents.push({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        });
      }
    }

    // Add current prompt
    if (userPrompt) {
      contents.push({
        role: "user",
        parts: [{ text: userPrompt }],
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: contents.length > 0 ? contents : [{ role: "user", parts: [{ text: "Hello Mine!" }] }],
      config: {
        systemInstruction,
        temperature: 0.7,
        tools,
      },
    });

    const responseText = response.text || "";
    const functionCalls = response.functionCalls || [];

    res.json({
      text: responseText,
      toolCalls: functionCalls.map((fc: any) => ({
        id: fc.id || Math.random().toString(36).substring(7),
        name: fc.name,
        args: fc.args,
      })),
    });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({
      error: error.message || "Failed to generate response from Mine",
      fallbackText: "I encountered a hiccup processing that request, but I'm here. How can I assist you with your tasks or schedule?",
    });
  }
});

// AI Email Summarizer & Triage
app.post("/api/summarize-email", async (req, res) => {
  try {
    const { subject, sender, body } = req.body;

    const prompt = `Analyze this incoming email for a user named Shinsu:
Sender: ${sender}
Subject: ${subject}
Body: ${body}

Provide a JSON output matching this schema:
{
  "category": "urgent" | "important" | "normal" | "promotional" | "personal",
  "importanceScore": number (1 to 10),
  "aiSummary": "1-2 sentence crisp executive summary",
  "requiresResponse": boolean,
  "detectedDeadline": "string or null if any deadline/date is mentioned",
  "suggestedReply": "A polite, concise draft reply ready for Shinsu to review"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/summarize-email:", error);
    res.status(500).json({
      error: error.message || "Email analysis failed",
      category: "normal",
      importanceScore: 5,
      aiSummary: "Could not auto-summarize at this time.",
      requiresResponse: false,
      detectedDeadline: null,
      suggestedReply: "",
    });
  }
});

// Daily Briefing (Morning / Evening)
app.post("/api/briefing", async (req, res) => {
  try {
    const { type = "morning", context } = req.body;
    const userName = context?.userName || "Shinsu";

    const prompt = `Generate a structured ${type} briefing for ${userName}.
Current Context:
- Tasks: ${JSON.stringify(context?.tasks || [])}
- Schedule today: ${JSON.stringify(context?.schedule || [])}
- Reminders: ${JSON.stringify(context?.reminders || [])}
- Emails: ${JSON.stringify(context?.emails || [])}

Provide a JSON response with:
{
  "greeting": "Personal greeting matching time of day",
  "summaryText": "Crisp overview of the day or evening wrap-up",
  "topPriorities": ["Item 1", "Item 2", "Item 3"],
  "scheduleHighlights": ["9:00 AM - ...", "2:00 PM - ..."],
  "actionAdvice": "Proactive suggestion (e.g. review reply draft, take a break at 1 PM, move unfinished tasks to tomorrow)",
  "quote": "Short inspiring quote or focus motto"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/briefing:", error);
    res.status(500).json({
      error: error.message || "Briefing failed",
      greeting: `Good ${req.body.type === "evening" ? "evening" : "morning"}, Shinsu!`,
      summaryText: "You have several tasks and agenda items lined up today.",
      topPriorities: ["Review high-priority tasks", "Check pending email drafts", "Keep up with your schedule"],
      scheduleHighlights: ["Check your schedule timeline for updates"],
      actionAdvice: "Take things step-by-step. I'm right here to assist.",
      quote: "Focus on progress, not perfection.",
    });
  }
});

// Setup Vite middleware in dev or static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Mine Assistant server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
