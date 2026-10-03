/* =========================================
   STUDENTS DATA
========================================= */

const STORAGE_KEY = "eduTrackStudents";

const sampleStudents = [
    {
        name: "Lina Ahmad",
        id: "ST-1001",
        email: "lina.ahmad@example.com",
        phone: "079 123 4567",
        className: "Class A",
        location: "Amman",
        grade: 92,
        attendance: 96,
        status: "active"
    },

    {
        name: "Omar Khaled",
        id: "ST-1002",
        email: "omar.khaled@example.com",
        phone: "078 456 1234",
        className: "Class B",
        location: "Zarqa",
        grade: 86,
        attendance: 91,
        status: "active"
    },

    {
        name: "Sara Ali",
        id: "ST-1003",
        email: "sara.ali@example.com",
        phone: "077 321 9876",
        className: "Class A",
        location: "Irbid",
        grade: 78,
        attendance: 88,
        status: "active"
    },

    {
        name: "Yazan Mahmoud",
        id: "ST-1004",
        email: "yazan.mahmoud@example.com",
        phone: "079 987 6543",
        className: "Class C",
        location: "Amman",
        grade: 68,
        attendance: 73,
        status: "active"
    },

    {
        name: "Dana Samir",
        id: "ST-1005",
        email: "dana.samir@example.com",
        phone: "078 111 2233",
        className: "Class B",
        location: "Salt",
        grade: 54,
        attendance: 62,
        status: "inactive"
    },

    {
        name: "Adam Nasser",
        id: "ST-1006",
        email: "adam.nasser@example.com",
        phone: "077 555 6677",
        className: "Class C",
        location: "Amman",
        grade: 89,
        attendance: 94,
        status: "active"
    }
];


/* =========================================
   LOAD STUDENTS
========================================= */

let students =
    JSON.parse(
        localStorage.getItem(STORAGE_KEY)
    ) || sampleStudents;


/* =========================================
   SAVE STUDENTS
========================================= */

function saveStudents() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(students)
    );

}


/* =========================================
   DOM ELEMENTS
========================================= */

const studentModal =
    document.getElementById("studentModal");

const detailsModal =
    document.getElementById("detailsModal");

const studentForm =
    document.getElementById("studentForm");

const modalTitle =
    document.getElementById("modalTitle");

const studentTableBody =
    document.getElementById("studentTableBody");

const searchInput =
    document.getElementById("searchInput");

const classFilter =
    document.getElementById("classFilter");

const statusFilter =
    document.getElementById("statusFilter");

const directorySummary =
    document.getElementById("directorySummary");

const emptyState =
    document.getElementById("emptyState");

const attendanceProgress =
    document.getElementById("attendanceProgress");


let editingStudentId = null;


/* =========================================
   INITIAL LOAD
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        displayStudents();
        updateAnalytics();

    }
);


/* =========================================
   INITIALS
========================================= */

function getInitials(name) {

    const parts =
        name.trim().split(" ");

    if (parts.length === 1) {
        return parts[0]
            .substring(0, 2)
            .toUpperCase();
    }

    return (
        parts[0][0] +
        parts[parts.length - 1][0]
    ).toUpperCase();

}


/* =========================================
   STATUS
========================================= */

function getStatusClass(status) {

    if (status === "active") {
        return "status-active";
    }

    return "status-inactive";

}


function getStatusText(status) {

    if (status === "active") {
        return "Active";
    }

    return "Inactive";

}


/* =========================================
   DISPLAY STUDENTS
========================================= */

function displayStudents() {

    const search =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";

    const selectedClass =
        classFilter
            ? classFilter.value
            : "all";

    const selectedStatus =
        statusFilter
            ? statusFilter.value
            : "all";


    const filteredStudents =
        students.filter(function (student) {

            const matchesSearch =
                student.name
                    .toLowerCase()
                    .includes(search) ||

                student.id
                    .toLowerCase()
                    .includes(search) ||

                student.email
                    .toLowerCase()
                    .includes(search);


            const matchesClass =
                selectedClass === "all" ||
                student.className === selectedClass;


            const matchesStatus =
                selectedStatus === "all" ||
                student.status === selectedStatus;


            return (
                matchesSearch &&
                matchesClass &&
                matchesStatus
            );

        });


    studentTableBody.innerHTML = "";


    if (filteredStudents.length === 0) {

        emptyState.classList.add("show");

    } else {

        emptyState.classList.remove("show");

    }


    filteredStudents.forEach(function (student) {

        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td>
                <div class="student-info">

                    <div class="student-avatar">
                        ${getInitials(student.name)}
                    </div>

                    <div>
                        <div class="student-name">
                            ${student.name}
                        </div>

                        <div class="student-id">
                            ${student.id}
                        </div>
                    </div>

                </div>
            </td>

            <td>
                ${student.className}
            </td>

            <td class="progress-cell">

                <div class="progress-label">
                    <span>Grade</span>
                    <strong>${student.grade}%</strong>
                </div>

                <div class="progress-bar">
                    <span
                        style="width:${student.grade}%">
                    </span>
                </div>

            </td>

            <td class="progress-cell">

                <div class="progress-label">
                    <span>Attendance</span>
                    <strong>${student.attendance}%</strong>
                </div>

                <div class="progress-bar">
                    <span
                        style="width:${student.attendance}%">
                    </span>
                </div>

            </td>

            <td>

                <span class="status-badge ${getStatusClass(student.status)}">
                    ${getStatusText(student.status)}
                </span>

            </td>

            <td>

                <div class="action-buttons">

                    <button
                        class="table-action"
                        onclick="viewStudent('${student.id}')"
                        title="View"
                    >
                        View
                    </button>

                    <button
                        class="table-action"
                        onclick="editStudent('${student.id}')"
                        title="Edit"
                    >
                        Edit
                    </button>

                    <button
                        class="table-action delete"
                        onclick="deleteStudent('${student.id}')"
                        title="Delete"
                    >
                        ×
                    </button>

                </div>

            </td>
        `;


        studentTableBody.appendChild(row);

    });


    directorySummary.textContent =
        `Showing ${filteredStudents.length} of ${students.length} students`;

}


/* =========================================
   ANALYTICS
========================================= */

function updateAnalytics() {

    const total =
        students.length;


    if (total === 0) {

        document.getElementById(
            "averageGrade"
        ).textContent = "0%";

        document.getElementById(
            "totalStudents"
        ).textContent = "0";

        document.getElementById(
            "activeStudents"
        ).textContent = "0";

        document.getElementById(
            "averageAttendance"
        ).textContent = "0%";

        return;

    }


    const gradeTotal =
        students.reduce(
            function (sum, student) {
                return sum + Number(student.grade);
            },
            0
        );


    const attendanceTotal =
        students.reduce(
            function (sum, student) {
                return sum + Number(student.attendance);
            },
            0
        );


    const averageGrade =
        Math.round(
            gradeTotal / total
        );


    const averageAttendance =
        Math.round(
            attendanceTotal / total
        );


    const excellent =
        students.filter(
            student => student.grade >= 90
        ).length;


    const good =
        students.filter(
            student =>
                student.grade >= 75 &&
                student.grade < 90
        ).length;


    const average =
        students.filter(
            student =>
                student.grade >= 60 &&
                student.grade < 75
        ).length;


    const needsSupport =
        students.filter(
            student =>
                student.grade < 60
        ).length;


    const activeStudents =
        students.filter(
            student =>
                student.status === "active"
        ).length;


    document.getElementById(
        "averageGrade"
    ).textContent =
        `${averageGrade}%`;


    document.getElementById(
        "excellentCount"
    ).textContent =
        excellent;


    document.getElementById(
        "goodCount"
    ).textContent =
        good;


    document.getElementById(
        "focusCount"
    ).textContent =
        needsSupport;


    document.getElementById(
        "totalStudents"
    ).textContent =
        total;


    document.getElementById(
        "activeStudents"
    ).textContent =
        activeStudents;


    document.getElementById(
        "averageAttendance"
    ).textContent =
        `${averageAttendance}%`;


    document.getElementById(
        "needsAttention"
    ).textContent =
        needsSupport;


    document.getElementById(
        "activeStudentsText"
    ).textContent =
        `${activeStudents} active students`;


    document.getElementById(
        "attendanceProgress"
    ).style.width =
        `${averageAttendance}%`;


    updateGradeRing(averageGrade);

}


/* =========================================
   GRADE RING
========================================= */

function updateGradeRing(grade) {

    const ring =
        document.querySelector(".grade-ring");


    if (!ring) {
        return;
    }


    const degrees =
        (grade / 100) * 360;


    ring.style.background = `
        conic-gradient(
            var(--color-accent) 0deg,
            var(--color-accent-dark) ${degrees}deg,
            var(--color-border) ${degrees}deg
        )
    `;

}


/* =========================================
   ADD STUDENT
========================================= */

document
    .getElementById("addStudentBtn")
    .addEventListener(
        "click",
        openAddModal
    );


document
    .getElementById("emptyAddBtn")
    .addEventListener(
        "click",
        openAddModal
    );


function openAddModal() {

    editingStudentId = null;

    modalTitle.textContent =
        "Add Student";

    studentForm.reset();

    document.getElementById(
        "studentEditIndex"
    ).value = "";

    studentModal.classList.add(
        "show"
    );

}


/* =========================================
   CLOSE ADD / EDIT MODAL
========================================= */

function closeModal() {

    studentModal.classList.remove(
        "show"
    );

    editingStudentId = null;

}


document
    .getElementById("closeModal")
    .addEventListener(
        "click",
        closeModal
    );


document
    .getElementById("cancelModal")
    .addEventListener(
        "click",
        closeModal
    );


/* =========================================
   EDIT STUDENT
========================================= */

function editStudent(id) {

    const student =
        students.find(
            student =>
                student.id === id
        );


    if (!student) {
        return;
    }


    editingStudentId = id;


    modalTitle.textContent =
        "Edit Student";


    document.getElementById(
        "studentName"
    ).value =
        student.name;


    document.getElementById(
        "studentId"
    ).value =
        student.id;


    document.getElementById(
        "studentEmail"
    ).value =
        student.email;


    document.getElementById(
        "studentPhone"
    ).value =
        student.phone;


    document.getElementById(
        "studentClass"
    ).value =
        student.className;


    document.getElementById(
        "studentLocation"
    ).value =
        student.location;


    document.getElementById(
        "studentGrade"
    ).value =
        student.grade;


    document.getElementById(
        "studentAttendance"
    ).value =
        student.attendance;


    document.getElementById(
        "studentStatus"
    ).value =
        student.status;


    studentModal.classList.add(
        "show"
    );

}


/* =========================================
   SAVE STUDENT
========================================= */

studentForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const studentData = {

            name:
                document.getElementById(
                    "studentName"
                ).value.trim(),

            id:
                document.getElementById(
                    "studentId"
                ).value.trim(),

            email:
                document.getElementById(
                    "studentEmail"
                ).value.trim(),

            phone:
                document.getElementById(
                    "studentPhone"
                ).value.trim(),

            className:
                document.getElementById(
                    "studentClass"
                ).value,

            location:
                document.getElementById(
                    "studentLocation"
                ).value.trim(),

            grade:
                Number(
                    document.getElementById(
                        "studentGrade"
                    ).value
                ),

            attendance:
                Number(
                    document.getElementById(
                        "studentAttendance"
                    ).value
                ),

            status:
                document.getElementById(
                    "studentStatus"
                ).value

        };


        /* EDIT */

        if (editingStudentId) {

            const index =
                students.findIndex(
                    student =>
                        student.id ===
                        editingStudentId
                );


            if (index !== -1) {

                students[index] =
                    studentData;

            }

        }

        /* ADD */

        else {

            const existingStudent =
                students.find(
                    student =>
                        student.id ===
                        studentData.id
                );


            if (existingStudent) {

                alert(
                    "Student ID already exists."
                );

                return;

            }


            students.push(
                studentData
            );

        }


        saveStudents();

        displayStudents();

        updateAnalytics();

        closeModal();

    }
);


/* =========================================
   VIEW STUDENT
========================================= */

function viewStudent(id) {

    const student =
        students.find(
            student =>
                student.id === id
        );


    if (!student) {
        return;
    }


    document.getElementById(
        "detailsName"
    ).textContent =
        student.name;


    document.getElementById(
        "detailsAvatar"
    ).textContent =
        getInitials(student.name);


    document.getElementById(
        "detailsStudentName"
    ).textContent =
        student.name;


    document.getElementById(
        "detailsStudentId"
    ).textContent =
        student.id;


    document.getElementById(
        "detailsStatus"
    ).textContent =
        getStatusText(student.status);


    document.getElementById(
        "detailsEmail"
    ).textContent =
        student.email || "—";


    document.getElementById(
        "detailsPhone"
    ).textContent =
        student.phone || "—";


    document.getElementById(
        "detailsLocation"
    ).textContent =
        student.location || "—";


    document.getElementById(
        "detailsClass"
    ).textContent =
        student.className;


    document.getElementById(
        "detailsGrade"
    ).textContent =
        `${student.grade}%`;


    document.getElementById(
        "detailsAttendance"
    ).textContent =
        `${student.attendance}%`;


    document.getElementById(
        "detailsGradeBar"
    ).style.width =
        `${student.grade}%`;


    document.getElementById(
        "detailsAttendanceBar"
    ).style.width =
        `${student.attendance}%`;


    detailsModal.classList.add(
        "show"
    );

}


/* =========================================
   CLOSE DETAILS
========================================= */

document
    .getElementById("closeDetails")
    .addEventListener(
        "click",
        function () {

            detailsModal.classList.remove(
                "show"
            );

        }
    );


/* =========================================
   DELETE STUDENT
========================================= */

function deleteStudent(id) {

    const student =
        students.find(
            student =>
                student.id === id
        );


    if (!student) {
        return;
    }


    const confirmed =
        confirm(
            `Delete ${student.name}?`
        );


    if (!confirmed) {
        return;
    }


    students =
        students.filter(
            student =>
                student.id !== id
        );


    saveStudents();

    displayStudents();

    updateAnalytics();

}


/* =========================================
   SEARCH
========================================= */

searchInput.addEventListener(
    "input",
    displayStudents
);


/* =========================================
   CLASS FILTER
========================================= */

classFilter.addEventListener(
    "change",
    displayStudents
);


/* =========================================
   STATUS FILTER
========================================= */

statusFilter.addEventListener(
    "change",
    displayStudents
);


/* =========================================
   CLEAR FILTERS
========================================= */

document
    .getElementById("clearFiltersBtn")
    .addEventListener(
        "click",
        function () {

            searchInput.value = "";

            classFilter.value =
                "all";

            statusFilter.value =
                "all";

            displayStudents();

        }
    );


/* =========================================
   CLOSE MODALS WHEN CLICKING OUTSIDE
========================================= */

window.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            studentModal
        ) {

            closeModal();

        }


        if (
            event.target ===
            detailsModal
        ) {

            detailsModal.classList.remove(
                "show"
            );

        }

    }
);


/* =========================================
   ESC KEY
========================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            closeModal();

            detailsModal.classList.remove(
                "show"
            );

        }

    }
);