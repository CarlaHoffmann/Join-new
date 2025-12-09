/**
 * Edits a contact by its unique key.
 * Sets `editKey` and calls `updateEditedContact()` to save changes.
 * 
 * @async
 * @param {string} key - Contact ID to edit
 * @returns {Promise<void>}
 */
async function editContact(key) {
  editKey = key;
  await updateEditedContact();
}

/**
 * Updates the edited contact's details in the database and updates the UI.
 * @returns {Promise<Object>} - The updated user data.
 */
async function updateEditedContact() {
    const [name, email, phone] = getEditedContactInput();
    if (!validateEditForm(name, email, phone)) return;

    const user = await fetchUserData(editKey);
    const updatedData = prepareUpdatedData(user, name, email, phone);
    const updatedUser = await saveUpdatedContact(editKey, updatedData);

    refreshUIAfterEdit(editKey, updatedUser);
    return updatedUser;
}

/**
 * Fetches the existing user data from the database.
 * @param {string} key - The unique key for the user.
 * @returns {Promise<Object>} - The existing user data.
 */
async function fetchUserData(key) {
    const response = await fetch(`${base_url}users/${key}.json`);
    return response.json();
}

/**
 * Sends the updated user data to the database.
 * @param {string} key - The unique key for the user.
 * @param {Object} data - The updated user data.
 * @returns {Promise<Object>} - The updated user data from the response.
 */
async function saveUpdatedContact(key, data) {
    const response = await fetch(`${base_url}users/${key}.json`, {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return response.json();
}

/**
 * Toggles the visibility of an element and, optionally, populates form fields for editing.
 * @param {string} elementId - The ID of the element to toggle visibility for.
 * @param {string|null} key - The unique key of the user to fetch data for (if editing).
 * @param {boolean} edit - Indicates if the form is in edit mode.
 */
async function toggleView(elementId, key = null, edit = false) {
    editKey = key;
    document.getElementById(elementId).classList.remove('hidden');

    if (edit) {
        const user = await fetchUserData(key);
        populateEditForm(user);
    }
}