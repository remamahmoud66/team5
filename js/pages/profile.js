import { getCurrentTeacher, updateTeacher, logout } from "../data.js";

// --- Auth guard ---
let teacher = getCurrentTeacher();
if (!teacher) {
    window.location.href = "../login.html";
}

// --- Populate header ---
function populateHeader() {
    teacher = getCurrentTeacher();
    const splitedName = teacher.fullName.split(" ");
    const firstName = splitedName[0] || "";
    const secondName = splitedName[1] || "";

    document.getElementById("profileName").textContent = teacher.fullName;
    document.getElementById("avatar").textContent =
        `${firstName[0]}${secondName[0]}`;
}

populateHeader();

// --- Profile view mode ---
function showViewMode() {
    teacher = getCurrentTeacher();

    const splitedName = teacher.fullName.split(" ");
    const firstName = splitedName[0] || "";
    const lastName = splitedName[1] || "";

    document.getElementById("profileView").style.display = "";
    document.getElementById("profileEdit").style.display = "none";

    document.getElementById("profileAvatar").textContent =
        `${firstName[0] || ""}${lastName[0] || ""}`;
    document.getElementById("profileFullName").textContent = teacher.fullName;
    document.getElementById("fieldFullName").textContent = teacher.fullName;
    document.getElementById("fieldEmail").textContent = teacher.email;
    document.getElementById("fieldPhone").textContent = teacher.phone;

    populateHeader();
}

// --- Profile edit mode ---
function showEditMode() {
    teacher = getCurrentTeacher();

    const splitedName = teacher.fullName.split(" ");
    const firstName = splitedName[0] || "";
    const lastName = splitedName[1] || "";

    document.getElementById("profileView").style.display = "none";
    document.getElementById("profileEdit").style.display = "";

    document.getElementById("editProfileAvatar").textContent =
        `${firstName[0] || ""}${lastName[0] || ""}`;
    document.getElementById("fullNameInput").value = teacher.fullName;
    document.getElementById("emailInput").value = teacher.email;
    document.getElementById("phoneInput").value = teacher.phone;
}

// Initial render
showViewMode();

// --- Edit button ---
document.getElementById("editProfileBtn").addEventListener("click", () => {
    showEditMode();
});

// --- Save button ---
document.getElementById("saveProfileBtn").addEventListener("click", () => {
    const updatedTeacher = {
        ...teacher,
        fullName: document.getElementById("fullNameInput").value.trim(),
        email: document.getElementById("emailInput").value.trim(),
        phone: document.getElementById("phoneInput").value.trim(),
    };

    if (
        !updatedTeacher.fullName ||
        !updatedTeacher.email ||
        !updatedTeacher.phone
    ) {
        alert("Please fill in all fields.");
        return;
    }

    updateTeacher(updatedTeacher);
    showViewMode();
});

// --- Cancel button ---
document.getElementById("cancelProfileBtn").addEventListener("click", () => {
    showViewMode();
});

// --- Logout ---
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", (event) => {
        event.preventDefault();
        logout();
    });
}

console.log("Profile page loaded successfully");
