/**
 * Authentication Service Layer
 * Prepared for MySQL users table integration (id, name, email, password_hash, created_at).
 */

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: 'creator' | 'investor' | 'researcher' | 'admin';
  isAuthenticated: boolean;
  isGuestDemo: boolean;
}

const AUTH_KEY = 'crowdfundai_auth_session';

export const authService = {
  getCurrentUser(): UserSession {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    // Default guest session for testing the UI
    return {
      id: 'USR-DEV-001',
      name: 'Academic Researcher',
      email: 'researcher@crowdfundai.edu',
      role: 'researcher',
      isAuthenticated: true,
      isGuestDemo: true,
    };
  },

  async login(email: string, _password: string, _rememberMe: boolean = true): Promise<{
    success: boolean;
    user: UserSession;
    message: string;
  }> {
    // Simulated auth until MySQL connection is established in Stage 2
    const user: UserSession = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      name: email.split('@')[0].toUpperCase() || 'Verified User',
      email,
      role: 'creator',
      isAuthenticated: true,
      isGuestDemo: false,
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return {
      success: true,
      user,
      message: 'Session initialized. Note: Connect MySQL in Stage 2 for database-backed credential verification.',
    };
  },

  async register(name: string, email: string, _password: string): Promise<{
    success: boolean;
    user: UserSession;
    message: string;
  }> {
    const user: UserSession = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      name,
      email,
      role: 'creator',
      isAuthenticated: true,
      isGuestDemo: false,
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return {
      success: true,
      user,
      message: 'Account registered locally. Prepared for MySQL INSERT INTO users statement in backend.',
    };
  },

  logout(): void {
    localStorage.removeItem(AUTH_KEY);
  },
};
