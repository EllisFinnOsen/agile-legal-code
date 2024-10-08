// At the top of servicesNav.js
console.log("servicesNav.js script loaded and executing...");

// Main initialization function
function initializeServicesNav() {
  console.log("Initializing servicesNav.js functionality...");

  // Ensure jQuery is available
  if (typeof jQuery === "undefined") {
    console.error("jQuery is not loaded.");
    return;
  }

  console.log("jQuery is loaded and ready to use.");

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

  // Replace dropdowns with a static link if there's only one subservice
  function handleSingleSubservice() {
    jQuery(".service-drop-down").each(function () {
      var $dropdown = jQuery(this);
      var $subserviceList = $dropdown.find(".subservice-list");
      var $subservices = $subserviceList.find(".nav-small-link.is-sub");

      if ($subservices.length === 1) {
        var singleSubserviceUrl = $subservices.attr("href");
        var singleSubserviceText = $subservices.find(".button-text").text();

        if (singleSubserviceUrl && singleSubserviceUrl !== "#") {
          var staticLinkHtml = `
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

    setTimeout(reinitializeWebflowInteractions, 100);
  }

  // Update the corresponding footer link
  function updateFooterLink(serviceText, serviceUrl) {
    jQuery(".underline-link.is-footer").each(function () {
      var $footerLink = jQuery(this);
      var footerLinkText = $footerLink.find(".button-text-2").text().trim();

      if (footerLinkText === serviceText) {
        $footerLink.attr("href", serviceUrl);
      }
    });
  }

  // Add "View all {Area Name}" link after subservice lists are loaded
  function addViewAllLink(serviceAreaName, serviceAreaUrl, $container) {
    var viewAllText = serviceAreaName.endsWith("Services")
      ? serviceAreaName
      : `${serviceAreaName} Services`;

    var viewAllLinkHtml = `
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
    jQuery(".is-area-tag").each(function () {
      var $this = jQuery(this);
      var serviceAreaSlug = $this.attr("id").replace("area-", "");
      var serviceAreaName = jQuery(`#name-${serviceAreaSlug}`).text().trim();
      var serviceAreaUrl = `/service-area/${serviceAreaSlug}`;

      $this.load(
        `/service-area/${serviceAreaSlug} .subservice-list`,
        function () {
          handleSingleSubservice();

          var $collectionList = $this.find(".collection-list-3");
          addViewAllLink(serviceAreaName, serviceAreaUrl, $collectionList);
          console.log("Adding View All Link"+ serviceAreaName + serviceAreaUrl + $collectionList )
        }
      );
    });
  }

  // Initialize the dynamic loading and subservice handling
  loadSubservices();
}

// Call the initialize function to make sure it runs when the script is dynamically loaded
initializeServicesNav();
