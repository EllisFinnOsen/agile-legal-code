function loadNavScripts() {
    console.log("Loading navigation scripts...");
  
    const generalNavScript = document.createElement('script');
    generalNavScript.src = "https://cdn.jsdelivr.net/gh/ellisfinnosen/agile-legal-code@main/generalNav.js?v=1";
    generalNavScript.defer = true;
  
    generalNavScript.onload = function() {
      console.log("generalNav.js loaded and executing.");
      
      // Manually trigger the generalNav.js code, as it's now loaded
      var lastScrollTop = 0;
      var navbar = document.getElementById('navigation-bar');
      var dropdowns = document.querySelectorAll('.w-dropdown-toggle[aria-expanded="true"]');
      var dropdownToggle2 = document.querySelectorAll('.dropdown-toggle-2');
      var tabletBreakpoint = 991; // Width at which we switch to tablet and below
      var mainWrapper = document.querySelector('.main-wrapper');
      var triggerElement = mainWrapper ? mainWrapper.querySelector('.nav-trigger-bg-at-start') : null;
  
      if (triggerElement) {
          navbar.style.backgroundColor = '#ebeff3'; // Set the initial background color
      }
  
      window.addEventListener('scroll', function () {
          var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          if (scrollTop > lastScrollTop) {
              navbar.style.transition = 'transform 1s ease, opacity 1s ease';
              navbar.style.transform = 'translateY(-150%)';
              navbar.style.opacity = '0';
          } else {
              navbar.style.transition = 'transform 0.75s ease, opacity 0.75s ease, background-color 0.75s ease';
              navbar.style.transform = 'translateY(0%)';
              navbar.style.opacity = '1';
              navbar.style.backgroundColor = '#ebeff3';
  
              if (window.innerWidth > tabletBreakpoint) {
                  dropdowns.forEach(function (dropdown) {
                      dropdown.setAttribute('aria-expanded', 'false');
                      var dropdownList = dropdown.nextElementSibling;
                      if (dropdownList && dropdownList.classList.contains('w-dropdown-list')) {
                          dropdownList.style.display = 'none';
                      }
                  });
              }
          }
          lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
      });
  
      dropdownToggle2.forEach(function (toggle) {
          toggle.addEventListener('click', function () {
              var isExpanded = toggle.getAttribute('aria-expanded') === 'true';
  
              if (window.innerWidth > tabletBreakpoint) {
                  if (!isExpanded) {
                      navbar.style.backgroundColor = '#ebeff3';
                      navbar.style.opacity = '1';
                      navbar.style.transition = 'background-color 0.75s ease, opacity 0.75s ease';
                  } else {
                      navbar.style.backgroundColor = '';
                  }
              }
          });
      });
    };
  
    document.body.appendChild(generalNavScript);
  }
  