/**
 * Represents the current element being dragged.
 * @type {HTMLElement | null}
 */
let currentDraggedElement;

/**
 * Sets up event listeners and initializes the application when the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", init);

/**
 * Initializes the application by setting up the current user and displaying tasks.
 * 
 * @async
 * @function init
 * @returns {Promise<void>}
 */
async function init() {
    await initCurrentUser();
    await showTasks(true);
    setupEventListeners();
    setupWindowLoadListener();
}

/**
 * Sets up event listeners for various elements and actions.
 */
function setupEventListeners() {
    setupAddTaskOverlayClickCloseListener();
    setupTaskOverlayClickCloseListener();
}

/**
 * Sets up an event listener for clicks outside the task overlay content to close it.
 */
function setupTaskOverlayClickCloseListener() {
    const cardOverlay = docId('card_top_overlay');
    const overlayContent = docId('overlay_top_content');
    if (cardOverlay && overlayContent) {
        cardOverlay.addEventListener('click', (event) => {
            if (!overlayContent.contains(event.target)) {
                closeOverlayTop();
            }
        });
    }
}

/**
 * Sets up the event listener for clicks on the document to close the add task overlay
 * if the click target is the overlay itself.
 */
function setupAddTaskOverlayClickCloseListener() {
    document.addEventListener('click', function (event) {
        let overlay = docId('add_task_overlay');
        if (overlay && overlay === event.target) {
            closeOverlayRight();
        }
    });
}

/**
 * Closes the add task overlay when the window loads.
 */
function setupWindowLoadListener() {
    resetOverlay();
}

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
 * Opens the overlay displaying a big task card.
 * 
 * @function openOverlayTop
 */
function openOverlayTop() {
    const overlay = docId('card_top_overlay');
    if (overlay) {
        overlay.classList.remove('hide', 'show');
        overlay.style.display = 'flex';
        requestAnimationFrame(() => {
            overlay.classList.add('show');
        });
    }
}

/**
 * Closes the overlay displaying a big task card.
 * 
 * @function closeOverlayTop
 */
function closeOverlayTop() {
    renderAllTasks();
    const overlay = docId('card_top_overlay');
    if (overlay) {
        overlay.classList.remove('show');
        overlay.classList.add('hide');
        overlay.addEventListener('animationend', function handleAnimationEnd() {
            if (overlay.classList.contains('hide')) {
                overlay.style.display = 'none';
                overlay.classList.remove('hide');
                overlay.removeEventListener('animationend', handleAnimationEnd);
            }
        }, { once: true });
    }
}

/**
 * Opens the overlay for adding a task to the board.
 * 
 * @async
 * @function openOverlayRight
 * @returns {Promise<void>}
 */
async function openOverlayRight() {
    let overlay = document.getElementById('add_task_overlay');
    if (overlay) {
        document.getElementById('overlay_top_content').innerHTML = '';
        overlay.style.display = 'flex'; 
        const form = document.getElementById('add_task_overlay_content');
        await fetch('template_add_task.html')
            .then(response => response.text())
            .then(html => { form.innerHTML = html; });
        addTaskContacts();
        setTimeout(() => {
            overlay.classList.remove('hide'); 
            overlay.classList.add('show'); 
        }, 10); 
        setDateRestriction('taskDueDate');
    }
}

/**
 * Closes the overlay for adding a task to the board.
 * 
 * @function closeOverlayRight
 */
function closeOverlayRight() {
    let overlay = document.getElementById('add_task_overlay');
    if (overlay) {
        overlay.classList.remove('show'); 
        overlay.classList.add('hide'); 
        overlay.addEventListener('animationend', function handleAnimationEnd() {
            if (!overlay.classList.contains('show')) {
                overlay.style.display = 'none';
                overlay.classList.remove('hide'); 
                overlay.removeEventListener('animationend', handleAnimationEnd);
            }
        });
    }
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
 * Loads tasks and renders them on the board.
 * 
 * @async
 * @function showTasks
 * @param {boolean} reloadContacts - Whether to reload contacts.
 * @returns {Promise<void>}
 */
async function showTasks(reloadContacts) {
    await loadTasks();
    if (reloadContacts) {
        await initContacts();
    }
    renderAllTasks();
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
 * Edits a task in the overlay.
 * 
 * @async
 * @function editOverlayTask
 * @param {string} id - The ID of the task.
 * @returns {Promise<void>}
 */
async function editOverlayTask(id) {
    docId('add_task_overlay_content').innerHTML = '';
    const content = docId('overlay_top_content');
    content.innerHTML = templateEditOverlayHeader();
    await fetch('template_add_task.html')
        .then(response => response.text())
        .then(html => {
            docId('overlay_top_header').innerHTML += html;
        });
    let task = getTaskById(id);
    content.innerHTML += templateEditOverlayFooter(id);
    await addTaskContacts();
    fillTask(task);
    setDateRestriction('taskDueDate');
}

/**
 * Fills the add task template with existing task data for editing.
 * 
 * @param {Object} task - The task object.
 */
function fillTask(task) {
    docId('taskTitle').value = task.title;
    docId('taskDescription').value = task.description;
    docId('taskDueDate').value = task.dueDate;
    selectPriority(task.priority);
    assignedContacts = [];
    for (let i = 0; i < task.assignedTo.length; i++) {
        selectContact(task.assignedTo[i]);
    }
    docId('addCategoryInputField').innerHTML = task.content;
    subtasks = [];
    for (let i = 0; i < task.subtasks.length; i++) {
        subtasks.push(task.subtasks[i]);
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
 * Filters tasks based on the search input.
 * 
 * @function filterTask
 */
function filterTask() {
    let search = docId('findTask').value.toLowerCase();
    if (search.length >= 3) {
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].title.toLowerCase().includes(search) || tasks[i].description.toLowerCase().includes(search)) {
                docId(`${tasks[i].id}`).style.display = 'block';
            } else {
                docId(`${tasks[i].id}`).style.display = 'none';
            }
        }
    } else {
        for (let i = 0; i < tasks.length; i++) {
            docId(`${tasks[i].id}`).style.display = 'block';
        }
    }
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
