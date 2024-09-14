
document.addEventListener('DOMContentLoaded', function() {
    // Reinitialize Webflow interactions
    function reinitializeWebflowInteractions() {
        console.log('Reinitializing Webflow interactions...');
        Webflow.require('ix2').init();
    }

    // Replace dropdowns with a static link if there's only one subservice
    function handleSingleSubservice() {
        console.log('Checking for single subservice...');

        document.querySelectorAll('.service-drop-down').forEach(function(dropdown) {
            var subserviceList = dropdown.querySelector('.subservice-list');
            console.log('Subservice list element:', subserviceList);

            if (subserviceList) {
                var subservices = subserviceList.querySelectorAll('.nav-small-link.is-sub');
                console.log('Subservices found:', subservices.length);

                // If there is only one subservice, replace the dropdown
                if (subservices.length === 1) {
                    console.log('Only one subservice found. Replacing with a static link...');

                    var singleSubserviceUrl = subservices[0].getAttribute('href');
                    var singleSubserviceText = subservices[0].querySelector('.button-text').textContent;

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
                        dropdown.outerHTML = staticLinkHtml;

                        // Update the corresponding footer link if necessary
                        updateFooterLink(singleSubserviceText, singleSubserviceUrl);
                    }
                }
            }
        });

        // Reinitialize Webflow interactions after changes
        setTimeout(reinitializeWebflowInteractions, 100);
    }

    // Update the corresponding footer link
    function updateFooterLink(serviceText, serviceUrl) {
        document.querySelectorAll('.underline-link.is-footer').forEach(function(footerLink) {
            var footerLinkText = footerLink.querySelector('.button-text-2').textContent.trim();
            console.log('Checking footer link:', footerLinkText);

            // If the footer link text matches the service area text, update the href
            if (footerLinkText === serviceText) {
                console.log('Updating footer link to URL:', serviceUrl);
                footerLink.setAttribute('href', serviceUrl);
            }
        });
    }

    function addViewAllLink(serviceAreaName, serviceAreaUrl, container) {
        if (container) {  // Ensure the container exists
            console.log(`Adding "View all ${serviceAreaName}" link...`);
    
            var viewAllText = serviceAreaName.endsWith('Services') ? serviceAreaName : `${serviceAreaName} Services`;
    
            var viewAllLinkHtml = `
                <a href="${serviceAreaUrl}" class="nav-small-link w-inline-block">
                    <div class="nav-link-text">
                        <div class="button-text-wrapper">
                            <div class="button-text">View all ${viewAllText}</div>
                        </div>
                    </div>
                </a>`;
    
            container.insertAdjacentHTML('beforeend', viewAllLinkHtml);
            console.log(`"View all ${viewAllText}" link added.`);
        } else {
            console.error("Container not found for View All link.");
        }
    }
    
    // Load subservice lists dynamically
    function loadSubservices() {
        document.querySelectorAll('.is-area-tag').forEach(function(tag) {
            var serviceAreaSlug = tag.getAttribute('id').replace('area-', '');
            
            // Get the corresponding service area name from .is-area-name
            var serviceAreaName = document.querySelector(`#name-${serviceAreaSlug}`).textContent.trim();
            var serviceAreaUrl = `/service-area/${serviceAreaSlug}`;  // Correct URL format
            
            console.log('Loading subservices for:', serviceAreaSlug);

            // Fetch the subservices from the correct container
            fetch(`/service-area/${serviceAreaSlug} .subservice-list`)
    .then(response => response.text())
    .then(html => {
        console.log(`Fetched HTML for ${serviceAreaSlug}:`, html);
        tag.innerHTML = new DOMParser().parseFromString(html, 'text/html').body.innerHTML;
        console.log('Subservices loaded for:', serviceAreaSlug);

        // After loading the subservices, check for single subservice and replace dropdown
        handleSingleSubservice();

        // After handling subservices, add "View all" link to the correct list (within .collection-list-3)
        var collectionList = tag.querySelector('.collection-list-3');
        addViewAllLink(serviceAreaName, serviceAreaUrl, collectionList);
    });
        });
    }

    // Initialize the dynamic loading and subservice handling on page load
    loadSubservices();
});


</script>


<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/ellisfinnosen/agile-legal-code@main/agileCode.js"></script>