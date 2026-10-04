import { getCurrentTeacher } from "./data.js";

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

  const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  }[char]));

  const classes = read("classes").filter((item) => item.teacherId === teacher.id);
  const students = read("students");
  const exams = read("exams").filter((item) => item.teacherId === teacher.id && !item.isHidden && !item.isDeleted);
  let grades = read("grades");
  const classMap = new Map(classes.map((item) => [item.id, item]));
  const studentMap = new Map(students.map((item) => [item.id, item]));

  const classFilter = document.getElementById("class-select-filter");
  const examFilter = document.getElementById("exam-select-filter");
  const marksTableBody = document.getElementById("marks-table-body");
  const emptyState = document.getElementById("marks-empty");
  const printBtn = document.getElementById("print-report");
  const pageTitle = document.getElementById("exam-page-title");
  const pageSubtitle = document.getElementById("exam-page-subtitle");

  const roster = (classId) => {
    const cls = classMap.get(classId);
    return (cls?.studentIds || []).map((id) => studentMap.get(id)).filter(Boolean);
  };

  const gradeRecord = (examId, studentId) => grades.find((grade) => grade.examId === examId && grade.studentId === studentId);
  const examGrades = (examId) => grades.filter((grade) => grade.examId === examId);

  const populateClassFilter = () => {
    if (!classFilter) return;
    classFilter.innerHTML = classes.length ? classes.map((cls) => `<option value="${escapeHtml(cls.id)}">${escapeHtml(cls.name)}</option>`).join("") : '<option value="">No Classes Found</option>';
  };

  const populateExamFilter = () => {
    if (!classFilter || !examFilter) return;
    const selectedClassId = classFilter.value;
    const available = exams.filter((exam) => exam.classId === selectedClassId);
    examFilter.innerHTML = available.length
      ? `<option value="ALL">All Exams (Summed Marks)</option>${available.map((exam) => `<option value="${escapeHtml(exam.id)}">${escapeHtml(exam.title)} (${Number(exam.totalMarks || 0)} pts)</option>`).join("")}`
      : '<option value="">No Exams Found</option>';
  };

  const updateStats = (passed, failed, total) => {
    document.getElementById("stat-passed-count")?.replaceChildren(String(passed));
    document.getElementById("stat-failed-count")?.replaceChildren(String(failed));
    document.getElementById("stat-total-count")?.replaceChildren(String(total));
  };

  const renderMarksTable = () => {
    const selectedClassId = classFilter?.value;
    const selectedExamId = examFilter?.value;
    const classStudents = roster(selectedClassId);
    if (marksTableBody) marksTableBody.innerHTML = "";
    if (emptyState) emptyState.innerHTML = "";

    if (!selectedExamId || !classStudents.length) {
      if (emptyState) emptyState.innerHTML = '<div class="p-4 text-center text-muted">No exam or student data found for this selection.</div>';
      updateStats(0, 0, 0);
      return;
    }

    const availableExams = exams.filter((exam) => exam.classId === selectedClassId);
    let passedCount = 0;
    let failedCount = 0;

    if (selectedExamId === "ALL") {
      const totalPossible = availableExams.reduce((sum, exam) => sum + Number(exam.totalMarks || 0), 0);
      if (pageTitle) pageTitle.textContent = "All Exams Total";
      if (pageSubtitle) pageSubtitle.textContent = `Total Combined Marks: ${totalPossible} · Exams Count: ${availableExams.length}`;

      classStudents.forEach((student, index) => {
        const graded = availableExams.map((exam) => ({ exam, grade: gradeRecord(exam.id, student.id) })).filter((row) => row.grade && Number.isFinite(Number(row.grade.mark)));
        const score = graded.reduce((sum, row) => sum + Number(row.grade.mark || 0), 0);
        const gradedPossible = graded.reduce((sum, row) => sum + Number(row.exam.totalMarks || 0), 0);
        const percentage = gradedPossible ? Math.round((score / gradedPossible) * 100) : null;
        const complete = graded.length === availableExams.length;
        const passed = complete && percentage !== null && percentage >= 50;
        if (complete && percentage !== null) { if (passed) passedCount++; else failedCount++; }
        marksTableBody?.insertAdjacentHTML("beforeend", `<tr>
          <td>${index + 1}</td><td><strong>${escapeHtml(student.id)}</strong></td><td>${escapeHtml(student.fullName)}</td>
          <td><strong>${score}</strong> / ${totalPossible}</td><td><strong>${percentage === null ? "—" : percentage + "%"}</strong></td>
          <td><span class="badge ${!complete ? "bg-secondary" : passed ? "bg-success" : "bg-danger"}">${!complete ? "Incomplete" : passed ? "Passed" : "Failed"}</span></td>
        </tr>`);
      });
    } else {
      const exam = exams.find((item) => item.id === selectedExamId);
      if (!exam) return;
      if (pageTitle) pageTitle.textContent = exam.title;
      if (pageSubtitle) pageSubtitle.textContent = `Total Points: ${Number(exam.totalMarks || 0)} · Date: ${exam.date || "—"}`;

      classStudents.forEach((student, index) => {
        const raw = gradeRecord(exam.id, student.id)?.mark;
        const score = raw === undefined ? "" : Number(raw);
        const percentage = raw === undefined || !exam.totalMarks ? null : Math.round((Number(raw) / Number(exam.totalMarks)) * 100);
        const passed = percentage !== null && percentage >= 50;
        if (percentage !== null) { if (passed) passedCount++; else failedCount++; }
        marksTableBody?.insertAdjacentHTML("beforeend", `<tr>
          <td>${index + 1}</td><td><strong>${escapeHtml(student.id)}</strong></td><td>${escapeHtml(student.fullName)}</td>
          <td><input type="number" class="form-control form-control-sm style-score-input" value="${score}" min="0" max="${Number(exam.totalMarks || 0)}" data-student-id="${escapeHtml(student.id)}" data-exam-id="${escapeHtml(exam.id)}" style="width: 80px; display:inline-block;" /> / ${Number(exam.totalMarks || 0)}</td>
          <td><strong>${percentage === null ? "—" : percentage + "%"}</strong></td><td><span class="badge ${percentage === null ? "bg-secondary" : passed ? "bg-success" : "bg-danger"}">${percentage === null ? "Not graded" : passed ? "Passed" : "Failed"}</span></td>
        </tr>`);
      });
    }

    updateStats(passedCount, failedCount, classStudents.length);
  };

  classFilter?.addEventListener("change", () => {
    populateExamFilter();
    renderMarksTable();
  });
  examFilter?.addEventListener("change", renderMarksTable);

  marksTableBody?.addEventListener("change", (event) => {
    const input = event.target.closest(".style-score-input");
    if (!input) return;
    const exam = exams.find((item) => item.id === input.dataset.examId);
    if (!exam) return;
    const value = input.value.trim();
    const gradeIndex = grades.findIndex((grade) => grade.examId === exam.id && grade.studentId === input.dataset.studentId);
    if (!value) {
      if (gradeIndex >= 0) grades.splice(gradeIndex, 1);
    } else {
      const mark = Math.max(0, Math.min(Number(exam.totalMarks || 0), Number(value)));
      if (!Number.isFinite(mark)) return;
      if (gradeIndex >= 0) grades[gradeIndex].mark = mark;
      else {
        const next = grades.reduce((max, grade) => {
          const match = String(grade.id || "").match(/(\d+)$/);
          return Math.max(max, match ? Number(match[1]) : 0);
        }, 0) + 1;
        grades.push({ id: `GR${String(next).padStart(3, "0")}`, examId: exam.id, studentId: input.dataset.studentId, mark });
      }
    }
    save("grades", grades);
    if (window.EvolviaApp?.syncLegacyEduKeys) window.EvolviaApp.syncLegacyEduKeys();
    renderMarksTable();
  });

  printBtn?.addEventListener("click", () => window.print());

  populateClassFilter();
  populateExamFilter();
  renderMarksTable();
});
