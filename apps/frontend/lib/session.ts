const SESSION_KEY = "originchain_session";

export function saveSession(token: string, walletAddress: string) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ token, walletAddress }));
}

export function getSession(): { token: string; walletAddress: string } | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
}

export function clearSession() {
    localStorage.removeItem(SESSION_KEY);
}