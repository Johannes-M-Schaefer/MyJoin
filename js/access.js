/**
 * Initializes the application once the DOM content is fully loaded.
 * Sets up the HTML content, handles page-specific logic, sets up authenticated user features,
 * and initializes global event listeners and orientation checks.
 * 
 * @event DOMContentLoaded
 */
document.addEventListener("DOMContentLoaded", init);

/**
 * Initializes the application by including HTML content, handling page-specific logic,
 * and setting up features for authenticated users and global event listeners.
 * 
 * @async
 * @function init
 */
async function init() {
    await includeHTML();

    const path = window.location.pathname;
    const firstPartTriggered = handlePageSpecificLogic(path);

    if (firstPartTriggered) {
        await setupAuthenticatedUserFeatures();
    }

    setTimeout(setupGlobalEventListeners, 0); // Deferred for non-blocking
    setupOrientationCheck(); // Handles both initial check and periodic checks
}

/**
 * Handles logic specific to different pages based on the current path.
 * 
 * @function handlePageSpecificLogic
 * @param {string} path - The current page path.
 * @returns {boolean} Returns true if the first part was triggered, indicating that further setup for authenticated users is required.
 */
function handlePageSpecificLogic(path) {
    if (!['/index.html', '/signup.html', '/privacy_policy.html', '/legal_notice.html'].includes(path)) {
        checkFirstPage();
        return true;
    } else {
        return hideElementsForLoggedOutUsers();
    }
}

/**
 * Sets up features and event listeners for authenticated users.
 * 
 * @async
 * @function setupAuthenticatedUserFeatures
 */
async function setupAuthenticatedUserFeatures() {
    await loadCurrentUsers();
    showDropUser();
    setupAuthenticatedEventListeners();
}

/**
 * Handles the click event on the back button. If there is a referrer, it navigates back in history.
 * Otherwise, it redirects to the index page.
 * 
 * @function handleBackButtonClick
 * @param {Event} event - The click event.
 */
function handleBackButtonClick(event) {
    if (document.referrer) {
        window.history.back();
    } else {
        window.location.href = './index.html';
    }
}

/**
 * Sets up event listeners specifically for authenticated users.
 * 
 * @function setupAuthenticatedEventListeners
 */
function setupAuthenticatedEventListeners() {
    document.getElementById("log_out").addEventListener('click', logOut);
    document.getElementById("back").addEventListener("click", handleBackButtonClick);
    document.querySelector('.drop-logo').addEventListener('click', toggleDropdown);
    window.addEventListener('click', handleOutsideDropdownClick);
}

/**
 * Sets up global event listeners that are not specific to any particular page.
 * 
 * @function setupGlobalEventListeners
 */
function setupGlobalEventListeners() {
    document.getElementById("back").addEventListener("click", handleBackButtonClick);
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
}

/**
 * Handles click events outside of dropdown menus to close any open dropdowns.
 * 
 * @function handleOutsideDropdownClick
 * @param {Event} event - The click event.
 */
function handleOutsideDropdownClick(event) {
    if (!event.target.matches('.drop-logo')) {
        document.querySelectorAll(".dropdown-content.show").forEach(dropdown => {
            dropdown.classList.remove('show');
        });
    }
}