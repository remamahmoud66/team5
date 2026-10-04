/* EVOLVIA shared shell: auth, seed/migration, responsive layout, profile, notifications. */
(function () {
  "use strict";
  const SEED_DATA = {"teachers":[{"id":"T001","fullName":"Ahmad Khaled","birthDate":"1988-04-15","degree":"Bachelor of Computer Science","phone":"0790000000","email":"ahmad@example.com","password":"123456"},{"id":"T002","fullName":"Sara Mohammed","birthDate":"1990-07-22","degree":"Master of Information Technology","phone":"0790000001","email":"sara@example.com","password":"123456"},{"id":"T003","fullName":"Omar Hassan","birthDate":"1985-11-10","degree":"Bachelor of Software Engineering","phone":"0790000002","email":"omar@example.com","password":"123456"},{"id":"T004","fullName":"Lina Ahmad","birthDate":"1992-03-18","degree":"Bachelor of Mathematics","phone":"0790000003","email":"lina@example.com","password":"123456"}],"students":[{"id":"ST001","fullName":"Mohammad Ali","birthDate":"2008-05-12","academicLevel":"10th Grade","phone":"0791111111","email":"mohammad@example.com","status":"Active"},{"id":"ST002","fullName":"Ahmad Omar","birthDate":"2008-08-20","academicLevel":"10th Grade","phone":"0792222222","email":"ahmad.student@example.com","status":"Active"},{"id":"ST003","fullName":"Omar Hassan","birthDate":"2008-03-10","academicLevel":"10th Grade","phone":"0793333333","email":"omar.student@example.com","status":"Active"},{"id":"ST004","fullName":"Yousef Khalil","birthDate":"2008-06-17","academicLevel":"10th Grade","phone":"0794444444","email":"yousef@example.com","status":"Active"},{"id":"ST005","fullName":"Zaid Mohammad","birthDate":"2008-01-25","academicLevel":"10th Grade","phone":"0795555555","email":"zaid@example.com","status":"Active"},{"id":"ST006","fullName":"Khaled Samir","birthDate":"2008-09-03","academicLevel":"10th Grade","phone":"0796666666","email":"khaled@example.com","status":"Active"},{"id":"ST007","fullName":"Rami Nasser","birthDate":"2009-02-14","academicLevel":"9th Grade","phone":"0797777777","email":"rami@example.com","status":"Active"},{"id":"ST008","fullName":"Laith Ahmad","birthDate":"2009-04-09","academicLevel":"9th Grade","phone":"0798888888","email":"laith@example.com","status":"Active"},{"id":"ST009","fullName":"Yazan Ali","birthDate":"2009-07-21","academicLevel":"9th Grade","phone":"0799999999","email":"yazan@example.com","status":"Active"},{"id":"ST010","fullName":"Malak Sami","birthDate":"2008-12-11","academicLevel":"10th Grade","phone":"0781111111","email":"malak@example.com","status":"Active"},{"id":"ST011","fullName":"Dana Khaled","birthDate":"2009-05-19","academicLevel":"9th Grade","phone":"0782222222","email":"dana@example.com","status":"Active"},{"id":"ST012","fullName":"Sara Ali","birthDate":"2008-10-27","academicLevel":"10th Grade","phone":"0783333333","email":"sara.student@example.com","status":"Active"}],"subjects":[{"id":"SUB001","name":"JavaScript","teacherId":"T001","syllabus":"DOM, Events, Functions, LocalStorage and APIs"},{"id":"SUB002","name":"Laravel","teacherId":"T001","syllabus":"Laravel, MVC, Routing, Controllers and APIs"},{"id":"SUB003","name":"Web Design","teacherId":"T002","syllabus":"HTML, CSS, Responsive Design and UI Principles"},{"id":"SUB004","name":"Database","teacherId":"T002","syllabus":"SQL, Tables, Relationships, Queries and Normalization"},{"id":"SUB005","name":"Programming Fundamentals","teacherId":"T003","syllabus":"Variables, Conditions, Loops, Functions and OOP"},{"id":"SUB006","name":"Mathematics","teacherId":"T004","syllabus":"Algebra, Geometry, Equations and Functions"}],"classes":[{"id":"C001","name":"JavaScript - Grade 10 A","subjectId":"SUB001","teacherId":"T001","studentIds":["ST001","ST002","ST003","ST004","ST005","ST006"],"createdAt":"2026-09-28","expiryDate":"2027-01-28"},{"id":"C002","name":"Laravel - Grade 10 A","subjectId":"SUB002","teacherId":"T001","studentIds":["ST001","ST002","ST003","ST004","ST005","ST006"],"createdAt":"2026-09-28","expiryDate":"2027-01-28"},{"id":"C003","name":"Web Design - Grade 10 B","subjectId":"SUB003","teacherId":"T002","studentIds":["ST007","ST008","ST009","ST010","ST011","ST012"],"createdAt":"2026-09-28","expiryDate":"2027-01-28"},{"id":"C004","name":"Database - Grade 10 B","subjectId":"SUB004","teacherId":"T002","studentIds":["ST007","ST008","ST009","ST010","ST011","ST012"],"createdAt":"2026-09-28","expiryDate":"2027-01-28"},{"id":"C005","name":"Programming - Grade 9 A","subjectId":"SUB005","teacherId":"T003","studentIds":["ST007","ST008","ST009","ST010","ST011","ST012"],"createdAt":"2026-09-28","expiryDate":"2027-01-28"},{"id":"C006","name":"Mathematics - Grade 10 A","subjectId":"SUB006","teacherId":"T004","studentIds":["ST001","ST002","ST003","ST004","ST005","ST006"],"createdAt":"2026-09-28","expiryDate":"2027-01-28"}],"materials":[{"id":"MAT001","title":"JavaScript DOM Guide","description":"Introduction to DOM manipulation","type":"PDF","fileUrl":"/files/javascript-dom.pdf","teacherId":"T001","subjectId":"SUB001","classId":"C001","createdAt":"2026-09-28"},{"id":"MAT002","title":"Laravel Guide","description":"Introduction to Laravel and MVC","type":"PDF","fileUrl":"/files/laravel.pdf","teacherId":"T001","subjectId":"SUB002","classId":"C002","createdAt":"2026-09-28"},{"id":"MAT003","title":"HTML & CSS Guide","description":"Web design fundamentals","type":"PDF","fileUrl":"/files/html-css.pdf","teacherId":"T002","subjectId":"SUB003","classId":"C003","createdAt":"2026-09-29"},{"id":"MAT004","title":"SQL Basics","description":"Introduction to relational databases","type":"PDF","fileUrl":"/files/sql-basics.pdf","teacherId":"T002","subjectId":"SUB004","classId":"C004","createdAt":"2026-09-29"},{"id":"MAT005","title":"Programming Fundamentals","description":"Programming basics and problem solving","type":"PDF","fileUrl":"/files/programming.pdf","teacherId":"T003","subjectId":"SUB005","classId":"C005","createdAt":"2026-09-29"},{"id":"MAT006","title":"Algebra Guide","description":"Algebra and equations","type":"PDF","fileUrl":"/files/algebra.pdf","teacherId":"T004","subjectId":"SUB006","classId":"C006","createdAt":"2026-09-29"}],"homeworks":[{"id":"HW001","title":"DOM Assignment","description":"Create a dynamic To-Do List","teacherId":"T001","classId":"C001","createdAt":"2026-09-28","deadline":"2026-10-02"},{"id":"HW002","title":"Laravel CRUD","description":"Create a CRUD application using Laravel","teacherId":"T001","classId":"C002","createdAt":"2026-09-29","deadline":"2026-10-06"},{"id":"HW003","title":"Responsive Website","description":"Create a responsive website using HTML and CSS","teacherId":"T002","classId":"C003","createdAt":"2026-09-29","deadline":"2026-10-05"},{"id":"HW004","title":"SQL Queries","description":"Write SQL queries for a student database","teacherId":"T002","classId":"C004","createdAt":"2026-09-30","deadline":"2026-10-08"},{"id":"HW005","title":"Programming Exercises","description":"Solve programming problems using functions and loops","teacherId":"T003","classId":"C005","createdAt":"2026-09-30","deadline":"2026-10-07"}],"homeworkStatuses":[{"id":"HWS001","homeworkId":"HW001","studentId":"ST001","status":"Submitted","updatedAt":"2026-09-30"},{"id":"HWS002","homeworkId":"HW001","studentId":"ST002","status":"Not Submitted","updatedAt":"2026-09-30"},{"id":"HWS003","homeworkId":"HW001","studentId":"ST003","status":"Submitted","updatedAt":"2026-09-30"},{"id":"HWS004","homeworkId":"HW001","studentId":"ST004","status":"Submitted","updatedAt":"2026-09-30"},{"id":"HWS005","homeworkId":"HW001","studentId":"ST005","status":"Submitted","updatedAt":"2026-09-30"},{"id":"HWS006","homeworkId":"HW001","studentId":"ST006","status":"Not Submitted","updatedAt":"2026-09-30"},{"id":"HWS007","homeworkId":"HW002","studentId":"ST001","status":"Submitted","updatedAt":"2026-09-30"},{"id":"HWS008","homeworkId":"HW002","studentId":"ST002","status":"Submitted","updatedAt":"2026-09-30"},{"id":"HWS009","homeworkId":"HW002","studentId":"ST003","status":"Not Submitted","updatedAt":"2026-09-30"}],"exams":[{"id":"EX001","title":"JavaScript Midterm","description":"DOM, Events and Storage","teacherId":"T001","classId":"C001","subjectId":"SUB001","date":"2026-10-05","totalMarks":100},{"id":"EX002","title":"Laravel Midterm","description":"MVC, Routing and CRUD","teacherId":"T001","classId":"C002","subjectId":"SUB002","date":"2026-10-12","totalMarks":100},{"id":"EX003","title":"Web Design Exam","description":"HTML, CSS and Responsive Design","teacherId":"T002","classId":"C003","subjectId":"SUB003","date":"2026-10-10","totalMarks":100},{"id":"EX004","title":"Database Exam","description":"SQL and Database Relationships","teacherId":"T002","classId":"C004","subjectId":"SUB004","date":"2026-10-15","totalMarks":100},{"id":"EX005","title":"Programming Exam","description":"Variables, Loops, Functions and OOP","teacherId":"T003","classId":"C005","subjectId":"SUB005","date":"2026-10-18","totalMarks":100}],"grades":[{"id":"GR001","examId":"EX001","studentId":"ST001","mark":87},{"id":"GR002","examId":"EX001","studentId":"ST002","mark":92},{"id":"GR003","examId":"EX001","studentId":"ST003","mark":74},{"id":"GR004","examId":"EX001","studentId":"ST004","mark":89},{"id":"GR005","examId":"EX001","studentId":"ST005","mark":78},{"id":"GR006","examId":"EX001","studentId":"ST006","mark":95},{"id":"GR007","examId":"EX002","studentId":"ST001","mark":90},{"id":"GR008","examId":"EX002","studentId":"ST002","mark":84},{"id":"GR009","examId":"EX002","studentId":"ST003","mark":88},{"id":"GR010","examId":"EX003","studentId":"ST007","mark":91},{"id":"GR011","examId":"EX003","studentId":"ST008","mark":86},{"id":"GR012","examId":"EX003","studentId":"ST009","mark":79},{"id":"GR013","examId":"EX003","studentId":"ST010","mark":94},{"id":"GR014","examId":"EX003","studentId":"ST011","mark":82},{"id":"GR015","examId":"EX003","studentId":"ST012","mark":88}],"attendance":[{"id":"ATT001","studentId":"ST001","classId":"C001","subjectId":"SUB001","date":"2026-09-30","status":"Present"},{"id":"ATT002","studentId":"ST002","classId":"C001","subjectId":"SUB001","date":"2026-09-30","status":"Present"},{"id":"ATT003","studentId":"ST003","classId":"C001","subjectId":"SUB001","date":"2026-09-30","status":"Absent"},{"id":"ATT004","studentId":"ST004","classId":"C001","subjectId":"SUB001","date":"2026-09-30","status":"Present"},{"id":"ATT005","studentId":"ST005","classId":"C001","subjectId":"SUB001","date":"2026-09-30","status":"Present"},{"id":"ATT006","studentId":"ST006","classId":"C001","subjectId":"SUB001","date":"2026-09-30","status":"Present"},{"id":"ATT007","studentId":"ST001","classId":"C002","subjectId":"SUB002","date":"2026-09-30","status":"Present"},{"id":"ATT008","studentId":"ST002","classId":"C002","subjectId":"SUB002","date":"2026-09-30","status":"Absent"},{"id":"ATT009","studentId":"ST003","classId":"C002","subjectId":"SUB002","date":"2026-09-30","status":"Present"},{"id":"ATT010","studentId":"ST004","classId":"C002","subjectId":"SUB002","date":"2026-09-30","status":"Present"},{"id":"ATT011","studentId":"ST005","classId":"C002","subjectId":"SUB002","date":"2026-09-30","status":"Present"},{"id":"ATT012","studentId":"ST006","classId":"C002","subjectId":"SUB002","date":"2026-09-30","status":"Present"},{"id":"ATT013","studentId":"ST007","classId":"C003","subjectId":"SUB003","date":"2026-09-30","status":"Present"},{"id":"ATT014","studentId":"ST008","classId":"C003","subjectId":"SUB003","date":"2026-09-30","status":"Present"},{"id":"ATT015","studentId":"ST009","classId":"C003","subjectId":"SUB003","date":"2026-09-30","status":"Absent"},{"id":"ATT016","studentId":"ST010","classId":"C003","subjectId":"SUB003","date":"2026-09-30","status":"Present"},{"id":"ATT017","studentId":"ST011","classId":"C003","subjectId":"SUB003","date":"2026-09-30","status":"Present"},{"id":"ATT018","studentId":"ST012","classId":"C003","subjectId":"SUB003","date":"2026-09-30","status":"Present"}],"notes":[{"id":"NOTE001","studentId":"ST001","teacherId":"T001","classId":"C001","text":"Excellent participation in today's lesson.","createdAt":"2026-09-30"},{"id":"NOTE002","studentId":"ST003","teacherId":"T001","classId":"C001","text":"Needs to participate more during class.","createdAt":"2026-09-30"},{"id":"NOTE003","studentId":"ST006","teacherId":"T001","classId":"C002","text":"Very good performance in Laravel.","createdAt":"2026-09-30"},{"id":"NOTE004","studentId":"ST009","teacherId":"T002","classId":"C003","text":"Needs improvement in CSS assignments.","createdAt":"2026-09-30"}],"notifications":[{"id":"NOT001","studentId":"ST001","teacherId":"T001","subjectId":"SUB001","type":"Homework","relatedId":"HW001","text":"New JavaScript homework has been assigned.","date":"2026-09-28","isRead":false},{"id":"NOT002","studentId":"ST002","teacherId":"T001","subjectId":"SUB002","type":"Exam","relatedId":"EX002","text":"Laravel midterm exam has been scheduled.","date":"2026-09-29","isRead":false},{"id":"NOT003","studentId":"ST003","teacherId":"T001","subjectId":"SUB001","type":"Homework","relatedId":"HW001","text":"Your JavaScript homework deadline is approaching.","date":"2026-09-30","isRead":true},{"id":"NOT004","studentId":"ST007","teacherId":"T002","subjectId":"SUB003","type":"Material","relatedId":"MAT003","text":"New Web Design material has been uploaded.","date":"2026-09-30","isRead":false},{"id":"NOT005","studentId":"ST010","teacherId":"T002","subjectId":"SUB004","type":"Exam","relatedId":"EX004","text":"Database exam has been scheduled.","date":"2026-09-30","isRead":false}]};
  const KEYS = Object.keys(SEED_DATA);
  const pageName = (window.location.pathname.replace(/\\/g, "/").split("/").pop() || "index.html");
  const isProtected = !["login.html", "register.html", "index.html"].includes(pageName);
  const safeParse = (value, fallback) => { try { return value ? JSON.parse(value) : fallback; } catch { return fallback; } };
  const read = (key, fallback = []) => {
    const data = safeParse(localStorage.getItem(key), fallback);
    return Array.isArray(fallback) ? (Array.isArray(data) ? data : fallback) : (data ?? fallback);
  };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; };
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, function(ch) {
    return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[ch];
  });
  const initials = (name) => String(name || "?").trim().split(/\s+/).filter(Boolean).slice(0,2).map(function(p) { return p[0].toUpperCase(); }).join("") || "?";

  function seed() {
    KEYS.forEach(function(key) { if (localStorage.getItem(key) === null) write(key, SEED_DATA[key]); });
    migrate();
    syncLegacyEduKeys();
  }

  function migrate() {
    const teachers = read("teachers").map(function(t) { return Object.assign({}, t, {fullName: t.fullName || t.name || "Teacher", email: String(t.email || "").toLowerCase()}); });
    const students = read("students").map(function(s) { return Object.assign({}, s, {fullName: s.fullName || s.name || [s.firstName, s.lastName].filter(Boolean).join(" ") || "Student", status: s.status || "Active"}); });
    const subjects = read("subjects").map(function(s) { return Object.assign({}, s, {name: s.name || s.title || "Subject"}); });
    const subjectByName = new Map(subjects.map(function(s) { return [String(s.name).trim().toLowerCase(), s.id]; }));
    const classes = read("classes").map(function(c) {
      let subjectId = c.subjectId;
      if (!subjectId && c.subject) subjectId = subjectByName.get(String(c.subject).trim().toLowerCase()) || c.subject;
      return Object.assign({}, c, {subjectId: subjectId || null, studentIds: Array.isArray(c.studentIds) ? c.studentIds : [], teacherId: c.teacherId || null});
    });
    const classByName = new Map(classes.map(function(c) { return [String(c.name).trim().toLowerCase(), c.id]; }));
    const materials = read("materials").map(function(m) { return Object.assign({}, m, {classId: m.classId || classByName.get(String(m.className || "").trim().toLowerCase()) || null, createdAt: m.createdAt || today()}); });
    const homeworks = read("homeworks").map(function(h) { return Object.assign({}, h, {deadline: h.deadline || h.dueDate || null, teacherId: h.teacherId || null, isHidden: Boolean(h.isHidden)}); });
    const statuses = read("homeworkStatuses").map(function(s) { return Object.assign({}, s, {status: s.status === "Submitted" ? "Submitted" : "Not Submitted", updatedAt: s.updatedAt || s.submittedAt || today()}); });
    const exams = read("exams").map(function(e) {
      const gradeMap = e.grades && !Array.isArray(e.grades) ? e.grades : null;
      return Object.assign({}, e, {teacherId: e.teacherId || null, subjectId: e.subjectId || ((classes.find(function(c) { return c.id === e.classId; }) || {}).subjectId || null), gradeMap: e.gradeMap || gradeMap || {}});
    });
    write("teachers", teachers);
    write("students", students);
    write("subjects", subjects);
    write("classes", classes);
    write("materials", materials);
    write("homeworks", homeworks);
    write("homeworkStatuses", statuses);
    write("exams", exams);
    write("grades", read("grades"));
    write("attendance", read("attendance"));
    write("notes", read("notes"));
    write("notifications", read("notifications").map(function(n) { return Object.assign({}, n, {isRead: Boolean(n.isRead), date: n.date || today()}); }));
  }

  function syncLegacyEduKeys() {
    const classes = read("classes"), students = read("students"), homeworks = read("homeworks"), exams = read("exams"), statuses = read("homeworkStatuses");
    write("edu_classes", classes.map(function(c) { return Object.assign({}, c, {subject: c.subject || c.subjectId}); }));
    const byClass = Object.fromEntries(classes.map(function(c) { return [c.id, students.filter(function(s) { return (c.studentIds || []).includes(s.id); }).map(function(s) { return Object.assign({}, s, {name:s.fullName}); })]; }));
    write("edu_students", byClass);
    write("edu_homeworks", homeworks);
    write("edu_exams", exams.map(function(e) { return Object.assign({}, e, {grades:e.gradeMap || {}}); }));
    write("edu_homework_statuses", statuses);
  }

  function getUser() {
    return safeParse(sessionStorage.getItem("currentUser") || sessionStorage.getItem("currentTeacher") || localStorage.getItem("currentUser") || localStorage.getItem("currentTeacher"), null);
  }

  function syncUser(user, storage) {
    if (!user) return;
    storage = storage || localStorage;
    const json = JSON.stringify(user);
    storage.setItem("currentUser", json);
    storage.setItem("currentTeacher", json);
    sessionStorage.setItem("currentUser", json);
    sessionStorage.setItem("currentTeacher", json);
  }

  function logout() {
    ["currentUser", "currentTeacher"].forEach(function(k) { localStorage.removeItem(k); sessionStorage.removeItem(k); });
    window.location.href = "./login.html";
  }

  function ensureNotification(message, type, relatedId, studentId) {
    const user = getUser();
    if (!user) return null;
    const options = message && typeof message === "object" ? message : {
      text: message,
      type: type,
      relatedId: relatedId,
      studentId: studentId
    };
    const text = String(options.text || "System notification");
    const notificationDate = options.date || today();
    const ownerId = options.teacherId || user.id;
    const list = read("notifications");
    const duplicate = list.find(function(n) {
      return n.teacherId === ownerId &&
        n.relatedId === (options.relatedId || null) &&
        n.type === (options.type || "System") &&
        n.text === text &&
        n.date === notificationDate;
    });
    if (duplicate) return duplicate;
    const nums = list.map(function(n) { return Number(String(n.id || "").replace(/\D/g, "")) || 0; });
    const id = options.id || ("NOT" + String(Math.max.apply(null, [0].concat(nums)) + 1).padStart(3, "0"));
    const item = {
      id: id,
      studentId: options.studentId || null,
      teacherId: ownerId,
      subjectId: options.subjectId || null,
      type: options.type || "System",
      relatedId: options.relatedId || null,
      text: text,
      date: notificationDate,
      isRead: Boolean(options.isRead)
    };
    list.unshift(item);
    write("notifications", list);
    return item;
  }

  function createShell() {
    if (!isProtected) return;
    const user = getUser();
    if (!user) { window.location.href = "./login.html"; return; }
    document.body.classList.add("evolvia-app");
    const header = document.querySelector(".header, .top-header");
    const sidebar = document.querySelector(".sidebar");
    if (header && sidebar && !document.getElementById("mobileMenuBtn")) {
      const button = document.createElement("button");
      button.type = "button";
      button.id = "mobileMenuBtn";
      button.className = "mobile-menu-btn";
      button.setAttribute("aria-label", "Open navigation");
      button.innerHTML = "<span></span><span></span><span></span>";
      header.insertBefore(button, header.firstChild);
      const overlay = document.createElement("div");
      overlay.className = "sidebar-overlay";
      overlay.id = "sidebarOverlay";
      document.body.appendChild(overlay);
      function close() { document.body.classList.remove("sidebar-open"); button.setAttribute("aria-expanded", "false"); }
      button.addEventListener("click", function() { const open = document.body.classList.toggle("sidebar-open"); button.setAttribute("aria-expanded", String(open)); });
      overlay.addEventListener("click", close);
      sidebar.querySelectorAll("a").forEach(function(a) { a.addEventListener("click", close); });
      window.addEventListener("resize", function() { if (window.innerWidth > 900) close(); });
    }
    document.querySelectorAll(".user-profile").forEach(function(link) { link.setAttribute("href", "./profile.html"); });
    document.querySelectorAll(".user-profile .user-name, #profileName, [data-user-name]").forEach(function(el) { el.textContent = user.fullName || "Teacher"; });
    document.querySelectorAll(".user-profile .avatar, #avatar, [data-user-avatar]").forEach(function(el) { el.textContent = initials(user.fullName); el.setAttribute("aria-label", user.fullName || "Teacher"); });
    document.querySelectorAll(".user-role, [data-user-role]").forEach(function(el) { el.textContent = "Teacher"; });
    document.querySelectorAll(".logout-btn").forEach(function(btn) { btn.setAttribute("href", "./login.html"); if (!btn.dataset.boundLogout) { btn.dataset.boundLogout = "1"; btn.addEventListener("click", function(e) { e.preventDefault(); logout(); }); } });
    document.querySelectorAll('a[href="#dashboard"]').forEach(function(a) { a.setAttribute("href", "./dashboard.html"); });
    document.querySelectorAll('a[href="#notifications"]').forEach(function(a) { a.setAttribute("href", "./notifications.html"); });
    const current = pageName.replace(".html", "");
    const routeMap = { "exam-marks": "exam-marks", "student-details": "students", "class-details": "classes", "homework-status": "homework", "materials": "classes", "profile": "" };
    const routeName = Object.prototype.hasOwnProperty.call(routeMap, current) ? routeMap[current] : current;
    document.querySelectorAll(".sidebar .nav-link").forEach(function(link) { const target = (link.getAttribute("href") || "").split("/").pop().replace(".html", ""); link.classList.toggle("active", target === routeName); });
    initNotifications(user);
  }

  function initNotifications(user) {
    const actions = document.querySelector(".header-actions");
    if (!actions) return;
    let wrapper = actions.querySelector(".notification-wrapper");
    let button = actions.querySelector("#notification-bell-btn, .notification-btn, .header-icon-bell");
    if (!wrapper) {
      wrapper = document.createElement("div");
      wrapper.className = "notification-wrapper";
      if (button) { button.replaceWith(wrapper); wrapper.appendChild(button); }
      else {
        button = document.createElement("button"); button.type="button"; button.className="notification-btn"; button.setAttribute("aria-label","Notifications");
        button.innerHTML='<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22zm7-5v-1l-2-2v-4a5 5 0 0 0-4-4.9V4a1 1 0 1 0-2 0v1.1A5 5 0 0 0 7 10v4l-2 2v1h14z"/></svg>';
        wrapper.appendChild(button);
      }
      actions.insertBefore(wrapper, actions.firstChild);
    }
    button = wrapper.querySelector("button") || button;
    button.id = "notification-bell-btn";
    let badge = wrapper.querySelector("#notification-badge");
    if (!badge) { badge = document.createElement("span"); badge.id="notification-badge"; badge.className="notification-badge hidden"; wrapper.appendChild(badge); }
    let dropdown = wrapper.querySelector("#notification-dropdown");
    if (!dropdown) {
      dropdown = document.createElement("div"); dropdown.id="notification-dropdown"; dropdown.className="notification-dropdown hidden";
      dropdown.innerHTML='<div class="dropdown-header"><div><h3>Notifications</h3><span class="dropdown-count">Your latest updates</span></div><button type="button" id="mark-all-read-btn" class="btn-text">Mark all as read</button></div><div id="notification-list" class="notification-list"></div><div class="dropdown-footer"><a href="./notifications.html">View all notifications</a></div>';
      wrapper.appendChild(dropdown);
    }
    if (button.dataset.bound) { renderNotifications(user); return; }
    button.dataset.bound="1";
    button.setAttribute("aria-haspopup", "true");
    button.addEventListener("click", function(e) { e.stopPropagation(); dropdown.classList.toggle("hidden"); button.setAttribute("aria-expanded", String(!dropdown.classList.contains("hidden"))); renderNotifications(user); });
    dropdown.addEventListener("click", function(e) {
      const mark = e.target.closest("[data-notification-id]");
      if (!mark) return;
      const list = read("notifications");
      const n = list.find(function(x) { return x.id === mark.dataset.notificationId; });
      if (n) { n.isRead = true; write("notifications", list); renderNotifications(user); }
    });
    dropdown.querySelector("#mark-all-read-btn").addEventListener("click", function(e) {
      e.stopPropagation();
      const list = read("notifications");
      const mine = new Set(list.filter(function(n) { return n.teacherId === user.id; }).map(function(n) { return n.id; }));
      write("notifications", list.map(function(n) { return mine.has(n.id) ? Object.assign({}, n, {isRead:true}) : n; }));
      renderNotifications(user);
    });
    document.addEventListener("click", function(e) { if (!wrapper.contains(e.target)) dropdown.classList.add("hidden"); });
    renderNotifications(user);
  }

  function renderNotifications(user) {
    const listEl = document.getElementById("notification-list");
    const badge = document.getElementById("notification-badge");
    if (!listEl || !badge) return;
    const all = read("notifications").filter(function(n) { return n.teacherId === user.id; }).sort(function(a,b) { return String(b.date).localeCompare(String(a.date)) || String(b.id).localeCompare(String(a.id)); });
    const unread = all.filter(function(n) { return !n.isRead; }).length;
    badge.textContent = unread > 99 ? "99+" : String(unread);
    badge.classList.toggle("hidden", unread === 0);
    if (!all.length) { listEl.innerHTML = '<div class="notif-empty">No notifications yet.</div>'; return; }
    const students = read("students");
    listEl.innerHTML = all.slice(0,8).map(function(n) {
      const student = students.find(function(s) { return s.id === n.studentId; });
      let target = "./notifications.html";
      if (n.studentId) target = "./student-details.html?id=" + encodeURIComponent(n.studentId) + "#notifications";
      else if (n.type === "Homework") target = "./homework.html";
      else if (n.type === "Exam") target = "./exams.html";
      else if (n.type === "Material") target = "./materials.html";
      else if (n.type === "Grade") target = "./exam-marks.html";
      else if (n.type === "Attendance") target = "./attendance.html";
      else if (n.type === "Note") target = "./students.html";
      return '<a class="notif-item ' + (n.isRead ? '' : 'unread') + '" data-notification-id="' + escapeHtml(n.id) + '" href="' + target + '"><span class="notif-icon-box"><svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22a2.5 2.5 0 0 0 2-2h-4a2.5 2.5 0 0 0 2 2zm6-6v-5a6 6 0 0 0-12 0v5l-2 2v1h16v-1z"/></svg></span><span class="notif-content"><strong>' + escapeHtml(student ? student.fullName : n.type) + '</strong><span class="notif-text">' + escapeHtml(n.text) + '</span><small>' + escapeHtml(n.date) + '</small></span></a>';
    }).join("");
  }

  window.EvolviaApp = {read:read, write:write, getUser:getUser, syncUser:syncUser, logout:logout, ensureNotification:ensureNotification, renderNotifications:renderNotifications, seed:seed, migrate:migrate, syncLegacyEduKeys:syncLegacyEduKeys, get seedData(){ return SEED_DATA; }};
  document.addEventListener("DOMContentLoaded", function() { seed(); createShell(); });
})();
