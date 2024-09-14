document.addEventListener("DOMContentLoaded", function () {

    window.Webflow.push(function() {
        setTimeout(function() {

            const DURATION = 9000; // Duration for each slide in milliseconds
            const EXIT_DURATION = 500; // Duration for the exit animation in milliseconds
            const TAB_CLASS = "tab";
            const TAB_FILL_CLASS = "tab-fill";
            const TAB_SUBTEXT_CLASS = "tab-subtext";
            let autoRotation;
            let activeTabIndex = 0;
            let scheduledAnimationFrame = false; // For debouncing

            // Log when the script starts

            // Function to check if the nav menu is open by checking the display property of the overlay
            const isNavMenuOpen = () => {
                const navOverlay = document.querySelector('.w-nav-overlay');
                const isOpen = navOverlay && window.getComputedStyle(navOverlay).display === 'block'; 
                return isOpen;
            };

            const startRotation = (fromIndex = 0) => {
                activeTabIndex = fromIndex;
                resetAllTabFills();
                animateTabFill();
                showTabSubtext();
                autoRotation = setInterval(() => {
                    if (!isNavMenuOpen()) { // Only rotate tabs if the nav menu is not open
                        prepareTabTransition();
                    } else {
                    }
                }, DURATION);
            };

            const stopRotation = () => {
                clearInterval(autoRotation);
                resetAllTabFills();
            };

            const prepareTabTransition = () => {
                let tabs = document.querySelectorAll(`.${TAB_CLASS}`);
                let currentTab = tabs[activeTabIndex];
                
                closeTabFill(currentTab);
                hideTabSubtext(currentTab);

                setTimeout(() => activateNextTab(), EXIT_DURATION);
            };

            const activateNextTab = () => {
                let tabs = document.querySelectorAll(`.${TAB_CLASS}`);
                let currentTab = tabs[activeTabIndex];
                let nextTab = tabs[(activeTabIndex + 1) % tabs.length];

                resetTabFill(currentTab);
                $("#" + nextTab.id).trigger("click");
                activeTabIndex = (activeTabIndex + 1) % tabs.length;
                animateTabFill();
                showTabSubtext();
            };

            const resetAllTabFills = () => {
                const tabFills = document.querySelectorAll(`.${TAB_FILL_CLASS}`);
                tabFills.forEach((fill) => {
                    if (fill.closest(`.${TAB_CLASS}`)) {
                        fill.style.width = "0%";
                        fill.style.transition = "none";
                    }
                });
                hideAllTabSubtexts();
            };

            const resetTabFill = (tab) => {
                const tabFill = tab.querySelector(`.${TAB_FILL_CLASS}`);
                if (tabFill) {
                    tabFill.style.width = "0%";
                    tabFill.style.transition = "none";
                }
            };

            const animateTabFill = () => {
                const activeTabFill = document.querySelector(`.${TAB_CLASS}.w--current .${TAB_FILL_CLASS}`);
                if (activeTabFill) {
                    // Debounce animation logic
                    if (!scheduledAnimationFrame) {
                        scheduledAnimationFrame = true;
                        requestAnimationFrame(() => {
                            activeTabFill.style.width = "0%";
                            activeTabFill.style.transition = "none";
                            void activeTabFill.offsetWidth; // Force reflow
                            activeTabFill.style.transition = `width ${DURATION}ms linear`;
                            activeTabFill.style.width = "100%";
                            scheduledAnimationFrame = false; // Reset after animation is set
                        });
                    }
                }
            };

            const closeTabFill = (tab) => {
                const tabFill = tab.querySelector(`.${TAB_FILL_CLASS}`);
                if (tabFill) {
                    tabFill.style.transition = `width ${EXIT_DURATION}ms ease-in-out`;
                    tabFill.style.width = "0%";
                }
            };

            const hideTabSubtext = (tab) => {
                const tabSubtext = tab.querySelector(`.${TAB_SUBTEXT_CLASS}`);
                if (tabSubtext) {
                    tabSubtext.style.transition = `opacity ${EXIT_DURATION}ms ease-in-out, height ${EXIT_DURATION}ms ease-in-out`;
                    tabSubtext.style.opacity = "0";
                    tabSubtext.style.height = "0";
                }
            };

            const showTabSubtext = () => {
                const activeTabSubtext = document.querySelector(`.${TAB_CLASS}.w--current .${TAB_SUBTEXT_CLASS}`);
                if (activeTabSubtext) {
                    activeTabSubtext.style.transition = `opacity ${EXIT_DURATION}ms ease-in-out, height ${EXIT_DURATION}ms ease-in-out`;
                    activeTabSubtext.style.opacity = "1";
                    activeTabSubtext.style.height = "auto";
                }
            };

            const hideAllTabSubtexts = () => {
                const tabSubtexts = document.querySelectorAll(`.${TAB_SUBTEXT_CLASS}`);
                tabSubtexts.forEach((subtext) => {
                    if (subtext.closest(`.${TAB_CLASS}`)) {
                        subtext.style.opacity = "0";
                        subtext.style.height = "0";
                        subtext.style.transition = "none";
                    }
                });
            };

            // Debounce click handler to avoid multiple rapid clicks causing issues
            let debounceTimer;
            document.querySelectorAll(`.${TAB_CLASS}`).forEach((element, index) => {
                element.addEventListener("click", function(event) {
                    clearTimeout(debounceTimer);
                    debounceTimer = setTimeout(() => {
                        if (!event.target.closest('.nav-menu')) {
                            stopRotation();
                            resetAllTabFills();
                            activeTabIndex = index;
                            animateTabFill();
                            showTabSubtext();
                            setTimeout(() => startRotation(activeTabIndex), 0);
                        }
                    }, 200); // Adding 200ms debounce to prevent rapid triggers
                });
            });

            startRotation();

        }, 500);
    });
});