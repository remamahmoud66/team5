/* import { 
    getClasses, 
    getStudents, 
    getMaterials, 
    getTeachers,
    getSubjects
} from '../js/storage.js';

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const classId = urlParams.get("id");

    const titleElement = document.getElementById("classNameTitle");
    const subtitleElement = document.getElementById("classSubTitle");

    if (!classId) {
        if (titleElement) titleElement.innerText = "Class Not Found";
        if (subtitleElement) subtitleElement.innerText = "No class ID was provided in the link.";
        return;
    }

    const classes = getClasses();
    const currentClass = classes.find(c => c.id === classId);
    currentClassIdForDetails = currentClass?.id || "";

    if (!currentClass) {
        if (titleElement) titleElement.innerText = "Class Not Found";
        if (subtitleElement) subtitleElement.innerText = "The requested class does not exist.";
        return;
    }

    if (titleElement) titleElement.innerText = currentClass.name || "Untitled Class";
    const subject = getSubjects().find((item) => item.id === currentClass.subjectId);
    if (subtitleElement) subtitleElement.innerText = subject?.name || currentClass.subjectName || 'Subject';

    const studentIds = currentClass.studentIds || [];
    const enrolledCountEl = document.getElementById("statEnrolledCount");
    if (enrolledCountEl) enrolledCountEl.innerText = studentIds.length;

    loadClassStudents(studentIds);
    updateClassMaterialsCount(classId, currentClass);

    window.addEventListener("storage", () => {
        loadClassStudents(studentIds);
        updateClassMaterialsCount(classId, currentClass);
    });

    window.addEventListener("focus", () => {
        loadClassStudents(studentIds);
        updateClassMaterialsCount(classId, currentClass);
    });
});

function loadClassStudents(studentIds) {
    const students = getStudents();
    const attendanceContainer = document.getElementById("attendanceList");
    if (!attendanceContainer) return;
    let attendance = [];
    try { attendance = JSON.parse(localStorage.getItem("attendance") || "[]"); } catch { attendance = []; }
    const enrolled = students.filter((student) => studentIds.includes(student.id));
    if (!enrolled.length) { attendanceContainer.innerHTML = `<p style="color: var(--color-muted); padding: 12px;">No students are enrolled in this class.</p>`; return; }
    attendanceContainer.innerHTML = "";
    enrolled.forEach((student) => {
        const records = attendance.filter((a) => a.classId === currentClassIdForDetails && a.studentId === student.id)
            .sort((a,b) => String(b.date || "").localeCompare(String(a.date || "")));
        const latest = records[0];
        const status = latest?.status || "No record";
        const row = document.createElement("div");
        row.style.cssText = "padding: 8px 0; border-bottom: 1px solid var(--color-border); display: flex; align-items: center; justify-content: space-between; font-size: 13px;";
        const badgeClass = status === "Present" ? "status-success" : status === "Absent" ? "status-danger" : "status-warning";
        row.innerHTML = `<span><strong>${escapeHtml(student.fullName || student.name || "Student")}</strong><small style="display:block;color:var(--color-muted);">${escapeHtml(student.academicLevel || "")}</small></span><span class="status ${badgeClass}">${escapeHtml(status)}${latest?.date ? ` · ${escapeHtml(latest.date)}` : ""}</span>`;
        attendanceContainer.appendChild(row);
    });
}

function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (ch) => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[ch]));
}

let currentClassIdForDetails = "";

function updateClassMaterialsCount(classId, currentClass) {
    const materials = getMaterials();

    const classMaterials = materials.filter(m => {
        return (m.classId === classId) || 
               (m.className && currentClass.name && m.className.trim().toLowerCase() === currentClass.name.trim().toLowerCase());
    });

    const materialsCountEl = document.getElementById("statMaterialsCount");
    if (materialsCountEl) {
        materialsCountEl.innerText = classMaterials.length;
    }
} */
import { 
    getClasses, 
    getStudents, 
    getMaterials, 
    getTeachers,
    getSubjects
} from '../js/storage.js';

let currentClassIdForDetails = "";

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const classId = urlParams.get("id");

    const titleElement = document.getElementById("classNameTitle");
    const subtitleElement = document.getElementById("classSubTitle");

    if (!classId) {
        if (titleElement) titleElement.innerText = "Class Not Found";
        if (subtitleElement) subtitleElement.innerText = "No class ID was provided in the link.";
        return;
    }

    const classes = getClasses();
    const currentClass = classes.find(c => c.id === classId);
    
    if (!currentClass) {
        if (titleElement) titleElement.innerText = "Class Not Found";
        if (subtitleElement) subtitleElement.innerText = "The requested class does not exist.";
        return;
    }

    // Set class ID BEFORE rendering functions
    currentClassIdForDetails = currentClass.id;

    if (titleElement) titleElement.innerText = currentClass.name || "Untitled Class";
    const subject = getSubjects().find((item) => item.id === currentClass.subjectId);
    if (subtitleElement) subtitleElement.innerText = subject?.name || currentClass.subjectName || 'Subject';

    const studentIds = currentClass.studentIds || [];
    const enrolledCountEl = document.getElementById("statEnrolledCount");
    if (enrolledCountEl) enrolledCountEl.innerText = studentIds.length;

    loadClassStudents(studentIds);
    updateClassMaterialsCount(classId, currentClass);

    window.addEventListener("storage", () => {
        loadClassStudents(studentIds);
        updateClassMaterialsCount(classId, currentClass);
    });

    window.addEventListener("focus", () => {
        loadClassStudents(studentIds);
        updateClassMaterialsCount(classId, currentClass);
    });
});

function loadClassStudents(studentIds) {
    const students = getStudents();
    const studentsContainer = document.getElementById("classStudentsList");
    const attendanceContainer = document.getElementById("attendanceList");
    
    if (!studentsContainer) return;

    let attendance = [];
    try { 
        attendance = JSON.parse(localStorage.getItem("attendance") || "[]"); 
    } catch { 
        attendance = []; 
    }

    const enrolled = students.filter((student) => studentIds.includes(student.id));

    if (!enrolled.length) { 
        const emptyMsg = `<p style="color: var(--color-muted); padding: 12px;">No students are enrolled in this class.</p>`;
        studentsContainer.innerHTML = emptyMsg;
        if (attendanceContainer) attendanceContainer.innerHTML = emptyMsg;
        return; 
    }

    // Populate Students Card
    studentsContainer.innerHTML = "";
    enrolled.forEach((student) => {
        const row = document.createElement("div");
        row.style.cssText = "padding: 10px 0; border-bottom: 1px solid var(--color-border); display: flex; align-items: center; justify-content: space-between; font-size: 13px;";
        row.innerHTML = `
            <span>
                <strong>${escapeHtml(student.fullName || student.name || "Student")}</strong>
                <small style="display:block; color:var(--color-muted);">${escapeHtml(student.email || student.academicLevel || "")}</small>
            </span>
            <span class="status status-success">Enrolled</span>
        `;
        studentsContainer.appendChild(row);
    });

    // Populate Recent Attendance Card
    if (attendanceContainer) {
        attendanceContainer.innerHTML = "";
        enrolled.forEach((student) => {
            const records = attendance.filter((a) => a.classId === currentClassIdForDetails && a.studentId === student.id)
                .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
            const latest = records[0];
            const status = latest?.status || "No record";
            const row = document.createElement("div");
            row.style.cssText = "padding: 10px 0; border-bottom: 1px solid var(--color-border); display: flex; align-items: center; justify-content: space-between; font-size: 13px;";
            const badgeClass = status === "Present" ? "status-success" : status === "Absent" ? "status-danger" : "status-warning";
            row.innerHTML = `
                <span>
                    <strong>${escapeHtml(student.fullName || student.name || "Student")}</strong>
                </span>
                <span class="status ${badgeClass}">${escapeHtml(status)}${latest?.date ? ` · ${escapeHtml(latest.date)}` : ""}</span>
            `;
            attendanceContainer.appendChild(row);
        });
    }
}

function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (ch) => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[ch]));
}

function updateClassMaterialsCount(classId, currentClass) {
    const materials = getMaterials();

    const classMaterials = materials.filter(m => {
        return (m.classId === classId) || 
               (m.className && currentClass.name && m.className.trim().toLowerCase() === currentClass.name.trim().toLowerCase());
    });

    const materialsCountEl = document.getElementById("statMaterialsCount");
    if (materialsCountEl) {
        materialsCountEl.innerText = classMaterials.length;
    }
}