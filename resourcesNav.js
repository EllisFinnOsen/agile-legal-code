(function () {
    const dynamicList = document.querySelector('.resources-collection-list');

    // Function to debounce and batch DOM updates in requestAnimationFrame
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
})();
