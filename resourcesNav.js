(function () {
    const checkAndRun = function(callback) {
      if (window.jQuery && typeof Webflow !== 'undefined' && typeof Webflow.require === 'function') {
        callback();
      } else {
        console.log("jQuery or Webflow not ready, retrying...");
        setTimeout(function() { checkAndRun(callback); }, 100); // Retry after 100ms
      }
    };
  
    checkAndRun(function() {
      console.log("jQuery and Webflow are ready, running script.");
      const dynamicList = document.querySelector('.resources-collection-list');
  
      function moveStaticItems() {
        const staticItems = document.querySelectorAll('[fs-cmsstatic-element="static-item"]');
        if (staticItems.length > 0) {
          const fragment = document.createDocumentFragment();
          const staticItemsArray = Array.from(staticItems).reverse();
  
          staticItemsArray.forEach(function(staticItem) {
            const clonedItem = staticItem.cloneNode(true);
            const wrapperDiv = document.createElement('div');
            wrapperDiv.setAttribute('role', 'listitem');
            wrapperDiv.classList.add('w-dyn-item');
            wrapperDiv.appendChild(clonedItem);
  
            fragment.appendChild(wrapperDiv);
            staticItem.remove(); // Removing static item in a batch process
          });
  
          requestAnimationFrame(() => {
            dynamicList.insertBefore(fragment, dynamicList.firstChild);
            Webflow.require('ix2').init(); // Reinitialize Webflow interactions in one go
          });
        } else {
          console.error("No static items found!");
        }
      }
  
      if (dynamicList) {
        requestAnimationFrame(moveStaticItems);
      } else {
        console.error("Dynamic list '.resources-collection-list' not found!");
      }
    });
  })();
  