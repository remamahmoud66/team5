/* student-details.js — Student Details page (student-details.html?id=ST001)
   Everything this page needs is in this ONE file (team decision). */

/* ======================================================================
   CORE (shared) — DUPLICATED IN: students.js, subjects.js, student-details.js
   ----------------------------------------------------------------------
   Team decision: ONE JS file per page, so this whole block is copied into
   every page file. If you change anything here, change it in ALL files.

   INTEGRATION NOTE (for the next developer / AI):
   The spec (section 7) describes separate shared files:
     js/storage/seedData.js, js/storage/storage.js,
     js/utils/idGenerator.js, date.js, validation.js, ui.js,
     js/services/authService.js, js/components/sidebar.js, header.js
   If the team later creates them, DELETE this block from each page file
   and load those files with <script> tags BEFORE the page script.
   Object and function names below already match the spec, so the page
   code further down needs no changes.
   ====================================================================== */

/* ----------------------------------------------------------------------
   SEED DATA  (spec section 5) — written to LocalStorage on first run only.
   Every key is written ONLY if it does not already exist (see initSeed).
   ---------------------------------------------------------------------- */
const seedData = {
  teachers: [
    { id: "T001", fullName: "Ahmad Khaled", birthDate: "1988-04-15", degree: "Bachelor of Computer Science",
      phone: "0790000000", email: "ahmad@example.com", password: "123456" }
  ],
  students: [
    { id: "ST001", fullName: "Mohammad Ali", birthDate: "2008-05-12", academicLevel: "10th Grade",
      phone: "0791111111", email: "mohammad@example.com", status: "Active" },
    { id: "ST002", fullName: "Ahmad Omar", birthDate: "2008-08-20", academicLevel: "10th Grade",
      phone: "0792222222", email: "ahmad@example.com", status: "Active" },
    { id: "ST003", fullName: "Omar Hassan", birthDate: "2008-03-10", academicLevel: "10th Grade",
      phone: "0793333333", email: "omar@example.com", status: "Active" }
  ],
  subjects: [
    { id: "SUB001", name: "JavaScript", teacherId: "T001",
      syllabus: "DOM, Events, Functions, LocalStorage and APIs" }
  ],
  classes: [
    { id: "C001", name: "JavaScript - Grade 10 A", subjectId: "SUB001", teacherId: "T001",
      studentIds: ["ST001", "ST002", "ST003"], createdAt: "2026-09-28", expiryDate: "2027-01-28" }
  ],
  materials: [
    { id: "MAT001", title: "JavaScript DOM Guide", description: "Introduction to DOM manipulation",
      type: "PDF", fileUrl: "/files/javascript-dom.pdf", teacherId: "T001", subjectId: "SUB001",
      classId: "C001", createdAt: "2026-09-28" }
  ],
  homeworks: [
    { id: "HW001", title: "DOM Assignment", description: "Create a dynamic To-Do List",
      teacherId: "T001", classId: "C001", createdAt: "2026-09-28", deadline: "2026-10-02" }
  ],
  homeworkStatuses: [
    { id: "HWS001", homeworkId: "HW001", studentId: "ST001", status: "Submitted", updatedAt: "2026-09-30" },
    { id: "HWS002", homeworkId: "HW001", studentId: "ST002", status: "Not Submitted", updatedAt: "2026-09-30" },
    { id: "HWS003", homeworkId: "HW001", studentId: "ST003", status: "Submitted", updatedAt: "2026-09-30" }
  ],
  exams: [
    { id: "EX001", title: "JavaScript Midterm", description: "DOM, Events and Storage", teacherId: "T001",
      classId: "C001", subjectId: "SUB001", date: "2026-10-05", totalMarks: 100 }
  ],
  grades: [
    { id: "GR001", examId: "EX001", studentId: "ST001", mark: 87 },
    { id: "GR002", examId: "EX001", studentId: "ST002", mark: 92 },
    { id: "GR003", examId: "EX001", studentId: "ST003", mark: 74 }
  ],
  attendance: [
    { id: "ATT001", studentId: "ST001", classId: "C001", subjectId: "SUB001", date: "2026-09-30", status: "Present" },
    { id: "ATT002", studentId: "ST002", classId: "C001", subjectId: "SUB001", date: "2026-09-30", status: "Absent" },
    { id: "ATT003", studentId: "ST003", classId: "C001", subjectId: "SUB001", date: "2026-09-30", status: "Present" }
  ],
  notes: [
    { id: "NOTE001", studentId: "ST001", teacherId: "T001", classId: "C001",
      text: "Excellent participation in today's lesson.", createdAt: "2026-09-30" }
  ],
  notifications: [
    { id: "NOT001", studentId: "ST001", teacherId: "T001", subjectId: "SUB001", type: "Homework",
      relatedId: "HW001", text: "New homework has been assigned.", date: "2026-09-28", isRead: false }
  ]
};

/* ----------------------------------------------------------------------
   STORAGE LAYER (spec 7.1) — the ONLY place that touches localStorage.
   Pages call Services, Services call Storage. Never call localStorage
   directly from page code.
   Note: this intentionally shadows the browser's built-in `Storage`
   interface name, because the spec mandates this exact name.
   ---------------------------------------------------------------------- */
const Storage = {
  getAll(key) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key));
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error(`Storage: could not read "${key}"`, error);
      return [];
    }
  },
  saveAll(key, array) {
    localStorage.setItem(key, JSON.stringify(array));
  },
  getById(key, id) {
    return this.getAll(key).find((item) => item.id === id) || null;
  },
  add(key, item) {
    const items = this.getAll(key);
    items.push(item);
    this.saveAll(key, items);
    return item;
  },
  update(key, id, data) {
    const items = this.getAll(key);
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...data, id }; // the id can never be changed
    this.saveAll(key, items);
    return items[index];
  },
  remove(key, id) {
    this.saveAll(key, this.getAll(key).filter((item) => item.id !== id));
  },
  initSeed() {
    Object.entries(seedData).forEach(([key, value]) => {
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(value));
      }
    });
  }
};

/* ----------------------------------------------------------------------
   UTILITIES (spec 7.2)
   ---------------------------------------------------------------------- */

// IdGenerator.next("ST", "students") -> "ST004"
// Finds the highest existing number for that prefix and adds 1,
// so deleted IDs are never reused while higher ones exist.
const IdGenerator = {
  next(prefix, key) {
    const pattern = new RegExp("^" + prefix + "(\\d+)$");
    const max = Storage.getAll(key).reduce((highest, item) => {
      const match = pattern.exec(item.id || "");
      return match ? Math.max(highest, Number(match[1])) : highest;
    }, 0);
    return prefix + String(max + 1).padStart(3, "0");
  }
};

// All dates are "YYYY-MM-DD" strings. Such strings compare correctly
// with < and >, so no Date objects are needed for comparisons.
const DateUtil = {
  today() {
    const d = new Date(); // local date (not UTC) so "today" matches the user's clock
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  },
  isBefore(a, b) {
    return a < b;
  }
};

const Validation = {
  required(value) {
    return value !== undefined && value !== null && String(value).trim() !== "";
  },
  email(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
  },
  phone(value) {
    return /^\d{10}$/.test(String(value).trim()); // digits only, exactly 10
  },
  dateNotBefore(a, b) {
    return !DateUtil.isBefore(a, b);
  },
  markInRange(mark, total) {
    const n = Number(mark);
    return !Number.isNaN(n) && n >= 0 && n <= Number(total);
  }
};

/* ----------------------------------------------------------------------
   UI HELPERS — toast, confirm dialog, empty state, modal open/close.
   ---------------------------------------------------------------------- */
const UI = {
  // Always escape user data before putting it in innerHTML.
  escape(value) {
    return String(value ?? "").replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[ch]));
  },

  // type: "success" | "error"
  toast(message, type = "success") {
    let container = document.getElementById("toastContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "toastContainer";
      container.className = "toast-container";
      container.setAttribute("aria-live", "polite");
      document.body.appendChild(container);
    }
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("toast-hide");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  // DIFFERENCE FROM SPEC: the spec says UI.confirm(message) -> boolean.
  // A styled dialog cannot block like window.confirm, so this returns a
  // Promise<boolean>. Usage:  if (await UI.confirm("Sure?")) { ... }
  confirm(message, confirmText = "Delete") {
    return new Promise((resolve) => {
      const overlay = document.createElement("div");
      overlay.className = "modal-overlay";
      overlay.innerHTML = `
        <div class="modal modal-sm" role="alertdialog" aria-modal="true" aria-labelledby="confirmTitle">
          <div class="modal-header"><h2 id="confirmTitle">Please confirm</h2></div>
          <div class="modal-body"><p class="confirm-text"></p></div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-answer="no">Cancel</button>
            <button type="button" class="btn btn-danger" data-answer="yes"></button>
          </div>
        </div>`;
      overlay.querySelector(".confirm-text").textContent = message;
      overlay.querySelector('[data-answer="yes"]').textContent = confirmText;
      document.body.appendChild(overlay);
      document.body.classList.add("modal-open");

      const onKey = (event) => { if (event.key === "Escape") close(false); };
      const close = (answer) => {
        overlay.remove();
        document.body.classList.remove("modal-open");
        document.removeEventListener("keydown", onKey);
        resolve(answer);
      };
      overlay.addEventListener("click", (event) => {
        if (event.target === overlay) return close(false);
        const button = event.target.closest("[data-answer]");
        if (button) close(button.dataset.answer === "yes");
      });
      document.addEventListener("keydown", onKey);
      overlay.querySelector('[data-answer="no"]').focus();
    });
  },

  emptyState(containerId, message) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 3H4.99c-1.11 0-1.98.89-1.98 2L3 19c0 1.1.88 2 1.99 2H19c1.1 0 2-.9 2-2V5c0-1.11-.9-2-2-2zm0 12h-4c0 1.66-1.35 3-3 3s-3-1.34-3-3H4.99V5H19v10z"/></svg>
        <p>${UI.escape(message)}</p>
      </div>`;
  },

  // Modals live in the page HTML with class "modal-overlay hidden".
  // Any element with [data-close-modal] inside closes it.
  bindModal(modalId, onClose) {
    const overlay = document.getElementById(modalId);
    if (!overlay) return;
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay || event.target.closest("[data-close-modal]")) {
        UI.closeModal(modalId);
        if (onClose) onClose();
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !overlay.classList.contains("hidden")) {
        UI.closeModal(modalId);
        if (onClose) onClose();
      }
    });
  },
  openModal(modalId) {
    const overlay = document.getElementById(modalId);
    overlay.classList.remove("hidden");
    document.body.classList.add("modal-open");
    const firstField = overlay.querySelector("input, select, textarea");
    if (firstField) firstField.focus();
  },
  closeModal(modalId) {
    document.getElementById(modalId).classList.add("hidden");
    document.body.classList.remove("modal-open");
  },

  // errors = { fieldName: "message" } ; shows them under each field
  showErrors(form, errors) {
    form.querySelectorAll("[data-error-for]").forEach((el) => {
      const name = el.dataset.errorFor;
      const message = errors[name] || "";
      el.textContent = message;
      const input = form.elements[name];
      if (input) input.classList.toggle("input-invalid", Boolean(message));
    });
  },
  clearErrors(form) {
    this.showErrors(form, {});
  },
  clearFieldError(form, name) {
    const el = form.querySelector(`[data-error-for="${name}"]`);
    if (el) el.textContent = "";
    if (form.elements[name]) form.elements[name].classList.remove("input-invalid");
  },

  // DISPLAY ONLY: "ST004" -> "4", "SUB002" -> "2" (used in the "#" table column).
  // The stored id stays "ST004" — never save this number, other records
  // (classes.studentIds, grades.studentId, ...) point to the full id.
  idNumber(id) {
    const match = String(id || "").match(/\d+/);
    return match ? String(Number(match[0])) : String(id || "");
  },

  initials(name) {
    const parts = String(name || "").trim().split(/\s+/).filter(Boolean).slice(0, 2);
    return parts.map((p) => p[0].toUpperCase()).join("") || "?";
  },

  // "2026-09-30" -> "30 Sep 2026" (display only; storage stays ISO)
  formatDate(iso) {
    if (!iso) return "—";
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  }
};

/* ----------------------------------------------------------------------
   AUTH SERVICE (spec section 6)
   ---------------------------------------------------------------------- */

// !!! IMPORTANT — DEVELOPMENT ONLY !!!
// login.html is not built yet, so requireAuth() would redirect to a page
// that does not exist. While this flag is true, the first teacher (T001)
// is logged in automatically. Set it to FALSE as soon as login.html works.
const DEV_AUTO_LOGIN = false;

const AuthService = {
  // Returns the teacher or null. Saves the teacher in sessionStorage.
  login(email, password) {
    const teacher = Storage.getAll("teachers").find(
      (t) => t.email.toLowerCase() === String(email).trim().toLowerCase() && t.password === password
    );
    if (!teacher) return null;
    sessionStorage.setItem("currentUser", JSON.stringify(teacher));
    return teacher;
  },
  logout() {
    sessionStorage.removeItem("currentUser"); // LocalStorage data is NOT cleared
    window.location.href = "login.html";
  },
  getCurrentUser() {
    try {
      return JSON.parse(sessionStorage.getItem("currentUser"));
    } catch {
      return null;
    }
  },
  // Call at the top of every protected page. Returns the user or null.
  requireAuth() {
    let user = this.getCurrentUser();
    if (!user && DEV_AUTO_LOGIN) {
      const teacher = Storage.getAll("teachers")[0];
      if (teacher) {
        sessionStorage.setItem("currentUser", JSON.stringify(teacher));
        user = teacher;
        console.warn("DEV_AUTO_LOGIN is ON: logged in as", teacher.email, "- turn it off when login.html is ready.");
      }
    }
    if (!user) {
      window.location.href = "login.html";
      return null;
    }
    return user;
  }
};

/* ----------------------------------------------------------------------
   NOTIFICATION SERVICE (spec 8.9) — the part needed on every page:
   the header bell (unread badge, list, mark as read) + create() for notes.
   OWNER: Developer 4. INTEGRATION: when js/services/notificationService.js
   exists, delete this block; the function names below match the spec.
   The teacher only sees notifications they created (teacherId).
   ---------------------------------------------------------------------- */
const NotificationService = {
  getAll() {
    const user = AuthService.getCurrentUser();
    return Storage.getAll("notifications")
      .filter((n) => !user || n.teacherId === user.id)
      .sort((a, b) => String(b.date).localeCompare(String(a.date)) || String(b.id).localeCompare(String(a.id)));
  },
  getUnread() {
    return this.getAll().filter((n) => !n.isRead);
  },
  getUnreadCount() {
    return this.getUnread().length;
  },
  markAsRead(id) {
    Storage.update("notifications", id, { isRead: true });
  },
  markAllAsRead() {
    const mine = new Set(this.getAll().map((n) => n.id));
    Storage.saveAll("notifications", Storage.getAll("notifications").map((n) => (mine.has(n.id) ? { ...n, isRead: true } : n)));
  },
  create({ studentId, subjectId, type, relatedId, text }) {
    const user = AuthService.getCurrentUser();
    const notification = {
      id: IdGenerator.next("NOT", "notifications"),
      studentId,
      teacherId: user.id,
      subjectId,
      type,
      relatedId,
      text,
      date: DateUtil.today(),
      isRead: false
    };
    Storage.add("notifications", notification);
    return notification;
  }
};

/* ----------------------------------------------------------------------
   HEADER NOTIFICATION BELL — drives the team template markup:
   #notification-bell-btn, #notification-badge, #notification-dropdown,
   #notification-list, #mark-all-read-btn (styles are in style.css).
   INTEGRATION: if a teammate already wrote the bell code (header.js /
   exams.js), use theirs on every page and delete this block, so all
   pages behave the same. Call HeaderNotifications.render() after any
   change to notifications so the badge stays correct.
   ---------------------------------------------------------------------- */
const HeaderNotifications = {
  MAX_ITEMS: 5, // spec 10.1: "last 5 with unread highlight"

  init() {
    this.btn = document.getElementById("notification-bell-btn");
    this.badge = document.getElementById("notification-badge");
    this.dropdown = document.getElementById("notification-dropdown");
    this.list = document.getElementById("notification-list");
    if (!this.btn || !this.dropdown || !this.list) return; // template without a bell

    this.btn.setAttribute("aria-haspopup", "true");
    this.btn.setAttribute("aria-expanded", "false");

    this.btn.addEventListener("click", (event) => {
      event.stopPropagation(); // otherwise the document click below closes it at once
      this.toggle();
    });
    // Click anywhere outside the dropdown closes it
    document.addEventListener("click", (event) => {
      if (!this.dropdown.contains(event.target)) this.toggle(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") this.toggle(false);
    });

    const markAll = document.getElementById("mark-all-read-btn");
    if (markAll) {
      markAll.addEventListener("click", () => {
        NotificationService.markAllAsRead();
        this.render();
      });
    }

    // Clicking an item marks it read; the link then opens the student's Notifications tab
    this.list.addEventListener("click", (event) => {
      const item = event.target.closest("[data-notification-id]");
      if (item) NotificationService.markAsRead(item.dataset.notificationId);
    });

    this.render();
  },

  toggle(force) {
    if (!this.dropdown) return;
    const open = force ?? this.dropdown.classList.contains("hidden");
    this.dropdown.classList.toggle("hidden", !open);
    this.btn.setAttribute("aria-expanded", String(open));
    if (open) this.render();
  },

  render() {
    if (!this.list) return;
    const count = NotificationService.getUnreadCount();
    if (this.badge) {
      this.badge.textContent = count > 99 ? "99+" : String(count);
      this.badge.classList.toggle("hidden", count === 0);
    }

    const items = NotificationService.getAll().slice(0, this.MAX_ITEMS);
    if (!items.length) {
      this.list.innerHTML = '<div class="notif-empty">No notifications yet.</div>';
      return;
    }
    const students = Storage.getAll("students");
    const e = UI.escape;
    this.list.innerHTML = items.map((n) => {
      const student = students.find((s) => s.id === n.studentId);
      return `
        <a class="notif-item ${n.isRead ? "" : "unread"}" data-notification-id="${e(n.id)}"
           href="student-details.html?id=${encodeURIComponent(n.studentId)}#notifications">
          <div class="notif-icon-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
          </div>
          <div class="notif-content">
            <div class="notif-text"><strong>${e(student ? student.fullName : "Deleted student")}</strong> · ${e(n.text)}</div>
            <div class="notif-date">${e(n.type)} · ${e(UI.formatDate(n.date))}</div>
          </div>
        </a>`;
    }).join("");
  }
};

/* ----------------------------------------------------------------------
   LAYOUT BINDING — the sidebar/header HTML is the team template, copied
   as-is into every page. Instead of editing that HTML, JS fills it in:
   active link, breadcrumb, teacher name, logout (now in the sidebar),
   and the notification bell.
   INTEGRATION: replace with js/components/sidebar.js + header.js later.
   ---------------------------------------------------------------------- */

// The template links are hashes (#students). Pages that exist are mapped
// here to real files. ADD a line when a new page is built
// (or simply change the href in the HTML and remove the entry here).
const NAV_ROUTES = {
  "#students": "students.html",
  "#subjects": "subjects.html"
  // "#dashboard": "dashboard.html",
  // "#classes": "classes.html",
  // "#homework": "homework.html",
  // "#exams": "exams.html",
  // "#attendance": "attendance.html",
};

const Layout = {
  init(user, activeHash, pageTitle) {
    // Sidebar: real links + active state
    document.querySelectorAll(".sidebar .nav-link").forEach((link) => {
      const hash = link.getAttribute("href");
      if (NAV_ROUTES[hash]) link.setAttribute("href", NAV_ROUTES[hash]);
    });

    // Breadcrumb
    const current = document.querySelector(".breadcrumb-current");
    if (current) current.textContent = pageTitle;

    // Header: logged-in teacher instead of the template placeholder
    const nameEl = document.querySelector(".user-name");
    const roleEl = document.querySelector(".user-role");
    const avatarEl = document.querySelector(".header .avatar");
    if (nameEl) nameEl.textContent = user.fullName;
    if (roleEl) roleEl.textContent = "Teacher";
    if (avatarEl) avatarEl.textContent = UI.initials(user.fullName);

    // Notification bell in the header
    if (!window.EvolviaApp) HeaderNotifications.init();

    // Logout (the template moved it from the header to the sidebar;
    // this selector finds it in either place)
    const logoutBtn = document.querySelector(".logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (event) => {
        event.preventDefault();
        AuthService.logout();
      });
    }
  }
};
/* ============================ END OF CORE ============================ */


/* ======================================================================
   STUDENT SERVICE (spec 8.1) — DUPLICATED IN: students.js, student-details.js
   INTEGRATION: move to js/services/studentService.js when shared files exist.

   Return shape of create/update/delete (not fixed by the spec, chosen here):
     { ok: true,  data: student }
     { ok: false, errors: { fieldName: "message", _: "general message" } }
   ====================================================================== */
const STUDENT_STATUSES = ["Active", "Inactive", "Graduated"];

const StudentService = {
  getAll() {
    return Storage.getAll("students");
  },
  getById(id) {
    return Storage.getById("students", id);
  },

  // excludeId: when editing, the student's own email is not a duplicate.
  validate(data, excludeId = null) {
    const errors = {};
    if (!Validation.required(data.fullName)) errors.fullName = "Full name is required";

    if (!Validation.required(data.birthDate)) errors.birthDate = "Birth date is required";
    else if (DateUtil.isBefore(DateUtil.today(), data.birthDate)) errors.birthDate = "Birth date cannot be in the future";

    if (!Validation.required(data.academicLevel)) errors.academicLevel = "Academic level is required";

    if (!Validation.required(data.phone)) errors.phone = "Phone is required";
    else if (!Validation.phone(data.phone)) errors.phone = "Invalid phone (10 digits only)";

    if (!Validation.required(data.email)) errors.email = "Email is required";
    else if (!Validation.email(data.email)) errors.email = "Invalid email";
    else {
      const email = data.email.trim().toLowerCase();
      const taken = this.getAll().some((s) => s.email.toLowerCase() === email && s.id !== excludeId);
      if (taken) errors.email = "Email already exists";
    }

    if (!STUDENT_STATUSES.includes(data.status)) errors.status = "Status is required";
    return errors;
  },

  // Keeps only the fields of the data model (spec 3.2), trimmed.
  clean(data) {
    return {
      fullName: data.fullName.trim(),
      birthDate: data.birthDate,
      academicLevel: data.academicLevel.trim(),
      phone: data.phone.trim(),
      email: data.email.trim().toLowerCase(),
      status: data.status
    };
  },

  create(data) {
    const errors = this.validate(data);
    if (Object.keys(errors).length) return { ok: false, errors };
    const student = { id: IdGenerator.next("ST", "students"), ...this.clean(data) };
    Storage.add("students", student);
    return { ok: true, data: student };
  },

  update(id, data) {
    if (!this.getById(id)) return { ok: false, errors: { _: "Student not found" } };
    const errors = this.validate(data, id);
    if (Object.keys(errors).length) return { ok: false, errors };
    return { ok: true, data: Storage.update("students", id, this.clean(data)) };
  },

  // Cascade delete (spec 13.2): remove the student from every class and
  // delete every record that points to them.
  // INTEGRATION: when the other services exist, these blocks can call e.g.
  // ClassService.removeStudent(...) instead of touching Storage directly.
  delete(id) {
    if (!this.getById(id)) return { ok: false, errors: { _: "Student not found" } };

    const classes = Storage.getAll("classes").map((c) => ({
      ...c,
      studentIds: (c.studentIds || []).filter((sid) => sid !== id)
    }));
    Storage.saveAll("classes", classes);

    ["homeworkStatuses", "grades", "attendance", "notes", "notifications"].forEach((key) => {
      Storage.saveAll(key, Storage.getAll(key).filter((item) => item.studentId !== id));
    });

    Storage.remove("students", id);
    return { ok: true };
  },

  // Case-insensitive search by name, email or phone.
  search(text) {
    const q = String(text || "").trim().toLowerCase();
    const all = this.getAll();
    if (!q) return all;
    return all.filter((s) =>
      s.fullName.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.phone.includes(q)
    );
  },

  getByClass(classId) {
    const cls = Storage.getById("classes", classId);
    if (!cls) return [];
    return (cls.studentIds || []).map((id) => this.getById(id)).filter(Boolean);
  },

  // Everything the Student Details page needs, computed by IDs (spec 1.2).
  // INTEGRATION: each block reads Storage directly because the other
  // services are not ready. Replacement map when they exist:
  //   attendance -> AttendanceService.getByStudent / getStudentSummary
  //   homework   -> HomeworkService.getStudentHomework
  //   grades     -> GradeService.getByStudent
  //   notes      -> NoteService.getByStudent
  //   notifications -> NotificationService.getByStudent
  // NOTE: the spec says each teacher sees only their own classes. With one
  // demo teacher this is not filtered; add a teacherId filter if needed.
  getProfile(studentId) {
    const student = this.getById(studentId);
    if (!student) return null;

    const user = AuthService.getCurrentUser();
    const teacherId = user?.id || null;
    const subjects = Storage.getAll("subjects").filter((x) => !x.teacherId || x.teacherId === teacherId);
    const allClasses = Storage.getAll("classes").filter((x) => !x.teacherId || x.teacherId === teacherId);
    const subjectName = (id) => (subjects.find((s) => s.id === id) || {}).name || "—";
    const className = (id) => (allClasses.find((c) => c.id === id) || {}).name || "Deleted class";
    const newestFirst = (field) => (a, b) => String(b[field]).localeCompare(String(a[field])) || String(b.id).localeCompare(String(a.id));

    // Classes
    const classes = allClasses
      .filter((c) => (c.studentIds || []).includes(studentId))
      .map((c) => ({ ...c, subjectName: subjectName(c.subjectId), studentCount: (c.studentIds || []).length }));

    // Attendance
    const attendance = Storage.getAll("attendance")
      .filter((a) => a.studentId === studentId && classes.some((c) => c.id === a.classId))
      .map((a) => ({ ...a, className: className(a.classId) }))
      .sort(newestFirst("date"));
    const countStatus = (status) => attendance.filter((a) => a.status === status).length;
    const present = countStatus("Present");
    const absent = countStatus("Absent");
    const late = countStatus("Late");
    // Decision: "Late" counts as attended for the percentage.
    const rate = attendance.length ? Math.round(((present + late) / attendance.length) * 100) : null;

    // Homework (homework + THIS student's status)
    const homeworks = Storage.getAll("homeworks").filter((h) => !h.teacherId || h.teacherId === teacherId);
    const homework = Storage.getAll("homeworkStatuses")
      .filter((s) => s.studentId === studentId)
      .map((s) => {
        const hw = homeworks.find((h) => h.id === s.homeworkId);
        if (!hw) return null;
        return { ...hw, status: s.status, statusUpdatedAt: s.updatedAt, className: className(hw.classId) };
      })
      .filter(Boolean)
      .sort(newestFirst("deadline"));

    // Exams of the student's classes + any exam the student has a grade in
    const grades = Storage.getAll("grades").filter((g) => g.studentId === studentId);
    const classIds = classes.map((c) => c.id);
    const exams = Storage.getAll("exams")
      .filter((ex) => (!ex.teacherId || ex.teacherId === teacherId) && (classIds.includes(ex.classId) || grades.some((g) => g.examId === ex.id)))
      .map((ex) => {
        const grade = grades.find((g) => g.examId === ex.id);
        const mark = grade ? Number(grade.mark) : null;
        const percent = mark === null || !ex.totalMarks ? null : Math.round((mark / ex.totalMarks) * 100);
        return {
          ...ex,
          className: className(ex.classId),
          mark,
          percent,
          passed: mark === null ? null : mark >= ex.totalMarks * 0.5 // pass = 50% (spec 8.6)
        };
      })
      .sort(newestFirst("date"));
    const graded = exams.filter((e) => e.percent !== null);
    const averagePercent = graded.length
      ? Math.round(graded.reduce((sum, e) => sum + e.percent, 0) / graded.length)
      : null;

    const notes = Storage.getAll("notes")
      .filter((n) => n.studentId === studentId && (!n.teacherId || n.teacherId === teacherId))
      .map((n) => ({ ...n, className: className(n.classId) }))
      .sort(newestFirst("createdAt"));

    const notifications = Storage.getAll("notifications")
      .filter((n) => n.studentId === studentId && (!n.teacherId || n.teacherId === teacherId))
      .sort(newestFirst("date"));

    return {
      student,
      classes,
      attendance,
      attendanceSummary: { present, absent, late, total: attendance.length, rate },
      homework,
      homeworkSummary: { submitted: homework.filter((h) => h.status === "Submitted").length, total: homework.length },
      exams,
      gradeSummary: { graded: graded.length, averagePercent },
      notes,
      notifications
    };
  }
};


/* ======================================================================
   NOTE SERVICE (minimal part of spec 8.8)
   OWNER: Developer 5. INTEGRATION: replace with js/services/noteService.js.
   ====================================================================== */
const NoteService = {
  // data = { studentId, classId, text }
  create(data) {
    const errors = {};
    const cls = Storage.getById("classes", data.classId);
    if (!Validation.required(data.classId)) errors.classId = "Class is required";
    else if (!cls) errors.classId = "Class not found";
    else if (!(cls.studentIds || []).includes(data.studentId)) errors.classId = "Student is not in this class";
    if (!Validation.required(data.text)) errors.text = "Note text is required";
    if (Object.keys(errors).length) return { ok: false, errors };

    const user = AuthService.getCurrentUser();
    const note = {
      id: IdGenerator.next("NOTE", "notes"),
      studentId: data.studentId,
      teacherId: user.id,
      classId: data.classId,
      text: data.text.trim(),
      createdAt: DateUtil.today()
    };
    Storage.add("notes", note);

    // Automatic notification rule (spec section 12).
    // NotificationService lives in the CORE block at the top of this file.
    NotificationService.create({
      studentId: note.studentId,
      subjectId: cls.subjectId,
      type: "Note",
      relatedId: note.id,
      text: "The teacher added a note about you."
    });
    return { ok: true, data: note };
  }
};

/* ======================================================================
   STUDENT DETAILS PAGE LOGIC (student-details.html?id=ST001)
   - Profile header + 4 summary cards
   - Tabs: Classes, Attendance, Homework, Exams & Grades, Notes, Notifications
   - Add Note modal (#noteModal)
   All data comes from StudentService.getProfile(id).
   ====================================================================== */
const TABS = ["classes", "attendance", "homework", "exams", "notes", "notifications"];

const StudentDetailsPage = {
  studentId: null,
  profile: null,
  activeTab: "classes",

  init() {
    this.studentId = new URLSearchParams(window.location.search).get("id");
    this.profile = this.studentId ? StudentService.getProfile(this.studentId) : null;

    if (!this.profile) {
      document.getElementById("detailsRoot").classList.add("hidden");
      const notFound = document.getElementById("notFound");
      notFound.classList.remove("hidden");
      UI.emptyState("notFound", "Student not found. It may have been deleted.");
      return;
    }

    // Open the tab from the URL hash, e.g. student-details.html?id=ST001#notes
    const hashTab = window.location.hash.replace("#", "");
    if (TABS.includes(hashTab)) this.activeTab = hashTab;

    document.getElementById("detailTabs").addEventListener("click", (e) => {
      const tab = e.target.closest("[data-tab]");
      if (tab) this.switchTab(tab.dataset.tab);
    });

    UI.bindModal("noteModal");
    const form = document.getElementById("noteForm");
    form.addEventListener("submit", (e) => this.handleNoteSubmit(e));
    form.addEventListener("input", (e) => UI.clearFieldError(form, e.target.name));
    form.addEventListener("change", (e) => UI.clearFieldError(form, e.target.name));
    // The Add Note button is rendered inside the Notes panel, so use delegation
    document.getElementById("panel-notes").addEventListener("click", (e) => {
      if (e.target.closest("#addNoteBtn")) this.openNoteForm();
    });

    this.renderAll();
    this.switchTab(this.activeTab);
  },

  // Reload data and redraw everything (used after adding a note)
  refresh() {
    this.profile = StudentService.getProfile(this.studentId);
    this.renderAll();
  },

  renderAll() {
    document.title = `${this.profile.student.fullName} - Student Details`;
    this.renderProfile();
    this.renderStats();
    this.renderClasses();
    this.renderAttendance();
    this.renderHomework();
    this.renderExams();
    this.renderNotes();
    this.renderNotifications();
    this.renderTabCounts();
  },

  switchTab(name) {
    this.activeTab = name;
    document.querySelectorAll("#detailTabs [data-tab]").forEach((tab) => {
      const active = tab.dataset.tab === name;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    TABS.forEach((t) => document.getElementById(`panel-${t}`).classList.toggle("hidden", t !== name));
    history.replaceState(null, "", `${window.location.pathname}${window.location.search}#${name}`);
  },

  renderTabCounts() {
    const p = this.profile;
    const counts = {
      classes: p.classes.length,
      attendance: p.attendance.length,
      homework: p.homework.length,
      exams: p.exams.length,
      notes: p.notes.length,
      notifications: p.notifications.filter((n) => !n.isRead).length // unread only
    };
    TABS.forEach((t) => {
      const el = document.querySelector(`[data-tab="${t}"] .tab-count`);
      if (el) el.textContent = counts[t];
    });
  },

  renderProfile() {
    const s = this.profile.student;
    const e = UI.escape;
    document.getElementById("profileCard").innerHTML = `
      <div class="profile-main">
        <div class="profile-avatar">${e(UI.initials(s.fullName))}</div>
        <div class="profile-info">
          <div class="profile-name-row">
            <h1>${e(s.fullName)}</h1>
            <span class="badge badge-${e(s.status.toLowerCase())}">${e(s.status)}</span>
          </div>
          <p class="profile-sub">${e(s.id)} · ${e(s.academicLevel)}</p>
          <dl class="profile-meta">
            <div><dt>Email</dt><dd><a href="mailto:${e(s.email)}">${e(s.email)}</a></dd></div>
            <div><dt>Phone</dt><dd><a href="tel:${e(s.phone)}">${e(s.phone)}</a></dd></div>
            <div><dt>Birth date</dt><dd>${e(UI.formatDate(s.birthDate))} <span class="muted">(${this.age(s.birthDate)} yrs)</span></dd></div>
          </dl>
        </div>
      </div>
      <div class="profile-actions">
        <!-- Edit happens on students.html, which opens its modal from ?edit= -->
        <a class="btn btn-secondary" href="students.html?edit=${encodeURIComponent(s.id)}">
          <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          Edit Student
        </a>
      </div>`;
  },

  age(birthDate) {
    const [y, m, d] = birthDate.split("-").map(Number);
    const now = new Date();
    let age = now.getFullYear() - y;
    if (now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d)) age--;
    return age;
  },

  renderStats() {
    const p = this.profile;
    const att = p.attendanceSummary;
    const hw = p.homeworkSummary;
    const gr = p.gradeSummary;
    const cards = [
      { label: "Classes", value: p.classes.length, hint: "Enrolled classes" },
      { label: "Attendance", value: att.rate === null ? "—" : `${att.rate}%`, hint: `${att.present} present · ${att.absent} absent · ${att.late} late` },
      { label: "Homework", value: hw.total ? `${hw.submitted}/${hw.total}` : "—", hint: "Submitted" },
      { label: "Average grade", value: gr.averagePercent === null ? "—" : `${gr.averagePercent}%`, hint: `${gr.graded} graded exam${gr.graded === 1 ? "" : "s"}` }
    ];
    document.getElementById("statsGrid").innerHTML = cards.map((c) => `
      <div class="stat-card">
        <span class="stat-label">${UI.escape(c.label)}</span>
        <span class="stat-value">${UI.escape(c.value)}</span>
        <span class="stat-hint">${UI.escape(c.hint)}</span>
      </div>`).join("");
  },

  // Small helper: builds a table or an empty state inside a panel
  renderTable(panelId, headers, rows, emptyMessage, before = "") {
    const panel = document.getElementById(panelId);
    if (!rows.length) {
      panel.innerHTML = `${before}<div id="${panelId}-empty"></div>`;
      UI.emptyState(`${panelId}-empty`, emptyMessage);
      return;
    }
    panel.innerHTML = `${before}
      <div class="table-wrapper">
        <table class="data-table">
          <thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
          <tbody>${rows.join("")}</tbody>
        </table>
      </div>`;
  },

  badgeClass(status) {
    return "badge-" + String(status).toLowerCase().replace(/\s+/g, "-");
  },

  renderClasses() {
    const e = UI.escape;
    const today = DateUtil.today();
    // INTEGRATION: class-details.html is built by the Classes owner (Rima)
    const rows = this.profile.classes.map((c) => `
      <tr>
        <td><a class="link" href="class-details.html?id=${encodeURIComponent(c.id)}">${e(c.name)}</a></td>
        <td>${e(c.subjectName)}</td>
        <td>${c.studentCount}</td>
        <td class="cell-nowrap">${e(UI.formatDate(c.expiryDate))}
          ${DateUtil.isBefore(c.expiryDate, today) ? '<span class="badge badge-danger">Expired</span>' : ""}</td>
      </tr>`);
    this.renderTable("panel-classes", ["Class", "Subject", "Students", "Expiry date"], rows, "This student is not enrolled in any class.");
  },

  renderAttendance() {
    const e = UI.escape;
    const sum = this.profile.attendanceSummary;
    const summary = sum.total ? `
      <div class="summary-chips">
        <span class="badge badge-present">Present: ${sum.present}</span>
        <span class="badge badge-absent">Absent: ${sum.absent}</span>
        <span class="badge badge-late">Late: ${sum.late}</span>
        <span class="badge badge-neutral">Attendance rate: ${sum.rate}%</span>
      </div>` : "";
    const rows = this.profile.attendance.map((a) => `
      <tr>
        <td class="cell-nowrap">${e(UI.formatDate(a.date))}</td>
        <td>${e(a.className)}</td>
        <td><span class="badge ${this.badgeClass(a.status)}">${e(a.status)}</span></td>
      </tr>`);
    this.renderTable("panel-attendance", ["Date", "Class", "Status"], rows, "No attendance records yet.", summary);
  },

  renderHomework() {
    const e = UI.escape;
    const today = DateUtil.today();
    const rows = this.profile.homework.map((h) => {
      const overdue = h.status !== "Submitted" && DateUtil.isBefore(h.deadline, today);
      return `
      <tr>
        <td><strong>${e(h.title)}</strong><div class="muted small">${e(h.description)}</div></td>
        <td>${e(h.className)}</td>
        <td class="cell-nowrap">${e(UI.formatDate(h.deadline))} ${overdue ? '<span class="badge badge-danger">Overdue</span>' : ""}</td>
        <td><span class="badge ${this.badgeClass(h.status)}">${e(h.status)}</span></td>
      </tr>`;
    });
    this.renderTable("panel-homework", ["Homework", "Class", "Deadline", "Status"], rows, "No homework assigned yet.");
  },

  renderExams() {
    const e = UI.escape;
    const rows = this.profile.exams.map((ex) => {
      const result = ex.mark === null
        ? '<span class="badge badge-neutral">Not graded</span>'
        : `<div class="grade-cell">
             <span><strong>${e(ex.mark)}</strong> / ${e(ex.totalMarks)}</span>
             <div class="progress" aria-hidden="true"><div class="progress-bar ${ex.passed ? "" : "progress-fail"}" style="width:${Math.min(ex.percent, 100)}%"></div></div>
             <span class="badge ${ex.passed ? "badge-pass" : "badge-fail"}">${ex.percent}% · ${ex.passed ? "Pass" : "Fail"}</span>
           </div>`;
      return `
      <tr>
        <td><strong>${e(ex.title)}</strong></td>
        <td>${e(ex.className)}</td>
        <td class="cell-nowrap">${e(UI.formatDate(ex.date))}</td>
        <td>${result}</td>
      </tr>`;
    });
    this.renderTable("panel-exams", ["Exam", "Class", "Date", "Result"], rows, "No exams for this student yet.");
  },

  renderNotes() {
    const e = UI.escape;
    const canAdd = this.profile.classes.length > 0; // a note must belong to a class
    const header = `
      <div class="panel-header">
        <p class="muted">Teacher remarks about this student.</p>
        <button type="button" class="btn btn-primary" id="addNoteBtn" ${canAdd ? "" : "disabled title=\"Add the student to a class first\""}>
          <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>Add Note
        </button>
      </div>`;
    const panel = document.getElementById("panel-notes");
    if (!this.profile.notes.length) {
      panel.innerHTML = `${header}<div id="notes-empty"></div>`;
      UI.emptyState("notes-empty", canAdd ? "No notes yet." : "No notes yet. Add the student to a class to write notes.");
      return;
    }
    panel.innerHTML = header + `<div class="note-list">` + this.profile.notes.map((n) => `
      <article class="note-card">
        <p class="note-text">${e(n.text)}</p>
        <div class="note-meta"><span>${e(n.className)}</span><span>${e(UI.formatDate(n.createdAt))}</span></div>
      </article>`).join("") + `</div>`;
  },

  renderNotifications() {
    const e = UI.escape;
    const panel = document.getElementById("panel-notifications");
    const intro = `<p class="muted panel-intro">Records the system generated for this student when the teacher published an academic event.</p>`;
    if (!this.profile.notifications.length) {
      panel.innerHTML = `${intro}<div id="notifications-empty"></div>`;
      UI.emptyState("notifications-empty", "No notifications for this student.");
      return;
    }
    // Display only. Mark-as-read lives on notifications.html (Developer 4).
    panel.innerHTML = intro + `<ul class="notif-list">` + this.profile.notifications.map((n) => `
      <li class="notif-row ${n.isRead ? "" : "is-unread"}">
        <span class="badge badge-warning">${e(n.type)}</span>
        <span class="notif-row-text">${e(n.text)}</span>
        <span class="notif-row-date">${e(UI.formatDate(n.date))}</span>
        <span class="badge ${n.isRead ? "badge-read" : "badge-unread"}">${n.isRead ? "Read" : "Unread"}</span>
      </li>`).join("") + `</ul>`;
  },

  openNoteForm() {
    const form = document.getElementById("noteForm");
    form.reset();
    UI.clearErrors(form);
    const classes = this.profile.classes;
    form.elements.classId.innerHTML =
      (classes.length > 1 ? '<option value="">Select a class</option>' : "") +
      classes.map((c) => `<option value="${UI.escape(c.id)}">${UI.escape(c.name)}</option>`).join("");
    document.getElementById("noteStudentName").textContent = this.profile.student.fullName;
    UI.openModal("noteModal");
  },

  handleNoteSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const result = NoteService.create({
      studentId: this.studentId,
      classId: form.elements.classId.value,
      text: form.elements.text.value
    });
    if (!result.ok) {
      UI.showErrors(form, result.errors);
      return;
    }
    UI.closeModal("noteModal");
    UI.toast("Note added successfully.");
    this.refresh();
    if (window.EvolviaApp) window.EvolviaApp.renderNotifications(AuthService.getCurrentUser()); else HeaderNotifications.render();
  }
};

/* ----------------------------- START ----------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  Storage.initSeed();
  const user = AuthService.requireAuth();
  if (!user) return;
  Layout.init(user, "#students", "Student Details"); // sidebar highlights "Students"
  StudentDetailsPage.init();
});
