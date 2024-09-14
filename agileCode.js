window.addEventListener('DOMContentLoaded', function() {
    jQuery(function() {
        // Reinitialize Webflow interactions
        function reinitializeWebflowInteractions() {
            console.log('Reinitializing Webflow interactions...');
            Webflow.require('ix2').init();
        }

        // Replace dropdowns with a static link if there's only one subservice
        function handleSingleSubservice() {
            console.log('Checking for single subservice...');

            jQuery('.service-drop-down').each(function() {
                var $dropdown = jQuery(this);
                var $subserviceList = $dropdown.find('.subservice-list');

                console.log('Subservice list element:', $subserviceList);

                var $subservices = $subserviceList.find('.nav-small-link.is-sub');
                console.log('Subservices found:', $subservices.length);

                // If there is only one subservice, replace the dropdown
                if ($subservices.length === 1) {
                    console.log('Only one subservice found. Replacing with a static link...');

                    var singleSubserviceUrl = $subservices.attr('href');
                    var singleSubserviceText = $subservices.find('.button-text').text();
                    console.log('Single subservice URL:', singleSubserviceUrl);
                    console.log('Single subservice text:', singleSubserviceText);

                    if (singleSubserviceUrl && singleSubserviceUrl !== "#") {
                        var staticLinkHtml = `
                            <a href="${singleSubserviceUrl}" class="nav-small-link w-inline-block">
                                <div class="nav-link-text">
                                    <div class="button-text-wrapper">
                                        <div class="button-text">${singleSubserviceText}</div>
                                    </div>
                                </div>
                            </a>`;

                        console.log('Replacing dropdown with static link:', staticLinkHtml);

                        // Replace the dropdown with the static link
                        $dropdown.replaceWith(staticLinkHtml);

                        // Update the corresponding footer link
                        updateFooterLink(singleSubserviceText, singleSubserviceUrl);
                    }
                }
            });

            // Reinitialize Webflow interactions after changes
            setTimeout(reinitializeWebflowInteractions, 100);
        }

        // Update the corresponding footer link
        function updateFooterLink(serviceText, serviceUrl) {
            jQuery('.underline-link.is-footer').each(function() {
                var $footerLink = jQuery(this);
                var footerLinkText = $footerLink.find('.button-text-2').text().trim();

                console.log('Checking footer link:', footerLinkText);

                // If the footer link text matches the service area text, update the href
                if (footerLinkText === serviceText) {
                    console.log('Updating footer link to URL:', serviceUrl);
                    $footerLink.attr('href', serviceUrl);
                }
            });
        }

        // Add "View all {Area Name}" link after subservice lists are loaded
        function addViewAllLink(serviceAreaName, serviceAreaUrl, $container) {
            console.log(`Adding "View all ${serviceAreaName}" link...`);

            // Check if "Services" is already in the name to avoid redundancy
            var viewAllText = serviceAreaName.endsWith('Services') ? serviceAreaName : `${serviceAreaName} Services`;

            var viewAllLinkHtml = `
                <a href="${serviceAreaUrl}" class="nav-small-link w-inline-block">
                    <div class="nav-link-text">
                        <div class="button-text-wrapper">
                            <div class="button-text">View all ${viewAllText}</div>
                        </div>
                    </div>
                </a>`;

            // Append the "View all" link to the subservice list container (after the subservice items)
            $container.append(viewAllLinkHtml);

            console.log(`"View all ${viewAllText}" link added.`);
        }

        // Load subservice lists dynamically
        function loadSubservices() {
            jQuery('.is-area-tag').each(function() {
                var $this = jQuery(this);
                var serviceAreaSlug = $this.attr('id').replace('area-', '');
                
                // Get the corresponding service area name from .is-area-name
                var serviceAreaName = jQuery(`#name-${serviceAreaSlug}`).text().trim();
                var serviceAreaUrl = `/service-area/${serviceAreaSlug}`;
                
                console.log('Loading subservices for:', serviceAreaSlug);

                // Load the subservices from the correct container
                $this.load(`/service-area/${serviceAreaSlug} .subservice-list`, function() {
                    console.log('Subservices loaded for:', serviceAreaSlug);

                    // After loading the subservices, check for single subservice and replace dropdown
                    handleSingleSubservice();

                    // After handling subservices, add "View all" link to the correct list (within .collection-list-3)
                    var $collectionList = $this.find('.nav-collection-list');
                    addViewAllLink(serviceAreaName, serviceAreaUrl, $collectionList);
                });
            });
        }

        // Initialize the dynamic loading and subservice handling on page load
        loadSubservices();
    });


});