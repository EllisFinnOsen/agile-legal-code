// Assuming `waitless` has been properly initialized in the page, extend it with servicesNav.js functionality

// Push the scripts you need to load, including servicesNav.js
waitless.scripts.push(
    { 
        src: 'https://raw.githubusercontent.com/ellisfinnosen/agile-legal-code/main/servicesNav.js?v=1', 
        location: 'body', 
        callback: servicesNavLoaded // callback to run after servicesNav.js is loaded
    }
);

// Add any functions you want to execute after all the scripts have loaded
waitless.functions.push(function() {
    console.log('servicesNav.js and other functions are ready to execute after interaction or delay.');
});

// The callback that will be invoked after servicesNav.js is loaded
function servicesNavLoaded() {
    console.log('servicesNav.js loaded');

    // Now you can safely initialize the serviceNav functionality that was in servicesNav.js

    jQuery(function() {
        let lastScrollY = 0;
        let scheduledAnimationFrame = false;

        // Reinitialize Webflow interactions
        function reinitializeWebflowInteractions() {
            requestAnimationFrame(() => {
                Webflow.require('ix2').init();
            });
        }

        // Replace dropdowns with a static link if there's only one subservice
        function handleSingleSubservice() {
            jQuery('.service-drop-down').each(function() {
                const $dropdown = jQuery(this);
                const $subserviceList = $dropdown.find('.subservice-list');
                const $subservices = $subserviceList.find('.nav-small-link.is-sub');

                // If there is only one subservice, replace the dropdown
                if ($subservices.length === 1) {
                    const singleSubserviceUrl = $subservices.attr('href');
                    const singleSubserviceText = $subservices.find('.button-text').text();

                    if (singleSubserviceUrl && singleSubserviceUrl !== "#") {
                        const staticLinkHtml = `
                            <a href="${singleSubserviceUrl}" class="nav-small-link w-inline-block">
                                <div class="nav-link-text">
                                    <div class="button-text-wrapper">
                                        <div class="button-text">${singleSubserviceText}</div>
                                    </div>
                                </div>
                            </a>`;

                        $dropdown.replaceWith(staticLinkHtml);
                        updateFooterLink(singleSubserviceText, singleSubserviceUrl);
                    }
                }
            });

            requestAnimationFrame(reinitializeWebflowInteractions);
        }

        // Update the corresponding footer link
        function updateFooterLink(serviceText, serviceUrl) {
            jQuery('.underline-link.is-footer').each(function() {
                const $footerLink = jQuery(this);
                const footerLinkText = $footerLink.find('.button-text-2').text().trim();

                if (footerLinkText === serviceText) {
                    $footerLink.attr('href', serviceUrl);
                }
            });
        }

        // Add "View all {Area Name}" link after subservice lists are loaded
        function addViewAllLink(serviceAreaName, serviceAreaUrl, $container) {
            const viewAllText = serviceAreaName.endsWith('Services') ? serviceAreaName : `${serviceAreaName} Services`;

            const viewAllLinkHtml = `
                <a href="${serviceAreaUrl}" class="nav-small-link w-inline-block">
                    <div class="nav-link-text">
                        <div class="button-text-wrapper">
                            <div class="button-text">View all ${viewAllText}</div>
                        </div>
                    </div>
                </a>`;

            $container.append(viewAllLinkHtml);
        }

        // Load subservice lists dynamically
        function loadSubservices() {
            jQuery('.is-area-tag').each(function() {
                const $this = jQuery(this);
                const serviceAreaSlug = $this.attr('id').replace('area-', '');
                const serviceAreaName = jQuery(`#name-${serviceAreaSlug}`).text().trim();
                const serviceAreaUrl = `/service-area/${serviceAreaSlug}`;

                $this.load(`/service-area/${serviceAreaSlug} .subservice-list`, function() {
                    requestAnimationFrame(() => {
                        handleSingleSubservice();
                        const $collectionList = $this.find('.nav-collection-list');
                        addViewAllLink(serviceAreaName, serviceAreaUrl, $collectionList);
                    });
                });
            });
        }

        // Debounce loadSubservices call for better performance
        let debounceLoadSubservices = debounce(loadSubservices, 200);

        // Debounce helper function
        function debounce(func, delay) {
            let timeout;
            return function (...args) {
                const context = this;
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(context, args), delay);
            };
        }

        // Initialize the dynamic loading and subservice handling
        debounceLoadSubservices();
    });
}

console.log('servicesNav.js setup added to waitless.');
