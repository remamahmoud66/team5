import { seedData } from "../seedData.js";
import { getCurrentTeacher } from "../data.js";

export function showHomework(app) {

    const currentTeacher = getCurrentTeacher();

    let editingHomeworkId = null;
    let selectedHomeworkId = null;

    function getTeacherId() {
        return currentTeacher?.id || currentTeacher?.teacherId || "";
    }

    function getTeacherClasses() {

        const teacherId = getTeacherId();

        if (!teacherId) {
            return seedData.classes;
        }

        return seedData.classes.filter(
            classItem => classItem.teacherId === teacherId
        );
    }

    let teacherClasses = getTeacherClasses();

    function getClass(classId) {
        return seedData.classes.find(
            classItem => classItem.id === classId
        );
    }

    function getStudents(classItem) {

        if (!classItem) return [];

        return seedData.students.filter(student =>
            classItem.studentIds.includes(student.id)
        );
    }

    function getHomework(homeworkId) {

        return seedData.homeworks.find(
            homework => homework.id === homeworkId
        );
    }

    function getHomeworkStatuses(homeworkId) {

        return seedData.homeworkStatuses.filter(
            status => status.homeworkId === homeworkId
        );
    }

    function getStudentStatus(homeworkId, studentId) {

        return seedData.homeworkStatuses.find(
            status =>
                status.homeworkId === homeworkId &&
                status.studentId === studentId
        );
    }

    app.innerHTML = `
        <section class="page-content homework-page">

            <div class="page-header">
                <div>
                    <h1>Homework Overview</h1>

                    <p>
                        Track homework submissions across your classes,
                        review student status, and manage assignments.
                    </p>
                </div>

                <button
                    type="button"
                    class="homework-primary-btn"
                    id="openHomeworkModal"
                >
                    + Add Homework
                </button>
            </div>


            <!-- =================================================
                 STATISTICS
            ================================================== -->

            <section class="homework-stats">

                <div class="homework-stat-card">
                    <span class="homework-stat-label">
                        Total Homework
                    </span>

                    <strong id="statTotalHomework">
                        0
                    </strong>
                </div>

                <div class="homework-stat-card">
                    <span class="homework-stat-label">
                        Latest Homework
                    </span>

                    <strong id="statLatestHomework">
                        0 / 0
                    </strong>

                    <small id="statLatestLabel">
                        students submitted
                    </small>
                </div>

                <div class="homework-stat-card">
                    <span class="homework-stat-label">
                        Submitted
                    </span>

                    <strong id="statSubmitted">
                        0
                    </strong>
                </div>

                <div class="homework-stat-card">
                    <span class="homework-stat-label">
                        Not Submitted
                    </span>

                    <strong id="statMissing">
                        0
                    </strong>
                </div>

            </section>


            <!-- =================================================
                 SEARCH & FILTER
            ================================================== -->

            <section class="homework-toolbar">

                <div class="homework-search">
                    <input
                        type="text"
                        id="homeworkSearch"
                        placeholder="Search by homework title or class..."
                    />
                </div>

                <select
                    id="homeworkClassFilter"
                    class="homework-filter"
                >
                    <option value="">
                        All Classes
                    </option>
                </select>

            </section>


            <!-- =================================================
                 HOMEWORK TABLE
            ================================================== -->

            <section class="homework-table-container">

                <div class="homework-table-header">

                    <div>
                        <h2>All Homework</h2>

                        <p>
                            Every homework created for your classes.
                        </p>
                    </div>

                    <span
                        id="homeworkCount"
                        class="homework-count"
                    >
                        0 assignments
                    </span>

                </div>

                <div class="homework-table-scroll">

                    <table class="homework-table">

                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Homework</th>
                                <th>Class</th>
                                <th>Due Date</th>
                                <th>Submissions</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody id="homeworkTableBody"></tbody>

                    </table>

                </div>

                <div id="homeworkEmpty"></div>

            </section>


            <!-- =================================================
                 STATUS SECTION
            ================================================== -->

            <section
                class="homework-status-section"
                id="homeworkStatusSection"
            >

                <div class="status-section-header">

                    <div>
                        <span class="status-eyebrow">
                            Homework Tracking
                        </span>

                        <h2 id="statusPageTitle">
                            Student Submission Status
                        </h2>

                        <p id="statusPageSubtitle">
                            Select a homework to view student submissions.
                        </p>
                    </div>

                    <div class="status-summary">

                        <div class="status-summary-item">
                            <strong id="statusSubmittedCount">
                                0
                            </strong>

                            <span>
                                Submitted
                            </span>
                        </div>

                        <div class="status-summary-item">
                            <strong id="statusMissingCount">
                                0
                            </strong>

                            <span>
                                Not Submitted
                            </span>
                        </div>

                        <div class="status-summary-item">
                            <strong id="statusTotalCount">
                                0
                            </strong>

                            <span>
                                Total Students
                            </span>
                        </div>

                    </div>

                </div>


                <div class="status-toolbar">

                    <div>
                        <label for="statusFilter">
                            View Status
                        </label>

                        <select id="statusFilter">

                            <option value="all">
                                All Students
                            </option>

                            <option value="submitted">
                                Submitted
                            </option>

                            <option value="not-submitted">
                                Not Submitted
                            </option>

                        </select>
                    </div>

                    <p>
                        Toggle a student to update the submission record.
                        Date and time are stored automatically.
                    </p>

                </div>


                <div class="status-table-container">

                    <table class="status-table">

                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Student Name</th>
                                <th>Date & Time</th>
                                <th>Submission Status</th>
                            </tr>
                        </thead>

                        <tbody id="statusTableBody"></tbody>

                    </table>

                    <div id="statusEmpty"></div>

                </div>

            </section>

        </section>


        <!-- =====================================================
             CREATE / EDIT HOMEWORK MODAL
        ====================================================== -->

        <div
            class="homework-modal-overlay"
            id="homeworkModal"
        >

            <div class="homework-modal">

                <div class="homework-modal-header">

                    <div>
                        <h2 id="homeworkModalTitle">
                            Create New Homework
                        </h2>

                        <p>
                            Add or update homework information.
                        </p>
                    </div>

                    <button
                        type="button"
                        class="homework-close-btn"
                        id="closeHomeworkModal"
                    >
                        &times;
                    </button>

                </div>


                <form id="homeworkForm">

                    <div class="homework-form-group">

                        <label for="homeworkClass">
                            Class *
                        </label>

                        <select
                            id="homeworkClass"
                            required
                        >
                            <option value="">
                                Select a Class
                            </option>
                        </select>

                    </div>


                    <div class="homework-form-group">

                        <label for="homeworkTitle">
                            Homework Title *
                        </label>

                        <input
                            type="text"
                            id="homeworkTitle"
                            placeholder="e.g. JavaScript DOM Practice"
                            required
                        />

                    </div>


                    <div class="homework-form-group">

                        <label for="homeworkDescription">
                            Description
                        </label>

                        <textarea
                            id="homeworkDescription"
                            rows="4"
                            placeholder="Homework details..."
                        ></textarea>

                    </div>


                    <div class="homework-form-row">

                        <div class="homework-form-group">

                            <label for="homeworkDueDate">
                                Due Date *
                            </label>

                            <input
                                type="date"
                                id="homeworkDueDate"
                                required
                            />

                        </div>


                        <div class="homework-form-group">

                            <label for="homeworkTotalPoints">
                                Total Points *
                            </label>

                            <input
                                type="number"
                                id="homeworkTotalPoints"
                                min="1"
                                value="10"
                                required
                            />

                        </div>

                    </div>


                    <div class="homework-modal-actions">

                        <button
                            type="button"
                            class="homework-secondary-btn"
                            id="cancelHomeworkModal"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            class="homework-primary-btn"
                        >
                            Save Homework
                        </button>

                    </div>

                </form>

            </div>

        </div>
    `;


    const homeworkTableBody =
        document.getElementById("homeworkTableBody");

    const homeworkEmpty =
        document.getElementById("homeworkEmpty");

    const homeworkSearch =
        document.getElementById("homeworkSearch");

    const homeworkClassFilter =
        document.getElementById("homeworkClassFilter");

    const homeworkCount =
        document.getElementById("homeworkCount");

    const homeworkModal =
        document.getElementById("homeworkModal");

    const homeworkForm =
        document.getElementById("homeworkForm");

    const homeworkModalTitle =
        document.getElementById("homeworkModalTitle");

    const homeworkClass =
        document.getElementById("homeworkClass");

    const homeworkTitle =
        document.getElementById("homeworkTitle");

    const homeworkDescription =
        document.getElementById("homeworkDescription");

    const homeworkDueDate =
        document.getElementById("homeworkDueDate");

    const homeworkTotalPoints =
        document.getElementById("homeworkTotalPoints");

    const statusSection =
        document.getElementById("homeworkStatusSection");

    const statusTableBody =
        document.getElementById("statusTableBody");

    const statusFilter =
        document.getElementById("statusFilter");


    /* =========================================================
       ID GENERATION
    ========================================================= */

    function generateHomeworkId() {

        const numbers = seedData.homeworks.map(homework => {

            const number =
                parseInt(
                    homework.id.replace(/\D/g, ""),
                    10
                );

            return isNaN(number) ? 0 : number;

        });

        const nextNumber =
            Math.max(...numbers, 0) + 1;

        return "HW" +
            String(nextNumber).padStart(3, "0");
    }


    /* =========================================================
       STATUS ID GENERATION
    ========================================================= */

    function generateStatusId() {

        const numbers =
            seedData.homeworkStatuses.map(status => {

                const number =
                    parseInt(
                        status.id.replace(/\D/g, ""),
                        10
                    );

                return isNaN(number) ? 0 : number;

            });

        const nextNumber =
            Math.max(...numbers, 0) + 1;

        return "HWS" +
            String(nextNumber).padStart(3, "0");
    }


    /* =========================================================
       POPULATE CLASS SELECTS
    ========================================================= */

    function renderClassSelects() {

        const options = teacherClasses.map(classItem => `
            <option value="${classItem.id}">
                ${classItem.name}
            </option>
        `).join("");

        homeworkClass.innerHTML = `
            <option value="">
                Select a Class
            </option>
            ${options}
        `;

        homeworkClassFilter.innerHTML = `
            <option value="">
                All Classes
            </option>
            ${options}
        `;
    }


    /* =========================================================
       GET HOMEWORK SUBMISSIONS
    ========================================================= */

    function getSubmissionInfo(homework) {

        const classItem =
            getClass(homework.classId);

        const students =
            getStudents(classItem);

        const statuses =
            getHomeworkStatuses(homework.id);

        let submitted = 0;

        students.forEach(student => {

            const status =
                statuses.find(
                    item => item.studentId === student.id
                );

            if (
                status &&
                status.status === "Submitted"
            ) {
                submitted++;
            }

        });

        return {
            submitted,
            total: students.length,
            missing: students.length - submitted
        };
    }


    /* =========================================================
       UPDATE STATISTICS
    ========================================================= */

    function updateStatistics() {

        const totalHomework =
            seedData.homeworks.filter(homework =>
                teacherClasses.some(
                    classItem =>
                        classItem.id === homework.classId
                )
            );

        document.getElementById(
            "statTotalHomework"
        ).textContent = totalHomework.length;


        if (totalHomework.length === 0) {

            document.getElementById(
                "statLatestHomework"
            ).textContent = "0 / 0";

            document.getElementById(
                "statLatestLabel"
            ).textContent =
                "students submitted";

            document.getElementById(
                "statSubmitted"
            ).textContent = "0";

            document.getElementById(
                "statMissing"
            ).textContent = "0";

            return;
        }


        const latest =
            totalHomework[totalHomework.length - 1];

        const info =
            getSubmissionInfo(latest);


        document.getElementById(
            "statLatestHomework"
        ).textContent =
            `${info.submitted} / ${info.total}`;


        document.getElementById(
            "statLatestLabel"
        ).textContent =
            "students submitted";


        const submitted =
            totalHomework.reduce(
                (sum, homework) =>
                    sum + getSubmissionInfo(homework).submitted,
                0
            );


        const missing =
            totalHomework.reduce(
                (sum, homework) =>
                    sum + getSubmissionInfo(homework).missing,
                0
            );


        document.getElementById(
            "statSubmitted"
        ).textContent = submitted;


        document.getElementById(
            "statMissing"
        ).textContent = missing;

    }


    /* =========================================================
       RENDER HOMEWORK
    ========================================================= */

    function renderHomework() {

        const searchTerm =
            homeworkSearch.value
                .trim()
                .toLowerCase();

        const selectedClass =
            homeworkClassFilter.value;


        const filtered =
            seedData.homeworks.filter(homework => {

                const classItem =
                    getClass(homework.classId);

                if (!classItem) return false;


                const belongsToTeacher =
                    teacherClasses.some(
                        item =>
                            item.id === homework.classId
                    );

                if (!belongsToTeacher) return false;


                const matchesSearch =
                    homework.title
                        .toLowerCase()
                        .includes(searchTerm) ||

                    classItem.name
                        .toLowerCase()
                        .includes(searchTerm);


                const matchesClass =
                    !selectedClass ||
                    homework.classId === selectedClass;


                return matchesSearch && matchesClass;

            });


        homeworkCount.textContent =
            `${filtered.length} assignment${filtered.length === 1 ? "" : "s"}`;


        if (filtered.length === 0) {

            homeworkTableBody.innerHTML = "";

            homeworkEmpty.innerHTML = `
                <div class="homework-empty">

                    <div class="homework-empty-icon">
                        📝
                    </div>

                    <h3>No homework found</h3>

                    <p>
                        Try changing your search or create
                        a new homework assignment.
                    </p>

                </div>
            `;

            return;
        }


        homeworkEmpty.innerHTML = "";


        homeworkTableBody.innerHTML =
            filtered.map((homework, index) => {

                const classItem =
                    getClass(homework.classId);

                const info =
                    getSubmissionInfo(homework);


                const percentage =
                    info.total > 0
                        ? Math.round(
                            (info.submitted / info.total) * 100
                        )
                        : 0;


                let status = "Pending";

                if (percentage === 100) {
                    status = "Completed";
                }
                else if (percentage > 0) {
                    status = "In Progress";
                }


                return `
                    <tr>

                        <td>
                            ${index + 1}
                        </td>

                        <td>

                            <div class="homework-title-cell">

                                <strong>
                                    ${homework.title}
                                </strong>

                                <span>
                                    ${homework.description || "No description"}
                                </span>

                            </div>

                        </td>

                        <td>
                            ${classItem?.name || "Unknown"}
                        </td>

                        <td>
                            ${homework.dueDate}
                        </td>

                        <td>

                            <div class="submission-cell">

                                <strong>
                                    ${info.submitted}/${info.total}
                                </strong>

                                <span>
                                    ${percentage}%
                                </span>

                            </div>

                        </td>

                        <td>

                            <span class="homework-status ${status
                                .toLowerCase()
                                .replace(" ", "-")}">

                                ${status}

                            </span>

                        </td>

                        <td>

                            <div class="homework-actions">

                                <button
                                    type="button"
                                    class="homework-action-btn view"
                                    data-action="view"
                                    data-id="${homework.id}"
                                >
                                    Status
                                </button>

                                <button
                                    type="button"
                                    class="homework-action-btn edit"
                                    data-action="edit"
                                    data-id="${homework.id}"
                                >
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    class="homework-action-btn delete"
                                    data-action="delete"
                                    data-id="${homework.id}"
                                >
                                    Delete
                                </button>

                            </div>

                        </td>

                    </tr>
                `;

            }).join("");

    }


    /* =========================================================
       RENDER STATUS
    ========================================================= */

    function renderStatus() {

        if (!selectedHomeworkId) {

            statusSection.classList.remove("visible");

            return;
        }


        const homework =
            getHomework(selectedHomeworkId);

        if (!homework) return;


        const classItem =
            getClass(homework.classId);

        if (!classItem) return;


        const students =
            getStudents(classItem);


        const filter =
            statusFilter.value;


        document.getElementById(
            "statusPageTitle"
        ).textContent =
            homework.title;


        document.getElementById(
            "statusPageSubtitle"
        ).textContent =
            `${classItem.name} • Due ${homework.dueDate}`;


        const statuses =
            getHomeworkStatuses(homework.id);


        const submittedCount =
            students.filter(student => {

                const record =
                    statuses.find(
                        item =>
                            item.studentId === student.id
                    );

                return (
                    record &&
                    record.status === "Submitted"
                );

            }).length;


        const missingCount =
            students.length - submittedCount;


        document.getElementById(
            "statusSubmittedCount"
        ).textContent =
            submittedCount;


        document.getElementById(
            "statusMissingCount"
        ).textContent =
            missingCount;


        document.getElementById(
            "statusTotalCount"
        ).textContent =
            students.length;


        let filteredStudents =
            students.filter(student => {

                const record =
                    statuses.find(
                        item =>
                            item.studentId === student.id
                    );

                const submitted =
                    record &&
                    record.status === "Submitted";


                if (filter === "submitted") {
                    return submitted;
                }


                if (filter === "not-submitted") {
                    return !submitted;
                }


                return true;

            });


        if (filteredStudents.length === 0) {

            statusTableBody.innerHTML = "";

            document.getElementById(
                "statusEmpty"
            ).innerHTML = `
                <div class="status-empty">
                    No students match this status.
                </div>
            `;

            statusSection.classList.add("visible");

            return;
        }


        document.getElementById(
            "statusEmpty"
        ).innerHTML = "";


        statusTableBody.innerHTML =
            filteredStudents.map((student, index) => {

                const record =
                    statuses.find(
                        item =>
                            item.studentId === student.id
                    );


                const submitted =
                    record &&
                    record.status === "Submitted";


                const date =
                    record?.submittedAt || "—";


                return `
                    <tr>

                        <td>
                            ${index + 1}
                        </td>

                        <td>

                            <div class="status-student">

                                <strong>
                                    ${student.fullName}
                                </strong>

                                <span>
                                    ${student.academicLevel}
                                </span>

                            </div>

                        </td>

                        <td>
                            ${date}
                        </td>

                        <td>

                            <button
                                type="button"
                                class="submission-toggle ${
                                    submitted
                                        ? "submitted"
                                        : "not-submitted"
                                }"
                                data-student-id="${student.id}"
                            >

                                ${
                                    submitted
                                        ? "Submitted"
                                        : "Not Submitted"
                                }

                            </button>

                        </td>

                    </tr>
                `;

            }).join("");


        statusSection.classList.add("visible");

        statusSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }


    /* =========================================================
       OPEN MODAL
    ========================================================= */

    function openHomeworkModal(homework = null) {

        homeworkModal.classList.add("show");


        if (homework) {

            editingHomeworkId =
                homework.id;

            homeworkModalTitle.textContent =
                "Edit Homework";


            homeworkClass.value =
                homework.classId;

            homeworkTitle.value =
                homework.title;

            homeworkDescription.value =
                homework.description || "";

            homeworkDueDate.value =
                homework.dueDate;

            homeworkTotalPoints.value =
                homework.totalPoints || 10;

        }
        else {

            editingHomeworkId = null;

            homeworkModalTitle.textContent =
                "Create New Homework";

            homeworkForm.reset();

            homeworkTotalPoints.value = 10;

        }

    }


    /* =========================================================
       CLOSE MODAL
    ========================================================= */

    function closeHomeworkModal() {

        homeworkModal.classList.remove("show");

        editingHomeworkId = null;

        homeworkForm.reset();

        homeworkTotalPoints.value = 10;

    }


    /* =========================================================
       OPEN CREATE
    ========================================================= */

    document
        .getElementById("openHomeworkModal")
        .addEventListener(
            "click",
            () => openHomeworkModal()
        );


    /* =========================================================
       CLOSE BUTTONS
    ========================================================= */

    document
        .getElementById("closeHomeworkModal")
        .addEventListener(
            "click",
            closeHomeworkModal
        );


    document
        .getElementById("cancelHomeworkModal")
        .addEventListener(
            "click",
            closeHomeworkModal
        );


    homeworkModal.addEventListener(
        "click",
        event => {

            if (
                event.target === homeworkModal
            ) {
                closeHomeworkModal();
            }

        }
    );


    /* =========================================================
       SEARCH
    ========================================================= */

    homeworkSearch.addEventListener(
        "input",
        renderHomework
    );


    /* =========================================================
       CLASS FILTER
    ========================================================= */

    homeworkClassFilter.addEventListener(
        "change",
        renderHomework
    );


    /* =========================================================
       STATUS FILTER
    ========================================================= */

    statusFilter.addEventListener(
        "change",
        renderStatus
    );


    /* =========================================================
       HOMEWORK ACTIONS
    ========================================================= */

    homeworkTableBody.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    ".homework-action-btn"
                );

            if (!button) return;


            const homeworkId =
                button.dataset.id;

            const action =
                button.dataset.action;


            const homework =
                getHomework(homeworkId);


            if (!homework) return;


            if (action === "view") {

                selectedHomeworkId =
                    homeworkId;

                statusFilter.value = "all";

                renderStatus();

            }


            if (action === "edit") {

                openHomeworkModal(
                    homework
                );

            }


            if (action === "delete") {

                const confirmed =
                    confirm(
                        `Are you sure you want to delete "${homework.title}"?`
                    );


                if (!confirmed) return;


                const index =
                    seedData.homeworks.findIndex(
                        item =>
                            item.id === homeworkId
                    );


                if (index !== -1) {

                    seedData.homeworks.splice(
                        index,
                        1
                    );

                }


                seedData.homeworkStatuses =
                    seedData.homeworkStatuses.filter(
                        status =>
                            status.homeworkId !== homeworkId
                    );


                if (
                    selectedHomeworkId ===
                    homeworkId
                ) {

                    selectedHomeworkId = null;

                    statusSection.classList.remove(
                        "visible"
                    );

                }


                updateStatistics();

                renderHomework();

            }

        }
    );


    /* =========================================================
       STATUS TOGGLE
    ========================================================= */

    statusTableBody.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    ".submission-toggle"
                );

            if (!button) return;


            const studentId =
                button.dataset.studentId;


            const existing =
                getStudentStatus(
                    selectedHomeworkId,
                    studentId
                );


            if (existing) {

                if (
                    existing.status ===
                    "Submitted"
                ) {

                    existing.status =
                        "Not Submitted";

                    existing.submittedAt = null;

                }
                else {

                    existing.status =
                        "Submitted";

                    existing.submittedAt =
                        new Date().toLocaleString();

                }

            }
            else {

                seedData.homeworkStatuses.push({

                    id:
                        generateStatusId(),

                    homeworkId:
                        selectedHomeworkId,

                    studentId:
                        studentId,

                    status:
                        "Submitted",

                    submittedAt:
                        new Date().toLocaleString()

                });

            }


            updateStatistics();

            renderHomework();

            renderStatus();

        }
    );


    /* =========================================================
       SAVE HOMEWORK
    ========================================================= */

    homeworkForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const classId =
                homeworkClass.value;

            const title =
                homeworkTitle.value.trim();

            const description =
                homeworkDescription.value.trim();

            const dueDate =
                homeworkDueDate.value;

            const totalPoints =
                Number(
                    homeworkTotalPoints.value
                );


            if (
                !classId ||
                !title ||
                !dueDate ||
                totalPoints < 1
            ) {
                return;
            }


            if (editingHomeworkId) {

                const homework =
                    getHomework(
                        editingHomeworkId
                    );


                if (!homework) return;


                homework.classId =
                    classId;

                homework.title =
                    title;

                homework.description =
                    description;

                homework.dueDate =
                    dueDate;

                homework.totalPoints =
                    totalPoints;

            }
            else {

                const newHomework = {

                    id:
                        generateHomeworkId(),

                    classId:
                        classId,

                    title:
                        title,

                    description:
                        description,

                    dueDate:
                        dueDate,

                    totalPoints:
                        totalPoints,

                    createdAt:
                        new Date()
                            .toISOString()
                            .split("T")[0]

                };


                seedData.homeworks.push(
                    newHomework
                );

            }


            closeHomeworkModal();

            updateStatistics();

            renderHomework();

        }
    );


    /* =========================================================
       INITIAL LOAD
    ========================================================= */

    renderClassSelects();

    updateStatistics();

    renderHomework();

}