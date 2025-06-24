const form = document.getElementById('form')
const firstname_input = document.getElementById('firstname-input')
const email_input = document.getElementById('email-input')
const password_input = document.getElementById('password-input')
const repeatpassword_input = document.getElementById('repeat-password-input')

form.addEventListener('submit', (e) =>{
    // e.preventDefault()
    let errors = [];
    if(firstname_input){
        errors = getSignupFormErrors(firstname_input.value, email_input.value, password_input.value, repeatpassword_input.value)
    }
    else{
        errors = getLoginFormErrors(email_input.value, password_input.value)
    }
    if(errors.length > 0) {
        e.preventDefault()
    }
})
function getSignupFormErrors(firstname, email, password, repeatPasswor){
    let errors = []
    if(firstname==''||firstname== null){
        errors.push('Firstname is required')
        firstname_input.parentElement.classList.add('incorrect')
    }
    if(email==''||email== null){
        errors.push('Email is required')
        email_input.parentElement.classList.add('incorrect')
    }
    if(password==''||password== null){
        errors.push('Password is required')
        password_input.parentElement.classList.add('incorrect')
    }
    
     return errors; 
}