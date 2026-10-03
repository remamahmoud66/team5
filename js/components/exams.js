import { seedData } from "../seedData.js";
import { getCurrentTeacher } from "../data.js";

export function showExams(app) {
    let currentView = "exams";
    let selectedExamId = null;
    let editingExamId = null;

    const teacher = getCurrentTeacher();

    const teacherId =
        teacher?.id ||
        teacher?.teacherId ||
        teacher?.teacherID ||
        null;

    function getTeacherClasses() {
        return seedData.classes.filter(classItem => {
            const classTeacherId =
                classItem.teacherId ||
                classItem.teacherID;

            return !teacherId || classTeacherId === teacherId;
        });
    }

    function getTeacherExams() {
        return seedData.exams.filter(exam => {
            const examTeacherId =
                exam.teacherId ||
                exam.teacherID;

            return !teacherId || examTeacherId === teacherId;
        });
    }

    function getClassById(classId) {
        return seedData.classes.find(
            classItem => classItem.id === classId
        );
    }

    function getSubjectById(subjectId) {
        return seedData.subjects.find(
            subject => subject.id === subjectId
        );
    }

    function getStudentById(studentId) {
        return seedData.students.find(
            student => student.id === studentId
        );
    }

    function getClassStudents(classId) {
        const classItem = getClassById(classId);

        if (!classItem) {
            return [];
        }

        return seedData.students.filter(student =>
            classItem.studentIds?.includes(student.id)
        );
    }

    function formatDate(date) {
        if (!date) return "—";

        return new Date(date).toLocaleDateString("en-GB");
    }

    function getExamMarks(examId) {
        return seedData.grades.filter(
            grade =>
                grade.examId === examId
        );
    }

    function getStudentGrade(examId, studentId) {
        return seedData.grades.find(
            grade =>
                grade.examId === examId &&
                grade.studentId === studentId
        );
    }

    function getExamAverage(exam) {
        const grades = getExamMarks(exam.id);

        if (!grades.length) {
            return "N/A";
        }

        const totalMarks =
            Number(exam.totalMarks || 100);

        const percentages = grades.map(grade => {
            const mark =
                Number(
                    grade.mark ??
                    grade.score ??
                    grade.marks ??
                    0
                );

            return (mark / totalMarks) * 100;
        });

        const average =
            percentages.reduce(
                (sum, value) => sum + value,
                0
            ) / percentages.length;

        return `${Math.round(average)}%`;
    }

    function getExamStatus(exam) {
        const grades = getExamMarks(exam.id);

        if (!grades.length) {
            return "Not Graded";
        }

        const students = getClassStudents(exam.classId);

        if (
            students.length > 0 &&
            grades.length >= students.length
        ) {
            return "Completed";
        }

        return "In Progress";
    }

    function renderExamsPage() {
        currentView = "exams";

        const classes = getTeacherClasses();
        const exams = getTeacherExams();

        app.innerHTML = `
            <section class="page-content exams-page">

                <div class="page-header">
                    <div>
                        <h1>Exams</h1>
                        <p>
                            Create, manage and track exams for your classes.
                        </p>
                    </div>

                    <button
                        type="button"
                        id="open-create-exam"
                        class="primary-btn"
                    >
                        + Add Exam
                    </button>
                </div>

                <section class="exam-stats">

                    <div class="exam-stat-card">
                        <span class="exam-stat-title">
                            Active Exams
                        </span>

                        <strong>
                            ${
                                exams.filter(
                                    exam =>
                                        new Date(exam.date) >=
                                        new Date()
                                ).length
                            }
                        </strong>

                        <small>
                            Upcoming exams
                        </small>
                    </div>

                    <div class="exam-stat-card">
                        <span class="exam-stat-title">
                            Classes
                        </span>

                        <strong>
                            ${classes.length}
                        </strong>

                        <small>
                            Classes you teach
                        </small>
                    </div>

                    <div class="exam-stat-card">
                        <span class="exam-stat-title">
                            Completed Exams
                        </span>

                        <strong>
                            ${
                                exams.filter(
                                    exam =>
                                        getExamStatus(exam) ===
                                        "Completed"
                                ).length
                            }
                        </strong>

                        <small>
                            Fully graded exams
                        </small>
                    </div>

                </section>

                <section class="exam-toolbar">

                    <div class="exam-search">
                        <input
                            type="text"
                            id="exam-search"
                            placeholder="Search by exam title or class..."
                        />
                    </div>

                    <select
                        id="exam-class-filter"
                        class="style-select"
                    >
                        <option value="">
                            All Classes
                        </option>

                        ${classes.map(classItem => `
                            <option value="${classItem.id}">
                                ${classItem.name}
                            </option>
                        `).join("")}
                    </select>

                </section>

                <section class="exam-table-container">

                    <div class="table-top">
                        <div>
                            <h2>Exam Records</h2>
                            <span id="exam-count">
                                ${exams.length} exams
                            </span>
                        </div>
                    </div>

                    <div class="table-scroll">

                        <table class="exam-table">

                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Exam</th>
                                    <th>Class</th>
                                    <th>Subject</th>
                                    <th>Date</th>
                                    <th>Average</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody id="exams-table-body">
                            </tbody>

                        </table>

                    </div>

                    <div id="exam-empty"></div>

                </section>

                <div
                    id="exam-modal"
                    class="exam-modal hidden"
                >

                    <div class="exam-modal-content">

                        <div class="exam-modal-header">

                            <div>
                                <span class="modal-eyebrow">
                                    Exam Management
                                </span>

                                <h2 id="exam-modal-title">
                                    Create New Exam
                                </h2>
                            </div>

                            <button
                                type="button"
                                id="close-exam-modal"
                                class="modal-close"
                            >
                                ×
                            </button>

                        </div>

                        <form id="exam-form">

                            <input
                                type="hidden"
                                id="exam-id"
                            />

                            <div class="form-group">

                                <label for="exam-class">
                                    Class *
                                </label>

                                <select
                                    id="exam-class"
                                    required
                                >
                                    <option value="">
                                        Select a class
                                    </option>

                                    ${classes.map(classItem => `
                                        <option value="${classItem.id}">
                                            ${classItem.name}
                                        </option>
                                    `).join("")}

                                </select>

                            </div>

                            <div class="form-group">

                                <label for="exam-title">
                                    Exam Title *
                                </label>

                                <input
                                    type="text"
                                    id="exam-title"
                                    placeholder="e.g. JavaScript Midterm"
                                    required
                                />

                            </div>

                            <div class="form-group">

                                <label for="exam-description">
                                    Description
                                </label>

                                <textarea
                                    id="exam-description"
                                    rows="3"
                                    placeholder="Brief exam description..."
                                ></textarea>

                            </div>

                            <div class="form-row">

                                <div class="form-group">

                                    <label for="exam-date">
                                        Date *
                                    </label>

                                    <input
                                        type="date"
                                        id="exam-date"
                                        required
                                    />

                                </div>

                                <div class="form-group">

                                    <label for="exam-total-marks">
                                        Total Marks *
                                    </label>

                                    <input
                                        type="number"
                                        id="exam-total-marks"
                                        min="1"
                                        value="100"
                                        required
                                    />

                                </div>

                            </div>

                            <div class="modal-actions">

                                <button
                                    type="button"
                                    id="cancel-exam"
                                    class="secondary-btn"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    class="primary-btn"
                                >
                                    Save Exam
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            </section>
        `;

        const tableBody =
            document.getElementById(
                "exams-table-body"
            );

        const searchInput =
            document.getElementById(
                "exam-search"
            );

        const classFilter =
            document.getElementById(
                "exam-class-filter"
            );

        function renderTable() {

            const search =
                searchInput.value
                    .trim()
                    .toLowerCase();

            const selectedClass =
                classFilter.value;

            const filteredExams =
                exams.filter(exam => {

                    const classItem =
                        getClassById(
                            exam.classId
                        );

                    const className =
                        classItem?.name || "";

                    const matchesSearch =
                        exam.title
                            ?.toLowerCase()
                            .includes(search) ||
                        className
                            .toLowerCase()
                            .includes(search);

                    const matchesClass =
                        !selectedClass ||
                        exam.classId === selectedClass;

                    return (
                        matchesSearch &&
                        matchesClass
                    );
                });

            document.getElementById(
                "exam-count"
            ).textContent =
                `${filteredExams.length} exams`;

            if (!filteredExams.length) {

                tableBody.innerHTML = "";

                document.getElementById(
                    "exam-empty"
                ).innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">📝</div>
                        <h3>No exams found</h3>
                        <p>
                            Create an exam or change your filters.
                        </p>
                    </div>
                `;

                return;
            }

            document.getElementById(
                "exam-empty"
            ).innerHTML = "";

            tableBody.innerHTML =
                filteredExams.map(
                    (exam, index) => {

                        const classItem =
                            getClassById(
                                exam.classId
                            );

                        const subject =
                            getSubjectById(
                                classItem?.subjectId
                            );

                        const average =
                            getExamAverage(exam);

                        const status =
                            getExamStatus(exam);

                        return `
                            <tr>

                                <td>
                                    ${index + 1}
                                </td>

                                <td>
                                    <div class="exam-title-cell">
                                        <strong>
                                            ${exam.title}
                                        </strong>

                                        <small>
                                            ${
                                                exam.description ||
                                                "No description"
                                            }
                                        </small>
                                    </div>
                                </td>

                                <td>
                                    ${
                                        classItem?.name ||
                                        "Unknown"
                                    }
                                </td>

                                <td>
                                    ${
                                        subject?.name ||
                                        "Unknown"
                                    }
                                </td>

                                <td>
                                    ${formatDate(exam.date)}
                                </td>

                                <td>
                                    <strong>
                                        ${average}
                                    </strong>
                                </td>

                                <td>
                                    <span
                                        class="exam-status ${status
                                            .toLowerCase()
                                            .replace(" ", "-")}"
                                    >
                                        ${status}
                                    </span>
                                </td>

                                <td>

                                    <div class="exam-actions">

                                        <button
                                            class="action-btn grades-btn"
                                            data-action="grades"
                                            data-id="${exam.id}"
                                            title="Enter Grades"
                                        >
                                            Grades
                                        </button>

                                        <button
                                            class="action-btn edit-btn"
                                            data-action="edit"
                                            data-id="${exam.id}"
                                            title="Edit Exam"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            class="action-btn delete-btn"
                                            data-action="delete"
                                            data-id="${exam.id}"
                                            title="Delete Exam"
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </td>

                            </tr>
                        `;
                    }
                ).join("");
        }

        searchInput.addEventListener(
            "input",
            renderTable
        );

        classFilter.addEventListener(
            "change",
            renderTable
        );

        document.getElementById(
            "open-create-exam"
        ).addEventListener(
            "click",
            () => openCreateModal()
        );

        document.getElementById(
            "close-exam-modal"
        ).addEventListener(
            "click",
            closeModal
        );

        document.getElementById(
            "cancel-exam"
        ).addEventListener(
            "click",
            closeModal
        );

        document.getElementById(
            "exam-form"
        ).addEventListener(
            "submit",
            saveExam
        );

        tableBody.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "[data-action]"
                    );

                if (!button) return;

                const id =
                    button.dataset.id;

                const action =
                    button.dataset.action;

                if (action === "grades") {
                    showMarks(id);
                }

                if (action === "edit") {
                    openEditModal(id);
                }

                if (action === "delete") {
                    deleteExam(id);
                }

            }
        );

        function openCreateModal() {

            editingExamId = null;

            document.getElementById(
                "exam-modal-title"
            ).textContent =
                "Create New Exam";

            document.getElementById(
                "exam-form"
            ).reset();

            document.getElementById(
                "exam-total-marks"
            ).value = 100;

            document.getElementById(
                "exam-modal"
            ).classList.remove("hidden");
        }

        function openEditModal(id) {

            const exam =
                seedData.exams.find(
                    item => item.id === id
                );

            if (!exam) return;

            editingExamId = id;

            document.getElementById(
                "exam-modal-title"
            ).textContent =
                "Edit Exam";

            document.getElementById(
                "exam-id"
            ).value = exam.id;

            document.getElementById(
                "exam-class"
            ).value =
                exam.classId;

            document.getElementById(
                "exam-title"
            ).value =
                exam.title;

            document.getElementById(
                "exam-description"
            ).value =
                exam.description || "";

            document.getElementById(
                "exam-date"
            ).value =
                exam.date;

            document.getElementById(
                "exam-total-marks"
            ).value =
                exam.totalMarks || 100;

            document.getElementById(
                "exam-modal"
            ).classList.remove("hidden");
        }

        function closeModal() {

            document.getElementById(
                "exam-modal"
            ).classList.add("hidden");

            editingExamId = null;
        }

        function saveExam(event) {

            event.preventDefault();

            const classId =
                document.getElementById(
                    "exam-class"
                ).value;

            const title =
                document.getElementById(
                    "exam-title"
                ).value.trim();

            const description =
                document.getElementById(
                    "exam-description"
                ).value.trim();

            const date =
                document.getElementById(
                    "exam-date"
                ).value;

            const totalMarks =
                Number(
                    document.getElementById(
                        "exam-total-marks"
                    ).value
                );

            if (
                !classId ||
                !title ||
                !date ||
                !totalMarks
            ) {
                return;
            }

            if (editingExamId) {

                const exam =
                    seedData.exams.find(
                        item =>
                            item.id ===
                            editingExamId
                    );

                if (exam) {

                    exam.classId = classId;
                    exam.title = title;
                    exam.description =
                        description;
                    exam.date = date;
                    exam.totalMarks =
                        totalMarks;

                }

            } else {

                const newId =
                    generateId(
                        "EX",
                        seedData.exams
                    );

                seedData.exams.push({
                    id: newId,
                    classId,
                    teacherId:
                        teacherId,
                    title,
                    description,
                    date,
                    totalMarks,
                    createdAt:
                        new Date().toISOString()
                });

            }

            closeModal();
            renderExamsPage();
        }

        function deleteExam(id) {

            const exam =
                seedData.exams.find(
                    item => item.id === id
                );

            if (!exam) return;

            const confirmed =
                confirm(
                    `Delete "${exam.title}"?`
                );

            if (!confirmed) return;

            const index =
                seedData.exams.findIndex(
                    item => item.id === id
                );

            if (index !== -1) {
                seedData.exams.splice(
                    index,
                    1
                );
            }

            if (Array.isArray(seedData.grades)) {

                for (
                    let i =
                        seedData.grades.length - 1;
                    i >= 0;
                    i--
                ) {
                    if (
                        seedData.grades[i]
                            .examId === id
                    ) {
                        seedData.grades.splice(
                            i,
                            1
                        );
                    }
                }

            }

            renderExamsPage();
        }

        renderTable();
    }

    function showMarks(examId = null) {

        currentView = "marks";
        selectedExamId = examId;

        const classes =
            getTeacherClasses();

        const exams =
            getTeacherExams();

        app.innerHTML = `
            <section class="page-content exams-page">

                <div class="page-header">

                    <div>

                        <button
                            type="button"
                            id="back-to-exams"
                            class="back-btn"
                        >
                            ← Exams
                        </button>

                        <h1>
                            Exam Marks
                        </h1>

                        <p>
                            View and manage student scores by class and exam.
                        </p>

                    </div>

                    <button
                        type="button"
                        id="print-report"
                        class="secondary-btn"
                    >
                        ▣ Download PDF Report
                    </button>

                </div>

                <section class="marks-hero">

                    <div>

                        <span class="modal-eyebrow">
                            Exam Grade Management
                        </span>

                        <h2 id="marks-title">
                            Exam Marks
                        </h2>

                        <p id="marks-subtitle">
                            Select a class and exam to load student scores.
                        </p>

                    </div>

                    <div class="marks-summary">

                        <div>
                            <strong id="passed-count">
                                0
                            </strong>

                            <span>
                                Passed
                            </span>
                        </div>

                        <div>
                            <strong id="failed-count">
                                0
                            </strong>

                            <span>
                                Failed
                            </span>
                        </div>

                        <div>
                            <strong id="total-count">
                                0
                            </strong>

                            <span>
                                Total Students
                            </span>
                        </div>

                    </div>

                </section>

                <section class="marks-toolbar">

                    <div class="filter-group">

                        <label>
                            Class
                        </label>

                        <select
                            id="marks-class-filter"
                            class="style-select"
                        >
                            <option value="">
                                Select Class
                            </option>

                            ${classes.map(classItem => `
                                <option value="${classItem.id}">
                                    ${classItem.name}
                                </option>
                            `).join("")}

                        </select>

                    </div>

                    <div class="filter-group">

                        <label>
                            Exam
                        </label>

                        <select
                            id="marks-exam-filter"
                            class="style-select"
                        >
                            <option value="">
                                Select Exam
                            </option>
                        </select>

                    </div>

                    <div class="marks-note">
                        Select "All Exams" to see aggregated totals.
                    </div>

                </section>

                <section class="exam-table-container">

                    <div class="table-scroll">

                        <table class="exam-table marks-table">

                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Student ID</th>
                                    <th>Student Name</th>
                                    <th>Score / Total</th>
                                    <th>Percentage</th>
                                    <th>Result</th>
                                </tr>
                            </thead>

                            <tbody id="marks-table-body">
                            </tbody>

                        </table>

                    </div>

                    <div id="marks-empty"></div>

                </section>

            </section>
        `;

        const classSelect =
            document.getElementById(
                "marks-class-filter"
            );

        const examSelect =
            document.getElementById(
                "marks-exam-filter"
            );

        function updateExamOptions() {

            const classId =
                classSelect.value;

            examSelect.innerHTML = `
                <option value="">
                    Select Exam
                </option>

                ${
                    classId
                        ? `
                            <option value="all">
                                All Exams
                            </option>
                        `
                        : ""
                }

                ${
                    exams
                        .filter(
                            exam =>
                                !classId ||
                                exam.classId === classId
                        )
                        .map(
                            exam => `
                                <option
                                    value="${exam.id}"
                                >
                                    ${exam.title}
                                </option>
                            `
                        )
                        .join("")
                }
            `;

            if (
                selectedExamId &&
                exams.some(
                    exam =>
                        exam.id ===
                        selectedExamId &&
                        exam.classId ===
                        classId
                )
            ) {
                examSelect.value =
                    selectedExamId;
            }
        }

        function renderMarks() {

            const classId =
                classSelect.value;

            const examId =
                examSelect.value;

            const tableBody =
                document.getElementById(
                    "marks-table-body"
                );

            if (!classId || !examId) {

                tableBody.innerHTML = "";

                document.getElementById(
                    "marks-empty"
                ).innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">
                            📊
                        </div>

                        <h3>
                            Select a class and exam
                        </h3>

                        <p>
                            Student marks will appear here.
                        </p>
                    </div>
                `;

                updateSummary(
                    0,
                    0,
                    0
                );

                return;
            }

            const students =
                getClassStudents(classId);

            let rows = [];

            if (examId === "all") {

                rows =
                    students.map(
                        student => {

                            let totalScore = 0;
                            let totalPossible = 0;

                            exams
                                .filter(
                                    exam =>
                                        exam.classId ===
                                        classId
                                )
                                .forEach(
                                    exam => {

                                        const grade =
                                            getStudentGrade(
                                                exam.id,
                                                student.id
                                            );

                                        if (grade) {

                                            totalScore +=
                                                Number(
                                                    grade.mark ??
                                                    grade.score ??
                                                    grade.marks ??
                                                    0
                                                );

                                            totalPossible +=
                                                Number(
                                                    exam.totalMarks ||
                                                    100
                                                );

                                        }

                                    }
                                );

                            const percentage =
                                totalPossible > 0
                                    ? Math.round(
                                          (totalScore /
                                              totalPossible) *
                                              100
                                      )
                                    : 0;

                            return {
                                student,
                                totalScore,
                                totalPossible,
                                percentage
                            };

                        }
                    );

            } else {

                const exam =
                    exams.find(
                        item =>
                            item.id === examId
                    );

                if (!exam) return;

                rows =
                    students.map(
                        student => {

                            const grade =
                                getStudentGrade(
                                    exam.id,
                                    student.id
                                );

                            const score =
                                grade
                                    ? Number(
                                          grade.mark ??
                                          grade.score ??
                                          grade.marks ??
                                          0
                                      )
                                    : 0;

                            const total =
                                Number(
                                    exam.totalMarks ||
                                    100
                                );

                            const percentage =
                                Math.round(
                                    (score / total) *
                                        100
                                );

                            return {
                                student,
                                totalScore:
                                    score,
                                totalPossible:
                                    total,
                                percentage
                            };

                        }
                    );

            }

            if (!rows.length) {

                tableBody.innerHTML = "";

                document.getElementById(
                    "marks-empty"
                ).innerHTML = `
                    <div class="empty-state">
                        <h3>
                            No students found
                        </h3>
                    </div>
                `;

                return;
            }

            document.getElementById(
                "marks-empty"
            ).innerHTML = "";

            let passed = 0;
            let failed = 0;

            rows.forEach(row => {

                if (
                    row.percentage >= 50
                ) {
                    passed++;
                } else {
                    failed++;
                }

            });

            updateSummary(
                passed,
                failed,
                rows.length
            );

            const selectedExam =
                exams.find(
                    exam =>
                        exam.id === examId
                );

            const classItem =
                getClassById(classId);

            document.getElementById(
                "marks-title"
            ).textContent =
                examId === "all"
                    ? "All Exam Marks"
                    : selectedExam?.title ||
                      "Exam Marks";

            document.getElementById(
                "marks-subtitle"
            ).textContent =
                `${
                    classItem?.name || "Class"
                } • ${
                    examId === "all"
                        ? "All Exams"
                        : selectedExam?.title ||
                          "Exam"
                }`;

            tableBody.innerHTML =
                rows.map(
                    (row, index) => {

                        const result =
                            row.percentage >= 50
                                ? "Passed"
                                : "Failed";

                        return `
                            <tr>

                                <td>
                                    ${index + 1}
                                </td>

                                <td>
                                    ${row.student.id}
                                </td>

                                <td>
                                    <strong>
                                        ${row.student.fullName}
                                    </strong>
                                </td>

                                <td>
                                    ${
                                        row.totalScore
                                    }
                                    /
                                    ${
                                        row.totalPossible
                                    }
                                </td>

                                <td>
                                    <strong>
                                        ${
                                            row.percentage
                                        }%
                                    </strong>
                                </td>

                                <td>
                                    <span
                                        class="result-badge ${
                                            result.toLowerCase()
                                        }"
                                    >
                                        ${result}
                                    </span>
                                </td>

                            </tr>
                        `;

                    }
                ).join("");
        }

        function updateSummary(
            passed,
            failed,
            total
        ) {

            document.getElementById(
                "passed-count"
            ).textContent = passed;

            document.getElementById(
                "failed-count"
            ).textContent = failed;

            document.getElementById(
                "total-count"
            ).textContent = total;
        }

        classSelect.addEventListener(
            "change",
            () => {

                selectedExamId = null;

                updateExamOptions();

                renderMarks();

            }
        );

        examSelect.addEventListener(
            "change",
            () => {

                selectedExamId =
                    examSelect.value;

                renderMarks();

            }
        );

        document.getElementById(
            "back-to-exams"
        ).addEventListener(
            "click",
            renderExamsPage
        );

        document.getElementById(
            "print-report"
        ).addEventListener(
            "click",
            () => {
                window.print();
            }
        );

        updateExamOptions();

        if (selectedExamId) {
            renderMarks();
        }
    }

    function generateId(
        prefix,
        collection
    ) {

        let number =
            collection.length + 1;

        let id =
            prefix +
            String(number).padStart(
                3,
                "0"
            );

        while (
            collection.some(
                item =>
                    item.id === id
            )
        ) {
            number++;

            id =
                prefix +
                String(number).padStart(
                    3,
                    "0"
                );
        }

        return id;
    }

    renderExamsPage();
}