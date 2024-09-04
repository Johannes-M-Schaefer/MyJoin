/**
 * Represents the currently selected contact.
 * @type {HTMLElement | null}
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
    return {
        name: docId('edit-name').value,
        email: docId('edit-email').value,
        mobile: docId('edit-mobile').value
    };
}

/**
 * Groups contacts by the first letter of their names.
 * @returns {Object} An object where keys are first letters and values are arrays of contacts.
 */
function groupContacts() {
    let grouped = {};
    contacts.forEach(contact => {
        let firstLetter = contact.name.charAt(0).toUpperCase();
        if (!grouped[firstLetter]) {
            grouped[firstLetter] = [];
        }
        grouped[firstLetter].push(contact);
    });
    return grouped;
}

/**
 * Initializes the application by including HTML snippets, checking user authentication,
 * loading contacts, grouping contacts, rendering contacts, loading current user data,
 * displaying user information, and setting event listeners for logout and dropdowns.
 * Also handles orientation changes and periodic orientation checks.
 */
/**
 * Initializes the application by including HTML snippets, checking user authentication,
 * loading contacts, grouping contacts, rendering contacts, loading current user data,
 * displaying user information, and setting event listeners.
 */
document.addEventListener("DOMContentLoaded", async function () {
    await initCurrentUser();
    await initContacts();
    groupContacts();
    renderContacts();
});

/**
 * Renders the contacts grouped by their first letter and displays them in the UI.
 */
function renderContacts() {
    let grouped = groupContacts();
    let container = docId("contact-filter");
    container.innerHTML = '';
    globalIndex = 0;
    Object.keys(grouped).sort().forEach(letter => {
        let contactsHtml = grouped[letter].map((contact, index) => createContactHtml(contact, globalIndex++)).join('');
        container.innerHTML += createGroupHtml(letter, contactsHtml);
    });
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
        setTimeout(() => switchToNewContact(i, contactContainer, selectedContainer), 500);
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
        updateContactColors(selectedContact, false);
    }
    updateContactColors(contactContainer, true);
    selectedContainer.innerHTML = generateSelectedContactHTML(i);
    selectedContainer.classList.remove('d-none', 'hide');
    selectedContainer.classList.add('show');
    selectedContact = contactContainer;
}

/**
 * Updates the background and text colors of the contact container.
 * @param {HTMLElement} contactContainer - The HTML element of the contact container.
 * @param {boolean} isSelected - Indicates if the contact is selected.
 */
function updateContactColors(contactContainer, isSelected) {
    if (isSelected) {
        contactContainer.classList.add('blue-background');
        contactContainer.querySelectorAll('.contact-container-text-name, .contact-container-mail')
            .forEach(element => element.style.color = '#ffffff');
    } else {
        contactContainer.classList.remove('blue-background');
        contactContainer.querySelectorAll('.contact-container-text-name, .contact-container-mail')
            .forEach(element => element.style.color = '');
    }
}

/**
 * Handles the form submission to add a new contact.
 * @param {Event} event - The form submission event.
 * @returns {boolean} - Returns true after successfully adding the contact.
 */
async function addContact(event) {
    event.preventDefault();
    const { name, email, mobile } = new FormData(document.getElementById("add-contact-form"));
    try {
        await postData("/contacts", { name, email, mobile });
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
 * @param {number} i - Index of the contact to be edited.
 */
async function confirmationEdit(i) {
    let confirmationOverlay = docId('confirmation_overlay');
    let contactId = contacts[i].id;
    let oldContact = await getData(`/contacts/${contactId}`);
    let newContact = getNewInput();
    if (JSON.stringify(oldContact) === JSON.stringify(newContact)) {
        await addErrorAnimation();
        return;
    }
    confirmationOverlay.innerHTML = confirmationEditHTML(i);
    toggleConfirmationOverlay();
}

/**
 * Displays a confirmation overlay for deleting a contact.
 * @param {number} i - Index of the contact to be deleted.
 */
function confirmationDelete(i) {
    let confirmationOverlay = docId('confirmation_overlay');
    confirmationOverlay.innerHTML = confirmationDeleteHTML(i);
    toggleConfirmationOverlay();
}

/**
 * Shows a creation popup indicating a successful contact addition.
 */
function showCreationPopup() {
    docId('creation_popup_container').classList.add('show');
    docId('creation_popup').classList.add('show');
    setTimeout(() => docId('creation_popup_container').classList.remove('show'), 1000);
}

/**
 * Shows an update popup indicating a successful contact update.
 */
function showUpdatePopup() {
    docId('update_popup_container').classList.add('show');
    docId('update_popup').classList.add('show');
    setTimeout(() => docId('update_popup_container').classList.remove('show'), 1000);
}

/**
 * Shows a delete popup indicating a successful contact deletion.
 */
function showDeletePopup() {
    docId('delete_popup_container').classList.add('show');
    docId('delete_popup').classList.add('show');
    setTimeout(() => docId('delete_popup_container').classList.remove('show'), 1000);
}

/**
 * Toggles the visibility of the confirmation overlay.
 */
function toggleConfirmationOverlay() {
    let overlay = docId('confirmation_overlay');
    overlay.classList.toggle('d-none');
    overlay.classList.toggle('d-flex');
}

/**
 * Toggles the visibility of the navigation container for contacts.
 */
function toggleNav() {
    docId('mobileNav').classList.toggle('show');
}

/**
 * Clears the input fields of the 'add contact' form.
 */
function clearAddForm() {
    docId('add-contact-form').reset();
}

/**
 * Activates input error handling for specified fields.
 */
function activateInputError() {
    const fields = [
        { fieldId: 'email', parentId: 'email-contacts' },
        { fieldId: 'name', parentId: 'name-contacts' },
        { fieldId: 'mobile', parentId: 'mobile-contacts' },
        { fieldId: 'edit-name', parentId: 'edit-name-contacts' },
        { fieldId: 'edit-mobile', parentId: 'edit-mobile-contacts' },
        { fieldId: 'edit-email', parentId: 'edit-email-contacts' }
    ];
    fields.forEach(({ fieldId, parentId }) => {
        let field = docId(fieldId);
        let parentDiv = docId(parentId);
        field.addEventListener('invalid', () => {
            parentDiv.classList.add('input-error');
            parentDiv.addEventListener('animationend', () => parentDiv.classList.remove('input-error'), { once: true });
        });
        field.addEventListener('input', () => parentDiv.classList.remove('input-error'));
    });
}

/**
 * Displays an error animation on input fields in the edit contact form.
 */
function addErrorAnimation() {
    const fields = [
        { parentId: 'edit-name-contacts' },
        { parentId: 'edit-mobile-contacts' },
        { parentId: 'edit-email-contacts' }
    ];
    fields.forEach(({ parentId }) => {
        let parentDiv = docId(parentId);
        parentDiv.classList.add('input-error');
        parentDiv.addEventListener('animationend', () => parentDiv.classList.remove('input-error'), { once: true });
    });
}

/**
 * Toggles visibility of selected contact slide animation.
 */
function addSelectedSlideAnimation() {
    docId('selected-container').classList.toggle('show');
}

/**
 * Opens an overlay to edit a contact.
 * @param {number} i - Index of the contact to be edited.
 */
function openEditContactOverlay(i) {
    renderEditOverlay(i);
    docId("overlay_edit-contact").classList.remove('d-none');
}

/**
 * Opens an overlay to add a new contact.
 */
function openAddContactOverlay() {
    docId("overlay_add-contact").classList.remove('d-none');
    activateInputError();
}

/**
 * Closes the overlay used to add a new contact.
 */
function closeAddContactOverlay() {
    let overlay = docId('overlay_add-contact');
    let mainContainer = document.querySelector('.add-contact_main-container');
    mainContainer.classList.add('hide');
    setTimeout(() => {
        overlay.classList.add('d-none');
        mainContainer.classList.remove('hide');
    }, 500);
}

/**
 * Closes the overlay used to edit a contact.
 */
function closeEditContactOverlay() {
    let overlay = docId('overlay_edit-contact');
    let mainContainer = document.querySelector('.edit-contact_main-container');
    mainContainer.classList.add('hide');
    setTimeout(() => {
        overlay.classList.add('d-none');
        mainContainer.classList.remove('hide');
    }, 500);
}

/**
 * Closes the overlay displaying selected contact details.
 * @param {boolean} [resetSelectedContact=true] - Whether to reset the selected contact.
 */
function closeSelectedContactOverlay(resetSelectedContact = true) {
    let overlay = docId('selected-container');
    if (selectedContact) {
        updateContactColors(selectedContact, false);
    }
    overlay.classList.remove('show');
    overlay.classList.add('hide');
    setTimeout(() => {
        overlay.classList.add('d-none');
        if (resetSelectedContact) {
            selectedContact = null;
        }
    }, 500);
}
