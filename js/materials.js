import { 
    getClasses, 
    getMaterials, 
    saveMaterials 
} from '../js/storage.js';

let pendingDeleteId = null;
let activeClassId = "";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

document.addEventListener("DOMContentLoaded", () => {
    const savedSearchQuery = sessionStorage.getItem("lastMaterialSearch") || "";
    const searchInput = document.getElementById("searchMaterialInput");

    if (searchInput && savedSearchQuery) {
        searchInput.value = savedSearchQuery;
    }

    const urlParams = new URLSearchParams(window.location.search);
    activeClassId = urlParams.get("classId") || "";

    renderClassFilter();
    loadMaterialsUI(searchInput ? searchInput.value : "", activeClassId);
    setupMaterialModalLogic();
    setupDeleteConfirmLogic();
    setupBackButton();
    checkUserCookie();

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value;
            sessionStorage.setItem("lastMaterialSearch", query);
            loadMaterialsUI(query, activeClassId);
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

function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (ch) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[ch]));
}

function getFileType(fileName) {
    const ext = (fileName.split(".").pop() || "").toLowerCase();
    if (ext === "pdf") return "PDF";
    if (ext === "doc" || ext === "docx") return "DOC";
    if (ext === "ppt" || ext === "pptx") return "PPT";
    if (ext === "xls" || ext === "xlsx") return "XLS";
    if (ext === "zip") return "ZIP";
    if (ext === "png" || ext === "jpg" || ext === "jpeg") return "IMAGE";
    if (ext === "txt") return "TXT";
    return ext ? ext.toUpperCase() : "FILE";
}

function generateNextMaterialId() {
    const materials = getMaterials();

    if (materials.length === 0) {
        return "mt_001";
    }

    let maxNumber = 0;
    materials.forEach(mat => {
        if (mat.id && mat.id.startsWith("mt_")) {
            const numPart = parseInt(mat.id.replace("mt_", ""), 10);
            if (!isNaN(numPart) && numPart > maxNumber) {
                maxNumber = numPart;
            }
        }
    });

    const nextNum = maxNumber + 1;
    return `mt_${String(nextNum).padStart(3, '0')}`;
}

function loadMaterialsUI(query = "", classIdFilter = "") {
    const tableBody = document.getElementById("materialsTableBody");
    const emptyState = document.getElementById("emptyMaterialsState");
    if (!tableBody) return;

    const materials = getMaterials();
    const classes = getClasses();

    let targetClassName = "";
    if (classIdFilter) {
        const foundCls = classes.find(c => c.id === classIdFilter);
        if (foundCls) targetClassName = foundCls.name;
    }

    let filteredMaterials = materials.filter(m => {
        const matchesQuery = query ? (m.title && m.title.toLowerCase().includes(query.toLowerCase())) : true;

        let matchesClass = true;
        if (classIdFilter) {
            matchesClass = (m.classId === classIdFilter) || (m.className === targetClassName) || (m.className === classIdFilter);
        }
        return matchesQuery && matchesClass;
    });

    tableBody.innerHTML = "";

    if (filteredMaterials.length === 0) {
        if (emptyState) emptyState.classList.remove("hidden");
        return;
    }

    if (emptyState) emptyState.classList.add("hidden");

    filteredMaterials.forEach((mat, index) => {
        const tr = document.createElement("tr");
        const typeClass = mat.type === 'PDF' ? 'status-danger' : 'status-warning';

        const num = parseInt(String(mat.id || "").replace(/\D/g, ""), 10) || (index + 1);
        const counter = String(num).padStart(2, "0");

        tr.innerHTML = `
            <td class="material-number">${counter}</td>
            <td>
                <div style="font-weight: 600; color: var(--color-text);">${escapeHtml(mat.title)}</div>
                <small style="color: var(--color-muted);">${escapeHtml(mat.description || '')}</small>
            </td>
            <td><span class="status ${typeClass}" style="padding: 2px 8px; font-size: 11px; border-radius: 4px;">${escapeHtml(mat.type || 'PDF')}</span></td>
            <td>${escapeHtml(mat.className || 'General Class')}</td>
            <td>${escapeHtml(mat.createdAt || 'N/A')}</td>
            <td>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-secondary open-btn" data-id="${escapeHtml(mat.id)}">Open</button>
                    <button class="btn btn-danger" onclick="deleteMaterial('${escapeHtml(mat.id)}')">Delete</button>
                </div>
            </td>
        `;

        const openBtn = tr.querySelector(".open-btn");
        if (openBtn) {
            openBtn.addEventListener("click", () => {
                if (mat.fileData) {
                    const newWindow = window.open('', '_blank');
                    if (newWindow) {
                        newWindow.document.write(`
                            <html>
                                <head>
                                    <title>${escapeHtml(mat.title)}</title>
                                    <style>
                                        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f4f6f9; color: #333; }
                                        .container { max-width: 800px; margin: auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
                                        h1 { margin-top: 0; color: #1e293b; }
                                        p { color: #64748b; line-height: 1.5; }
                                        .file-box { margin-top: 20px; text-align: center; }
                                        iframe, img { max-width: 100%; height: 600px; border: 1px solid #cbd5e1; border-radius: 6px; }
                                    </style>
                                </head>
                                <body>
                                    <div class="container">
                                        <h1>${escapeHtml(mat.title)}</h1>
                                        <p><strong>Description:</strong> ${escapeHtml(mat.description || 'No description provided.')}</p>
                                        <p><strong>Class:</strong> ${escapeHtml(mat.className || 'General Class')} | <strong>Type:</strong> ${escapeHtml(mat.type)}</p>
                                        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
                                        <div class="file-box">
                                            ${mat.fileMime && mat.fileMime.startsWith('image/') 
                                                ? `<img src="${mat.fileData}" alt="${escapeHtml(mat.title)}">` 
                                                : `<iframe src="${mat.fileData}" width="100%" height="600px"></iframe>`}
                                        </div>
                                    </div>
                                </body>
                            </html>
                        `);
                        newWindow.document.close();
                    }
                } else if (mat.link) {
                    window.open(mat.link, '_blank');
                } else {
                    alert("No file or link available for this material.");
                }
            });
        }

        tableBody.appendChild(tr);
    });
}

function renderClassFilter() {
    const select = document.getElementById("classFilter");
    if (!select) return;

    const classes = getClasses();

    if (activeClassId && !classes.some(c => c.id === activeClassId)) {
        activeClassId = "";
    }

    select.innerHTML = "";
    select.add(new Option("All classes", ""));
    classes.forEach(c => select.add(new Option(c.name || c.id, c.id)));
    select.value = activeClassId;

    select.addEventListener("change", () => {
        activeClassId = select.value;

        const url = new URL(window.location.href);
        if (activeClassId) {
            url.searchParams.set("classId", activeClassId);
        } else {
            url.searchParams.delete("classId");
        }
        window.history.replaceState({}, "", url);

        loadMaterialsUI(document.getElementById("searchMaterialInput")?.value || "", activeClassId);
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
        const fileInput = document.getElementById("materialFileInput");
        const file = fileInput && fileInput.files[0];

        if (!file) {
            alert("Please choose a file to upload.");
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            alert("This file is too large. Please choose a file smaller than 2MB.");
            return;
        }

        const classId = activeClassId;

        let className = "";
        if (classId) {
            const classes = getClasses();
            const matchedClass = classes.find(c => c.id === classId);
            if (matchedClass) className = matchedClass.name;
        }

        const reader = new FileReader();

        reader.onerror = () => {
            alert("Could not read the file. Please try again.");
        };

        reader.onload = () => {
            const newMaterial = {
                id: generateNextMaterialId(),
                classId: classId,
                title,
                description,
                type: getFileType(file.name),
                className,
                link: "",
                fileName: file.name,
                fileMime: file.type || "application/octet-stream",
                fileData: reader.result,
                createdAt: new Date().toISOString().split('T')[0]
            };

            const materials = getMaterials();
            materials.push(newMaterial);

            try {
                saveMaterials(materials);
            } catch (err) {
                alert("Storage is full. Delete some materials or use a smaller file.");
                return;
            }

            closeModal();
            loadMaterialsUI(document.getElementById("searchMaterialInput")?.value || "", classId);
        };

        reader.readAsDataURL(file);
    });
}

window.deleteMaterial = function(matId) {
    pendingDeleteId = matId;
    const confirmModal = document.getElementById("confirmDeleteModal");
    if (confirmModal) confirmModal.classList.add("active");
};

function setupDeleteConfirmLogic() {
    const confirmModal = document.getElementById("confirmDeleteModal");
    const confirmCancelBtn = document.getElementById("confirmCancelBtn");
    const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

    if (!confirmModal) return;

    const closeConfirm = () => {
        confirmModal.classList.remove("active");
        pendingDeleteId = null;
    };

    if (confirmCancelBtn) confirmCancelBtn.addEventListener("click", closeConfirm);

    confirmModal.addEventListener("click", (e) => {
        if (e.target === confirmModal) closeConfirm();
    });

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener("click", () => {
            if (!pendingDeleteId) return;

            let materials = getMaterials();

            materials = materials.filter(m => m.id !== pendingDeleteId);
            materials = materials.map((mat, index) => {
                return {
                    ...mat,
                    id: `mt_${String(index + 1).padStart(3, '0')}`
                };
            });

            saveMaterials(materials);
            closeConfirm();

            loadMaterialsUI(document.getElementById("searchMaterialInput")?.value || "", activeClassId);
        });
    }
}

function setupBackButton() {
}