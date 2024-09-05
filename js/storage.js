/**
 * Base URL for Firebase Realtime Database where data is stored.
 * @constant {string} STORAGE_URL
 */
const STORAGE_URL = 'https://remotestorage-bc72d-default-rtdb.firebaseio.com/';

/**
 * Array of colors used for task categories or other visual elements.
 * @type {Array<string>}
 */
const colors = ['#fe7b02', '#9228ff', '#6e52ff', '#fc71ff', '#ffbb2b', '#21d7c2', '#462f89', '#ff4646'];

/**
 * Array to store user objects retrieved from the database.
 * @type {Array}
 */
const users = [];

/**
 * Array to store task objects retrieved from the database.
 * @type {Array}
 */
let tasks = [];

/**
 * Array to store contact objects retrieved from the database.
 * @type {Array}
 */
let contacts = [];

/**
 * Updates data in the Firebase Realtime Database at a specified path.
 * @async
 * @param {string} [path=''] - The path in the database where data should be updated.
 * @param {Object} [data={}] - The data object to update in the database.
 * @returns {Promise<Object>} A promise that resolves to the JSON response from the server.
 */
async function updateData(path = '', data = {}) {
  let response = await fetch(STORAGE_URL + path + '.json', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

/**
 * Posts new data to the Firebase Realtime Database at a specified path.
 * @async
 * @param {string} [path=''] - The path in the database where data should be posted.
 * @param {Object} [data={}] - The data object to post to the database.
 * @returns {Promise<Object>} A promise that resolves to the JSON response from the server.
 */
async function postData(path = '', data = {}) {
  let response = await fetch(STORAGE_URL + path + '.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

/**
 * Retrieves data from the Firebase Realtime Database at a specified path.
 * @async
 * @param {string} [path=''] - The path in the database from which to retrieve data.
 * @returns {Promise<Object>} A promise that resolves to the JSON response from the server.
 */
async function getData(path = "") {
  try {
    const url = `${STORAGE_URL}${path}.json`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data || null;

  } catch (error) {
    console.error('Error fetching data from', path, ':', error);
    return null;
  }
}

/**
 * Deletes data from the Firebase Realtime Database at a specified path.
 * @async
 * @param {string} [path=''] - The path in the database from which to delete data.
 * @returns {Promise<Object>} A promise that resolves to the JSON response from the server.
 */
async function deleteData(path = '') {
  let response = await fetch(STORAGE_URL + path + '.json', {
    method: 'DELETE',
  });
  return await response.json();
}

/**
 * Loads all tasks from the '/tasks' path in the Firebase Realtime Database.
 * Updates the global `tasks` array with the retrieved tasks.
 * @async
 */
async function loadTasks() {
  let allTask = await getData('/tasks');
  tasks = Object.entries(allTask).map(([key, value]) => ({
    ...value,
    id: key
  }));
}

/**
 * Deletes a task from the Firebase Realtime Database and updates the `tasks` array.
 * @async
 * @param {string} taskId - The ID of the task to delete.
 */
async function deleteTaskById(taskId) {
  await deleteData('/tasks/' + taskId);
  tasks = tasks.filter(task => task.id !== taskId);
}

/**
 * Updates a task in the Firebase Realtime Database at a specified path.
 * @async
 * @param {string} taskId - The ID of the task to update.
 * @param {Object} task - The updated task object to store in the database.
 */
async function updateTaskById(taskId, task) {
  await updateData('/tasks/' + taskId, task);
}