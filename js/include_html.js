/**
 * Includes HTML content into elements marked with 'w3-include-html' attribute.
 * Fetches the specified HTML file and inserts its content into the element.
 * If the fetch fails (HTTP status not OK), displays "Page not found" in the element.
 */
async function includeHTML() {
  const includeElements = document.querySelectorAll("[w3-include-html]");
  for (const element of includeElements) {
    const file = element.getAttribute("w3-include-html");
    try {
      const response = await fetch(file);
      if (response.ok) {
        element.innerHTML = await response.text();
      } else {
        element.innerHTML = "Page not found";
      }
    } catch (error) {
      console.error('Error fetching file:', file, error);
      element.innerHTML = "Page not found";
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
 * Sets the minimum date of the input field specified by 'id' to today's date.
 * Prevents selection of past dates.
 *
 * @param {string} id - The ID of the date input field to set the restriction on.
 */
function setDateRestriction(id) {
  const today = new Date().toISOString().split('T')[0];
  docId(id).setAttribute('min', today);
}

/**
 * Initializes the current user by performing setup tasks including
 * including HTML content, loading current users, and setting up event listeners.
 * Handles any errors during initialization.
 */
async function initCurrentUser() {
  try {
    await includeHTML();
    checkFirstPage(); // Check if it's the first page
    await loadCurrentUsers(); // Load current user data
    showDropUser(); // Display user-related dropdown or similar UI element
    setupEventListeners(); // Set up event listeners
    setupOrientationCheck(); // Set up orientation change detection
  } catch (error) {
    console.error('Error initializing current user:', error);
    // Optional: Display an error message to the user
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
 * Sets up listeners for window resize and orientation change events.
 * Periodically checks the orientation of the window.
 */
function setupOrientationCheck() {
  window.addEventListener('resize', checkOrientation);
  window.addEventListener('orientationchange', checkOrientation);
  checkOrientation(); // Initial orientation check
  setInterval(checkOrientation, 500); // Periodic orientation check
}
