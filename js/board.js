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
        loadAndDisplayContacts();
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
 * Edits a task in the overlay by loading necessary HTML templates and filling in the task data.
 * 
 * @async
 * @function editOverlayTask
 * @param {string} id - The ID of the task to edit.
 */
async function editOverlayTask(id) {
    clearTaskOverlay();
    await loadTaskOverlay();
/*     await loadOverlayTemplates(); */
    const task = getTaskById(id);
    prepareTaskOverlayFooter(id);
    await loadAndDisplayContacts();
    fillTask(task);
    renderAssignedContact();
    setDateRestriction('taskDueDate');
}

/**
 * Clears the content of the add task overlay.
 */
function clearTaskOverlay() {
    docId('add_task_overlay_content').innerHTML = '';
    docId('overlay_top_content').innerHTML = '';
}

/**
 * Loads the necessary HTML templates for the overlay and appends them to the DOM.
 * 
 * @async
 */
async function loadTaskOverlay() {
    const content = docId('overlay_top_content');
    content.innerHTML = templateEditOverlayHeader();

    const html = await fetch('template_add_task.html').then(response => response.text());
    docId('overlay_top_header').innerHTML += html;
}

/**
 * Prepares and sets the footer template for the overlay.
 * 
 * @param {string} id - The ID of the task for which to prepare the footer.
 */
function prepareTaskOverlayFooter(id) {
    const content = docId('overlay_top_content');
    content.innerHTML += templateEditOverlayFooter(id);
}

/**
 * Filters tasks based on the search input.
 * 
 * @function filterTask
 */
function filterTask() {
    const search = docId('findTask').value.toLowerCase();
    const displayAll = search.length < 3;

    for (let i = 0; i < tasks.length; i++) {
        const taskElement = docId(tasks[i].id);
        const matchesSearch = tasks[i].title.toLowerCase().includes(search) || tasks[i].description.toLowerCase().includes(search);
        
        if (displayAll || matchesSearch) {
            taskElement.style.display = 'flex';
        } else {
            taskElement.style.display = 'none';
        }
    }
}