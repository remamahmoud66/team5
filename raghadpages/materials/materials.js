document.addEventListener("DOMContentLoaded", () => {
    const savedSearchQuery = sessionStorage.getItem("lastMaterialSearch") || "";
    const searchInput = document.getElementById("searchMaterialInput");
    
    if (searchInput && savedSearchQuery) {
        searchInput.value = savedSearchQuery;
    }

    loadMaterialsUI(searchInput ? searchInput.value : "");
    setupMaterialModalLogic();
    checkUserCookie();

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value;
            sessionStorage.setItem("lastMaterialSearch", query);
            loadMaterialsUI(query);
        });
    }
});

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function checkUserCookie() {
    let currentUser = getCookie("evolvia_user");
    if (!currentUser) {
        setCookie("evolvia_user", "Instructor_Raghad", 604800);
    }
}

function populateClassDropdown() {
    const classSelect = document.getElementById("materialClassSelect");
    if (!classSelect) return;

    let classes = [];
    try {
        classes = JSON.parse(localStorage.getItem("classes")) || [];
    } catch (e) {
        classes = [];
    }

    classSelect.innerHTML = '<option value="">Select Class</option>';

    if (classes.length === 0) {
        classes = [
            { name: "JavaScript - Grade 10 A" },
            { name: "UI/UX Design - Class B" }
        ];
    }

    classes.forEach(cls => {
        const className = cls.name || cls;
        const opt = document.createElement("option");
        opt.value = className;
        opt.textContent = className;
        classSelect.appendChild(opt);
    });
}

function loadMaterialsUI(query = "") {
    const tableBody = document.getElementById("materialsTableBody");
    const emptyState = document.getElementById("emptyMaterialsState");
    if (!tableBody) return;

    let materials = [];
    try {
        materials = JSON.parse(localStorage.getItem("materials")) || [];
    } catch (e) {
        materials = [];
    }

    if (materials.length === 0) {
        materials = [
            {
                id: 'mat_1',
                title: 'JavaScript DOM Guide',
                description: 'Comprehensive guide on manipulating the DOM.',
                link: 'https: //developer.mozilla.org',
                type: 'PDF',
                className: 'JavaScript - Grade 10 A',
                createdAt: '2026-09-30'
            },
            {
                id: 'mat_2',
                title: 'UI/UX Wireframing Basics',
                description: 'Introduction to wireframes and user flows.',
                link: 'https: //figma.com',
                type: 'LINK',
                className: 'UI/UX Design - Class B',
                createdAt: '2026-10-01'
            }
        ];
        localStorage.setItem("materials", JSON.stringify(materials));
    }

    if (query) {
        materials = materials.filter(m => m.title && m.title.toLowerCase().includes(query.toLowerCase()));
    }

    tableBody.innerHTML = "";

    if (materials.length === 0) {
        if (emptyState) emptyState.classList.remove("hidden");
        return;
    }

    if (emptyState) emptyState.classList.add("hidden");

    materials.forEach(mat => {
        const tr = document.createElement("tr");
        const typeClass = mat.type === 'PDF' ? 'status-danger' : 'status-warning';

        tr.innerHTML = `
            <td style="padding: 16px;">
                <div style="font-weight: 600; color: var(--color-text);">${mat.title}</div>
                <small style="color: var(--color-muted);">${mat.description || ''}</small>
            </td>
            <td style="padding: 16px;"><span class="status ${typeClass}" style="padding: 2px 8px; font-size: 11px; border-radius: 4px;">${mat.type || 'PDF'}</span></td>
            <td style="padding: 16px;">${mat.className || 'General Class'}</td>
            <td style="padding: 16px;">${mat.createdAt || 'N/A'}</td>
            <td style="padding: 16px;">
                <div style="display: flex; gap: 8px;">
                    <a href="${mat.link || '#'}" target="_blank" class="btn btn-secondary" style="padding: 4px 10px; font-size: 12px; text-decoration: none;">Open</a>
                    <button class="btn btn-danger" onclick="deleteMaterial('${mat.id}')" style="padding: 4px 10px; font-size: 12px; background: #fee2e2; color: #dc2626; border: none; border-radius: 4px; cursor: pointer;">Delete</button>
                </div>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

function setupMaterialModalLogic() {
    const openBtn = document.getElementById("openAddMaterialModal");
    const modal = document.getElementById("addMaterialModal");
    const closeBtn = document.getElementById("closeMaterialModalBtn");
    const cancelBtn = document.getElementById("cancelMaterialModalBtn");
    const form = document.getElementById("addMaterialForm");

    if (!modal || !form) return;

    if (openBtn) {
        openBtn.addEventListener("click", () => {
            populateClassDropdown();
            form.reset();
            modal.classList.add("active");
        });
    }

    const closeModal = () => {
        modal.classList.remove("active");
        form.reset();
    };

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (cancelBtn) cancelBtn.addEventListener("click", closeModal);
    
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = document.getElementById("materialTitleInput").value.trim();
        const description = document.getElementById("materialDescInput").value.trim();
        const type = document.getElementById("materialTypeSelect").value;
        const className = document.getElementById("materialClassSelect").value;
        const link = document.getElementById("materialLinkInput").value.trim();

        const newMaterial = {
            id: 'mat_' + Date.now(),
            title,
            description,
            type,
            className,
            link,
            createdAt: new Date().toISOString().split('T')[0]
        };

        let materials = [];
        try {
            materials = JSON.parse(localStorage.getItem("materials")) || [];
        } catch (err) {
            materials = [];
        }

        materials.push(newMaterial);
        localStorage.setItem("materials", JSON.stringify(materials));

        closeModal();
        loadMaterialsUI();
    });
}

function deleteMaterial(matId) {
    if (!confirm("Are you sure you want to delete this material?")) return;

    let materials = [];
    try {
        materials = JSON.parse(localStorage.getItem("materials")) || [];
    } catch (e) {
        materials = [];
    }

    materials = materials.filter(m => m.id !== matId);
    localStorage.setItem("materials", JSON.stringify(materials));
    loadMaterialsUI();
}