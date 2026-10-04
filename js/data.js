import { seedData } from './seedData.js';

const TEACHER_KEY = 'teachers';
const CURRENT_USER_KEY = 'currentUser';
const CURRENT_TEACHER_KEY = 'currentTeacher';

function safeParse(value, fallback = null) {
  try { return value ? JSON.parse(value) : fallback; } catch { return fallback; }
}

function normalizeTeacher(teacher) {
  if (!teacher) return null;
  return {
    ...teacher,
    fullName: teacher.fullName || teacher.name || 'Teacher',
    email: String(teacher.email || '').trim().toLowerCase()
  };
}

function ensureSeed() {
  Object.entries(seedData).forEach(([key, value]) => {
    if (localStorage.getItem(key) === null) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  });
}

export function getTeachers() {
  ensureSeed();
  const data = safeParse(localStorage.getItem(TEACHER_KEY), []);
  return Array.isArray(data) ? data.map(normalizeTeacher) : [];
}

export function saveTeachers(teacherObj) {
  ensureSeed();
  const teachers = getTeachers();
  const normalized = normalizeTeacher(teacherObj);
  const existingIndex = teachers.findIndex((t) => t.id === normalized.id || t.email === normalized.email);
  if (existingIndex >= 0) teachers[existingIndex] = { ...teachers[existingIndex], ...normalized };
  else teachers.push(normalized);
  localStorage.setItem(TEACHER_KEY, JSON.stringify(teachers));
  return normalized;
}

export function setCurrentTeacher(teacher, remember = true) {
  const normalized = normalizeTeacher(teacher);
  if (!normalized) return;
  const json = JSON.stringify(normalized);
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(CURRENT_USER_KEY, json);
  storage.setItem(CURRENT_TEACHER_KEY, json);
  // Keep both names in sessionStorage so every page can resolve the same identity.
  sessionStorage.setItem(CURRENT_USER_KEY, json);
  sessionStorage.setItem(CURRENT_TEACHER_KEY, json);
  if (remember) {
    localStorage.setItem(CURRENT_USER_KEY, json);
    localStorage.setItem(CURRENT_TEACHER_KEY, json);
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(CURRENT_TEACHER_KEY);
  }
}

export function getCurrentTeacher() {
  const teacher = safeParse(
    sessionStorage.getItem(CURRENT_USER_KEY) ||
      sessionStorage.getItem(CURRENT_TEACHER_KEY) ||
      localStorage.getItem(CURRENT_USER_KEY) ||
      localStorage.getItem(CURRENT_TEACHER_KEY),
    null
  );
  return normalizeTeacher(teacher);
}

export function updateTeacher(updatedTeacher) {
  const normalized = normalizeTeacher(updatedTeacher);
  saveTeachers(normalized);
  const remember = Boolean(localStorage.getItem(CURRENT_USER_KEY) || localStorage.getItem(CURRENT_TEACHER_KEY));
  setCurrentTeacher(normalized, remember);
  return normalized;
}

export function logout() {
  [CURRENT_USER_KEY, CURRENT_TEACHER_KEY].forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
  window.location.href = './login.html';
}
