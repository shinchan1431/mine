import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  Bot,
  User,
  Mic,
  MicOff,
  Volume2,
  CheckCircle2,
  Clock,
  Mail,
  Calendar,
  Brain,
  ShieldCheck,
  AlertCircle,
  Plus,
  ArrowRight,
} from "lucide-react";
import { ChatMessage, ProposedAction, ToolCallItem, UserSettings } from "../types";

interface AssistantViewProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  onApproveAction: (action: ProposedAction) => void;
  onRejectAction: (actionId: string) => void;
  settings: UserSettings;
  onNavigateTab: (tab: any) => void;
}

export const AssistantView: React.FC<AssistantViewProps> = ({
  messages,
  onSendMessage,
  isLoading,
  onApproveAction,
  onRejectAction,
  settings,
  onNavigateTab,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Speech Recognition setup
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputValue((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. You can type your request directly.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    const text = inputValue.trim();
    setInputValue("");
    await onSendMessage(text);
  };

  // Speak message out loud via SpeechSynthesis
  const speakMessage = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`•]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const quickCommands = [
    { label: "What should I do today?", icon: Sparkles },
    { label: "+ New Task", icon: Plus, prompt: "Create a new task: " },
    { label: "+ Reminder", icon: Clock, prompt: "Remind me " },
    { label: "📧 Check Important Emails", icon: Mail, prompt: "Show me my important emails and deadlines" },
    { label: "📅 Today's Schedule", icon: Calendar, prompt: "What is my schedule for today?" },
    { label: "☀️ Daily Briefing", icon: Sparkles, prompt: "Give me my daily morning briefing" },
  ];

  return (
    <div id="assistant-view" className="flex flex-col h-full bg-[#FDFCF8]">
      {/* Top Banner / Quick Action Chips */}
      <div className="bg-[#FFFFFF] border-b border-[#E8E4D9] px-6 py-3 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C8A7B] shrink-0 mr-1">
          Quick Commands:
        </span>
        {quickCommands.map((cmd, idx) => {
          const Icon = cmd.icon;
          return (
            <button
              key={idx}
              id={`quick-cmd-${idx}`}
              onClick={() => {
                if (cmd.prompt) {
                  setInputValue(cmd.prompt);
                } else {
                  onSendMessage(cmd.label);
                }
              }}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-[#E8E4D9] bg-[#F7F5EE] hover:bg-[#EFECE3] hover:border-[#DCD7C9] text-[#4F4E46] transition-colors shrink-0 font-medium"
            >
              <Icon className="w-3.5 h-3.5 text-[#A67C52]" />
              <span>{cmd.label}</span>
            </button>
          );
        })}
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {messages.map((msg) => {
          const isAssistant = msg.role === "assistant";
          return (
            <div
              key={msg.id}
              id={`chat-msg-${msg.id}`}
              className={`flex gap-3 max-w-3xl ${
                isAssistant ? "mr-auto" : "ml-auto flex-row-reverse"
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                  isAssistant
                    ? "bg-gradient-to-tr from-[#A67C52] to-[#C49566] text-[#FDFCF8] shadow-xs"
                    : "bg-[#5A5A40] text-[#FDFCF8]"
                }`}
              >
                {isAssistant ? "M" : settings.userName.charAt(0)}
              </div>

              {/* Message Content */}
              <div className="space-y-2 max-w-[85%]">
                <div
                  className={`p-4 rounded-xl text-xs leading-relaxed ${
                    isAssistant
                      ? "bg-[#FFFFFF] border border-[#E8E4D9] text-[#3D3D3D] shadow-xs whitespace-pre-line"
                      : "bg-[#5A5A40] text-[#FDFCF8] whitespace-pre-line shadow-xs"
                  }`}
                >
                  {msg.content}

                  {/* Tool Execution Badges if any */}
                  {msg.toolCalls && msg.toolCalls.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#F0ECE1] space-y-1.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#8C8A7B] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#435948]" />
                        Actions Executed:
                      </div>
                      {msg.toolCalls.map((tc, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-[11px] bg-[#F7F5EE] px-2.5 py-1 rounded border border-[#E8E4D9] text-[#4F4E46]"
                        >
                          <span className="font-semibold text-[#7A532C] uppercase text-[10px]">
                            {tc.name}
                          </span>
                          <span>•</span>
                          <span className="truncate">
                            {tc.result || JSON.stringify(tc.args)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Proposed Action Approval Card (AI proposes, User decides) */}
                {msg.proposedAction && msg.proposedAction.status === "pending_approval" && (
                  <div
                    id={`proposed-action-${msg.proposedAction.id}`}
                    className="p-4 rounded-xl border border-[#EADBCE] bg-[#FAF4ED] shadow-xs space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#A67C52] flex items-center justify-center text-[#FDFCF8] font-bold text-xs">
                        !
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#7A532C]">
                          Confirmation Required: {msg.proposedAction.title}
                        </h4>
                        <p className="text-[11px] text-[#8C6B4B]">
                          {msg.proposedAction.description}
                        </p>
                      </div>
                    </div>

                    {msg.proposedAction.payload?.body && (
                      <div className="bg-white p-3 rounded-lg border border-[#EADBCE] text-[11px] text-[#3D3D3D] font-mono whitespace-pre-wrap">
                        {msg.proposedAction.payload.body}
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        id="approve-action-btn"
                        onClick={() => onApproveAction(msg.proposedAction!)}
                        className="px-3.5 py-1.5 bg-[#A67C52] hover:bg-[#8F6841] text-[#FDFCF8] font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Approve & Execute
                      </button>
                      <button
                        id="reject-action-btn"
                        onClick={() => onRejectAction(msg.proposedAction!.id)}
                        className="px-3 py-1.5 bg-[#FFFFFF] hover:bg-[#F7F5EE] text-[#4F4E46] font-medium text-xs rounded-lg border border-[#E8E4D9] transition-colors"
                      >
                        Cancel
                      </button>
                      {msg.proposedAction.type === "send_email" && (
                        <button
                          onClick={() => onNavigateTab("emails")}
                          className="text-xs font-semibold text-[#7A532C] hover:text-[#5C3B1A] ml-auto flex items-center gap-1 underline"
                        >
                          Review in Emails Tab
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Footer details: time + TTS speak button */}
                <div className="flex items-center gap-2 text-[10px] text-[#8C8A7B] px-1">
                  <span>{msg.timestamp}</span>
                  {isAssistant && (
                    <button
                      onClick={() => speakMessage(msg.content)}
                      title="Read aloud"
                      className="hover:text-[#3D3D3D] transition-colors"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-center gap-3 max-w-md mr-auto">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#A67C52] to-[#C49566] text-[#FDFCF8] flex items-center justify-center text-xs font-bold">
              M
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-[#E8E4D9] text-xs text-[#7A7869] flex items-center gap-2 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#A67C52] animate-ping"></span>
              <span>Mine is thinking and formulating actions...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-[#FFFFFF] border-t border-[#E8E4D9]">
        <form onSubmit={handleSend} className="flex items-center gap-2 max-w-4xl mx-auto">
          {/* Speech-to-text mic */}
          <button
            type="button"
            id="assistant-voice-input-btn"
            onClick={toggleListening}
            title={isListening ? "Listening... click to stop" : "Speak to Mine"}
            className={`p-2.5 rounded-xl border transition-all ${
              isListening
                ? "bg-[#793731] text-white border-[#5B2925] animate-pulse shadow-md"
                : "bg-[#F7F5EE] text-[#5A5A40] border-[#E8E4D9] hover:bg-[#EFECE3] hover:text-[#3D3D3D]"
            }`}
          >
            {isListening ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>

          <input
            id="assistant-chat-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              isListening
                ? "Listening to you speak..."
                : "Ask Mine to schedule events, create tasks, draft email replies, or set reminders..."
            }
            className="flex-1 px-4 py-2.5 bg-[#FDFCF8] border border-[#E8E4D9] rounded-xl text-xs text-[#3D3D3D] placeholder:text-[#9E9C8E] focus:outline-none focus:border-[#5A5A40] focus:bg-white transition-colors"
          />

          <button
            id="assistant-send-btn"
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="px-4 py-2.5 bg-[#5A5A40] hover:bg-[#484833] disabled:opacity-50 text-[#FDFCF8] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5 text-[#E8E4D9]" />
          </button>
        </form>
      </div>
    </div>
  );
};
