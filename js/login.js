import { getTeachers ,  getCurrentTeacher } from './data.js';

const loginForm = document.querySelector('.login-form');
const email = document.getElementById('email');
const emailMessage = document.querySelector('.email-message');
const password= document.getElementById('password');
const passwordMessage = document.querySelector('.password-message');
const rememberMe = document.getElementById('remember-me');
const registerBtn = document.querySelector('.register-btn');


const notyf = new Notyf({
    duration: 2000, 
    position: {
        x: 'right', 
        y: 'top',   
    },
    dismissible: true 
});


loginForm.addEventListener('submit' , (event)=>{
    event.preventDefault();
    const currentTeachers = getTeachers();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const passwordValue = password.value;
    const emailValue = email.value.trim();
    if (!isEmailValid || !isPasswordValid) {
        return;
    } 

    const teacherData = currentTeachers.find(teacher => 
        (teacher.email.toLowerCase() === emailValue.toLowerCase()) && (teacher.password === passwordValue)
    );

    localStorage.removeItem('currentTeacher');
    sessionStorage.removeItem('currentTeacher');

    const storage = rememberMe.checked ? localStorage : sessionStorage
      
    storage.setItem('currentTeacher', JSON.stringify(teacherData));

    notyf.success('Login successful!');

    setTimeout(() => {
        window.location.href = '../pages/dashboard.html';
    }, 1200);

})

function validateEmail() {
    const emailValue = email.value.trim();

    if (emailValue === '') {
        emailMessage.textContent = 'Enter your email.';
        email.style.borderColor = '#EF4444';
        return false;
    }

    const currentTeachers = getTeachers();
    const isEmailExist = currentTeachers.find(teacher => teacher.email.toLowerCase() === emailValue.toLowerCase());
    
    if (!isEmailExist) {
        emailMessage.textContent = "This email does not exist.";
        email.style.borderColor = '#EF4444';
        return false;
    }

    emailMessage.textContent = '';
    email.style.borderColor = '#E5E7EB';
    return true;
}

function validatePassword() {
    const passwordValue = password.value;

    if (passwordValue === '') {
        passwordMessage.textContent = 'Enter your password.';
        password.style.borderColor = '#EF4444';
        return false;
    }

    const emailValue = email.value.trim().toLowerCase();
    const currentTeachers = getTeachers();
    
  
    const teacherData = currentTeachers.find(teacher => 
        (teacher.email.toLowerCase() === emailValue) && (teacher.password === passwordValue)
    );

    if (!teacherData) {
        passwordMessage.textContent = "Incorrect Email or password.";
        password.style.borderColor = '#EF4444';
        return false;
    }

    passwordMessage.textContent = '';
    password.style.borderColor = '#E5E7EB';
    return true;
}


email.addEventListener('blur', validateEmail);

email.addEventListener('focus', () => {
    email.style.borderColor = '#FFD900';
});

password.addEventListener('blur', validatePassword);

password.addEventListener('focus', () => {
    password.style.borderColor = '#FFD900';
});


registerBtn.addEventListener('click',(event)=>{
    event.preventDefault();
    window.location.href = './register.html';
})