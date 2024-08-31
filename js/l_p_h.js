/**
 * Handles the DOMContentLoaded event. This function includes HTML content, checks the current page, 
 * and sets up event listeners and intervals for various functionalities based on the current page.
 * 
 * @event
 */
document.addEventListener("DOMContentLoaded", async function () {
    await includeHTML();

    const path = window.location.pathname;
    let firstPartTriggered = false;

    if (!['/index.html', '/signup.html', '/privacy_policy.html', '/legal_notice.html'].includes(path)) {
        checkFirstPage();
        firstPartTriggered = true;
    } else {
        firstPartTriggered = hideElementsForLoggedOutUsers();
    }

    if (firstPartTriggered === true) {
        await loadCurrentUsers();
        showDropUser();        

        /**
         * Handles the click event on the logout button, triggering the logOut function.
         * 
         * @event
         */
        docId("log_out").addEventListener('click', logOut)

        /**
         * Handles the click event on the drop logo, triggering the toggleDropdown function.
         * 
         * @event
         */
        document.querySelector('.drop-logo').addEventListener('click', toggleDropdown);

        /**
         * Handles click events on the window. If the click event's target does not match
         * the element with class 'drop-logo', it will close any open dropdown menus by
         * removing the 'show' class from elements with class 'dropdown-content'.
         * 
         * @event
         * @param {Event} event - The click event.
         */
        window.addEventListener('click', function (event) {
            if (!event.target.matches('.drop-logo')) {
                let dropdowns = document.getElementsByClassName("dropdown-content");
                for (let i = 0; i < dropdowns.length; i++) {
                    let openDropdown = dropdowns[i];
                    if (openDropdown.classList.contains('show')) {
                        openDropdown.classList.remove('show');
                    }
                }
            }
        });
    }

    /**
     * Handles the click event on the back button. If there is a referrer, it navigates back in history.
     * Otherwise, it redirects to the index page.
     * 
     * @event
     */
    docId("back").addEventListener("click", function () {
        if (document.referrer) {
            window.history.back();
        } else {
            window.location.href = './index.html';
        }
    });

    /**
     * Handles the resize event on the window, triggering the checkOrientation function.
     * 
     * @event
     */
    window.addEventListener('resize', checkOrientation);

    /**
     * Handles the orientationchange event on the window, triggering the checkOrientation function.
     * 
     * @event
     */
    window.addEventListener('orientationchange', checkOrientation);

    checkOrientation();
    setInterval(checkOrientation, 500);
});