import React from "react";
import {
  LayoutDashboard,
  Bot,
  Mail,
  CheckSquare,
  Calendar,
  Brain,
  ShieldCheck,
  SunMedium,
  Moon,
  Volume2,
  VolumeX,
} from "lucide-react";
import { UserSettings } from "../types";

export type NavTab = "dashboard" | "assistant" | "emails" | "tasks" | "schedule" | "memory" | "audit";

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  pendingTasksCount: number;
  unreadEmailsCount: number;
  memoryCount: number;
  settings: UserSettings;
  onToggleTTS: () => void;
  onOpenBriefing: (type: "morning" | "evening") => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  pendingTasksCount,
  unreadEmailsCount,
  memoryCount,
  settings,
  onToggleTTS,
  onOpenBriefing,
}) => {
  const navItems = [
    {
      id: "dashboard" as NavTab,
      label: "Dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "assistant" as NavTab,
      label: "Assistant",
      icon: Bot,
      badge: "AI",
      badgeColor: "bg-[#FAF3EB] text-[#7A532C] border-[#EADBCE]",
    },
    {
      id: "emails" as NavTab,
      label: "Emails",
      icon: Mail,
      badge: unreadEmailsCount > 0 ? `${unreadEmailsCount}` : null,
      badgeColor: "bg-[#FBF2F1] text-[#793731] border-[#F1D6D4]",
    },
    {
      id: "tasks" as NavTab,
      label: "Tasks",
      icon: CheckSquare,
      badge: pendingTasksCount > 0 ? `${pendingTasksCount}` : null,
      badgeColor: "bg-[#ECECE3] text-[#43432F] border-[#D8D8CA]",
    },
    {
      id: "schedule" as NavTab,
      label: "Schedule",
      icon: Calendar,
      badge: null,
    },
    {
      id: "memory" as NavTab,
      label: "Memory",
      icon: Brain,
      badge: `${memoryCount}`,
      badgeColor: "bg-[#EEF2F4] text-[#32404A] border-[#D4DCE0]",
    },
    {
      id: "audit" as NavTab,
      label: "Audit Log",
      icon: ShieldCheck,
      badge: null,
    },
  ];

  return (
    <aside
      id="main-sidebar"
      className="w-64 h-full bg-[#2A2C22] text-[#D8D2C2] flex flex-col border-r border-[#3E4032] shrink-0 select-none"
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-[#3E4032] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#A67C52] to-[#C49566] flex items-center justify-center text-[#FDFCF8] font-extrabold text-sm shadow-xs">
            M
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base text-[#FDFCF8] tracking-tight">
                Mine
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#3A3C2F] text-[#D9BA9B] border border-[#4C4E3E]">
                Assistant
              </span>
            </div>
            <p className="text-[11px] text-[#A6A292]">Proactive Operating Layer</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-[#8F8A7A]">
          Core Workflows
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? "bg-[#3A3C2E] text-[#FDFCF8] font-semibold shadow-xs border border-[#4D4F3E]"
                  : "text-[#C2BAAA] hover:text-[#FDFCF8] hover:bg-[#343628]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-[#D9BA9B]" : "text-[#9E9887]"
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    item.badgeColor || "bg-[#35372B] text-[#D8D2C2] border-[#484A3B]"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Quick AI Briefings Section */}
        <div className="pt-5 px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-[#8F8A7A]">
          AI Briefings
        </div>
        <div className="space-y-1">
          <button
            id="sidebar-morning-briefing-btn"
            onClick={() => onOpenBriefing("morning")}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-[#C2BAAA] hover:text-[#FAF3EB] hover:bg-[#343628] transition-colors"
          >
            <SunMedium className="w-4 h-4 text-[#D9BA9B]" />
            <span>Morning Briefing</span>
          </button>
          <button
            id="sidebar-evening-briefing-btn"
            onClick={() => onOpenBriefing("evening")}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-[#C2BAAA] hover:text-[#FAF3EB] hover:bg-[#343628] transition-colors"
          >
            <Moon className="w-4 h-4 text-[#9CB5C4]" />
            <span>Evening Wrap-up</span>
          </button>
        </div>
      </div>

      {/* Footer Profile & Voice Preference */}
      <div className="p-3 border-t border-[#3E4032] bg-[#22241C] space-y-2">
        <div className="flex items-center justify-between px-2 py-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#3A3C2E] border border-[#4C4E3E] flex items-center justify-center text-xs font-bold text-[#D9BA9B]">
              {settings.userName.charAt(0)}
            </div>
            <div className="leading-tight">
              <div className="text-xs font-medium text-[#EDE8DC]">
                {settings.userName}
              </div>
              <div className="text-[10px] text-[#8C9C8E] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8C9C8E] animate-pulse"></span>
                Mine Online
              </div>
            </div>
          </div>
          <button
            id="toggle-tts-btn"
            onClick={onToggleTTS}
            title={settings.ttsEnabled ? "Disable speech audio" : "Enable speech audio (TTS)"}
            className={`p-1.5 rounded-md border text-xs transition-colors ${
              settings.ttsEnabled
                ? "bg-[#45372B] text-[#D9BA9B] border-[#5E4B3A]"
                : "bg-[#333527] text-[#9E9887] border-[#444636] hover:text-[#EDE8DC]"
            }`}
          >
            {settings.ttsEnabled ? (
              <Volume2 className="w-3.5 h-3.5" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};
