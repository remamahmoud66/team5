document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // INITIAL SEED DATA & LOCAL STORAGE
  // ==========================================
  const initialClasses = [
    { id: "c1", name: "JavaScript - Grade 10 A", subject: "JavaScript" },
    { id: "c2", name: "Python - Grade 11 B", subject: "Python" },
    {
      id: "c3",
      name: "Web Development - Grade 12 A",
      subject: "Web Development",
    },
  ];

  const initialStudents = {
    c1: [
      { id: "STU001", name: "Alex Johnson" },
      { id: "STU002", name: "Maria Garcia" },
      { id: "STU003", name: "Liam Smith" },
    ],
    c2: [
      { id: "STU004", name: "Sophia Chen" },
      { id: "STU005", name: "Noah Brown" },
    ],
    c3: [
      { id: "STU006", name: "Emma Davis" },
      { id: "STU007", name: "Oliver Wilson" },
    ],
  };

  const initialExams = [
    {
      id: "EX001",
      title: "JavaScript Midterm",
      description: "DOM, Events and Storage",
      classId: "c1",
      date: "2026-10-05",
      totalMarks: 100,
      grades: { STU001: 95, STU002: 88, STU003: 52 },
      isHidden: false,
    },
  ];

  let classes =
    JSON.parse(localStorage.getItem("edu_classes")) || initialClasses;
  let students =
    JSON.parse(localStorage.getItem("edu_students")) || initialStudents;
  let exams = JSON.parse(localStorage.getItem("edu_exams")) || initialExams;

  const saveExams = () =>
    localStorage.setItem("edu_exams", JSON.stringify(exams));

  // ==========================================
  // DOM ELEMENTS
  // ==========================================
  const examsTableBody = document.getElementById("exams-table-body");
  const emptyStateContainer = document.getElementById("empty-state-container");
  const searchInput = document.getElementById("exam-search");
  const filterClassSelect = document.getElementById("filter-class");
  const activeExamsCountEl = document.getElementById("active-exams-count");

  // Stats Elements
  const statBestClassEl = document.getElementById("stat-best-class");
  const statBestClassNameEl = document.getElementById("stat-best-class-name");
  const statTopStudentsEl = document.getElementById("stat-top-students");
  const statLowStudentsEl = document.getElementById("stat-low-students");

  // Modal Elements
  const examModal = document.getElementById("exam-modal");
  const btnOpenCreateModal = document.getElementById("btn-open-create-modal");
  const examForm = document.getElementById("exam-form");
  const modalTitle = document.getElementById("modal-title");
  const examIdInput = document.getElementById("exam-id");
  const examClassSelect = document.getElementById("exam-class");
  const examTitleInput = document.getElementById("exam-title");
  const examDescInput = document.getElementById("exam-description");
  const examDateInput = document.getElementById("exam-date");
  const examMarksInput = document.getElementById("exam-total-marks");

  // Grades Modal
  const gradesModal = document.getElementById("grades-modal");
  const gradesForm = document.getElementById("grades-form");
  const gradesModalTitle = document.getElementById("grades-modal-title");
  const gradesModalSubtitle = document.getElementById("grades-modal-subtitle");
  const maxMarksLabel = document.getElementById("max-marks-label");
  const gradesTableBody = document.getElementById("grades-table-body");

  let currentGradeExamId = null;

  // ==========================================
  // CALCULATION & ANALYTICS HELPERS
  // ==========================================
  const calculateAverage = (grades) => {
    const values = Object.values(grades || {})
      .map(Number)
      .filter((v) => !isNaN(v));
    if (!values.length) return null;
    const sum = values.reduce((acc, curr) => acc + curr, 0);
    return Math.round(sum / values.length);
  };

  const updateDashboardStats = () => {
    if (!exams || exams.length === 0) return;

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const getExamMonthKey = (dateStr) => {
      if (!dateStr) return null;
      const date = new Date(dateStr);
      return isNaN(date.getTime())
        ? null
        : `${date.getFullYear()}-${date.getMonth()}`;
    };

    const currentDate = new Date();
    const currentMonthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;

    const availableMonthKeys = exams
      .map((e) => getExamMonthKey(e.date))
      .filter(Boolean)
      .sort()
      .reverse();

    let targetMonthKey = currentMonthKey;
    if (
      !availableMonthKeys.includes(currentMonthKey) &&
      availableMonthKeys.length > 0
    ) {
      targetMonthKey = availableMonthKeys[0];
    }

    const [targetYear, targetMonthIdx] = targetMonthKey.split("-").map(Number);
    const targetMonthName = `${monthNames[targetMonthIdx]} ${targetYear}`;

    const monthExams = exams.filter(
      (e) => getExamMonthKey(e.date) === targetMonthKey,
    );

    const classAverages = {};

    classes.forEach((cls) => {
      const classExams = monthExams.filter(
        (e) => e.classId === cls.id && !e.isHidden && !e.isDeleted,
      );
      const classStudentsList = students[cls.id] || [];
      const totalStudentsCount = classStudentsList.length;

      if (totalStudentsCount === 0 || classExams.length === 0) return;

      let totalClassMarksEarned = 0.0;
      let totalClassMaxPossible = 0.0;

      classExams.forEach((exam) => {
        if (!exam.totalMarks || exam.totalMarks <= 0) return;

        const examMaxMarks = parseFloat(exam.totalMarks);

        if (exam.grades) {
          Object.values(exam.grades).forEach((mark) => {
            const earned = parseFloat(mark);
            if (!isNaN(earned)) {
              totalClassMarksEarned += earned;
            }
          });
        }

        totalClassMaxPossible += examMaxMarks * totalStudentsCount;
      });

      if (totalClassMaxPossible > 0) {
        const classAveragePercentage = Math.round(
          (totalClassMarksEarned / totalClassMaxPossible) * 100,
        );
        classAverages[cls.id] = {
          name: cls.name,
          avgPercentage: classAveragePercentage,
        };
      }
    });

    let bestClass = null;
    Object.values(classAverages).forEach((item) => {
      if (!bestClass || item.avgPercentage > bestClass.avgPercentage) {
        bestClass = item;
      }
    });

    if (bestClass) {
      if (statBestClassEl)
        statBestClassEl.textContent = `${bestClass.avgPercentage}%`;
      if (statBestClassNameEl)
        statBestClassNameEl.textContent = `${bestClass.name} (${targetMonthName})`;
    } else {
      if (statBestClassEl) statBestClassEl.textContent = "N/A";
      if (statBestClassNameEl)
        statBestClassNameEl.textContent = `No graded exams in ${targetMonthName}`;
    }

    const studentAggregates = {};

    exams.forEach((exam) => {
      if (exam.isHidden || exam.isDeleted || !exam.grades || !exam.totalMarks)
        return;

      const classStudents = students[exam.classId] || [];
      const totalPossibleMarks = parseFloat(exam.totalMarks);

      Object.entries(exam.grades).forEach(([stuId, mark]) => {
        if (mark === null || mark === undefined || mark === "") return;

        const earnedMark = parseFloat(mark);
        if (isNaN(earnedMark)) return;

        const compositeKey = `${exam.classId}_${stuId}`;
        const studentObj = classStudents.find((s) => s.id === stuId);
        const studentName = studentObj ? studentObj.name : stuId;

        if (!studentAggregates[compositeKey]) {
          studentAggregates[compositeKey] = {
            name: studentName,
            totalEarned: 0.0,
            totalPossible: 0.0,
          };
        }

        studentAggregates[compositeKey].totalEarned += earnedMark;
        studentAggregates[compositeKey].totalPossible += totalPossibleMarks;
      });
    });

    const smartStudents = [];
    const weakStudents = [];

    Object.values(studentAggregates).forEach((stu) => {
      if (stu.totalPossible > 0) {
        const overallScore = parseFloat(
          ((stu.totalEarned / stu.totalPossible) * 100).toFixed(1),
        );

        if (overallScore > 95.0) {
          smartStudents.push({ name: stu.name, score: overallScore });
        } else if (overallScore < 50.0) {
          weakStudents.push({ name: stu.name, score: overallScore });
        }
      }
    });

    if (statTopStudentsEl) {
      statTopStudentsEl.innerHTML = "";
      if (smartStudents.length === 0) {
        statTopStudentsEl.innerHTML =
          '<div class="text-muted small">No students (&gt;95%)</div>';
      } else {
        smartStudents.forEach((stu) => {
          const item = document.createElement("div");
          item.className = "stats-student-item";
          item.innerHTML = `
            <span><strong>${stu.name}</strong></span>
            <span class="badge badge-info">${stu.score}%</span>
          `;
          statTopStudentsEl.appendChild(item);
        });
      }
    }

    if (statLowStudentsEl) {
      statLowStudentsEl.innerHTML = "";
      if (weakStudents.length === 0) {
        statLowStudentsEl.innerHTML =
          '<div class="text-muted small">No students (&lt;50%)</div>';
      } else {
        weakStudents.forEach((stu) => {
          const item = document.createElement("div");
          item.className = "stats-student-item";
          item.innerHTML = `
            <span><strong>${stu.name}</strong></span>
            <span class="badge badge-danger">${stu.score}%</span>
          `;
          statLowStudentsEl.appendChild(item);
        });
      }
    }
  };

  const populateClassDropdowns = () => {
    if (!filterClassSelect || !examClassSelect) return;

    filterClassSelect.innerHTML = '<option value="">All Classes</option>';
    examClassSelect.innerHTML = '<option value="">Select a Class</option>';

    classes.forEach((c) => {
      const opt1 = document.createElement("option");
      opt1.value = c.id;
      opt1.textContent = c.name;
      filterClassSelect.appendChild(opt1);

      const opt2 = document.createElement("option");
      opt2.value = c.id;
      opt2.textContent = c.name;
      examClassSelect.appendChild(opt2);
    });
  };

  // ==========================================
  // RENDER TABLE & STATS
  // ==========================================
  const renderExams = () => {
    const searchTerm = searchInput
      ? searchInput.value.toLowerCase().trim()
      : "";
    const selectedClass = filterClassSelect ? filterClassSelect.value : "";

    const filtered = exams.filter((exam) => {
      if (exam.isHidden) return false;

      const cls = classes.find((c) => c.id === exam.classId);
      const className = cls ? cls.name.toLowerCase() : "";
      const matchesSearch =
        exam.title.toLowerCase().includes(searchTerm) ||
        className.includes(searchTerm);
      const matchesClass =
        selectedClass === "" || exam.classId === selectedClass;
      return matchesSearch && matchesClass;
    });

    if (examsTableBody) {
      examsTableBody.innerHTML = "";

      if (filtered.length === 0) {
        emptyStateContainer.innerHTML =
          '<div class="p-4 text-center text-muted">No exams found.</div>';
      } else {
        emptyStateContainer.innerHTML = "";
        filtered.forEach((exam, index) => {
          const cls = classes.find((c) => c.id === exam.classId) || {
            name: "N/A",
            subject: "N/A",
          };
          const avgMarks = calculateAverage(exam.grades);

          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td><strong>${index + 1}</strong></td>
            <td>
              <div class="exam-title-cell">
                <strong>${exam.title}</strong>
                <small>${exam.description || "No description"}</small>
              </div>
            </td>
            <td>${cls.name}</td>
            <td>${cls.subject}</td>
            <td>${exam.date}</td>
            <td>${avgMarks !== null ? `${avgMarks} /${exam.totalMarks}` : "N/A"}</td>
            <td class="table-actions">
              <button class="btn-icon btn-info btn-enter-grades" data-id="${exam.id}" title="Enter Grades">✓</button>
              <button class="btn-icon btn-secondary btn-edit-exam" data-id="${exam.id}" title="Edit Exam">✎</button>
              <button class="btn-icon btn-danger btn-delete-exam" data-id="${exam.id}" title="Delete Exam">×</button>
            </td>
          `;
          examsTableBody.appendChild(tr);
        });
      }
    }

    if (activeExamsCountEl) {
      activeExamsCountEl.textContent = exams.filter((e) => !e.isHidden).length;
    }

    updateDashboardStats();
  };

  // ==========================================
  // MODAL CONTROLS & EVENT HANDLERS
  // ==========================================
  const openModal = (modal) => modal && modal.classList.remove("hidden");
  const closeModal = (modal) => modal && modal.classList.add("hidden");

  document.querySelectorAll(".closeModal").forEach((btn) => {
    btn.addEventListener("click", () => {
      closeModal(examModal);
      closeModal(gradesModal);
    });
  });

  if (btnOpenCreateModal) {
    btnOpenCreateModal.addEventListener("click", () => {
      examForm.reset();
      examIdInput.value = "";
      modalTitle.textContent = "Create New Exam";
      openModal(examModal);
    });
  }

  if (examForm) {
    examForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const id = examIdInput.value;
      const title = examTitleInput.value.trim();
      const classId = examClassSelect.value;
      const description = examDescInput.value.trim();
      const date = examDateInput.value;
      const totalMarks = parseInt(examMarksInput.value, 10);

      if (id) {
        const index = exams.findIndex((ex) => ex.id === id);
        if (index !== -1) {
          exams[index] = {
            ...exams[index],
            title,
            classId,
            description,
            date,
            totalMarks,
          };
        }
      } else {
        const newId = `EX${String(exams.length + 1).padStart(3, "0")}`;
        exams.push({
          id: newId,
          title,
          classId,
          description,
          date,
          totalMarks,
          grades: {},
          isHidden: false,
        });
      }

      saveExams();
      renderExams();

      // Trigger notification check immediately when new exam is created/edited
      renderHeaderNotifications();

      closeModal(examModal);
    });
  }

  if (examsTableBody) {
    examsTableBody.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      const examId = btn.getAttribute("data-id");

      if (btn.classList.contains("btn-delete-exam")) {
        const exam = exams.find((ex) => ex.id === examId);
        if (exam) {
          exam.isHidden = true;
          saveExams();
          renderExams();
          renderHeaderNotifications();
        }
      }

      if (btn.classList.contains("btn-edit-exam")) {
        const exam = exams.find((ex) => ex.id === examId);
        if (!exam) return;

        examIdInput.value = exam.id;
        examTitleInput.value = exam.title;
        examClassSelect.value = exam.classId;
        examDescInput.value = exam.description;
        examDateInput.value = exam.date;
        examMarksInput.value = exam.totalMarks;

        modalTitle.textContent = "Edit Exam";
        openModal(examModal);
      }

      if (btn.classList.contains("btn-enter-grades")) {
        const exam = exams.find((ex) => ex.id === examId);
        if (!exam) return;

        currentGradeExamId = exam.id;
        const cls = classes.find((c) => c.id === exam.classId);
        const classStudents = students[exam.classId] || [];

        gradesModalTitle.textContent = `Grades: ${exam.title}`;
        gradesModalSubtitle.textContent = cls ? cls.name : "";
        maxMarksLabel.textContent = exam.totalMarks;

        gradesTableBody.innerHTML = "";

        if (classStudents.length === 0) {
          gradesTableBody.innerHTML =
            '<tr><td colspan="3" class="text-center">No students found in this class.</td></tr>';
        } else {
          classStudents.forEach((stu) => {
            const currentMark =
              exam.grades && exam.grades[stu.id] !== undefined
                ? exam.grades[stu.id]
                : "";
            const tr = document.createElement("tr");
            tr.innerHTML = `
              <td>${stu.id}</td>
              <td>${stu.name}</td>
              <td>
                <input 
                  type="number" 
                  class="form-control grade-input" 
                  data-student-id="${stu.id}" 
                  min="0" 
                  max="${exam.totalMarks}" 
                  value="${currentMark}" 
                  placeholder="0 - ${exam.totalMarks}" 
                />
              </td>
            `;
            gradesTableBody.appendChild(tr);
          });
        }

        openModal(gradesModal);
      }
    });
  }

  if (gradesForm) {
    gradesForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!currentGradeExamId) return;

      const exam = exams.find((ex) => ex.id === currentGradeExamId);
      if (!exam) return;

      const gradeInputs = gradesTableBody.querySelectorAll(".grade-input");
      exam.grades = exam.grades || {};

      gradeInputs.forEach((input) => {
        const stuId = input.getAttribute("data-student-id");
        const val = input.value.trim();
        if (val !== "") {
          exam.grades[stuId] = Number(val);
        } else {
          delete exam.grades[stuId];
        }
      });

      saveExams();
      renderExams();
      closeModal(gradesModal);
    });
  }

  if (searchInput) searchInput.addEventListener("input", renderExams);
  if (filterClassSelect)
    filterClassSelect.addEventListener("change", renderExams);

  // Setup Bell Dropdown Events
  const bellBtn = document.getElementById("notification-bell-btn");
  const dropdown = document.getElementById("notification-dropdown");
  const markAllBtn = document.getElementById("mark-all-read-btn");

  if (bellBtn && dropdown) {
    bellBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("hidden");
    });

    document.addEventListener("click", (e) => {
      if (!dropdown.contains(e.target) && e.target !== bellBtn) {
        dropdown.classList.add("hidden");
      }
    });
  }

  if (markAllBtn) {
    markAllBtn.addEventListener("click", () => {
      const notifications = NotificationService.getNotifications();
      notifications.forEach((n) => (n.isRead = true));
      NotificationService.saveNotifications(notifications);
      renderHeaderNotifications();
    });
  }

  populateClassDropdowns();
  renderExams();

  // Run notification check immediately on page load
  renderHeaderNotifications();
});

// ==========================================
// NOTIFICATION SERVICE & RENDER LOGIC
// ==========================================
const NotificationService = {
  getNotifications() {
    return JSON.parse(localStorage.getItem("edu_notifications")) || [];
  },

  saveNotifications(list) {
    localStorage.setItem("edu_notifications", JSON.stringify(list));
  },

  checkUpcomingExamAlerts() {
    const exams = JSON.parse(localStorage.getItem("edu_exams")) || [];
    const notifications = this.getNotifications();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let newNotificationsAdded = false;

    exams.forEach((exam) => {
      if (!exam.date || !exam.classId || exam.isHidden || exam.isDeleted)
        return;

      const [year, month, day] = exam.date.split("-").map(Number);
      const examDate = new Date(year, month - 1, day);
      examDate.setHours(0, 0, 0, 0);

      const diffTime = examDate.getTime() - today.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      // Trigger notification if within 0 to 3 days
      if (diffDays >= 0 && diffDays <= 3) {
        // ONE unique alert per exam
        const alertUniqueId = `ALERT_3DAY_${exam.id}`;
        const alreadyExists = notifications.some(
          (n) => n.alertKey === alertUniqueId,
        );

        if (!alreadyExists) {
          let timeLabel = `in ${diffDays} days`;
          if (diffDays === 0) timeLabel = "today";
          if (diffDays === 1) timeLabel = "tomorrow";

          notifications.unshift({
            id: "NOT_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
            alertKey: alertUniqueId,
            classId: exam.classId,
            type: "UpcomingAlert",
            relatedId: exam.id,
            text: `Reminder: Upcoming exam "${exam.title}" is scheduled ${timeLabel} (${exam.date}).`,
            date: new Date().toISOString().split("T")[0],
            isRead: false,
          });

          newNotificationsAdded = true;
        }
      }
    });

    if (newNotificationsAdded) {
      this.saveNotifications(notifications);
    }
  },
};

const renderHeaderNotifications = () => {
  NotificationService.checkUpcomingExamAlerts();
  const notifications = NotificationService.getNotifications();

  const badge = document.getElementById("notification-badge");
  const listContainer = document.getElementById("notification-list");

  if (!badge || !listContainer) return;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (unreadCount > 0) {
    badge.textContent = unreadCount > 99 ? "99+" : unreadCount;
    badge.classList.remove("hidden");
  } else {
    badge.textContent = "";
    badge.classList.add("hidden");
  }

  listContainer.innerHTML = "";
  if (notifications.length === 0) {
    listContainer.innerHTML =
      '<div class="p-3 text-center text-muted small">No notifications yet.</div>';
  } else {
    notifications.slice(0, 10).forEach((n) => {
      const item = document.createElement("div");
      item.className = `notif-item ${!n.isRead ? "unread" : ""} ${n.type === "UpcomingAlert" ? "alert" : ""}`;

      const icon =
        n.type === "UpcomingAlert"
          ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
          : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>';

      item.innerHTML = `
        <div class="notif-icon-box">${icon}</div>
        <div class="notif-content">
          <div class="notif-text">${n.text}</div>
          <div class="notif-date">${n.date}</div>
        </div>
      `;

      item.addEventListener("click", () => {
        const currentNotifs = NotificationService.getNotifications();
        const target = currentNotifs.find((item) => item.id === n.id);
        if (target) {
          target.isRead = true;
          NotificationService.saveNotifications(currentNotifs);
          renderHeaderNotifications();
        }
      });

      listContainer.appendChild(item);
    });
  }
};
