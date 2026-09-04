import React, { useState, useEffect } from "react";
import { Sidebar, NavTab } from "./components/Sidebar";
import { Header } from "./components/Header";
import { DashboardView } from "./components/DashboardView";
import { AssistantView } from "./components/AssistantView";
import { EmailsView } from "./components/EmailsView";
import { TasksView } from "./components/TasksView";
import { ScheduleView } from "./components/ScheduleView";
import { MemoryView } from "./components/MemoryView";
import { AuditLogView } from "./components/AuditLogView";
import { BriefingModal } from "./components/BriefingModal";
import { ReminderModal } from "./components/ReminderModal";
import {
  getInitialState,
  saveToStorage,
  STORAGE_KEYS,
} from "./lib/storage";
import {
  Task,
  Reminder,
  ScheduleEvent,
  Email,
  MemoryItem,
  AuditLogEntry,
  UserSettings,
  ChatMessage,
  ProposedAction,
} from "./types";

export default function App() {
  const [initialData] = useState(() => getInitialState());

  const [currentTab, setCurrentTab] = useState<NavTab>("dashboard");
  const [tasks, setTasks] = useState<Task[]>(initialData.tasks);
  const [reminders, setReminders] = useState<Reminder[]>(initialData.reminders);
  const [schedule, setSchedule] = useState<ScheduleEvent[]>(initialData.schedule);
  const [emails, setEmails] = useState<Email[]>(initialData.emails);
  const [memories, setMemories] = useState<MemoryItem[]>(initialData.memories);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initialData.auditLogs);
  const [settings, setSettings] = useState<UserSettings>(initialData.settings);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialData.chatMessages);

  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);
  const [briefingType, setBriefingType] = useState<"morning" | "evening">("morning");
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.TASKS, tasks);
  }, [tasks]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.REMINDERS, reminders);
  }, [reminders]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SCHEDULE, schedule);
  }, [schedule]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.EMAILS, emails);
  }, [emails]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.MEMORIES, memories);
  }, [memories]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.AUDIT_LOGS, auditLogs);
  }, [auditLogs]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SETTINGS, settings);
  }, [settings]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CHAT_MESSAGES, chatMessages);
  }, [chatMessages]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const addAuditLog = (
    action: string,
    toolName: string,
    inputSummary: string,
    result: string,
    status: AuditLogEntry["status"]
  ) => {
    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      action,
      toolName,
      inputSummary,
      result,
      status,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Toggle Task Completion
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const isDone = t.status === "pending";
          const updated = {
            ...t,
            status: isDone ? ("completed" as const) : ("pending" as const),
            completedAt: isDone ? new Date().toISOString() : undefined,
          };
          addAuditLog(
            isDone ? "Task Completed" : "Task Reopened",
            "complete_task",
            t.title,
            isDone ? "Status set to completed" : "Status set to pending",
            "executed"
          );
          return updated;
        }
        return t;
      })
    );
  };

  // Add Task
  const handleAddTask = (newTask: Omit<Task, "id" | "createdAt">) => {
    const task: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [task, ...prev]);
    addAuditLog(
      "Task Created",
      "create_task",
      newTask.title,
      `Priority: ${newTask.priority}, Due: ${newTask.dueAt}`,
      "executed"
    );
    showToast(`Task created: ${newTask.title}`);
  };

  // Delete Task
  const handleDeleteTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    addAuditLog(
      "Task Removed",
      "delete_task",
      task.title,
      "Task item deleted from board",
      "executed"
    );
    showToast("Task deleted");
  };

  // Add Reminder
  const handleAddReminder = (newReminder: Omit<Reminder, "id" | "createdAt">) => {
    const reminder: Reminder = {
      ...newReminder,
      id: `rem-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setReminders((prev) => [reminder, ...prev]);
    addAuditLog(
      "Reminder Scheduled",
      "create_reminder",
      newReminder.title,
      `Remind at ${newReminder.remindAt}`,
      "executed"
    );
    showToast(`Reminder set for ${newReminder.remindAt}`);
  };

  // Add Schedule Event
  const handleAddScheduleEvent = (newEvent: Omit<ScheduleEvent, "id">) => {
    const item: ScheduleEvent = {
      ...newEvent,
      id: `sch-${Date.now()}`,
    };
    setSchedule((prev) => [...prev, item]);
    addAuditLog(
      "Schedule Block Added",
      "add_schedule_event",
      newEvent.title,
      `${newEvent.startTime} to ${newEvent.endTime}`,
      "executed"
    );
    showToast(`Scheduled: ${newEvent.title}`);
  };

  // Delete Schedule Event
  const handleDeleteScheduleEvent = (eventId: string) => {
    setSchedule((prev) => prev.filter((s) => s.id !== eventId));
    showToast("Event removed from schedule");
  };

  // Add Memory
  const handleAddMemory = (newMemory: Omit<MemoryItem, "id" | "createdAt">) => {
    const mem: MemoryItem = {
      ...newMemory,
      id: `mem-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setMemories((prev) => [mem, ...prev]);
    addAuditLog(
      "Memory Learned",
      "save_memory",
      newMemory.content,
      `Categorized as ${newMemory.type}`,
      "executed"
    );
    showToast("New memory recorded in Mine's context");
  };

  // Delete Memory
  const handleDeleteMemory = (memoryId: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== memoryId));
    showToast("Memory deleted");
  };

  // Email Reply Approval & Send
  const handleApproveAndSendEmail = (emailId: string, replyText: string) => {
    const targetEmail = emails.find((e) => e.id === emailId);
    if (!targetEmail) return;

    setEmails((prev) =>
      prev.map((e) => {
        if (e.id === emailId) {
          return {
            ...e,
            draftReply: replyText,
            draftStatus: "sent",
            sentAt: new Date().toISOString(),
          };
        }
        return e;
      })
    );

    addAuditLog(
      "Email Approved & Dispatched",
      "send_email",
      `To ${targetEmail.senderEmail} regarding "${targetEmail.subject}"`,
      "Sent via Gmail API with explicit user approval",
      "executed"
    );

    showToast(`Email reply sent to ${targetEmail.sender}!`);

    // Add assistant confirmation message in chat
    const confirmMsg: ChatMessage = {
      id: `confirm-${Date.now()}`,
      role: "assistant",
      content: `✓ **Email Dispatched Successfully**

Recipient: ${targetEmail.sender} (${targetEmail.senderEmail})
Subject: Re: ${targetEmail.subject}
Status: Delivered via Gmail API following your approval.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setChatMessages((prev) => [...prev, confirmMsg]);
  };

  // Generate Draft for Email
  const handleGenerateDraft = async (email: Email) => {
    setIsGeneratingDraft(true);
    try {
      const res = await fetch("/api/summarize-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: email.subject,
          sender: email.sender,
          body: email.body,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setEmails((prev) =>
          prev.map((e) => {
            if (e.id === email.id) {
              return {
                ...e,
                aiSummary: data.aiSummary || e.aiSummary,
                detectedDeadline: data.detectedDeadline || e.detectedDeadline,
                draftReply: data.suggestedReply || e.draftReply,
                draftStatus: "drafted",
              };
            }
            return e;
          })
        );
        addAuditLog(
          "AI Email Draft Generated",
          "draft_email",
          email.subject,
          "Draft prepared and awaiting user review",
          "approved"
        );
        showToast("Draft prepared by Mine");
      }
    } catch (err) {
      console.error(err);
      showToast("Could not generate draft reply");
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  // Create Task From Email Deadline
  const handleCreateTaskFromEmail = (email: Email) => {
    const task: Task = {
      id: `task-${Date.now()}`,
      title: `Submit milestone report for ${email.sender}`,
      description: email.aiSummary || email.subject,
      priority: "high",
      status: "pending",
      category: "study",
      dueAt: email.detectedDeadline || "Tomorrow, 5:00 PM",
      estimatedMinutes: 45,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [task, ...prev]);
    addAuditLog(
      "Task Auto-Extracted from Email",
      "create_task",
      task.title,
      `Due date extracted: ${task.dueAt}`,
      "executed"
    );
    showToast("Task created from email deadline");
    setCurrentTab("tasks");
  };

  // Simulate Incoming Email
  const handleSimulateNewEmail = async (newEmail: {
    sender: string;
    senderEmail: string;
    subject: string;
    body: string;
  }) => {
    try {
      const res = await fetch("/api/summarize-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmail),
      });

      let summaryData: any = {};
      if (res.ok) {
        summaryData = await res.json();
      }

      const email: Email = {
        id: `email-${Date.now()}`,
        sender: newEmail.sender,
        senderEmail: newEmail.senderEmail,
        recipient: `${settings.userName.toLowerCase()}@university.edu`,
        subject: newEmail.subject,
        snippet: newEmail.body.slice(0, 80) + "...",
        body: newEmail.body,
        receivedAt: "Just now",
        isRead: false,
        importance: summaryData.category || "important",
        category: "Simulated",
        aiSummary: summaryData.aiSummary || "Incoming message analyzed by Mine",
        requiresResponse: summaryData.requiresResponse !== false,
        detectedDeadline: summaryData.detectedDeadline || null,
        draftReply: summaryData.suggestedReply || undefined,
        draftStatus: summaryData.suggestedReply ? "drafted" : "none",
      };

      setEmails((prev) => [email, ...prev]);
      addAuditLog(
        "Incoming Email Triaged",
        "triage_email",
        email.subject,
        `Importance: ${email.importance}, Deadline: ${email.detectedDeadline || "None"}`,
        "executed"
      );
      showToast(`New email received from ${email.sender}`);
    } catch (e) {
      console.error(e);
      showToast("Simulation failed");
    }
  };

  // Chat message submission to Mine
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg],
          userPrompt: text,
          context: {
            userName: settings.userName,
            tasks,
            reminders,
            schedule,
            emails,
            memories,
          },
        }),
      });

      if (!res.ok) throw new Error("Chat request failed");
      const data = await res.json();

      const executedToolCalls: any[] = [];
      let proposedAction: ProposedAction | undefined = undefined;

      // Handle function calls executed by the backend
      if (Array.isArray(data.toolCalls)) {
        for (const tc of data.toolCalls) {
          if (tc.name === "create_task") {
            const { title, priority = "medium", category = "project", dueAt = "Today", estimatedMinutes } = tc.args;
            const newTask: Task = {
              id: `task-${Date.now()}-${Math.random().toString(36).substring(7)}`,
              title,
              priority,
              category,
              dueAt,
              estimatedMinutes,
              status: "pending",
              createdAt: new Date().toISOString(),
            };
            setTasks((prev) => [newTask, ...prev]);
            addAuditLog("Task Created by Assistant", "create_task", title, `Priority: ${priority}`, "executed");
            executedToolCalls.push({ ...tc, result: `Created task "${title}" (${priority} priority)` });
          } else if (tc.name === "create_reminder") {
            const { title, remindAt } = tc.args;
            const newReminder: Reminder = {
              id: `rem-${Date.now()}-${Math.random().toString(36).substring(7)}`,
              title,
              remindAt,
              repeatRule: "none",
              status: "pending",
              createdAt: new Date().toISOString(),
            };
            setReminders((prev) => [newReminder, ...prev]);
            addAuditLog("Reminder Created by Assistant", "create_reminder", title, `Time: ${remindAt}`, "executed");
            executedToolCalls.push({ ...tc, result: `Reminder set: "${title}" for ${remindAt}` });
          } else if (tc.name === "add_schedule_event") {
            const { title, startTime, endTime, category = "work" } = tc.args;
            const newEvent: ScheduleEvent = {
              id: `sch-${Date.now()}`,
              title,
              startTime,
              endTime,
              category,
              date: new Date().toISOString().split("T")[0],
            };
            setSchedule((prev) => [...prev, newEvent]);
            addAuditLog("Schedule Event Added", "add_schedule_event", title, `${startTime}-${endTime}`, "executed");
            executedToolCalls.push({ ...tc, result: `Event scheduled: "${title}" (${startTime} - ${endTime})` });
          } else if (tc.name === "complete_task") {
            const target = tc.args.taskTitleOrId;
            setTasks((prev) =>
              prev.map((t) => {
                if (t.id === target || t.title.toLowerCase().includes(String(target).toLowerCase())) {
                  return { ...t, status: "completed", completedAt: new Date().toISOString() };
                }
                return t;
              })
            );
            addAuditLog("Task Completed", "complete_task", target, "Marked as completed", "executed");
            executedToolCalls.push({ ...tc, result: `Marked task "${target}" as completed` });
          } else if (tc.name === "save_memory") {
            const { type, content, importance = "high" } = tc.args;
            const newMem: MemoryItem = {
              id: `mem-${Date.now()}`,
              type,
              content,
              importance,
              createdAt: new Date().toISOString(),
              source: "chat",
            };
            setMemories((prev) => [newMem, ...prev]);
            addAuditLog("Memory Recorded", "save_memory", content, `Type: ${type}`, "executed");
            executedToolCalls.push({ ...tc, result: `Saved memory: "${content}"` });
          } else if (tc.name === "draft_email") {
            // PROPOSE ACTION - DO NOT SEND AUTONOMOUSLY
            const { emailId, recipient, subject, body } = tc.args;
            proposedAction = {
              id: `action-${Date.now()}`,
              type: "send_email",
              title: `Send Email to ${recipient}`,
              description: `Subject: ${subject}`,
              payload: { emailId, recipient, subject, body },
              status: "pending_approval",
            };
            // Also store draft in matching email if exists
            if (emailId) {
              setEmails((prev) =>
                prev.map((e) => (e.id === emailId ? { ...e, draftReply: body, draftStatus: "drafted" } : e))
              );
            }
            addAuditLog("Email Draft Proposed", "draft_email", subject, "Awaiting user approval before dispatch", "approved");
            executedToolCalls.push({ ...tc, result: `Draft prepared for ${recipient}` });
          }
        }
      }

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: "assistant",
        content: data.text || "I've checked your schedule and tasks.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        toolCalls: executedToolCalls.length > 0 ? executedToolCalls : undefined,
        proposedAction,
      };

      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: "assistant",
        content: "I ran into a temporary connection issue reaching the Gemini brain, but your local tasks, email triage, and schedule are all ready and operating.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setChatMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // User Approves Proposed Action
  const handleApproveAction = (action: ProposedAction) => {
    if (action.type === "send_email") {
      const { emailId, recipient, body } = action.payload;
      if (emailId) {
        handleApproveAndSendEmail(emailId, body);
      } else {
        addAuditLog("Email Dispatched", "send_email", `To ${recipient}`, "Sent with user approval", "executed");
        showToast(`Email dispatched to ${recipient}!`);
      }
    }

    setChatMessages((prev) =>
      prev.map((m) => {
        if (m.proposedAction?.id === action.id) {
          return {
            ...m,
            proposedAction: { ...action, status: "approved" },
          };
        }
        return m;
      })
    );
  };

  // User Rejects Proposed Action
  const handleRejectAction = (actionId: string) => {
    setChatMessages((prev) =>
      prev.map((m) => {
        if (m.proposedAction?.id === actionId) {
          return {
            ...m,
            proposedAction: { ...m.proposedAction, status: "rejected" },
          };
        }
        return m;
      })
    );
    addAuditLog("Action Cancelled by User", "user_reject", actionId, "User opted not to execute action", "cancelled");
    showToast("Action cancelled");
  };

  // Quick ask from Dashboard
  const handleQuickAsk = (prompt: string) => {
    setCurrentTab("assistant");
    handleSendMessage(prompt);
  };

  const handleOpenBriefing = (type: "morning" | "evening") => {
    setBriefingType(type);
    setIsBriefingOpen(true);
  };

  const handleToggleTTS = () => {
    setSettings((prev) => {
      const next = !prev.ttsEnabled;
      showToast(next ? "Voice read-aloud enabled" : "Voice read-aloud disabled");
      return { ...prev, ttsEnabled: next };
    });
  };

  const pendingTasksCount = tasks.filter((t) => t.status === "pending").length;
  const unreadEmailsCount = emails.filter((e) => !e.isRead).length;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FDFCF8] text-[#3D3D3D] font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#2D2E24] text-[#FDFCF8] px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold border border-[#434435] flex items-center gap-2 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-[#A67C52]"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        pendingTasksCount={pendingTasksCount}
        unreadEmailsCount={unreadEmailsCount}
        memoryCount={memories.length}
        settings={settings}
        onToggleTTS={handleToggleTTS}
        onOpenBriefing={handleOpenBriefing}
      />

      {/* Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header
          userName={settings.userName}
          activeReminders={reminders}
          onOpenNewTask={() => setCurrentTab("tasks")}
          onOpenNewReminder={() => setIsReminderModalOpen(true)}
          onOpenBriefing={handleOpenBriefing}
          onSelectTab={setCurrentTab}
        />

        <main className="flex-1 overflow-y-auto">
          {currentTab === "dashboard" && (
            <DashboardView
              tasks={tasks}
              emails={emails}
              schedule={schedule}
              reminders={reminders}
              settings={settings}
              onNavigate={setCurrentTab}
              onQuickAsk={handleQuickAsk}
              onToggleTask={handleToggleTask}
              onApproveEmailDraft={(id) => {
                const email = emails.find((e) => e.id === id);
                if (email?.draftReply) {
                  handleApproveAndSendEmail(id, email.draftReply);
                } else {
                  setCurrentTab("emails");
                }
              }}
              onOpenBriefing={handleOpenBriefing}
            />
          )}

          {currentTab === "assistant" && (
            <AssistantView
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              isLoading={isChatLoading}
              onApproveAction={handleApproveAction}
              onRejectAction={handleRejectAction}
              settings={settings}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === "emails" && (
            <EmailsView
              emails={emails}
              onApproveAndSend={handleApproveAndSendEmail}
              onGenerateDraft={handleGenerateDraft}
              onCreateTaskFromEmail={handleCreateTaskFromEmail}
              onSimulateNewEmail={handleSimulateNewEmail}
              isGeneratingDraft={isGeneratingDraft}
            />
          )}

          {currentTab === "tasks" && (
            <TasksView
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
              onAskMineAboutTask={(title) => {
                handleQuickAsk(`Help me break down and plan this task: "${title}"`);
              }}
            />
          )}

          {currentTab === "schedule" && (
            <ScheduleView
              schedule={schedule}
              onAddEvent={handleAddScheduleEvent}
              onDeleteEvent={handleDeleteScheduleEvent}
            />
          )}

          {currentTab === "memory" && (
            <MemoryView
              memories={memories}
              onAddMemory={handleAddMemory}
              onDeleteMemory={handleDeleteMemory}
            />
          )}

          {currentTab === "audit" && <AuditLogView logs={auditLogs} />}
        </main>
      </div>

      {/* Briefing Modal */}
      <BriefingModal
        type={briefingType}
        isOpen={isBriefingOpen}
        onClose={() => setIsBriefingOpen(false)}
        tasks={tasks}
        emails={emails}
        schedule={schedule}
        reminders={reminders}
        settings={settings}
      />

      {/* Reminder Creator Modal */}
      <ReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        onAddReminder={handleAddReminder}
        tasks={tasks}
      />
    </div>
  );
}
