const SESSION_KEY = "originchain_session";

export function saveSession(token: string, walletAddress: string, creatorId: string) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ token, walletAddress, creatorId }));
}

export function getSession(): { token: string; walletAddress: string; creatorId: string } | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
}

export function clearSession() {
    localStorage.removeItem(SESSION_KEY);
}