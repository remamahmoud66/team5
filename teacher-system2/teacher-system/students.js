/* students.js — Students page (students.html)
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
const DEV_AUTO_LOGIN = true;

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
      link.classList.toggle("active", hash === activeHash);
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
    HeaderNotifications.init();

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

    const subjects = Storage.getAll("subjects");
    const allClasses = Storage.getAll("classes");
    const subjectName = (id) => (subjects.find((s) => s.id === id) || {}).name || "—";
    const className = (id) => (allClasses.find((c) => c.id === id) || {}).name || "Deleted class";
    const newestFirst = (field) => (a, b) => String(b[field]).localeCompare(String(a[field])) || String(b.id).localeCompare(String(a.id));

    // Classes
    const classes = allClasses
      .filter((c) => (c.studentIds || []).includes(studentId))
      .map((c) => ({ ...c, subjectName: subjectName(c.subjectId), studentCount: (c.studentIds || []).length }));

    // Attendance
    const attendance = Storage.getAll("attendance")
      .filter((a) => a.studentId === studentId)
      .map((a) => ({ ...a, className: className(a.classId) }))
      .sort(newestFirst("date"));
    const countStatus = (status) => attendance.filter((a) => a.status === status).length;
    const present = countStatus("Present");
    const absent = countStatus("Absent");
    const late = countStatus("Late");
    // Decision: "Late" counts as attended for the percentage.
    const rate = attendance.length ? Math.round(((present + late) / attendance.length) * 100) : null;

    // Homework (homework + THIS student's status)
    const homeworks = Storage.getAll("homeworks");
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
      .filter((ex) => classIds.includes(ex.classId) || grades.some((g) => g.examId === ex.id))
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
      .filter((n) => n.studentId === studentId)
      .map((n) => ({ ...n, className: className(n.classId) }))
      .sort(newestFirst("createdAt"));

    const notifications = Storage.getAll("notifications")
      .filter((n) => n.studentId === studentId)
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
   STUDENTS PAGE LOGIC (students.html)
   - Table with search + filters (level, status)
   - Add / Edit in one modal (#studentModal)
   - Delete with confirmation + cascade
   - students.html?edit=ST001 opens the edit modal directly
     (used by the "Edit" button on student-details.html)
   ====================================================================== */
const ACADEMIC_LEVELS = [
  "1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade", "6th Grade",
  "7th Grade", "8th Grade", "9th Grade", "10th Grade", "11th Grade", "12th Grade"
];

const StudentsPage = {
  editingId: null, // null = adding, "ST001" = editing
  els: {},

  init() {
    const $ = (id) => document.getElementById(id);
    this.els = {
      search: $("searchInput"),
      level: $("levelFilter"),
      status: $("statusFilter"),
      body: $("studentsTableBody"),
      tableWrap: $("studentsTableWrap"),
      empty: $("studentsEmpty"),
      count: $("studentsCount"),
      addBtn: $("addStudentBtn"),
      form: $("studentForm"),
      title: $("studentModalTitle"),
      submitBtn: $("studentSubmitBtn")
    };

    this.fillLevelOptions();
    UI.bindModal("studentModal");

    this.els.search.addEventListener("input", () => this.render());
    this.els.level.addEventListener("change", () => this.render());
    this.els.status.addEventListener("change", () => this.render());
    this.els.addBtn.addEventListener("click", () => this.openForm());
    this.els.form.addEventListener("submit", (e) => this.handleSubmit(e));
    // Remove a field's error as soon as the user edits it
    this.els.form.addEventListener("input", (e) => UI.clearFieldError(this.els.form, e.target.name));
    this.els.form.addEventListener("change", (e) => UI.clearFieldError(this.els.form, e.target.name));

    // Event delegation: one listener for all Edit/Delete buttons in the table
    this.els.body.addEventListener("click", (e) => {
      const button = e.target.closest("[data-action]");
      if (!button) return;
      if (button.dataset.action === "edit") this.openForm(StudentService.getById(button.dataset.id));
      if (button.dataset.action === "delete") this.handleDelete(button.dataset.id);
    });

    this.render();
    this.openFromUrl();
  },

  fillLevelOptions() {
    const options = ACADEMIC_LEVELS.map((l) => `<option value="${l}">${l}</option>`).join("");
    this.els.level.insertAdjacentHTML("beforeend", options);
    this.els.form.elements.academicLevel.insertAdjacentHTML("beforeend", options);
  },

  getFiltered() {
    const level = this.els.level.value;
    const status = this.els.status.value;
    return StudentService.search(this.els.search.value)
      .filter((s) => !level || s.academicLevel === level)
      .filter((s) => !status || s.status === status);
  },

  render() {
    const list = this.getFiltered();
    const total = StudentService.getAll().length;

    if (!list.length) {
      this.els.body.innerHTML = "";
      this.els.tableWrap.classList.add("hidden");
      this.els.empty.classList.remove("hidden");
      UI.emptyState("studentsEmpty", "No students found.");
      this.els.count.textContent = "";
      return;
    }

    this.els.tableWrap.classList.remove("hidden");
    this.els.empty.classList.add("hidden");
    const e = UI.escape;
    this.els.body.innerHTML = list.map((s) => `
      <tr>
        <td class="cell-id" title="${e(s.id)}">${e(UI.idNumber(s.id))}</td>
        <td>
          <a class="cell-person" href="student-details.html?id=${encodeURIComponent(s.id)}">
            <span class="mini-avatar">${e(UI.initials(s.fullName))}</span>
            <span>${e(s.fullName)}</span>
          </a>
        </td>
        <td>${e(s.academicLevel)}</td>
        <td class="cell-nowrap">${e(s.phone)}</td>
        <td>${e(s.email)}</td>
        <td><span class="badge badge-${e(s.status.toLowerCase())}">${e(s.status)}</span></td>
        <td>
          <div class="row-actions">
            <a class="btn-icon" href="student-details.html?id=${encodeURIComponent(s.id)}" title="View" aria-label="View ${e(s.fullName)}">
              <svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
            </a>
            <button type="button" class="btn-icon" data-action="edit" data-id="${e(s.id)}" title="Edit" aria-label="Edit ${e(s.fullName)}">
              <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            </button>
            <button type="button" class="btn-icon btn-icon-danger" data-action="delete" data-id="${e(s.id)}" title="Delete" aria-label="Delete ${e(s.fullName)}">
              <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
          </div>
        </td>
      </tr>`).join("");

    this.els.count.textContent = `Showing ${list.length} of ${total} student${total === 1 ? "" : "s"}`;
  },

  // student = null -> Add mode ; student object -> Edit mode
  openForm(student = null) {
    const form = this.els.form;
    form.reset();
    UI.clearErrors(form);
    this.editingId = student ? student.id : null;
    this.els.title.textContent = student ? "Edit Student" : "Add Student";
    this.els.submitBtn.textContent = student ? "Save Changes" : "Add Student";
    form.elements.birthDate.max = DateUtil.today();

    if (student) {
      // Older data may hold a level that is not in the list: add it so it is not lost
      const levelSelect = form.elements.academicLevel;
      if (![...levelSelect.options].some((o) => o.value === student.academicLevel)) {
        levelSelect.insertAdjacentHTML("beforeend", `<option value="${UI.escape(student.academicLevel)}">${UI.escape(student.academicLevel)}</option>`);
      }
      ["fullName", "birthDate", "academicLevel", "phone", "email", "status"].forEach((field) => {
        form.elements[field].value = student[field];
      });
    } else {
      form.elements.status.value = "Active";
    }
    UI.openModal("studentModal");
  },

  handleSubmit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(this.els.form));
    const isEdit = Boolean(this.editingId);
    const result = isEdit ? StudentService.update(this.editingId, data) : StudentService.create(data);

    if (!result.ok) {
      UI.showErrors(this.els.form, result.errors);
      if (result.errors._) UI.toast(result.errors._, "error");
      const firstInvalid = this.els.form.querySelector(".input-invalid");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    UI.closeModal("studentModal");
    UI.toast(isEdit ? "Student updated successfully." : "Student added successfully.");
    this.editingId = null;
    this.render();
  },

  async handleDelete(id) {
    const student = StudentService.getById(id);
    if (!student) return;
    const confirmed = await UI.confirm(
      `Are you sure you want to delete "${student.fullName}"? ` +
      "They will be removed from all classes, and their attendance, homework statuses, grades, notes and notifications will be deleted."
    );
    if (!confirmed) return;

    const result = StudentService.delete(id);
    if (!result.ok) return UI.toast(result.errors._, "error");
    UI.toast("Student deleted successfully.");
    this.render();
    HeaderNotifications.render(); // cascade delete removed this student's notifications
  },

  // Supports links like students.html?edit=ST001 and students.html?action=add
  openFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const editId = params.get("edit");
    if (editId) {
      const student = StudentService.getById(editId);
      if (student) this.openForm(student);
      else UI.toast("Student not found.", "error");
    } else if (params.get("action") === "add") {
      this.openForm();
    }
    if (editId || params.has("action")) {
      history.replaceState(null, "", window.location.pathname); // clean the URL
    }
  }
};

/* ----------------------------- START ----------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  Storage.initSeed();
  const user = AuthService.requireAuth();
  if (!user) return;
  Layout.init(user, "#students", "Students");
  StudentsPage.init();
});
