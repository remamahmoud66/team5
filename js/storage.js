const CLASSES_KEY = "classes";
const MATERIALS_KEY = "materials";
const STUDENTS_KEY = "students";
const TEACHER_KEY = "teachers";
const CURRENT_TEACHER_KEY = "currentTeacher";

function read(key) {
    try {
        const data = JSON.parse(localStorage.getItem(key));
        return Array.isArray(data) ? data : [];
    } catch (e) {
        return [];
    }
}

function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function getCurrentTeacher() {
    const data = localStorage.getItem(CURRENT_TEACHER_KEY) || sessionStorage.getItem(CURRENT_TEACHER_KEY);
    try {
        return data ? JSON.parse(data) : null;
    } catch (e) {
        return null;
    }
}

// دالة مساعدة لجلب معرف المعلم أو استخدام معرف افتراضي لضمان عدم توقف الحفظ
function getActiveTeacherId() {
    const currentTeacher = getCurrentTeacher();
    if (currentTeacher) {
        return currentTeacher.id || currentTeacher.Email || currentTeacher.name || "default_teacher";
    }
    // إذا لم يكن هناك معلم مسجل دخول، نقرأ الكوكي أو نعيد قيمة افتراضية
    return "default_teacher";
}

export function getClasses() {
    const classes = read(CLASSES_KEY);
    const teacherId = getActiveTeacherId();
    return classes.filter(cls => cls.teacherId === teacherId || !cls.teacherId);
}

export function saveClasses(classesArray) {
    const teacherId = getActiveTeacherId();

    let allClasses = read(CLASSES_KEY);
    
    allClasses = allClasses.filter(cls => cls.teacherId && cls.teacherId !== teacherId);
    
    const updatedClasses = classesArray.map(cls => ({
        ...cls,
        teacherId: teacherId
    }));

    const finalClasses = [...allClasses, ...updatedClasses];
    write(CLASSES_KEY, finalClasses);
}

export function getMaterials() {
    const materials = read(MATERIALS_KEY);
    const classes = getClasses();
    const classIds = classes.map(c => c.id);
    return materials.filter(m => (m.classId && classIds.includes(m.classId)) || !m.classId);
}

export function saveMaterials(materialsArray) {
    const materials = read(MATERIALS_KEY);
    const classes = getClasses();
    const classIds = classes.map(c => c.id);

    const otherMaterials = materials.filter(m => m.classId && !classIds.includes(m.classId));
    const finalMaterials = [...otherMaterials, ...materialsArray];
    write(MATERIALS_KEY, finalMaterials);
}

export function getStudents() {
    return read(STUDENTS_KEY);
}

export function saveStudents(studentsArray) {
    write(STUDENTS_KEY, studentsArray);
}

export function getTeachers() {
    return read(TEACHER_KEY);
}

export function saveTeachers(teacherObj) {
    const teachers = getTeachers();
    teachers.push(teacherObj);
    write(TEACHER_KEY, teachers);
}

export function logout() {
    localStorage.removeItem(CURRENT_TEACHER_KEY);
    sessionStorage.removeItem(CURRENT_TEACHER_KEY);
    window.location.href = "/login.html";
}