/* (function () {
  'use strict';
  function localDateISO(){var d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
  document.addEventListener('DOMContentLoaded', function () {
    if (!window.EvolviaApp) return;
    var $=function(id){return document.getElementById(id)}, teacher=EvolviaApp.getUser(), params=new URLSearchParams(window.location.search), homeworkId=params.get('homeworkId');
    var homework=EvolviaApp.read('homeworks').find(function(h){return h.id===homeworkId && (!h.teacherId || h.teacherId===teacher.id)}), classes=EvolviaApp.read('classes').filter(function(c){return !c.teacherId || c.teacherId===teacher.id}), students=EvolviaApp.read('students'), statuses=EvolviaApp.read('homeworkStatuses');
    var table=$('status-table-body'), filter=$('status-filter');
    function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]})}
    function cls(){return classes.find(function(c){return c.id===homework?.classId})}
    function roster(){var ids=cls()?.studentIds||[];return students.filter(function(s){return ids.includes(s.id)})}
    function record(id){return statuses.find(function(s){return s.homeworkId===homeworkId&&s.studentId===id})}
    function save(){EvolviaApp.write('homeworkStatuses',statuses);EvolviaApp.syncLegacyEduKeys();}
    function render(){if(!homework){$('status-page-title').textContent='Homework Not Found';table.innerHTML='';return;}var c=cls(), list=roster(), selected=filter.value; $('status-page-title').textContent=(homework.title||'Homework')+' — Submission Status'; $('status-page-subtitle').textContent=(c?.name||'Class')+' · Due '+(homework.deadline||'—'); var rows=list.map(function(st){var r=record(st.id),status=r?.status||'Not Submitted';return {st:st,r:r,status:status}}).filter(function(x){return selected==='all'||x.status===selected}); $('status-submitted-count').textContent=list.filter(function(st){return record(st.id)?.status==='Submitted'}).length; $('status-missing-count').textContent=list.filter(function(st){return record(st.id)?.status!=='Submitted'}).length; $('status-total-count').textContent=list.length; table.innerHTML=rows.length?rows.map(function(x){return '<tr><td>'+esc(x.st.id)+'</td><td>'+esc(x.st.fullName)+'</td><td>'+esc(x.r?.updatedAt||'—')+'</td><td><button class="status-toggle-badge '+(x.status==='Submitted'?'status-complete':'status-pending')+'" data-student-id="'+esc(x.st.id)+'">'+esc(x.status)+'</button></td></tr>'}).join(''):'<tr><td colspan="4" class="text-center">No students match this status.</td></tr>';}
    table.addEventListener('click',function(e){var btn=e.target.closest('.status-toggle-badge');if(!btn)return;var sid=btn.dataset.studentId,r=record(sid),index=statuses.findIndex(function(s){return s.homeworkId===homeworkId&&s.studentId===sid}),next=r?.status==='Submitted'?'Not Submitted':'Submitted',obj={id:r?.id||('HWS'+Date.now()),homeworkId:homeworkId,studentId:sid,status:next,updatedAt:localDateISO()};if(index>=0)statuses[index]=Object.assign({},statuses[index],obj);else statuses.push(obj);save();render();});
    filter.addEventListener('change',render);$('print-report').addEventListener('click',function(){window.print()});render();
  });
})();
 */

(function () {
  'use strict';
  
  function localDateISO() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!window.EvolviaApp) return;

    var $ = function (id) { return document.getElementById(id); };
    var teacher = EvolviaApp.getUser();
    var params = new URLSearchParams(window.location.search);
    var homeworkId = params.get('homeworkId');

    var homework = EvolviaApp.read('homeworks').find(function (h) {
      return h.id === homeworkId && (!h.teacherId || h.teacherId === teacher.id);
    });
    var classes = EvolviaApp.read('classes').filter(function (c) {
      return !c.teacherId || c.teacherId === teacher.id;
    });
    var students = EvolviaApp.read('students');
    var statuses = EvolviaApp.read('homeworkStatuses');

    var table = $('status-table-body');
    var filter = $('status-filter');

    function esc(v) {
      return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
        return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
      });
    }

    function cls() {
      return classes.find(function (c) { return c.id === homework?.classId; });
    }

    function roster() {
      var ids = cls()?.studentIds || [];
      return students.filter(function (s) { return ids.includes(s.id); });
    }

    function record(id) {
      return statuses.find(function (s) { return s.homeworkId === homeworkId && s.studentId === id; });
    }

    function save() {
      EvolviaApp.write('homeworkStatuses', statuses);
      EvolviaApp.syncLegacyEduKeys();
    }

    function render() {
      if (!homework) {
        $('status-page-title').textContent = 'Homework Not Found';
        table.innerHTML = '';
        return;
      }

      var c = cls();
      var list = roster();
      var selected = filter.value;

      $('status-page-title').textContent = (homework.title || 'Homework') + ' — Submission Status';
      $('status-page-subtitle').textContent = (c?.name || 'Class') + ' · Due ' + (homework.deadline || '—');

      var rows = list.map(function (st) {
        var r = record(st.id);
        var status = r?.status || 'Not Submitted';
        return { st: st, r: r, status: status };
      }).filter(function (x) {
        if (selected === 'all') return true;
        // Normalize status string so "Submitted" / "Not Submitted" match "submitted" / "not-submitted"
        var normStatus = x.status.toLowerCase().replace(/\s+/g, '-');
        return normStatus === selected;
      });

      $('status-submitted-count').textContent = list.filter(function (st) {
        return record(st.id)?.status === 'Submitted';
      }).length;

      $('status-missing-count').textContent = list.filter(function (st) {
        return record(st.id)?.status !== 'Submitted';
      }).length;

      $('status-total-count').textContent = list.length;

      table.innerHTML = rows.length ? rows.map(function (x) {
        return '<tr>' +
          '<td>' + esc(x.st.id) + '</td>' +
          '<td>' + esc(x.st.fullName) + '</td>' +
          '<td>' + esc(x.r?.updatedAt || '—') + '</td>' +
          '<td><button class="status-toggle-badge ' + (x.status === 'Submitted' ? 'status-complete' : 'status-pending') + '" data-student-id="' + esc(x.st.id) + '">' + esc(x.status) + '</button></td>' +
        '</tr>';
      }).join('') : '<tr><td colspan="4" class="text-center">No students match this status.</td></tr>';
    }

    table.addEventListener('click', function (e) {
      var btn = e.target.closest('.status-toggle-badge');
      if (!btn) return;

      var sid = btn.dataset.studentId;
      var r = record(sid);
      var index = statuses.findIndex(function (s) { return s.homeworkId === homeworkId && s.studentId === sid; });
      var next = r?.status === 'Submitted' ? 'Not Submitted' : 'Submitted';
      var obj = {
        id: r?.id || ('HWS' + Date.now()),
        homeworkId: homeworkId,
        studentId: sid,
        status: next,
        updatedAt: localDateISO()
      };

      if (index >= 0) {
        statuses[index] = Object.assign({}, statuses[index], obj);
      } else {
        statuses.push(obj);
      }

      save();
      render();
    });

    filter.addEventListener('change', render);

    var printBtn = $('print-report');
    if (printBtn) {
      printBtn.addEventListener('click', function () {
        window.print();
      });
    }

    render();
  });
})();