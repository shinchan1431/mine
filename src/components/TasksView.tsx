import React, { useState } from "react";
import {
  CheckSquare,
  Plus,
  Clock,
  CheckCircle2,
  Trash2,
  Filter,
  Sparkles,
  Calendar,
  Tag,
  AlertCircle,
} from "lucide-react";
import { Task, Priority, TaskCategory } from "../types";

interface TasksViewProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (newTask: Omit<Task, "id" | "createdAt">) => void;
  onDeleteTask: (taskId: string) => void;
  onAskMineAboutTask: (taskTitle: string) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onAskMineAboutTask,
}) => {
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("pending");
  const [isAddingTask, setIsAddingTask] = useState(false);

  // New task form fields
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPriority, setNewPriority] = useState<Priority>("high");
  const [newCategory, setNewCategory] = useState<TaskCategory>("project");
  const [newDueAt, setNewDueAt] = useState("Today, 10:00 PM");
  const [newDuration, setNewDuration] = useState<number>(45);

  const filteredTasks = tasks.filter((task) => {
    if (filterStatus !== "all" && task.status !== filterStatus) return false;
    if (filterPriority !== "all" && task.priority !== filterPriority) return false;
    if (filterCategory !== "all" && task.category !== filterCategory) return false;
    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      title: newTitle.trim(),
      description: newDesc.trim() || undefined,
      priority: newPriority,
      status: "pending",
      category: newCategory,
      dueAt: newDueAt,
      estimatedMinutes: Number(newDuration) || 30,
    });

    setNewTitle("");
    setNewDesc("");
    setIsAddingTask(false);
  };

  const pendingCount = tasks.filter((t) => t.status === "pending").length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;

  return (
    <div id="tasks-view" className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#3D3D3D] flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-[#5A5A40]" />
            <span>Task Management</span>
          </h2>
          <p className="text-xs text-[#8C8A7B] mt-0.5">
            {pendingCount} pending • {completedCount} completed
          </p>
        </div>

        <button
          id="open-add-task-modal-btn"
          onClick={() => setIsAddingTask(true)}
          className="px-4 py-2 bg-[#5A5A40] hover:bg-[#484833] text-[#FDFCF8] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs shrink-0 self-start"
        >
          <Plus className="w-4 h-4 text-[#E8E4D9]" />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-3.5 rounded-xl border border-[#E8E4D9] flex flex-wrap items-center justify-between gap-3 shadow-xs">
        {/* Status filters */}
        <div className="flex items-center gap-1">
          {[
            { id: "pending", label: "Pending" },
            { id: "completed", label: "Completed" },
            { id: "all", label: "All Tasks" },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setFilterStatus(s.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterStatus === s.id
                  ? "bg-[#5A5A40] text-[#FDFCF8] font-semibold"
                  : "bg-[#F4F1EA] text-[#4F4E46] hover:bg-[#EAE5DA]"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Priority & Category selectors */}
        <div className="flex items-center gap-2 text-xs">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-2.5 py-1.5 bg-[#FDFCF8] border border-[#E8E4D9] rounded-lg text-[#3D3D3D] focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="high">🔴 High Priority</option>
            <option value="medium">🟠 Medium Priority</option>
            <option value="low">🟢 Low Priority</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-2.5 py-1.5 bg-[#FDFCF8] border border-[#E8E4D9] rounded-lg text-[#3D3D3D] focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="project">Projects</option>
            <option value="study">Study</option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-white p-8 text-center rounded-xl border border-[#E8E4D9] text-[#8C8A7B] text-xs space-y-2">
            <CheckCircle2 className="w-8 h-8 mx-auto text-[#C7C3B6]" />
            <p>No tasks found matching current filter.</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              id={`task-card-${task.id}`}
              className={`bg-white p-4 rounded-xl border transition-all flex items-start justify-between gap-3 shadow-xs ${
                task.status === "completed"
                  ? "border-[#E8E4D9] bg-[#F7F5EE]/50 opacity-70"
                  : task.priority === "high"
                  ? "border-[#F1D6D4] hover:border-[#E8B8B4]"
                  : "border-[#E8E4D9] hover:border-[#DCD7C9]"
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1">
                <button
                  id={`toggle-task-${task.id}`}
                  onClick={() => onToggleTask(task.id)}
                  className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                    task.status === "completed"
                      ? "bg-[#435948] border-[#435948] text-white"
                      : "border-[#DCD7C9] hover:border-[#A67C52] bg-[#FDFCF8]"
                  }`}
                >
                  {task.status === "completed" && (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                </button>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                        task.priority === "high"
                          ? "bg-[#FBF2F1] text-[#793731] border-[#F1D6D4]"
                          : task.priority === "medium"
                          ? "bg-[#FAF4ED] text-[#7A532C] border-[#EADBCE]"
                          : "bg-[#EEF3EF] text-[#3D5440] border-[#D2DFD4]"
                      }`}
                    >
                      {task.priority}
                    </span>

                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F4F1EA] text-[#4F4E46] capitalize">
                      {task.category}
                    </span>

                    <span className="text-[11px] text-[#8C8A7B] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Due: {task.dueAt}
                    </span>

                    {task.estimatedMinutes && (
                      <span className="text-[11px] text-[#9E9C8E]">
                        ({task.estimatedMinutes}m est.)
                      </span>
                    )}
                  </div>

                  <h3
                    className={`text-xs font-bold ${
                      task.status === "completed"
                        ? "line-through text-[#9E9C8E]"
                        : "text-[#3D3D3D]"
                    }`}
                  >
                    {task.title}
                  </h3>

                  {task.description && (
                    <p className="text-[11px] text-[#7A7869] leading-relaxed">
                      {task.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => onAskMineAboutTask(task.title)}
                  title="Ask Mine to break this down or assist"
                  className="p-1.5 text-[#8C8A7B] hover:text-[#A67C52] rounded-md hover:bg-[#F7F5EE] transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteTask(task.id)}
                  title="Delete task"
                  className="p-1.5 text-[#8C8A7B] hover:text-[#793731] rounded-md hover:bg-[#F7F5EE] transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Task Modal */}
      {isAddingTask && (
        <div className="fixed inset-0 bg-[#22241C]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E8E4D9] max-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#F0ECE1] pb-3">
              <h3 className="text-sm font-bold text-[#3D3D3D]">
                Create New Task
              </h3>
              <button
                onClick={() => setIsAddingTask(false)}
                className="text-[#8C8A7B] hover:text-[#3D3D3D] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-[#4F4E46] block mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Finish SIH system architecture diagrams"
                  className="w-full p-2.5 text-xs border border-[#E8E4D9] rounded-xl bg-[#FDFCF8] text-[#3D3D3D] focus:bg-white focus:outline-none focus:border-[#5A5A40]"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#4F4E46] block mb-1">
                  Description / Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Details, link, or sub-points..."
                  className="w-full p-2.5 text-xs border border-[#E8E4D9] rounded-xl bg-[#FDFCF8] text-[#3D3D3D] focus:bg-white focus:outline-none focus:border-[#5A5A40]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#4F4E46] block mb-1">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as Priority)}
                    className="w-full p-2 text-xs border border-[#E8E4D9] rounded-lg bg-[#FDFCF8] text-[#3D3D3D]"
                  >
                    <option value="high">🔴 High Priority</option>
                    <option value="medium">🟠 Medium Priority</option>
                    <option value="low">🟢 Low Priority</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#4F4E46] block mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as TaskCategory)}
                    className="w-full p-2 text-xs border border-[#E8E4D9] rounded-lg bg-[#FDFCF8] text-[#3D3D3D]"
                  >
                    <option value="project">Project</option>
                    <option value="study">Study</option>
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#4F4E46] block mb-1">
                    Due Date / Time
                  </label>
                  <input
                    type="text"
                    value={newDueAt}
                    onChange={(e) => setNewDueAt(e.target.value)}
                    placeholder="e.g. Today, 10:00 PM"
                    className="w-full p-2 text-xs border border-[#E8E4D9] rounded-lg bg-[#FDFCF8] text-[#3D3D3D]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#4F4E46] block mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full p-2 text-xs border border-[#E8E4D9] rounded-lg bg-[#FDFCF8] text-[#3D3D3D]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddingTask(false)}
                  className="px-3.5 py-1.5 text-xs text-[#7A7869] hover:text-[#3D3D3D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#5A5A40] hover:bg-[#484833] text-[#FDFCF8] text-xs font-semibold rounded-xl transition-colors"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
