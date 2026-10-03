import { seedData } from "../seedData.js";

export function showAttendance(app) {

    const classes = seedData.classes;

    let selectedClass = classes[0];

    app.innerHTML = `
        <section class="page-content">

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


            <div class="attendance-summary">

                <div class="summary-card">
                    <h3>Class</h3>
                    <p id="summaryClass">${selectedClass.name}</p>
                </div>

                <div class="summary-card">
                    <h3>Total Students</h3>
                    <p id="summaryStudents"></p>
                </div>

                <div class="summary-card">
                    <h3>Present</h3>
                    <p id="summaryPresent"></p>
                </div>

                <div class="summary-card">
                    <h3>Attendance</h3>
                    <p id="summaryPercentage"></p>
                </div>

            </div>


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

                    <tbody id="attendanceTableBody"></tbody>

                </table>

            </div>

        </section>
    `;


    const classSelect =
        document.getElementById("classSelect");

    const tableBody =
        document.getElementById("attendanceTableBody");


    function getClassStudents() {

        return seedData.students.filter(student =>
            selectedClass.studentIds.includes(student.id)
        );

    }


    function getStudentStatus(studentId) {

        const record = seedData.attendance.find(item =>
            item.studentId === studentId &&
            item.classId === selectedClass.id
        );

        return record ? record.status : "Absent";

    }


    function updateAttendance() {

        const students = getClassStudents();


        const presentCount = students.filter(student =>
            getStudentStatus(student.id) === "Present"
        ).length;


        const totalCount = students.length;


        const attendancePercentage =
            totalCount > 0
                ? Math.round(
                    (presentCount / totalCount) * 100
                )
                : 0;


        document.getElementById(
            "summaryClass"
        ).textContent = selectedClass.name;


        document.getElementById(
            "summaryStudents"
        ).textContent = totalCount;


        document.getElementById(
            "summaryPresent"
        ).textContent = presentCount;


        document.getElementById(
            "summaryPercentage"
        ).textContent =
            attendancePercentage + "%";


        tableBody.innerHTML = students.map(student => {

            const status =
                getStudentStatus(student.id);


            return `
                <tr>

                    <td>
                        ${student.id}
                    </td>

                    <td>
                        ${student.fullName}
                    </td>

                    <td>
                        ${student.academicLevel}
                    </td>

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

        }).join("");

    }


    tableBody.addEventListener("click", event => {

        const button =
            event.target.closest(".attendance-toggle");


        if (!button) {
            return;
        }


        const studentId =
            button.dataset.studentId;


        const record =
            seedData.attendance.find(item =>
                item.studentId === studentId &&
                item.classId === selectedClass.id
            );


        if (record) {

            record.status =
                record.status === "Present"
                    ? "Absent"
                    : "Present";

        } else {

            seedData.attendance.push({

                id:
                    "ATT" +
                    String(
                        seedData.attendance.length + 1
                    ).padStart(3, "0"),

                studentId: studentId,

                classId: selectedClass.id,

                subjectId: selectedClass.subjectId,

                date:
                    new Date()
                        .toISOString()
                        .split("T")[0],

                status: "Present"

            });

        }


        updateAttendance();

    });


    classSelect.addEventListener("change", () => {

        selectedClass =
            classes.find(classItem =>
                classItem.id === classSelect.value
            );


        updateAttendance();

    });


    updateAttendance();

}