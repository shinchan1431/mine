import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ScheduleEvent, ScheduleCategory } from "../types";

interface ScheduleViewProps {
  schedule: ScheduleEvent[];
  onAddEvent: (newEvent: Omit<ScheduleEvent, "id">) => void;
  onDeleteEvent: (eventId: string) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  schedule,
  onAddEvent,
  onDeleteEvent,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [startTime, setStartTime] = useState("14:00");
  const [endTime, setEndTime] = useState("15:30");
  const [category, setCategory] = useState<ScheduleCategory>("work");

  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const getCategoryColor = (cat: ScheduleCategory) => {
    switch (cat) {
      case "meeting":
        return "border-[#EADBCE] bg-[#FAF4ED] text-[#7A532C]";
      case "work":
        return "border-[#DCD7C9] bg-[#F7F5EE] text-[#3D3D3D]";
      case "break":
        return "border-[#D2DFD4] bg-[#EEF3EF] text-[#3D5440]";
      case "study":
        return "border-[#F1D6D4] bg-[#FBF2F1] text-[#793731]";
      case "review":
        return "border-[#E3DCD3] bg-[#F5F2EB] text-[#5A5A40]";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddEvent({
      title: title.trim(),
      description: desc.trim() || undefined,
      startTime,
      endTime,
      date: new Date().toISOString().split("T")[0],
      category,
    });

    setTitle("");
    setDesc("");
    setIsAddModalOpen(false);
  };

  // Sort schedule by start time
  const sortedSchedule = [...schedule].sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  );

  return (
    <div id="schedule-view" className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-[#5A5A40]" />
            <h2 className="text-lg font-bold text-[#3D3D3D]">
              Daily Schedule & Time Blocks
            </h2>
          </div>
          <p className="text-xs text-[#8C8A7B] mt-0.5">
            {todayStr} • {schedule.length} active time blocks
          </p>
        </div>

        <button
          id="open-add-event-btn"
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-[#5A5A40] hover:bg-[#484833] text-[#FDFCF8] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs self-start"
        >
          <Plus className="w-4 h-4 text-[#E8E4D9]" />
          <span>+ Block Time</span>
        </button>
      </div>

      {/* Schedule Timeline View */}
      <div className="bg-white rounded-2xl border border-[#E8E4D9] p-6 shadow-xs space-y-4">
        <div className="space-y-3">
          {sortedSchedule.map((item, index) => (
            <div
              key={item.id}
              id={`schedule-item-${item.id}`}
              className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 shadow-xs ${getCategoryColor(
                item.category
              )}`}
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-white/90 border border-current/20 text-[#3D3D3D]">
                    {item.startTime} – {item.endTime}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/80 border border-current/20">
                    {item.category}
                  </span>
                </div>

                <h3 className="text-sm font-bold pt-1 text-[#3D3D3D]">
                  {item.title}
                </h3>

                {item.description && (
                  <p className="text-xs text-[#7A7869] leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>

              <button
                onClick={() => onDeleteEvent(item.id)}
                title="Remove event"
                className="text-[#8C8A7B] hover:text-[#793731] p-1 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Event Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-[#22241C]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E8E4D9] max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#F0ECE1] pb-3">
              <h3 className="text-sm font-bold text-[#3D3D3D]">
                Add Schedule Event
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#8C8A7B] hover:text-[#3D3D3D] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-[#4F4E46] block mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. SIH Presentation Sync"
                  className="w-full p-2.5 text-xs border border-[#E8E4D9] rounded-xl bg-[#FDFCF8] text-[#3D3D3D] focus:bg-white focus:outline-none focus:border-[#5A5A40]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#4F4E46] block mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-2 text-xs border border-[#E8E4D9] rounded-lg bg-[#FDFCF8] text-[#3D3D3D]"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#4F4E46] block mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full p-2 text-xs border border-[#E8E4D9] rounded-lg bg-[#FDFCF8] text-[#3D3D3D]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#4F4E46] block mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ScheduleCategory)}
                  className="w-full p-2 text-xs border border-[#E8E4D9] rounded-lg bg-[#FDFCF8] text-[#3D3D3D]"
                >
                  <option value="work">Work Block</option>
                  <option value="study">Study / Academic</option>
                  <option value="meeting">Team Meeting / Sync</option>
                  <option value="break">Break / Lunch / Recharge</option>
                  <option value="review">Review / Daily Wrap-up</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#4F4E46] block mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Agenda points or location..."
                  className="w-full p-2.5 text-xs border border-[#E8E4D9] rounded-xl bg-[#FDFCF8] text-[#3D3D3D] focus:bg-white focus:outline-none focus:border-[#5A5A40]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs text-[#7A7869] hover:text-[#3D3D3D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#5A5A40] hover:bg-[#484833] text-[#FDFCF8] text-xs font-semibold rounded-xl transition-colors"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
