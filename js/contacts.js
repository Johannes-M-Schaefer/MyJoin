/**
 * Represents the currently selected contact.
 * @type {Object | null}
 */
let selectedContact = null;

/**
 * Stores contacts grouped by their first letter.
 * @type {Object}
 */
let groupedContacts = groupContacts();

/**
 * Retrieves input values for a new contact from the form.
 * @returns {Object} An object containing the name, email, and mobile number of the new contact.
 */
function getNewInput() {
    let newName = docId('edit-name').value;
    let newEmail = docId('edit-email').value;
    let newMobile = docId('edit-mobile').value;
    return { name: newName, email: newEmail, mobile: newMobile };
}

/**
 * Groups contacts by the first letter of their names.
 * @returns {Object} An object where keys are first letters and values are arrays of contacts.
 */
function groupContacts() {
    let groupedContacts = {};
    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        let firstLetter = contact.name.charAt(0).toUpperCase();
        if (!groupedContacts[firstLetter]) {
            groupedContacts[firstLetter] = [];
        }
        groupedContacts[firstLetter].push(contact);
    }
    return groupedContacts;
}

/**
 * Initializes the application by including HTML snippets, checking user authentication,
 * loading contacts, grouping contacts, rendering contacts, loading current user data,
 * displaying user information, and setting event listeners for logout and dropdowns.
 * Also handles orientation changes and periodic orientation checks.
 */
async function init() {
    includeHTML();
    checkFirstPage();
    await initContacts();
    groupContacts();
    renderContacts();
    await loadCurrentUsers();
    showDropUser();
    docId("log_out").addEventListener('click', logOut);
    document.querySelector('.drop-logo').addEventListener('click', toggleDropdown);
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
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    checkOrientation();
    setInterval(checkOrientation, 500);
}

/**
 * Renders the contacts grouped by their first letter and displays them in the UI.
 * Clears the existing contacts container and populates it with HTML sections
 * representing each group of contacts.
 */
function renderContacts() {
    let groupedContacts = groupContacts();
    let contactsContainer = docId("contact-filter");
    contactsContainer.innerHTML = '';
    globalIndex = 0;
    let sortedLetters = Object.keys(groupedContacts).sort();
    for (let i = 0; i < sortedLetters.length; i++) {
        let letter = sortedLetters[i];
        let contactsHtml = '';
        let group = groupedContacts[letter];
        for (let j = 0; j < group.length; j++) {
            contactsHtml += createContactHtml(group[j], globalIndex);
            globalIndex++;
        }
        let sectionHtml = createGroupHtml(letter, contactsHtml);
        contactsContainer.innerHTML += sectionHtml;
    }
}

/**
 * Opens a selected contact by rendering its details in the UI.
 * @param {number} i - Index of the contact to be opened.
 */
function openContact(i) {
    let selectedContainer = docId('selected-container');
    let contactContainer = docId(`contact-container(${i})`);
    if (selectedContact === contactContainer) {
        closeSelectedContactOverlay();
        return;
    }
    if (selectedContact) {
        closeSelectedContactOverlay(false);
        setTimeout(() => {
            switchToNewContact(i, contactContainer, selectedContainer);
        }, 500);
    } else {
        switchToNewContact(i, contactContainer, selectedContainer);
    }
}

/**
 * Switches to a new contact by updating the UI.
 * @param {number} i - Index of the contact.
 * @param {HTMLElement} contactContainer - The HTML element of the contact container.
 * @param {HTMLElement} selectedContainer - The HTML element of the selected contact container.
 */
function switchToNewContact(i, contactContainer, selectedContainer) {
    if (selectedContact) {
        selectedContact.classList.remove('blue-background', 'selected');
    }
    contactContainer.classList.add('blue-background', 'selected');
    selectedContainer.innerHTML = generateSelectedContactHTML(i);
    selectedContainer.classList.remove('d-none');
    selectedContainer.classList.remove('hide');
    selectedContainer.classList.add('show');
    selectedContact = contactContainer;
}


/**
 * Handles the form submission to add a new contact.
 * Prevents default form submission behavior, extracts form data,
 * sends a POST request to add the contact to the database,
 * clears the add contact form upon successful submission,
 * shows a creation popup, closes the add contact overlay,
 * and initializes the application.
 * @param {Event} event - The form submission event.
 * @returns {boolean} - Returns true after successfully adding the contact.
 */
async function addContact(event) {
    event.preventDefault();
    const formData = new FormData(document.getElementById("add-contact-form"));
    const name = formData.get("name");
    const email = formData.get("email");
    const mobile = formData.get("tel");
    let contact = { name: name, email: email, mobile: mobile };
    try {
        await postData("/contacts", contact);
        clearAddForm();
    } catch (error) {
        console.error('Error adding contact:', error);
    }
    showCreationPopup();
    closeAddContactOverlay();
    init();
    return true;
}

/**
 * Deletes a contact from the database based on its index in the contacts array.
 * Toggles the confirmation overlay, sends a DELETE request to remove the contact,
 * logs the deletion in the console, initializes the application,
 * hides the selected contact overlay, and shows a delete popup.
 * @param {number} i - Index of the contact to be deleted.
 */
async function deleteContact(i) {
    let contactId = contacts[i].id;
    toggleConfirmationOverlay();
    await deleteData(`/contacts/${contactId}`);
    console.log("Contact deleted:", contactId);
    init();
    docId('selected-container').classList.add('d-none');
    closeSelectedContactOverlay();
    showDeletePopup();
}

/**
 * Edits a contact in the database based on its index in the contacts array.
 * Toggles the confirmation overlay, retrieves the existing contact details,
 * updates the contact with new input data, sends a PUT request to update the contact,
 * stores the updated contacts in local storage, shows an update popup,
 * closes the selected contact overlay and edit contact overlay,
 * and initializes the application.
 * @param {number} i - Index of the contact to be edited.
 */
async function editContact(i) {
    toggleConfirmationOverlay();
    let contactId = contacts[i].id;
    let oldContact = await getData(`/contacts/${contactId}`);
    let newContact = getNewInput();
    let changedContact = { ...oldContact, ...newContact };
    await updateData(`/contacts/${contactId}`, changedContact);
    localStorage.setItem('contacts', JSON.stringify(contacts));
    showUpdatePopup();
    closeSelectedContactOverlay();
    closeEditContactOverlay();
    init();
}

/**
 * Displays a confirmation overlay for editing a contact.
 * Retrieves the existing contact details, compares them with new input,
 * updates the overlay content, and toggles the confirmation overlay visibility.
 * If old and new contact data are the same, triggers an error animation.
 * @param {number} i - Index of the contact to be edited.
 */
async function confirmationEdit(i) {
    let confirmationOverlay = docId('confirmation_overlay');
    let contactId = contacts[i].id;
    let oldContact = await getData(`/contacts/${contactId}`);
    let newContact = getNewInput();
    if (oldContact === newContact) {
        await addErrorAnimation();
        return;
    }
    confirmationOverlay.innerHTML = confirmationEditHTML(i);
    toggleConfirmationOverlay();
}

/**
 * Displays a confirmation overlay for deleting a contact.
 * Updates the overlay content based on the selected contact index
 * and toggles the confirmation overlay visibility.
 * @param {number} i - Index of the contact to be deleted.
 */
function confirmationDelete(i) {
    let confirmationOverlay = docId('confirmation_overlay');
    confirmationOverlay.innerHTML = confirmationDeleteHTML(i);
    toggleConfirmationOverlay();
}

/**
 * Adds a blue background to the selected contact container.
 * If another contact is already selected, removes its blue background.
 * Toggles the visibility of the selected contact details container.
 * @param {number} i - Index of the contact container to be selected.
 */
/* function addBlueBackground(i) {
    let contactContainer = docId(`contact-container(${i})`);
    if (selectedContact === contactContainer) {
        contactContainer.classList.remove('blue-background');
        docId('selected-container').classList.remove('show');
        selectedContact = null;
    } else {
        if (selectedContact !== null) {
            selectedContact.classList.remove('blue-background');
        }
        contactContainer.classList.add('blue-background');
        docId('selected-container').classList.add('show');
        selectedContact = contactContainer;
    }
} */

/**
 * Shows a creation popup for indicating a successful contact addition.
 */
function showCreationPopup() {
    docId('creation_popup_container').classList.add('show');
    docId('creation_popup').classList.add('show');
    setTimeout(() => {
        docId('creation_popup_container').classList.remove('show');
    }, 1000);
}

/**
 * Shows an update popup for indicating a successful contact update.
 */
function showUpdatePopup() {
    docId('update_popup_container').classList.add('show');
    docId('update_popup').classList.add('show');
    setTimeout(() => {
        docId('update_popup_container').classList.remove('show');
    }, 1000);
}

/**
 * Shows a delete popup for indicating a successful contact deletion.
 */
function showDeletePopup() {
    docId('delete_popup_container').classList.add('show');
    docId('delete_popup').classList.add('show');
    setTimeout(() => {
        docId('delete_popup_container').classList.remove('show');
    }, 1000);
}

/**
 * Toggles the visibility of the confirmation overlay.
 * If the overlay is hidden ('d-none'), it displays it ('d-flex').
 * If the overlay is displayed ('d-flex'), it hides it ('d-none').
 */
function toggleConfirmationOverlay() {
    let confirmationOverlay = docId('confirmation_overlay');
    if (confirmationOverlay.classList.contains('d-none')) {
        confirmationOverlay.classList.remove('d-none');
        confirmationOverlay.classList.add('d-flex');
    } else {
        confirmationOverlay.classList.remove('d-flex');
        confirmationOverlay.classList.add('d-none');
    }
}

/**
 * Toggles the visibility of the navigation container for contacts.
 */
function toggleNav() {
    let nav = docId('mobileNav');
    if (nav.classList.contains('show')) {
        nav.classList.remove('show');
    } else {
        nav.classList.add('show');
    }
}
