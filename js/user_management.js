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
