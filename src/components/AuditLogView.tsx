import React from "react";
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileCode,
} from "lucide-react";
import { AuditLogEntry } from "../types";

interface AuditLogViewProps {
  logs: AuditLogEntry[];
  onClearLogs?: () => void;
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ logs, onClearLogs }) => {
  const getStatusBadge = (status: AuditLogEntry["status"]) => {
    switch (status) {
      case "approved":
        return "bg-[#FAF4ED] text-[#7A532C] border-[#EADBCE]";
      case "executed":
        return "bg-[#EEF3EF] text-[#3D5440] border-[#D2DFD4]";
      case "rejected":
      case "cancelled":
        return "bg-[#F4F1EA] text-[#4F4E46] border-[#E8E4D9]";
    }
  };

  return (
    <div id="audit-log-view" className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#5A5A40]" />
          <h2 className="text-lg font-bold text-[#3D3D3D]">
            Safety & Audit Transparency Log
          </h2>
        </div>
        <p className="text-xs text-[#8C8A7B] mt-0.5">
          Verifiable record of every AI tool call, user confirmation, and system execution.
        </p>
      </div>

      {/* Safety Principle Banner */}
      <div className="p-4 rounded-xl bg-[#2A2C22] text-[#FDFCF8] border border-[#3E4032] space-y-1 shadow-xs">
        <h4 className="text-xs font-bold text-[#E8E4D9]">
          Core Safety Invariant: "AI thinks and proposes. Shinsu controls and approves."
        </h4>
        <p className="text-[11px] text-[#C7C3B6] leading-relaxed">
          High-impact tools like sending emails or bulk editing schedules will never execute autonomously without an explicit user confirmation signature in the UI.
        </p>
      </div>

      {/* Logs Table / List */}
      <div className="bg-white rounded-2xl border border-[#E8E4D9] shadow-xs overflow-hidden">
        <div className="divide-y divide-[#F0ECE1]">
          {logs.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#8C8A7B]">
              No audit log entries recorded yet.
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                id={`audit-entry-${log.id}`}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F7F5EE]/60 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#3D3D3D]">
                      {log.action}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F4F1EA] text-[#4F4E46] border border-[#E8E4D9]">
                      tool: {log.toolName}
                    </span>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${getStatusBadge(
                        log.status
                      )}`}
                    >
                      {log.status}
                    </span>
                  </div>

                  <p className="text-xs text-[#7A7869]">
                    <span className="font-semibold text-[#4F4E46]">Target:</span>{" "}
                    {log.inputSummary}
                  </p>

                  <p className="text-[11px] text-[#8C8A7B] font-mono">
                    result: {log.result}
                  </p>
                </div>

                <div className="text-[11px] text-[#8C8A7B] flex items-center gap-1 shrink-0">
                  <Clock className="w-3 h-3" />
                  <span>{log.timestamp}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
