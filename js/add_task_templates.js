/**
 * Builds a dropdown list item for a contact with an optional checkbox.
 * @param {Object} contact - The contact object.
 * @param {boolean} withCheckbox - Flag to include a checkbox.
 * @returns {string} The HTML string for the contact dropdown item.
 */
function templateBuildContactDropdown(contact) {
  let contactName = contact['name'];
  let contactId = contact['id'];
  let initials = templateUserInitials(contact);
  let checkbox = '';

  return `
    <li onclick="toggleContactSelection('${contactId}')" class="" id="${contactId}">
        <div class="marquee-container">
          <div class="contact_div">${initials}${contactName}</div>
      ${checkbox}
        </div>
      </div>
        <label class="cr-wrapper">
            <div id="checkbox-manuell-${contactId}">  
              <svg id="unchecked" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="4" width="16" height="16" rx="3" stroke="#4589FF" stroke-width="2"/>
              </svg>
            </div>
        </label>
      </div>
    </li>
  `;
}

/**
 * Builds a list item for a contact.
 * @param {Object} contact - The contact object.
 * @returns {string} The HTML string for the contact item.
 */
function templateBuildContacts(contact) {
  let contactName = contact['name'];
  let initials = templateUserInitials(contact);

  return `
    <li class="">
      ${initials}${contactName}
    </li>
  `;
}

/**
 * Builds the initials of a contact for the contact logo.
 * @param {Object} contact - The contact object.
 * @returns {string} The HTML string for the contact initials.
 */
function templateUserInitials(contact) {
  return `
    <div style="background-color:${contact.color}" class="contact_container_img">${contact.initials}</div>
  `;
}

/**
 * Builds a subtask item in the add task section.
 * @param {string} subtask - The subtask description.
 * @param {number} index - The index of the subtask.
 * @returns {string} The HTML string for the subtask item.
 */
function templateBuildSubtask(subtask, index) {
  return `
    <div class="build_subtask" id="subtask_${index}">
      <li class="build_subtask_span">${subtask}</li>
      <div class="subtask_icons_div">
        <img src="./img/edit_icon.png" alt="edit" class="subtask_icon" onclick="editSubtask(${index})">
        <div class="subtask_divider"></div>
        <img src="./img/delete_icon.png" alt="delete" class="subtask_icon" onclick="deleteSubtask(${index}); event.stopPropagation()">
      </div>
    </div>
    <div class="build_subtask_2 inactive" id="subtask_edit_${index}">
      <input class="build_subtask_span_2" value="${subtask}" id="subtask_input_${index}"/>
      <div class="subtask_icons_div">
        <img src="./img/delete_icon.png" alt="delete" class="subtask_icon_delete" onclick="deleteSubtask(${index}); event.stopPropagation()">
        <div class="subtask_divider"></div>
        <img class="subtask_check_icon" src="./img/check.png" onclick="saveSubtask(${index})">
      </div>
    </div>
  `;
}