import { Task, Reminder, ScheduleEvent, Email, MemoryItem, AuditLogEntry, UserSettings } from "../types";

export const initialUserSettings: UserSettings = {
  userName: "Shinsu",
  assistantName: "Mine",
  ttsEnabled: false,
  morningBriefingTime: "08:30",
  eveningBriefingTime: "22:00",
  enableSoundAlerts: true,
};

export const initialTasks: Task[] = [
  {
    id: "task-1",
    title: "Finish SIH documentation & architecture flow",
    description: "Prepare the complete system architecture diagram and API integration guidelines.",
    priority: "high",
    status: "pending",
    category: "project",
    dueAt: "Today, 10:00 PM",
    estimatedMinutes: 90,
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-2",
    title: "Review professor's email & submit milestone report",
    description: "Submit college project milestone report before 5:00 PM deadline.",
    priority: "high",
    status: "pending",
    category: "study",
    dueAt: "Tomorrow, 5:00 PM",
    estimatedMinutes: 45,
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-3",
    title: "Practice Python algorithms & pgvector querying",
    description: "Solve 2 Leetcode questions and practice vector search similarity matching.",
    priority: "medium",
    status: "pending",
    category: "study",
    dueAt: "Saturday, 4:00 PM",
    estimatedMinutes: 60,
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-4",
    title: "Set up Gemini tool function schema in Mine",
    description: "Ensure tool definitions for tasks, emails, and schedule are robust.",
    priority: "medium",
    status: "completed",
    category: "project",
    dueAt: "Yesterday",
    estimatedMinutes: 40,
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  },
  {
    id: "task-5",
    title: "Organize digital notes & clear browser tabs",
    description: "Weekly workspace cleanup and routine reset.",
    priority: "low",
    status: "pending",
    category: "personal",
    dueAt: "Sunday, 8:00 PM",
    estimatedMinutes: 20,
    createdAt: new Date().toISOString(),
  },
];

export const initialReminders: Reminder[] = [
  {
    id: "rem-1",
    title: "College project deadline submission check",
    taskId: "task-2",
    remindAt: "Tomorrow at 9:00 AM",
    repeatRule: "none",
    status: "pending",
    createdAt: new Date().toISOString(),
  },
  {
    id: "rem-2",
    title: "SIH documentation focus block starting",
    taskId: "task-1",
    remindAt: "Today at 8:00 PM",
    repeatRule: "none",
    status: "pending",
    createdAt: new Date().toISOString(),
  },
  {
    id: "rem-3",
    title: "Evening daily wrap-up and task rollover",
    remindAt: "Daily at 10:00 PM",
    repeatRule: "daily",
    status: "pending",
    createdAt: new Date().toISOString(),
  },
];

export const initialSchedule: ScheduleEvent[] = [
  {
    id: "sch-1",
    title: "Morning Review & Email Triage",
    startTime: "09:00",
    endTime: "10:00",
    category: "review",
    date: new Date().toISOString().split("T")[0],
    description: "Check inbox with Mine, review daily high-priority items.",
  },
  {
    id: "sch-2",
    title: "Project Development (Mine AI Assistant)",
    startTime: "10:00",
    endTime: "12:30",
    category: "work",
    date: new Date().toISOString().split("T")[0],
    description: "Core tool calling engine & UI polish.",
  },
  {
    id: "sch-3",
    title: "Lunch & Mid-day Recharge",
    startTime: "13:00",
    endTime: "14:00",
    category: "break",
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "sch-4",
    title: "SIH Hackathon Documentation Sprint",
    startTime: "15:00",
    endTime: "17:00",
    category: "study",
    date: new Date().toISOString().split("T")[0],
    description: "Finalize architecture diagrams and technical documentation.",
  },
  {
    id: "sch-5",
    title: "Team Sync: Presentation Slides",
    startTime: "20:00",
    endTime: "20:45",
    category: "meeting",
    date: new Date().toISOString().split("T")[0],
    description: "Walkthrough slides 4-8 with Aarav.",
  },
  {
    id: "sch-6",
    title: "Evening Briefing & Daily Wrap-Up",
    startTime: "22:00",
    endTime: "22:30",
    category: "review",
    date: new Date().toISOString().split("T")[0],
    description: "Review accomplished goals with Mine and plan tomorrow.",
  },
];

export const initialEmails: Email[] = [
  {
    id: "email-1",
    sender: "Prof. Kenneth Wright",
    senderEmail: "prof.wright@university.edu",
    recipient: "shinsu@university.edu",
    subject: "College Project Milestone Report Submission Deadline",
    snippet: "Dear Shinsu, please ensure your project milestone report is submitted by tomorrow...",
    body: `Dear Shinsu,

Please ensure your college project milestone report and system architecture diagrams are uploaded to the academic portal by tomorrow, 5:00 PM. We will review all submitted documentation with the evaluation panel this Friday.

Let me know if you encounter any difficulties or have questions regarding the submission format.

Best regards,
Prof. Kenneth Wright
Academic Coordinator, Dept. of Computer Science`,
    receivedAt: "Today, 8:15 AM",
    isRead: false,
    importance: "urgent",
    category: "College",
    aiSummary: "Project milestone report submission deadline is tomorrow at 5:00 PM. Professor asked to submit via academic portal.",
    requiresResponse: true,
    detectedDeadline: "Tomorrow, 5:00 PM",
    draftReply: `Hi Professor Wright,

Thank you for the reminder. I am finalizing the architecture section and will submit the milestone report through the academic portal well before the 5:00 PM deadline tomorrow.

Best regards,
Shinsu`,
    draftStatus: "drafted",
  },
  {
    id: "email-2",
    sender: "Aarav Sharma (SIH Lead)",
    senderEmail: "aarav.sih@teamsync.org",
    recipient: "shinsu@university.edu",
    subject: "SIH Hackathon Presentation Deck — Slides Review",
    snippet: "Hey Shinsu, could you take a look at slides 4 to 8 before our 8 PM sync?",
    body: `Hey Shinsu,

We've updated the pitch deck for SIH. Could you please review slides 4 through 8 (the technical flow and system architecture) before our sync tonight at 8:00 PM?

Drop any suggestions directly into the slide comments.

Thanks,
Aarav`,
    receivedAt: "Today, 10:30 AM",
    isRead: true,
    importance: "important",
    category: "Hackathon",
    aiSummary: "Aarav requested review of slides 4-8 on the technical flow before the 8:00 PM team sync.",
    requiresResponse: true,
    detectedDeadline: "Today, 8:00 PM",
    draftReply: `Hey Aarav,

Received! I will inspect slides 4 to 8 this afternoon and add comments on the data flow diagram before our 8 PM call.

Best,
Shinsu`,
    draftStatus: "none",
  },
  {
    id: "email-3",
    sender: "GitHub Notifications",
    senderEmail: "notifications@github.com",
    recipient: "shinsu@university.edu",
    subject: "[Security] Dependabot alert for mine-assistant repository",
    snippet: "Dependabot created a PR to update typescript in your repository...",
    body: `Hi Shinsu,

Dependabot has detected an available patch update for TypeScript dependencies in repository 'mine-assistant'. Review the automated PR and run test suite when convenient.

No immediate action is required.`,
    receivedAt: "Yesterday, 3:45 PM",
    isRead: true,
    importance: "normal",
    category: "GitHub",
    aiSummary: "Routine dependabot notification for TypeScript dependency updates. No urgent action required.",
    requiresResponse: false,
    draftStatus: "none",
  },
  {
    id: "email-4",
    sender: "AWS Student Community",
    senderEmail: "community@awseducate.org",
    recipient: "shinsu@university.edu",
    subject: "Cloud Architecture Workshop Webinar RSVP Confirmation",
    snippet: "Your seat is confirmed for the upcoming Cloud Scalability webinar...",
    body: `Hi Shinsu,

Your registration for the 'Building Resilient Microservices' webinar on Saturday at 2:00 PM is confirmed. Link to access the webinar will be emailed 1 hour prior.`,
    receivedAt: "Yesterday, 11:20 AM",
    isRead: true,
    importance: "personal",
    category: "Workshops",
    aiSummary: "Confirmation for Saturday's 2:00 PM AWS Architecture webinar.",
    requiresResponse: false,
    draftStatus: "none",
  },
];

export const initialMemories: MemoryItem[] = [
  {
    id: "mem-1",
    type: "preference",
    content: "Prefers concise, actionable email replies and clear bullet points instead of long paragraphs.",
    importance: "high",
    createdAt: "2026-09-01T10:00:00Z",
    source: "manual",
  },
  {
    id: "mem-2",
    type: "instruction",
    content: "Crucial rule: Never send emails or delete tasks autonomously without explicit user review and confirmation.",
    importance: "high",
    createdAt: "2026-09-01T10:05:00Z",
    source: "manual",
  },
  {
    id: "mem-3",
    type: "project",
    content: "Developing personal AI assistant 'Mine' with proactive dashboard, smart scheduler, and Gmail triage workflow.",
    importance: "high",
    createdAt: "2026-09-02T14:20:00Z",
    source: "chat",
  },
  {
    id: "mem-4",
    type: "routine",
    content: "Evening wrap-up at 10:00 PM to review completed tasks and organize tomorrow's top 3 priorities.",
    importance: "medium",
    createdAt: "2026-09-03T09:15:00Z",
    source: "chat",
  },
  {
    id: "mem-5",
    type: "fact",
    content: "Participating in Smart India Hackathon (SIH) with team lead Aarav; handles system architecture.",
    importance: "medium",
    createdAt: "2026-09-03T11:00:00Z",
    source: "chat",
  },
];

export const initialAuditLogs: AuditLogEntry[] = [
  {
    id: "log-1",
    timestamp: "Today, 08:30 AM",
    action: "Email AI Triage & Draft Prepared",
    toolName: "draft_email",
    inputSummary: "To Prof. Kenneth Wright regarding Project Milestone Deadline",
    result: "Draft generated with deadline reminder. Awaiting user approval to send.",
    status: "approved",
  },
  {
    id: "log-2",
    timestamp: "Today, 08:31 AM",
    action: "Task Auto-Suggested & Created",
    toolName: "create_task",
    inputSummary: "Review professor's email & submit milestone report (Due: Tomorrow 5 PM)",
    result: "Task added to board with high priority.",
    status: "executed",
  },
];
