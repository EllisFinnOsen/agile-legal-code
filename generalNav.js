// Move your functionality inside a function
function initializeGeneralNav() {
    console.log("Initializing generalNav.js functionality...");
  
    var lastScrollTop = 0;
    var navbar = document.getElementById("navigation-bar");
    var dropdowns = document.querySelectorAll(
      '.w-dropdown-toggle[aria-expanded="true"]'
    );
    var dropdownToggle2 = document.querySelectorAll(".dropdown-toggle-2");
    var tabletBreakpoint = 991; // Width at which we switch to tablet and below
    var mainWrapper = document.querySelector(".main-wrapper");
    var triggerElement = mainWrapper
      ? mainWrapper.querySelector(".nav-trigger-bg-at-start")
      : null;
  
    // Set initial background color if trigger element is present
    if (triggerElement) {
      navbar.style.backgroundColor = "#ebeff3"; // Set the initial background color
    }
  
    // Scroll event listener
    window.addEventListener("scroll", function () {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
      // Always apply scroll up/down behavior regardless of screen size
      if (scrollTop > lastScrollTop) {
        // Scrolling down
        navbar.style.transition = "transform 1s ease, opacity 1s ease";
        navbar.style.transform = "translateY(-150%)";
        navbar.style.opacity = "0";
      } else {
        // Scrolling up
        navbar.style.transition =
          "transform 0.75s ease, opacity 0.75s ease, background-color 0.75s ease";
        navbar.style.transform = "translateY(0%)";
        navbar.style.opacity = "1";
        navbar.style.backgroundColor = "#ebeff3"; // Background color on scroll up
  
        // Close any open dropdowns (if on desktop)
        if (window.innerWidth > tabletBreakpoint) {
          dropdowns.forEach(function (dropdown) {
            dropdown.setAttribute("aria-expanded", "false");
            var dropdownList = dropdown.nextElementSibling;
            if (
              dropdownList &&
              dropdownList.classList.contains("w-dropdown-list")
            ) {
              dropdownList.style.display = "none"; // Hides the dropdown list
            }
          });
        }
      }
  
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Avoid negative scroll values
    });
  
    // Click event listener for dropdown-toggle-2 (only on desktop)
    dropdownToggle2.forEach(function (toggle) {
      toggle.addEventListener("click", function () {
        var isExpanded = toggle.getAttribute("aria-expanded") === "true";
  
        // Only apply dropdown-triggered background change if screen width is greater than tablet breakpoint
        if (window.innerWidth > tabletBreakpoint) {
          // If the dropdown is open, change the navbar background
          if (!isExpanded) {
            navbar.style.backgroundColor = "#ebeff3"; // Solid color when the dropdown is open
            navbar.style.opacity = "1";
            navbar.style.transition =
              "background-color 0.75s ease, opacity 0.75s ease";
          } else {
            navbar.style.backgroundColor = ""; // Reset to default if closed
          }
        }
      });
    });
  
    console.log("generalNav.js functionality initialized.");
  }
  
  // Directly call the function after jQuery is loaded
  initializeGeneralNav();
  
  console.log("generalNav.js setup added to waitless.");
  