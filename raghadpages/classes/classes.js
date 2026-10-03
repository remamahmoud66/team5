let currentEditId = null;

document.addEventListener("DOMContentLoaded", () => {
    loadClassesUI();

    const searchInput = document.getElementById("searchClassInput");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            loadClassesUI(e.target.value);
        });
    }

    setupModalLogic();
});

function loadClassesUI(query = "") {
    const container = document.getElementById("classesContainer");
    let classes = [];
    
    try {
        classes = JSON.parse(localStorage.getItem("classes")) || [];
    } catch (e) {
        classes = [];
    }

    if (query) {
        classes = classes.filter(cls => cls.name && cls.name.toLowerCase().includes(query.toLowerCase()));
    }

    container.innerHTML = "";

    if (classes.length === 0) {
        container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 40px;"><p>No classes found.</p></div>`;
        return;
    }

    classes.forEach(cls => {
        const studentCount = Array.isArray(cls.studentIds) ? cls.studentIds.length : 0;
        const isExpired = cls.expiryDate ? new Date(cls.expiryDate) < new Date() : false;

        const card = document.createElement("div");
        card.className = "card";
        
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <span class="status ${isExpired ? 'status-danger' : 'status-warning'}">
                    ${isExpired ? 'Expired' : 'Active'}
                </span>
                <small>Exp: ${cls.expiryDate || 'N/A'}</small>
            </div>
            <h3 style="margin-bottom: 8px;">${cls.name}</h3>
            <p style="margin-bottom: 16px;">Subject: ${cls.subject || 'N/A'}</p>
            <div style="background: var(--color-bg); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--color-border); margin-bottom: 16px;">
                <small style="display: block; margin-bottom: 4px;">Students enrolled</small>
                <span style="font-size: var(--font-size-lg); font-weight: bold; color: var(--color-text);">${studentCount}</span>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <div style="display: flex; gap: 8px;">
                    <a href="../class-details/class-details.html?id=${cls.id}" class="btn btn-secondary" 
                    style="flex: 1; text-align: center; font-size: 13px; min-height: 38px;">View Class</a>
                    
                    <button class="btn btn-secondary" onclick="openEditModal('${cls.id}')" 
                    style="font-size: 13px; min-height: 38px; padding: 0 12px;">Edit</button>
                </div>
                
                <a href="../materials/materials.html?classId=${cls.id}" class="btn btn-secondary" 
                style="text-align: center; font-size: 13px; min-height: 38px;">View Materials</a>
            </div>
        `;
        container.appendChild(card);
    });
}

function setupModalLogic() {
    const openBtn = document.getElementById("openAddClassModal");
    const modal = document.getElementById("addClassModal");
    const closeBtn = document.getElementById("closeModalBtn");
    const cancelBtn = document.getElementById("cancelModalBtn");
    const form = document.getElementById("addClassForm");

    if (!modal) return;

    openBtn.addEventListener("click", () => {
        currentEditId = null;
        document.getElementById("modalTitle").innerText = "Create Class";
        form.reset();
        populateStudentsCheckbox([]);
        modal.classList.add("active");
    });

    const closeModal = () => {
        modal.classList.remove("active");
        form.reset();
        currentEditId = null;
    };

    closeBtn.addEventListener("click", closeModal);
    cancelBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const className = document.getElementById("classNameInput").value.trim();
        const subject = document.getElementById("subjectInput").value;
        const expiryDate = document.getElementById("expiryDateInput").value;

        const selectedStudents = [];
        document.querySelectorAll("input[name='classStudent']:checked").forEach(cb => {
            selectedStudents.push(cb.value);
        });

        let classes = [];
        try {
            classes = JSON.parse(localStorage.getItem("classes")) || [];
        } catch (err) {
            classes = [];
        }

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
        } else {
            const newClass = {
                id: 'class_' + Date.now(),
                name: className,
                subject: subject,
                expiryDate: expiryDate,
                studentIds: selectedStudents
            };
            classes.push(newClass);
        }

        localStorage.setItem("classes", JSON.stringify(classes));
        closeModal();
        loadClassesUI();
    });
}

function openEditModal(classId) {
    let classes = [];
    try {
        classes = JSON.parse(localStorage.getItem("classes")) || [];
    } catch (e) {
        classes = [];
    }

    const cls = classes.find(c => c.id === classId);
    if (!cls) return;

    currentEditId = classId;

    const modal = document.getElementById("addClassModal");
    document.getElementById("modalTitle").innerText = "Edit Class";
    
    document.getElementById("classNameInput").value = cls.name || "";
    document.getElementById("subjectInput").value = cls.subject || "";
    document.getElementById("expiryDateInput").value = cls.expiryDate || "";

    populateStudentsCheckbox(cls.studentIds || []);

    modal.classList.add("active");
}

function populateStudentsCheckbox(selectedIds = []) {
    const container = document.getElementById("studentsCheckboxContainer");
    container.innerHTML = "";

    let students = [];
    try {
        students = JSON.parse(localStorage.getItem("students")) || [];
    } catch (e) {
        students = [];
    }

    if (students.length === 0) {
        container.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: var(--color-muted);">No students found. Add students from Students page first.</p>`;
        return;
    }

    students.forEach(student => {
        const studentId = student.id || student.email || student.name;
        const studentName = student.name || `${student.firstName || ''} ${student.lastName || ''}`.trim() || 'Unknown Student';
        
        const isChecked = selectedIds.includes(studentId);

        const div = document.createElement("div");
        div.className = "checkbox-item";
        div.innerHTML = `
            <input type="checkbox" name="classStudent" value="${studentId}" id="std_${studentId}" ${isChecked ? 'checked' : ''}>
            <label for="std_${studentId}" style="margin-bottom:0; cursor:pointer; font-weight: 400;">${studentName}</label>
        `;
        container.appendChild(div);
    });
}