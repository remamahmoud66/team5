import { saveTeachers , getTeachers   } from './data.js';

const registerForm = document.querySelector('.register-form');
const fullName        = document.getElementById('fullName');
const fullNameMessage = document.querySelector('.fullName-message');
const birthDate       = document.getElementById('birthDate');
const birthDateMessage   = document.querySelector('.birthDate-message');
const degree  = document.getElementById('degree');
const degreeMessage   = document.querySelector('.degree-message');
const phone           = document.getElementById('phone');
const phoneMessage    = document.querySelector('.phone-message');
const email           = document.getElementById('email');
const emailMessage    = document.querySelector('.email-message');
const password        = document.getElementById('password');
const passwordMessage = document.querySelector('.password-message');
const confirmPassword  = document.getElementById('confirmPassword');
const confirmPasswordMessage  = document.querySelector('.confirmPassword-message');
const loginBtn = document.querySelector('.login-btn');

const notyf = new Notyf({
    duration: 2000,
    position: {
        x: 'right',  
        y: 'top',    
    },
    dismissible: true 
});

 
registerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const currentTeachers = getTeachers();
    const isNameValid        = validateFullName();
    const isBirthDateValid    = validateBirthDate();
    const isDegreeValid    = validateDegree();
    const isPhoneValid       = validataPhoneNum();
    const isEmailValid       = validateEmail();
    const isPasswordValid    = validatePassword();
    const isConfirmPassValid = validateConfirmPassword();

    if(
        !isNameValid || 
        !isPhoneValid || 
        !isEmailValid || 
        !isPasswordValid || 
        !isConfirmPassValid || 
        !isBirthDateValid || 
        !isDegreeValid
    ) {
        return;
    }


    
    const maxTeacherNumber = currentTeachers.reduce((max, teacher) => {
        const match = String(teacher.id || '').match(/^T(\d+)$/i);
        return Math.max(max, match ? Number(match[1]) : 0);
    }, 0);
    const teacherId = `T${String(maxTeacherNumber + 1).padStart(3, '0')}`;

    const newTeacher = {
        id:teacherId,
        fullName : fullName.value.trim(),
        birthDate : birthDate.value,
        degree : degree.value.trim(),
        phone : phone.value.trim(),
        email : email.value.trim().toLowerCase(),
        password : password.value,
    }
    saveTeachers(newTeacher);



    notyf.success('Account created successfully!');
    
    setTimeout(()=>{
        window.location.href = './login.html';
    }, 1200)

    registerForm.reset();
})

function validateFullName(){
   const fullNameValue = fullName.value.trim();

   if(fullNameValue === ''){
    fullNameMessage.textContent = 'Full name is required.'
    fullName.style.borderColor = '#EF4444';
    return false;
   }

 
    const nameRegex = /^[a-zA-Z\u0600-\u06FF\s]+$/;
    const nameParts = fullNameValue.split(/\s+/);

    if(!nameRegex.test(fullNameValue)){
        fullNameMessage.textContent = 'Name should only contain letters.';
        fullName.style.borderColor = '#EF4444';
        return false;
    }

    if(nameParts.length < 2){
        fullNameMessage.textContent = 'Please enter at least your first and last name.';
        fullName.style.borderColor = '#EF4444';
        return false;
    }

    fullNameMessage.textContent = '';
    fullName.style.borderColor = '#E5E7EB';
    return true;

}

function validateBirthDate(){
    const birthDateValue = birthDate.value;

    if(birthDateValue === ''){
        birthDateMessage.textContent = 'Birth Date is required.';
        birthDate.style.borderColor = '#EF4444';
        return false;
    }

    birthDateMessage.textContent = '';
    birthDate.style.borderColor = '#E5E7EB';
    return true;
}

function validateDegree(){
    const degreeValue = degree.value.trim();

    if(degreeValue === ''){
        degreeMessage.textContent = 'Degree is required.';
        degree.style.borderColor = '#EF4444';
        return false;
    }

    degreeMessage.textContent = '';
    degree.style.borderColor = '#E5E7EB';
    return true;
}

function validataPhoneNum(){
   const phoneValue = phone.value.trim();

   if(phoneValue === ''){
    phoneMessage.textContent = 'Phone number is required.'
    phone.style.borderColor = '#EF4444';
    return false;
   }
    const digitsOnlyRegex = /^\d+$/;
    const jordanPhoneRegex = /^07\d{8}$/;
   if(!digitsOnlyRegex.test(phoneValue)){
    phoneMessage.textContent = 'Should be contain numbers only.'
    phone.style.borderColor = '#EF4444';
    return false;
   }

   if(!jordanPhoneRegex.test(phoneValue)){
    phoneMessage.textContent = 'Please enter a valid jordanian phone number'
    phone.style.borderColor = '#EF4444';
    return false;
   }

    const isPhoneExist = getTeachers().find((teacher) => String(teacher.phone || '').trim() === phoneValue);
    if(isPhoneExist){
        phoneMessage.textContent = 'This number is already registered.';
        phone.style.borderColor = '#EF4444';
        return false;
    }
   
   phoneMessage.textContent = "";
   phone.style.borderColor = '#E5E7EB';
   return true;

}

function validateEmail() {
    const emailValue = email.value.trim();

  
    if (emailValue === '') {
        emailMessage.textContent = 'Email is required.';
        email.style.borderColor = '#EF4444';
        return false;
    }

  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

   
    if (!emailRegex.test(emailValue)) {
        emailMessage.textContent = 'Please enter a valid email address.';
        email.style.borderColor = '#EF4444';
        return false;
    }

    

    const isEmailExist = getTeachers().find( teacher => teacher.email.toLowerCase() === email.value.trim().toLowerCase());
    if(isEmailExist){
        emailMessage.textContent = "This email is already registered."
        email.style.borderColor = '#EF4444';
        return false;
    }


   
    emailMessage.textContent = '';
    email.style.borderColor = '#E5E7EB';
    return true;
}

function validatePassword(){
    const passwordValue = password.value;

    if(passwordValue === ''){
        passwordMessage.textContent = 'Password is required.';
        password.style.borderColor = '#EF4444';
        return false;
    }

    if (passwordValue.length < 8) {
        passwordMessage.textContent = 'Password must be at least 8 characters long.';
        password.style.borderColor = '#EF4444';
        return false;
    }

    
    const strongPasswordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/])/;

    if (!strongPasswordRegex.test(passwordValue)) {
    passwordMessage.textContent = 'at least one uppercase letter and one special character.';
    password.style.borderColor = '#EF4444';
    return false;
    }

    passwordMessage.textContent = '';
    password.style.borderColor = '#E5E7EB';

    if (confirmPassword.value !== '') {
        validateConfirmPassword();
    }

    return true;
}

function validateConfirmPassword(){
    const passwordValue = password.value;
    const confirmPasswordValue = confirmPassword.value;

    if(confirmPasswordValue === ''){
        confirmPasswordMessage.textContent = 'Please confirm your password.';
        confirmPassword.style.borderColor = '#EF4444';
        return false;
    }

    if(confirmPasswordValue !== passwordValue){
        confirmPasswordMessage.textContent = 'Passwords do not match.';
        confirmPassword.style.borderColor = '#EF4444';
        return false;
    }

    confirmPasswordMessage.textContent = '';
    confirmPassword.style.borderColor = '#E5E7EB';
    return true;
}


fullName.addEventListener('blur', validateFullName);

fullName.addEventListener('focus', () => {
    fullName.style.borderColor = '#FFD900';
});

birthDate.addEventListener('blur', validateBirthDate);

birthDate.addEventListener('focus', () => {
    birthDate.style.borderColor = '#FFD900';
});

degree.addEventListener('blur', validateDegree);

degree.addEventListener('focus', () => {
    degree.style.borderColor = '#FFD900';
});


phone.addEventListener('blur', validataPhoneNum);

phone.addEventListener('focus', () => {
    phone.style.borderColor = '#FFD900';
});


email.addEventListener('blur', validateEmail);


email.addEventListener('focus', () => {
    email.style.borderColor = '#FFD900';
});



password.addEventListener('blur', validatePassword);


password.addEventListener('focus', () => {
    password.style.borderColor = '#FFD900';
});


confirmPassword.addEventListener('blur', validateConfirmPassword);


confirmPassword.addEventListener('focus', () => {
    confirmPassword.style.borderColor = '#FFD900';
});


loginBtn.addEventListener('click',(event)=>{
    event.preventDefault();
    window.location.href = './login.html';
}); 
