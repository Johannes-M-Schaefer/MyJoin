/**
 * Adds an event listener to the document that initializes the login page
 * once the DOM content is fully loaded.
 * 
 * @event DOMContentLoaded
 */
document.addEventListener("DOMContentLoaded", init);

/**
 * Initializes the login page by loading user data, setting up event listeners,
 * and populating the login form with saved credentials.
 */
async function init() {
    await loadUsers();
    await loadCurrentUsers();
    populateRememberMe();
    loginEventListener();
    
    checkOrientation();
    setInterval(checkOrientation, 500);
};

/**
 * Sets up event listeners for login form submission, guest login, and input error handling.
 */
async function loginEventListener() {
    docId('loginForm').addEventListener('submit', handleFormSubmit);
    docId('guest_login').addEventListener('click', handleGuestLogin);
    docId('loginForm').addEventListener('submit', validateFormSubmit);
    docId('user_email').addEventListener('keyup', removeError);
    docId('user_password').addEventListener('keyup', removeError);
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
}

/**
 * Handles the form submission for user login.
 * Validates user credentials, manages cookies, and redirects to the summary page on success.
 * Displays an error message if credentials are incorrect.
 *
 * @param {Event} event - The form submit event.
 */
async function handleFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData(docId("loginForm"));
    const email = formData.get('user_email');
    const password = formData.get('user_password');
    const rememberMe = formData.get('remember_me_checkbox') === "on";

    let found = false;

    for (const user of users) {
        if (user.user_email === email && user.user_password === password) {
            currentUser = user;
            found = true;
            break;
        }
    }

    if (found) {
        if (rememberMe) {
            setCookie('currentUser', JSON.stringify({ email: email, password: password }), 7);
        } else {
            eraseCookie('currentUser');
        }
        await deleteData("/currentUser");
        await postData("/currentUser", currentUser);
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'summary.html';
    } else {
        loginError();
    }
}

/**
 * Handles guest login by setting up a guest user and redirecting to the summary page.
 * Updates the current user data on the server and local storage.
 */
async function handleGuestLogin() {
    currentUser = { user_name: "Guest User" };
    await deleteData("/currentUser");
    await postData("/currentUser", currentUser);
    localStorage.setItem('isLoggedIn', 'true');
    window.location.href = 'summary.html';
}

/**
 * Displays an error message for login failures.
 * Adds error styling to the email and password input fields.
 */
function loginError() {
    docId('login-error').classList.remove('d_none');
    docId('password-input').classList.add('red_underline');
    docId('email-input').classList.add('red_underline');
}

/**
 * Removes error styling from email and password input fields.
 * Hides the login error message if no errors are present.
 */
function removeError() {
    docId('email-input').classList.remove('red_underline');
    docId('password-input').classList.remove('red_underline');

    if (!docId('login-error').classList.contains('d_none') &&
        !docId('email-input').classList.contains('red_underline') &&
        !docId('password-input').classList.contains('red_underline')) {

        docId('login-error').classList.add('d_none');
    }
}

/**
 * Populates the login form with previously saved user credentials if available.
 * Sets the 'Remember Me' checkbox to checked if user data is found.
 */
function populateRememberMe() {
    const userData = getCookie("currentUser");
    if (userData) {
        const user = JSON.parse(userData);
        docId('user_email').value = user.email;
        docId('user_password').value = user.password;
        docId('remember_me').checked = true;
    }
}
