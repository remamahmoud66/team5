import { seedData } from "../seedData.js";

export function showStudents(app) {

    let editingStudentId = null;

    app.innerHTML = `
        <section class="page-content">

            <div class="page-header">
                <div>
                    <h1>Students Management</h1>
                    <p>Manage and monitor all students in the academy.</p>
                </div>

                <button class="primary-btn" id="addStudentBtn">
                    + Add New Student
                </button>
            </div>

            <div class="filters-container">

                <div class="search-box">
                    <input
                        type="text"
                        id="searchStudentInput"
                        placeholder="Search students..."
                    />
                </div>

                <select id="statusFilter" class="filter-select">
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Graduated">Graduated</option>
                </select>

                <select id="levelFilter" class="filter-select">
                    <option value="All">All Levels</option>
                    <option value="9th Grade">9th Grade</option>
                    <option value="10th Grade">10th Grade</option>
                    <option value="11th Grade">11th Grade</option>
                    <option value="12th Grade">12th Grade</option>
                </select>

            </div>

            <div class="students-table-container">

                <table class="students-table">

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Student Name</th>
                            <th>Academic Level</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody id="studentsTableBody"></tbody>

                </table>

                <div id="emptyState" class="empty-state">
                    No students found.
                </div>

            </div>

            <div id="studentModal" class="modal">

                <div class="modal-content">

                    <div class="modal-header">
                        <h2 id="modalTitle">Add New Student</h2>

                        <button
                            type="button"
                            id="closeModalBtn"
                            class="close-modal"
                        >
                            ×
                        </button>
                    </div>

                    <form id="studentForm">

                        <input
                            type="hidden"
                            id="studentIdInput"
                        />

                        <div class="form-group">
                            <label for="fullName">Full Name</label>
                            <input
                                type="text"
                                id="fullName"
                                required
                            />
                        </div>

                        <div class="form-group">
                            <label for="birthDate">Birth Date</label>
                            <input
                                type="date"
                                id="birthDate"
                                required
                            />
                        </div>

                        <div class="form-group">
                            <label for="academicLevel">Academic Level</label>

                            <select
                                id="academicLevel"
                                required
                            >
                                <option value="">Select Level</option>
                                <option value="9th Grade">9th Grade</option>
                                <option value="10th Grade">10th Grade</option>
                                <option value="11th Grade">11th Grade</option>
                                <option value="12th Grade">12th Grade</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="phone">Phone</label>
                            <input
                                type="text"
                                id="phone"
                                required
                            />
                        </div>

                        <div class="form-group">
                            <label for="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                required
                            />
                        </div>

                        <div class="form-group">
                            <label for="status">Status</label>

                            <select
                                id="status"
                                required
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Graduated">Graduated</option>
                            </select>
                        </div>

                        <div class="modal-actions">

                            <button
                                type="button"
                                id="cancelModalBtn"
                                class="secondary-btn"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                class="primary-btn"
                            >
                                Save Student
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </section>
    `;

    const searchInput = document.getElementById("searchStudentInput");
    const statusFilter = document.getElementById("statusFilter");
    const levelFilter = document.getElementById("levelFilter");

    const tableBody = document.getElementById("studentsTableBody");
    const emptyState = document.getElementById("emptyState");

    const addStudentBtn = document.getElementById("addStudentBtn");

    const modal = document.getElementById("studentModal");
    const modalTitle = document.getElementById("modalTitle");

    const closeModalBtn = document.getElementById("closeModalBtn");
    const cancelModalBtn = document.getElementById("cancelModalBtn");

    const studentForm = document.getElementById("studentForm");

    const studentIdInput = document.getElementById("studentIdInput");
    const fullNameInput = document.getElementById("fullName");
    const birthDateInput = document.getElementById("birthDate");
    const academicLevelInput = document.getElementById("academicLevel");
    const phoneInput = document.getElementById("phone");
    const emailInput = document.getElementById("email");
    const statusInput = document.getElementById("status");

    function getFilteredStudents() {

        const searchValue = searchInput.value
            .trim()
            .toLowerCase();

        const statusValue = statusFilter.value;
        const levelValue = levelFilter.value;

        return seedData.students.filter(student => {

            const matchesSearch =
                student.fullName.toLowerCase().includes(searchValue) ||
                student.id.toLowerCase().includes(searchValue) ||
                student.email.toLowerCase().includes(searchValue);

            const matchesStatus =
                statusValue === "All" ||
                student.status === statusValue;

            const matchesLevel =
                levelValue === "All" ||
                student.academicLevel === levelValue;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesLevel
            );
        });
    }

    function getStatusClass(status) {

        return status
            .toLowerCase()
            .replace(" ", "-");
    }

    function renderStudents() {

        const students = getFilteredStudents();

        if (students.length === 0) {

            tableBody.innerHTML = "";
            emptyState.style.display = "block";

            return;
        }

        emptyState.style.display = "none";

        tableBody.innerHTML = students.map(student => {

            return `
                <tr>

                    <td>${student.id}</td>

                    <td>
                        <div class="student-name">
                            ${student.fullName}
                        </div>
                    </td>

                    <td>
                        ${student.academicLevel}
                    </td>

                    <td>
                        ${student.phone}
                    </td>

                    <td>
                        ${student.email}
                    </td>

                    <td>
                        <span class="status-badge ${getStatusClass(student.status)}">
                            ${student.status}
                        </span>
                    </td>

                    <td>

                        <div class="student-actions">

                            <button
                                type="button"
                                class="action-btn view-btn"
                                data-action="view"
                                data-id="${student.id}"
                            >
                                View
                            </button>

                            <button
                                type="button"
                                class="action-btn edit-btn"
                                data-action="edit"
                                data-id="${student.id}"
                            >
                                Edit
                            </button>

                            <button
                                type="button"
                                class="action-btn delete-btn"
                                data-action="delete"
                                data-id="${student.id}"
                            >
                                Delete
                            </button>

                        </div>

                    </td>

                </tr>
            `;

        }).join("");
    }

    function openAddModal() {

        editingStudentId = null;

        modalTitle.textContent = "Add New Student";

        studentForm.reset();

        studentIdInput.value = "";

        modal.classList.add("active");
    }

    function openEditModal(student) {

        editingStudentId = student.id;

        modalTitle.textContent = "Edit Student";

        studentIdInput.value = student.id;
        fullNameInput.value = student.fullName;
        birthDateInput.value = student.birthDate;
        academicLevelInput.value = student.academicLevel;
        phoneInput.value = student.phone;
        emailInput.value = student.email;
        statusInput.value = student.status;

        modal.classList.add("active");
    }

    function closeModal() {

        modal.classList.remove("active");

        studentForm.reset();

        editingStudentId = null;
    }

    function saveStudent(event) {

        event.preventDefault();

        const studentData = {

            id: studentIdInput.value,

            fullName: fullNameInput.value.trim(),

            birthDate: birthDateInput.value,

            academicLevel: academicLevelInput.value,

            phone: phoneInput.value.trim(),

            email: emailInput.value.trim(),

            status: statusInput.value

        };

        if (editingStudentId) {

            const index = seedData.students.findIndex(
                student => student.id === editingStudentId
            );

            if (index !== -1) {
                seedData.students[index] = studentData;
            }

        } else {

            const newId =
                "ST" +
                String(seedData.students.length + 1).padStart(3, "0");

            studentData.id = newId;

            seedData.students.push(studentData);
        }

        closeModal();

        renderStudents();
    }

    function viewStudent(student) {

        alert(
            `Student Information\n\n` +
            `ID: ${student.id}\n` +
            `Name: ${student.fullName}\n` +
            `Birth Date: ${student.birthDate}\n` +
            `Academic Level: ${student.academicLevel}\n` +
            `Phone: ${student.phone}\n` +
            `Email: ${student.email}\n` +
            `Status: ${student.status}`
        );
    }

    function deleteStudent(studentId) {

        const student = seedData.students.find(
            item => item.id === studentId
        );

        if (!student) return;

        const confirmed = confirm(
            `Are you sure you want to delete ${student.fullName}?`
        );

        if (!confirmed) return;

        const index = seedData.students.findIndex(
            item => item.id === studentId
        );

        if (index !== -1) {
            seedData.students.splice(index, 1);
        }

        renderStudents();
    }

    tableBody.addEventListener("click", event => {

        const button = event.target.closest(".action-btn");

        if (!button) return;

        const studentId = button.dataset.id;
        const action = button.dataset.action;

        const student = seedData.students.find(
            item => item.id === studentId
        );

        if (!student) return;

        if (action === "view") {
            viewStudent(student);
        }

        if (action === "edit") {
            openEditModal(student);
        }

        if (action === "delete") {
            deleteStudent(studentId);
        }
    });

    addStudentBtn.addEventListener(
        "click",
        openAddModal
    );

    closeModalBtn.addEventListener(
        "click",
        closeModal
    );

    cancelModalBtn.addEventListener(
        "click",
        closeModal
    );

    studentForm.addEventListener(
        "submit",
        saveStudent
    );

    searchInput.addEventListener(
        "input",
        renderStudents
    );

    statusFilter.addEventListener(
        "change",
        renderStudents
    );

    levelFilter.addEventListener(
        "change",
        renderStudents
    );

    modal.addEventListener("click", event => {

        if (event.target === modal) {
            closeModal();
        }
    });

    renderStudents();
}