// Load jQuery first and wait for it to load
waitless.scripts.push({
    src: "https://code.jquery.com/jquery-3.6.0.min.js",
    location: "body",
    callback: jQueryLoaded,
  });
  
  // Once jQuery is loaded, execute your script
  function jQueryLoaded() {
    console.log("jQuery is loaded and ready!");
  
    // Move your functionality inside a function and call it once the servicesNav.js is loaded
    function initializeServicesNav() {
      console.log("Initializing servicesNav.js functionality...");
  
      // Reinitialize Webflow interactions
      function reinitializeWebflowInteractions() {
        console.log("Reinitializing Webflow interactions...");
        if (typeof Webflow.require === "function") {
          Webflow.require("ix2").init();
        } else {
          console.log("Webflow interactions not available.");
        }
      }
  
      // Replace dropdowns with a static link if there's only one subservice
      function handleSingleSubservice() {
        console.log("Checking for single subservice...");
  
        jQuery(".service-drop-down").each(function () {
          var $dropdown = jQuery(this);
          var $subserviceList = $dropdown.find(".subservice-list");
          console.log("Subservice list found:", $subserviceList);
  
          var $subservices = $subserviceList.find(".nav-small-link.is-sub");
          console.log("Subservices found:", $subservices.length);
  
          if ($subservices.length === 1) {
            console.log(
              "Only one subservice found. Replacing with a static link..."
            );
  
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
          console.log("Footer link text:", footerLinkText);
  
          if (footerLinkText === serviceText) {
            console.log("Updating footer link to URL:", serviceUrl);
            $footerLink.attr("href", serviceUrl);
          }
        });
      }
  
      // Add "View all {Area Name}" link after subservice lists are loaded
      function addViewAllLink(serviceAreaName, serviceAreaUrl, $container) {
        console.log(`Adding "View all ${serviceAreaName}" link...`);
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
        console.log(`"View all ${viewAllText}" link added.`);
      }
  
      // Load subservice lists dynamically
      function loadSubservices() {
        console.log("Loading subservices...");
        jQuery(".is-area-tag").each(function () {
          var $this = jQuery(this);
          var serviceAreaSlug = $this.attr("id").replace("area-", "");
          console.log("Service area slug:", serviceAreaSlug);
  
          var serviceAreaName = jQuery(`#name-${serviceAreaSlug}`).text().trim();
          var serviceAreaUrl = `/service-area/${serviceAreaSlug}`;
          console.log("Service area name:", serviceAreaName);
  
          $this.load(
            `/service-area/${serviceAreaSlug} .subservice-list`,
            function () {
              console.log("Subservices loaded for:", serviceAreaSlug);
  
              handleSingleSubservice();
  
              var $collectionList = $this.find(".collection-list-3");
              addViewAllLink(serviceAreaName, serviceAreaUrl, $collectionList);
            }
          );
        });
      }
  
      // Initialize the dynamic loading and subservice handling
      loadSubservices();
    }
  
    // Confirm that the function will be called
    console.log("servicesNav.js and other functions are ready to execute.");
  
    // Call the initialize function directly after jQuery is loaded
    initializeServicesNav();
  }
  
  // Push servicesNav.js itself for deferred loading
  waitless.scripts.push({
    src: "https://cdn.jsdelivr.net/gh/ellisfinnosen/agile-legal-code/servicesNav.js",
    location: "body",
    callback: function () {
      console.log("servicesNav.js has been loaded and executed.");
    },
  });
  
  console.log("subServiceNav.js setup added to waitless.");
  