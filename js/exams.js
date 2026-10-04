import { getCurrentTeacher } from "./data.js";

function localDateISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const teacher = getCurrentTeacher();
  if (!teacher) {
    window.location.href = "./login.html";
    return;
  }

  const read = (key, fallback = []) => {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return Array.isArray(value) ? value : fallback;
    } catch {
      return fallback;
    }
  };

  const write = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
    return value;
  };

  const classes = read("classes").filter((item) => item.teacherId === teacher.id);
  const allStudents = read("students");
  const subjects = read("subjects");
  let exams = read("exams").filter((item) => item.teacherId === teacher.id && !item.isDeleted);
  let grades = read("grades");

  const classMap = new Map(classes.map((item) => [item.id, item]));
  const subjectMap = new Map(subjects.map((item) => [item.id, item]));
  const studentMap = new Map(allStudents.map((item) => [item.id, item]));

  const saveExams = () => {
    const allExams = read("exams");
    const otherExams = allExams.filter((item) => item.teacherId !== teacher.id);
    write("exams", [...otherExams, ...exams]);
    if (window.EvolviaApp?.syncLegacyEduKeys) window.EvolviaApp.syncLegacyEduKeys();
  };

  const saveGrades = () => {
    write("grades", grades);
    if (window.EvolviaApp?.syncLegacyEduKeys) window.EvolviaApp.syncLegacyEduKeys();
  };

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  }[char]));

  const classStudents = (classId) => {
    const cls = classMap.get(classId);
    if (!cls) return [];
    return (cls.studentIds || [])
      .map((id) => studentMap.get(id))
      .filter(Boolean);
  };

  const gradesForExam = (examId) => grades.filter((grade) => grade.examId === examId);

  const gradeMapForExam = (examId) => {
    const map = new Map();
    gradesForExam(examId).forEach((grade) => map.set(grade.studentId, Number(grade.mark)));
    return map;
  };

  const calculateAverage = (exam) => {
    const rosterIds = new Set(classStudents(exam.classId).map((student) => student.id));
    const values = gradesForExam(exam.id)
      .filter((grade) => rosterIds.has(grade.studentId))
      .map((grade) => Number(grade.mark))
      .filter((value) => Number.isFinite(value));
    if (!values.length) return null;
    return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
  };

  const upsertTeacherNotification = (exam, action = "scheduled") => {
    if (!window.EvolviaApp?.ensureNotification) return;
    window.EvolviaApp.ensureNotification({
      id: `teacher-exam-${teacher.id}-${exam.id}-${action}`,
      teacherId: teacher.id,
      type: "Exam",
      relatedId: exam.id,
      text: `${exam.title} has been ${action} for ${classMap.get(exam.classId)?.name || "your class"}.`,
      date: exam.date || localDateISO(),
    });
  };

  const ensureUpcomingExamNotifications = () => {
    if (!window.EvolviaApp?.ensureNotification) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    exams.forEach((exam) => {
      if (!exam.date) return;
      const examDate = new Date(`${exam.date}T00:00:00`);
      if (Number.isNaN(examDate.getTime())) return;
      const days = Math.ceil((examDate - today) / 86400000);
      if (days >= 0 && days <= 7) {
        upsertTeacherNotification(exam, "scheduled");
      }
    });
  };

  const examsTableBody = document.getElementById("exams-table-body");
  const emptyStateContainer = document.getElementById("empty-state-container");
  const searchInput = document.getElementById("exam-search");
  const filterClassSelect = document.getElementById("filter-class");
  const activeExamsCountEl = document.getElementById("active-exams-count");
  const statBestClassEl = document.getElementById("stat-best-class");
  const statBestClassNameEl = document.getElementById("stat-best-class-name");
  const statTopStudentsEl = document.getElementById("stat-top-students");
  const statLowStudentsEl = document.getElementById("stat-low-students");
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
  const gradesModal = document.getElementById("grades-modal");
  const gradesForm = document.getElementById("grades-form");
  const gradesModalTitle = document.getElementById("grades-modal-title");
  const gradesModalSubtitle = document.getElementById("grades-modal-subtitle");
  const maxMarksLabel = document.getElementById("max-marks-label");
  const gradesTableBody = document.getElementById("grades-table-body");
  let currentGradeExamId = null;

  const openModal = (modal) => modal?.classList.remove("hidden");
  const closeModal = (modal) => modal?.classList.add("hidden");

  const populateClassDropdowns = () => {
    if (filterClassSelect) {
      filterClassSelect.innerHTML = '<option value="">All Classes</option>';
      classes.forEach((cls) => {
        filterClassSelect.insertAdjacentHTML(
          "beforeend",
          `<option value="${escapeHtml(cls.id)}">${escapeHtml(cls.name)}</option>`,
        );
      });
    }
    if (examClassSelect) {
      examClassSelect.innerHTML = '<option value="">Select a Class</option>';
      classes.forEach((cls) => {
        examClassSelect.insertAdjacentHTML(
          "beforeend",
          `<option value="${escapeHtml(cls.id)}">${escapeHtml(cls.name)}</option>`,
        );
      });
    }
  };

  const updateDashboardStats = () => {
    const visibleExams = exams.filter((exam) => !exam.isHidden && !exam.isDeleted);
    const monthKey = (date) => {
      const parsed = new Date(`${date}T00:00:00`);
      return Number.isNaN(parsed.getTime()) ? null : `${parsed.getFullYear()}-${parsed.getMonth()}`;
    };
    const now = new Date();
    const currentKey = `${now.getFullYear()}-${now.getMonth()}`;
    const available = visibleExams.map((exam) => monthKey(exam.date)).filter(Boolean).sort().reverse();
    const targetKey = available.includes(currentKey) ? currentKey : (available[0] || currentKey);
    const targetExams = visibleExams.filter((exam) => monthKey(exam.date) === targetKey);

    const classAverages = classes.map((cls) => {
      const rosterIds = new Set(classStudents(cls.id).map((student) => student.id));
      const clsExams = targetExams.filter((exam) => exam.classId === cls.id);
      let earned = 0;
      let possible = 0;
      clsExams.forEach((exam) => {
        const validGrades = gradesForExam(exam.id).filter((grade) => rosterIds.has(grade.studentId));
        possible += Number(exam.totalMarks || 0) * validGrades.length;
        earned += validGrades.reduce((sum, grade) => sum + Number(grade.mark || 0), 0);
      });
      return possible ? { name: cls.name, percentage: Math.round((earned / possible) * 100) } : null;
    }).filter(Boolean);

    classAverages.sort((a, b) => b.percentage - a.percentage);
    const best = classAverages[0];
    if (statBestClassEl) statBestClassEl.textContent = best ? `${best.percentage}%` : "N/A";
    if (statBestClassNameEl) statBestClassNameEl.textContent = best ? `${best.name} — class average` : "No graded exams yet";

    const aggregates = new Map();
    visibleExams.forEach((exam) => {
      const rosterIds = new Set(classStudents(exam.classId).map((student) => student.id));
      gradesForExam(exam.id).filter((grade) => rosterIds.has(grade.studentId)).forEach((grade) => {
        const key = `${exam.classId}-${grade.studentId}`;
        const entry = aggregates.get(key) || { name: studentMap.get(grade.studentId)?.fullName || grade.studentId, earned: 0, possible: 0 };
        entry.earned += Number(grade.mark || 0);
        entry.possible += Number(exam.totalMarks || 0);
        aggregates.set(key, entry);
      });
    });

    const ranked = [...aggregates.values()]
      .filter((item) => item.possible > 0)
      .map((item) => ({ ...item, percentage: Number(((item.earned / item.possible) * 100).toFixed(1)) }));
    const top = ranked.filter((item) => item.percentage > 95).sort((a, b) => b.percentage - a.percentage);
    const low = ranked.filter((item) => item.percentage < 50).sort((a, b) => a.percentage - b.percentage);

    if (statTopStudentsEl) {
      statTopStudentsEl.innerHTML = top.length ? top.map((item) => `<div class="stats-student-item"><span><strong>${escapeHtml(item.name)}</strong></span><span class="badge badge-info">${item.percentage}%</span></div>`).join("") : '<div class="text-muted small">No students above 95%</div>';
    }
    if (statLowStudentsEl) {
      statLowStudentsEl.innerHTML = low.length ? low.map((item) => `<div class="stats-student-item"><span><strong>${escapeHtml(item.name)}</strong></span><span class="badge badge-danger">${item.percentage}%</span></div>`).join("") : '<div class="text-muted small">No students below 50%</div>';
    }
  };

  const renderExams = () => {
    const searchTerm = searchInput?.value.toLowerCase().trim() || "";
    const selectedClass = filterClassSelect?.value || "";
    const filtered = exams.filter((exam) => {
      if (exam.isHidden || exam.isDeleted) return false;
      const cls = classMap.get(exam.classId);
      const subject = subjectMap.get(exam.subjectId);
      const haystack = [exam.title, exam.description, cls?.name, subject?.name].filter(Boolean).join(" ").toLowerCase();
      return (!searchTerm || haystack.includes(searchTerm)) && (!selectedClass || exam.classId === selectedClass);
    });

    if (examsTableBody) {
      examsTableBody.innerHTML = filtered.map((exam, index) => {
        const cls = classMap.get(exam.classId);
        const subject = subjectMap.get(exam.subjectId) || subjectMap.get(cls?.subjectId);
        const average = calculateAverage(exam);
        return `<tr>
          <td><strong>${index + 1}</strong></td>
          <td><div class="exam-title-cell"><strong>${escapeHtml(exam.title)}</strong><small>${escapeHtml(exam.description || "No description")}</small></div></td>
          <td>${escapeHtml(cls?.name || "N/A")}</td>
          <td>${escapeHtml(subject?.name || "N/A")}</td>
          <td>${escapeHtml(exam.date || "—")}</td>
          <td>${average !== null ? `${average} / ${Number(exam.totalMarks || 0)}` : "N/A"}</td>
          <td class="table-actions">
            <button type="button" class="btn-icon btn-info btn-enter-grades" data-id="${escapeHtml(exam.id)}" title="Enter Grades">✓</button>
            <button type="button" class="btn-icon btn-secondary btn-edit-exam" data-id="${escapeHtml(exam.id)}" title="Edit Exam">✎</button>
            <button type="button" class="btn-icon btn-danger btn-delete-exam" data-id="${escapeHtml(exam.id)}" title="Archive Exam">×</button>
          </td>
        </tr>`;
      }).join("");
    }

    if (emptyStateContainer) emptyStateContainer.innerHTML = filtered.length ? "" : '<div class="p-4 text-center text-muted">No exams found for your current filters.</div>';
    if (activeExamsCountEl) activeExamsCountEl.textContent = exams.filter((exam) => !exam.isHidden && !exam.isDeleted).length;
    updateDashboardStats();
  };

  const nextId = (prefix, collection) => {
    const max = collection.reduce((highest, item) => {
      const match = String(item.id || "").match(/(\d+)$/);
      return Math.max(highest, match ? Number(match[1]) : 0);
    }, 0);
    return `${prefix}${String(max + 1).padStart(3, "0")}`;
  };

  document.querySelectorAll(".closeModal").forEach((button) => button.addEventListener("click", () => {
    closeModal(examModal);
    closeModal(gradesModal);
  }));

  btnOpenCreateModal?.addEventListener("click", () => {
    examForm?.reset();
    if (examIdInput) examIdInput.value = "";
    if (modalTitle) modalTitle.textContent = "Create New Exam";
    openModal(examModal);
  });

  examForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const id = examIdInput?.value.trim();
    const title = examTitleInput?.value.trim();
    const classId = examClassSelect?.value;
    const description = examDescInput?.value.trim();
    const date = examDateInput?.value;
    const totalMarks = Number(examMarksInput?.value);
    if (!title || !classId || !date || !Number.isFinite(totalMarks) || totalMarks <= 0) return;

    const classRecord = classMap.get(classId);
    const subjectId = classRecord?.subjectId || null;

    if (id) {
      const target = exams.find((exam) => exam.id === id);
      if (target) Object.assign(target, { title, classId, subjectId, description, date, totalMarks });
      upsertTeacherNotification(target || { id, title, classId, date }, "updated");
    } else {
      const newExam = {
        id: nextId("EX", read("exams")),
        title,
        description,
        teacherId: teacher.id,
        classId,
        subjectId,
        date,
        totalMarks,
        isHidden: false,
      };
      exams.push(newExam);
      upsertTeacherNotification(newExam, "scheduled");
    }

    saveExams();
    closeModal(examModal);
    renderExams();
  });

  examsTableBody?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-id]");
    if (!button) return;
    const id = button.dataset.id;
    const exam = exams.find((item) => item.id === id);
    if (!exam) return;

    if (button.classList.contains("btn-delete-exam")) {
      exam.isHidden = true;
      upsertTeacherNotification(exam, "archived");
      saveExams();
      renderExams();
      return;
    }

    if (button.classList.contains("btn-edit-exam")) {
      if (examIdInput) examIdInput.value = exam.id;
      if (examTitleInput) examTitleInput.value = exam.title || "";
      if (examClassSelect) examClassSelect.value = exam.classId || "";
      if (examDescInput) examDescInput.value = exam.description || "";
      if (examDateInput) examDateInput.value = exam.date || "";
      if (examMarksInput) examMarksInput.value = exam.totalMarks || "";
      if (modalTitle) modalTitle.textContent = "Edit Exam";
      openModal(examModal);
      return;
    }

    if (button.classList.contains("btn-enter-grades")) {
      currentGradeExamId = exam.id;
      const cls = classMap.get(exam.classId);
      const roster = classStudents(exam.classId);
      const map = gradeMapForExam(exam.id);
      if (gradesModalTitle) gradesModalTitle.textContent = `Grades: ${exam.title}`;
      if (gradesModalSubtitle) gradesModalSubtitle.textContent = cls?.name || "";
      if (maxMarksLabel) maxMarksLabel.textContent = String(exam.totalMarks || 0);
      if (gradesTableBody) {
        gradesTableBody.innerHTML = roster.length ? roster.map((student) => {
          const mark = map.has(student.id) ? map.get(student.id) : "";
          return `<tr>
            <td>${escapeHtml(student.id)}</td>
            <td>${escapeHtml(student.fullName)}</td>
            <td><input type="number" class="form-control grade-input" data-student-id="${escapeHtml(student.id)}" min="0" max="${Number(exam.totalMarks || 0)}" value="${mark}" placeholder="0 - ${Number(exam.totalMarks || 0)}"></td>
          </tr>`;
        }).join("") : '<tr><td colspan="3" class="text-center">No students found in this class.</td></tr>';
      }
      openModal(gradesModal);
    }
  });

  gradesForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const exam = exams.find((item) => item.id === currentGradeExamId);
    if (!exam) return;
    const max = Number(exam.totalMarks || 0);
    gradesTableBody?.querySelectorAll(".grade-input").forEach((input) => {
      const studentId = input.dataset.studentId;
      const value = input.value.trim();
      const existingIndex = grades.findIndex((grade) => grade.examId === exam.id && grade.studentId === studentId);
      if (value === "") {
        if (existingIndex >= 0) grades.splice(existingIndex, 1);
        return;
      }
      const mark = Math.max(0, Math.min(max, Number(value)));
      if (!Number.isFinite(mark)) return;
      if (existingIndex >= 0) grades[existingIndex].mark = mark;
      else grades.push({ id: nextId("GR", grades), examId: exam.id, studentId, mark });
    });
    saveGrades();
    closeModal(gradesModal);
    renderExams();
  });

  searchInput?.addEventListener("input", renderExams);
  filterClassSelect?.addEventListener("change", renderExams);

  ensureUpcomingExamNotifications();
  populateClassDropdowns();
  renderExams();
});
