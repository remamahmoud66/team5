const CLASSES_KEY = 'classes';
const MATERIALS_KEY = 'materials';
const STUDENTS_KEY = 'students';
const SUBJECTS_KEY = 'subjects';
const TEACHER_KEY = 'teachers';
const CURRENT_USER_KEY = 'currentUser';
const CURRENT_TEACHER_KEY = 'currentTeacher';

function read(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getCurrentTeacher() {
  try {
    const data = sessionStorage.getItem(CURRENT_USER_KEY) || sessionStorage.getItem(CURRENT_TEACHER_KEY) || localStorage.getItem(CURRENT_USER_KEY) || localStorage.getItem(CURRENT_TEACHER_KEY);
    const teacher = data ? JSON.parse(data) : null;
    return teacher ? { ...teacher, fullName: teacher.fullName || teacher.name || 'Teacher' } : null;
  } catch {
    return null;
  }
}

function getActiveTeacherId() {
  const teacher = getCurrentTeacher();
  return teacher?.id || teacher?.email || 'T001';
}

export { getCurrentTeacher };

export function getClasses() {
  const all = read(CLASSES_KEY);
  const teacherId = getActiveTeacherId();
  return all.filter((cls) => !cls.teacherId || cls.teacherId === teacherId);
}

export function saveClasses(classesArray) {
  const teacherId = getActiveTeacherId();
  const all = read(CLASSES_KEY);
  const existingOtherTeachers = all.filter((cls) => cls.teacherId && cls.teacherId !== teacherId);
  const updated = classesArray.map((cls) => ({
    ...cls,
    teacherId: cls.teacherId || teacherId,
    studentIds: Array.isArray(cls.studentIds) ? cls.studentIds : [],
  }));
  write(CLASSES_KEY, [...existingOtherTeachers, ...updated]);
  return updated;
}

export function getSubjects() {
  const all = read(SUBJECTS_KEY);
  const teacherId = getActiveTeacherId();
  return all.filter((subject) => !subject.teacherId || subject.teacherId === teacherId);
}

export function saveSubjects(subjectsArray) {
  const teacherId = getActiveTeacherId();
  const all = read(SUBJECTS_KEY);
  const others = all.filter((subject) => subject.teacherId && subject.teacherId !== teacherId);
  const updated = subjectsArray.map((subject) => ({
    ...subject,
    teacherId: subject.teacherId || teacherId,
    name: subject.name || subject.title || 'Subject',
  }));
  write(SUBJECTS_KEY, [...others, ...updated]);
}

export function getMaterials() {
  const materials = read(MATERIALS_KEY);
  const teacherId = getActiveTeacherId();
  const classIds = getClasses().map((c) => c.id);
  return materials.filter((m) => m.teacherId ? m.teacherId === teacherId : (!m.classId || classIds.includes(m.classId)));
}

export function saveMaterials(materialsArray) {
  const teacherId = getActiveTeacherId();
  const all = read(MATERIALS_KEY);
  const currentIds = new Set(materialsArray.map((m) => m.id));
  const preserved = all.filter((m) => !currentIds.has(m.id) && m.teacherId !== teacherId);
  const updated = materialsArray.map((m) => ({
    ...m,
    teacherId: m.teacherId || teacherId,
  }));
  write(MATERIALS_KEY, [...preserved, ...updated]);
}

export function getStudents() {
  return read(STUDENTS_KEY).map((student) => ({
    ...student,
    fullName: student.fullName || student.name || `${student.firstName || ''} ${student.lastName || ''}`.trim(),
  }));
}

export function saveStudents(studentsArray) {
  write(STUDENTS_KEY, studentsArray.map((student) => ({
    ...student,
    fullName: student.fullName || student.name || `${student.firstName || ''} ${student.lastName || ''}`.trim(),
  })));
}

export function getTeachers() { return read(TEACHER_KEY); }

export function saveTeachers(teacherObj) {
  const teachers = getTeachers();
  const index = teachers.findIndex((t) => t.id === teacherObj.id);
  if (index >= 0) teachers[index] = { ...teachers[index], ...teacherObj };
  else teachers.push(teacherObj);
  write(TEACHER_KEY, teachers);
}

export function logout() {
  [CURRENT_USER_KEY, CURRENT_TEACHER_KEY].forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
  window.location.href = './login.html';
}
