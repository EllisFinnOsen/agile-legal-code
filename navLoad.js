// Adding a click event listener to trigger the logic when #service-toggle is clicked
waitless.scripts.push(
    {
        src: '', // No need to load an external script, leaving this empty
        location: 'body', 
        callback: addServiceToggleListener // Set up the event listener in the callback
    }
);

// Function to add the event listener for #service-toggle
function addServiceToggleListener() {
    console.log('Adding click listener to #service-toggle.');
    
    const serviceToggle = document.getElementById('service-toggle');
    
    if (serviceToggle) {
        serviceToggle.addEventListener('click', function() {
            console.log('#service-toggle clicked, running the custom script.');

            // Your existing code to run the logic after the click
            jQuery(function() {
                console.log('jQuery is ready after click on #service-toggle.');

                let lastScrollY = 0;
                let scheduledAnimationFrame = false;

                // Reinitialize Webflow interactions
                function reinitializeWebflowInteractions() {
                    console.log('Reinitializing Webflow interactions.');
                    requestAnimationFrame(() => {
                        Webflow.require('ix2').init();
                    });
                }

                // Replace dropdowns with a static link if there's only one subservice
                function handleSingleSubservice() {
                    console.log('Handling single subservice dropdowns.');
                    jQuery('.service-drop-down').each(function() {
                        const $dropdown = jQuery(this);
                        const $subserviceList = $dropdown.find('.subservice-list');
                        const $subservices = $subserviceList.find('.nav-small-link.is-sub');

                        // If there is only one subservice, replace the dropdown
                        if ($subservices.length === 1) {
                            const singleSubserviceUrl = $subservices.attr('href');
                            const singleSubserviceText = $subservices.find('.button-text').text();

                            console.log(`Single subservice found: ${singleSubserviceText}, URL: ${singleSubserviceUrl}`);

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
                    console.log(`Updating footer link: ${serviceText}, URL: ${serviceUrl}`);
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
                    console.log(`Adding "View all" link for ${serviceAreaName}.`);
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
                    console.log('Loading subservices.');
                    jQuery('.is-area-tag').each(function() {
                        const $this = jQuery(this);
                        const serviceAreaSlug = $this.attr('id').replace('area-', '');
                        const serviceAreaName = jQuery(`#name-${serviceAreaSlug}`).text().trim();
                        const serviceAreaUrl = `/service-area/${serviceAreaSlug}`;

                        console.log(`Loading subservices for ${serviceAreaName}.`);

                        $this.load(`/service-area/${serviceAreaSlug} .subservice-list`, function() {
                            console.log(`Subservices loaded for ${serviceAreaName}.`);
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

                // Initialize the dynamic loading and subservice handling on click
                console.log('Initializing dynamic subservice loading after click.');
                debounceLoadSubservices();
            });
        });
    } else {
        console.error('#service-toggle not found on the page.');
    }
}
