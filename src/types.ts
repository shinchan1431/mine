export type Priority = "high" | "medium" | "low";
export type TaskCategory = "work" | "study" | "project" | "personal";
export type TaskStatus = "pending" | "completed";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  category: TaskCategory;
  dueAt: string; // ISO string or human formatted
  estimatedMinutes?: number;
  createdAt: string;
  completedAt?: string;
}

export type ReminderStatus = "pending" | "completed" | "dismissed";
export type RepeatRule = "none" | "daily" | "weekly";

export interface Reminder {
  id: string;
  title: string;
  taskId?: string;
  remindAt: string; // ISO string or human string
  repeatRule: RepeatRule;
  status: ReminderStatus;
  createdAt: string;
}

export type ScheduleCategory = "meeting" | "work" | "break" | "study" | "review";

export interface ScheduleEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "10:30"
  date: string;      // YYYY-MM-DD
  category: ScheduleCategory;
  location?: string;
}

export type EmailImportance = "urgent" | "important" | "normal" | "promotional" | "personal";
export type DraftStatus = "none" | "drafted" | "approved" | "sent";

export interface Email {
  id: string;
  sender: string;
  senderEmail: string;
  recipient: string;
  subject: string;
  snippet: string;
  body: string;
  receivedAt: string;
  isRead: boolean;
  importance: EmailImportance;
  category: string;
  aiSummary?: string;
  requiresResponse: boolean;
  detectedDeadline?: string | null;
  draftReply?: string;
  draftStatus: DraftStatus;
  sentAt?: string;
}

export type MemoryType = "preference" | "fact" | "instruction" | "project" | "routine";

export interface MemoryItem {
  id: string;
  type: MemoryType;
  content: string;
  importance: Priority;
  createdAt: string;
  source: "chat" | "manual";
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  toolName: string;
  inputSummary: string;
  result: string;
  status: "approved" | "executed" | "cancelled" | "rejected";
}

export interface ProposedAction {
  id: string;
  type: "send_email" | "delete_task" | "reschedule";
  title: string;
  description: string;
  payload: any;
  status: "pending_approval" | "approved" | "rejected";
}

export interface ToolCallItem {
  id: string;
  name: string;
  args: any;
  result?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  toolCalls?: ToolCallItem[];
  proposedAction?: ProposedAction;
}

export interface BriefingData {
  greeting: string;
  summaryText: string;
  topPriorities: string[];
  scheduleHighlights: string[];
  actionAdvice: string;
  quote: string;
}

export interface UserSettings {
  userName: string;
  assistantName: string;
  ttsEnabled: boolean;
  morningBriefingTime: string;
  eveningBriefingTime: string;
  enableSoundAlerts: boolean;
}
