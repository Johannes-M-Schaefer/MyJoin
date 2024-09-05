document.addEventListener("DOMContentLoaded", init);

/**
 * Initializes event listeners and performs initial checks when the DOM is fully loaded.
 * @async
 */
async function init() {
    await loadUsers();
    registerEventListener();
    checkOrientation();
    setInterval(checkOrientation, 500);
}

/**
 * Registers event listeners for form submission and input field keyup events.
 */
function registerEventListener() {
    docId("signupForm").addEventListener("submit", validateFormSubmit);
    docId("signupForm").addEventListener("submit", handleFormSubmit);
    docId("user_password_confirm").addEventListener('keyup', handlePasswordConfirmKeyup);
    docId("user_email").addEventListener('keyup', handleEmailKeyup);
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
}

/**
 * Handles the form submission for user registration.
 * Validates the form, checks for existing users, and submits the form data.
 * @param {Event} e - The form submit event.
 */
async function handleFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(docId('signupForm'));
    const email = formData.get('user_email');
    const password = formData.get('user_password');
    const confirm = formData.get('user_password_confirm');
    if (password !== confirm) {
        return passwordConfirmError();
    }
    if (userEmailExists(email)) {
        return emailExistError();
    }
    const userData = Object.fromEntries(formData.entries());
    userData.id = generateId();
    await postData("/users", userData);
    showPopupAndRedirect();
}

/**
 * Checks if a user with the given email already exists.
 * @param {string} email - The email to check for existence.
 * @returns {boolean} True if the email exists, false otherwise.
 */
function userEmailExists(email) {
    for (const user of users) {
        if (user.user_email === email) {
            return true;
        }
    }
    return false;
}

/**
 * Handles the registration process for a user.
 * Checks if the user email already exists.
 * @param {string} email - The email to check.
 * @returns {boolean} True if the email already exists, false otherwise.
 */
function handleExistingUserRegistration(email) {
    for (let i = 0; i < users.length; i++) {
        if (users[i].user_email === email) {
            return true;
        }
    }
    return false;
}

/**
 * Shows the popup and redirects to the homepage after a delay.
 */
function showPopupAndRedirect() {
    docId('popup_container').classList.add('show');
    docId('popup').classList.add('show');
    setTimeout(() => window.location.href = 'index.html', 2000);
}

/**
 * Displays an error message for password confirmation mismatch.
 * Adds a red underline to the password confirmation input field.
 */
function passwordConfirmError() {
    docId('password-error').classList.remove('d_none');
    docId('confirm-input').classList.add('red_underline');
}

/**
 * Displays an error message if the email already exists.
 * Adds a red underline to the email input field.
 */
function emailExistError() {
    docId('email-error').classList.remove('d_none');
    docId('email-input').classList.add('red_underline');
}

/**
 * Removes the red underline and error message for the password confirmation field when a key is pressed.
 */
function handlePasswordConfirmKeyup() {
    if (docId('confirm-input').classList.contains('red_underline')) {
        docId('confirm-input').classList.remove('red_underline');
        docId('password-error').classList.add('d_none');
    }
}

/**
 * Removes the red underline and error message for the email field when a key is pressed.
 */
function handleEmailKeyup() {
    if (docId('email-input').classList.contains('red_underline')) {
        docId('email-input').classList.remove('red_underline');
        docId('email-error').classList.add('d_none');
    }
}

/**
 * Generates a random unique ID.
 * @returns {string} A unique identifier.
 */
function generateId() {
    return Math.random().toString(16).slice(2);
}

/**
 * Redirects the user to the 'index.html' page.
 */
function redirectToIndex() {
    window.location.href = 'index.html';
}
