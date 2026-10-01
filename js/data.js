export function getTeachers() {
    let teacher = JSON.parse(localStorage.getItem('teachers')) || [];
    
   
    if (teachers.length === 0) {
      teacher.push({
        id:"T000",
        fullName:"mohammad haitham",
        degree:"Bachelor's CS",
        phone:"0788123413",
        BD:"10-10-2000",
        password:"mo12345"

      })
        saveTeacher(teacher);
    }
    
    return teacher;
}


export function saveTeacher(teacherArray) {
    localStorage.setItem('teachers', JSON.stringify(teacherArray));
}



export function setCurrentteacher(teacher) {
    localStorage.setItem('currentTeacher', JSON.stringify(teacher));
}

export function getCurrentTeacher() {
    return JSON.parse(localStorage.getItem('currentTeacher'));
}


export function logout() {
    localStorage.removeItem('currentTeacher'); 
    window.location.href = 'login.html'; 
}