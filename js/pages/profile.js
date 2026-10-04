import { getCurrentTeacher, updateTeacher, logout } from "../data.js";

document.addEventListener("DOMContentLoaded", () => {
    let teacher = getCurrentTeacher();
    if (!teacher) {
        window.location.href = "./login.html";
        return;
    }

    const $ = (id) => document.getElementById(id);
    const initials = (name) => String(name || "Teacher")
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || "")
        .join("") || "T";

    function populateHeader() {
        teacher = getCurrentTeacher() || teacher;
        if ($("profileName")) $("profileName").textContent = teacher.fullName;
        if ($("avatar")) $("avatar").textContent = initials(teacher.fullName);
    }

    function showViewMode() {
        teacher = getCurrentTeacher() || teacher;
        $("profileView")?.style && ($( "profileView").style.display = "");
        $("profileEdit")?.style && ($( "profileEdit").style.display = "none");
        if ($("profileAvatar")) $("profileAvatar").textContent = initials(teacher.fullName);
        if ($("profileFullName")) $("profileFullName").textContent = teacher.fullName;
        if ($("fieldFullName")) $("fieldFullName").textContent = teacher.fullName;
        if ($("fieldEmail")) $("fieldEmail").textContent = teacher.email;
        if ($("fieldPhone")) $("fieldPhone").textContent = teacher.phone || "—";
        populateHeader();
    }

    function showEditMode() {
        teacher = getCurrentTeacher() || teacher;
        if ($("profileView")) $("profileView").style.display = "none";
        if ($("profileEdit")) $("profileEdit").style.display = "";
        if ($("editProfileAvatar")) $("editProfileAvatar").textContent = initials(teacher.fullName);
        if ($("fullNameInput")) $("fullNameInput").value = teacher.fullName || "";
        if ($("emailInput")) $("emailInput").value = teacher.email || "";
        if ($("phoneInput")) $("phoneInput").value = teacher.phone || "";
    }

    showViewMode();
    $("editProfileBtn")?.addEventListener("click", showEditMode);
    $("saveProfileBtn")?.addEventListener("click", () => {
        const updated = {
            ...teacher,
            fullName: $("fullNameInput")?.value.trim() || "",
            email: $("emailInput")?.value.trim().toLowerCase() || "",
            phone: $("phoneInput")?.value.trim() || "",
        };
        if (!updated.fullName || !updated.email || !updated.phone) {
            alert("Please fill in all fields.");
            return;
        }
        teacher = updateTeacher(updated);
        showViewMode();
        window.EvolviaApp?.syncUser(teacher);
    });
    $("cancelProfileBtn")?.addEventListener("click", showViewMode);
    $("logoutBtn")?.addEventListener("click", (event) => {
        event.preventDefault();
        logout();
    });
});
