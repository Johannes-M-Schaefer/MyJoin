document.addEventListener("DOMContentLoaded", init());

/**
 * Handles the DOMContentLoaded event. This function includes HTML content, checks the current page, 
 * and sets up event listeners and intervals for various functionalities based on the current page.
 * 
 * @event
 */
 async function init() {
    await includeHTML();

    const path = window.location.pathname;

    const firstPartTriggered = handlePageSpecificLogic(path);

    if (firstPartTriggered) {
        await setupAuthenticatedUserFeatures();
    }

    setupGlobalEventListeners();
    checkOrientation();
    setInterval(checkOrientation, 500);
};

/**
 * Handles page-specific logic depending on the current path.
 * 
 * @param {string} path - The current page path.
 * @returns {boolean} - Returns true if the first part was triggered.
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
 */
async function setupAuthenticatedUserFeatures() {
    await loadCurrentUsers();
    showDropUser();
    setupAuthenticatedEventListeners();
}

/**
 * Sets up event listeners for authenticated users.
 */
function setupAuthenticatedEventListeners() {
    document.getElementById("log_out").addEventListener('click', logOut);
    document.querySelector('.drop-logo').addEventListener('click', toggleDropdown);
    window.addEventListener('click', handleWindowClickForDropdown);
}

/**
 * Handles click events on the window to close any open dropdown menus.
 * 
 * @param {Event} event - The click event.
 */
function handleWindowClickForDropdown(event) {
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
 * Sets up global event listeners that are not specific to any particular page.
 */
function setupGlobalEventListeners() {
    document.getElementById("back").addEventListener("click", handleBackButtonClick);
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
}

/**
 * Handles the click event on the back button. If there is a referrer, it navigates back in history.
 * Otherwise, it redirects to the index page.
 * 
 * @param {Event} event - The click event.
 */
function handleBackButtonClick(event) {
    if (document.referrer) {
        window.history.back();
    } else {
        window.location.href = './index.html';
    }
}
