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