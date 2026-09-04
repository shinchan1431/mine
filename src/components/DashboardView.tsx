import React, { useState } from "react";
import {
  CheckSquare,
  Mail,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  Send,
  AlertCircle,
  FileText,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Task, Email, ScheduleEvent, Reminder, UserSettings } from "../types";
import { NavTab } from "./Sidebar";

interface DashboardViewProps {
  tasks: Task[];
  emails: Email[];
  schedule: ScheduleEvent[];
  reminders: Reminder[];
  settings: UserSettings;
  onNavigate: (tab: NavTab) => void;
  onQuickAsk: (prompt: string) => void;
  onToggleTask: (taskId: string) => void;
  onApproveEmailDraft: (emailId: string) => void;
  onOpenBriefing: (type: "morning" | "evening") => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  emails,
  schedule,
  reminders,
  settings,
  onNavigate,
  onQuickAsk,
  onToggleTask,
  onApproveEmailDraft,
  onOpenBriefing,
}) => {
  const [quickInput, setQuickInput] = useState("");

  const pendingTasks = tasks.filter((t) => t.status === "pending");
  const highPriorityTasks = pendingTasks.filter((t) => t.priority === "high");
  const urgentEmails = emails.filter((e) => e.importance === "urgent" || e.requiresResponse);
  const pendingReminders = reminders.filter((r) => r.status === "pending");

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    onQuickAsk(quickInput.trim());
    setQuickInput("");
  };

  return (
    <div id="dashboard-view" className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* AI Executive Priority Hero Card */}
      <div className="bg-[#2D2F24] text-[#FDFCF8] rounded-xl p-6 border border-[#3F4232] shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-[#A67C52]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#A67C52]/20 text-[#D9BA9B] text-[11px] font-semibold tracking-wide border border-[#A67C52]/40">
              <Sparkles className="w-3 h-3" />
              Mine Intelligence • Immediate Attention
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#FDFCF8]">
              {urgentEmails[0] ? (
                <>
                  Action Required: {urgentEmails[0].subject}
                </>
              ) : (
                <>Ready for your day, {settings.userName}</>
              )}
            </h2>
            <p className="text-xs text-[#D8D2C2] leading-relaxed">
              {urgentEmails[0] && urgentEmails[0].draftReply ? (
                <>
                  Prof. Kenneth Wright set a submission deadline for tomorrow at 5:00 PM. Mine has drafted a confirmation reply adhering to your concise style guidelines.
                </>
              ) : (
                <>
                  You have {highPriorityTasks.length} high-priority tasks pending and {schedule.length} scheduled blocks today.
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {urgentEmails[0] && urgentEmails[0].draftStatus === "drafted" ? (
              <button
                id="hero-approve-draft-btn"
                onClick={() => onApproveEmailDraft(urgentEmails[0].id)}
                className="px-4 py-2 bg-[#A67C52] hover:bg-[#8F6841] text-[#FDFCF8] text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Review & Approve Draft
              </button>
            ) : (
              <button
                id="hero-morning-briefing-btn"
                onClick={() => onOpenBriefing("morning")}
                className="px-4 py-2 bg-[#3A3C2F] hover:bg-[#494B3B] text-[#FDFCF8] text-xs font-semibold rounded-lg border border-[#4C4E3E] transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D9BA9B]" />
                View Morning Briefing
              </button>
            )}
            <button
              id="hero-talk-assistant-btn"
              onClick={() => onNavigate("assistant")}
              className="px-3.5 py-2 bg-[#3A3C2F]/70 hover:bg-[#494B3B] text-[#D8D2C2] hover:text-[#FDFCF8] text-xs font-medium rounded-lg border border-[#4C4E3E] transition-colors"
            >
              Open Chat
            </button>
          </div>
        </div>
      </div>

      {/* Quick Metrics Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1: Tasks */}
        <div
          id="metric-card-tasks"
          onClick={() => onNavigate("tasks")}
          className="bg-white p-4 rounded-xl border border-[#E8E4D9] hover:border-[#D0C9BA] hover:shadow-xs cursor-pointer transition-all space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7A7869] uppercase tracking-wider">
              Pending Tasks
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#F4F1EA] flex items-center justify-center text-[#5A5A40]">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#3D3D3D] tracking-tight">
              {pendingTasks.length}
            </span>
            {highPriorityTasks.length > 0 && (
              <span className="text-[11px] font-semibold text-[#793731] bg-[#FBF2F1] px-2 py-0.5 rounded-md border border-[#F1D6D4]">
                {highPriorityTasks.length} High
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#8C8A7B]">
            Next: {pendingTasks[0]?.title.slice(0, 24)}...
          </p>
        </div>

        {/* Metric 2: Emails */}
        <div
          id="metric-card-emails"
          onClick={() => onNavigate("emails")}
          className="bg-white p-4 rounded-xl border border-[#E8E4D9] hover:border-[#D0C9BA] hover:shadow-xs cursor-pointer transition-all space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7A7869] uppercase tracking-wider">
              Inbox Status
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FAF4ED] flex items-center justify-center text-[#A67C52]">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#3D3D3D] tracking-tight">
              {emails.length}
            </span>
            <span className="text-[11px] font-semibold text-[#7A532C] bg-[#FAF4ED] px-2 py-0.5 rounded-md border border-[#EADBCE]">
              {urgentEmails.length} Important
            </span>
          </div>
          <p className="text-[11px] text-[#8C8A7B]">
            {emails.filter((e) => !e.isRead).length} unread • 1 draft pending
          </p>
        </div>

        {/* Metric 3: Agenda Schedule */}
        <div
          id="metric-card-schedule"
          onClick={() => onNavigate("schedule")}
          className="bg-white p-4 rounded-xl border border-[#E8E4D9] hover:border-[#D0C9BA] hover:shadow-xs cursor-pointer transition-all space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7A7869] uppercase tracking-wider">
              Today's Schedule
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#EEF2F4] flex items-center justify-center text-[#4A5D6E]">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#3D3D3D] tracking-tight">
              {schedule.length}
            </span>
            <span className="text-[11px] font-semibold text-[#525046] bg-[#F4F1EA] px-2 py-0.5 rounded-md">
              Blocks
            </span>
          </div>
          <p className="text-[11px] text-[#8C8A7B]">
            Next: {schedule[0]?.startTime} - {schedule[0]?.title.slice(0, 16)}...
          </p>
        </div>

        {/* Metric 4: Reminders */}
        <div
          id="metric-card-reminders"
          onClick={() => onNavigate("tasks")}
          className="bg-white p-4 rounded-xl border border-[#E8E4D9] hover:border-[#D0C9BA] hover:shadow-xs cursor-pointer transition-all space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7A7869] uppercase tracking-wider">
              Active Reminders
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#EEF3EF] flex items-center justify-center text-[#435948]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#3D3D3D] tracking-tight">
              {pendingReminders.length}
            </span>
            <span className="text-[11px] font-semibold text-[#3D5440] bg-[#EEF3EF] px-2 py-0.5 rounded-md border border-[#D2DFD4]">
              Active
            </span>
          </div>
          <p className="text-[11px] text-[#8C8A7B]">
            Upcoming: {pendingReminders[0]?.remindAt || "None"}
          </p>
        </div>
      </div>

      {/* Main Grid: Priority Tasks & Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Priority Tasks & Urgent Emails */}
        <div className="lg:col-span-2 space-y-6">
          {/* Important Tasks */}
          <div className="bg-white rounded-xl border border-[#E8E4D9] p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#F0ECE1] pb-3">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[#5A5A40]" />
                <h3 className="text-sm font-bold text-[#3D3D3D]">
                  Priority Tasks
                </h3>
              </div>
              <button
                onClick={() => onNavigate("tasks")}
                className="text-xs font-semibold text-[#7A7869] hover:text-[#3D3D3D] flex items-center gap-1"
              >
                View all ({pendingTasks.length})
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {pendingTasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  id={`dashboard-task-${task.id}`}
                  className="flex items-start justify-between p-3 rounded-lg border border-[#F0ECE1] hover:border-[#E8E4D9] bg-[#FDFCF8] hover:bg-[#F9F7F1] transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className="mt-0.5 w-4 h-4 rounded border border-[#D0C9BA] hover:border-[#5A5A40] flex items-center justify-center transition-colors"
                    >
                      {task.status === "completed" && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#3D5440]" />
                      )}
                    </button>
                    <div>
                      <h4 className="text-xs font-semibold text-[#3D3D3D]">
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-[11px] text-[#7A7869] mt-0.5 line-clamp-1">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-[#8C8A7B]">
                        <span className="capitalize font-medium text-[#5A5A40]">
                          {task.category}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {task.dueAt}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                      task.priority === "high"
                        ? "bg-[#FBF2F1] text-[#793731] border border-[#F1D6D4]"
                        : task.priority === "medium"
                        ? "bg-[#FAF4ED] text-[#7A532C] border border-[#EADBCE]"
                        : "bg-[#EEF3EF] text-[#3D5440] border border-[#D2DFD4]"
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Urgent Email Spotlight */}
          {urgentEmails.length > 0 && (
            <div className="bg-white rounded-xl border border-[#E8E4D9] p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-[#F0ECE1] pb-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#A67C52]" />
                  <h3 className="text-sm font-bold text-[#3D3D3D]">
                    Important Email Triage
                  </h3>
                </div>
                <button
                  onClick={() => onNavigate("emails")}
                  className="text-xs font-semibold text-[#7A7869] hover:text-[#3D3D3D] flex items-center gap-1"
                >
                  Open Inbox
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {urgentEmails.slice(0, 2).map((email) => (
                <div
                  key={email.id}
                  id={`dashboard-email-${email.id}`}
                  className="p-3.5 rounded-lg border border-[#EADBCE] bg-[#FAF6F0] space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#3D3D3D]">
                        {email.sender}
                      </span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#FBF2F1] text-[#793731] border border-[#F1D6D4] uppercase">
                        {email.importance}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#8C8A7B]">
                      {email.receivedAt}
                    </span>
                  </div>

                  <h4 className="text-xs font-semibold text-[#3D3D3D]">
                    {email.subject}
                  </h4>

                  {email.aiSummary && (
                    <div className="text-[11px] text-[#3D3D3D] bg-white/90 p-2.5 rounded-md border border-[#EADBCE] leading-relaxed">
                      <span className="font-semibold text-[#7A532C]">
                        Mine AI Summary:
                      </span>{" "}
                      {email.aiSummary}
                    </div>
                  )}

                  {email.draftReply && email.draftStatus === "drafted" && (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-[#8C8A7B] italic">
                        Draft reply prepared by Mine
                      </span>
                      <button
                        onClick={() => onNavigate("emails")}
                        className="text-xs font-bold text-[#7A532C] hover:text-[#5C3B1A] flex items-center gap-1 bg-[#FAF3EB] hover:bg-[#F2E5D5] px-2.5 py-1 rounded transition-colors"
                      >
                        Review Draft in Email Tab
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Today's Schedule Agenda Timeline */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[#E8E4D9] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0ECE1] pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#5A5A40]" />
                <h3 className="text-sm font-bold text-[#3D3D3D]">
                  Today's Schedule
                </h3>
              </div>
              <button
                onClick={() => onNavigate("schedule")}
                className="text-xs font-semibold text-[#7A7869] hover:text-[#3D3D3D]"
              >
                View timeline
              </button>
            </div>

            <div className="relative pl-5 space-y-3.5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E8E4D9]">
              {schedule.map((item) => (
                <div
                  key={item.id}
                  id={`dashboard-schedule-${item.id}`}
                  className="relative group"
                >
                  {/* Bullet marker */}
                  <span className="absolute -left-5 top-1.5 w-2 h-2 rounded-full bg-[#A67C52] ring-4 ring-white"></span>
                  <div className="p-2.5 rounded-lg border border-[#F0ECE1] hover:border-[#E8E4D9] bg-[#FDFCF8] hover:bg-[#F9F7F1] transition-colors">
                    <div className="flex items-center justify-between text-[10px] font-medium text-[#8C8A7B] mb-0.5">
                      <span>
                        {item.startTime} – {item.endTime}
                      </span>
                      <span className="capitalize font-semibold text-[#5A5A40] bg-white px-1.5 py-0.5 rounded border border-[#E8E4D9]">
                        {item.category}
                      </span>
                    </div>
                    <h5 className="text-xs font-semibold text-[#3D3D3D]">
                      {item.title}
                    </h5>
                    {item.description && (
                      <p className="text-[10px] text-[#7A7869] mt-0.5 line-clamp-1">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Quick Command Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E8E4D9] shadow-xs">
        <form onSubmit={handleQuickSubmit} className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#5A5A40] flex items-center justify-center text-[#E8E4D9] shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <input
            id="quick-ask-input"
            type="text"
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            placeholder="Ask Mine anything (e.g. 'What should I do today?', 'Remind me at 9 PM to test code')..."
            className="flex-1 text-xs text-[#3D3D3D] placeholder:text-[#9E9C8E] focus:outline-none bg-transparent"
          />
          <button
            id="quick-ask-submit-btn"
            type="submit"
            className="px-3.5 py-1.5 bg-[#5A5A40] hover:bg-[#484833] text-[#FDFCF8] text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shrink-0"
          >
            <span>Ask Mine</span>
            <Send className="w-3 h-3 text-[#E8E4D9]" />
          </button>
        </form>

        {/* Quick prompt suggestions */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#F0ECE1] flex-wrap">
          <span className="text-[11px] font-semibold text-[#8C8A7B]">
            Suggestions:
          </span>
          {[
            "What should I do today?",
            "Remind me tomorrow at 9 AM to submit project",
            "Show me important emails",
            "Daily Briefing",
          ].map((prompt) => (
            <button
              key={prompt}
              onClick={() => onQuickAsk(prompt)}
              className="text-[11px] px-2.5 py-1 rounded-md bg-[#F4F1EA] text-[#4F4E46] hover:bg-[#EAE5DA] hover:text-[#3D3D3D] transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
