(function () {
    console.log("servicesNav.js script started");

    let lastScrollY = 0;
    let scheduledAnimationFrame = false;

    // Reinitialize Webflow interactions
    function reinitializeWebflowInteractions() {
        console.log("Reinitializing Webflow interactions in servicesNav.js");
        requestAnimationFrame(() => {
            Webflow.require('ix2').init();
            console.log("Webflow interactions reinitialized in servicesNav.js");
        });
    }

    // Replace dropdowns with a static link if there's only one subservice
    function handleSingleSubservice() {
        console.log("Handling single subservices in servicesNav.js");

        jQuery('.service-drop-down').each(function() {
            const $dropdown = jQuery(this);
            const $subserviceList = $dropdown.find('.subservice-list');
            const $subservices = $subserviceList.find('.nav-small-link.is-sub');

            if ($subservices.length === 1) {
                console.log("Found one subservice, replacing dropdown in servicesNav.js");

                const singleSubserviceUrl = $subservices.attr('href');
                const singleSubserviceText = $subservices.find('.button-text').text();

                if (singleSubserviceUrl && singleSubserviceUrl !== "#") {
                    console.log(`Replacing with static link: ${singleSubserviceUrl} in servicesNav.js`);

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
        console.log(`Updating footer link for: ${serviceText} in servicesNav.js`);

        jQuery('.underline-link.is-footer').each(function() {
            const $footerLink = jQuery(this);
            const footerLinkText = $footerLink.find('.button-text-2').text().trim();

            if (footerLinkText === serviceText) {
                console.log(`Updating footer link URL to: ${serviceUrl} in servicesNav.js`);
                $footerLink.attr('href', serviceUrl);
            }
        });
    }

    // Add "View all {Area Name}" link after subservice lists are loaded
    function addViewAllLink(serviceAreaName, serviceAreaUrl, $container) {
        const viewAllText = serviceAreaName.endsWith('Services') ? serviceAreaName : `${serviceAreaName} Services`;
        console.log(`Adding "View All" link for: ${viewAllText} in servicesNav.js`);

        const viewAllLinkHtml = `
            <a href="${serviceAreaUrl}" class="nav-small-link w-inline-block">
                <div class="nav-link-text">
                    <div class="button-text-wrapper">
                        <div class="button-text">View All ${viewAllText}</div>
                    </div>
                </div>
            </a>`;

        $container.append(viewAllLinkHtml);
    }

    // Load subservice lists dynamically
    function loadSubservices() {
        console.log("Loading subservices in servicesNav.js");

        jQuery('.is-area-tag').each(function() {
            const $this = jQuery(this);
            const serviceAreaSlug = $this.attr('id').replace('area-', '');
            const serviceAreaName = jQuery(`#name-${serviceAreaSlug}`).text().trim();
            const serviceAreaUrl = `/service-area/${serviceAreaSlug}`;

            console.log(`Loading subservices for area: ${serviceAreaSlug} in servicesNav.js`);

            $this.load(`/service-area/${serviceAreaSlug} .subservice-list`, function() {
                console.log(`Subservices loaded for area: ${serviceAreaSlug} in servicesNav.js`);
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
    console.log("Initializing dynamic subservice loading in servicesNav.js");
    debounceLoadSubservices();

})();
