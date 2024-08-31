/**
 * Generates HTML for a single contact container.
 * @param {Object} contact - The contact object containing details like name, email, initials, and color.
 * @param {number} index - The index of the contact in the list.
 * @returns {string} HTML string representing the contact container.
 */
function createContactHtml(contact, index) {
    return `
    <div id="contact-container(${index})" onclick="openContact(${index})" class="contact-container d-flex">
        <div style="background-color:${contact.color}" class="contact-container-img">${contact.initials}</div>
        <div class="contact-container-text d-flex column">
            <div class="marquee-container">
                <div class="contact-container-text-name">${contact.name}</div>
            </div>
            <div class="marquee-container">
                <div class="contact-container-mail">${contact.email}</div>
            </div>
        </div>
    </div>
    `;
}

/**
 * Generates HTML for a group of contacts under a specific letter.
 * @param {string} letter - The letter representing the group.
 * @param {string} contactsHtml - HTML string containing contact containers for the group.
 * @returns {string} HTML string representing the group of contacts.
 */
function createGroupHtml(letter, contactsHtml) {
    return `
    <div class="filter-card d-flex column">
        <div class="filter-number">${letter}</div>
        <div class="seperator"></div>
        <div id="contact-container">${contactsHtml}</div>
    </div>
    `;
}

/**
 * Generates HTML for displaying detailed information of a selected contact.
 * @param {number} i - The index of the selected contact in the contacts array.
 * @returns {string} HTML string representing the detailed view of the selected contact.
 */
function generateSelectedContactHTML(i) {
    return `
        <div class="selected-contact-main-container">
            <div class="btn blue blue-small d-none click-animation" onclick="toggleNav()" id="toggle_nav">
                <div class="add-contact-button-text">Add new contact</div>
                <div class="add-contact-button-img">
                    <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <mask id="mask0_45731_2256" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="33" height="32">
                            <rect x="0.21875" width="32" height="32" fill="#D9D9D9"/>
                        </mask>
                        <g mask="url(#mask0_45731_2256)">
                            <path d="M16.2184 26.6666C15.4851 26.6666 14.8573 26.4055 14.3351 25.8833C13.8129 25.361 13.5518 24.7333 13.5518 23.9999C13.5518 23.2666 13.8129 22.6388 14.3351 22.1166C14.8573 21.5944 15.4851 21.3333 16.2184 21.3333C16.9518 21.3333 17.5795 21.5944 18.1018 22.1166C18.624 22.6388 18.8851 23.2666 18.8851 23.9999C18.8851 24.7333 18.624 25.361 18.1018 25.8833C17.5795 26.4055 16.9518 26.6666 16.2184 26.6666ZM16.2184 18.6666C15.4851 18.6666 14.8573 18.4055 14.3351 17.8833C13.8129 17.361 13.5518 16.7333 13.5518 15.9999C13.5518 15.2666 13.8129 14.6388 14.3351 14.1166C14.8573 13.5944 15.4851 13.3333 16.2184 13.3333C16.9518 13.3333 17.5795 13.5944 18.1018 14.1166C18.624 14.6388 18.8851 15.2666 18.8851 15.9999C18.8851 16.7333 18.624 17.361 18.1018 17.8833C17.5795 18.4055 16.9518 18.6666 16.2184 18.6666ZM16.2184 10.6666C15.4851 10.6666 14.8573 10.4055 14.3351 9.88325C13.8129 9.36103 13.5518 8.73325 13.5518 7.99992C13.5518 7.26659 13.8129 6.63881 14.3351 6.11659C14.8573 5.59436 15.4851 5.33325 16.2184 5.33325C16.9518 5.33325 17.5795 5.59436 18.1018 6.11659C18.624 6.63881 18.8851 7.26659 18.8851 7.99992C18.8851 8.73325 18.624 9.36103 18.1018 9.88325C17.5795 10.4055 16.9518 10.6666 16.2184 10.6666Z" fill="white"/>
                        </g>
                    </svg>
                </div>
            </div>
            <div class="nav_contact" id="nav_contact">
                <div class="mobile_nav d-flex_column" id="mobileNav">
                    <div class="edit d-flex row s-gap" onclick="openEditContactOverlay(${i})">
                        <div class="edit-img">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <mask id="mask0_43661_3154" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                    <rect width="24" height="24" fill="#D9D9D9" />
                                </mask>
                                <g mask="url(#mask0_43661_3154)">
                                    <path d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z" fill="#4589FF" />
                                </g>
                            </svg>
                        </div>
                        <div class="edit-text">Edit</div>
                    </div>
                    <div class="delete d-flex row s-gap" onclick="confirmationDelete(${i})">
                        <div class="delete-img">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <mask id="mask0_43661_2698" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                    <rect width="24" height="24" fill="#D9D9D9" />
                                </mask>
                                <g mask="url(#mask0_43661_2698)">
                                    <path d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6C4.71667 6 4.47917 5.90417 4.2875 5.7125C4.09583 5.52083 4 5.28333 4 5C4 4.71667 4.09583 4.47917 4.2875 4.2875C4.47917 4.09583 4.71667 4 5 4H9C9 3.71667 9.09583 3.47917 9.2875 3.2875C9.47917 3.09583 9.71667 3 10 3H14C14.2833 3 14.5208 3.09583 14.7125 3.2875C14.9042 3.47917 15 3.71667 15 4H19C19.2833 4 19.5208 4.09583 19.7125 4.2875C19.9042 4.47917 20 4.71667 20 5C20 5.28333 19.9042 5.52083 19.7125 5.7125C19.5208 5.90417 19.2833 6 19 6V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM7 6V19H17V6H7ZM9 16C9 16.2833 9.09583 16.5208 9.2875 16.7125C9.47917 16.9042 9.71667 17 10 17C10.2833 17 10.5208 16.9042 10.7125 16.7125C10.9042 16.5208 11 16.2833 11 16V9C11 8.71667 10.9042 8.47917 10.7125 8.2875C10.5208 8.09583 10.2833 8 10 8C9.71667 8 9.47917 8.09583 9.2875 8.2875C9.09583 8.47917 9 8.71667 9 9V16ZM13 16C13 16.2833 13.0958 16.5208 13.2875 16.7125C13.4792 16.9042 13.7167 17 14 17C14.2833 17 14.5208 16.9042 14.7125 16.7125C14.9042 16.5208 15 16.2833 15 16V9C15 8.71667 14.9042 8.47917 14.7125 8.2875C14.5208 8.09583 14.2833 8 14 8C13.7167 8 13.4792 8.09583 13.2875 8.2875C13.0958 8.47917 13 8.71667 13 9V16Z" fill="#4589FF" />
                                </g>
                            </svg>
                        </div>
                        <div class="delete-text">Delete</div>
                    </div>
                </div>
            </div>

            <div class="arrow_return_div d-none">
                <div class="arrow-container click-animation" onclick="closeSelectedContactOverlay()">
                    <svg class="arrow" width="22" height="20" viewBox="0 0 22 20" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M4.93725 8.66673H19.8333C20.5696 8.66673 21.1666 9.26368 21.1666 10.0001C21.1666 10.7364 20.5696 11.3334 19.8333 11.3334H4.93725L11.1466 17.5427C11.6672 18.0634 11.6672 18.9074 11.1466 19.4281C10.626 19.9487 9.78187 19.9487 9.26125 19.4281L1.24746 11.4143C0.466415 10.6332 0.466417 9.3669 1.24747 8.58585L9.26125 0.57206C9.78187 0.0514398 10.626 0.0514406 11.1466 0.572061C11.6672 1.09268 11.6672 1.93677 11.1466 2.45739L4.93725 8.66673Z"
                        fill="#005DFF" />
                    </svg>
                </div>
                </div>
            <div class="selected-contact-profil-top d-flex row">
                    <div id="selected-img">
                        <div style="background-color:${contacts[i].color}; width:90px; height:90px; font-size:1.6em;" class="contact-container-img selected">${contacts[i].initials}</div>
                    </div>  
                        
                <div class="selected-contact-profil-right d-flex column">
                    <div id="selected-name" class="selected-contact-profil-name">${contacts[i].name}</div>
                    <div class="selected-contact-profil-nav d-flex row">
                        <div class="edit d-flex row s-gap" onclick="openEditContactOverlay(${i})">
                            <div class="edit-img">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <mask id="mask0_43661_3154" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                        <rect width="24" height="24" fill="#D9D9D9" />
                                    </mask>
                                    <g mask="url(#mask0_43661_3154)">
                                        <path d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z" fill="#4589FF" />
                                    </g>
                                </svg>
                            </div>
                            <div class="edit-text">Edit</div>
                        </div>
                        <div class="delete d-flex row s-gap" onclick="confirmationDelete(${i})">
                            <div class="delete-img">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <mask id="mask0_43661_2698" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                        <rect width="24" height="24" fill="#D9D9D9" />
                                    </mask>
                                    <g mask="url(#mask0_43661_2698)">
                                        <path d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6C4.71667 6 4.47917 5.90417 4.2875 5.7125C4.09583 5.52083 4 5.28333 4 5C4 4.71667 4.09583 4.47917 4.2875 4.2875C4.47917 4.09583 4.71667 4 5 4H9C9 3.71667 9.09583 3.47917 9.2875 3.2875C9.47917 3.09583 9.71667 3 10 3H14C14.2833 3 14.5208 3.09583 14.7125 3.2875C14.9042 3.47917 15 3.71667 15 4H19C19.2833 4 19.5208 4.09583 19.7125 4.2875C19.9042 4.47917 20 4.71667 20 5C20 5.28333 19.9042 5.52083 19.7125 5.7125C19.5208 5.90417 19.2833 6 19 6V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM7 6V19H17V6H7ZM9 16C9 16.2833 9.09583 16.5208 9.2875 16.7125C9.47917 16.9042 9.71667 17 10 17C10.2833 17 10.5208 16.9042 10.7125 16.7125C10.9042 16.5208 11 16.2833 11 16V9C11 8.71667 10.9042 8.47917 10.7125 8.2875C10.5208 8.09583 10.2833 8 10 8C9.71667 8 9.47917 8.09583 9.2875 8.2875C9.09583 8.47917 9 8.71667 9 9V16ZM13 16C13 16.2833 13.0958 16.5208 13.2875 16.7125C13.4792 16.9042 13.7167 17 14 17C14.2833 17 14.5208 16.9042 14.7125 16.7125C14.9042 16.5208 15 16.2833 15 16V9C15 8.71667 14.9042 8.47917 14.7125 8.2875C14.5208 8.09583 14.2833 8 14 8C13.7167 8 13.4792 8.09583 13.2875 8.2875C13.0958 8.47917 13 8.71667 13 9V16Z" fill="#4589FF" />
                                </g>
                            </svg>
                        </div>
                        <div class="delete-text">Delete</div>
                    </div>
                </div>
            </div>
            </div>
            <div class="selected-contact-profil-bottom d-flex column">
                <div class="selected-contact-headline">Contact Information</div>
                <div class="selected-contact-email-container d-flex s-gap">
                    <div class="selected-contact-email-name">Email:</div>
                    <a id="selected-mail" href="mailto:${contacts[i].email}">${contacts[i].email}</a>
                </div>
                <div class="selected-contact-phone-container d-flex column s-gap">
                    <div class="selected-contact-phone-name">Phone:</div>
                    <a href="${contacts[i].mobile}" id="selected-mobile" class="selected-contact-phone-adress">${contacts[i].mobile}</a>
                </div>
            </div>
        </div>
    `;
}

/**
 * Renders an edit overlay for a specific contact based on index.
 * This function populates the overlay with contact details and sets up event handlers.
 *
 * @param {number} i - Index of the contact in the 'contacts' array to be edited.
 * @returns {void}
 */
function renderEditOverlay(i) {
    const overlayHTML = `
        <div onclick="closeEditContactOverlay()" id="close-edit-area"></div>
        <div class="edit-contact_main-container">
            <div class="edit-area_top-area d-flex_column">
                <div class="close-container d-flex_column">
                    <div onclick="closeEditContactOverlay()" class="x-button click-animation">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <mask id="mask0_19024_6446" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="4" y="4" width="24" height="24">
                                <rect x="4" y="4" width="24" height="24" fill="#D9D9D9" />
                            </mask>
                            <g mask="url(#mask0_19024_6446)">
                                <path d="M16 17.8642L9.46667 24.389C9.22223 24.6331 8.91112 24.7552 8.53334 24.7552C8.15556 24.7552 7.84445 24.6331 7.6 24.389C7.35556 24.1449 7.23334 23.8342 7.23334 23.4569C7.23334 23.0796 7.35556 22.7689 7.6 22.5248L14.1333 16L7.6 9.47527C7.35556 9.23115 7.23334 8.92045 7.23334 8.54316C7.23334 8.16588 7.35556 7.85518 7.6 7.61106C7.84445 7.36693 8.15556 7.24487 8.53334 7.24487C8.91112 7.24487 9.22223 7.36693 9.46667 7.61106L16 14.1358L22.5333 7.61106C22.7778 7.36693 23.0889 7.24487 23.4667 7.24487C23.8444 7.24487 24.1556 7.36693 24.4 7.61106C24.6444 7.85518 24.7667 8.16588 24.7667 8.54316C24.7667 8.92045 24.6444 9.23115 24.4 9.47527L17.8667 16L24.4 22.5248C24.6444 22.7689 24.7667 23.0796 24.7667 23.4569C24.7667 23.8342 24.6444 24.1449 24.4 24.389C24.1556 24.6331 23.8444 24.7552 23.4667 24.7552C23.0889 24.7552 22.7778 24.6331 22.5333 24.389L16 17.8642Z" fill="white" />
                            </g>
                        </svg>
                    </div>
                </div>
                <div class="content-container d-flex">
                    <div class="logo">
                        <svg width="46" height="56" viewBox="0 0 46 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M32.9078 -0.000244141H22.7341V11.7044H32.9078V-0.000244141Z" fill="white" />
                            <path d="M22.7342 21.2239H32.9079V37.7315C32.9544 41.7036 31.8239 45.6 29.6602 48.9252C27.5237 52.1559 23.3994 55.9998 15.7692 55.9998C7.45808 55.9998 2.61385 52.0695 0 49.9156L6.41724 41.9998C8.96848 44.0829 11.4258 45.7966 15.8083 45.7966C19.1265 45.7966 20.4491 44.4445 21.2238 43.2654C22.2771 41.6277 22.8219 39.7124 22.789 37.7629L22.7342 21.2239Z" fill="white" />
                            <path d="M17.5457 13.8347H7.37207V24.0537H17.5457V13.8347Z" fill="white" />
                            <path d="M38.2374 51.2047C38.2374 53.3821 37.134 54.5534 35.5923 54.5534C34.0506 54.5534 33.041 53.162 33.041 51.3147C33.041 49.4675 34.0819 48.0054 35.6783 48.0054C37.2748 48.0054 38.2374 49.4439 38.2374 51.2047ZM34.2227 51.2912C34.2227 52.6039 34.7471 53.5708 35.647 53.5708C36.547 53.5708 37.0557 52.5489 37.0557 51.2126C37.0557 50.0413 36.5861 48.9408 35.647 48.9408C34.7079 48.9408 34.2227 50.002 34.2227 51.2912Z" fill="white" />
                            <path d="M40.2563 48.0999V54.4513H39.1294V48.0999H40.2563Z" fill="white" />
                            <path d="M41.4773 54.4513V48.0999H42.7294L44.0755 50.7175C44.422 51.4019 44.7303 52.1053 44.9989 52.8242C44.9285 52.0381 44.8972 51.1341 44.8972 50.1279V48.0999H45.9302V54.4513H44.7642L43.4025 51.7787C43.0419 51.0766 42.7206 50.3549 42.4399 49.617C42.4399 50.4031 42.4947 51.2913 42.4947 52.384V54.4435L41.4773 54.4513Z" fill="white" />
                        </svg>
                    </div>
                    <div class="headline-text mgTop-18">Edit Contact</div>
                    <div>
                        <div id="edit-contact-profile-img" class="contact-container-img-edit contact-container-img-overlay" style="width:90px; height:90px; font-size:1.6em; background-color: ${contacts[i]['color']}">
                            ${contacts[i]['initials']}
                        </div>
                    </div>
                </div>
            </div>
            <div class="edit-area_bottom-area d-flex_column">
                <form id="edit-contact-form" onsubmit="confirmationEdit(${i}); return false;">
                    <div id="edit-name-contacts" class="name-edit-contacts d-flex_row input-container">
                        <input id="edit-name" placeholder="Name" name="name" pattern="^(?=.*[A-Za-zäöüÄÖÜß]{3}).*$"
                            title="Mindestens drei Buchstaben" class="name-input" type="text" value="${contacts[i]['name']}" required>
                        <div class="name-contacts-img target">
                            <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <mask id="mask0_43661_2306" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="25">
                                    <rect y="0.5" width="24" height="24" fill="#D9D9D9" />
                                </mask>
                                <g mask="url(#mask0_43661_2306)">
                                    <path d="M12 12.5C10.9 12.5 9.95833 12.1083 9.175 11.325C8.39167 10.5417 8 9.6 8 8.5C8 7.4 8.39167 6.45833 9.175 5.675C9.95833 4.89167 10.9 4.5 12 4.5C13.1 4.5 14.0417 4.89167 14.825 5.675C15.6083 6.45833 16 7.4 16 8.5C16 9.6 15.6083 10.5417 14.825 11.325C14.0417 12.1083 13.1 12.5 12 12.5ZM18 20.5H6C5.45 20.5 4.97917 20.3042 4.5875 19.9125C4.19583 19.5208 4 19.05 4 18.5V17.7C4 17.1333 4.14583 16.6125 4.4375 16.1375C4.72917 15.6625 5.11667 15.3 5.6 15.05C6.63333 14.5333 7.68333 14.1458 8.75 13.8875C9.81667 13.6292 10.9 13.5 12 13.5C13.1 13.5 14.1833 13.6292 15.25 13.8875C16.3167 14.1458 17.3667 14.5333 18.4 15.05C18.8833 15.3 19.2708 15.6625 19.5625 16.1375C19.8542 16.6125 20 17.1333 20 17.7V18.5C20 19.05 19.8042 19.5208 19.4125 19.9125C19.0208 20.3042 18.55 20.5 18 20.5ZM6 18.5H18V17.7C18 17.5167 17.9542 17.35 17.8625 17.2C17.7708 17.05 17.65 16.9333 17.5 16.85C16.6 16.4 15.6917 16.0625 14.775 15.8375C13.8583 15.6125 12.9333 15.5 12 15.5C11.0667 15.5 10.1417 15.6125 9.225 15.8375C8.30833 16.0625 7.4 16.4 6.5 16.85C6.35 16.9333 6.22917 17.05 6.1375 17.2C6.04583 17.35 6 17.5167 6 17.7V18.5ZM12 10.5C12.55 10.5 13.0208 10.3042 13.4125 9.9125C13.8042 9.52083 14 9.05 14 8.5C14 7.95 13.8042 7.47917 13.4125 7.0875C13.0208 6.69583 12.55 6.5 12 6.5C11.45 6.5 10.9792 6.69583 10.5875 7.0875C10.1958 7.47917 10 7.95 10 8.5C10 9.05 10.1958 9.52083 10.5875 9.9125C10.9792 10.3042 11.45 10.5 12 10.5Z" fill="#A8A8A8" />
                                </g>
                            </svg>
                        </div>
                    </div>
                    <div id="edit-email-contacts" class="email-edit-contacts d-flex_row input-container">
                    <input id="edit-email" name="email" placeholder="Email" class="email-input" type="email" title="Bitte geben Sie eine gültige E-Mail-Adresse ein" value="${contacts[i]['email']}" required>
                        <div class="email-contacts-img target">
                            <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <mask id="mask0_43661_2816" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="25">
                                    <rect y="0.48291" width="24" height="24" fill="#D9D9D9" />
                                </mask>
                                <g mask="url(#mask0_43661_2816)">
                                    <path d="M4 20.4829C3.45 20.4829 2.97917 20.2871 2.5875 19.8954C2.19583 19.5037 2 19.0329 2 18.4829V6.48291C2 5.93291 2.19583 5.46208 2.5875 5.07041C2.97917 4.67874 3.45 4.48291 4 4.48291H20C20.55 4.48291 21.0208 4.67874 21.4125 5.07041C21.8042 5.46208 22 5.93291 22 6.48291V18.4829C22 19.0329 21.8042 19.5037 21.4125 19.8954C21.0208 20.2871 20.55 20.4829 20 20.4829H4ZM20 8.48291L12.525 13.1579C12.4417 13.2079 12.3542 13.2454 12.2625 13.2704C12.1708 13.2954 12.0833 13.3079 12 13.3079C11.9167 13.3079 11.8292 13.2954 11.7375 13.2704C11.6458 13.2454 11.5583 13.2079 11.475 13.1579L4 8.48291V18.4829H20V8.48291ZM12 11.4829L20 6.48291H4L12 11.4829ZM4 8.73291V7.25791V7.28291V7.27041V8.73291Z" fill="#A8A8A8" />
                                </g>
                            </svg>
                        </div>
                    </div>
                    <div id="edit-mobile-contacts" class="phone-edit-contacts d-flex_row input-container">
                    <input id="edit-mobile" name="tel" pattern="\\+?[0-9\\s\\-]{7,15}" title="Geben Sie eine gültige Telefonnummer ein" placeholder="Phone" class="phone-input" type="tel" value="${contacts[i]['mobile']}">

                        <div class="phone-contacts-img target">
                            <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <mask id="mask0_43661_2823" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="25">
                                    <rect y="0.98291" width="24" height="24" fill="#D9D9D9" />
                                </mask>
                                <g mask="url(#mask0_43661_2823)">
                                    <path d="M19.95 21.9829C17.8667 21.9829 15.8083 21.5287 13.775 20.6204C11.7417 19.7121 9.89167 18.4246 8.225 16.7579C6.55833 15.0912 5.27083 13.2412 4.3625 11.2079C3.45417 9.17458 3 7.11624 3 5.03291C3 4.73291 3.1 4.48291 3.3 4.28291C3.5 4.08291 3.75 3.98291 4.05 3.98291H8.1C8.33333 3.98291 8.54167 4.06208 8.725 4.22041C8.90833 4.37874 9.01667 4.56624 9.05 4.78291L9.7 8.28291C9.73333 8.54958 9.725 8.77458 9.675 8.95791C9.625 9.14124 9.53333 9.29958 9.4 9.43291L6.975 11.8829C7.30833 12.4996 7.70417 13.0954 8.1625 13.6704C8.62083 14.2454 9.125 14.7996 9.675 15.3329C10.1917 15.8496 10.7333 16.3287 11.3 16.7704C11.8667 17.2121 12.4667 17.6162 13.1 17.9829L15.45 15.6329C15.6 15.4829 15.7958 15.3704 16.0375 15.2954C16.2792 15.2204 16.5167 15.1996 16.75 15.2329L20.2 15.9329C20.4333 15.9996 20.625 16.1204 20.775 16.2954C20.925 16.4704 21 16.6662 21 16.8829V20.9329C21 21.2329 20.9 21.4829 20.7 21.6829C20.5 21.8829 20.25 21.9829 19.95 21.9829ZM6.025 9.98291L7.675 8.33291L7.25 5.98291H5.025C5.10833 6.66624 5.225 7.34124 5.375 8.00791C5.525 8.67458 5.74167 9.33291 6.025 9.98291ZM14.975 18.9329C15.625 19.2162 16.2875 19.4412 16.9625 19.6079C17.6375 19.7746 18.3167 19.8829 19 19.9329V17.7329L16.65 17.2579L14.975 18.9329Z" fill="#A8A8A8" />
                                </g>
                            </svg>
                        </div>
                    </div>
                    <div id="edit-button-container" class="button_container d-flex_row">
                        <div onclick="confirmationDelete(${i})" id="delete_in_edit" class="blue-button-container d-flex_row mybtn">
                            <div class="blue-button-text">Delete</div>
                        </div>
                        <button type="submit" id="edit_in_edit" class="mybtn save-button-container d-flex_row">
                            <div class="save-button-text">Save</div>
                            <div class="save-button-hook">
                                <svg width="25" height="25" viewBox="0 0 25 25" fill="black" xmlns="http://www.w3.org/2000/svg">
                                    <mask id="mask0_43661_1650" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="25">
                                        <rect x="0.5" y="0.98291" width="24" height="24" fill="#D9D9D9" />
                                    </mask>
                                    <g mask="url(#mask0_43661_1650)">
                                        <path d="M10.05 16.1329L18.525 7.65791C18.725 7.45791 18.9625 7.35791 19.2375 7.35791C19.5125 7.35791 19.75 7.45791 19.95 7.65791C20.15 7.85791 20.25 8.09541 20.25 8.37041C20.25 8.64541 20.15 8.88291 19.95 9.08291L10.75 18.2829C10.55 18.4829 10.3167 18.5829 10.05 18.5829C9.78336 18.5829 9.55002 18.4829 9.35002 18.2829L5.05002 13.9829C4.85002 13.7829 4.75419 13.5454 4.76252 13.2704C4.77086 12.9954 4.87502 12.7579 5.07502 12.5579C5.27502 12.3579 5.51252 12.2579 5.78752 12.2579C6.06252 12.2579 6.30002 12.3579 6.50002 12.5579L10.05 16.1329Z" fill="white" />
                                    </g>
                                </svg>
                            </div>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    docId('overlay_edit-contact').innerHTML = overlayHTML;
    docId('overlay_edit-contact').classList.remove('d-none');
    activateInputError();
}

/**
 * Generates HTML markup for the confirmation dialog for deleting a contact.
 *
 * @param {number} i - Index of the contact to be deleted.
 * @returns {string} HTML markup for the confirmation dialog.
 */
function confirmationDeleteHTML(i) {
    return `
    <div class="confirmation_main-container">
    <div class="confirmation_top-area">
        <p>Are you sure?</p>
    </div>
    <div class="confirmation_bottom-area">
        <div onclick="toggleConfirmationOverlay()" id="confirmation_disagree-button" class="confirmation_disagree-button mybtn blue-button-container d-flex_row">Discard
        </div>
        <div onclick="deleteContact(${i})" id="confirmation_agree-button" class="confirmation_agree-button save-button-container d-flex_row mybtn">
            Confirm</div>
    </div>
</div>
    `;
}

/**
 * Generates HTML markup for the confirmation dialog for editing a contact.
 *
 * @param {number} i - Index of the contact to be edited.
 * @returns {string} HTML markup for the confirmation dialog.
 */
function confirmationEditHTML(i) {
    return `
    <div class="confirmation_main-container">
    <div class="confirmation_top-area">
        <p>Are you sure?</p>
    </div>
    <div class="confirmation_bottom-area">
        <div onclick="toggleConfirmationOverlay()" id="confirmation_disagree-button" class="confirmation_disagree-button mybtn blue-button-container d-flex_row">Discard
        </div>
        <div onclick="editContact(${i})" id="confirmation_agree-button" class="confirmation_agree-button save-button-container d-flex_row mybtn">
            Confirm</div>
    </div>
</div>
    `;
}