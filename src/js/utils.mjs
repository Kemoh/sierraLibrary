// ===============================
//  Hamburger Menu Setup
// ===============================
export function setupHamburgerMenu() {
  const hamButton = document.querySelector("#ham-btn");
  const navBar = document.querySelector("#animateme");

  if (hamButton && navBar) {
    hamButton.addEventListener("click", () => {
      hamButton.classList.toggle("show");
      navBar.classList.toggle("show");
    });
  }
}


// ===============================
//  Create getParam function
// ===============================
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}


// ===============================
//  Load HTML Template
// ===============================
export async function loadTemplate(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load template: ${path}`);
  }
  return await response.text();
}

// ===============================
//  Render Template into DOM
// ===============================
export function renderTemplate(template, targetElement) {
  targetElement.innerHTML = template;
}

// ===============================
// Renders Template into Parent 
// Element
// ===============================

/**
 * @param {string} template The HTML string template.
 * @param {HTMLElement} parentElement The element to render the template into.
 * @param {*} [data] Optional data to pass to the callback.
 * @param {Function} [callback] Optional callback function to run after rendering.
 */

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}


// ===============================
//  Load Header & Footer 
// ===============================
export async function loadHeaderFooter() {
  try {
    // Absolute paths — Vite will rewrite them correctly
    const headerTemplate = await loadTemplate("/partials/header.html");
    const footerTemplate = await loadTemplate("/partials/footer.html");

    const headerElement = document.querySelector("#main-header");
    const footerElement = document.querySelector("#main-footer");

    if (headerElement) headerElement.innerHTML = headerTemplate;
    if (footerElement) footerElement.innerHTML = footerTemplate;

    setupHamburgerMenu(); // reattach your nav behavior
  } catch (err) {
    console.error("❌ Error loading header/footer:", err);
  }
}




// export async function loadHeaderFooter() {
//   try {
//     // Detect project base path (works on localhost & GitHub Pages)
//     const pathParts = window.location.pathname.split("/").filter(Boolean);
//     const projectRoot =
//       window.location.hostname.includes("github.io") && pathParts.length > 1
//         ? `/${pathParts[0]}/`
//         : "/";

//     // Build full URLs
//     const headerUrl = `${projectRoot}partials/header.html`;
//     const footerUrl = `${projectRoot}partials/footer.html`;

//     // Fetch templates
//     const headerTemplate = await loadTemplate(headerUrl);
//     const footerTemplate = await loadTemplate(footerUrl);

//     // Inject into DOM
//     const headerElement = document.getElementById("main-header");
//     const footerElement = document.getElementById("main-footer");

//     if (headerElement && footerElement) {
//       renderTemplate(headerTemplate, headerElement);
//       renderTemplate(footerTemplate, footerElement);

//       // Optional: reinitialize hamburger or other nav functions
//       if (typeof setupHamburgerMenu === "function") {
//         setupHamburgerMenu();
//       }
//     }
//   } catch (err) {
//     console.error("Failed to load header/footer templates:", err);
//   }
// }


// ===============================
// Generic Loader For Displaying
// List of Items 
// ===============================

/**
 * @param {Array} dataList - Array of objects containing the data
 * @param {string} containerSelector - The selector where items should be displayed
 * @param {string} type - Optional label for context ("app", "subject") — controls button link
 */

// Create the loadItems function
export function loadItems(dataList, containerSelector, type = "app") {
    const container = document.querySelector(containerSelector);
    if (!container) {
        console.error(`Container ${containerSelector} not found.`);
        return;
    }

    // Create and inject HTML structure
    container.innerHTML = `
      <section class="${type}-section" >
        <div id="show-${type}-cards" class="cards-grid"></div>

        <dialog id="${type}-dialog" class="${type}-dialog">
          <div class="dialog-header">
            <h3 id="${type}-title"></h3>
            <button id="close-${type}-btn" class="close-btn">&times;</button>
          </div>
          
          <p id="${type}-description"></p>
          <a id="${type}-link" href="#" class="open-btn">Open ${type}</a>
        </dialog>
      </section>
    `;

    // Get modal and content elements
    const dialog = document.querySelector(`#${type}-dialog`);
    const title = document.querySelector(`#${type}-title`);
    const description = document.querySelector(`#${type}-description`);
    const openLink = document.querySelector(`#${type}-link`);
    const closeBtn = document.querySelector(`#close-${type}-btn`);
    const cardsContainer = document.querySelector(`#show-${type}-cards`);

    // Close dialog
    closeBtn.addEventListener("click", () => dialog.close());

    // Generate cards dynamically
    dataList.forEach((item) => {
        const card = document.createElement("div");
        card.classList.add(`${type}-card`);
        card.style.backgroundColor = item.cardColor;

        const img = document.createElement("img");
        img.src = item.appImage || item.subjectImage || item.subjectImage;
        img.alt = `${item.appName || item.subjectName || item.subjectTitle} logo`;
        img.classList.add(`${type}-image`);

        const cardTitle = document.createElement("h2");
        cardTitle.textContent = item.appName || item.subjectName || item.subjectTitle;

        // Add dataset attributes
        card.dataset.title = item.appName || item.subjectName || item.subjectTitle;
        card.dataset.description = item.appDescription || item.subjectDescription;
        card.dataset.link = item.streamLink || item.subjectLink;

        // Card click opens modal
        card.addEventListener("click", () => {
            title.textContent = card.dataset.title;
            description.textContent = card.dataset.description;
            openLink.href = card.dataset.link;
            dialog.showModal();
        });

        // Append to grid
        card.append(cardTitle, img);
        cardsContainer.appendChild(card);
    });
}


