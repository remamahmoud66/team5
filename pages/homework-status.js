document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Sidebar Navigation Active Link Handler ---
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === 'homework.html') {
      link.classList.add('active');
    }
  });

  // --- 2. Seed Data Setup ---
  const initialClasses = [
    { id: 'c1', name: 'JavaScript - Grade 10 A', subject: 'JavaScript' },
    { id: 'c2', name: 'Python - Grade 11 B', subject: 'Python' },
    { id: 'c3', name: 'Web Development - Grade 12 A', subject: 'Web Development' }
  ];

  const initialStudents = {
    c1: [
      { id: 'STU001', name: 'Alex Johnson' }, { id: 'STU002', name: 'Maria Garcia' },
      { id: 'STU003', name: 'Liam Smith' }, { id: 'STU004', name: 'Sophia Chen' },
      { id: 'STU005', name: 'Noah Brown' }, { id: 'STU006', name: 'Emma Davis' },
      { id: 'STU007', name: 'Oliver Wilson' }, { id: 'STU008', name: 'Ava Taylor' }
    ],
    c2: [
      { id: 'STU009', name: 'Mason Lee' }, { id: 'STU010', name: 'Isabella Moore' },
      { id: 'STU011', name: 'Ethan Clark' }, { id: 'STU012', name: 'Mia Hall' },
      { id: 'STU013', name: 'Lucas Young' }
    ],
    c3: [
      { id: 'STU014', name: 'Amelia King' }, { id: 'STU015', name: 'James Wright' },
      { id: 'STU016', name: 'Harper Scott' }, { id: 'STU017', name: 'Henry Green' }
    ]
  };

  const seedStudents = [
  { id: 1, studentName: "Emma Watson", dateTime: "2026-10-02 04:15 PM", status: "Submitted" },
  { id: 2, studentName: "Liam Johnson", dateTime: "2026-10-02 05:30 PM", status: "Submitted" },
  { id: 3, studentName: "Noah Smith", dateTime: "—", status: "Not Submitted" },
  { id: 4, studentName: "Olivia Brown", dateTime: "2026-10-03 08:20 AM", status: "Submitted" },
  { id: 5, studentName: "Lucas Garcia", dateTime: "—", status: "Not Submitted" },
  { id: 6, studentName: "Sophia Martinez", dateTime: "2026-10-02 11:45 PM", status: "Submitted" }
];

// Initialize localStorage if not already present
if (!localStorage.getItem("homeworkSubmissions")) {
  localStorage.setItem("homeworkSubmissions", JSON.stringify(seedStudents));
}
  const classes = JSON.parse(localStorage.getItem('edu_classes')) || initialClasses;
  const students = JSON.parse(localStorage.getItem('edu_students')) || JSON.parse(JSON.stringify(initialStudents));

  if (!students.c1) students.c1 = [];
  initialStudents.c1.forEach(seed => {
    if (!students.c1.some(existing => existing.id === seed.id)) students.c1.push(seed);
  });
  localStorage.setItem('edu_students', JSON.stringify(students));

  let homework = JSON.parse(localStorage.getItem('edu_homeworks')) || [
    { id: 'HW001', title: 'DOM Practice Task', description: 'Build a small interactive DOM component.', classId: 'c1', dueDate: '2026-10-04', totalPoints: 10, isHidden: false },
    { id: 'HW002', title: 'Local Storage Exercise', description: 'Create, read, update and remove LocalStorage data.', classId: 'c1', dueDate: '2026-10-07', totalPoints: 15, isHidden: false },
    { id: 'HW003', title: 'Python Functions Worksheet', description: 'Practice function parameters and return values.', classId: 'c2', dueDate: '2026-10-09', totalPoints: 20, isHidden: false },
    { id: 'HW004', title: 'Responsive Layout Challenge', description: 'Create a responsive page using CSS Grid and Flexbox.', classId: 'c3', dueDate: '2026-10-12', totalPoints: 25, isHidden: false }
  ];

  let statuses = JSON.parse(localStorage.getItem('edu_homework_statuses')) || [];

  if (!statuses.some(s => s.homeworkId === 'HW001')) {
    ['STU001', 'STU002', 'STU003', 'STU004', 'STU005'].forEach((studentId, i) => {
      statuses.push({
        homeworkId: 'HW001',
        studentId,
        status: 'Submitted',
        submittedAt: new Date(Date.now() - (i + 1) * 3600000).toISOString()
      });
    });
    saveStatuses();
  }

  // --- 3. DOM Elements & Helpers ---
  const $ = id => document.getElementById(id);
  const filterClass = $('filter-class');
  const homeworkBody = $('homework-table-body');
  const modal = $('homework-modal');
  const form = $('homework-form');
  const empty = $('empty-state-container');

  function saveHomework() { localStorage.setItem('edu_homeworks', JSON.stringify(homework)); }
  function saveStatuses() { localStorage.setItem('edu_homework_statuses', JSON.stringify(statuses)); }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[c]));
  }

  function getClass(id) { return classes.find(c => c.id === id); }
  function getStudents(classId) { return students[classId] || []; }
  function getStatuses(hwId) { return statuses.filter(s => s.homeworkId === hwId); }
  function getStudentStatus(hwId, studentId) { return statuses.find(s => s.homeworkId === hwId && s.studentId === studentId); }

  function populateClasses() {
    filterClass.innerHTML = '<option value="">All Classes</option>';
    $('homework-class').innerHTML = '<option value="">Select a Class</option>';
    classes.forEach(c => {
      filterClass.insertAdjacentHTML('beforeend', `<option value="${c.id}">${escapeHtml(c.name)}</option>`);
      $('homework-class').insertAdjacentHTML('beforeend', `<option value="${c.id}">${escapeHtml(c.name)}</option>`);
    });
  }

  function summary(hw) {
    const list = getStudents(hw.classId);
    const records = getStatuses(hw.id);
    const submitted = records.filter(s => s.status === 'Submitted');
    return {
      total: list.length,
      submitted: submitted.length,
      missing: Math.max(0, list.length - submitted.length),
      submittedRecords: submitted
    };
  }

  // --- 4. Render Stats ---
  function renderStats() {
    const visibleHomework = homework.filter(h => !h.isHidden && !h.isDeleted);
    const latest = visibleHomework[0];

    if (!latest) {
      $('stat-submitted').textContent = '0 / 0';
      $('stat-submitted-label').textContent = 'No active homework assignments';$('stat-last-submissions').innerHTML = '<div class="text-muted small">No submissions available</div>';
      $('stat-not-submitted').innerHTML = '<div class="text-muted small">No pending assignments</div>';
      return;
    }

    const s = summary(latest);
    $('stat-submitted').textContent = `${s.submitted} / ${s.total}`;
    $('stat-submitted-label').textContent = `${latest.title} · ${getClass(latest.classId)?.name || 'Class'}`;

    const last3 = [...s.submittedRecords]
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
      .slice(0, 3);

    $('stat-last-submissions').innerHTML = last3.length
      ? last3.map(r => {
          const stu = getStudents(latest.classId).find(x => x.id === r.studentId);
          return `<div class="stats-student-item">
            <span><strong>${escapeHtml(stu?.name || r.studentId)}</strong></span>
            <span class="badge badge-info">${formatDate(r.submittedAt)}</span>
          </div>`;
        }).join('')
      : '<div class="text-muted small">No submissions yet</div>';

    const missing = getStudents(latest.classId)
      .filter(stu => {
        const st = getStudentStatus(latest.id, stu.id);
        return !st || st.status !== 'Submitted';
      })
      .slice(0, 4);

    $('stat-not-submitted').innerHTML = missing.length
      ? missing.map(stu => `<div class="stats-student-item">
          <span>${escapeHtml(stu.name)}</span>
          <span class="badge badge-danger">Pending</span>
        </div>`).join('')
      : '<div class="text-muted small">Everyone submitted</div>';
  }

  // --- 5. Render Table ---
  function renderTable() {
    const term = $('homework-search').value.toLowerCase().trim();
    const selected = filterClass.value;

    const list = homework.filter(h => {
      if (h.isHidden || h.isDeleted) return false;
      const cls = getClass(h.classId);
      const name = (cls?.name || '').toLowerCase();
      return (!selected || h.classId === selected) &&
             (!term || h.title.toLowerCase().includes(term) || name.includes(term));
    });

    homeworkBody.innerHTML = '';
    empty.innerHTML = '';
    $('homework-count').textContent = `${list.length} assignment${list.length === 1 ? '' : 's'}`;

    list.forEach((hw, index) => {
      const cls = getClass(hw.classId);
      const s = summary(hw);
      const pct = s.total ? Math.round((s.submitted / s.total) * 100) : 0;

      homeworkBody.insertAdjacentHTML('beforeend', `<tr>
        <td><strong>${index + 1}</strong></td>
        <td>
          <div class="exam-title-cell">
            <strong>${escapeHtml(hw.title)}</strong><br>
            <small class="text-muted">${escapeHtml(hw.description || 'No description')}</small>
          </div>
        </td>
        <td>${escapeHtml(cls?.name || 'N/A')}</td>
        <td>${hw.dueDate}</td>
        <td>
          <strong>${s.submitted}/${s.total}</strong>
          <div class="mini-progress"><span style="width:${pct}%"></span></div>
        </td>
        <td>
          <span class="status-pill ${s.missing === 0 ? 'status-complete' : 'status-pending'}">
            ${s.missing === 0 ? 'Complete' : `${s.missing} Pending`}
          </span>
        </td>
        <td class="text-center">
          <button class="btn btn-secondary btn-enter-status" data-id="${hw.id}">Status</button>
          <button class="btn btn-secondary btn-edit-homework" data-id="${hw.id}">Edit</button>
          <button class="btn btn-secondary btn-delete-homework" data-id="${hw.id}">Delete</button>
        </td>
      </tr>`);
    });

    if (!list.length) {
      empty.innerHTML = '<div class="p-4 text-center text-muted" style="padding: 20px;">No homework assignments found.</div>';
    }

    renderStats();
    updateNotifications();
  }

  // --- 6. Modal Controls & Form Submissions ---
 // --- 6. Modal Controls & Form Submissions ---
  function openModal(edit) {
    populateClasses(); // Re-populate classes dropdown

    if (edit) {
      if ($('modal-title'))$('modal-title').textContent = 'Edit Homework';
      if ($('homework-id'))$('homework-id').value = edit.id;
      if ($('homework-class'))$('homework-class').value = edit.classId;
      if ($('homework-title'))$('homework-title').value = edit.title;
      if ($('homework-description'))$('homework-description').value = edit.description || '';
      if ($('homework-due-date'))$('homework-due-date').value = edit.dueDate;
      if ($('homework-total-points'))$('homework-total-points').value = edit.totalPoints || 10;
    } else {
      if (form) form.reset();
      if ($('homework-id'))$('homework-id').value = '';
      if ($('modal-title'))$('modal-title').textContent = 'Create New Homework';
    }

    if (modal) {
      modal.classList.remove('hidden');
    }
  }

  function closeModal() {
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  // Click handler for your exact button: id="btn-open-create-modal"
  const createBtn = $('btn-open-create-modal');
  if (createBtn) {
    createBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  }

  // Close modal handlers (Cancel / X buttons)
  document.querySelectorAll('.closeHomeworkModal, .btn-close').forEach(b => {
    b.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal();
    });
  });

  // Submit Homework Form
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const id = $('homework-id').value;
      const data = {
        title: $('homework-title').value.trim(),
        classId: $('homework-class').value,
        description: $('homework-description').value.trim(),
        dueDate: $('homework-due-date').value,
        totalPoints: Number($('homework-total-points').value)
      };

      if (id) {
        const idx = homework.findIndex(h => h.id === id);
        if (idx > -1) homework[idx] = { ...homework[idx], ...data };
      } else {
        const n = homework.reduce((m, h) => Math.max(m, Number(h.id.replace('HW', '')) || 0), 0) + 1;
        homework.unshift({ id: `HW${String(n).padStart(3, '0')}`, ...data, isHidden: false });
      }

      saveHomework();
      renderTable();
      closeModal();
    });
  }

/*   const createBtn = $('btn-open-create-modal');
  if (createBtn) {
    createBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  } */

  document.querySelectorAll('.closeHomeworkModal, .btn-close').forEach(b => {
    b.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal();
    });
  });

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const id = $('homework-id').value;
      const data = {
        title: $('homework-title').value.trim(),
        classId: $('homework-class').value,
        description: $('homework-description').value.trim(),
        dueDate: $('homework-due-date').value,
        totalPoints: Number($('homework-total-points').value)
      };

      if (id) {
        const idx = homework.findIndex(h => h.id === id);
        if (idx > -1) homework[idx] = { ...homework[idx], ...data };
      } else {
        const n = homework.reduce((m, h) => Math.max(m, Number(h.id.replace('HW', '')) || 0), 0) + 1;
        homework.unshift({ id: `HW${String(n).padStart(3, '0')}`, ...data, isHidden: false });
      }

      saveHomework();
      renderTable();
      closeModal();
    });
  }

  // --- 7. Table Button Actions ---
  homeworkBody.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const id = btn.dataset.id;
    const hw = homework.find(h => h.id === id);
    if (!hw) return;

    if (btn.classList.contains('btn-enter-status')) {
      location.href = `homework-status.html?homeworkId=${encodeURIComponent(id)}`;
    }
    if (btn.classList.contains('btn-edit-homework')) {
      openModal(hw);
    }
    if (btn.classList.contains('btn-delete-homework')) {
      hw.isHidden = true;
      saveHomework();
      renderTable();
    }
  });

  $('homework-search').addEventListener('input', renderTable);
  filterClass.addEventListener('change', renderTable);

  // --- 8. Upcoming Notifications ---
  const bellBtn = $('notification-bell-btn');
  const badge = $('notification-badge');
  const dropdown = $('notification-dropdown');
  const listEl = $('notification-list');
  const markReadBtn = $('mark-all-read-btn');

  let readNotifications = JSON.parse(localStorage.getItem('edu_read_hw_notifications')) || [];

  function updateNotifications() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeHomework = homework.filter(h => !h.isHidden && !h.isDeleted);
    const upcomingList = [];

    activeHomework.forEach(hw => {
      const due = new Date(hw.dueDate);
      due.setHours(0, 0, 0, 0);

      const diffTime = due - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays >= 0 && diffDays <= 3) {
        upcomingList.push({ id: hw.id, title: hw.title, dueDate: hw.dueDate, diffDays: diffDays });
      }
    });

    const unread = upcomingList.filter(item => !readNotifications.includes(item.id));

    if (unread.length > 0) {
      badge.textContent = unread.length;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }

    listEl.innerHTML = '';
    if (upcomingList.length === 0) {
      listEl.innerHTML = '<div style="padding: 12px;" class="text-center text-muted small">No upcoming homework due soon.</div>';
    } else {
      upcomingList.forEach(item => {
        let text = item.diffDays === 0 ? 'due today' : item.diffDays === 1 ? 'due tomorrow' : `due in ${item.diffDays} days`;
        const isRead = readNotifications.includes(item.id);
        const itemEl = document.createElement('div');
        itemEl.className = `notification-item ${isRead ? 'read' : 'unread'}`;
        itemEl.innerHTML = `<div class="notification-text"><strong>${escapeHtml(item.title)}</strong> is ${text} (${item.dueDate}).</div>`;
        listEl.appendChild(itemEl);
      });
    }
  }

  if (bellBtn) {
    bellBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('hidden');
    });
  }

  if (markReadBtn) {
    markReadBtn.addEventListener('click', () => {
      const activeHomework = homework.filter(h => !h.isHidden && !h.isDeleted);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      activeHomework.forEach(hw => {
        const due = new Date(hw.dueDate);
        due.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays <= 3 && !readNotifications.includes(hw.id)) {
          readNotifications.push(hw.id);
        }
      });

      localStorage.setItem('edu_read_hw_notifications', JSON.stringify(readNotifications));
      updateNotifications();
    });
  }

  document.addEventListener('click', (e) => {
    if (dropdown && !dropdown.contains(e.target) && !bellBtn.contains(e.target)) {
      dropdown.classList.add('hidden');
    }
  });

  // --- Initialize App ---
  populateClasses();
  renderTable();
});

function formatDate(value) {
  return value ? new Date(value).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';
}
document.addEventListener("DOMContentLoaded", () => {
  renderHomeworkStatusTable();
  setupPrintReport();
  setupFilterListener();
});

// 1. Setup Print PDF Functionality
function setupPrintReport() {
  const printBtn = document.querySelector("#print-report");
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }
}

// 2. Setup Filter Event Listener
function setupFilterListener() {
  const filterSelect = document.querySelector("#status-filter");
  if (filterSelect) {
    filterSelect.addEventListener("change", () => {
      renderHomeworkStatusTable();
    });
  }
}

// 3. Render Homework Table and Stats
function renderHomeworkStatusTable() {
  // Fetch data from localStorage
  const storedData = localStorage.getItem("homeworkSubmissions");
  const students = storedData ? JSON.parse(storedData) : [];

  // Target DOM elements
  const tbody = document.querySelector("#status-table-body") || document.querySelector("table tbody");
  const submittedCountEl = document.querySelector("#status-submitted-count");
  const notSubmittedCountEl = document.querySelector("#status-missing-count");
  const totalStudentsCountEl = document.querySelector("#status-total-count");
  const filterValue = document.querySelector("#status-filter")?.value || "all";

  let submittedCount = 0;
  let notSubmittedCount = 0;
  let displayIndex = 0; // Tracks consecutive row numbers (1, 2, 3...) for rendered rows

  // Clear existing table rows
  tbody.innerHTML = "";

  // Calculate totals and render filtered rows
  students.forEach((student, arrayIndex) => {
    const isSubmitted = student.status === "Submitted";
    
    // Update summary counts for total statistics
    if (isSubmitted) {
      submittedCount++;
    } else {
      notSubmittedCount++;
    }

    // Apply Filter Logic
    if (filterValue === "submitted" && !isSubmitted) return;
    if (filterValue === "not-submitted" && isSubmitted) return;

    // Increment display index only for rows that pass the filter
    displayIndex++;

    // Build Table Row
    const row = document.createElement("tr");
    const badgeClass = isSubmitted ? "badge bg-success" : "badge bg-danger";

    row.innerHTML = `
      <td>${displayIndex}</td>
      <td>${student.studentName}</td>
      <td>${student.dateTime || "—"}</td>
      <td>
        <span 
          class="${badgeClass} status-toggle-badge" 
          data-index="${arrayIndex}" 
          title="Click to toggle status"
        >
          ${student.status}
        </span>
      </td>
    `;

    tbody.appendChild(row);
  });

  // Update Summary Stats Cards
  if (submittedCountEl) submittedCountEl.textContent = submittedCount;
  if (notSubmittedCountEl) notSubmittedCountEl.textContent = notSubmittedCount;
  if (totalStudentsCountEl) totalStudentsCountEl.textContent = students.length;

  // Toggle Status Click Handler
  if (tbody) {
    tbody.onclick = (event) => {
      const badge = event.target.closest(".status-toggle-badge");
      if (!badge) return;

      const studentIndex = badge.dataset.index;
      const currentStatus = students[studentIndex].status;

      if (currentStatus === "Submitted") {
        students[studentIndex].status = "Not Submitted";
      } else {
        students[studentIndex].status = "Submitted";
        students[studentIndex].dateTime = new Date().toLocaleString([], {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });
      }

      localStorage.setItem("homeworkSubmissions", JSON.stringify(students));
      renderHomeworkStatusTable();
    };
  }
}