document.addEventListener('DOMContentLoaded', () => {
  // 1. Initial Data Setup
  const initialClasses = [
    { id: 'c1', name: 'JavaScript - Grade 10 A', subject: 'JavaScript' },
    { id: 'c2', name: 'Python - Grade 11 B', subject: 'Python' },
    { id: 'c3', name: 'Web Development - Grade 12 A', subject: 'Web Development' }
  ];

  const initialStudents = {
    c1: [
      { id: 'STU001', name: 'Alex Johnson' }, { id: 'STU002', name: 'Maria Garcia' },
      { id: 'STU003', name: 'Liam Smith' }, { id: 'STU004', name: 'Sophia Chen' }
    ],
    c2: [
      { id: 'STU009', name: 'Mason Lee' }, { id: 'STU010', name: 'Isabella Moore' },
      { id: 'STU011', name: 'Ethan Clark' }, { id: 'STU012', name: 'Mia Hall' },
      { id: 'STU013', name: 'Lucas Young' }
    ],
    c3: [
      { id: 'STU014', name: 'Amelia King' }, { id: 'STU015', name: 'James Wright' }
    ]
  };

  // Multiple exams array sharing classId
  const initialExams = [
    {
      id: "EX002",
      title: "Python Midterm",
      description: "",
      classId: "c2",
      date: "2026-10-05",
      totalMarks: 40,
      isHidden: false,
      grades: { STU009: 40, STU010: 40, STU011: 40, STU012: 10, STU013: 10 }
    },
    {
      id: "EX003",
      title: "Python Final",
      description: "",
      classId: "c2",
      date: "2026-10-31",
      totalMarks: 60,
      isHidden: false,
      grades: { STU009: 50, STU010: 56, STU011: 50, STU012: 5, STU013: 5 }
    },
    {
      id: "EX001",
      title: "JavaScript Basics Quiz",
      description: "",
      classId: "c1",
      date: "2026-10-01",
      totalMarks: 20,
      isHidden: false,
      grades: { STU001: 18, STU002: 15, STU003: 10, STU004: 20 }
    }
  ];

  const classes = JSON.parse(localStorage.getItem('edu_classes')) || initialClasses;
  const students = JSON.parse(localStorage.getItem('edu_students')) || initialStudents;
  let exams = JSON.parse(localStorage.getItem('edu_exams')) || initialExams;

  // 2. DOM Elements
  const classFilter = document.getElementById('class-select-filter');
  const examFilter = document.getElementById('exam-select-filter');
  const marksTableBody = document.getElementById('marks-table-body');
  const emptyState = document.getElementById('marks-empty');
  const printBtn = document.getElementById('print-report');

  // 3. Populate Class Filter Dropdown
  function populateClassFilter() {
    classFilter.innerHTML = '';
    classes.forEach(cls => {
      const option = document.createElement('option');
      option.value = cls.id;
      option.textContent = cls.name;
      classFilter.appendChild(option);
    });
    
    // Default select c2 if available
    if (classes.some(c => c.id === 'c2')) classFilter.value = 'c2';
  }

  // 4. Populate Exam Filter Dropdown based on selected classId
  function populateExamFilter() {
    const selectedClassId = classFilter.value;
    const availableExams = exams.filter(e => e.classId === selectedClassId && !e.isHidden);

    examFilter.innerHTML = '';

    if (availableExams.length > 0) {
      // Option for Summed Marks
      const allOption = document.createElement('option');
      allOption.value = 'ALL';
      allOption.textContent = 'All Exams (Summed Marks)';
      examFilter.appendChild(allOption);

      availableExams.forEach(e => {
        const option = document.createElement('option');
        option.value = e.id;
        option.textContent = `${e.title} (${e.totalMarks} pts)`;
        examFilter.appendChild(option);
      });
    } else {
      const option = document.createElement('option');
      option.value = '';
      option.textContent = 'No Exams Found';
      examFilter.appendChild(option);
    }
  }

  // 5. Render Table & Calculate Grades
  function renderMarksTable() {
    const selectedClassId = classFilter.value;
    const selectedExamId = examFilter.value;
    const classStudents = students[selectedClassId] || [];

    marksTableBody.innerHTML = '';
    emptyState.innerHTML = '';

    if (!selectedExamId || classStudents.length === 0) {
      emptyState.innerHTML = '<div class="p-4 text-center text-muted">No exam or student data found for this selection.</div>';
      updateStats(0, 0, 0);
      return;
    }

    const availableExams = exams.filter(e => e.classId === selectedClassId && !e.isHidden);
    let passedCount = 0;
    let failedCount = 0;

    if (selectedExamId === 'ALL') {
      // --- ALL EXAMS (SUMMED MARKS) MODE ---
      const totalPossibleMarks = availableExams.reduce((sum, e) => sum + e.totalMarks, 0);

      document.getElementById('exam-page-title').textContent = 'All Exams Total';
      document.getElementById('exam-page-subtitle').textContent = `Total Combined Marks: ${totalPossibleMarks} · Exams Count: ${availableExams.length}`;

      classStudents.forEach((student, index) => {
        // Calculate total score for student across all class exams
        const score = availableExams.reduce((sum, e) => sum + (e.grades[student.id] || 0), 0);
        const percentage = totalPossibleMarks > 0 ? Math.round((score / totalPossibleMarks) * 100) : 0;
        const isPassed = percentage >= 50;

        if (isPassed) passedCount++;
        else failedCount++;

        const badgeClass = isPassed ? 'badge bg-success' : 'badge bg-danger';
        const row = document.createElement('tr');

        row.innerHTML = `
          <td>${index + 1}</td>
          <td><strong>${student.id}</strong></td>
          <td>${escapeHtml(student.name)}</td>
          <td><strong>${score}</strong> / ${totalPossibleMarks}</td>
          <td><strong>${percentage}%</strong></td>
          <td><span class="${badgeClass}">${isPassed ? 'Passed' : 'Failed'}</span></td>
        `;
        marksTableBody.appendChild(row);
      });

    } else {
      // --- SINGLE EXAM MODE ---
      const currentExam = exams.find(e => e.id === selectedExamId);
      if (!currentExam) return;

      document.getElementById('exam-page-title').textContent = currentExam.title;
      document.getElementById('exam-page-subtitle').textContent = `Total Points: ${currentExam.totalMarks} · Date: ${currentExam.date}`;

      classStudents.forEach((student, index) => {
        const score = currentExam.grades[student.id] ?? 0;
        const percentage = Math.round((score / currentExam.totalMarks) * 100);
        const isPassed = percentage >= 50;

        if (isPassed) passedCount++;
        else failedCount++;

        const badgeClass = isPassed ? 'badge bg-success' : 'badge bg-danger';
        const row = document.createElement('tr');

        row.innerHTML = `
          <td>${index + 1}</td>
          <td><strong>${student.id}</strong></td>
          <td>${escapeHtml(student.name)}</td>
          <td>
            <input 
              type="number" 
              class="form-control form-control-sm style-score-input" 
              value="${score}" 
              min="0" 
              max="${currentExam.totalMarks}"
              data-student-id="${student.id}"
              data-exam-id="${currentExam.id}"
              style="width: 80px; display: inline-block;"
            /> / ${currentExam.totalMarks}
          </td>
          <td><strong>${percentage}%</strong></td>
          <td><span class="${badgeClass}">${isPassed ? 'Passed' : 'Failed'}</span></td>
        `;
        marksTableBody.appendChild(row);
      });
    }

    updateStats(passedCount, failedCount, classStudents.length);
  }

  // 6. Update Summary Statistics Cards
  function updateStats(passed, failed, total) {
    document.getElementById('stat-passed-count').textContent = passed;
    document.getElementById('stat-failed-count').textContent = failed;
    document.getElementById('stat-total-count').textContent = total;
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[c]));
  }

  // 7. Event Listeners
  classFilter.addEventListener('change', () => {
    populateExamFilter();
    renderMarksTable();
  });

  examFilter.addEventListener('change', () => {
    renderMarksTable();
  });

  // Score Input Change Listener (Single Exam Mode)
  marksTableBody.addEventListener('input', (e) => {
    if (e.target.classList.contains('style-score-input')) {
      const studentId = e.target.dataset.studentId;
      const examId = e.target.dataset.examId;
      const targetExam = exams.find(ex => ex.id === examId);

      if (targetExam) {
        const newScore = Math.min(Number(e.target.value), targetExam.totalMarks);
        targetExam.grades[studentId] = newScore;
        localStorage.setItem('edu_exams', JSON.stringify(exams));
        renderMarksTable();
      }
    }
  });

  if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
  }

  // Initial Initialization
  populateClassFilter();
  populateExamFilter();
  renderMarksTable();
});