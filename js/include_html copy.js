/**
 * Includes HTML content into elements marked with 'w3-include-html' attribute.
 * Fetches the specified HTML file and inserts its content into the element.
 * If the fetch fails (HTTP status not OK), displays "Page not found" in the element.
 */
async function includeHTML() {
    const includeElements = document.querySelectorAll("[w3-include-html]");
    for (const element of includeElements) {
      const file = element.getAttribute("w3-include-html");
      try {
        const response = await fetch(file);
        if (response.ok) {
          element.innerHTML = await response.text();
        } else {
          element.innerHTML = "Page not found";
        }
      } catch (error) {
        console.error('Error fetching file:', file, error);
        element.innerHTML = "Page not found";
      }
    }
  }