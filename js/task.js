/**
 * Array to store the IDs of contacts assigned to the current task.
 * 
 * @global
 * @type {Array<string>}
 */
let assignedContacts = [];

/**
 * Array to store the subtasks of the current task.
 * 
 * @global
 * @type {Array<string>}
 */
let subtasks = [];

/**
 * The current task status to be sent. Defaults to 'To do'.
 * 
 * @global
 * @type {string}
 */
let sendTaskStatus = 'To do';

/**
 * Adds an event listener to the document that initializes the application
 * once the DOM content is fully loaded.
 * 
 * @event DOMContentLoaded
 */
document.addEventListener("DOMContentLoaded", init);

/**
 * Initializes the current user and sets up the task form.
 */
async function init() {
  await initCurrentUser();
  await initContacts();
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
  showSendTaskPopup();
  init();
}

/**
 * Handles the form for adding or updating a task.
 */
function validateForm() {
  let form = docId('myForm');
  if (form.checkValidity()) {
    sendTask();
  } else {
    form.reportValidity();
  }
  redirect();
}

/**
 * Validates the form on Overlay Add Task button click.
 */
function validateFormOverlay() {
  let form = docId('myForm');
  if (form.checkValidity()) {
    sendTask();
    closeOverlayRight();
    showTasks(false);
  } else {
    form.reportValidity();
  }
}