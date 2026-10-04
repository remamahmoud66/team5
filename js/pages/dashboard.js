import { getCurrentTeacher } from "../data.js";
import { loadWeather } from "../weather_api.js";

const read = (key, fallback = []) => {
    try {
        const value = JSON.parse(localStorage.getItem(key));
        return Array.isArray(value) ? value : fallback;
    } catch {
        return fallback;
    }
};

const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
}[char]));

document.addEventListener("DOMContentLoaded", () => {
    const teacher = getCurrentTeacher();
    if (!teacher) {
        window.location.href = "./login.html";
        return;
    }

    const classes = read("classes").filter((item) => item.teacherId === teacher.id);
    const students = read("students");
    const subjects = read("subjects");
    const attendance = read("attendance");
    const exams = read("exams").filter((item) => item.teacherId === teacher.id && !item.isHidden && !item.isDeleted);
    const grades = read("grades");
    const studentMap = new Map(students.map((student) => [student.id, student]));
    const subjectMap = new Map(subjects.map((subject) => [subject.id, subject]));

    const firstName = (teacher.fullName || "Teacher").trim().split(/\s+/)[0];
    const initials = (teacher.fullName || "Teacher")
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || "")
        .join("");
    document.getElementById("profileName")?.replaceChildren(document.createTextNode(teacher.fullName));
    document.getElementById("avatar")?.replaceChildren(document.createTextNode(initials || firstName.charAt(0).toUpperCase()));
    document.getElementById("userName")?.replaceChildren(document.createTextNode(teacher.fullName));

    const totalAttendance = attendance.filter((record) => classes.some((cls) => cls.id === record.classId)).length;
    const presentCount = attendance.filter((record) => classes.some((cls) => cls.id === record.classId) && record.status === "Present").length;
    const overallAttendance = totalAttendance ? Math.round((presentCount / totalAttendance) * 100) : 0;
    const attendanceChart = document.getElementById("attendanceChart");
    attendanceChart?.style.setProperty("--attendance", `${overallAttendance}%`);
    document.getElementById("overallAttendanceText")?.replaceChildren(document.createTextNode(`${overallAttendance}%`));

    const courseStatisticsEl = document.getElementById("courseStatistics");
    if (courseStatisticsEl) {
        courseStatisticsEl.innerHTML = subjects
            .filter((subject) => subject.teacherId === teacher.id)
            .map((subject) => {
                const subjectAttendance = attendance.filter((record) => record.subjectId === subject.id && classes.some((cls) => cls.id === record.classId));
                const present = subjectAttendance.filter((record) => record.status === "Present").length;
                const percentage = subjectAttendance.length ? Math.round((present / subjectAttendance.length) * 100) : 0;
                return `<div class="course-item">
                    <div class="course-info"><span class="course-dot"></span><div><strong>${escapeHtml(subject.name)}</strong><small>${escapeHtml(subject.code || "Course")}</small></div></div>
                    <strong class="percentage">${percentage}%</strong>
                </div>`;
            }).join("");
    }

    const classPerformanceSelect = document.getElementById("classPerformanceSelect");
    const selectedClassName = document.getElementById("selectedClassName");
    const selectedSubjectName = document.getElementById("selectedSubjectName");
    const averageMark = document.getElementById("averageMark");
    const highestMark = document.getElementById("highestMark");
    const lowestMark = document.getElementById("lowestMark");
    const gradedStudents = document.getElementById("gradedStudents");
    const studentPerformance = document.getElementById("studentPerformance");

    const examMap = new Map(exams.map((exam) => [exam.id, exam]));
    const gradesForClass = (classId) => {
        const classRecord = classes.find((item) => item.id === classId);
        if (!classRecord) return { classRecord: null, subject: null, grades: [], totalStudents: 0 };
        const classExamIds = exams.filter((exam) => exam.classId === classId).map((exam) => exam.id);
        const classStudentIds = new Set(classRecord.studentIds || []);
        const classGrades = grades.filter((grade) => classExamIds.includes(grade.examId) && classStudentIds.has(grade.studentId) && Number.isFinite(Number(grade.mark)) && Number(examMap.get(grade.examId)?.totalMarks || 0) > 0);
        const subject = subjectMap.get(classRecord.subjectId) || null;
        return { classRecord, subject, grades: classGrades, totalStudents: (classRecord.studentIds || []).length };
    };

    const renderStudentMarks = (selected) => {
        if (!selected.grades.length) return '<div class="no-grades">No grades have been recorded for this class yet.</div>';
        const grouped = new Map();
        selected.grades.forEach((grade) => {
            const current = grouped.get(grade.studentId) || [];
            const total = Number(examMap.get(grade.examId)?.totalMarks || 0);
            current.push(total ? Math.max(0, Math.min(100, (Number(grade.mark || 0) / total) * 100)) : 0);
            grouped.set(grade.studentId, current);
        });
        return [...grouped.entries()].map(([studentId, marks]) => {
            const student = studentMap.get(studentId);
            const mark = Math.round(marks.reduce((sum, item) => sum + item, 0) / marks.length);
            const name = student?.fullName || "Unknown Student";
            return `<div class="student-mark-row">
                <div class="student-name"><span class="student-avatar">${escapeHtml(name.charAt(0))}</span><span>${escapeHtml(name)}</span></div>
                <div class="student-mark"><div class="mark-bar"><div class="mark-progress" style="width:${Math.min(mark, 100)}%"></div></div><strong>${mark}</strong></div>
            </div>`;
        }).join("");
    };

    const renderPerformance = (classId) => {
        const selected = gradesForClass(classId);
        selectedClassName && (selectedClassName.textContent = selected.classRecord?.name || "No class");
        selectedSubjectName && (selectedSubjectName.textContent = selected.subject?.name || "No subject");
        const marks = selected.grades.map((grade) => { const total = Number(examMap.get(grade.examId)?.totalMarks || 0); return total ? Math.max(0, Math.min(100, (Number(grade.mark) / total) * 100)) : null; }).filter(Number.isFinite);
        const average = marks.length ? Math.round(marks.reduce((sum, mark) => sum + mark, 0) / marks.length) : 0;
        const highest = marks.length ? Math.max(...marks) : 0;
        const lowest = marks.length ? Math.min(...marks) : 0;
        averageMark && (averageMark.textContent = `${average}%`);
        highestMark && (highestMark.textContent = highest);
        lowestMark && (lowestMark.textContent = lowest);
        gradedStudents && (gradedStudents.textContent = `${new Set(selected.grades.map((grade) => grade.studentId)).size} / ${selected.totalStudents}`);
        studentPerformance && (studentPerformance.innerHTML = renderStudentMarks(selected));
    };

    if (classPerformanceSelect) {
        classPerformanceSelect.innerHTML = classes.map((classItem) => {
            const subject = subjectMap.get(classItem.subjectId);
            return `<option value="${escapeHtml(classItem.id)}">${escapeHtml(classItem.name)}${subject ? ` - ${escapeHtml(subject.name)}` : ""}</option>`;
        }).join("");
        if (classes[0]) {
            classPerformanceSelect.value = classes[0].id;
            renderPerformance(classes[0].id);
        } else {
            renderPerformance("");
        }
        classPerformanceSelect.addEventListener("change", () => renderPerformance(classPerformanceSelect.value));
    }

    document.getElementById("createHomeworkBtn")?.addEventListener("click", () => {
        window.location.href = "./homework.html";
    });

    try { loadWeather(); } catch (error) { console.warn("Weather widget unavailable", error); }
});
