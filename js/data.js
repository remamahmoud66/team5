// export function getTeachers() {
//     let teacher = JSON.parse(localStorage.getItem('teachers')) || [];
    
   
//     if (teachers.length === 0) {
//       teacher.push({
//         id:"T000",
//         fullName:"mohammad haitham",
//         degree:"Bachelor's CS",
//         phone:"0788123413",
//         BD:"10-10-2000",
//         password:"mo12345"

//       })
//         saveTeacher(teacher);
//     }
    
//     return teacher;
// }


// export function saveTeacher(teacherArray) {
//     localStorage.setItem('teachers', JSON.stringify(teacherArray));
// }



// export function setCurrentteacher(teacher) {
//     localStorage.setItem('currentTeacher', JSON.stringify(teacher));
// }

// export function getCurrentTeacher() {
//     return JSON.parse(localStorage.getItem('currentTeacher'));
// }


const TEACHER_KEY = 'teachers';

export function getTeachers() {
    const data = localStorage.getItem(TEACHER_KEY);
    return data ? JSON.parse(data) : [];
}

export function saveTeachers(teacherObj) {
    const teachers = getTeachers();
    teachers.push(teacherObj);
    localStorage.setItem(TEACHER_KEY , JSON.stringify(teachers));
}

export function getCurrentTeacher() {
    const data = localStorage.getItem('currentTeacher') || sessionStorage.getItem('currentTeacher');
    return data ? JSON.parse(data) : null;
}
export function updateTeacher(updatedTeacher) {

localStorage.setItem(
    "currentTeacher",
    JSON.stringify(updatedTeacher)
);

}
export function logout() {
    localStorage.removeItem('currentTeacher');
    sessionStorage.removeItem('currentTeacher');
    // Works from both root and pages/ directory
    const isInPages = window.location.pathname.includes('/pages/');
    window.location.href = isInPages ? '../login.html' : './login.html';
}
