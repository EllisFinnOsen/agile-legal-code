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



document.addEventListener('DOMContentLoaded', function () {
    console.log("I LAODED");
    var lastScrollTop = 0;
    var navbar = document.getElementById('navigation-bar');
    var dropdowns = document.querySelectorAll('.w-dropdown-toggle[aria-expanded="true"]');
    var dropdownToggle2 = document.querySelectorAll('.dropdown-toggle-2');
    var tabletBreakpoint = 991; // Width at which we switch to tablet and below
    var mainWrapper = document.querySelector('.main-wrapper');
    var triggerElement = mainWrapper.querySelector('.nav-trigger-bg-at-start');

    // Set initial background color if trigger element is present
    if (triggerElement) {
        navbar.style.backgroundColor = '#ebeff3'; // Set the initial background color
    }

    // Scroll event listener
    window.addEventListener('scroll', function () {
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Always apply scroll up/down behavior regardless of screen size
        if (scrollTop > lastScrollTop) {
            // Scrolling down
            navbar.style.transition = 'transform 1s ease, opacity 1s ease';
            navbar.style.transform = 'translateY(-150%)';
            navbar.style.opacity = '0';
        } else {
            // Scrolling up
            navbar.style.transition = 'transform 0.75s ease, opacity 0.75s ease, background-color 0.75s ease';
            navbar.style.transform = 'translateY(0%)';
            navbar.style.opacity = '1';
            navbar.style.backgroundColor = '#ebeff3'; // Background color on scroll up

            // Close any open dropdowns (if on desktop)
            if (window.innerWidth > tabletBreakpoint) {
                dropdowns.forEach(function (dropdown) {
                    dropdown.setAttribute('aria-expanded', 'false');
                    var dropdownList = dropdown.nextElementSibling;
                    if (dropdownList && dropdownList.classList.contains('w-dropdown-list')) {
                        dropdownList.style.display = 'none'; // Hides the dropdown list
                    }
                });
            }
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Avoid negative scroll values
    });

    // Click event listener for dropdown-toggle-2 (only on desktop)
    dropdownToggle2.forEach(function (toggle) {
        toggle.addEventListener('click', function () {
            var isExpanded = toggle.getAttribute('aria-expanded') === 'true';

            // Only apply dropdown-triggered background change if screen width is greater than tablet breakpoint
            if (window.innerWidth > tabletBreakpoint) {
                // If the dropdown is open, change the navbar background
                if (!isExpanded) {
                    navbar.style.backgroundColor = '#ebeff3'; // Solid color when the dropdown is open
                    navbar.style.opacity = '1';
                    navbar.style.transition = 'background-color 0.75s ease, opacity 0.75s ease';
                } else {
                    navbar.style.backgroundColor = ''; // Reset to default if closed
                }
            }
        });
    });
});