const TEACHER_KEY = 'teachers';

export function getTeachers() {
    const data = localStorage.getItem(TEACHER_KEY);
    return data ? JSON.parse(data) : [];
}

export function saveTeachers(teacherObj) {
    const teachers = getTeachers();
    teachers.push(teacherObj);
    localStorage.setItem(TEACHER_KEY , JSON.stringify(teachers));
}

export function getCurrentTeacher() {
    const data = localStorage.getItem('currentTeacher') || sessionStorage.getItem('currentTeacher');
    return data ? JSON.parse(data) : null;
}
