/**
 * Retrieves task data from the form fields.
 *
 * @returns {Object} - The task object.
 */
function getTaskFromForm() {
  return {
    title: docId('taskTitle').value,
    description: docId('taskDescription').value,
    dueDate: docId('taskDueDate').value,
    priority: getPriority(),
    assignedTo: assignedContacts,
    content: docId('addCategoryInputField').innerHTML,
    subtasks: subtasks,
    status: sendTaskStatus
  };
}

/**
 * Gets the selected priority in the add task form.
 *
 * @returns {string} - The priority level ('Urgent', 'Medium', 'Low').
 */
function getPriority() {
  if (docId('urgentPriority').classList.contains('priority_active')) {
    return 'Urgent';
  } else if (docId('mediumPriority').classList.contains('priority_active')) {
    return 'Medium';
  } else if (docId('lowPriority').classList.contains('priority_active')) {
    return 'Low';
  }
}

/**
 * Selects the priority of the task based on the provided priority level.
 *
 * @param {string} priority - The priority level (Urgent, Medium, Low).
 */
function selectPriority(priority) {
  clearPriority(false);
  if (priority.toLowerCase() === 'urgent') {
    docId('urgentPriority').classList.add('priority_active');
    docId('mediumPriority').classList.add('priority_inactive');
    docId('lowPriority').classList.add('priority_inactive');
    docId('prioRed').src = './img/prio_red_white.png';
  } else if (priority.toLowerCase() === 'medium') {
    clearPriority(true);
  } else if (priority.toLowerCase() === 'low') {
    docId('lowPriority').classList.add('priority_active');
    docId('urgentPriority').classList.add('priority_inactive');
    docId('mediumPriority').classList.add('priority_inactive');
    docId('prioGreen').src = './img/prio_green_white.png';
  }
}

/**
 * Clears the priority selections in the add task form.
 *
 * @param {boolean} reset - If true, reset the priority to default state.
 */
function clearPriority(reset) {
  let urgentPriority = docId('urgentPriority');
  let mediumPriority = docId('mediumPriority');
  let lowPriority = docId('lowPriority');
  urgentPriority.classList.remove('priority_inactive', 'priority_active');
  mediumPriority.classList.remove('priority_active', 'priority_inactive');
  lowPriority.classList.remove('priority_active', 'priority_inactive');
  docId('prioRed').src = './img/prio_red.png';
  docId('prioOrange').src = './img/prio_orange.png';
  docId('prioGreen').src = './img/prio_green.png';
  if (reset) {
    resetPriorityDOM();
  }
}

/**
 * Resets the priority in the add task form to the default state.
 */
function resetPriorityDOM() {
  docId('mediumPriority').classList.add('priority_active');
  docId('urgentPriority').classList.add('priority_inactive');
  docId('lowPriority').classList.add('priority_inactive');
  docId('prioOrange').src = './img/prio_orange_white.png';
}

/**
 * Toggles the display of the contacts dropdown.
 */
function toggleContacsDropdown(event) {
  renderAssignedContact();
  loadAndDisplayContacts();
  let content = docId('assignedDropdown');
  let category = docId('addCategory');
  let otherDropdown = docId('categoryDropdown');

  if (!content) return;

  closeOtherDropdown(otherDropdown, 'add_subtasks');
  const isShowing = content.classList.contains('show');
  content.classList.toggle('show', !isShowing);
  addOffSetToHeight(isShowing ? '' : content, category);

  if (event) event.stopPropagation();
}

/**
* Handles clicks outside the dropdown menu to close it if it is open.
* 
* @param {MouseEvent} event - The click event.
*/
function handleClickOutsideDropdown(event) {
  if (!event.target.matches('taskContactsButton')) {
    let dropdowns = docId("assignedDropdown");
    for (let i = 0; i < dropdowns.length; i++) {
      let openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

/**
 * Toggles the display of the category dropdown.
 */
function toggleCategoryDropdown(event) {
  let content = docId('categoryDropdown');
  let addSubtasks = docId('add_subtasks');
  let otherDropdown = docId('assignedDropdown');

  if (!content) return;

  closeOtherDropdown(otherDropdown, 'addCategory');
  const isShowing = content.classList.contains('show');
  content.classList.toggle('show', !isShowing);
  addOffSetToHeight(isShowing ? '' : content, addSubtasks);

  if (event) event.stopPropagation();
}

/**
 * Closes other dropdowns if they are open.
 *
 * @param {HTMLElement} otherDropdown - The other dropdown element.
 * @param {string} id - The ID of the element to adjust height.
 */
function closeOtherDropdown(otherDropdown, id) {
  if (otherDropdown && otherDropdown.classList.contains('show')) {
    otherDropdown.classList.remove('show');
    addOffSetToHeight('', docId(id));
  }
}

/**
 * Adds offset height to the specified div based on another div's height.
 *
 * @param {HTMLElement} divWithOffset - The div to get height from.
 * @param {HTMLElement} divToAdd - The div to apply the offset height.
 */
function addOffSetToHeight(divWithOffset, divToAdd) {
  if (divWithOffset && divToAdd) {
    let height = divWithOffset.offsetHeight;
    divToAdd.style.marginTop = height + 'px';
  } else {
    divToAdd.style.marginTop = '0px';
  }
}

function renderContactList() {
  contacts.forEach(contact => {
      let contactElement = docId(contact.id);
      if (assignedContacts.includes(contact.id)) {
          contactElement.classList.add('active');
          toggleCheckbox(contact.id, true);  // true for checked
      } else {
          contactElement.classList.remove('active');
          toggleCheckbox(contact.id, false); // false for unchecked
      }
  });
}



/**
 * Selects or deselects a contact for the task.
 *
 * @param {string} contactId - The ID of the contact to select or deselect.
 */
/* function toggleContactSelection(contactId, event) {
  
  if (event && typeof event.stopPropagation === 'function') {
    event.stopPropagation();
  }

  let assignedContact = docId(contactId);

  if (!assignedContact) {
    console.error(`Element with ID ${contactId} not found.`);
    return;
  }

  let index = assignedContacts.indexOf(contactId);
    
  if (index === -1) {
      // Kontakt auswählen (hinzufügen)
      assignedContacts.push(contactId);
      assignedContact.classList.add('active'); // `.active` Klasse hinzufügen
      toggleCheckbox(contactId, true); // Checkbox als aktiviert anzeigen
  } else {
      // Kontakt abwählen (entfernen)
      assignedContacts.splice(index, 1);
      assignedContact.classList.remove('active'); // `.active` Klasse entfernen
      toggleCheckbox(contactId, false); // Checkbox als deaktiviert anzeigen
  }
} */
/*   function toggleContactSelection(contactId) {
    let assignedContact = docId(contactId);
  
    if (!assignedContact) {
      console.error(`Element with ID ${contactId} not found.`);
      return; 
    }
  
    let index = assignedContacts.indexOf(contactId);
    

    let isChecked = toggleCheckbox(contactId);
  
    if (isChecked) {
      if (index === -1) {
        assignedContacts.push(contactId);
      }
      assignedContact.classList.add('active'); 
    } else {
      if (index !== -1) {
        assignedContacts.splice(index, 1);
      }
      assignedContact.classList.remove('active');
    }
  
    renderAssignedContact();
  } */

  /**
 * Hilfsfunktion zur Aktualisierung der Auswahl von Kontakten.
 */
/*   function updateAssignedContacts(contactId, assignedContact) {
    let index = assignedContacts.indexOf(contactId);
  
    if (index !== -1) {
      // Kontakt abwählen
      assignedContacts.splice(index, 1);  // Entfernt den Kontakt basierend auf dem Index
      assignedContact.classList.remove('active');
      toggleCheckbox(contactId, false);  // Checkbox deaktivieren
    } else {
      // Kontakt auswählen
      assignedContacts.push(contactId);  // Fügt den Kontakt zum Array hinzu
      assignedContact.classList.add('active');
      toggleCheckbox(contactId, true);  // Checkbox aktivieren
    }
  } */
  function toggleContactSelection(contactId, event) {
    stopEventPropagation(event);  // Event propagation stoppen, falls vorhanden
  
    let assignedContact = docId(contactId);
    if (!assignedContact) {
      console.error(`Element with ID ${contactId} not found.`);
      return;
    }
  
    // Aktualisiere das Array und die UI
    updateAssignedContacts(contactId, assignedContact);
  }

  function updateContactUI(contactId, assignedContact, isSelected) {
    setActiveClass(assignedContact, isSelected);  // Setzt die `active` Klasse
    toggleCheckbox(contactId, isSelected);  // Zeigt die Checkbox an
  }
  
  function updateAssignedContacts(contactId, assignedContact) {
    let isSelected = assignedContacts.includes(contactId);
  
    // Array manipulieren
    updateAssignedContactsArray(contactId);
  
    // UI aktualisieren
    updateContactUI(contactId, assignedContact, !isSelected);
  }

  function setActiveClass(assignedContact, isSelected) {
    if (isSelected) {
      assignedContact.classList.add('active');
    } else {
      assignedContact.classList.remove('active');
    }
  }

  function updateAssignedContactsArray(contactId) {
    let index = assignedContacts.indexOf(contactId);
  
    if (index !== -1) {
      // Kontakt abwählen
      assignedContacts.splice(index, 1);  // Entfernt den Kontakt basierend auf dem Index
    } else {
      // Kontakt auswählen
      assignedContacts.push(contactId);  // Fügt den Kontakt zum Array hinzu
    }
  }
  
  



/**
 * Toggles the checkbox state for the contact.
 *
 * @param {string} contactId - The ID of the contact.
 */
/*   function toggleCheckbox(contactId) {
    const checkboxContainer = docId(`checkbox-manuell-${contactId}`);
    const currentSvg = checkboxContainer.innerHTML;
  
    const checked = `
      <svg id="checked" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 11V17C20 18.6569 18.6569 20 17 20H7C5.34315 20 4 18.6569 4 17V7C4 5.34315 5.34315 4 7 4H15" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
        <path d="M8 12L12 16L20 4.5" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;

      const unchecked = `
      <svg id="unchecked" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="16" height="16" rx="3" stroke="#4589FF" stroke-width="2"/>
      </svg>`;
  
    if (currentSvg.includes('unchecked')) {
      checkboxContainer.innerHTML = checked;
    } else {
      checkboxContainer.innerHTML = `
        <svg id="unchecked" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="16" height="16" rx="3" stroke="#4589FF" stroke-width="2"/>
        </svg>`;
    }
  } */
/* function toggleCheckbox(contactId) {
  const checkboxContainer = docId(`checkbox-manuell-${contactId}`);
  const currentSvg = checkboxContainer.innerHTML;

  const checked = `
      <svg id="checked-${contactId}" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 11V17C20 18.6569 18.6569 20 17 20H7C5.34315 20 4 18.6569 4 17V7C4 5.34315 5.34315 4 7 4H15" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
        <path d="M8 12L12 16L20 4.5" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;

  const unchecked = `
      <svg id="unchecked-${contactId}" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="16" height="16" rx="3" stroke="#4589FF" stroke-width="2"/>
      </svg>`;

  if (currentSvg.includes('unchecked')) {
    checkboxContainer.innerHTML = checked;
  } else {
    checkboxContainer.innerHTML = unchecked;
  }
} */
/* function toggleCheckbox(contactId, isChecked) {
  const checkboxContainer = docId(`checkbox-manuell-${contactId}`);
  
  if (!checkboxContainer) {
    console.error(`Checkbox container for contact ${contactId} not found.`);
    return;
  }

  const checkedSvg = `
    <svg id="checked-${contactId}" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 11V17C20 18.6569 18.6569 20 17 20H7C5.34315 20 4 18.6569 4 17V7C4 5.34315 5.34315 4 7 4H15" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
      <path d="M8 12L12 16L20 4.5" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;

  const uncheckedSvg = `
    <svg id="unchecked-${contactId}" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="16" height="16" rx="3" stroke="#4589FF" stroke-width="2"/>
    </svg>`;

  // Set the appropriate SVG based on isChecked
  checkboxContainer.innerHTML = isChecked ? checkedSvg : uncheckedSvg;
} */
function toggleCheckbox(contactId, isChecked) {
  const checkboxContainer = docId(`checkbox-manuell-${contactId}`);

  const checked = `
    <svg id="checked" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 11V17C20 18.6569 18.6569 20 17 20H7C5.34315 20 4 18.6569 4 17V7C4 5.34315 5.34315 4 7 4H15" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
      <path d="M8 12L12 16L20 4.5" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;

  const unchecked = `
    <svg id="unchecked" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="16" height="16" rx="3" stroke="#4589FF" stroke-width="2"/>
    </svg>`;

  checkboxContainer.innerHTML = isChecked ? checked : unchecked;
}



/**
 * Renders the selected contacts for the task.
 */
function renderAssignedContact() {
  let content = docId('selectedContact');
  content.innerHTML = '';
  
  assignedContacts.forEach(contactId => {
    let contact = getContactById(contactId);
    if (contact) {
      content.innerHTML += templateUserInitials(contact);
    }
  });
}


/**
 * Selects a category for the task.
 *
 * @param {string} text - The category text to select.
 */
function selectCategory(text) {
  docId('addCategoryInputField').innerHTML = text;
  toggleCategoryDropdown();
}

function toggleCategoryUI() {
  if (condition) {
    
  }
}

/**
 * Adds a subtask to the task.
 */
function addSubtask() {
  let subtaskInput = docId('inputSubtasks');
  let subtask = subtaskInput.value.trim();
  if (subtask === '') return;
  subtasks.push(subtask);
  renderSubtasks();
  clearInput('inputSubtasks');
  onInputSubtask();
}

/**
 * Renders the subtasks in the task.
 */
function renderSubtasks() {
  let subtaskContent = docId('subtaskContent');
  subtaskContent.innerHTML = '';
  subtasks.forEach((subtask, index) => {
    subtaskContent.innerHTML += templateBuildSubtask(subtask, index);
  });
}

/**
 * Deletes a subtask from the task.
 *
 * @param {number} index - The index of the subtask to delete.
 */
function deleteSubtask(index) {
  subtasks.splice(index, 1);
  renderSubtasks();
}

/**
 * Edits a subtask in the task.
 *
 * @param {number} index - The index of the subtask to edit.
 */
function editSubtask(index) {
  let subTaskContent = docId(`subtask_${index}`);
  let subTaskText = docId(`subtask_edit_${index}`);
  subTaskContent.classList.add('inactive');
  subTaskText.classList.remove('inactive');
}

/**
 * Handles the input event for the subtask input field.
 */
function onInputSubtask() {
  let subtaskInput = docId('inputSubtasks').value;
  let subtaskIconActive = docId('subtaskIconsActive');
  let subtaskIconInactive = docId('subtaskIconsInactive');
  if (subtaskInput.trim() !== '') {
    subtaskIconActive.classList.add('inactive');
    subtaskIconInactive.classList.remove('inactive');
  } else {
    subtaskIconActive.classList.remove('inactive');
    subtaskIconInactive.classList.add('inactive');
  }
}

/**
 * Saves the edited subtask.
 *
 * @param {number} index - The index of the subtask to save.
 */
function saveSubtask(index) {
  let subtaskInput = docId(`subtask_input_${index}`).value;
  if (subtaskInput !== null && subtaskInput.trim() !== '') {
    subtasks[index] = subtaskInput.trim();
    renderSubtasks();
  }
}

/**
 * Clears the entire Add Task form.
 */
function clearAddTask() {
  clearInput('taskTitle');
  clearInput('taskDescription');
  clearInput('taskDueDate');
  clearPriority(true);
  clearHtml('selectAssignedTo', 'Select contacts to assign');
  assignedContacts = [];
  renderAssignedContact();
  clearHtml('addCategoryInputField', 'Select task category');
  clearInput('inputSubtasks');
  clearHtml('subtaskContent', '');
  subtasks = [];
}

/**
 * Adds animations for sending the task.
 */
function showSendTaskPopup() {
  docId('hidden_container').classList.add('visible');
  docId('hidden_popup').classList.add('visible');

  setTimeout(() => {
    docId('hidden_container').classList.remove('visible');
    docId('hidden_popup').classList.remove('visible');
  }, 1000);
}

/**
 * Redirects from the added task to the board.
 */
function redirect() {
  var targetUrl = window.location.origin + '/board.html';
  setTimeout(function () {
    window.location.href = targetUrl;
  }, 1000);
}

/**
 * Clears the value of an input field.
 *
 * @param {string} id - The ID of the input field to clear.
 */
function clearInput(id) {
  docId(id).value = '';
}

/**
 * Clears the inner HTML of an element.
 *
 * @param {string} id - The ID of the element to clear.
 * @param {string} html - The HTML content to set for the element.
 */
function clearHtml(id, html) {
  docId(id).innerHTML = html;
}
