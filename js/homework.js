(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    if (!window.EvolviaApp) return;
    var teacher = EvolviaApp.getUser();
    var classes = EvolviaApp.read('classes').filter(function (c) { return !c.teacherId || c.teacherId === teacher.id; });
    var students = EvolviaApp.read('students');
    var homework = EvolviaApp.read('homeworks').filter(function (h) { return !h.teacherId || h.teacherId === teacher.id; });
    var statuses = EvolviaApp.read('homeworkStatuses');
    var $ = function (id) { return document.getElementById(id); };
    var filterClass = $('filter-class'), body = $('homework-table-body'), form = $('homework-form'), modal = $('homework-modal');

    function esc(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]; }); }
    function classStudents(classId) {
      var cls = classes.find(function (c) { return c.id === classId; });
      var ids = cls && Array.isArray(cls.studentIds) ? cls.studentIds : [];
      return students.filter(function (s) { return ids.includes(s.id); });
    }
    function getClass(id) { return classes.find(function (c) { return c.id === id; }); }
    function getStatuses(hwId) { return statuses.filter(function (s) { return s.homeworkId === hwId; }); }
    function summary(hw) {
      var list = classStudents(hw.classId), studentIds = new Set(list.map(function (st) { return st.id; })), records = getStatuses(hw.id).filter(function (s) { return studentIds.has(s.studentId); }), submitted = records.filter(function (s) { return s.status === 'Submitted'; });
      return { total:list.length, submitted:submitted.length, missing:Math.max(0, list.length-submitted.length), records:submitted };
    }
    function save() {
      var allHomeworks = EvolviaApp.read('homeworks');
      var currentIds = new Set(homework.map(function (h) { return h.id; }));
      var preserved = allHomeworks.filter(function (h) { return !currentIds.has(h.id) && h.teacherId !== teacher.id; });
      EvolviaApp.write('homeworks', preserved.concat(homework));
      EvolviaApp.write('homeworkStatuses', statuses);
      EvolviaApp.syncLegacyEduKeys();
    }
    function populateClasses() {
      filterClass.innerHTML='<option value="">All Classes</option>';
      $('homework-class').innerHTML='<option value="">Select a Class</option>';
      classes.forEach(function (c) {
        filterClass.insertAdjacentHTML('beforeend','<option value="'+esc(c.id)+'">'+esc(c.name)+'</option>');
        $('homework-class').insertAdjacentHTML('beforeend','<option value="'+esc(c.id)+'">'+esc(c.name)+'</option>');
      });
    }
    function renderStats() {
      var visible = homework.filter(function (h) { return !h.isHidden && !h.isDeleted; });
      var latest = visible[0], submittedEl=$('stat-submitted'), labelEl=$('stat-submitted-label');
      if (!latest) { submittedEl.textContent='0 / 0'; labelEl.textContent='No active homework assignments'; $('stat-last-submissions').innerHTML='<div class="text-muted small">No submissions available</div>'; $('stat-not-submitted').innerHTML='<div class="text-muted small">No pending assignments</div>'; return; }
      var s=summary(latest); submittedEl.textContent=s.submitted+' / '+s.total; labelEl.textContent=latest.title+' · '+(getClass(latest.classId)?.name||'Class');
      var last3=s.records.slice().sort(function(a,b){return String(b.updatedAt||'').localeCompare(String(a.updatedAt||''));}).slice(0,3);
      $('stat-last-submissions').innerHTML=last3.length?last3.map(function(r){var st=students.find(function(x){return x.id===r.studentId});return '<div class="stats-student-item"><span><strong>'+esc(st?.fullName||r.studentId)+'</strong></span><span class="badge badge-info">Submitted</span></div>';}).join(''):'<div class="text-muted small">No submissions yet</div>';
      var missing=classStudents(latest.classId).filter(function(st){var r=getStatuses(latest.id).find(function(x){return x.studentId===st.id});return !r||r.status!=='Submitted';}).slice(0,4);
      $('stat-not-submitted').innerHTML=missing.length?missing.map(function(st){return '<div class="stats-student-item"><span>'+esc(st.fullName)+'</span><span class="badge badge-danger">Pending</span></div>';}).join(''):'<div class="text-muted small">Everyone submitted</div>';
    }
    function renderTable() {
      var term=String($('homework-search').value||'').toLowerCase().trim(), selected=filterClass.value;
      var list=homework.filter(function(h){if(h.isHidden||h.isDeleted)return false;var cls=getClass(h.classId),name=String(cls?.name||'').toLowerCase();return (!selected||h.classId===selected)&&(!term||String(h.title||'').toLowerCase().includes(term)||name.includes(term));});
      body.innerHTML=''; $('empty-state-container').innerHTML=''; $('homework-count').textContent=list.length+' assignment'+(list.length===1?'':'s');
      list.forEach(function(hw,i){var cls=getClass(hw.classId),s=summary(hw),pct=s.total?Math.round(s.submitted/s.total*100):0; body.insertAdjacentHTML('beforeend','<tr><td><strong>'+String(i+1).padStart(2,'0')+'</strong></td><td><div class="exam-title-cell"><strong>'+esc(hw.title)+'</strong><small>'+esc(hw.description||'No description')+'</small></div></td><td>'+esc(cls?.name||'N/A')+'</td><td>'+esc(hw.deadline||'—')+'</td><td><strong>'+s.submitted+'/'+s.total+'</strong><div class="mini-progress"><span style="width:'+pct+'%"></span></div></td><td><span class="status-pill '+(s.missing===0?'status-complete':'status-pending')+'">'+(s.missing===0?'Complete':s.missing+' Pending')+'</span></td><td class="text-center"><button class="btn btn-secondary btn-enter-status" data-id="'+esc(hw.id)+'">Status</button><button class="btn btn-secondary btn-edit-homework" data-id="'+esc(hw.id)+'">Edit</button><button class="btn btn-secondary btn-delete-homework" data-id="'+esc(hw.id)+'">Delete</button></td></tr>');});
      if(!list.length)$('empty-state-container').innerHTML='<div class="p-4 text-center text-muted">No homework assignments found.</div>';
      renderStats();
    }
    function openModal(item){
      modal.classList.remove('hidden');
      if(item){$('modal-title').textContent='Edit Homework';$('homework-id').value=item.id;$('homework-class').value=item.classId;$('homework-title').value=item.title;$('homework-description').value=item.description||'';$('homework-due-date').value=item.deadline||'';$('homework-total-points').value=item.totalPoints||10;}
      else {form.reset();$('homework-id').value='';$('modal-title').textContent='Create New Homework';}
    }
    function closeModal(){modal.classList.add('hidden');}
    $('btn-open-create-modal').addEventListener('click',function(){openModal();});
    document.querySelectorAll('.closeHomeworkModal').forEach(function(btn){btn.addEventListener('click',closeModal);});
    form.addEventListener('submit',function(e){e.preventDefault();var id=$('homework-id').value, data={title:$('homework-title').value.trim(),classId:$('homework-class').value,description:$('homework-description').value.trim(),deadline:$('homework-due-date').value,totalPoints:Number($('homework-total-points').value),teacherId:teacher.id,isHidden:false};if(!data.classId||!data.title||!data.deadline)return;var existing;if(id){existing=homework.find(function(h){return h.id===id});if(existing)Object.assign(existing,data);}else{var allForId=EvolviaApp.read('homeworks');var max=allForId.reduce(function(m,h){return Math.max(m,Number(String(h.id||'').replace(/\D/g,''))||0)},0);existing=Object.assign({id:'HW'+String(max+1).padStart(3,'0')},data);homework.unshift(existing);EvolviaApp.ensureNotification('New homework "'+existing.title+'" created.','Homework',existing.id);};save();renderTable();closeModal();EvolviaApp.renderNotifications(teacher);});
    body.addEventListener('click',function(e){var btn=e.target.closest('button');if(!btn)return;var id=btn.dataset.id,item=homework.find(function(h){return h.id===id});if(!item)return;if(btn.classList.contains('btn-enter-status'))location.href='homework-status.html?homeworkId='+encodeURIComponent(id);if(btn.classList.contains('btn-edit-homework'))openModal(item);if(btn.classList.contains('btn-delete-homework')){item.isHidden=true;save();renderTable();EvolviaApp.ensureNotification('Homework "'+item.title+'" was archived.','Homework',item.id);EvolviaApp.renderNotifications(teacher);}});
    $('homework-search').addEventListener('input',renderTable);filterClass.addEventListener('change',renderTable);
    populateClasses();renderTable();
  });
})();
