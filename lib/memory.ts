// lib/memory.ts
interface SessionData {
  userId?: string;
  answers: Record<string, number>;
  score?: number;
  tier?: string;
  timestamp: number;
}

const SESSION_KEY = 'k7_chaos_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export function saveSession(data: Partial<SessionData>) {
  const existing = getSession();
  const session: SessionData = {
    ...existing,
    ...data,
    timestamp: Date.now(),
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getSession(): SessionData | null {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    
    const session: SessionData = JSON.parse(stored);
    
    // Check if session has expired
    if (Date.now() - session.timestamp > SESSION_DURATION) {
      clearSession();
      return null;
    }
    
    return session;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function updateScore(score: number, tier: string) {
  saveSession({ score, tier });
}

export function updateAnswers(answers: Record<string, number>) {
  saveSession({ answers });
}
