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
