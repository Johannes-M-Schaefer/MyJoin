/**
 * Generates HTML template for displaying a "No Task" message.
 *
 * @param {string} status - The status to be displayed in the message.
 * @returns {string} - The HTML string for the "No Task" message.
 */
function templateNoTask(status) {
  return `<div class="no_task_to_do" draggable="false">
      <span>No Task ${status}</span>
    </div>`;
}

/**
 * Generates HTML template for a detailed overlay card displaying task information.
 *
 * @param {Object} task - The task object containing task details.
 * @param {string} task.content - The content or category of the task.
 * @param {string} task.priority - The priority level of the task.
 * @param {Array} task.assignedTo - The list of contacts assigned to the task.
 * @param {Array} [task.subtasks] - The list of subtasks for the task (optional).
 * @param {Array} [task.finishedSubtasks] - The list of completed subtasks (optional).
 * @param {string} task.id - The unique identifier of the task.
 * @param {string} task.title - The title of the task.
 * @param {string} task.description - The description of the task.
 * @param {string} task.dueDate - The due date of the task.
 * @returns {string} - The HTML string for the task overlay card.
 */
function templateBuildOverlayCard(task){
  let categoryClass = getTaskCategoryClass(task.content);
  let setPriority = getPriorityIcon(task.priority);
  let contact = templateBuildOverlayContacts(task.assignedTo);

  let setSubtask = '';
  if (task.subtasks && task.subtasks.length > 0) {
    setSubtask = `
      <div class="overlay_subtasks">
        <span><b class="card_b">Subtasks</b></span>  
        ${templateOverlaySubtasks(task.subtasks, task.finishedSubtasks, task.id)}
      </div>`;
  }

  return `
    <div class="overlay_card">
      <div class="overlay_category">
        <span class="overlay_category_span ${categoryClass}">${task.content}</span>   
        
        <div class="x-button click-animation" onclick="closeOverlayTop()">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <mask id="mask0_19024_6446" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="4" y="4" width="24"
            height="24">
            <rect x="4" y="4" width="24" height="24" fill="#D9D9D9" />
          </mask>
          <g mask="url(#mask0_19024_6446)">
            <path
              d="M16 17.8642L9.46667 24.389C9.22223 24.6331 8.91112 24.7552 8.53334 24.7552C8.15556 24.7552 7.84445 24.6331 7.6 24.389C7.35556 24.1449 7.23334 23.8342 7.23334 23.4569C7.23334 23.0796 7.35556 22.7689 7.6 22.5248L14.1333 16L7.6 9.47527C7.35556 9.23115 7.23334 8.92045 7.23334 8.54316C7.23334 8.16588 7.35556 7.85518 7.6 7.61106C7.84445 7.36693 8.15556 7.24487 8.53334 7.24487C8.91112 7.24487 9.22223 7.36693 9.46667 7.61106L16 14.1358L22.5333 7.61106C22.7778 7.36693 23.0889 7.24487 23.4667 7.24487C23.8444 7.24487 24.1556 7.36693 24.4 7.61106C24.6444 7.85518 24.7667 8.16588 24.7667 8.54316C24.7667 8.92045 24.6444 9.23115 24.4 9.47527L17.8667 16L24.4 22.5248C24.6444 22.7689 24.7667 23.0796 24.7667 23.4569C24.7667 23.8342 24.6444 24.1449 24.4 24.389C24.1556 24.6331 23.8444 24.7552 23.4667 24.7552C23.0889 24.7552 22.7778 24.6331 22.5333 24.389L16 17.8642Z"
              fill="#4589FF" />
          </g>
        </svg>
      </div>   
      </div>
      <div class="overlay_title">
        <span class="overlay_title_span"><b>${task.title}</b></span>
      </div>
      <div class="overlay_description">
        <span>${task.description}</span>
      </div>
      <div class="overlay_date">
        <div><b class="card_b">Due date:</b></div><div> ${task.dueDate}</div>
      </div>
      <div class="overlay_priority">
        <div><b class="card_b">Priority:</b></div>
        <div class="overlay_priority_status"> ${task.priority}
        <img src="${setPriority}" class="prio_icons"></div>  
      </div>
      <div class="overlay_contacts">
        <span><b class="card_b">Assigned To:</b></span>
        ${contact}
      </div>
      ${setSubtask}
    </div>
    <div class="overlay_icons">
        <div class="delete" onclick="confirmationDelete('${task.id}')">
            <div class="delete-img d-flex align-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <mask id="mask0_43661_2698" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                  <rect width="24" height="24" fill="#D9D9D9"></rect>
                  </mask>
                  <g mask="url(#mask0_43661_2698)">
                  <path d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6C4.71667 6 4.47917 5.90417 4.2875 5.7125C4.09583 5.52083 4 5.28333 4 5C4 4.71667 4.09583 4.47917 4.2875 4.2875C4.47917 4.09583 4.71667 4 5 4H9C9 3.71667 9.09583 3.47917 9.2875 3.2875C9.47917 3.09583 9.71667 3 10 3H14C14.2833 3 14.5208 3.09583 14.7125 3.2875C14.9042 3.47917 15 3.71667 15 4H19C19.2833 4 19.5208 4.09583 19.7125 4.2875C19.9042 4.47917 20 4.71667 20 5C20 5.28333 19.9042 5.52083 19.7125 5.7125C19.5208 5.90417 19.2833 6 19 6V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM7 6V19H17V6H7ZM9 16C9 16.2833 9.09583 16.5208 9.2875 16.7125C9.47917 16.9042 9.71667 17 10 17C10.2833 17 10.5208 16.9042 10.7125 16.7125C10.9042 16.5208 11 16.2833 11 16V9C11 8.71667 10.9042 8.47917 10.7125 8.2875C10.5208 8.09583 10.2833 8 10 8C9.71667 8 9.47917 8.09583 9.2875 8.2875C9.09583 8.47917 9 8.71667 9 9V16ZM13 16C13 16.2833 13.0958 16.5208 13.2875 16.7125C13.4792 16.9042 13.7167 17 14 17C14.2833 17 14.5208 16.9042 14.7125 16.7125C14.9042 16.5208 15 16.2833 15 16V9C15 8.71667 14.9042 8.47917 14.7125 8.2875C14.5208 8.09583 14.2833 8 14 8C13.7167 8 13.4792 8.09583 13.2875 8.2875C13.0958 8.47917 13 8.71667 13 9V16Z" fill="#4589FF"></path>
                  </g>
              </svg>
            </div>
          <div class="delete-text">Delete</div>
        </div>
      
        <div class="subtask_divider"></div>
        <div class="edit" onclick="editOverlayTask('${task.id}'), event.stopPropagation()">
          <div class="edit-img d-flex align-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_43661_3154" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                <rect width="24" height="24" fill="#D9D9D9"></rect>
                </mask>
                <g mask="url(#mask0_43661_3154)">
                <path d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z" fill="#4589FF"></path>
                </g>
            </svg>
          </div>
          <div class="edit-text">Edit</div>
        </div>
      </div>
    </div>`;
}

/**
 * Generates HTML template for a contact list item.
 *
 * @param {Object} contact - The contact object containing contact details.
 * @param {string} contact.name - The name of the contact.
 * @param {string} contact.id - The unique identifier of the contact.
 * @returns {string} - The HTML string for the contact list item.
 */
function templateBuildContactList(contact) {
  let contactName = contact['name'];
  let contactId = contact['id'];
  let initials = templateUserInitials(contact);
  return `
    <li onclick="selectContact('${contactId}')" class="" id="${contactId}">
          ${initials}${contactName}</li>
          `;
          
}

/**
 * Gets the CSS class for the task category.
 *
 * @param {string} category - The category of the task.
 * @returns {string} - The CSS class corresponding to the category.
 */
function getTaskCategoryClass(category) {
  if (category == 'User Story') {
  return 'user_story'
  } else {
    return 'technical';
  }
}

/**
 * Generates HTML template for displaying the subtasks within an overlay.
 *
 * @param {Array} subtasksArray - The array of subtasks.
 * @param {Array} finishedArray - The array of completed subtasks.
 * @param {string} id - The unique identifier of the task.
 * @returns {string} - The HTML string for the subtasks.
 */
function templateOverlaySubtasks(subtasksArray, finishedArray, id) {
  let template = '';
  if(subtasksArray) {
    for (let i = 0; i < subtasksArray.length; i++) {
      let check = '';
      if (finishedArray && finishedArray.indexOf(subtasksArray[i]) > -1) {
        check='checked';
      }      
      template += `<p class="overlay_subtask"><input type="checkbox" onclick="finishSubtask('${subtasksArray[i]}', '${id}')" ${check}> ${subtasksArray[i]}</p>`;
    }
  }
  return template;
}

/**
 * Generates HTML template for a small board task card.
 *
 * @param {Object} task - The task object containing task details.
 * @param {number} i - The index of the task.
 * @param {string} task.content - The content or category of the task.
 * @param {string} task.priority - The priority level of the task.
 * @param {Array} task.assignedTo - The list of contacts assigned to the task.
 * @param {Array} [task.subtasks] - The list of subtasks for the task (optional).
 * @param {Array} [task.finishedSubtasks] - The list of completed subtasks (optional).
 * @param {string} task.id - The unique identifier of the task.
 * @param {string} task.title - The title of the task.
 * @param {string} task.description - The description of the task.
 * @returns {string} - The HTML string for the small board task card.
 */
function renderTask(task, i) {
  let categoryClass = getTaskCategoryClass(task.content);
  let setPriority = getPriorityIcon(task.priority);
  let contactLogo = templateGetContacts(task.assignedTo);

  let progressBarHTML = '';
  if (task.finishedSubtasks && task.subtasks) {
    let percent = Math.round((task.finishedSubtasks.length / task.subtasks.length) * 100);
    progressBarHTML = `
      <div class="progress w3-light-grey w3-round">
        <div class="progress-bar w3-container w3-round w3-blue" style="width: ${percent}%;"></div>              
      </div>
      <span>${task.finishedSubtasks.length}/${task.subtasks.length}</span> 
    `;
  } else if (task.subtasks) {
    progressBarHTML = `
      <div class="progress">
        <div class="progress-bar" style="width: 0%;"></div>        
      </div>
      <span>0/${task.subtasks.length}</span>
    `;
  }

  return `
    <div draggable="true" id="${task.id}" ondragstart="startDragging('${task.id}')" ontouchstart="startDragging('${task.id}')" class="task_card card_complete click-animation" onclick="buildOverlayCard(${i}), openOverlayTop()"> 
      <div class="card_category">
        <span class="card_categories_span ${categoryClass}">${task.content}</span>
      </div>
      <div class="card_top_section">
        <div class="card_title">
          <b>${task.title}</b>
        </div>
        <div class="card_description">
          ${task.description}
        </div>
      </div>
      <div class="card_task_status">
        <div class="progress-div">
          ${progressBarHTML}
        </div>
      </div>
      <div class="overlay_bottom">  
        <div class="card_bottom_section">    
          ${contactLogo}
        </div>
        <div class="card_prio">
          <img src="${setPriority}" class="prio_icons">
        </div>
      </div>
    </div>
  `;
}

/**
 * Gets the icon URL for the specified priority level.
 *
 * @param {string} priority - The priority level of the task.
 * @returns {string} - The URL of the priority icon.
 */
function getPriorityIcon(priority) {
  if (priority === 'Urgent') {
    return './img/prio_red.png';
  } else if (priority === 'Medium') {
    return './img/prio_orange.png';
  } else if (priority === 'Low') {
    return './img/prio_green.png';
  }
}

/**
 * Generates HTML template for displaying contact initials in a task card.
 *
 * @param {Array} contactsArray - Array of contact IDs assigned to the task.
 * @returns {string} - The HTML string for displaying contact initials.
 */
function templateGetContacts(contactsArray) {
  let template = '';
  if (contactsArray) {
    for (let i = 0; i < contactsArray.length; i++) {
      if (i > 2) {
        let addedContacts = contactsArray.length - 3;
        template += `<span class="added_contacts"> &#43;${addedContacts} </span>`;
        break;
      } else if (getContactById(contactsArray[i])) {
        template += templateUserInitials(getContactById(contactsArray[i]));
      }
    }
  }
  return template;
}

/**
 * Generates HTML template for displaying detailed contact information in an overlay.
 *
 * @param {Array} contactsArray - Array of contact IDs assigned to the task.
 * @returns {string} - The HTML string for displaying detailed contact information.
 */
function templateBuildOverlayContacts(contactsArray) {
  let template = '';

  if (contactsArray) {
    for (let i = 0; i < contactsArray.length; i++) {
      if (getContactById(contactsArray[i])) {
        template += templateBuildContacts(getContactById(contactsArray[i]));
      }
    }
  }
  return template;
}

/**
 * Generates HTML template for the header of the edit overlay.
 *
 * @returns {string} - The HTML string for the edit overlay header.
 */
function templateEditOverlayHeader() {
  return `<div class="overlay_top_header" id="overlay_top_header">
    <div class="overlay_edit_return">
    <div class="x-button click-animation" onclick="closeOverlayTop()">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <mask id="mask0_19024_6446" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="4" y="4" width="24" height="24">
            <rect x="4" y="4" width="24" height="24" fill="#D9D9D9"></rect>
          </mask>
          <g mask="url(#mask0_19024_6446)">
            <path d="M16 17.8642L9.46667 24.389C9.22223 24.6331 8.91112 24.7552 8.53334 24.7552C8.15556 24.7552 7.84445 24.6331 7.6 24.389C7.35556 24.1449 7.23334 23.8342 7.23334 23.4569C7.23334 23.0796 7.35556 22.7689 7.6 22.5248L14.1333 16L7.6 9.47527C7.35556 9.23115 7.23334 8.92045 7.23334 8.54316C7.23334 8.16588 7.35556 7.85518 7.6 7.61106C7.84445 7.36693 8.15556 7.24487 8.53334 7.24487C8.91112 7.24487 9.22223 7.36693 9.46667 7.61106L16 14.1358L22.5333 7.61106C22.7778 7.36693 23.0889 7.24487 23.4667 7.24487C23.8444 7.24487 24.1556 7.36693 24.4 7.61106C24.6444 7.85518 24.7667 8.16588 24.7667 8.54316C24.7667 8.92045 24.6444 9.23115 24.4 9.47527L17.8667 16L24.4 22.5248C24.6444 22.7689 24.7667 23.0796 24.7667 23.4569C24.7667 23.8342 24.6444 24.1449 24.4 24.389C24.1556 24.6331 23.8444 24.7552 23.4667 24.7552C23.0889 24.7552 22.7778 24.6331 22.5333 24.389L16 17.8642Z" fill="#4589FF"></path>
          </g>
        </svg>
      </div>
    </div>`;
}

/**
 * Generates HTML template for the footer of the edit overlay.
 *
 * @param {string} id - The unique identifier of the task.
 * @returns {string} - The HTML string for the edit overlay footer.
 */
function templateEditOverlayFooter(id) {
  return `<div class="overlay_edit_okay">
    <button class="btn blue click-animation" onclick="sendTask('${id}'), closeOverlayTop(), showTasks(false);">
      Okay ✔
    </button>
  </div>`;
}

/**
 * Generates HTML content for the confirmation delete overlay.
 * 
 * @param {number} i - The index of the task to be deleted.
 * @returns {string} - The HTML content for the confirmation overlay.
 */
function confirmationDeleteHTML(i) {
  return `
  <div class="confirmation_main-container">
      <div class="confirmation_top-area">
          <p>Are you sure?</p>
      </div>
      <div class="confirmation_bottom-area">
          <div onclick="toggleConfirmationOverlay()" id="confirmation_disagree-button" class="confirmation_disagree-button">Discard</div>
          <div onclick="deleteTaskOnBoard('${i}')" id="confirmation_agree-button" class="confirmation_agree-button">Confirm</div>
      </div>
  </div>`;
}