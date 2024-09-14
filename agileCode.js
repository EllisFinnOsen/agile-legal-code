window.addEventListener('DOMContentLoaded', function() {
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

        // Initialize the dynamic loading and subservice handling on page load
        debounceLoadSubservices();
    });
});


// Page Animations:

window.addEventListener("DOMContentLoaded", (event) => {
    // Split text into spans for text animations
    let typeSplit = new SplitType("[text-split]", {
      types: "words, chars",
      tagName: "span"
    });
  
    // Function to check if the element is already in the viewport
    function isElementInViewport(el) {
      const rect = el.getBoundingClientRect();
      return rect.top >= 0 && rect.left >= 0 &&
             rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
             rect.right <= (window.innerWidth || document.documentElement.clientWidth);
    }
  
    // Function to create scroll triggers with debouncing for elements out of view
    function createScrollTrigger(triggerElement, timeline, delay = 0) {
      let startValue = $(triggerElement).attr("scroll-start") || "80"; // Default to 80% if no custom scroll-start attribute
      let scheduledAnimationFrame = false;
  
      // Check if the element is in view and trigger immediately if so
      if (isElementInViewport(triggerElement[0])) {
        timeline.play(); // If it's already visible, play immediately
      } else {
        function scheduleAnimation() {
          if (!scheduledAnimationFrame) {
            scheduledAnimationFrame = true;
            requestAnimationFrame(() => {
              ScrollTrigger.create({
                trigger: triggerElement,
                start: `top ${startValue}%+=${delay * 1000}`, // Use custom scroll-start value
                onEnter: () => timeline.play(),
                onLeaveBack: () => {
                  timeline.progress(0);
                  timeline.pause();
                }
              });
              scheduledAnimationFrame = false; // Allow future frames
            });
          }
        }
        window.addEventListener('scroll', scheduleAnimation);
      }
    }
  
    // Text animations with immediate play for elements in view
    $("[words-slide-from-right]").each(function () {
      let delay = parseFloat($(this).attr('text-delay')) || 0;
      let tl = gsap.timeline({ paused: true, delay: delay });
      tl.from($(this).find(".word"), {
        opacity: 0,
        x: "1em",
        duration: 0.6,
        ease: "power2.out",
        stagger: { amount: 0.2 }
      });
      createScrollTrigger($(this), tl, delay);
    });
  
    $("[letters-slide-down]").each(function () {
      let delay = parseFloat($(this).attr('text-delay')) || 0;
      let tl = gsap.timeline({ paused: true, delay: delay });
      tl.from($(this).find(".char"), {
        yPercent: -120,
        duration: 0.3,
        ease: "power1.out",
        stagger: { amount: 0.7 }
      });
      createScrollTrigger($(this), tl, delay);
    });
  
    // Card animations with immediate play for elements in view
    $("[cards-slide-from-right]").each(function () {
      let delay = parseFloat($(this).attr('text-delay')) || 0;
      let children = $(this).children(); // Get all child elements (cards)
      let tl = gsap.timeline({ paused: true, delay: delay });
  
      tl.from(children, {
        opacity: 0,
        x: "1em",
        duration: 0.6,
        ease: "power2.out",
        stagger: { amount: 0.3 }
      });
  
      createScrollTrigger($(this), tl, delay);
    });
  
    // Avoid flash of unstyled content
    gsap.set("[text-split]", { opacity: 1 });
  });