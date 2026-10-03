import { 
    getClasses, 
    saveClasses, 
    getStudents, 
    getMaterials, 
    saveMaterials 
} from '../storage.js';

let currentEditId = null;
let currentClassFilter = "all";


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
    const classes = getClasses();

    if (classes.length === 0) {
        return "cl_001";
    }

    let maxNumber = 0;
    classes.forEach(cls => {
        if (cls.id && cls.id.startsWith("cl_")) {
            const numPart = parseInt(cls.id.replace("cl_", ""), 10);
            if (!isNaN(numPart) && numPart > maxNumber) {
                maxNumber = numPart;
            }
        }
    });

    const nextNum = maxNumber + 1;
    return `cl_${String(nextNum).padStart(3, "0")}`;
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
        const subjectText = cls.subject || "No subject assigned";
        const expiryText = cls.expiryDate || "No expiry date";

        const tr = document.createElement("tr");
        tr.style.animationDelay = `${index * 0.04}s`;

        tr.innerHTML = `
            <td>${formattedIndex}</td>
            <td><strong>${classNameText}</strong></td>
            <td>${subjectText}</td>
            <td>${expiryText}</td>
            <td>${studentCount} Students</td>
            <td>
                <span class="status ${isExpired ? "status-danger" : "status-success"}">
                    ${isExpired ? "Expired" : "Active"}
                </span>
            </td>
            <td>
                <div class="class-actions" style="display: flex; gap: 6px; justify-content: flex-end;">
                    <a href="../class-details/class-details.html?id=${cls.id}" class="btn btn-secondary">View</a>
                    <a href="../materials/materials.html?classId=${cls.id}" class="btn btn-secondary">Materials</a>
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

            let classes = getClasses();
            let materials = getMaterials();

            /* REMOVE CLASS */
            classes = classes.filter(cls => cls.id !== currentEditId);

            /* REMOVE MATERIALS */
            materials = materials.filter(m => m.classId !== currentEditId);

            /* RENUMBER */
            const idMap = {};
            classes = classes.map((cls, index) => {
                const newId = `cl_${String(index + 1).padStart(3, "0")}`;
                idMap[cls.id] = newId;
                return { ...cls, id: newId };
            });

            /* UPDATE MATERIAL IDS */
            materials = materials.map(m => {
                if (m.classId && idMap[m.classId]) {
                    return { ...m, classId: idMap[m.classId] };
                }
                return m;
            });

            saveClasses(classes);
            saveMaterials(materials);

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
            const subject = document.getElementById("subjectInput").value;
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
                            subject: subject,
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
                    subject: subject,
                    expiryDate: expiryDate,
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
    document.getElementById("subjectInput").value = cls.subject || "";
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
        const studentId = student.id || student.email || student.name;
        const studentName = student.name || `${student.firstName || ""} ${student.lastName || ""}`.trim() || "Unknown Student";
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