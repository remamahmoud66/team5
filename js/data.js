export function getTeacher() {
    let teacher = JSON.parse(localStorage.getItem('teachers')) || [];
    
   
    if (!teacher) {
      teacher.push({
        id:0,
        fullName:"mohammad haitham",
        degree:"Bachelor's CS",
        phone:"0788123413",
        password:"mo12345"

      })
        saveTeacher(teacher);
    }
    
    return users;
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