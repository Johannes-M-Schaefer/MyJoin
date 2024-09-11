/**
 * Resets the overlay by adding event listeners for window load and before unload events.
 */
function resetOverlay() {
    window.addEventListener('load', function () {
        closeOverlayRight();
    });
    window.addEventListener('beforeunload', function () {
        closeOverlayRight();
    });
}

/**
 * Clears all task columns on the board.
 * 
 * @function clearBoard
 */
function clearBoard() {
    docId('drag_to_do').innerHTML = '';
    docId('drag_in_progress').innerHTML = '';
    docId('drag_await_feedback').innerHTML = '';
    docId('drag_done').innerHTML = '';
}

/**
 * Switches the status of a task and renders it in the appropriate column on the board.
 * 
 * @param {Object} task - The task object.
 * @param {number} i - The index of the task.
 */
function switchStatusCase(task, i) {
    switch (task.status.toLowerCase()) {
        case 'to do':
            docId('drag_to_do').innerHTML += renderTask(task, i);
            break;
        case 'in progress':
            docId('drag_in_progress').innerHTML += renderTask(task, i);
            break;
        case 'await feedback':
            docId('drag_await_feedback').innerHTML += renderTask(task, i);
            break;
        case 'done':
            docId('drag_done').innerHTML += renderTask(task, i);
    }
}

/**
 * Sets the status for sending a task.
 * 
 * @param {string} status - The status to be set.
 */
function setSendTaskStatus(status) {
    sendTaskStatus = status;
}

/**
 * Renders all tasks on the board.
 * 
 * @function renderAllTasks
 */
function renderAllTasks() {
    clearBoard();
    for (let i = 0; i < tasks.length; i++) {
        switchStatusCase(tasks[i], i);
    }
    renderNoTask();
    setDragEventListeners();
}

/**
 * Renders a "No Task" badge if there are no tasks in a column.
 * 
 * @function renderNoTask
 */
function renderNoTask() {
    if (docId('drag_to_do').innerHTML == '') {
        docId('drag_to_do').innerHTML = templateNoTask('To do');
    }
    if (docId('drag_in_progress').innerHTML == '') {
        docId('drag_in_progress').innerHTML = templateNoTask('In progress');
    }
    if (docId('drag_await_feedback').innerHTML == '') {
        docId('drag_await_feedback').innerHTML = templateNoTask('Awaiting feedback');
    }
    if (docId('drag_done').innerHTML == '') {
        docId('drag_done').innerHTML = templateNoTask('Done');
    }
}

/**
 * Updates the status of a task on the board.
 * 
 * @function updateTaskStatus
 * @param {string} id - The ID of the task.
 * @param {string} status - The new status of the task.
 */
function updateTaskStatus(id, status) {
    let task = getTaskById(id);
    task.status = status;
    updateTaskById(task.id, task);
}

/**
 * Shows a confirmation overlay for deleting a task.
 * 
 * @param {number} i - The index of the task to be deleted.
 */
function confirmationDelete(i) {
    let confirmationOverlay = docId('confirmation_overlay');
    confirmationOverlay.innerHTML = confirmationDeleteHTML(i);
    toggleConfirmationOverlay();
}

/**
 * Toggles the visibility of the confirmation overlay.
 * 
 * @function toggleConfirmationOverlay
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
 * Deletes a task from the board.
 * 
 * @function deleteTaskOnBoard
 * @param {string} id - The ID of the task.
 */
function deleteTaskOnBoard(id) {
    tasks = deleteById(tasks, id);
    deleteTaskById(id);
    toggleConfirmationOverlay();
    closeOverlayTop();
    renderAllTasks();
}

/**
 * Builds and displays the overlay for a big task card.
 * 
 * @function buildOverlayCard
 * @param {number} i - The index of the task.
 */
function buildOverlayCard(i) {
    let content = docId('overlay_top_content');
    let task = tasks[i];
    content.innerHTML = templateBuildOverlayCard(task);
}

/**
 * Fills the add task template with existing task data for editing.
 * 
 * @param {Object} task - The task object.
 */
function fillTask(task) {
    setBasicTaskInfo(task);
    setTaskPriority(task.priority);
    handleAssignedContacts(task.assignedTo);
    setCategoryContent(task.content);
    handleSubtasks(task.subtasks);
}

/**
 * Sets basic task information such as title, description, and due date.
 * 
 * @param {Object} task - The task object containing title, description, and due date.
 */
function setBasicTaskInfo(task) {
    docId('taskTitle').value = task.title;
    docId('taskDescription').value = task.description;
    docId('taskDueDate').value = task.dueDate;
}

/**
 * Sets the task priority in the form based on the provided priority level.
 * 
 * @param {string} priority - The priority level of the task (e.g., 'Urgent', 'Medium', 'Low').
 */
function setTaskPriority(priority) {
    selectPriority(priority);
}

/**
 * Handles the assigned contacts for the task, updating the form with the selected contacts.
 * 
 * @param {Array} assignedTo - An array of contact IDs assigned to the task.
 */
function handleAssignedContacts(assignedTo) {
    assignedContacts = [];
    if (Array.isArray(assignedTo)) {
        for (let i = 0; i < assignedTo.length; i++) {
            toggleContactSelection(assignedTo[i]);
        }
    }
}

/**
 * Sets the category content in the task form.
 * 
 * @param {string} content - The content/category information for the task.
 */
function setCategoryContent(content) {
    docId('addCategoryInputField').innerHTML = content;
}

/**
 * Handles the subtasks for the task, populating the form with the subtasks.
 * 
 * @param {Array} subtasksArray - An array of subtasks associated with the task.
 */
function handleSubtasks(subtasksArray) {
    subtasks = [];
    if (Array.isArray(subtasksArray)) {
        for (let i = 0; i < subtasksArray.length; i++) {
            subtasks.push(subtasksArray[i]);
        }
    }
    renderSubtasks();
}


/**
 * Gets the status name based on the status ID.
 * 
 * @param {string} statusId - The status ID.
 * @returns {string} - The status name.
 */
function getStatusNameByStatusID(statusId) {
    if (statusId == 'drag_to_do') return 'To do';
    if (statusId == 'drag_in_progress') return 'In progress';
    if (statusId == 'drag_await_feedback') return 'Await feedback';
    if (statusId == 'drag_done') return 'Done';
}

/**
 * Updates the status of a subtask as finished or unfinished.
 * 
 * @param {string} subtaskName - The name of the subtask.
 * @param {string} id - The ID of the task.
 */
function finishSubtask(subtaskName, id) {
    let task = getTaskById(id);
    if (!task.finishedSubtasks) {
        task.finishedSubtasks = [];
        task.finishedSubtasks.push(subtaskName);
    } else if (task.finishedSubtasks.indexOf(subtaskName) > -1) {
        task.finishedSubtasks.splice(task.finishedSubtasks.indexOf(subtaskName), 1);
    } else {
        task.finishedSubtasks.push(subtaskName);
    }
    updateTaskById(id, task);
}

/**
 * Closes the add task overlay before the window unloads.
 * 
 * @function
 * @name EventListener#beforeunload
 */
window.addEventListener('beforeunload', function () {
    closeOverlayRight();
});
