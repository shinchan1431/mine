import { Task, Reminder, ScheduleEvent, Email, MemoryItem, AuditLogEntry, UserSettings, ChatMessage } from "../types";
import {
  initialTasks,
  initialReminders,
  initialSchedule,
  initialEmails,
  initialMemories,
  initialAuditLogs,
  initialUserSettings,
} from "../data/initialData";

const STORAGE_KEYS = {
  TASKS: "mine_tasks_v1",
  REMINDERS: "mine_reminders_v1",
  SCHEDULE: "mine_schedule_v1",
  EMAILS: "mine_emails_v1",
  MEMORIES: "mine_memories_v1",
  AUDIT_LOGS: "mine_audit_logs_v1",
  SETTINGS: "mine_settings_v1",
  CHAT_MESSAGES: "mine_chat_messages_v1",
};

export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Failed to load ${key} from storage:`, e);
    return fallback;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save ${key} to storage:`, e);
  }
}

export function getInitialState() {
  return {
    tasks: loadFromStorage<Task[]>(STORAGE_KEYS.TASKS, initialTasks),
    reminders: loadFromStorage<Reminder[]>(STORAGE_KEYS.REMINDERS, initialReminders),
    schedule: loadFromStorage<ScheduleEvent[]>(STORAGE_KEYS.SCHEDULE, initialSchedule),
    emails: loadFromStorage<Email[]>(STORAGE_KEYS.EMAILS, initialEmails),
    memories: loadFromStorage<MemoryItem[]>(STORAGE_KEYS.MEMORIES, initialMemories),
    auditLogs: loadFromStorage<AuditLogEntry[]>(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs),
    settings: loadFromStorage<UserSettings>(STORAGE_KEYS.SETTINGS, initialUserSettings),
    chatMessages: loadFromStorage<ChatMessage[]>(STORAGE_KEYS.CHAT_MESSAGES, [
      {
        id: "welcome-msg",
        role: "assistant",
        content: `Good morning, Shinsu! 👋

I've organized your day:
• **2 High-Priority Tasks** pending (SIH documentation sprint & college milestone report)
• **1 Urgent Email** from Prof. Kenneth Wright with a deadline tomorrow at 5:00 PM (I've prepared a draft response ready for your review)
• **Next Scheduled Block:** SIH Presentation Sync at 8:00 PM

How can I help you tackle your priorities today?`,
        timestamp: "09:00 AM",
      },
    ]),
  };
}

export { STORAGE_KEYS };
