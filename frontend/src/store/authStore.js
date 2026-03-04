import { useSyncExternalStore } from "react";

const TOKEN_KEY = "access_token";
const USER_KEY = "user";
const listeners = new Set();

const loadState = () => {
  if (typeof window === "undefined") return { token: null, user: null };
  const token = window.localStorage.getItem(TOKEN_KEY);
  const storedUser = window.localStorage.getItem(USER_KEY);
  let user = null;
  if (storedUser) {
    try {
      user = JSON.parse(storedUser);
    } catch {
      user = null;
    }
  }
  return { token, user };
};

let authState = loadState();

const emit = () => {
  listeners.forEach((listener) => listener());
};

export const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getSnapshot = () => authState;

export const useAuth = () =>
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

export const setAuth = ({ token, user }) => {
  authState = { token, user };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(TOKEN_KEY, token);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  emit();
};

export const clearAuth = () => {
  authState = { token: null, user: null };
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
  }
  emit();
};

export const getToken = () => authState.token;
export const getUser = () => authState.user;
export const isTeacher = (user) => user?.role === "teacher";
export const isStudent = (user) => user?.role === "student";
