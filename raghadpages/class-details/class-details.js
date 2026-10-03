import { 
    getClasses, 
    getStudents, 
    getMaterials, 
    getTeachers
} from '../storage.js';

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

    if (titleElement) titleElement.innerText = currentClass.name || "Untitled Class";
    if (subtitleElement) subtitleElement.innerText = `${currentClass.subject || 'Subject'} `;

    const studentIds = currentClass.studentIds || [];
    const enrolledCountEl = document.getElementById("statEnrolledCount");
    if (enrolledCountEl) enrolledCountEl.innerText = studentIds.length;

    loadClassStudents(studentIds);
    updateClassMaterialsCount(classId, currentClass);

    window.addEventListener("storage", () => {
        updateClassMaterialsCount(classId, currentClass);
    });

    window.addEventListener("focus", () => {
        updateClassMaterialsCount(classId, currentClass);
    });
});

function loadClassStudents(studentIds) {
    const container = document.getElementById("classStudentsList");
    const attendanceContainer = document.getElementById("attendanceList");
    
    if (container) container.innerHTML = "";
    if (attendanceContainer) attendanceContainer.innerHTML = "";

    const allStudents = getStudents();

    const enrolledStudents = allStudents.filter(student => {
        const studentId = student.id || student.email || student.name;
        return studentIds.includes(studentId);
    });

    if (enrolledStudents.length === 0) {
        if (container) container.innerHTML = `<p style="color: var(--color-muted); padding: 12px;">No students enrolled in this class yet.</p>`;
        if (attendanceContainer) attendanceContainer.innerHTML = `<p style="color: var(--color-muted); padding: 12px;">No attendance records.</p>`;
        return;
    }

    enrolledStudents.forEach(student => {
        const studentName = student.name || `${student.firstName || ''} ${student.lastName || ''}`.trim() || 'Unknown Student';
        const initials = studentName.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);

        if (container) {
            const studentRow = document.createElement("div");
            studentRow.className = "card";
            studentRow.style.cssText = "padding: 12px; display: flex; align-items: center; justify-content: space-between; background: var(--color-bg);";
            
            studentRow.innerHTML = `
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 40px; height: 40px; background-color: var(--color-accent-dark); color: #fff; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px;">
                        ${initials}
                    </div>
                    <div>
                        <h4 style="font-size: 14px; margin-bottom: 2px;">${studentName}</h4>
                        <small>10th Grade</small>
                    </div>
                </div>
                <button class="btn btn-secondary" style="min-height: 32px; padding: 0 12px; font-size: 12px;">View</button>
            `;
            container.appendChild(studentRow);
        }

        if (attendanceContainer) {
            const attendanceRow = document.createElement("div");
            attendanceRow.style.cssText = "padding: 8px 0; border-bottom: 1px solid var(--color-border); display: flex; align-items: center; justify-content: space-between; font-size: 13px;";
            attendanceRow.innerHTML = `
                <div>
                    <span style="display: block; font-weight: 600; color: var(--color-text);">${studentName}</span>
                    <small style="color: var(--color-muted);">2026-09-30</small>
                </div>
                <span class="status status-success" style="padding: 2px 8px; font-size: 11px;">Present</span>
            `;
            attendanceContainer.appendChild(attendanceRow);
        }
    });
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