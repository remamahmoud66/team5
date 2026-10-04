import { 
    getClasses, 
    saveClasses, 
    getStudents, 
    getMaterials, 
    saveMaterials,
    getSubjects

} from '../js/storage.js';

let currentEditId = null;
let currentClassFilter = "all";

function localDateISO() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (ch) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
    }[ch]));
}


/* =========================================
   PAGE LOAD
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    loadClassesUI();

    /* SEARCH */
    const searchInput = document.getElementById("searchClassInput");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            loadClassesUI(e.target.value);
        });
    }

    /* FILTER (SELECT) */
    const filterSelect = document.getElementById("classFilterSelect");
    if (filterSelect) {
        filterSelect.addEventListener("change", (e) => {
            currentClassFilter = e.target.value;

            const searchValue = document.getElementById("searchClassInput")?.value || "";
            loadClassesUI(searchValue);
        });
    }

    setupModalLogic();
});




function generateNextClassId() {
    let classes = [];
    try { const parsed = JSON.parse(localStorage.getItem("classes") || "[]"); classes = Array.isArray(parsed) ? parsed : []; } catch { classes = []; }
    const maxNumber = classes.reduce((max, cls) => {
        const number = Number(String(cls.id || "").replace(/\D/g, ""));
        return Number.isFinite(number) ? Math.max(max, number) : max;
    }, 0);
    return `C${String(maxNumber + 1).padStart(3, "0")}`;
}


function loadClassesUI(query = "") {
    const container = document.getElementById("classesContainer");
    if (!container) return;

    let classes = getClasses();

    /* TODAY */
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    /* SEARCH */
    if (query.trim()) {
        const search = query.trim().toLowerCase();
        classes = classes.filter(cls => {
            return cls.name && cls.name.toLowerCase().includes(search);
        });
    }

    /* FILTER */
    if (currentClassFilter !== "all") {
        classes = classes.filter(cls => {
            if (!cls.expiryDate) {
                return currentClassFilter === "active";
            }

            const expiry = new Date(cls.expiryDate);
            expiry.setHours(0, 0, 0, 0);
            const isExpired = expiry < today;

            if (currentClassFilter === "expired") {
                return isExpired;
            }
            if (currentClassFilter === "active") {
                return !isExpired;
            }
            return true;
        });
    }

    /* CLEAR */
    container.innerHTML = "";

    /* EMPTY */
    if (classes.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="7" class="classes-empty" style="text-align: center; padding: 35px;">
                    <p style="margin: 0; color: var(--color-muted);">No classes found.</p>
                </td>
            </tr>
        `;
        return;
    }

    /* CREATE TABLE ROWS */
    classes.forEach((cls, index) => {
        const studentCount = Array.isArray(cls.studentIds) ? cls.studentIds.length : 0;
        let isExpired = false;

        if (cls.expiryDate) {
            const expiry = new Date(cls.expiryDate);
            expiry.setHours(0, 0, 0, 0);
            isExpired = expiry < today;
        }

        const formattedIndex = String(index + 1).padStart(2, '0');
        const classNameText = cls.name || "Untitled Class";
        const subject = getSubjects().find((item) => item.id === cls.subjectId);
        const subjectText = subject?.name || cls.subjectName || "No subject assigned";
        const expiryText = cls.expiryDate || "No expiry date";

        const tr = document.createElement("tr");
        tr.style.animationDelay = `${index * 0.04}s`;

        tr.innerHTML = `
            <td>${formattedIndex}</td>
            <td><strong>${escapeHtml(classNameText)}</strong></td>
            <td>${escapeHtml(subjectText)}</td>
            <td>${expiryText}</td>
            <td>${studentCount} Students</td>
            <td>
                <span class="status ${isExpired ? "status-danger" : "status-success"}">
                    ${isExpired ? "Expired" : "Active"}
                </span>
            </td>
            <td>
                <div class="class-actions" style="display: flex; gap: 6px; justify-content: flex-end;">
                    <a href="./class-details.html?id=${encodeURIComponent(cls.id)}" class="btn btn-secondary">View</a>
                    <a href="./materials.html?classId=${encodeURIComponent(cls.id)}" class="btn btn-secondary">Materials</a>
                    <button class="btn btn-secondary" onclick="openEditModal('${cls.id}')">Edit</button>
                </div>
            </td>
        `;

        container.appendChild(tr);
    });
}


/* =========================================
   MODAL LOGIC
========================================= */

function setupModalLogic() {
    const openBtn = document.getElementById("openAddClassModal");
    const modal = document.getElementById("addClassModal");
    const closeBtn = document.getElementById("closeModalBtn");
    const cancelBtn = document.getElementById("cancelModalBtn");
    const deleteBtn = document.getElementById("deleteClassBtn");
    const form = document.getElementById("addClassForm");
    const confirmModal = document.getElementById("confirmDeleteModal");
    const confirmCancelBtn = document.getElementById("confirmCancelBtn");
    const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

    if (!modal) return;

    populateSubjectSelect();

    /* OPEN CREATE */
    if (openBtn) {
        openBtn.addEventListener("click", () => {
            currentEditId = null;
            const modalTitle = document.getElementById("modalTitle");
            if (modalTitle) modalTitle.innerText = "Create Class";
            if (form) form.reset();
            if (deleteBtn) deleteBtn.style.display = "none";
            populateStudentsCheckbox([]);
            modal.classList.add("active");
        });
    }

    /* CLOSE */
    const closeModal = () => {
        modal.classList.remove("active");
        if (form) form.reset();
        currentEditId = null;
        if (deleteBtn) deleteBtn.style.display = "none";
    };

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    /* DELETE BUTTON */
    if (deleteBtn) {
        deleteBtn.addEventListener("click", () => {
            if (!currentEditId) return;
            if (confirmModal) confirmModal.classList.add("active");
        });
    }

    /* CANCEL DELETE */
    if (confirmCancelBtn) {
        confirmCancelBtn.addEventListener("click", () => {
            confirmModal.classList.remove("active");
        });
    }

    if (confirmModal) {
        confirmModal.addEventListener("click", (e) => {
            if (e.target === confirmModal) {
                confirmModal.classList.remove("active");
            }
        });
    }

    /* CONFIRM DELETE */
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener("click", () => {
            if (!currentEditId) return;

            const deletedClassId = currentEditId;
            let classes = getClasses();
            let materials = getMaterials();
            classes = classes.filter(cls => cls.id !== deletedClassId);
            materials = materials.filter(m => m.classId !== deletedClassId);

            const readList = (key) => { try { const v = JSON.parse(localStorage.getItem(key)); return Array.isArray(v) ? v : []; } catch { return []; } };
            const writeList = (key, value) => localStorage.setItem(key, JSON.stringify(value));
            const allHomeworks = readList("homeworks");
            const deletedHomeworkIds = new Set(allHomeworks.filter(h => h.classId === deletedClassId).map(h => h.id));
            writeList("homeworks", allHomeworks.filter(h => !deletedHomeworkIds.has(h.id)));
            writeList("homeworkStatuses", readList("homeworkStatuses").filter(s => !deletedHomeworkIds.has(s.homeworkId)));
            const allExams = readList("exams");
            const deletedExamIds = new Set(allExams.filter(e => e.classId === deletedClassId).map(e => e.id));
            writeList("exams", allExams.filter(e => !deletedExamIds.has(e.id)));
            writeList("grades", readList("grades").filter(g => !deletedExamIds.has(g.examId)));
            writeList("attendance", readList("attendance").filter(a => a.classId !== deletedClassId));
            writeList("notes", readList("notes").filter(n => n.classId !== deletedClassId));
            writeList("notifications", readList("notifications").filter(n => !(n.relatedId && (deletedHomeworkIds.has(n.relatedId) || deletedExamIds.has(n.relatedId))) && n.classId !== deletedClassId));
            saveClasses(classes);
            saveMaterials(materials);
            window.EvolviaApp?.syncLegacyEduKeys?.();

            confirmModal.classList.remove("active");
            closeModal();
            loadClassesUI();
        });
    }

    /* SAVE */
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const className = document.getElementById("classNameInput").value.trim();
            const subjectId = document.getElementById("subjectInput").value;
            const expiryDate = document.getElementById("expiryDateInput").value;

            const selectedStudents = [];
            document.querySelectorAll("input[name='classStudent']:checked").forEach(cb => {
                selectedStudents.push(cb.value);
            });

            let classes = getClasses();

            /* EDIT */
            if (currentEditId) {
                classes = classes.map(cls => {
                    if (cls.id === currentEditId) {
                        return {
                            ...cls,
                            name: className,
                            subjectId: subjectId,
                            expiryDate: expiryDate,
                            studentIds: selectedStudents
                        };
                    }
                    return cls;
                });
            } 
            /* CREATE */
            else {
                const newClass = {
                    id: generateNextClassId(),
                    name: className,
                    subjectId: subjectId,
                    expiryDate: expiryDate,
                    createdAt: localDateISO(),
                    studentIds: selectedStudents
                };
                classes.push(newClass);
            }

            saveClasses(classes);
            closeModal();
            loadClassesUI();
        });
    }
}


function populateSubjectSelect(selectedId = "") {
    const select = document.getElementById("subjectInput");
    if (!select) return;
    const subjects = getSubjects();
    select.innerHTML = '<option value="">Select subject</option>';
    subjects.forEach((subject) => {
        const option = document.createElement("option");
        option.value = subject.id;
        option.textContent = subject.name;
        if (subject.id === selectedId) option.selected = true;
        select.appendChild(option);
    });
}

/* =========================================
   EDIT MODAL
========================================= */

window.openEditModal = function(classId) {
    const classes = getClasses();
    const cls = classes.find(c => c.id === classId);

    if (!cls) return;

    currentEditId = classId;
    const modal = document.getElementById("addClassModal");
    const modalTitle = document.getElementById("modalTitle");

    if (modalTitle) modalTitle.innerText = "Edit Class";

    document.getElementById("classNameInput").value = cls.name || "";
    document.getElementById("subjectInput").value = cls.subjectId || "";
    document.getElementById("expiryDateInput").value = cls.expiryDate || "";

    const deleteBtn = document.getElementById("deleteClassBtn");
    if (deleteBtn) deleteBtn.style.display = "inline-block";

    populateStudentsCheckbox(cls.studentIds || []);

    if (modal) modal.classList.add("active");
}


/* =========================================
   STUDENTS CHECKBOX
========================================= */

function populateStudentsCheckbox(selectedIds = []) {
    const container = document.getElementById("studentsCheckboxContainer");
    if (!container) return;

    container.innerHTML = "";
    const students = getStudents();

    if (students.length === 0) {
        container.innerHTML = `
            <p style="grid-column: 1 / -1; text-align: center; color: var(--color-muted);">
                No students found. Add students from Students page first.
            </p>
        `;
        return;
    }

    students.forEach(student => {
        const studentId = student.id || student.email;
        const studentName = student.fullName || student.name || `${student.firstName || ""} ${student.lastName || ""}`.trim() || "Unknown Student";
        const isChecked = selectedIds.includes(studentId);

        const div = document.createElement("div");
        div.className = "checkbox-item";
        div.innerHTML = `
            <input type="checkbox" name="classStudent" value="${studentId}" id="std_${studentId}" ${isChecked ? "checked" : ""}>
            <label for="std_${studentId}" style="margin-bottom: 0; cursor: pointer; font-weight: 400;">
                ${studentName}
            </label>
        `;

        container.appendChild(div);
    });
}


document.addEventListener("DOMContentLoaded", () => {
    const classRows = document.querySelectorAll(".materials-table tbody tr, .classes-table tbody tr");
    
    let expiringCount = 0;

    classRows.forEach(row => {
        const dateCell = row.cells[3] || row.querySelector(".expiry-date");
        if (!dateCell) return;
        
        const expiryDateStr = dateCell.textContent.trim();
        const expiryDate = new Date(expiryDateStr);
        const today = new Date("2026-10-03");
        today.setHours(0, 0, 0, 0);
        
        const diffTime = expiryDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 3 && diffDays >= 0) {
            expiringCount++;
        }
    });

    if (expiringCount > 0) {
        const notificationIcon = document.querySelector(".fa-bell") || document.querySelector(".header-icon-bell");
        if (notificationIcon) {
            let badge = document.querySelector(".notification-badge");
            if (!badge) {
                badge = document.createElement("span");
                badge.className = "notification-badge";
                badge.style.cssText = "position:absolute; top:4px; right:4px; background:#dc2626; color:white; border-radius:50%; width:16px; height:16px; font-size:10px; display:flex; align-items:center; justify-content:center; font-weight:700;";
                notificationIcon.style.position = "relative";
                notificationIcon.appendChild(badge);
            }
            badge.textContent = expiringCount;
        }
    }
});