export interface SessionAuditLog {
  id: string;
  userName: string;
  email: string;
  role: string;
  department: string;
  loginTime: string;
  logoutTime: string | null;
  status: "Active (Current Session)" | "Terminated Normally" | "Session Timed Out" | "Revoked by Security";
  duration: string;
  ipAddress: string;
  location: string;
  device: string;
  browser: string;
  mfaMethod: string;
  checksum: string;
  immutableSeal: boolean;
  loginFaceSnapshot?: string;
  logoutFaceSnapshot?: string;
  biometricVerified?: boolean;
}

export const INITIAL_SESSION_LOGS: SessionAuditLog[] = [
  {
    id: "SES-2026-9941-LAG",
    userName: "Senior Sales Liaison",
    email: "sales.liaison@luxauto.dealers.com",
    role: "Sales Executive",
    department: "Showroom Floor Sales & Delivery",
    loginTime: "2026-11-07 09:14:22 WAT",
    logoutTime: null,
    status: "Active (Current Session)",
    duration: "2 hrs 39 mins (Ongoing)",
    ipAddress: "102.89.44.12",
    location: "Victoria Island HQ, Lagos, Nigeria",
    device: "Desktop Workstation (Windows 11 Pro 64-bit)",
    browser: "Chrome 128.0.6613.138",
    mfaMethod: "FIDO2 Hardware Key (YubiKey 5C NFC)",
    checksum: "sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    immutableSeal: true,
  },
  {
    id: "SES-2026-9938-LAG",
    userName: "Senior Sales Liaison",
    email: "sales.liaison@luxauto.dealers.com",
    role: "Sales Executive",
    department: "Showroom Floor Sales & Delivery",
    loginTime: "2026-11-06 08:30:10 WAT",
    logoutTime: "2026-11-06 18:45:00 WAT",
    status: "Terminated Normally",
    duration: "10 hrs 14 mins",
    ipAddress: "102.89.44.12",
    location: "Victoria Island HQ, Lagos, Nigeria",
    device: "Desktop Workstation (Windows 11 Pro 64-bit)",
    browser: "Chrome 128.0.6613.138",
    mfaMethod: "FIDO2 Hardware Key (YubiKey 5C NFC)",
    checksum: "sha256-4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
    immutableSeal: true,
  },
  {
    id: "SES-2026-9922-ABJ",
    userName: "VIP Concierge Lead",
    email: "crm.concierge@luxauto.dealers.com",
    role: "Client Relations",
    department: "Customer Relations & VIP Concierge",
    loginTime: "2026-11-06 10:15:40 WAT",
    logoutTime: "2026-11-06 17:30:15 WAT",
    status: "Terminated Normally",
    duration: "7 hrs 14 mins",
    ipAddress: "105.112.98.54",
    location: "Maitama Diplomatic Zone, Abuja, Nigeria",
    device: "MacBook Pro M3 Max (macOS Sequoia 15.1)",
    browser: "Safari 18.1",
    mfaMethod: "Apple TouchID / Biometric Passkey",
    checksum: "sha256-ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d",
    immutableSeal: true,
  },
  {
    id: "SES-2026-9915-LAG",
    userName: "Workshop Bay Supervisor",
    email: "workshop.lead@luxauto.dealers.com",
    role: "Service Tech",
    department: "Technical Service & Bay Operations",
    loginTime: "2026-11-06 07:45:00 WAT",
    logoutTime: "2026-11-06 16:30:00 WAT",
    status: "Terminated Normally",
    duration: "8 hrs 45 mins",
    ipAddress: "102.89.44.18",
    location: "Service Bay Terminal 1, Victoria Island, Lagos",
    device: "Rugged Panasonic Toughbook (Windows 10 Enterprise)",
    browser: "Edge 128.0.2792.89",
    mfaMethod: "RFID Staff Badge + TOTP",
    checksum: "sha256-5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
    immutableSeal: true,
  },
  {
    id: "SES-2026-9890-LAG",
    userName: "Chief Executive (Admin)",
    email: "admin@luxauto.dealers.com",
    role: "Super Admin",
    department: "Executive Dealership Management",
    loginTime: "2026-11-05 14:02:11 WAT",
    logoutTime: "2026-11-05 19:15:30 WAT",
    status: "Terminated Normally",
    duration: "5 hrs 13 mins",
    ipAddress: "102.89.44.1",
    location: "Executive Boardroom, Victoria Island HQ, Lagos",
    device: "Dell XPS 15 (Windows 11 Enterprise)",
    browser: "Firefox Developer Edition 131.0",
    mfaMethod: "Hardware Security Key (FIDO2 Level 3)",
    checksum: "sha256-8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918",
    immutableSeal: true,
  },
  {
    id: "SES-2026-9874-LAG",
    userName: "Senior Sales Liaison",
    email: "sales.liaison@luxauto.dealers.com",
    role: "Sales Executive",
    department: "Showroom Floor Sales & Delivery",
    loginTime: "2026-11-05 08:45:19 WAT",
    logoutTime: "2026-11-05 18:00:02 WAT",
    status: "Terminated Normally",
    duration: "9 hrs 14 mins",
    ipAddress: "102.89.44.12",
    location: "Victoria Island HQ, Lagos, Nigeria",
    device: "Desktop Workstation (Windows 11 Pro 64-bit)",
    browser: "Chrome 128.0.6613.138",
    mfaMethod: "FIDO2 Hardware Key (YubiKey 5C NFC)",
    checksum: "sha256-11b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b999",
    immutableSeal: true,
  },
  {
    id: "SES-2026-9850-REM",
    userName: "External Auditor (PwC / Federal Audit)",
    email: "audit.officer@external.pwc.com",
    role: "Auditor",
    department: "Independent Regulatory Compliance",
    loginTime: "2026-11-04 11:20:00 WAT",
    logoutTime: "2026-11-04 13:20:00 WAT",
    status: "Session Timed Out",
    duration: "2 hrs 00 mins",
    ipAddress: "197.210.55.90",
    location: "Remote VPN Secure Tunnel, Lagos, Nigeria",
    device: "ThinkPad X1 Carbon (Windows 11 Pro)",
    browser: "Chrome 128.0.6613.138",
    mfaMethod: "Certificate-Based PKI + OTP",
    checksum: "sha256-9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
    immutableSeal: true,
  },
];

