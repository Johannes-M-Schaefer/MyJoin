/**
 * Validates the form on Add Task button click.
 */
function validateForm() {
  let form = docId('myForm');

  if (form.checkValidity()) {
    sendTask();
  } else {
    form.reportValidity();
  }
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
