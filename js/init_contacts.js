/**
 * Initializes contacts by loading, sorting, and enriching them with initials and colors.
 * This function is typically called during application initialization.
 * @async
 */
async function initContacts() {
    await loadAndMergeContacts();
    sortContacts();
    enrichContacts();
  }
  
  /**
   * Loads contacts from the '/contacts' path in the Firebase Realtime Database and populates the global `contacts` array.
   * @async
   */
  async function loadAndMergeContacts() {
    contacts = Object.entries(await getData("/contacts")).map(([key, value]) => ({
      id: key,
      ...value
    }));
  }
  
  /**
   * Sorts the contacts array alphabetically by their 'name' property.
   */
  function sortContacts() {
    contacts.sort((a, b) => a.name.localeCompare(b.name));
  }
  
  /**
   * Enriches each contact object with initials and a color from the predefined colors array.
   * The colors are assigned based on the index of the contact in the contacts array.
   */
  function enrichContacts() {
    contacts.forEach((contact, index) => {
      contact.initials = getInitials(contact.name);
      contact.color = colors[index % colors.length];
    });
  }