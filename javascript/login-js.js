function validate(e)
{
    let email = document.getElementById('email-input').value;
    let password = document.getElementById('password-input').value;
    let loginErr = document.getElementById('loginErr');
    let isValid = true;

    // loginErr.classList.add('d-none');

    //display error if login is invalid
    if(email !== "admin" || password !== "admin")
    {
        loginErr.classList.remove('d-none');
        isValid = false;
    }

    if(!isValid)
    {
        e.preventDefault();
    }

    return isValid;
}