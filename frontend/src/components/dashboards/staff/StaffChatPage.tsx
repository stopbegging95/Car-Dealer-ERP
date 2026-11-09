"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FiMessageSquare,
  FiSend,
  FiUsers,
  FiHash,
  FiSearch,
  FiPaperclip,
  FiCheckCircle,
  FiClock,
  FiBell,
  FiShield,
  FiUser,
  FiActivity,
  FiChevronRight,
  FiRefreshCw,
} from "react-icons/fi";
import { Button, Badge, Card } from "@/components/ui";
import { play4SecondNotificationSound } from "@/utils/audioAlert";

export interface ChatMessage {
  id: string;
  senderName: string;
  senderRole: string;
  senderDepartment: string;
  senderInitials: string;
  senderEmail: string;
  targetId: string; // channel id or recipient email
  targetType: "channel" | "direct";
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

export interface ChannelItem {
  id: string;
  name: string;
  description: string;
  department: string;
  unreadCount?: number;
}

const CHANNELS: ChannelItem[] = [
  {
    id: "general-staff",
    name: "all-staff-bulletin",
    description: "Company-wide dealership operations, general announcements & protocols.",
    department: "Dealership Master HQ",
    unreadCount: 0,
  },
  {
    id: "executive-approvals",
    name: "executive-approvals",
    description: "Discount ceiling clearances (Rule 4) & High-Value PO sign-offs (Rule 5).",
    department: "Executive Management",
    unreadCount: 2,
  },
  {
    id: "sales-floor",
    name: "showroom-sales-floor",
    description: "VIP walk-ins, vehicle test drive escorts, allocations & customer handover.",
    department: "Showroom Floor Sales",
    unreadCount: 0,
  },
  {
    id: "service-workshop",
    name: "service-bays-workshop",
    description: "PDI 150-point checklists, bay queue telemetry & urgent diagnostic alerts.",
    department: "Technical Bay Operations",
    unreadCount: 1,
  },
  {
    id: "customs-logistics",
    name: "inbound-customs-ports",
    description: "Tin Can & PTML container vessel tracking, PAAR & clearance documentation.",
    department: "Port Clearing & Freight",
    unreadCount: 0,
  },
  {
    id: "finance-audit",
    name: "finance-treasury-wire",
    description: "Wire transfers, letters of credit, VAT reconciliation & margin approvals.",
    department: "Finance & Accounting",
    unreadCount: 0,
  },
];

const STAFF_DIRECTORY: StaffContact[] = [
  {
    id: "admin",
    name: "Chief Executive (Admin)",
    role: "Super Admin / General Manager",
    department: "Executive Dealership Management",
    email: "admin@luxauto.dealers.com",
    initials: "GM",
    online: true,
    statusText: "Executive Desk &bull; Final Sign-offs",
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
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "MSG-001",
    senderName: "Chief Executive (Admin)",
    senderRole: "Super Admin",
    senderDepartment: "Executive Dealership Management",
    senderInitials: "GM",
    senderEmail: "admin@luxauto.dealers.com",
    targetId: "executive-approvals",
    targetType: "channel",
    content:
      "Good morning team. Order ORD-9912 for Alhaji Bello (Maybach S580) discount has been granted Rule 4 executive sign-off. Workshop and Detailing please expedite final delivery handover for Thursday.",
    timestamp: "Today at 08:35 WAT",
  },
  {
    id: "MSG-002",
    senderName: "Workshop Bay Supervisor",
    senderRole: "Service Tech",
    senderDepartment: "Technical Service & Bay Operations",
    senderInitials: "WS",
    senderEmail: "workshop.lead@luxauto.dealers.com",
    targetId: "executive-approvals",
    targetType: "channel",
    content:
      "Noted GM. 150-Point PDI inspection on the Maybach S580 is 100% complete with diagnostic report signed and uploaded to the Document Vault.",
    timestamp: "Today at 08:42 WAT",
  },
  {
    id: "MSG-003",
    senderName: "Senior Sales Liaison",
    senderRole: "Sales Executive",
    senderDepartment: "Showroom Floor Sales",
    senderInitials: "SL",
    senderEmail: "sales.liaison@luxauto.dealers.com",
    targetId: "sales-floor",
    targetType: "channel",
    content:
      "VIP client Dr. K. Somoye just arrived at the showroom to inspect the Guards Red 2024 Porsche 911 Turbo S. Concierge has arranged chilled champagne.",
    timestamp: "Today at 09:15 WAT",
  },
  {
    id: "MSG-004",
    senderName: "Port Operations Officer",
    senderRole: "Imports Lead",
    senderDepartment: "Port Customs & Freight",
    senderInitials: "PO",
    senderEmail: "imports.clearing@luxauto.dealers.com",
    targetId: "customs-logistics",
    targetType: "channel",
    content:
      "MSC Positano berthed at Tin Can Island Terminal. 2x Range Rover SV container seals verified intact. Single Goods Declaration clearance form in progress.",
    timestamp: "Today at 09:40 WAT",
  },
  {
    id: "MSG-005",
    senderName: "Senior Sales Liaison",
    senderRole: "Sales Executive",
    senderDepartment: "Showroom Floor Sales",
    senderInitials: "SL",
    senderEmail: "sales.liaison@luxauto.dealers.com",
    targetId: "admin",
    targetType: "direct",
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

  const [activeTab, setActiveTab] = useState<"channels" | "direct">("channels");
  const [selectedTargetId, setSelectedTargetId] = useState<string>("executive-approvals");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [inputText, setInputText] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [soundFeedback, setSoundFeedback] = useState<boolean>(false);

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

  // Active channel or contact definition
  const activeChannel = CHANNELS.find((c) => c.id === selectedTargetId);
  const activeContact = STAFF_DIRECTORY.find((s) => s.id === selectedTargetId);

  // Filtered messages for currently selected view
  const currentMessages = messages.filter((m) => {
    if (activeTab === "channels") {
      return m.targetType === "channel" && m.targetId === selectedTargetId;
    } else {
      // 1-on-1: show messages between current staff and selected contact
      return (
        m.targetType === "direct" &&
        ((m.targetId === selectedTargetId && m.senderEmail === currentStaff.email) ||
          (m.targetId === currentStaff.email && m.senderEmail === activeContact?.email) ||
          (m.targetId === selectedTargetId))
      );
    }
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
      targetType: activeTab === "channels" ? "channel" : "direct",
      content: text,
      timestamp: timeFormatted,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText("");
    setIsSending(false);

    // Trigger the mandatory 4-second executive notification chime on incoming / message interaction
    setSoundFeedback(true);
    play4SecondNotificationSound().finally(() => {
      setSoundFeedback(false);
    });

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
      {/* Top Banner Notice: Internal Company Staff Only */}
      <div className="px-4 py-2.5 bg-[#0F172A] text-white flex items-center justify-between border-b border-[#334155] shrink-0 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold tracking-wider uppercase text-[11px] text-[#93C5FD]">
            Enterprise Internal Comms
          </span>
          <span className="text-[#64748B] hidden sm:inline">&bull;</span>
          <span className="text-[#CBD5E1] text-[11px] hidden sm:inline">
            Encrypted Dealership Staff Network (Customer Access Strictly Prohibited)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSoundFeedback(true);
              play4SecondNotificationSound().finally(() => setSoundFeedback(false));
            }}
            className={`text-[10px] px-2 py-1 text-[#93C5FD] border-[#334155] hover:bg-[#1E293B] ${
              soundFeedback ? "ring-2 ring-emerald-400 bg-emerald-950/40 text-emerald-300" : ""
            }`}
            leftIcon={<FiBell className="w-3 h-3 text-[#60A5FA]" />}
          >
            {soundFeedback ? "Playing 4s Alert..." : "Test 4s Bell Sound"}
          </Button>
          <span className="text-[10px] font-mono text-emerald-400 font-semibold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
            TLS 1.3 Active
          </span>
        </div>
      </div>

      {/* Main Chat Grid (Sidebar Directory + Main Conversation Thread) */}
      <div className="flex flex-1 min-h-0 divide-x divide-[#E2E8F0]">
        {/* =================================================================== */}
        {/* LEFT COLUMN: CHANNELS & DIRECT STAFF DIRECTORY                      */}
        {/* =================================================================== */}
        <div className="w-64 sm:w-80 flex flex-col bg-[#F8FAFC] shrink-0">
          {/* Tab Switcher: Department Channels vs 1-on-1 Staff */}
          <div className="p-2 border-b border-[#E2E8F0] grid grid-cols-2 gap-1 bg-[#FFFFFF]">
            <button
              type="button"
              onClick={() => {
                setActiveTab("channels");
                setSelectedTargetId("executive-approvals");
              }}
              className={`py-1.5 px-2 rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "channels"
                  ? "bg-[#2563EB] text-white shadow-xs"
                  : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
              }`}
            >
              <FiHash className="w-3.5 h-3.5" />
              <span>Channels</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("direct");
                setSelectedTargetId("sales");
              }}
              className={`py-1.5 px-2 rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "direct"
                  ? "bg-[#2563EB] text-white shadow-xs"
                  : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
              }`}
            >
              <FiUsers className="w-3.5 h-3.5" />
              <span>Staff DMs</span>
            </button>
          </div>

          {/* Directory Search Bar */}
          <div className="p-2 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-1.5 bg-[#FFFFFF] px-2.5 py-1.5 border border-[#CBD5E1] rounded-md text-xs focus-within:ring-1 focus-within:ring-[#2563EB] focus-within:border-[#2563EB]">
              <FiSearch className="w-3.5 h-3.5 text-[#94A3B8]" />
              <input
                type="text"
                placeholder={activeTab === "channels" ? "Filter channels..." : "Search staff member..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none w-full text-xs text-[#0F172A] placeholder-[#94A3B8]"
              />
            </div>
          </div>

          {/* Scrollable Channels / Staff List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {activeTab === "channels" ? (
              // CHANNELS LIST
              <>
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                  Operational Channels ({CHANNELS.length})
                </div>
                {CHANNELS.filter(
                  (c) =>
                    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.description.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((c) => {
                  const isSelected = selectedTargetId === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedTargetId(c.id)}
                      className={`w-full text-left p-2 rounded-md transition-colors cursor-pointer flex items-start gap-2.5 ${
                        isSelected
                          ? "bg-[#2563EB] text-white shadow-xs"
                          : "text-[#334155] hover:bg-[#E2E8F0]/70"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded flex items-center justify-center shrink-0 font-bold text-xs ${
                          isSelected ? "bg-white/20 text-white" : "bg-[#EFF6FF] text-[#2563EB]"
                        }`}
                      >
                        <FiHash className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs truncate">#{c.name}</span>
                          {c.unreadCount ? (
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                                isSelected ? "bg-white text-[#2563EB]" : "bg-red-500 text-white"
                              }`}
                            >
                              {c.unreadCount}
                            </span>
                          ) : null}
                        </div>
                        <div
                          className={`text-[10px] truncate ${
                            isSelected ? "text-blue-100" : "text-[#64748B]"
                          }`}
                        >
                          {c.department}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </>
            ) : (
              // DIRECT STAFF MEMBERS
              <>
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                  Dealership Staff ({STAFF_DIRECTORY.length})
                </div>
                {STAFF_DIRECTORY.filter(
                  (s) =>
                    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    s.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    s.department.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((s) => {
                  const isSelected = selectedTargetId === s.id;
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
                            isSelected ? "bg-white/20 text-white" : "bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]"
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
                          <span className="font-bold text-xs truncate">{s.name}</span>
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
              </>
            )}
          </div>
        </div>

        {/* =================================================================== */}
        {/* RIGHT COLUMN: ACTIVE CONVERSATION THREAD & MESSAGE COMPOSER        */}
        {/* =================================================================== */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#FFFFFF]">
          {/* Header of Active Chat */}
          <div className="p-3 sm:px-5 bg-[#FFFFFF] border-b border-[#E2E8F0] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              {activeTab === "channels" ? (
                <div className="w-9 h-9 rounded-md bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] flex items-center justify-center font-bold text-base shrink-0">
                  <FiHash className="w-5 h-5" />
                </div>
              ) : (
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
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-[#0F172A] truncate">
                    {activeTab === "channels" ? `#${activeChannel?.name}` : activeContact?.name}
                  </h3>
                  <Badge variant="gold" size="sm">
                    {activeTab === "channels" ? activeChannel?.department : activeContact?.role}
                  </Badge>
                </div>
                <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                  {activeTab === "channels"
                    ? activeChannel?.description
                    : `${activeContact?.statusText} &bull; ${activeContact?.email}`}
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setMessages(INITIAL_MESSAGES);
                  if (typeof window !== "undefined") {
                    localStorage.removeItem(STORAGE_KEY_CHAT);
                  }
                }}
                className="text-[11px] text-[#64748B] hover:text-[#0F172A]"
                leftIcon={<FiRefreshCw className="w-3 h-3" />}
              >
                Reset Chat
              </Button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#F8FAFC]">
            {/* Timestamp Divider */}
            <div className="flex items-center justify-center my-2">
              <span className="text-[10px] font-mono font-bold text-[#64748B] bg-[#E2E8F0] px-3 py-1 rounded-full uppercase tracking-wider">
                Authorized Executive Staff Comm Channel
              </span>
            </div>

            {currentMessages.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <FiMessageSquare className="w-10 h-10 text-[#CBD5E1] mx-auto" />
                <p className="text-xs font-bold text-[#475569]">No messages posted yet in this thread</p>
                <p className="text-[11px] text-[#94A3B8]">
                  Type a message below or use quick action pills to start collaboration with colleagues.
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
                  placeholder={
                    activeTab === "channels"
                      ? `Message #${activeChannel?.name}... (Press Enter to send)`
                      : `Message ${activeContact?.name}... (Press Enter to send)`
                  }
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
                4s Audio Chime Dispatched on Incoming Messages
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
