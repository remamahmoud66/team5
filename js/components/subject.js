import { seedData } from "../seedData.js";
import { getCurrentTeacher } from "../data.js";

export function showSubjects(app) {

    const teacher = getCurrentTeacher();

    if (!teacher) {
        app.innerHTML = `
            <section class="page-content">
                <h1>Subjects</h1>
                <p>Teacher information could not be loaded.</p>
            </section>
        `;
        return;
    }

    let editingSubjectId = null;

    app.innerHTML = `
        <section class="page-content">

            <div class="page-header">

                <div>
                    <h1>Subjects</h1>

                    <p>
                        Manage the subjects you teach and their syllabus.
                    </p>
                </div>

                <button
                    type="button"
                    class="primary-btn"
                    id="addSubjectBtn"
                >
                    + Add Subject
                </button>

            </div>


            <div class="filters-container">

                <div class="search-box">

                    <input
                        type="search"
                        id="searchSubjectInput"
                        placeholder="Search by name or syllabus..."
                    />

                </div>

            </div>


            <div class="subjects-table-container">

                <table class="subjects-table">

                    <thead>

                        <tr>
                            <th>#</th>
                            <th>Subject</th>
                            <th>Syllabus</th>
                            <th>Used By</th>
                            <th>Actions</th>
                        </tr>

                    </thead>

                    <tbody id="subjectsTableBody"></tbody>

                </table>


                <div
                    id="subjectsEmpty"
                    class="empty-state"
                >
                    No subjects found.
                </div>


                <div
                    id="subjectsCount"
                    class="table-footer"
                ></div>

            </div>


            <div
                class="modal"
                id="subjectModal"
            >

                <div class="modal-content">

                    <div class="modal-header">

                        <h2 id="subjectModalTitle">
                            Add Subject
                        </h2>

                        <button
                            type="button"
                            class="close-modal"
                            id="closeSubjectModal"
                        >
                            ×
                        </button>

                    </div>


                    <form id="subjectForm">

                        <div class="modal-body">

                            <div class="form-group">

                                <label for="subjectName">
                                    Subject Name
                                </label>

                                <input
                                    type="text"
                                    id="subjectName"
                                    maxlength="60"
                                    placeholder="e.g. JavaScript"
                                    required
                                />

                            </div>


                            <div class="form-group">

                                <label for="subjectSyllabus">
                                    Syllabus
                                </label>

                                <textarea
                                    id="subjectSyllabus"
                                    maxlength="1000"
                                    placeholder="Topics covered..."
                                    required
                                ></textarea>

                            </div>

                        </div>


                        <div class="modal-actions">

                            <button
                                type="button"
                                class="secondary-btn"
                                id="cancelSubjectModal"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                class="primary-btn"
                                id="subjectSubmitBtn"
                            >
                                Add Subject
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </section>
    `;


    const searchInput =
        document.getElementById("searchSubjectInput");

    const tableBody =
        document.getElementById("subjectsTableBody");

    const emptyState =
        document.getElementById("subjectsEmpty");

    const subjectsCount =
        document.getElementById("subjectsCount");

    const addSubjectBtn =
        document.getElementById("addSubjectBtn");

    const subjectModal =
        document.getElementById("subjectModal");

    const closeSubjectModal =
        document.getElementById("closeSubjectModal");

    const cancelSubjectModal =
        document.getElementById("cancelSubjectModal");

    const subjectForm =
        document.getElementById("subjectForm");

    const subjectModalTitle =
        document.getElementById("subjectModalTitle");

    const subjectSubmitBtn =
        document.getElementById("subjectSubmitBtn");

    const subjectName =
        document.getElementById("subjectName");

    const subjectSyllabus =
        document.getElementById("subjectSyllabus");


    function getTeacherSubjects() {

        return seedData.subjects.filter(subject =>
            subject.teacherId === teacher.id
        );
    }


    function getSubjectClasses(subjectId) {

        return seedData.classes.filter(
            classItem =>
                classItem.subjectId === subjectId
        );
    }


    function getFilteredSubjects() {

        const searchValue =
            searchInput.value
                .trim()
                .toLowerCase();

        return getTeacherSubjects().filter(subject => {

            const name =
                subject.name.toLowerCase();

            const syllabus =
                subject.syllabus.toLowerCase();

            return (
                name.includes(searchValue) ||
                syllabus.includes(searchValue)
            );
        });
    }


    function renderSubjects() {

        const subjects =
            getFilteredSubjects();

        if (subjects.length === 0) {

            tableBody.innerHTML = "";

            emptyState.style.display = "block";

            subjectsCount.textContent =
                "0 subjects";

            return;
        }

        emptyState.style.display = "none";


        tableBody.innerHTML =
            subjects.map((subject, index) => {

                const usedBy =
                    getSubjectClasses(subject.id);

                return `
                    <tr>

                        <td>
                            ${index + 1}
                        </td>

                        <td>
                            <div class="subject-name">
                                ${subject.name}
                            </div>
                        </td>

                        <td>
                            <div class="subject-syllabus">
                                ${subject.syllabus}
                            </div>
                        </td>

                        <td>

                            ${
                                usedBy.length > 0
                                    ? `
                                        <span class="usage-badge">
                                            ${usedBy.length}
                                            ${usedBy.length === 1 ? "Class" : "Classes"}
                                        </span>
                                      `
                                    : `
                                        <span class="usage-badge unused">
                                            Not Used
                                        </span>
                                      `
                            }

                        </td>

                        <td>

                            <div class="subject-actions">

                                <button
                                    type="button"
                                    class="action-btn edit-btn"
                                    data-action="edit"
                                    data-id="${subject.id}"
                                >
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    class="action-btn delete-btn"
                                    data-action="delete"
                                    data-id="${subject.id}"
                                >
                                    Delete
                                </button>

                            </div>

                        </td>

                    </tr>
                `;

            }).join("");


        subjectsCount.textContent =
            `${subjects.length} ${
                subjects.length === 1
                    ? "subject"
                    : "subjects"
            }`;
    }


    function openAddModal() {

        editingSubjectId = null;

        subjectModalTitle.textContent =
            "Add Subject";

        subjectSubmitBtn.textContent =
            "Add Subject";

        subjectForm.reset();

        subjectModal.classList.add("active");

        subjectName.focus();
    }


    function openEditModal(subject) {

        editingSubjectId = subject.id;

        subjectModalTitle.textContent =
            "Edit Subject";

        subjectSubmitBtn.textContent =
            "Save Changes";

        subjectName.value =
            subject.name;

        subjectSyllabus.value =
            subject.syllabus;

        subjectModal.classList.add("active");

        subjectName.focus();
    }


    function closeModal() {

        subjectModal.classList.remove("active");

        subjectForm.reset();

        editingSubjectId = null;
    }


    function saveSubject(event) {

        event.preventDefault();

        const name =
            subjectName.value.trim();

        const syllabus =
            subjectSyllabus.value.trim();

        if (!name || !syllabus) {
            return;
        }


        const duplicate =
            getTeacherSubjects().find(subject =>
                subject.name.toLowerCase() ===
                name.toLowerCase() &&
                subject.id !== editingSubjectId
            );

        if (duplicate) {

            alert(
                "You already have a subject with this name."
            );

            return;
        }


        if (editingSubjectId) {

            const subject =
                seedData.subjects.find(
                    item =>
                        item.id === editingSubjectId
                );

            if (subject) {

                subject.name = name;

                subject.syllabus = syllabus;
            }

        } else {

            const newId =
                "SUB" +
                String(
                    seedData.subjects.length + 1
                ).padStart(3, "0");


            seedData.subjects.push({

                id: newId,

                name: name,

                teacherId: teacher.id,

                syllabus: syllabus

            });
        }


        closeModal();

        renderSubjects();
    }


    function deleteSubject(subjectId) {

        const subject =
            seedData.subjects.find(
                item =>
                    item.id === subjectId
            );

        if (!subject) return;


        const usedBy =
            getSubjectClasses(subjectId);


        if (usedBy.length > 0) {

            alert(
                `This subject cannot be deleted because it is currently used by ${usedBy.length} class${usedBy.length === 1 ? "" : "es"}.`
            );

            return;
        }


        const confirmed =
            confirm(
                `Are you sure you want to delete "${subject.name}"?`
            );

        if (!confirmed) return;


        const index =
            seedData.subjects.findIndex(
                item =>
                    item.id === subjectId
            );

        if (index !== -1) {

            seedData.subjects.splice(
                index,
                1
            );
        }


        renderSubjects();
    }


    tableBody.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    ".action-btn"
                );

            if (!button) return;


            const subjectId =
                button.dataset.id;

            const action =
                button.dataset.action;


            const subject =
                seedData.subjects.find(
                    item =>
                        item.id === subjectId
                );

            if (!subject) return;


            if (action === "edit") {
                openEditModal(subject);
            }


            if (action === "delete") {
                deleteSubject(subjectId);
            }

        }
    );


    addSubjectBtn.addEventListener(
        "click",
        openAddModal
    );


    closeSubjectModal.addEventListener(
        "click",
        closeModal
    );


    cancelSubjectModal.addEventListener(
        "click",
        closeModal
    );


    subjectForm.addEventListener(
        "submit",
        saveSubject
    );


    searchInput.addEventListener(
        "input",
        renderSubjects
    );


    subjectModal.addEventListener(
        "click",
        event => {

            if (event.target === subjectModal) {
                closeModal();
            }

        }
    );


    renderSubjects();
}