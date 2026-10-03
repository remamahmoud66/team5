import { seedData } from "../seedData.js";
import { getCurrentTeacher } from "../data.js";

export function showClasses(app) {

    const currentTeacher = getCurrentTeacher();

    let classes = seedData.classes.filter(classItem => {
        if (!currentTeacher) return true;

        const teacherId = currentTeacher.id || currentTeacher.teacherId;

        return !teacherId || classItem.teacherId === teacherId;
    });

    let editingClassId = null;

    app.innerHTML = `
        <section class="page-content">

            <div class="page-header">
                <div>
                    <h1>Classes</h1>
                    <p>Organize subjects, students and academic activities by class.</p>
                </div>

                <button class="class-primary-btn" id="openAddClassModal">
                    + Create Class
                </button>
            </div>

            <div class="classes-toolbar">
                <div class="classes-search">
                    <input
                        type="text"
                        id="searchClassInput"
                        placeholder="Search classes by name..."
                    />
                </div>
            </div>

            <div class="classes-grid" id="classesContainer"></div>

        </section>

        <div class="class-modal-overlay" id="classModal">

            <div class="class-modal">

                <div class="class-modal-header">
                    <div>
                        <h2 id="modalTitle">Create Class</h2>
                        <p>Add a class and assign students to it.</p>
                    </div>

                    <button
                        type="button"
                        class="class-close-btn"
                        id="closeModalBtn"
                    >
                        &times;
                    </button>
                </div>

                <form id="addClassForm">

                    <div class="class-form-group">
                        <label for="classNameInput">Class Name</label>

                        <input
                            type="text"
                            id="classNameInput"
                            placeholder="Enter class name"
                            required
                        />
                    </div>

                    <div class="class-form-row">

                        <div class="class-form-group">
                            <label for="subjectInput">Subject</label>

                            <select id="subjectInput" required>
                            </select>
                        </div>

                        <div class="class-form-group">
                            <label for="expiryDateInput">Expiry Date</label>

                            <input
                                type="date"
                                id="expiryDateInput"
                                required
                            />
                        </div>

                    </div>

                    <div class="class-form-group">

                        <label>Students</label>

                        <div
                            class="students-checkbox-grid"
                            id="studentsCheckboxContainer"
                        ></div>

                    </div>

                    <div class="class-modal-actions">

                        <button
                            type="button"
                            class="class-secondary-btn"
                            id="cancelModalBtn"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            class="class-primary-btn"
                        >
                            Save Class
                        </button>

                    </div>

                </form>

            </div>

        </div>
    `;

    const container = document.getElementById("classesContainer");
    const searchInput = document.getElementById("searchClassInput");
    const modal = document.getElementById("classModal");
    const form = document.getElementById("addClassForm");

    const classNameInput = document.getElementById("classNameInput");
    const subjectInput = document.getElementById("subjectInput");
    const expiryDateInput = document.getElementById("expiryDateInput");
    const studentsCheckboxContainer =
        document.getElementById("studentsCheckboxContainer");

    const modalTitle = document.getElementById("modalTitle");

    function getTeacherSubjects() {

        if (!currentTeacher) {
            return seedData.subjects;
        }

        const teacherId =
            currentTeacher.id ||
            currentTeacher.teacherId;

        if (!teacherId) {
            return seedData.subjects;
        }

        return seedData.subjects.filter(
            subject => subject.teacherId === teacherId
        );
    }

    function getStudentsForClass(classItem) {

        return seedData.students.filter(student =>
            classItem.studentIds.includes(student.id)
        );
    }

    function getSubject(subjectId) {

        return seedData.subjects.find(
            subject => subject.id === subjectId
        );
    }

    function generateClassId() {

        const numbers = seedData.classes
            .map(item => parseInt(item.id.replace("C", "")) || 0);

        const nextNumber =
            Math.max(...numbers, 0) + 1;

        return "C" + String(nextNumber).padStart(3, "0");
    }

    function renderSubjects() {

        const subjects = getTeacherSubjects();

        subjectInput.innerHTML = subjects.map(subject => `
            <option value="${subject.id}">
                ${subject.name}
            </option>
        `).join("");

        if (subjects.length === 0) {
            subjectInput.innerHTML = `
                <option value="">
                    No subjects available
                </option>
            `;
        }
    }

    function renderStudents(selectedStudentIds = []) {

        studentsCheckboxContainer.innerHTML =
            seedData.students.map(student => `
                <label class="student-checkbox">

                    <input
                        type="checkbox"
                        value="${student.id}"
                        ${selectedStudentIds.includes(student.id) ? "checked" : ""}
                    />

                    <span class="student-checkbox-content">
                        <span class="student-checkbox-name">
                            ${student.fullName}
                        </span>

                        <span class="student-checkbox-level">
                            ${student.academicLevel}
                        </span>
                    </span>

                </label>
            `).join("");
    }

    function renderClasses(searchTerm = "") {

        const normalizedSearch =
            searchTerm.trim().toLowerCase();

        const filteredClasses = classes.filter(classItem =>
            classItem.name
                .toLowerCase()
                .includes(normalizedSearch)
        );

        if (filteredClasses.length === 0) {

            container.innerHTML = `
                <div class="classes-empty">

                    <div class="classes-empty-icon">
                        📚
                    </div>

                    <h3>No classes found</h3>

                    <p>
                        ${
                            normalizedSearch
                                ? "Try a different search term."
                                : "Create your first class to get started."
                        }
                    </p>

                </div>
            `;

            return;
        }

        container.innerHTML = filteredClasses.map(classItem => {

            const subject = getSubject(classItem.subjectId);

            const students =
                getStudentsForClass(classItem);

            return `
                <article class="class-card">

                    <div class="class-card-top">

                        <div class="class-icon">
                            📚
                        </div>

                        <div class="class-card-actions">

                            <button
                                type="button"
                                class="class-action-btn edit"
                                data-action="edit"
                                data-id="${classItem.id}"
                                title="Edit"
                            >
                                Edit
                            </button>

                            <button
                                type="button"
                                class="class-action-btn delete"
                                data-action="delete"
                                data-id="${classItem.id}"
                                title="Delete"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                    <div class="class-card-body">

                        <h2>${classItem.name}</h2>

                        <p class="class-subject">
                            ${subject ? subject.name : "Unknown Subject"}
                        </p>

                        <div class="class-card-info">

                            <div class="class-info-item">
                                <span class="class-info-label">
                                    Students
                                </span>

                                <strong>
                                    ${students.length}
                                </strong>
                            </div>

                            <div class="class-info-item">
                                <span class="class-info-label">
                                    Expiry Date
                                </span>

                                <strong>
                                    ${classItem.expiryDate || "—"}
                                </strong>
                            </div>

                        </div>

                    </div>

                </article>
            `;
        }).join("");
    }

    function openModal(classItem = null) {

        modal.classList.add("show");

        renderSubjects();

        if (classItem) {

            editingClassId = classItem.id;

            modalTitle.textContent = "Edit Class";

            classNameInput.value = classItem.name;

            subjectInput.value = classItem.subjectId;

            expiryDateInput.value =
                classItem.expiryDate || "";

            renderStudents(classItem.studentIds || []);

        } else {

            editingClassId = null;

            modalTitle.textContent = "Create Class";

            form.reset();

            renderSubjects();

            renderStudents();

        }

    }

    function closeModal() {

        modal.classList.remove("show");

        editingClassId = null;

        form.reset();

    }

    document
        .getElementById("openAddClassModal")
        .addEventListener("click", () => {
            openModal();
        });

    document
        .getElementById("closeModalBtn")
        .addEventListener("click", closeModal);

    document
        .getElementById("cancelModalBtn")
        .addEventListener("click", closeModal);

    modal.addEventListener("click", event => {

        if (event.target === modal) {
            closeModal();
        }

    });

    searchInput.addEventListener("input", () => {

        renderClasses(searchInput.value);

    });

    container.addEventListener("click", event => {

        const button =
            event.target.closest(".class-action-btn");

        if (!button) return;

        const classId = button.dataset.id;

        const classItem =
            seedData.classes.find(item =>
                item.id === classId
            );

        if (!classItem) return;

        const action = button.dataset.action;

        if (action === "edit") {

            openModal(classItem);

        }

        if (action === "delete") {

            const studentsCount =
                classItem.studentIds?.length || 0;

            const confirmed = confirm(
                `Are you sure you want to delete "${classItem.name}"?`
            );

            if (!confirmed) return;

            const index =
                seedData.classes.findIndex(
                    item => item.id === classId
                );

            if (index !== -1) {

                seedData.classes.splice(index, 1);

                classes = classes.filter(
                    item => item.id !== classId
                );

                renderClasses(searchInput.value);

            }
        }

    });

    form.addEventListener("submit", event => {

        event.preventDefault();

        const name =
            classNameInput.value.trim();

        const subjectId =
            subjectInput.value;

        const expiryDate =
            expiryDateInput.value;

        const selectedStudentIds =
            [...studentsCheckboxContainer
                .querySelectorAll("input[type='checkbox']:checked")]
                .map(input => input.value);

        if (!name || !subjectId || !expiryDate) {
            return;
        }

        if (editingClassId) {

            const classItem =
                seedData.classes.find(
                    item => item.id === editingClassId
                );

            if (!classItem) return;

            classItem.name = name;
            classItem.subjectId = subjectId;
            classItem.expiryDate = expiryDate;
            classItem.studentIds = selectedStudentIds;

        } else {

            const newClass = {
                id: generateClassId(),
                name: name,
                subjectId: subjectId,
                teacherId:
                    currentTeacher?.id ||
                    currentTeacher?.teacherId ||
                    "",
                studentIds: selectedStudentIds,
                createdAt:
                    new Date().toISOString().split("T")[0],
                expiryDate: expiryDate
            };

            seedData.classes.push(newClass);

            classes.push(newClass);
        }

        closeModal();

        renderClasses(searchInput.value);

    });

    renderStudents();
    renderClasses();
}