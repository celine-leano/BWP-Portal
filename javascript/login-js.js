/*
CodedInk
BWP-Portal/javascript/login-js.js
Script for login page
 */
let loginForm = document.getElementById('login-form');

loginForm.onsubmit = function (e) {
    let username = document.getElementById('username-input').value;
    let password = document.getElementById('password-input').value;
    let loginErr = document.getElementById('loginErr');

    $.ajax({
        url: 'https://bwp-app.herokuapp.com/api/auth/rlogin',
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
          "username": username,
          "password": password
        }),
        success: function (result) {
            var token = result.token;
            window.localStorage.setItem('token', token);
            startSession();
            return true;
        },
        error: displayLoginError()
    });
    
    function displayLoginError()
    {
        loginErr.classList.remove('d-none');
        e.preventDefault();
        return false;
    }

    /**
     * Starts session to verify that user is logged in and redirects to dashboard
     */
    function startSession()
    {
        $.ajax({
            url: 'model/start-session.php',
            type: 'POST',
            success: function (result) {
                location.href = "http://codedink.greenriverdev.com/BWP-Portal/dashboard";
            }
        })
    }
};
