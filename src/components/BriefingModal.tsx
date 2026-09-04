import React, { useState, useEffect } from "react";
import {
  SunMedium,
  Moon,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { BriefingData, Task, Email, ScheduleEvent, Reminder, UserSettings } from "../types";

interface BriefingModalProps {
  type: "morning" | "evening";
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  emails: Email[];
  schedule: ScheduleEvent[];
  reminders: Reminder[];
  settings: UserSettings;
}

export const BriefingModal: React.FC<BriefingModalProps> = ({
  type,
  isOpen,
  onClose,
  tasks,
  emails,
  schedule,
  reminders,
  settings,
}) => {
  const [briefing, setBriefing] = useState<BriefingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const fetchBriefing = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/briefing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type,
            context: {
              userName: settings.userName,
              tasks,
              emails,
              schedule,
              reminders,
            },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setBriefing(data);
        } else {
          throw new Error("Briefing request failed");
        }
      } catch (e) {
        // Fallback calculation
        const pendingHigh = tasks.filter((t) => t.status === "pending" && t.priority === "high");
        const urgentEmail = emails.find((e) => e.importance === "urgent");
        setBriefing({
          greeting: `Good ${type === "evening" ? "evening" : "morning"}, ${settings.userName}!`,
          summaryText:
            type === "morning"
              ? `You have ${tasks.filter((t) => t.status === "pending").length} pending tasks, ${schedule.length} scheduled blocks, and ${urgentEmail ? "1 urgent email requiring attention" : "no urgent email blockers"}.`
              : `Great work today! You completed ${tasks.filter((t) => t.status === "completed").length} tasks. There are ${tasks.filter((t) => t.status === "pending").length} pending items ready to roll over into tomorrow.`,
          topPriorities: [
            pendingHigh[0]?.title || "Finish SIH system documentation",
            urgentEmail ? `Reply to ${urgentEmail.sender} regarding deadline` : "Review today's study goals",
            "Maintain focus on high-impact milestone targets",
          ],
          scheduleHighlights: schedule.slice(0, 3).map((s) => `${s.startTime} - ${s.title}`),
          actionAdvice:
            type === "morning"
              ? "Review the drafted email for Prof. Kenneth before your 10:00 AM development sprint."
              : "Would you like to move remaining pending tasks to tomorrow's schedule?",
          quote: "Discipline is choosing between what you want now and what you want most.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBriefing();
  }, [isOpen, type]);

  const toggleSpeech = () => {
    if (!("speechSynthesis" in window) || !briefing) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const speechText = `${briefing.greeting}. ${briefing.summaryText}. Top priorities: ${briefing.topPriorities.join(
        ", "
      )}. ${briefing.actionAdvice}. Quote: ${briefing.quote}`;

      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#22241C]/45 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#E8E4D9] max-w-lg w-full p-6 space-y-5 shadow-2xl relative overflow-hidden">
        {/* Accent background glow */}
        <div
          className={`absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
            type === "morning" ? "bg-[#A67C52]/10" : "bg-[#5A5A40]/10"
          }`}
        ></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#F0ECE1] pb-3 relative z-10">
          <div className="flex items-center gap-2">
            {type === "morning" ? (
              <SunMedium className="w-5 h-5 text-[#A67C52]" />
            ) : (
              <Moon className="w-5 h-5 text-[#5A5A40]" />
            )}
            <h3 className="text-base font-bold text-[#3D3D3D] capitalize">
              {type} Executive Briefing
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleSpeech}
              title={isSpeaking ? "Stop audio" : "Read briefing aloud"}
              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                isSpeaking
                  ? "bg-[#FAF4ED] text-[#7A532C] border-[#EADBCE]"
                  : "bg-[#FDFCF8] text-[#4F4E46] border-[#E8E4D9] hover:bg-[#F7F5EE]"
              }`}
            >
              {isSpeaking ? (
                <VolumeX className="w-4 h-4 text-[#7A532C]" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={onClose}
              className="text-[#8C8A7B] hover:text-[#3D3D3D] text-sm font-bold p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="py-12 text-center space-y-3">
            <Sparkles className="w-6 h-6 text-[#A67C52] animate-spin mx-auto" />
            <p className="text-xs text-[#8C8A7B] font-medium">
              Mine is synthesizing your schedule, emails, and active tasks...
            </p>
          </div>
        ) : briefing ? (
          <div className="space-y-4 relative z-10">
            {/* Greeting & Summary */}
            <div>
              <h4 className="text-sm font-extrabold text-[#3D3D3D]">
                {briefing.greeting}
              </h4>
              <p className="text-xs text-[#4F4E46] leading-relaxed mt-1">
                {briefing.summaryText}
              </p>
            </div>

            {/* Top Priorities */}
            <div className="p-3.5 rounded-xl bg-[#FDFCF8] border border-[#E8E4D9] space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#8C8A7B] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#A67C52]" />
                <span>Today's Top Priorities</span>
              </div>
              <ul className="space-y-1.5 text-xs text-[#3D3D3D]">
                {briefing.topPriorities.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#E8E4D9] text-[#3D3D3D] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Schedule Highlights */}
            {briefing.scheduleHighlights && briefing.scheduleHighlights.length > 0 && (
              <div className="p-3.5 rounded-xl bg-[#FDFCF8] border border-[#E8E4D9] space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#8C8A7B] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#5A5A40]" />
                  <span>Key Agenda Blocks</span>
                </div>
                <div className="space-y-1 text-xs text-[#4F4E46]">
                  {briefing.scheduleHighlights.map((hl, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A67C52]"></span>
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Advice */}
            <div className="p-3 rounded-xl bg-[#FAF4ED] border border-[#EADBCE] text-xs text-[#7A532C] flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-[#A67C52] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Mine's Recommendation:</span>{" "}
                {briefing.actionAdvice}
              </div>
            </div>

            {/* Focus Quote */}
            {briefing.quote && (
              <div className="text-center pt-2">
                <p className="text-[11px] italic text-[#8C8A7B]">
                  "{briefing.quote}"
                </p>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-[#5A5A40] hover:bg-[#484833] text-[#FDFCF8] text-xs font-semibold rounded-xl transition-colors shadow-xs"
            >
              Acknowledge & Start
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
