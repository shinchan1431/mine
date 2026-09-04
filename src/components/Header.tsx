import React, { useState, useEffect } from "react";
import {
  Plus,
  Bell,
  SunMedium,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { Reminder } from "../types";

interface HeaderProps {
  userName: string;
  activeReminders: Reminder[];
  onOpenNewTask: () => void;
  onOpenNewReminder: () => void;
  onOpenBriefing: (type: "morning" | "evening") => void;
  onSelectTab: (tab: any) => void;
}

export const Header: React.FC<HeaderProps> = ({
  userName,
  activeReminders,
  onOpenNewTask,
  onOpenNewReminder,
  onOpenBriefing,
  onSelectTab,
}) => {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [greeting, setGreeting] = useState<string>("Good day");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      if (hours < 12) setGreeting("Good morning");
      else if (hours < 17) setGreeting("Good afternoon");
      else setGreeting("Good evening");

      setCurrentTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          weekday: "short",
          month: "short",
          day: "numeric",
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const pendingReminders = activeReminders.filter((r) => r.status === "pending");

  return (
    <header
      id="app-header"
      className="h-16 px-6 bg-[#FDFCF8] border-b border-[#E8E4D9] flex items-center justify-between shrink-0"
    >
      {/* Greeting and live clock */}
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-base font-bold text-[#3D3D3D] flex items-center gap-2">
            {greeting}, {userName}
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#7A7869] bg-[#F4F1EA] px-2 py-0.5 rounded-full border border-[#E8E4D9]">
              <Sparkles className="w-3 h-3 text-[#A67C52]" />
              Mine Active
            </span>
          </h1>
          <p className="text-xs text-[#8C8A7B] flex items-center gap-1.5 mt-0.5">
            <Clock className="w-3 h-3 text-[#A6A292]" />
            <span>{currentTime || "Loading..."}</span>
          </p>
        </div>
      </div>

      {/* Reminder notification badge & Quick actions */}
      <div className="flex items-center gap-2.5">
        {pendingReminders.length > 0 && (
          <button
            id="header-reminders-indicator"
            onClick={() => onSelectTab("tasks")}
            className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-[#FAF4ED] text-[#7A532C] border border-[#EADBCE] hover:bg-[#F5ECE0] transition-colors"
          >
            <Bell className="w-3.5 h-3.5 text-[#A67C52] animate-bounce" />
            <span>{pendingReminders.length} Reminder{pendingReminders.length > 1 ? "s" : ""} active</span>
          </button>
        )}

        <button
          id="header-briefing-btn"
          onClick={() => onOpenBriefing("morning")}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-[#E8E4D9] text-[#4F4E46] bg-[#F7F5EE] hover:bg-[#EFECE3] hover:border-[#DCD7C9] transition-colors"
        >
          <SunMedium className="w-3.5 h-3.5 text-[#A67C52]" />
          <span>Daily Brief</span>
        </button>

        <button
          id="header-new-reminder-btn"
          onClick={onOpenNewReminder}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-[#E8E4D9] text-[#4F4E46] bg-[#FDFCF8] hover:bg-[#F7F5EE] hover:border-[#DCD7C9] transition-colors"
        >
          <Clock className="w-3.5 h-3.5 text-[#8C8A7B]" />
          <span>+ Reminder</span>
        </button>

        <button
          id="header-new-task-btn"
          onClick={onOpenNewTask}
          className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-[#5A5A40] hover:bg-[#484833] text-[#FDFCF8] transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 text-[#E8E4D9]" />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
};
