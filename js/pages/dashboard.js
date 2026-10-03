import { getCurrentTeacher } from "../data.js";
import { seedData } from "../seedData.js";
import { loadWeather } from "../weather_api.js";
import { logout } from "../data.js";

// --- Auth guard ---
const teacher = getCurrentTeacher();
if (!teacher) {
    window.location.href = "../login.html";
}

// --- Populate header ---
const splitedName = teacher.fullName.split(" ");
const firstName = splitedName[0];
const secondName = splitedName[1];

document.getElementById("profileName").textContent = teacher.fullName;
document.getElementById("avatar").textContent =
    `${firstName[0]}${secondName[0]}`;

// --- Welcome ---
document.getElementById("userName").textContent = teacher.fullName;

// --- Attendance Statistics ---
const attendance = seedData.attendance;
const totalAttendance = attendance.length;
const presentCount = attendance.filter(
    (item) => item.status === "Present"
).length;
const overallAttendance =
    totalAttendance > 0
        ? Math.round((presentCount / totalAttendance) * 100)
        : 0;

const attendanceChart = document.getElementById("attendanceChart");
if (attendanceChart) {
    attendanceChart.style.setProperty("--attendance", overallAttendance + "%");
}

const overallAttendanceText = document.getElementById("overallAttendanceText");
if (overallAttendanceText) {
    overallAttendanceText.textContent = overallAttendance + "%";
}

// --- Course Statistics ---
const courseStatisticsEl = document.getElementById("courseStatistics");
const courseStatisticsHTML = seedData.subjects
    .map((subject) => {
        const subjectAttendance = attendance.filter(
            (item) => item.subjectId === subject.id
        );
        const present = subjectAttendance.filter(
            (item) => item.status === "Present"
        ).length;
        const percentage =
            subjectAttendance.length > 0
                ? Math.round((present / subjectAttendance.length) * 100)
                : 0;

        return `
            <div class="course-item">
                <div class="course-info">
                    <span class="course-dot"></span>
                    <div>
                        <strong>${subject.name}</strong>
                        <small>${subject.code || "Course"}</small>
                    </div>
                </div>
                <strong class="percentage">${percentage}%</strong>
            </div>
        `;
    })
    .join("");

if (courseStatisticsEl) {
    courseStatisticsEl.innerHTML = courseStatisticsHTML;
}

// --- Class Performance ---
function calculateClassStats(classId) {
    const selectedClass = seedData.classes.find(
        (classItem) => classItem.id === classId
    );

    if (!selectedClass) {
        return {
            subject: null,
            exam: null,
            grades: [],
            average: 0,
            highest: 0,
            lowest: 0,
            gradedStudents: 0,
            totalStudents: 0,
        };
    }

    const subject = seedData.subjects.find(
        (item) => item.id === selectedClass.subjectId
    );

    const exam = seedData.exams.find(
        (item) => item.classId === selectedClass.id
    );

    const grades = exam
        ? seedData.grades.filter((grade) => grade.examId === exam.id)
        : [];

    const totalMarks = grades.reduce((sum, grade) => sum + grade.mark, 0);

    const average =
        grades.length > 0 ? Math.round(totalMarks / grades.length) : 0;

    const highest =
        grades.length > 0
            ? Math.max(...grades.map((grade) => grade.mark))
            : 0;

    const lowest =
        grades.length > 0
            ? Math.min(...grades.map((grade) => grade.mark))
            : 0;

    return {
        subject,
        exam,
        grades,
        average,
        highest,
        lowest,
        gradedStudents: grades.length,
        totalStudents: selectedClass.studentIds.length,
    };
}

function renderStudentMarks(grades) {
    if (grades.length === 0) {
        return `
            <div class="no-grades">
                No grades have been recorded for this class yet.
            </div>
        `;
    }

    return grades
        .map((grade) => {
            const student = seedData.students.find(
                (student) => student.id === grade.studentId
            );

            const studentName = student
                ? student.fullName
                : "Unknown Student";

            return `
                <div class="student-mark-row">
                    <div class="student-name">
                        <span class="student-avatar">
                            ${studentName.charAt(0)}
                        </span>
                        <span>${studentName}</span>
                    </div>
                    <div class="student-mark">
                        <div class="mark-bar">
                            <div
                                class="mark-progress"
                                style="width: ${grade.mark}%"
                            ></div>
                        </div>
                        <strong>${grade.mark}</strong>
                    </div>
                </div>
            `;
        })
        .join("");
}

// Populate class select dropdown
const classPerformanceSelect = document.getElementById(
    "classPerformanceSelect"
);

seedData.classes.forEach((classItem) => {
    const subject = seedData.subjects.find(
        (item) => item.id === classItem.subjectId
    );
    const option = document.createElement("option");
    option.value = classItem.id;
    option.textContent = `${classItem.name}${subject ? ` - ${subject.name}` : ""}`;
    classPerformanceSelect.appendChild(option);
});

// Initial render
const firstClass = seedData.classes[0];
const initialStats = calculateClassStats(firstClass.id);

document.getElementById("selectedClassName").textContent = firstClass.name;

const firstSubject = seedData.subjects.find(
    (subject) => subject.id === firstClass.subjectId
);
document.getElementById("selectedSubjectName").textContent = firstSubject
    ? firstSubject.name
    : "No subject";

document.getElementById("averageMark").textContent =
    `${initialStats.average}%`;
document.getElementById("highestMark").textContent = initialStats.highest;
document.getElementById("lowestMark").textContent = initialStats.lowest;
document.getElementById("gradedStudents").textContent =
    `${initialStats.gradedStudents} / ${initialStats.totalStudents}`;
document.getElementById("studentPerformance").innerHTML = renderStudentMarks(
    initialStats.grades
);

// Class select change handler
classPerformanceSelect.addEventListener("change", () => {
    const selectedClassId = classPerformanceSelect.value;
    const stats = calculateClassStats(selectedClassId);

    const selectedClass = seedData.classes.find(
        (classItem) => classItem.id === selectedClassId
    );

    document.getElementById("selectedClassName").textContent = selectedClass
        ? selectedClass.name
        : "No class";

    document.getElementById("selectedSubjectName").textContent = stats.subject
        ? stats.subject.name
        : "No subject";

    document.getElementById("averageMark").textContent =
        `${stats.average}%`;
    document.getElementById("highestMark").textContent = stats.highest;
    document.getElementById("lowestMark").textContent = stats.lowest;
    document.getElementById("gradedStudents").textContent =
        `${stats.gradedStudents} / ${stats.totalStudents}`;
    document.getElementById("studentPerformance").innerHTML =
        renderStudentMarks(stats.grades);
});

// --- Create Homework button ---
const createHomeworkBtn = document.getElementById("createHomeworkBtn");
if (createHomeworkBtn) {
    createHomeworkBtn.addEventListener("click", () => {
        console.log("Create Homework clicked");
    });
}

// --- Weather ---
loadWeather();

// --- Logout ---
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", (event) => {
        event.preventDefault();
        logout();
    });
}

console.log("Dashboard page loaded successfully");
