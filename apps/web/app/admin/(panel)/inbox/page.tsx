"use client";

import React, { useState, useEffect } from "react";
import { adminFetch } from "@/lib/admin-api";
import {
  Inbox,
  Mail,
  UserCheck,
  CheckCircle2,
  Clock,
  Trash2,
  ExternalLink,
  MessageSquare,
  Search,
  Phone,
  Calendar,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useConfirm } from "@/components/admin/ui/ConfirmDialog";
import { Select } from "@/components/admin/ui/Select";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  interest?: string;
  message: string;
  status: string;
  notes?: string;
  createdAt: string;
}

interface VolunteerApplication {
  id: string;
  name: string;
  phone: string;
  email: string;
  city?: string;
  skills?: string;
  availability?: string;
  message?: string;
  status: string;
  notes?: string;
  createdAt: string;
}

export default function InboxPage() {
  const { confirm, ConfirmComponent } = useConfirm();
  const [tab, setTab] = useState<"messages" | "volunteers">("messages");
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [volunteers, setVolunteers] = useState<VolunteerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    loadData();
  }, [tab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (tab === "messages") {
        const data = await adminFetch("/admin/inbox/messages");
        setMessages(Array.isArray(data) ? data : []);
      } else {
        const data = await adminFetch("/admin/inbox/volunteers");
        setVolunteers(Array.isArray(data) ? data : []);
      }
    } catch {
      toast.error("Failed to load inbox items.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMessageStatus = async (id: string, status: string) => {
    try {
      const updated = await adminFetch(`/admin/inbox/messages/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status: updated.status } : m)));
      toast.success("Status updated.");
    } catch {
      toast.error("Failed to update status.");
    }
  };

  const handleUpdateVolunteerStatus = async (id: string, status: string) => {
    try {
      const updated = await adminFetch(`/admin/inbox/volunteers/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setVolunteers((prev) => prev.map((v) => (v.id === id ? { ...v, status: updated.status } : v)));
      toast.success("Status updated.");
    } catch {
      toast.error("Failed to update status.");
    }
  };

  const handleDeleteMessage = async (msg: ContactMessage) => {
    const isConfirmed = await confirm({
      title: `Delete message from ${msg.name}?`,
      description: "This will remove the message inquiry from the inbox.",
      confirmLabel: "Delete Message",
      variant: "danger",
    });

    if (!isConfirmed) return;

    try {
      await adminFetch(`/admin/inbox/messages/${msg.id}`, { method: "DELETE" });
      setMessages((prev) => prev.filter((m) => m.id !== msg.id));
      toast.success("Message deleted.");
    } catch {
      toast.error("Failed to delete message.");
    }
  };

  const handleDeleteVolunteer = async (vol: VolunteerApplication) => {
    const isConfirmed = await confirm({
      title: `Delete volunteer application for ${vol.name}?`,
      description: "This will permanently remove the application record from the inbox.",
      confirmLabel: "Delete Application",
      variant: "danger",
    });

    if (!isConfirmed) return;


    try {
      await adminFetch(`/admin/inbox/volunteers/${vol.id}`, { method: "DELETE" });
      setVolunteers((prev) => prev.filter((v) => v.id !== vol.id));
      toast.success("Volunteer application deleted.");
    } catch {
      toast.error("Failed to delete application.");
    }
  };

  const filteredMessages = messages.filter((m) => {
    const matchesSearch =
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase()) ||
      m.message?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredVolunteers = volunteers.filter((v) => {
    const matchesSearch =
      v.name?.toLowerCase().includes(search.toLowerCase()) ||
      v.email?.toLowerCase().includes(search.toLowerCase()) ||
      v.city?.toLowerCase().includes(search.toLowerCase()) ||
      v.skills?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {ConfirmComponent}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/30 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-maroon/10 text-maroon">
              <Inbox className="w-5 h-5 text-maroon" />
            </span>
            <h1 className="text-2xl font-serif font-bold text-maroon">
              Inbox & Public Inquiries
            </h1>
          </div>
          <p className="text-xs text-ink-muted font-sans">
            Direct communications submitted by devotees, visitors, and volunteers through the public website.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-paper p-1 rounded-2xl border border-gold/30">
          <button
            type="button"
            onClick={() => setTab("messages")}
            className={`px-4 py-2 rounded-xl text-xs font-serif font-bold flex items-center gap-2 transition-all ${
              tab === "messages"
                ? "bg-maroon text-cream shadow-xs"
                : "text-ink-muted hover:text-maroon"
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Messages ({messages.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setTab("volunteers")}
            className={`px-4 py-2 rounded-xl text-xs font-serif font-bold flex items-center gap-2 transition-all ${
              tab === "volunteers"
                ? "bg-maroon text-cream shadow-xs"
                : "text-ink-muted hover:text-maroon"
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Volunteer Applications ({volunteers.length})</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-paper p-3 rounded-2xl border border-gold/30">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-cream/40 border border-border focus:border-gold outline-none"
          />
        </div>

        <div className="w-44">
          <Select
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            options={[
              { label: "All Statuses", value: "ALL" },
              { label: "New", value: "NEW" },
              { label: tab === "messages" ? "Replied" : "Accepted", value: tab === "messages" ? "REPLIED" : "ACCEPTED" },
              { label: "Archived", value: "ARCHIVED" },
            ]}
          />
        </div>
      </div>

      {/* Content Feed */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-ink-muted">
          <Loader2 className="w-8 h-8 animate-spin text-saffron" />
          <span className="text-xs font-serif">Loading inquiries...</span>
        </div>
      ) : tab === "messages" ? (
        filteredMessages.length === 0 ? (
          <div className="py-20 bg-paper rounded-3xl border border-dashed border-gold/40 text-center space-y-2">
            <Mail className="w-12 h-12 mx-auto text-gold/40" />
            <p className="text-sm font-serif font-bold text-maroon">No contact messages found</p>
            <p className="text-xs text-ink-muted">Inquiries sent from the public Contact form will arrive here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMessages.map((msg) => (
              <div
                key={msg.id}
                className="p-5 rounded-2xl bg-paper border border-gold/20 shadow-2xs hover:shadow-md transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-3">
                  <div>
                    <h3 className="font-serif font-bold text-sm text-maroon flex items-center gap-2">
                      <span>{msg.name}</span>
                      {msg.interest && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold bg-sand text-ink-muted">
                          {msg.interest}
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center gap-3 text-[11px] text-ink-muted mt-0.5">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-gold" /> {msg.email}
                      </span>
                      {msg.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-gold" /> {msg.phone}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gold" />{" "}
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        msg.status === "NEW"
                          ? "bg-amber-100 text-amber-800"
                          : msg.status === "REPLIED"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {msg.status}
                    </span>

                    <a
                      href={`mailto:${msg.email}?subject=Response from Kushbhawanpur Foundation`}
                      className="px-2.5 py-1 rounded-xl bg-sand/30 hover:bg-sand/60 text-maroon text-xs font-serif font-semibold border border-gold/30 flex items-center gap-1"
                    >
                      <Mail className="w-3.5 h-3.5 text-saffron" />
                      <span>Reply</span>
                    </a>

                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateMessageStatus(
                          msg.id,
                          msg.status === "REPLIED" ? "ARCHIVED" : "REPLIED"
                        )
                      }
                      className="px-2.5 py-1 rounded-xl bg-paper hover:bg-sand/40 text-ink-muted hover:text-maroon text-xs font-serif border border-border"
                    >
                      {msg.status === "REPLIED" ? "Archive" : "Mark Replied"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteMessage(msg)}
                      className="p-1 rounded-lg text-ink-muted hover:text-red-700 hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-charcoal/90 whitespace-pre-wrap leading-relaxed font-sans bg-cream/30 p-3 rounded-xl border border-border/40">
                  {msg.message}
                </p>
              </div>
            ))}
          </div>
        )
      ) : filteredVolunteers.length === 0 ? (
        <div className="py-20 bg-paper rounded-3xl border border-dashed border-gold/40 text-center space-y-2">
          <UserCheck className="w-12 h-12 mx-auto text-gold/40" />
          <p className="text-sm font-serif font-bold text-maroon">No volunteer applications found</p>
          <p className="text-xs text-ink-muted">Applications submitted from "Get Involved" modal will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredVolunteers.map((vol) => (
            <div
              key={vol.id}
              className="p-5 rounded-2xl bg-paper border border-gold/20 shadow-2xs hover:shadow-md transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-3">
                <div>
                  <h3 className="font-serif font-bold text-sm text-maroon">
                    {vol.name} {vol.city && <span className="font-normal text-xs text-ink-muted">({vol.city})</span>}
                  </h3>
                  <div className="flex items-center gap-3 text-[11px] text-ink-muted mt-0.5">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-gold" /> {vol.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-gold" /> {vol.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gold" />{" "}
                      {new Date(vol.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      vol.status === "NEW"
                        ? "bg-amber-100 text-amber-800"
                        : vol.status === "ACCEPTED"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {vol.status}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateVolunteerStatus(
                        vol.id,
                        vol.status === "ACCEPTED" ? "ARCHIVED" : "ACCEPTED"
                      )
                    }
                    className="px-2.5 py-1 rounded-xl bg-sand/30 hover:bg-sand/60 text-maroon text-xs font-serif font-semibold border border-gold/30"
                  >
                    {vol.status === "ACCEPTED" ? "Archive" : "Accept Sevadar"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteVolunteer(vol)}
                    className="p-1 rounded-lg text-ink-muted hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {vol.skills && (
                  <div className="bg-cream/40 p-2.5 rounded-xl border border-border/40">
                    <span className="font-serif font-bold text-maroon block mb-0.5">Skills / Contributions:</span>
                    <p className="text-ink-muted">{vol.skills}</p>
                  </div>
                )}
                {vol.availability && (
                  <div className="bg-cream/40 p-2.5 rounded-xl border border-border/40">
                    <span className="font-serif font-bold text-maroon block mb-0.5">Availability:</span>
                    <p className="text-ink-muted">{vol.availability}</p>
                  </div>
                )}
              </div>

              {vol.message && (
                <p className="text-xs text-charcoal/90 whitespace-pre-wrap leading-relaxed bg-cream/20 p-2.5 rounded-xl border border-border/30">
                  {vol.message}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
