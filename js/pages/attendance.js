import { getCurrentTeacher, logout } from "../data.js";
import { seedData } from "../seedData.js";

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

// --- Attendance logic ---
const classes = seedData.classes;
let selectedClass = classes[0];

// Populate class select
const classSelect = document.getElementById("classSelect");
classes.forEach((classItem) => {
    const option = document.createElement("option");
    option.value = classItem.id;
    option.textContent = classItem.name;
    classSelect.appendChild(option);
});

const tableBody = document.getElementById("attendanceTableBody");

function getClassStudents() {
    return seedData.students.filter((student) =>
        selectedClass.studentIds.includes(student.id)
    );
}

function getStudentStatus(studentId) {
    const record = seedData.attendance.find(
        (item) =>
            item.studentId === studentId &&
            item.classId === selectedClass.id
    );
    return record ? record.status : "Absent";
}

function updateAttendance() {
    const students = getClassStudents();

    const presentCount = students.filter(
        (student) => getStudentStatus(student.id) === "Present"
    ).length;

    const totalCount = students.length;

    const attendancePercentage =
        totalCount > 0
            ? Math.round((presentCount / totalCount) * 100)
            : 0;

    document.getElementById("summaryClass").textContent =
        selectedClass.name;

    document.getElementById("summaryStudents").textContent = totalCount;

    document.getElementById("summaryPresent").textContent = presentCount;

    document.getElementById("summaryPercentage").textContent =
        attendancePercentage + "%";

    tableBody.innerHTML = students
        .map((student) => {
            const status = getStudentStatus(student.id);

            return `
                <tr>
                    <td>${student.id}</td>
                    <td>${student.fullName}</td>
                    <td>${student.academicLevel}</td>
                    <td>
                        <button
                            class="attendance-toggle ${status.toLowerCase()}"
                            data-student-id="${student.id}"
                        >
                            ${status}
                        </button>
                    </td>
                </tr>
            `;
        })
        .join("");
}

// Toggle attendance on click
tableBody.addEventListener("click", (event) => {
    const button = event.target.closest(".attendance-toggle");

    if (!button) {
        return;
    }

    const studentId = button.dataset.studentId;

    const record = seedData.attendance.find(
        (item) =>
            item.studentId === studentId &&
            item.classId === selectedClass.id
    );

    if (record) {
        record.status =
            record.status === "Present" ? "Absent" : "Present";
    } else {
        seedData.attendance.push({
            id:
                "ATT" +
                String(seedData.attendance.length + 1).padStart(3, "0"),
            studentId: studentId,
            classId: selectedClass.id,
            subjectId: selectedClass.subjectId,
            date: new Date().toISOString().split("T")[0],
            status: "Present",
        });
    }

    updateAttendance();
});

// Class select change
classSelect.addEventListener("change", () => {
    selectedClass = classes.find(
        (classItem) => classItem.id === classSelect.value
    );
    updateAttendance();
});

// Initial render
updateAttendance();

// --- Logout ---
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", (event) => {
        event.preventDefault();
        logout();
    });
}

console.log("Attendance page loaded successfully");
