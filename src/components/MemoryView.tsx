import React, { useState } from "react";
import {
  Brain,
  Plus,
  Trash2,
  Sparkles,
  Info,
  CheckCircle2,
  Tag,
} from "lucide-react";
import { MemoryItem, MemoryType, Priority } from "../types";

interface MemoryViewProps {
  memories: MemoryItem[];
  onAddMemory: (newMemory: Omit<MemoryItem, "id" | "createdAt">) => void;
  onDeleteMemory: (memoryId: string) => void;
}

export const MemoryView: React.FC<MemoryViewProps> = ({
  memories,
  onAddMemory,
  onDeleteMemory,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [type, setType] = useState<MemoryType>("preference");
  const [content, setContent] = useState("");
  const [importance, setImportance] = useState<Priority>("high");
  const [filterType, setFilterType] = useState<string>("all");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    onAddMemory({
      type,
      content: content.trim(),
      importance,
      source: "manual",
    });

    setContent("");
    setIsAddModalOpen(false);
  };

  const filteredMemories = memories.filter((mem) => {
    if (filterType === "all") return true;
    return mem.type === filterType;
  });

  const getTypeBadge = (mType: MemoryType) => {
    switch (mType) {
      case "preference":
        return "bg-[#FAF4ED] text-[#7A532C] border-[#EADBCE]";
      case "instruction":
        return "bg-[#FBF2F1] text-[#793731] border-[#F1D6D4]";
      case "project":
        return "bg-[#F7F5EE] text-[#5A5A40] border-[#DCD7C9]";
      case "routine":
        return "bg-[#EEF3EF] text-[#3D5440] border-[#D2DFD4]";
      case "fact":
        return "bg-[#F4F1EA] text-[#4F4E46] border-[#E8E4D9]";
    }
  };

  return (
    <div id="memory-view" className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-[#5A5A40]" />
            <h2 className="text-lg font-bold text-[#3D3D3D]">
              Long-term Memory Bank
            </h2>
          </div>
          <p className="text-xs text-[#8C8A7B] mt-0.5">
            Active preferences, instructions, and user facts that guide Mine
          </p>
        </div>

        <button
          id="open-add-memory-btn"
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-[#5A5A40] hover:bg-[#484833] text-[#FDFCF8] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs self-start"
        >
          <Plus className="w-4 h-4 text-[#E8E4D9]" />
          <span>+ Add Memory</span>
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-[#FAF4ED] border border-[#EADBCE] rounded-xl p-4 flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-[#A67C52] shrink-0 mt-0.5" />
        <div className="text-xs text-[#7A532C] leading-relaxed">
          <span className="font-bold">How Mine uses your memory:</span> These items are automatically loaded into Mine's cognitive context during every prompt. Mine adheres to your preferences (e.g. concise email drafting), respects your safety rules (e.g. asking before sending), and factors your ongoing projects into daily plans.
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
        {[
          { id: "all", label: "All Memories" },
          { id: "preference", label: "Preferences" },
          { id: "instruction", label: "Instructions" },
          { id: "project", label: "Projects" },
          { id: "routine", label: "Routines" },
          { id: "fact", label: "Facts" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterType(f.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterType === f.id
                ? "bg-[#5A5A40] text-[#FDFCF8] font-semibold"
                : "bg-white border border-[#E8E4D9] text-[#4F4E46] hover:bg-[#F7F5EE]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Memories Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMemories.map((mem) => (
          <div
            key={mem.id}
            id={`memory-item-${mem.id}`}
            className="bg-white p-4 rounded-xl border border-[#E8E4D9] hover:border-[#DCD7C9] transition-all space-y-2.5 shadow-xs relative group"
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getTypeBadge(
                  mem.type
                )}`}
              >
                {mem.type}
              </span>

              <div className="flex items-center gap-1">
                <span className="text-[10px] text-[#8C8A7B] capitalize">
                  {mem.source}
                </span>
                <button
                  onClick={() => onDeleteMemory(mem.id)}
                  title="Delete memory"
                  className="text-[#8C8A7B] hover:text-[#793731] p-1 rounded transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="text-xs text-[#3D3D3D] leading-relaxed font-medium">
              "{mem.content}"
            </p>

            <div className="flex items-center justify-between pt-1 border-t border-[#F0ECE1] text-[10px] text-[#8C8A7B]">
              <span>Importance: {mem.importance}</span>
              <span>Learned by Mine</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Memory Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-[#22241C]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E8E4D9] max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#F0ECE1] pb-3">
              <h3 className="text-sm font-bold text-[#3D3D3D]">
                Teach Mine a New Memory
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
                  Memory Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as MemoryType)}
                  className="w-full p-2 text-xs border border-[#E8E4D9] rounded-lg bg-[#FDFCF8] text-[#3D3D3D]"
                >
                  <option value="preference">Communication Preference</option>
                  <option value="instruction">Strict Rule / Instruction</option>
                  <option value="project">Ongoing Project Goal</option>
                  <option value="routine">Daily Routine</option>
                  <option value="fact">Personal / Academic Fact</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#4F4E46] block mb-1">
                  What should Mine remember?
                </label>
                <textarea
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="e.g. Always keep email replies under 4 sentences and confirm before sending."
                  className="w-full p-2.5 text-xs border border-[#E8E4D9] rounded-xl bg-[#FDFCF8] text-[#3D3D3D] focus:bg-white focus:outline-none focus:border-[#5A5A40]"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#4F4E46] block mb-1">
                  Importance
                </label>
                <select
                  value={importance}
                  onChange={(e) => setImportance(e.target.value as Priority)}
                  className="w-full p-2 text-xs border border-[#E8E4D9] rounded-lg bg-[#FDFCF8] text-[#3D3D3D]"
                >
                  <option value="high">High Importance</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
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
                  Save Memory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
