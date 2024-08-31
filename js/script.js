/**
 * Base URL for Firebase Realtime Database where data is stored.
 * @constant {string} STORAGE_URL
 */
const STORAGE_URL = 'https://remotestorage-bc72d-default-rtdb.firebaseio.com/';

/**
 * Array to store user objects retrieved from the database.
 * @type {Array}
 */
const users = [];

/**
 * Array to store contact objects retrieved from the database.
 * @type {Array}
 */
let contacts = [];

/**
 * Variable to store the currently logged-in user object.
 * @type {Object|null}
 */
let currentUser = null;

/**
 * Array of colors used for task categories or other visual elements.
 * @type {Array<string>}
 */
const colors = ['#fe7b02', '#9228ff', '#6e52ff', '#fc71ff', '#ffbb2b', '#21d7c2', '#462f89', '#ff4646'];

/**
 * Array to store task objects retrieved from the database.
 * @type {Array}
 */
let tasks = [];

/**
 * Retrieves an element from the DOM by its ID.
 * @param {string} id - The ID of the HTML element.
 * @returns {HTMLElement} The HTML element with the specified ID.
 */
function docId(id) {
  return document.getElementById(id);
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
 * Retrieves a task object from the `tasks` array based on the provided ID.
 * @param {string} id - The ID of the task to retrieve.
 * @returns {Object|undefined} The task object matching the ID, or undefined if not found.
 */
function getTaskById(id) {
  return tasks.find(task => task.id === id);
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
 * Updates data in the Firebase Realtime Database at a specified path.
 * @async
 * @param {string} [path=''] - The path in the database where data should be updated.
 * @param {Object} [data={}] - The data object to update in the database.
 * @returns {Promise<Object>} A promise that resolves to the JSON response from the server.
 */
async function updateData(path = '', data = {}) {
  let response = await fetch(STORAGE_URL + path + '.json', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

/**
 * Posts new data to the Firebase Realtime Database at a specified path.
 * @async
 * @param {string} [path=''] - The path in the database where data should be posted.
 * @param {Object} [data={}] - The data object to post to the database.
 * @returns {Promise<Object>} A promise that resolves to the JSON response from the server.
 */
async function postData(path = '', data = {}) {
  let response = await fetch(STORAGE_URL + path + '.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

/**
 * Retrieves data from the Firebase Realtime Database at a specified path.
 * @async
 * @param {string} [path=''] - The path in the database from which to retrieve data.
 * @returns {Promise<Object>} A promise that resolves to the JSON response from the server.
 */
async function getData(path = "") {
  let response = await fetch(STORAGE_URL + path + ".json");
  return await response.json();
}

/**
 * Deletes data from the Firebase Realtime Database at a specified path.
 * @async
 * @param {string} [path=''] - The path in the database from which to delete data.
 * @returns {Promise<Object>} A promise that resolves to the JSON response from the server.
 */
async function deleteData(path = '') {
  let response = await fetch(STORAGE_URL + path + '.json', {
    method: 'DELETE',
  });
  return await response.json();
}

/**
 * Loads all tasks from the '/tasks' path in the Firebase Realtime Database.
 * Updates the global `tasks` array with the retrieved tasks.
 * @async
 */
async function loadTasks() {
  let allTask = await getData('/tasks');
  tasks = Object.entries(allTask).map(([key, value]) => ({
    ...value,
    id: key
  }));
}

/**
 * Deletes a task from the Firebase Realtime Database and updates the `tasks` array.
 * @async
 * @param {string} taskId - The ID of the task to delete.
 */
async function deleteTaskById(taskId) {
  await deleteData('/tasks/' + taskId);
  tasks = tasks.filter(task => task.id !== taskId);
}

/**
 * Updates a task in the Firebase Realtime Database at a specified path.
 * @async
 * @param {string} taskId - The ID of the task to update.
 * @param {Object} task - The updated task object to store in the database.
 */
async function updateTaskById(taskId, task) {
  await updateData('/tasks/' + taskId, task);
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
 * Loads all user objects from the '/users' path in the Firebase Realtime Database.
 * Updates the global `users` array with the retrieved users.
 * @async
 */
async function loadUsers() {
  let loadedUsers = await getData('/users');
  users.push(...Object.values(loadedUsers));
}

/**
 * Loads the current user object from the '/currentUser' path in the Firebase Realtime Database.
 * Updates the global `currentUser` variable with the retrieved user.
 * @async
 */
async function loadCurrentUsers() {
  let loadedCurrentUser = await getData('/currentUser');
  currentUser = Object.values(loadedCurrentUser)[0];
}

/**
 * Initializes contacts by loading, sorting, and enriching them with initials and colors.
 * This function is typically called during application initialization.
 * @async
 */
async function initContacts() {
  await loadAndMergeContacts();
  sortContacts();
  enrichContacts();
}

/**
 * Loads contacts from the '/contacts' path in the Firebase Realtime Database and populates the global `contacts` array.
 * @async
 */
async function loadAndMergeContacts() {
  contacts = Object.entries(await getData("/contacts")).map(([key, value]) => ({
    id: key,
    ...value
  }));
}

/**
 * Sorts the contacts array alphabetically by their 'name' property.
 */
function sortContacts() {
  contacts.sort((a, b) => a.name.localeCompare(b.name));
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
 * Enriches each contact object with initials and a color from the predefined colors array.
 * The colors are assigned based on the index of the contact in the contacts array.
 */
function enrichContacts() {
  contacts.forEach((contact, index) => {
    contact.initials = getInitials(contact.name);
    contact.color = colors[index % colors.length];
  });
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
 * Adds an error animation to input fields in the contacts form when validation fails.
 * @async
 */
async function addErrorAnimation() {
  const fields = [
    { fieldId: 'edit-name', parentId: 'edit-name-contacts' },
    { fieldId: 'edit-mobile', parentId: 'edit-mobile-contacts' },
    { fieldId: 'edit-email', parentId: 'edit-email-contacts' }
  ];

  fields.forEach(({ parentId }) => {
    let parentDiv = docId(parentId);

    parentDiv.classList.add('input-error');

    parentDiv.addEventListener('animationend', function () {
      parentDiv.classList.remove('input-error');
    }, { once: true });
  });
}
