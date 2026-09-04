import React, { useState } from "react";
import { Clock, Plus, Bell, X } from "lucide-react";
import { Reminder, Task, RepeatRule } from "../types";

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddReminder: (newReminder: Omit<Reminder, "id" | "createdAt">) => void;
  tasks: Task[];
}

export const ReminderModal: React.FC<ReminderModalProps> = ({
  isOpen,
  onClose,
  onAddReminder,
  tasks,
}) => {
  const [title, setTitle] = useState("");
  const [remindAt, setRemindAt] = useState("Today at 9:00 PM");
  const [repeatRule, setRepeatRule] = useState<RepeatRule>("none");
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddReminder({
      title: title.trim(),
      remindAt,
      repeatRule,
      taskId: selectedTaskId || undefined,
      status: "pending",
    });

    setTitle("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#22241C]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#E8E4D9] max-w-md w-full p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#F0ECE1] pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#A67C52]" />
            <h3 className="text-sm font-bold text-[#3D3D3D]">
              Schedule Smart Reminder
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#8C8A7B] hover:text-[#3D3D3D] text-sm font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-[#4F4E46] block mb-1">
              Reminder Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Review professor's submission format"
              className="w-full p-2.5 text-xs border border-[#E8E4D9] rounded-xl bg-[#FDFCF8] text-[#3D3D3D] focus:bg-white focus:outline-none focus:border-[#5A5A40]"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#4F4E46] block mb-1">
              When to Remind
            </label>
            <input
              type="text"
              value={remindAt}
              onChange={(e) => setRemindAt(e.target.value)}
              placeholder="e.g. Tomorrow at 9:00 AM or in 30 minutes"
              className="w-full p-2.5 text-xs border border-[#E8E4D9] rounded-xl bg-[#FDFCF8] text-[#3D3D3D] focus:bg-white focus:outline-none focus:border-[#5A5A40]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-[#4F4E46] block mb-1">
                Repeat Rule
              </label>
              <select
                value={repeatRule}
                onChange={(e) => setRepeatRule(e.target.value as RepeatRule)}
                className="w-full p-2 text-xs border border-[#E8E4D9] rounded-lg bg-[#FDFCF8] text-[#3D3D3D]"
              >
                <option value="none">One-time</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#4F4E46] block mb-1">
                Link to Task (Optional)
              </label>
              <select
                value={selectedTaskId}
                onChange={(e) => setSelectedTaskId(e.target.value)}
                className="w-full p-2 text-xs border border-[#E8E4D9] rounded-lg bg-[#FDFCF8] text-[#3D3D3D]"
              >
                <option value="">None</option>
                {tasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title.slice(0, 24)}...
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-[#7A7869] hover:text-[#3D3D3D]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#5A5A40] hover:bg-[#484833] text-[#FDFCF8] text-xs font-semibold rounded-xl transition-colors"
            >
              Create Reminder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
