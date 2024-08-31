let assignedContacts = [];
let subtasks = [];
let sendTaskStatus = 'To do';

/**
 * Retrieves task data from the form fields.
 *
 * @returns {Object} - The task object.
 */
function getTaskFromForm() {
  let task = {
    title: docId('taskTitle').value,
    description: docId('taskDescription').value,
    dueDate: docId('taskDueDate').value,
    priority: getPriority(),
    assignedTo: assignedContacts,
    content: docId('addCategoryInputField').innerHTML,
    subtasks: subtasks,
    status: sendTaskStatus
  };
  return task;
}

/**
 * Initializes the current user and sets up the task form.
 */
async function init() {
  await initCurrentUser();

  setTimeout(() => {
    addTaskContacs();
  }, 1000);

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

  setDateRestriction('taskDueDate');
}

/**
 * Sends a task to the server (e.g., Firebase). If an ID is provided, the task is updated; otherwise, a new task is created.
 *
 * @param {string} [id] - The ID of the task to update (optional).
 */
async function sendTask(id) {
  let task = getTaskFromForm();
  if (id) {
    let updatingTask = getTaskById(id);
    if (updatingTask.finishedSubtasks) {
      task.finishedSubtasks = updatingTask.finishedSubtasks;
    }
    task.status = updatingTask.status;
    await updateTaskById(id, task);
  } else {
    await postData('/tasks', task);
  }
  clearAddTask();
  add_animations();
  init();
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
 * Resets the priority in the add task form to the default state.
 */
function resetPriorityDOM() {
  docId('mediumPriority').classList.add('priority_active');
  docId('urgentPriority').classList.add('priority_inactive');
  docId('lowPriority').classList.add('priority_inactive');
  docId('prioOrange').src = './img/prio_orange_white.png';
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
 * Toggles the display of the contacts dropdown.
 */
function toggleContacsDropdown() {
  let content = docId('assignedDropdown');
  let category = docId('addCategory');
  let otherDropdown = docId('categoryDropdown');

  closeOtherDropdown(otherDropdown, 'add_subtasks');
  if (content.classList.contains('show')) {
    content.classList.remove('show');
    addOffSetToHeight('', category);
  } else {
    content.classList.add('show');
    addOffSetToHeight(content, category);
  }
  event.stopPropagation();
}

/**
 * Toggles the display of the category dropdown.
 */
function toggleCategoryDropdown() {
  let content = docId('categoryDropdown');
  let addSubtasks = docId('add_subtasks');
  let otherDropdown = docId('assignedDropdown');

  closeOtherDropdown(otherDropdown, 'addCategory');
  if (content) {
    if (content.classList.contains('show')) {
      content.classList.remove('show');
      addOffSetToHeight('', addSubtasks);
    } else {
      content.classList.add('show');
      addOffSetToHeight(content, addSubtasks);
    }
  }
  event.stopPropagation();
}

/**
 * Closes dropdowns if clicked outside of them.
 */
document.addEventListener('click', function(event) {
  ['assignedDropdown', 'categoryDropdown'].forEach(id => {
    let dropdown = docId(id);
    let offsetDivId = id === 'assignedDropdown' ? 'addCategory' : 'add_subtasks';
    if (dropdown && !dropdown.contains(event.target) && !event.target.closest(`#${id.replace('Dropdown', '')}`)) {
      dropdown.classList.remove('show');
      addOffSetToHeight('', docId(offsetDivId));
    }
  });
});

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

/**
 * Adds contacts to the task form's contacts dropdown.
 */
async function addTaskContacs() {
  await initContacts();
  let contactDropdown = docId('assignedDropdown');
  contactDropdown.innerHTML = '';
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    contactDropdown.innerHTML += templateBuildContactDropdown(contact, true);
  }
}

/**
 * Selects or deselects a contact for the task.
 *
 * @param {string} contactId - The ID of the contact to select or deselect.
 */
function selectContact(contactId) {
  let assignedContact = docId(contactId);
  let index = assignedContacts.indexOf(contactId);
  if (index === -1) {
    assignedContacts.push(contactId);
    assignedContact.classList.add('active');
    toggleCheckbox(contactId);
  } else {
    assignedContacts.splice(index, 1);
    assignedContact.classList.remove('active');
    toggleCheckbox(contactId);
  }
  renderAssignedContact();
}

/**
 * Toggles the checkbox state for the contact.
 *
 * @param {string} contactId - The ID of the contact.
 */
function toggleCheckbox(contactId) {
  const checkboxContainer = docId(`checkbox-manuell-${contactId}`);
  const currentSvg = checkboxContainer.innerHTML;
  
  const checked = `
    <svg id="checked" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 11V17C20 18.6569 18.6569 20 17 20H7C5.34315 20 4 18.6569 4 17V7C4 5.34315 5.34315 4 7 4H15" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
      <path d="M8 12L12 16L20 4.5" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  
  if (currentSvg.includes('unchecked')) {
    checkboxContainer.innerHTML = checked;
  } else {
    checkboxContainer.innerHTML = `
      <svg id="unchecked" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="16" height="16" rx="3" stroke="#4589FF" stroke-width="2"/>
      </svg>`;
  }
}

/**
 * Renders the selected contacts for the task.
 */
function renderAssignedContact() {
  let content = docId('selectedContact');
  content.innerHTML = '';
  for (let i = 0; i < assignedContacts.length; i++) {
    content.innerHTML += templateUserInitials(getContactById(assignedContacts[i]));
  }
}

/**
 * Selects a category for the task.
 *
 * @param {string} text - The category text to select.
 */
function selectCategory(text) {
  let inputField = docId('addCategoryInputField');
  inputField.innerHTML = text;
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
function add_animations() {
  docId('hidden_container').classList.add('visible');
  docId('hidden_popup').classList.add('visible');

  setTimeout(() => {
    docId('hidden_container').classList.remove('visible');
    docId('hidden_popup').classList.remove('visible');
  }, 2000);
}

/**
 * Redirects from the added task to the board.
 */
function redirect() {
  var targetUrl = window.location.origin + '/board.html';
  setTimeout(function() {
    window.location.href = targetUrl;
  }, 1000);
}
