import { getCurrentTeacher } from "../data.js";

document.addEventListener("DOMContentLoaded", () => {
    const teacher = getCurrentTeacher();
    if (!teacher) {
        window.location.href = "./login.html";
        return;
    }

    const read = (key, fallback = []) => {
        try {
            const value = JSON.parse(localStorage.getItem(key));
            return Array.isArray(value) ? value : fallback;
        } catch {
            return fallback;
        }
    };
    const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
    const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (char) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
    }[char]));
    const localDateISO = () => {
        const d = new Date();
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
    };

    const classes = read("classes").filter((item) => item.teacherId === teacher.id);
    const students = read("students");
    let attendance = read("attendance");
    const studentMap = new Map(students.map((student) => [student.id, student]));
    let selectedClass = classes[0] || null;

    const classSelect = document.getElementById("classSelect");
    const tableBody = document.getElementById("attendanceTableBody");

    if (classSelect) {
        classSelect.innerHTML = classes.length
            ? classes.map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}</option>`).join("")
            : '<option value="">No Classes Available</option>';
    }

    const getClassStudents = () => selectedClass ? (selectedClass.studentIds || []).map((id) => studentMap.get(id)).filter(Boolean) : [];
    const getStudentStatus = (studentId) => {
        const record = attendance.find((item) => item.studentId === studentId && item.classId === selectedClass?.id);
        return record?.status || "Absent";
    };

    const saveAttendance = () => {
        const currentClasses = read("attendance");
        const otherTeacherRecords = currentClasses.filter((record) => !classes.some((cls) => cls.id === record.classId));
        write("attendance", [...otherTeacherRecords, ...attendance.filter((record) => classes.some((cls) => cls.id === record.classId))]);
    };

    const render = () => {
        const classStudents = getClassStudents();
        const presentCount = classStudents.filter((student) => getStudentStatus(student.id) === "Present").length;
        const totalCount = classStudents.length;
        const percentage = totalCount ? Math.round((presentCount / totalCount) * 100) : 0;

        document.getElementById("summaryClass")?.replaceChildren(document.createTextNode(selectedClass?.name || "No class selected"));
        document.getElementById("summaryStudents")?.replaceChildren(document.createTextNode(String(totalCount)));
        document.getElementById("summaryPresent")?.replaceChildren(document.createTextNode(String(presentCount)));
        document.getElementById("summaryPercentage")?.replaceChildren(document.createTextNode(`${percentage}%`));

        if (tableBody) {
            tableBody.innerHTML = classStudents.map((student) => {
                const status = getStudentStatus(student.id);
                return `<tr>
                    <td>${escapeHtml(student.id)}</td>
                    <td>${escapeHtml(student.fullName)}</td>
                    <td>${escapeHtml(student.academicLevel || "—")}</td>
                    <td><button type="button" class="attendance-toggle ${status.toLowerCase().replace(/\s+/g, "-")}" data-student-id="${escapeHtml(student.id)}">${escapeHtml(status)}</button></td>
                </tr>`;
            }).join("");
        }
    };

    tableBody?.addEventListener("click", (event) => {
        const button = event.target.closest(".attendance-toggle");
        if (!button || !selectedClass) return;
        const studentId = button.dataset.studentId;
        const record = attendance.find((item) => item.studentId === studentId && item.classId === selectedClass.id);
        if (record) {
            record.status = record.status === "Present" ? "Absent" : "Present";
            record.date = localDateISO();
        } else {
            const maxId = attendance.reduce((max, item) => {
                const match = String(item.id || "").match(/(\d+)$/);
                return Math.max(max, match ? Number(match[1]) : 0);
            }, 0);
            attendance.push({
                id: `ATT${String(maxId + 1).padStart(3, "0")}`,
                studentId,
                classId: selectedClass.id,
                subjectId: selectedClass.subjectId,
                date: localDateISO(),
                status: "Present",
            });
        }
        saveAttendance();
        render();
    });

    classSelect?.addEventListener("change", () => {
        selectedClass = classes.find((item) => item.id === classSelect.value) || null;
        render();
    });

    render();
});
