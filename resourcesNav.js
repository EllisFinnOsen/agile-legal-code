// At the top of resourcesNav.js
console.log("resourcesNav.js script loaded and executing...");

// Main initialization function
function initializeResourcesNav() {
  console.log("Initializing resourcesNav.js functionality...");

  // Ensure jQuery is available
  if (typeof jQuery === "undefined") {
    console.error("jQuery is not loaded.");
    return;
  }

  console.log("jQuery is loaded and ready to use.");

  const dynamicList = jQuery(".resources-collection-list");

  // Function to debounce and batch DOM updates using requestAnimationFrame
  function moveStaticItems() {
    const staticItems = jQuery('[fs-cmsstatic-element="static-item"]');

    if (staticItems.length > 0) {
      const fragment = document.createDocumentFragment();
      const staticItemsArray = Array.from(staticItems).reverse();

      staticItemsArray.forEach(function (staticItem) {
        const clonedItem = staticItem.cloneNode(true);
        const wrapperDiv = document.createElement("div");
        wrapperDiv.setAttribute("role", "listitem");
        wrapperDiv.classList.add("w-dyn-item");
        wrapperDiv.appendChild(clonedItem);

        fragment.appendChild(wrapperDiv);
        staticItem.remove(); // Removing static item in a batch process
      });

      requestAnimationFrame(() => {
        dynamicList[0].insertBefore(fragment, dynamicList[0].firstChild);
        reinitializeWebflowInteractions(); // Reinitialize Webflow interactions
      });
    } else {
      console.error("No static items found!");
    }
  }

  // Reinitialize Webflow interactions
  function reinitializeWebflowInteractions() {
    if (
      typeof Webflow !== "undefined" &&
      typeof Webflow.require === "function"
    ) {
      Webflow.require("ix2").init();
    } else {
      console.error("Webflow or Webflow interactions not available.");
    }
  }

  // Main logic to move static items if dynamicList exists
  if (dynamicList.length > 0) {
    requestAnimationFrame(moveStaticItems);
  } else {
    console.error("Dynamic list '.resources-collection-list' not found!");
  }
}

// Call the initialize function to ensure it runs when the script is dynamically loaded
initializeResourcesNav();
