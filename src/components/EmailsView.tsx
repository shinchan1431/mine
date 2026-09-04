import React, { useState } from "react";
import {
  Mail,
  Send,
  Sparkles,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  Search,
  CheckCheck,
  User,
  Trash2,
} from "lucide-react";
import { Email, EmailImportance } from "../types";

interface EmailsViewProps {
  emails: Email[];
  onApproveAndSend: (emailId: string, replyText: string) => void;
  onGenerateDraft: (email: Email) => Promise<void>;
  onCreateTaskFromEmail: (email: Email) => void;
  onSimulateNewEmail: (newEmail: { sender: string; senderEmail: string; subject: string; body: string }) => Promise<void>;
  isGeneratingDraft: boolean;
}

export const EmailsView: React.FC<EmailsViewProps> = ({
  emails,
  onApproveAndSend,
  onGenerateDraft,
  onCreateTaskFromEmail,
  onSimulateNewEmail,
  isGeneratingDraft,
}) => {
  const [selectedEmailId, setSelectedEmailId] = useState<string>(emails[0]?.id || "");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [draftEdits, setDraftEdits] = useState<{ [id: string]: string }>({});
  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState(false);

  // New email simulation form state
  const [simSender, setSimSender] = useState("Internship Coordinator (Google APAC)");
  const [simEmail, setSimEmail] = useState("recruiting@google.com");
  const [simSubject, setSimSubject] = useState("Technical Interview Scheduling Confirmation");
  const [simBody, setSimBody] = useState(
    "Hi Shinsu,\n\nWe'd like to invite you for your 45-minute technical interview round next Monday, September 8 at 11:00 AM IST. Please confirm your availability and share your updated portfolio link by tomorrow evening.\n\nBest,\nSarah Chen\nTalent Team"
  );
  const [isSimulating, setIsSimulating] = useState(false);

  const selectedEmail = emails.find((e) => e.id === selectedEmailId) || emails[0];

  // Filtering
  const filteredEmails = emails.filter((email) => {
    const matchesSearch =
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.body.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterCategory === "all") return true;
    if (filterCategory === "urgent") return email.importance === "urgent";
    if (filterCategory === "requires_response") return email.requiresResponse;
    if (filterCategory === "drafted") return email.draftStatus === "drafted";
    if (filterCategory === "sent") return email.draftStatus === "sent";
    return true;
  });

  const getImportanceBadge = (importance: EmailImportance) => {
    switch (importance) {
      case "urgent":
        return "bg-[#FBF2F1] text-[#793731] border-[#F1D6D4]";
      case "important":
        return "bg-[#FAF4ED] text-[#7A532C] border-[#EADBCE]";
      case "normal":
        return "bg-[#F4F1EA] text-[#4F4E46] border-[#E8E4D9]";
      case "personal":
        return "bg-[#EEF3EF] text-[#3D5440] border-[#D2DFD4]";
      case "promotional":
        return "bg-[#F4F1EA] text-[#8C8A7B] border-[#E8E4D9]";
    }
  };

  const handleDraftChange = (emailId: string, text: string) => {
    setDraftEdits((prev) => ({ ...prev, [emailId]: text }));
  };

  const getActiveDraft = (email: Email) => {
    if (draftEdits[email.id] !== undefined) {
      return draftEdits[email.id];
    }
    return email.draftReply || "";
  };

  const handleSimulateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simSubject || !simBody) return;
    setIsSimulating(true);
    try {
      await onSimulateNewEmail({
        sender: simSender,
        senderEmail: simEmail,
        subject: simSubject,
        body: simBody,
      });
      setIsSimulateModalOpen(false);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div id="emails-view" className="flex h-full bg-[#FDFCF8] overflow-hidden">
      {/* Left Column: Email List */}
      <div className="w-80 md:w-96 bg-[#FFFFFF] border-r border-[#E8E4D9] flex flex-col shrink-0">
        {/* Header & Search */}
        <div className="p-4 border-b border-[#E8E4D9] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#5A5A40]" />
              <h2 className="text-sm font-bold text-[#3D3D3D]">
                Inbox Triage
              </h2>
            </div>
            <button
              id="simulate-incoming-email-btn"
              onClick={() => setIsSimulateModalOpen(true)}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-[#5A5A40] hover:bg-[#484833] text-[#FDFCF8] flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3 h-3 text-[#E8E4D9]" />
              <span>Simulate Email</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#8C8A7B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="email-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sender, subject, content..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#FDFCF8] border border-[#E8E4D9] rounded-lg text-xs text-[#3D3D3D] placeholder:text-[#9E9C8E] focus:outline-none focus:border-[#5A5A40]"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
            {[
              { id: "all", label: "All" },
              { id: "urgent", label: "Urgent" },
              { id: "requires_response", label: "Needs Reply" },
              { id: "drafted", label: "Draft Ready" },
              { id: "sent", label: "Sent" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterCategory(f.id)}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap font-medium transition-colors ${
                  filterCategory === f.id
                    ? "bg-[#5A5A40] text-[#FDFCF8] font-semibold"
                    : "bg-[#F4F1EA] text-[#4F4E46] hover:bg-[#EAE5DA]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Email Cards List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#F0ECE1]">
          {filteredEmails.map((email) => {
            const isSelected = selectedEmail?.id === email.id;
            return (
              <div
                key={email.id}
                id={`email-item-${email.id}`}
                onClick={() => setSelectedEmailId(email.id)}
                className={`p-3.5 cursor-pointer transition-colors space-y-1.5 ${
                  isSelected
                    ? "bg-[#FAF4ED] border-l-4 border-l-[#A67C52]"
                    : "hover:bg-[#FDFCF8]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#3D3D3D] truncate max-w-[170px]">
                    {email.sender}
                  </span>
                  <span className="text-[10px] text-[#8C8A7B]">
                    {email.receivedAt}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${getImportanceBadge(
                      email.importance
                    )}`}
                  >
                    {email.importance}
                  </span>
                  {email.draftStatus === "drafted" && (
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-[#FAF4ED] text-[#7A532C] border border-[#EADBCE]">
                      Draft Ready
                    </span>
                  )}
                  {email.draftStatus === "sent" && (
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-[#EEF3EF] text-[#3D5440] border border-[#D2DFD4] flex items-center gap-0.5">
                      <CheckCheck className="w-2.5 h-2.5" />
                      Sent
                    </span>
                  )}
                </div>

                <h4 className="text-xs font-semibold text-[#3D3D3D] line-clamp-1">
                  {email.subject}
                </h4>

                <p className="text-[11px] text-[#7A7869] line-clamp-2 leading-normal">
                  {email.snippet}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Email Reader & AI Draft Engine */}
      <div className="flex-1 bg-[#FDFCF8] overflow-y-auto p-6">
        {selectedEmail ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Email Header Card */}
            <div className="bg-white rounded-xl border border-[#E8E4D9] p-6 space-y-4 shadow-xs">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getImportanceBadge(
                        selectedEmail.importance
                      )}`}
                    >
                      {selectedEmail.importance}
                    </span>
                    <span className="text-xs font-semibold text-[#7A7869]">
                      {selectedEmail.category}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-[#3D3D3D]">
                    {selectedEmail.subject}
                  </h2>
                </div>
                <span className="text-xs text-[#8C8A7B] shrink-0">
                  {selectedEmail.receivedAt}
                </span>
              </div>

              {/* Sender Details */}
              <div className="flex items-center gap-3 pt-2 border-t border-[#F0ECE1]">
                <div className="w-9 h-9 rounded-full bg-[#F4F1EA] flex items-center justify-center font-bold text-[#5A5A40] text-xs">
                  {selectedEmail.sender.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#3D3D3D]">
                    {selectedEmail.sender}
                  </div>
                  <div className="text-[11px] text-[#8C8A7B]">
                    &lt;{selectedEmail.senderEmail}&gt; to {selectedEmail.recipient}
                  </div>
                </div>
              </div>

              {/* AI Executive Summary Card */}
              <div className="p-4 rounded-xl bg-[#FAF4ED] border border-[#EADBCE] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#7A532C]">
                    <Sparkles className="w-4 h-4 text-[#A67C52]" />
                    <span>Mine AI Executive Summary</span>
                  </div>
                  {selectedEmail.detectedDeadline && (
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#793731] bg-[#FBF2F1] px-2.5 py-0.5 rounded-full border border-[#F1D6D4]">
                      <Clock className="w-3 h-3 text-[#793731]" />
                      <span>Deadline: {selectedEmail.detectedDeadline}</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-[#3D3D3D] leading-relaxed">
                  {selectedEmail.aiSummary || "Analyzing email content..."}
                </p>

                {selectedEmail.detectedDeadline && (
                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-[11px] text-[#8C8A7B]">
                      Want Mine to schedule this into your tasks?
                    </span>
                    <button
                      id="create-task-from-email-btn"
                      onClick={() => onCreateTaskFromEmail(selectedEmail)}
                      className="text-xs font-semibold text-[#7A532C] hover:text-[#5C3B1A] flex items-center gap-1 bg-white hover:bg-[#FAF4ED] px-2.5 py-1 rounded-md border border-[#EADBCE] transition-colors shadow-xs"
                    >
                      <Plus className="w-3 h-3" />
                      Add to Task Board
                    </button>
                  </div>
                )}
              </div>

              {/* Email Raw Body */}
              <div className="pt-2 text-xs text-[#3D3D3D] leading-relaxed whitespace-pre-wrap font-sans">
                {selectedEmail.body}
              </div>
            </div>

            {/* Email Reply Workflow (AI Draft -> Review -> Approve -> Send) */}
            <div className="bg-white rounded-xl border border-[#E8E4D9] p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#F0ECE1] pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#A67C52]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#3D3D3D]">
                    Draft Reply Workflow (Approval Required)
                  </h3>
                </div>
                <span className="text-[11px] text-[#8C8A7B] italic">
                  AI suggests • You decide
                </span>
              </div>

              {selectedEmail.draftStatus === "sent" ? (
                <div className="p-4 rounded-xl bg-[#EEF3EF] border border-[#D2DFD4] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#3D5440]">
                    <CheckCircle2 className="w-4 h-4 text-[#3D5440]" />
                    <span>Email Response Sent Successfully</span>
                  </div>
                  <p className="text-xs text-[#435948]">
                    Sent to &lt;{selectedEmail.senderEmail}&gt; via Gmail API integration following your approval.
                  </p>
                  <div className="bg-white p-3 rounded-lg border border-[#D2DFD4] text-xs text-[#3D3D3D] whitespace-pre-wrap font-mono">
                    {selectedEmail.draftReply}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedEmail.draftReply || draftEdits[selectedEmail.id] ? (
                    <>
                      <div className="flex items-center justify-between text-xs text-[#7A7869]">
                        <span className="font-semibold text-[#3D3D3D]">
                          Proposed Reply (Editable):
                        </span>
                        <span className="text-[11px] text-[#8C8A7B]">
                          To: {selectedEmail.senderEmail}
                        </span>
                      </div>

                      <textarea
                        id="email-draft-textarea"
                        rows={6}
                        value={getActiveDraft(selectedEmail)}
                        onChange={(e) => handleDraftChange(selectedEmail.id, e.target.value)}
                        className="w-full p-3.5 text-xs text-[#3D3D3D] font-mono bg-[#FDFCF8] border border-[#DCD7C9] rounded-xl focus:outline-none focus:border-[#A67C52] focus:bg-white leading-relaxed"
                        placeholder="Type or edit reply..."
                      />

                      <div className="flex items-center justify-between pt-1">
                        <button
                          id="regenerate-draft-btn"
                          disabled={isGeneratingDraft}
                          onClick={() => onGenerateDraft(selectedEmail)}
                          className="text-xs font-medium text-[#4F4E46] hover:text-[#3D3D3D] flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E8E4D9] hover:bg-[#F7F5EE] transition-colors"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingDraft ? "animate-spin" : ""}`} />
                          <span>Regenerate with AI</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            id="approve-send-email-btn"
                            onClick={() => onApproveAndSend(selectedEmail.id, getActiveDraft(selectedEmail))}
                            className="px-4 py-2 bg-[#A67C52] hover:bg-[#8F6841] text-[#FDFCF8] font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Approve & Send Email</span>
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="p-6 text-center border-2 border-dashed border-[#E8E4D9] rounded-xl space-y-3">
                      <div className="w-10 h-10 rounded-full bg-[#FAF4ED] text-[#A67C52] flex items-center justify-center mx-auto">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#3D3D3D]">
                          No Draft Prepared Yet
                        </h4>
                        <p className="text-[11px] text-[#8C8A7B] max-w-sm mx-auto mt-0.5">
                          Mine can generate a customized response matching your communication preferences.
                        </p>
                      </div>
                      <button
                        id="generate-draft-btn"
                        disabled={isGeneratingDraft}
                        onClick={() => onGenerateDraft(selectedEmail)}
                        className="px-4 py-2 bg-[#5A5A40] hover:bg-[#484833] text-[#FDFCF8] text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs"
                      >
                        <Sparkles className={`w-3.5 h-3.5 text-[#E8E4D9] ${isGeneratingDraft ? "animate-spin" : ""}`} />
                        <span>{isGeneratingDraft ? "Drafting..." : "Draft Reply with Mine"}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-[#8C8A7B]">
            Select an email to view details and triage with Mine
          </div>
        )}
      </div>

      {/* Simulate Incoming Email Modal */}
      {isSimulateModalOpen && (
        <div className="fixed inset-0 bg-[#22241C]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E8E4D9] max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#F0ECE1] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#A67C52]" />
                <h3 className="text-sm font-bold text-[#3D3D3D]">
                  Simulate New Incoming Email
                </h3>
              </div>
              <button
                onClick={() => setIsSimulateModalOpen(false)}
                className="text-[#8C8A7B] hover:text-[#3D3D3D] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#7A7869]">
              Test how Mine's AI pipeline classifies urgency, scores importance, extracts deadlines, and drafts reply suggestions in real time.
            </p>

            <form onSubmit={handleSimulateSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-[#4F4E46] block mb-1">
                  Sender Name
                </label>
                <input
                  type="text"
                  value={simSender}
                  onChange={(e) => setSimSender(e.target.value)}
                  className="w-full p-2 text-xs border border-[#E8E4D9] rounded-lg bg-[#FDFCF8] text-[#3D3D3D] focus:bg-white focus:outline-none focus:border-[#5A5A40]"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#4F4E46] block mb-1">
                  Sender Email
                </label>
                <input
                  type="email"
                  value={simEmail}
                  onChange={(e) => setSimEmail(e.target.value)}
                  className="w-full p-2 text-xs border border-[#E8E4D9] rounded-lg bg-[#FDFCF8] text-[#3D3D3D] focus:bg-white focus:outline-none focus:border-[#5A5A40]"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#4F4E46] block mb-1">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={simSubject}
                  onChange={(e) => setSimSubject(e.target.value)}
                  className="w-full p-2 text-xs border border-[#E8E4D9] rounded-lg bg-[#FDFCF8] text-[#3D3D3D] focus:bg-white focus:outline-none focus:border-[#5A5A40]"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#4F4E46] block mb-1">
                  Email Body
                </label>
                <textarea
                  rows={4}
                  value={simBody}
                  onChange={(e) => setSimBody(e.target.value)}
                  className="w-full p-2 text-xs border border-[#E8E4D9] rounded-lg bg-[#FDFCF8] text-[#3D3D3D] focus:bg-white focus:outline-none focus:border-[#5A5A40]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSimulateModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs text-[#7A7869] hover:text-[#3D3D3D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSimulating}
                  className="px-4 py-2 bg-[#5A5A40] hover:bg-[#484833] text-[#FDFCF8] text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#E8E4D9]" />
                  <span>{isSimulating ? "Analyzing..." : "Inject & Triage"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
