import { INITIAL_SESSION_LOGS, SessionAuditLog } from "@/data/sessionAuditLogs";

export interface ActiveSessionBiometric {
  verified: boolean;
  loginTime: string;
  loginFaceSnapshot: string;
  logoutTime?: string | null;
  logoutFaceSnapshot?: string | null;
  userEmail: string;
  userName: string;
  userRole: string;
  department?: string;
  sessionId: string;
}

const STORAGE_KEY_VERIFIED = "cardeals_face_session_verification";
const STORAGE_KEY_HISTORY = "cardeals_session_history";

/**
 * Get active biometric verification status for current browser session
 */
export function getActiveBiometricVerification(): ActiveSessionBiometric | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_VERIFIED);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Clear biometric verification on logout
 */
export function clearBiometricVerification(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY_VERIFIED);
  } catch {
    // ignore
  }
}

/**
 * Record a login biometric verification event
 */
export function recordLoginBiometric(
  user: { name: string; email: string; role: string; department?: string },
  photoDataUrl: string,
  timestamp: string
): ActiveSessionBiometric {
  const sessionId = `SES-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}-LAG`;

  const sessionData: ActiveSessionBiometric = {
    verified: true,
    loginTime: timestamp,
    loginFaceSnapshot: photoDataUrl,
    logoutTime: null,
    logoutFaceSnapshot: null,
    userEmail: user.email,
    userName: user.name,
    userRole: user.role,
    department: user.department || "Executive Dealership Management",
    sessionId,
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_VERIFIED, JSON.stringify(sessionData));

    // Also append to session history
    const existing = getAllSessionAuditLogs();
    const newRecord: SessionAuditLog = {
      id: sessionId,
      userName: user.name,
      email: user.email,
      role: user.role,
      department: user.department || "Executive Dealership Management",
      loginTime: timestamp,
      logoutTime: null,
      status: "Active (Current Session)",
      duration: "Ongoing",
      ipAddress: "102.89.44.12",
      location: "Victoria Island HQ, Lagos, Nigeria",
      device: "Desktop Workstation (Windows 11 Pro 64-bit)",
      browser: "Chrome 128.0 (Biometric Node)",
      mfaMethod: "Facial Biometric & TLS 1.3",
      checksum: `sha256-${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`,
      immutableSeal: true,
      loginFaceSnapshot: photoDataUrl,
      logoutFaceSnapshot: undefined,
      biometricVerified: true,
    };

    const updated = [newRecord, ...existing.filter((s) => s.id !== sessionId)];
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
  }

  return sessionData;
}

/**
 * Record a logout biometric verification event
 */
export function recordLogoutBiometric(
  photoDataUrl: string,
  timestamp: string
): void {
  if (typeof window === "undefined") return;

  try {
    const current = getActiveBiometricVerification();
    const history = getAllSessionAuditLogs();

    if (current) {
      current.logoutTime = timestamp;
      current.logoutFaceSnapshot = photoDataUrl;
      localStorage.setItem(STORAGE_KEY_VERIFIED, JSON.stringify(current));

      // Update matching record in history
      const updatedHistory = history.map((rec) => {
        if (rec.id === current.sessionId || (!rec.logoutTime && rec.email === current.userEmail)) {
          return {
            ...rec,
            logoutTime: timestamp,
            status: "Terminated Normally" as const,
            duration: "Session Finalized",
            logoutFaceSnapshot: photoDataUrl,
            biometricVerified: true,
          };
        }
        return rec;
      });

      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updatedHistory));
    }
  } catch (err) {
    console.error("Failed to record logout biometric:", err);
  }
}

/**
 * Get all session audit logs, combining initial logs with persistent storage
 */
export function getAllSessionAuditLogs(): SessionAuditLog[] {
  if (typeof window === "undefined") return INITIAL_SESSION_LOGS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (!raw) {
      return INITIAL_SESSION_LOGS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_SESSION_LOGS;
  } catch {
    return INITIAL_SESSION_LOGS;
  }
}

