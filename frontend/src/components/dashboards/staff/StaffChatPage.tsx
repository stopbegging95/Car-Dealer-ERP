"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FiMessageSquare,
  FiSend,
  FiUsers,
  FiSearch,
  FiBell,
} from "react-icons/fi";
import { Button, Badge } from "@/components/ui";
import { play1SecondChatSound } from "@/utils/audioAlert";

export interface ChatMessage {
  id: string;
  senderName: string;
  senderRole: string;
  senderDepartment: string;
  senderInitials: string;
  senderEmail: string;
  targetId: string; // recipient staff contact id or email
  content: string;
  timestamp: string;
  attachmentName?: string;
}

export interface StaffContact {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  initials: string;
  online: boolean;
  statusText: string;
  unreadCount?: number;
}

const STAFF_DIRECTORY: StaffContact[] = [
  {
    id: "admin",
    name: "Chief Executive (Admin)",
    role: "Super Admin / General Manager",
    department: "Executive Dealership Management",
    email: "admin@luxauto.dealers.com",
    initials: "GM",
    online: true,
    statusText: "Executive Desk • Final Sign-offs",
  },
  {
    id: "sales",
    name: "Senior Sales Liaison",
    role: "Showroom Sales Executive",
    department: "Showroom Floor Sales & Delivery",
    email: "sales.liaison@luxauto.dealers.com",
    initials: "SL",
    online: true,
    statusText: "On showroom floor with VIP client",
  },
  {
    id: "service",
    name: "Workshop Bay Supervisor",
    role: "Workshop Manager & Technical Service",
    department: "Technical Service & Bay Operations",
    email: "workshop.lead@luxauto.dealers.com",
    initials: "WS",
    online: true,
    statusText: "Inspecting Bay 3 (Maybach PDI)",
  },
  {
    id: "parts",
    name: "Warehouse Logistics Lead",
    role: "OEM Spares Depot Specialist",
    department: "OEM Spares Depot & Inventory",
    email: "parts.specialist@luxauto.dealers.com",
    initials: "PL",
    online: true,
    statusText: "Inbound Mercedes AMG brake kit logged",
  },
  {
    id: "finance",
    name: "Finance Underwriting Associate",
    role: "Finance & Underwriting Desk",
    department: "Finance Underwriting & Loans",
    email: "finance.underwriter@luxauto.dealers.com",
    initials: "FN",
    online: true,
    statusText: "Reviewing ORD-9912 wire confirmation",
  },
  {
    id: "recon",
    name: "Detailing Bay Chief",
    role: "Detailing Bay Chief",
    department: "Detailing & Reconditioning Center",
    email: "recon.lead@luxauto.dealers.com",
    initials: "DC",
    online: true,
    statusText: "Ceramic coat curing on Porsche 911",
  },
  {
    id: "imports",
    name: "Port Operations Officer",
    role: "Port Operations Officer",
    department: "Port Customs & Logistics Depot",
    email: "imports.clearing@luxauto.dealers.com",
    initials: "PO",
    online: false,
    statusText: "At Tin Can Island Customs Command",
  },
  {
    id: "accounting",
    name: "Dealership Chief Accountant",
    role: "Dealership Chief Accountant",
    department: "Accounting & Tax Compliance",
    email: "accounting@luxauto.dealers.com",
    initials: "CA",
    online: true,
    statusText: "Preparing FIRS 7.5% VAT monthly return",
  },
  {
    id: "procurement",
    name: "Global Procurement Officer",
    role: "Procurement & Allocation Specialist",
    department: "Vehicle Procurement & OEM Allocation",
    email: "procurement.lead@luxauto.dealers.com",
    initials: "GP",
    online: true,
    statusText: "Reviewing European dealer auction catalogs",
  },
  {
    id: "inspection",
    name: "Lead QA Vehicle Inspector",
    role: "Certified Technical Inspector",
    department: "150-Point QA & PDI Certification",
    email: "qa.inspector@luxauto.dealers.com",
    initials: "QI",
    online: true,
    statusText: "Calibrating OBD-II diagnostics in Bay 2",
  },
  {
    id: "hr",
    name: "Talent & Personnel Director",
    role: "Head of People & Operations",
    department: "Human Resources & Payroll",
    email: "hr.director@luxauto.dealers.com",
    initials: "HR",
    online: true,
    statusText: "Conducting staff onboarding & security clearance",
  },
  {
    id: "trade-ins",
    name: "Senior Valuation Appraiser",
    role: "Automotive Appraisal Specialist",
    department: "Trade-In & Vehicle Valuation",
    email: "tradein.appraiser@luxauto.dealers.com",
    initials: "VA",
    online: true,
    statusText: "Completing paint gauge audit on incoming trade",
  },
  {
    id: "crm",
    name: "VIP Concierge Experience Lead",
    role: "Client Relationship Manager",
    department: "VIP Concierge & Client Relations",
    email: "crm.concierge@luxauto.dealers.com",
    initials: "VC",
    online: true,
    statusText: "Coordinating private lounge booking for client",
  },
  {
    id: "vault",
    name: "Chief Security Registrar",
    role: "Document Vault & Legal Custodian",
    department: "Legal Title Deeds & Customs Registry",
    email: "vault.registrar@luxauto.dealers.com",
    initials: "VR",
    online: true,
    statusText: "Vault security seals verified intact",
  },
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "MSG-001",
    senderName: "Finance & Accounts Lead",
    senderRole: "Finance Controller",
    senderDepartment: "Finance & Accounts",
    senderInitials: "FA",
    senderEmail: "finance.controller@luxauto.dealers.com",
    targetId: "admin",
    content:
      "Chief, the offshore LC wire for the Mercedes-Maybach inventory batch has been authenticated with the correspondent bank.",
    timestamp: "Today at 09:15 WAT",
  },
  {
    id: "MSG-002",
    senderName: "Port Logistics Officer",
    senderRole: "Customs Clearing Lead",
    senderDepartment: "Customs & Port Logistics",
    senderInitials: "PL",
    senderEmail: "logistics.ports@luxauto.dealers.com",
    targetId: "admin",
    content:
      "PAAR clearance documents for container MSC-99214 at Tin Can Island terminal have been stamped and released.",
    timestamp: "Today at 09:30 WAT",
  },
  {
    id: "MSG-003",
    senderName: "Workshop Bay Supervisor",
    senderRole: "Service Bay Lead",
    senderDepartment: "Service & Maintenance Workshop",
    senderInitials: "WS",
    senderEmail: "service.bay@luxauto.dealers.com",
    targetId: "sales",
    content:
      "Pre-Delivery Inspection (150-Point Checklist) for the 2024 Porsche 911 Turbo S is complete. All systems green for client handover.",
    timestamp: "Today at 09:48 WAT",
  },
  {
    id: "MSG-004",
    senderName: "Senior Sales Liaison",
    senderRole: "Sales Executive",
    senderDepartment: "Showroom Floor Sales",
    senderInitials: "SL",
    senderEmail: "sales.liaison@luxauto.dealers.com",
    targetId: "admin",
    content:
      "Hello Chief, client is asking if we can bundle complimentary 3-year scheduled servicing with the Maybach handover. Please advise.",
    timestamp: "Today at 10:05 WAT",
  },
];

const STORAGE_KEY_CHAT = "cardeals_staff_team_chat_messages";

export interface StaffChatPageProps {
  currentStaff: {
    name: string;
    email: string;
    role: string;
    department?: string;
    initials?: string;
  };
}

export const StaffChatPage: React.FC<StaffChatPageProps> = ({ currentStaff }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(STORAGE_KEY_CHAT);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // fallback
      }
    }
    return INITIAL_MESSAGES;
  });

  // Pick first colleague as default selected target
  const defaultTarget =
    STAFF_DIRECTORY.find((s) => s.email !== currentStaff.email)?.id || "sales";

  const [selectedTargetId, setSelectedTargetId] = useState<string>(defaultTarget);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [inputText, setInputText] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Save to localStorage whenever messages update
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY_CHAT, JSON.stringify(messages));
      } catch {
        // ignore
      }
    }
  }, [messages]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedTargetId]);

  // Active contact details
  const activeContact =
    STAFF_DIRECTORY.find((s) => s.id === selectedTargetId) || STAFF_DIRECTORY[0];

  // Filtered messages for currently selected 1-on-1 direct conversation
  const currentMessages = messages.filter((m) => {
    return (
      (m.targetId === selectedTargetId && m.senderEmail === currentStaff.email) ||
      (m.targetId === currentStaff.email && m.senderEmail === activeContact?.email) ||
      (m.targetId === selectedTargetId)
    );
  });

  // Handle Send Message
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    setIsSending(true);

    const now = new Date();
    const timeFormatted = `Today at ${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")} WAT`;

    const newMsg: ChatMessage = {
      id: `MSG-${Date.now().toString().slice(-6)}`,
      senderName: currentStaff.name || "Staff Member",
      senderRole: currentStaff.role || "Executive",
      senderDepartment: currentStaff.department || "Dealership HQ",
      senderInitials:
        currentStaff.initials ||
        (currentStaff.name ? currentStaff.name.split(" ").map((n) => n[0]).join("").slice(0, 2) : "ST"),
      senderEmail: currentStaff.email,
      targetId: selectedTargetId,
      content: text,
      timestamp: timeFormatted,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText("");
    setIsSending(false);

    // Play crisp 1-second chat audio chime on message interaction
    play1SecondChatSound().catch(() => {});

    // Attempt optional background sync with backend /api/chat
    try {
      fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMsg),
      }).catch(() => {});
    } catch {
      // ignore
    }
  };

  // Quick Action Chips for quick dealership dispatch
  const quickActions = [
    "Order ORD-9912 Maybach Ready for Handover",
    "Wire Transfer Cleared & Verified by Finance",
    "150-Point PDI Inspection Passed 100%",
    "Demurrage Free-Time Alert: Tin Can Port",
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-135px)] bg-[#FFFFFF] border border-[#CBD5E1] rounded-lg shadow-xs overflow-hidden">
      {/* Main Chat Grid (Sidebar Staff Directory + Conversation Thread) */}
      <div className="flex flex-1 min-h-0 divide-x divide-[#E2E8F0]">
        {/* =================================================================== */}
        {/* LEFT COLUMN: DIRECT STAFF DIRECTORY                                 */}
        {/* =================================================================== */}
        <div className="w-64 sm:w-80 flex flex-col bg-[#F8FAFC] shrink-0">
          {/* Header & Search */}
          <div className="p-3 border-b border-[#E2E8F0] bg-[#FFFFFF] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiUsers className="w-4 h-4 text-[#2563EB]" />
                <span className="font-bold text-xs text-[#0F172A] uppercase tracking-wider">
                  Dealership Staff
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-full font-bold">
                {STAFF_DIRECTORY.length} Members
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#F8FAFC] px-2.5 py-1.5 border border-[#CBD5E1] rounded-md text-xs focus-within:ring-1 focus-within:ring-[#2563EB] focus-within:border-[#2563EB]">
              <FiSearch className="w-3.5 h-3.5 text-[#94A3B8]" />
              <input
                type="text"
                placeholder="Search staff member..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none w-full text-xs text-[#0F172A] placeholder-[#94A3B8]"
              />
            </div>
          </div>

          {/* Scrollable Staff Members List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {STAFF_DIRECTORY.filter(
              (s) =>
                s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.department.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((s) => {
              const isSelected = selectedTargetId === s.id;
              const isMe = s.email === currentStaff.email;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedTargetId(s.id)}
                  className={`w-full text-left p-2 rounded-md transition-colors cursor-pointer flex items-start gap-2.5 ${
                    isSelected
                      ? "bg-[#2563EB] text-white shadow-xs"
                      : "text-[#334155] hover:bg-[#E2E8F0]/70"
                  }`}
                >
                  <div className="relative shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]"
                      }`}
                    >
                      {s.initials}
                    </div>
                    <span
                      className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 ${
                        isSelected ? "border-[#2563EB]" : "border-[#F8FAFC]"
                      } ${s.online ? "bg-emerald-500" : "bg-slate-400"}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs truncate">
                        {s.name} {isMe && "(You)"}
                      </span>
                      <span
                        className={`text-[9px] font-mono ${
                          isSelected ? "text-blue-100" : "text-[#94A3B8]"
                        }`}
                      >
                        {s.online ? "Online" : "Away"}
                      </span>
                    </div>
                    <div
                      className={`text-[10px] truncate font-medium ${
                        isSelected ? "text-blue-100" : "text-[#2563EB]"
                      }`}
                    >
                      {s.role}
                    </div>
                    <div
                      className={`text-[9px] truncate ${
                        isSelected ? "text-blue-200" : "text-[#64748B]"
                      }`}
                    >
                      {s.department}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* =================================================================== */}
        {/* RIGHT COLUMN: ACTIVE CONVERSATION THREAD & MESSAGE COMPOSER        */}
        {/* =================================================================== */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#FFFFFF]">
          {/* Header of Active Chat */}
          <div className="p-3 sm:px-5 bg-[#FFFFFF] border-b border-[#E2E8F0] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] flex items-center justify-center font-bold text-xs">
                  {activeContact?.initials || "ST"}
                </div>
                <span
                  className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                    activeContact?.online ? "bg-emerald-500" : "bg-slate-400"
                  }`}
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-[#0F172A] truncate">
                    {activeContact?.name}
                  </h3>
                  <Badge variant="gold" size="sm">
                    {activeContact?.role}
                  </Badge>
                </div>
                <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                  {activeContact?.statusText} &bull; {activeContact?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#F8FAFC]">
            {/* Staff Direct Chat Badge */}
            <div className="flex items-center justify-center my-2">
              <span className="text-[10px] font-mono font-bold text-[#64748B] bg-[#E2E8F0] px-3 py-1 rounded-full uppercase tracking-wider">
                Direct Staff Conversation with {activeContact?.name}
              </span>
            </div>

            {currentMessages.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <FiMessageSquare className="w-10 h-10 text-[#CBD5E1] mx-auto" />
                <p className="text-xs font-bold text-[#475569]">No direct messages yet with {activeContact?.name}</p>
                <p className="text-[11px] text-[#94A3B8]">
                  Type a message below or use quick action pills to start collaboration with this colleague.
                </p>
              </div>
            ) : (
              currentMessages.map((msg) => {
                const isMe = msg.senderEmail === currentStaff.email;
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 max-w-2xl ${
                      isMe ? "ml-auto flex-row-reverse" : "mr-auto"
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        isMe
                          ? "bg-[#2563EB] text-white"
                          : "bg-[#FFFFFF] border border-[#CBD5E1] text-[#2563EB]"
                      }`}
                    >
                      {msg.senderInitials}
                    </div>

                    {/* Bubble Content */}
                    <div
                      className={`rounded-lg p-3 text-xs shadow-xs space-y-1 ${
                        isMe
                          ? "bg-[#2563EB] text-white rounded-tr-none"
                          : "bg-[#FFFFFF] text-[#0F172A] border border-[#E2E8F0] rounded-tl-none"
                      }`}
                    >
                      <div
                        className={`flex items-center gap-2 text-[10px] pb-1 border-b ${
                          isMe ? "border-blue-400 text-blue-100" : "border-[#F1F5F9] text-[#64748B]"
                        }`}
                      >
                        <span className="font-bold truncate">{isMe ? "You" : msg.senderName}</span>
                        <span>&bull;</span>
                        <span className="font-mono">{msg.senderRole}</span>
                        <span>&bull;</span>
                        <span className="font-mono opacity-80">{msg.timestamp}</span>
                      </div>
                      <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Chips */}
          <div className="px-4 py-1.5 bg-[#FFFFFF] border-t border-[#E2E8F0] flex items-center gap-1.5 overflow-x-auto shrink-0 text-xs">
            <span className="text-[10px] font-bold text-[#94A3B8] shrink-0 uppercase tracking-wider">
              Quick Dispatch:
            </span>
            {quickActions.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(chip)}
                className="text-[10px] font-medium text-[#2563EB] bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-[#BFDBFE] px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer shrink-0"
              >
                + {chip}
              </button>
            ))}
          </div>

          {/* Input Box & Sender */}
          <div className="p-3 bg-[#FFFFFF] border-t border-[#E2E8F0] shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <div className="flex-1 flex items-center gap-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-3 py-2 focus-within:ring-1 focus-within:ring-[#2563EB] focus-within:border-[#2563EB]">
                <textarea
                  rows={1}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={`Message ${activeContact?.name || "colleague"}... (Press Enter to send)`}
                  className="bg-transparent outline-none w-full text-xs text-[#0F172A] placeholder-[#94A3B8] resize-none"
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={!inputText.trim() || isSending}
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 shrink-0 font-bold"
                leftIcon={<FiSend className="w-3.5 h-3.5" />}
              >
                Send
              </Button>
            </form>
            <div className="flex items-center justify-between text-[10px] text-[#94A3B8] mt-1.5 px-1 font-mono">
              <span>Enter to send &bull; Shift + Enter for new line</span>
              <span className="flex items-center gap-1 text-[#2563EB]">
                <FiBell className="w-2.5 h-2.5" />
                1s Audio Alert Dispatched on Messages
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
