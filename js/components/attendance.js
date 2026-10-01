
import { seedData } from "../seedData.js";

export function showAttendance(app) {

    const classes = seedData.classes;

    const attendance = seedData.attendance;

    const selectedClass = classes[0];

    const students = seedData.students.filter(student =>
        selectedClass.studentIds.includes(student.id)
    );

    const classAttendance = attendance.filter(item =>
        item.classId === selectedClass.id
    );

    const presentCount = classAttendance.filter(item =>
        item.status === "Present"
    ).length;

    const totalCount = classAttendance.length;

    const attendancePercentage =
        totalCount > 0
            ? Math.round((presentCount / totalCount) * 100)
            : 0;


    app.innerHTML = `
        <section class="page-content">

            <!-- Page Header -->
            <div class="page-header">
                <div>
                    <h1>Attendance</h1>
                    <p>Track and manage student attendance.</p>
                </div>

                <select id="classSelect" class="class-select">
                    ${classes.map(classItem => `
                        <option value="${classItem.id}">
                            ${classItem.name}
                        </option>
                    `).join("")}
                </select>
            </div>


            <!-- Attendance Summary -->
            <div class="attendance-summary">

                <div class="summary-card">
                    <h3>Class</h3>
                    <p>${selectedClass.name}</p>
                </div>

                <div class="summary-card">
                    <h3>Total Students</h3>
                    <p>${students.length}</p>
                </div>

                <div class="summary-card">
                    <h3>Present</h3>
                    <p>${presentCount}</p>
                </div>

                <div class="summary-card">
                    <h3>Attendance</h3>
                    <p>${attendancePercentage}%</p>
                </div>

            </div>


            <!-- Attendance Table -->
            <div class="attendance-table-container">

                <table class="attendance-table">

                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Student Name</th>
                            <th>Grade</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>

                        ${students.map(student => {

                            const record = classAttendance.find(item =>
                                item.studentId === student.id
                            );

                            const status = record
                                ? record.status
                                : "Not Recorded";

                            return `
                                <tr>

                                    <td>${student.id}</td>

                                    <td>
                                        ${student.fullName}
                                    </td>

                                    <td>
                                        ${student.grade}
                                    </td>

                                    <td>
                                        <span class="attendance-status ${status.toLowerCase()}">
                                            ${status}
                                        </span>
                                    </td>

                                </tr>
                            `;

                        }).join("")}

                    </tbody>

                </table>

            </div>

        </section>
    `;


    const classSelect = document.getElementById("classSelect");

    classSelect.addEventListener("change", () => {

        const selectedClassId = classSelect.value;

        const selectedClass = classes.find(classItem =>
            classItem.id === selectedClassId
        );

        const students = seedData.students.filter(student =>
            selectedClass.studentIds.includes(student.id)
        );

        const classAttendance = attendance.filter(item =>
            item.classId === selectedClass.id
        );

        const presentCount = classAttendance.filter(item =>
            item.status === "Present"
        ).length;

        const totalCount = classAttendance.length;

        const attendancePercentage =
            totalCount > 0
                ? Math.round((presentCount / totalCount) * 100)
                : 0;


        document.querySelector(".summary-card:nth-child(1) p")
            .textContent = selectedClass.name;

        document.querySelector(".summary-card:nth-child(2) p")
            .textContent = students.length;

        document.querySelector(".summary-card:nth-child(3) p")
            .textContent = presentCount;

        document.querySelector(".summary-card:nth-child(4) p")
            .textContent = attendancePercentage + "%";


        const tableBody = document.querySelector(".attendance-table tbody");

        tableBody.innerHTML = students.map(student => {

            const record = classAttendance.find(item =>
                item.studentId === student.id
            );

            const status = record
                ? record.status
                : "Not Recorded";

            return `
                <tr>

                    <td>${student.id}</td>

                    <td>
                        ${student.fullName}
                    </td>

                    <td>
                        ${student.grade}
                    </td>

                    <td>
                        <span class="attendance-status ${status.toLowerCase()}">
                            ${status}
                        </span>
                    </td>

                </tr>
            `;

        }).join("");
    });
}

