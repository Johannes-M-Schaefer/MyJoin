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
 * Initializes the application by including HTML snippets, checking user authentication,
 * loading contacts, grouping contacts, rendering contacts, loading current user data,
 * displaying user information, and setting event listeners.
 */
document.addEventListener("DOMContentLoaded", init);

/**
 * Initializes the application by including HTML snippets, checking user authentication,
 * loading contacts, grouping contacts, rendering contacts, loading current user data,
 * displaying user information, and setting event listeners.
 */
async function init() {
    await initCurrentUser();
    await initContacts();
    groupContacts();
    renderContacts();
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
 * Handles the form submission to add a new contact.
 * @param {Event} event - The form submission event.
 * @returns {boolean} - Returns true after successfully adding the contact.
 */
async function addContact(event) {
    event.preventDefault();
    const form = document.getElementById("add-contact-form");
    const formData = new FormData(form);
    
    // Verwende get() um die Werte abzurufen
    const name = formData.get("name");
    const email = formData.get("email");
    const mobile = formData.get("mobile");

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