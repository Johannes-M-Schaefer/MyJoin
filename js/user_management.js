/**
 * Variable to store the currently logged-in user object.
 * @type {Object|null}
 */
let currentUser = null;


/**
 * Retrieves an element from the DOM by its ID.
 * @param {string} id - The ID of the HTML element.
 * @returns {HTMLElement} The HTML element with the specified ID.
 */
function docId(id) {
  return document.getElementById(id);
}

/**
 * Initializes the current user by performing setup tasks including
 * loading HTML content, loading current users, and setting up event listeners.
 * Handles any errors during initialization.
 */
async function initCurrentUser() {
  try {
    await includeHTML();
    checkFirstPage();
    await loadCurrentUsers();
    showDropUser();
    setupEventListeners();
    setupOrientationCheck();
  } catch (error) {
    console.error('Error initializing current user:', error);
  }
}

/**
 * Sets up event listeners for various elements.
 */
function setupEventListeners() {
  docId("log_out").addEventListener('click', logOut);
  document.querySelector('.drop-logo').addEventListener('click', toggleDropdown);
  window.addEventListener('click', handleClickOutsideDropdown);
}

/**
 * Sets up listeners for window resize and orientation change events.
 * Periodically checks the orientation of the window.
 */
function setupOrientationCheck() {
  window.addEventListener('resize', checkOrientation);
  window.addEventListener('orientationchange', checkOrientation);
  checkOrientation(); // Initial orientation check
  setInterval(checkOrientation, 500); // Periodic orientation check
}

/**
 * Handles clicks outside the dropdown menu to close it if it is open.
 * 
 * @param {MouseEvent} event - The click event.
 */
function handleClickOutsideDropdown(event) {
  if (!event.target.matches('.drop-logo')) {
    let dropdowns = document.getElementsByClassName("dropdown-content");
    for (let i = 0; i < dropdowns.length; i++) {
      let openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

/**
 * Toggles the visibility of the dropdown menu associated with 'header_dropdown' element.
 */
function toggleDropdown() {
  docId("header_dropdown").classList.toggle("show");
}

/**
 * Checks if the user is logged in based on the presence of 'isLoggedIn' in localStorage.
 * If the user is not logged in and the current page is not '/index.html', redirects
 * the user to the login page ('index.html').
 */
function checkFirstPage() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const path = window.location.pathname;

  if (!isLoggedIn && path !== '/index.html') {
    window.location.href = 'index.html';
  }
}

/**
 * Loads the current user object from the '/currentUser' path in the Firebase Realtime Database.
 * Updates the global `currentUser` variable with the retrieved user.
 * @async
 */
async function loadCurrentUsers() {
  try {
    let loadedCurrentUser = await getData('/currentUser');
    if (loadedCurrentUser && typeof loadedCurrentUser === 'object') {
      currentUser = Object.values(loadedCurrentUser)[0];
    } else {
      currentUser = null; // Fallback if data is not valid
    }
  } catch (error) {
    console.error('Error fetching current user data:', error);
    currentUser = null; // Fallback on error
  }
}

/**
 * Loads all user objects from the '/users' path in the Firebase Realtime Database.
 * Updates the global `users` array with the retrieved users.
 * @async
 */
async function loadUsers() {
  let loadedUsers = await getData('/users');
  users.push(...Object.values(loadedUsers));
}

/**
 * Logs out the current user by deleting their data from the database and clearing local storage.
 * Redirects the user to the login page after logout.
 * @async
 */
async function logOut() {
  await deleteData("/currentUser");
  localStorage.removeItem('isLoggedIn');
  window.location.href = './index.html';
}

/**
 * Updates the user interface to display the initials of the current user.
 * This function assumes `currentUser` is already loaded.
 */
function showDropUser() {
  if (currentUser) {
    const initials = getInitials(currentUser.user_name);
    docId("drop_user").innerHTML = initials;
  }
}

/**
 * Retrieves a task object from the `tasks` array based on the provided ID.
 * @param {string} id - The ID of the task to retrieve.
 * @returns {Object|undefined} The task object matching the ID, or undefined if not found.
 */
function getTaskById(id) {
  return tasks.find(task => task.id === id);
}

/**
 * Retrieves a contact object from the `contacts` array based on the provided ID.
 * @param {string} id - The ID of the contact to retrieve.
 * @returns {Object|undefined} The contact object matching the ID, or undefined if not found.
 */
function getContactById(id) {
  return contacts.find(contact => contact.id === id);
}

/**
 * Deletes an item from an array based on its ID.
 * @param {Array} array - The array from which to delete an item.
 * @param {string} idToDelete - The ID of the item to delete.
 * @returns {Array} The updated array after deletion.
 */
function deleteById(array, idToDelete) {
  return array.filter(item => item.id !== idToDelete);
}

/**
 * Validates the form submission. Prevents the default submission if the form is invalid.
 * @param {Event} event - The form submit event.
 */
function validateFormSubmit(event) {
  const form = event.target;
  if (!form.checkValidity()) {
    event.preventDefault();
    event.stopPropagation();
  }
}

/**
 * Sets a cookie with the given name and value for the specified number of days.
 * @param {string} name - The name of the cookie.
 * @param {string} value - The value of the cookie.
 * @param {number} [days] - The number of days until the cookie expires.
 */
function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

/**
 * Retrieves the value of the cookie with the specified name.
 * @param {string} name - The name of the cookie.
 * @returns {string|null} The value of the cookie, or null if the cookie does not exist.
 */
function getCookie(name) {
  const nameEQ = name + "=";
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length, cookie.length);
    }
  }
  return null;
}

/**
 * Erases the cookie with the specified name.
 * @param {string} name - The name of the cookie to erase.
 */
function eraseCookie(name) {
  document.cookie = name + '=; Max-Age=-99999999;';
}

/**
 * Generates initials from a given name.
 * @param {string} name - The full name from which to generate initials.
 * @returns {string} The initials generated from the name.
 */
function getInitials(name) {
  return name.split(' ').map(part => part.charAt(0).toUpperCase()).join('');
}

/**
 * Hides elements with the class 'hide-if-logged-out' if the user is not logged in.
 * Returns true if the user is logged in, and false otherwise.
 * @returns {boolean} True if the user is logged in, false otherwise.
 */
function hideElementsForLoggedOutUsers() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');

  if (!isLoggedIn) {
    const elementsToHide = document.querySelectorAll('.hide-if-logged-out');
    elementsToHide.forEach(element => {
      element.style.display = 'none';
    });
    return false;
  }
  return true;
}

/**
 * Checks the orientation of the device and shows/hides a message based on whether the device is in landscape mode.
 */
function checkOrientation() {
  const isLandscape = window.innerHeight < window.innerWidth;
  const landscapeMessage = docId('landscape-format-message');
  const landscapeContainer = docId('landscape-format-message-container');

  if (isMobileDevice() && isLandscape) {
    landscapeMessage.classList.add('hidden');
    landscapeContainer.classList.add('hidden');
  } else {
    landscapeMessage.classList.remove('hidden');
    landscapeContainer.classList.remove('hidden');
  }
}

/**
 * Checks if the user agent indicates a mobile device.
 * @returns {boolean} True if the device is mobile, false otherwise.
 */
function isMobileDevice() {
  return /Mobi|Android/i.test(navigator.userAgent);
}

/**
 * Sets the minimum date of the input field specified by 'id' to today's date.
 * Prevents selection of past dates.
 *
 * @param {string} id - The ID of the date input field to set the restriction on.
 */
function setDateRestriction(id) {
  const today = new Date().toISOString().split('T')[0];
  docId(id).setAttribute('min', today);
}
