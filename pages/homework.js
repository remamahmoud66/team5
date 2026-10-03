document.addEventListener('DOMContentLoaded', () => {
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

  const classes = JSON.parse(localStorage.getItem('edu_classes')) || initialClasses;
  const students = JSON.parse(localStorage.getItem('edu_students')) || JSON.parse(JSON.stringify(initialStudents));
  // Keep existing student records, but make the demo class large enough to show the requested 5/8 example.
  if (!students.c1) students.c1 = [];
  initialStudents.c1.forEach(seed => {
    if (!students.c1.some(existing => existing.id === seed.id)) students.c1.push(seed);
  });
  localStorage.setItem('edu_students', JSON.stringify(students));
  let homework = JSON.parse(localStorage.getItem('edu_homeworks')) || [
    { id:'HW001', title:'DOM Practice Task', description:'Build a small interactive DOM component.', classId:'c1', dueDate:'2026-10-04', totalPoints:10, isHidden:false },
    { id:'HW002', title:'Local Storage Exercise', description:'Create, read, update and remove LocalStorage data.', classId:'c1', dueDate:'2026-10-07', totalPoints:15, isHidden:false },
    { id:'HW003', title:'Python Functions Worksheet', description:'Practice function parameters and return values.', classId:'c2', dueDate:'2026-10-09', totalPoints:20, isHidden:false },
    { id:'HW004', title:'Responsive Layout Challenge', description:'Create a responsive page using CSS Grid and Flexbox.', classId:'c3', dueDate:'2026-10-12', totalPoints:25, isHidden:false }
  ];
  let statuses = JSON.parse(localStorage.getItem('edu_homework_statuses')) || [];

  // Demo: latest homework in c1 has exactly 5/8 submitted.
  if (!statuses.some(s => s.homeworkId === 'HW001')) {
    ['STU001','STU002','STU003','STU004','STU005'].forEach((studentId, i) => {
      statuses.push({ homeworkId:'HW001', studentId, status:'Submitted', submittedAt:new Date(Date.now() - (i+1)*3600000).toISOString() });
    });
    saveStatuses();
  }

  const saveHomework = () => localStorage.setItem('edu_homeworks', JSON.stringify(homework));
  function saveStatuses(){ localStorage.setItem('edu_homework_statuses', JSON.stringify(statuses)); }
  const $ = id => document.getElementById(id);

  const filterClass = $('filter-class'), homeworkBody = $('homework-table-body');
  const modal = $('homework-modal'), form = $('homework-form');
  const empty = $('empty-state-container');

  function populateClasses(){
    filterClass.innerHTML = '<option value="">All Classes</option>';
    $('homework-class').innerHTML = '<option value="">Select a Class</option>';
    classes.forEach(c => {
      filterClass.insertAdjacentHTML('beforeend', `<option value="${c.id}">${escapeHtml(c.name)}</option>`);
      $('homework-class').insertAdjacentHTML('beforeend', `<option value="${c.id}">${escapeHtml(c.name)}</option>`);
    });
  }

  function escapeHtml(value){ return String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
  function getClass(id){ return classes.find(c => c.id === id); }
  function getStudents(classId){ return students[classId] || []; }
  function getStatuses(hwId){ return statuses.filter(s => s.homeworkId === hwId); }
  function getStudentStatus(hwId, studentId){ return statuses.find(s => s.homeworkId === hwId && s.studentId === studentId); }

  function summary(hw){
    const list = getStudents(hw.classId);
    const records = getStatuses(hw.id);
    const submitted = records.filter(s => s.status === 'Submitted');
    return { total:list.length, submitted:submitted.length, missing:Math.max(0,list.length-submitted.length), submittedRecords:submitted };
  }

  function renderStats(){
    const visible = homework.filter(h => !h.isHidden);
    const latest = visible[0];
    if (!latest) return;
    const s = summary(latest);
    $('stat-submitted').textContent = `${s.submitted} / ${s.total}`;
    $('stat-submitted-label').textContent = `${latest.title} · ${getClass(latest.classId)?.name || 'Class'}`;
    const last3 = [...s.submittedRecords].sort((a,b)=>new Date(b.submittedAt)-new Date(a.submittedAt)).slice(0,3);
    $('stat-last-submissions').innerHTML = last3.length ? last3.map(r => {
      const stu = getStudents(latest.classId).find(x=>x.id===r.studentId);
      return `<div class="stats-student-item"><span><strong>${escapeHtml(stu?.name || r.studentId)}</strong></span><span class="badge badge-info">${formatDate(r.submittedAt)}</span></div>`;
    }).join('') : '<div class="text-muted small">No submissions yet</div>';
    const missing = getStudents(latest.classId).filter(stu => !getStudentStatus(latest.id,stu.id) || getStudentStatus(latest.id,stu.id).status !== 'Submitted').slice(0,4);
    $('stat-not-submitted').innerHTML = missing.length ? missing.map(stu=>`<div class="stats-student-item"><span>${escapeHtml(stu.name)}</span><span class="badge badge-danger">Pending</span></div>`).join('') : '<div class="text-muted small">Everyone submitted</div>';
  }

  function renderTable(){
    const term = $('homework-search').value.toLowerCase().trim();
    const selected = filterClass.value;
    const list = homework.filter(h => {
      if(h.isHidden) return false;
      const cls = getClass(h.classId); const name = (cls?.name || '').toLowerCase();
      return (!selected || h.classId === selected) && (!term || h.title.toLowerCase().includes(term) || name.includes(term));
    });
    homeworkBody.innerHTML='';
    empty.innerHTML='';
    $('homework-count').textContent = `${list.length} assignment${list.length===1?'':'s'}`;
    list.forEach((hw,i)=>{
      const cls=getClass(hw.classId); const s=summary(hw); const pct=s.total ? Math.round(s.submitted/s.total*100):0;
      homeworkBody.insertAdjacentHTML('beforeend', `<tr>
        <td><strong>${i+1}</strong></td>
        <td><div class="exam-title-cell"><strong>${escapeHtml(hw.title)}</strong><small>${escapeHtml(hw.description || 'No description')}</small></div></td>
        <td>${escapeHtml(cls?.name || 'N/A')}</td><td>${hw.dueDate}</td>
        <td><strong>${s.submitted}/${s.total}</strong><div class="mini-progress"><span style="width:${pct}%"></span></div></td>
        <td><span class="status-pill ${s.missing===0?'status-complete':'status-pending'}">${s.missing===0?'Complete':`Pending ${s.missing}`}</span></td>
        <td class="table-actions">
          <button class="btn-icon btn-info btn-enter-status" data-id="${hw.id}" title="Enter Status">✓</button>
          <button class="btn-icon btn-secondary btn-edit-homework" data-id="${hw.id}" title="Edit Homework">✎</button>
          <button class="btn-icon btn-danger btn-delete-homework" data-id="${hw.id}" title="Hide Homework">×</button>
        </td>
      </tr>`);
    });
    if(!list.length) empty.innerHTML='<div class="p-4 text-center text-muted">No homework found.</div>';
    renderStats();
  }

  function openModal(edit){
    if(edit){
      $('modal-title').textContent='Edit Homework'; $('homework-id').value=edit.id;
      $('homework-class').value=edit.classId; $('homework-title').value=edit.title;
      $('homework-description').value=edit.description || ''; $('homework-due-date').value=edit.dueDate;
      $('homework-total-points').value=edit.totalPoints || 10;
    } else { form.reset(); $('homework-id').value=''; $('modal-title').textContent='Create New Homework'; }
    modal.classList.remove('hidden');
  }
  function closeModal(){ modal.classList.add('hidden'); }

  $('btn-open-create-modal').addEventListener('click',()=>openModal());
  document.querySelectorAll('.closeHomeworkModal').forEach(b=>b.addEventListener('click',closeModal));
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const id=$('homework-id').value, data={title:$('homework-title').value.trim(),classId:$('homework-class').value,description:$('homework-description').value.trim(),dueDate:$('homework-due-date').value,totalPoints:Number($('homework-total-points').value)};
    if(id){ const idx=homework.findIndex(h=>h.id===id); if(idx>-1) homework[idx]={...homework[idx],...data}; }
    else { const n=homework.reduce((m,h)=>Math.max(m,Number(h.id.replace('HW',''))||0),0)+1; homework.unshift({id:`HW${String(n).padStart(3,'0')}`,...data,isHidden:false}); }
    saveHomework(); renderTable(); closeModal();
  });

  homeworkBody.addEventListener('click',e=>{
    const btn=e.target.closest('button'); if(!btn)return; const id=btn.dataset.id; const hw=homework.find(h=>h.id===id); if(!hw)return;
    if(btn.classList.contains('btn-enter-status')) location.href=`homework-status.html?homeworkId=${encodeURIComponent(id)}`;
    if(btn.classList.contains('btn-edit-homework')) openModal(hw);
    if(btn.classList.contains('btn-delete-homework')){ hw.isHidden=true; saveHomework(); renderTable(); }
  });
  $('homework-search').addEventListener('input',renderTable); filterClass.addEventListener('change',renderTable);
  populateClasses(); renderTable();
});

function formatDate(value){ return value ? new Date(value).toLocaleString([], {month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}) : '—'; }
