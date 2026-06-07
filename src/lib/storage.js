import { initialStore } from '../data/seedData';

const STORE_KEY = 'questlog_store_v1';
const SESSION_KEY = 'questlog_session_v1';

export function now() {
  return new Date().toISOString();
}

export function uid(prefix) {
  const random = crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}-${random}`;
}

export function readStore() {
  const raw = localStorage.getItem(STORE_KEY);
  if (!raw) {
    localStorage.setItem(STORE_KEY, JSON.stringify(initialStore));
    return initialStore;
  }

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.setItem(STORE_KEY, JSON.stringify(initialStore));
    return initialStore;
  }
}

export function writeStore(store) {
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

export function readSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function writeSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function resetStore() {
  localStorage.setItem(STORE_KEY, JSON.stringify(initialStore));
  localStorage.removeItem(SESSION_KEY);
  return initialStore;
}
