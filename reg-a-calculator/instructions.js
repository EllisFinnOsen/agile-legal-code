document.addEventListener("DOMContentLoaded", function () {
  // Elements
  const nextArrow = document.querySelector(
    ".step-wrrow-right.w-slider-arrow-right"
  );
  const closeButton = document.querySelector(".close-tutorial");
  const instructionsElement = document.getElementById("is-instructions");
  const reopenButton = document.getElementById("reopen-instructions");

  // Element validation
  if (!nextArrow || !closeButton || !instructionsElement || !reopenButton)
    return;

  // State management
  const showInstructions = () => {
    instructionsElement.classList.add("is-active");
    console.log("Instructions activated");
  };

  const hideInstructions = () => {
    instructionsElement.classList.remove("is-active");
    localStorage.setItem("hasVisitedInstructions", "true");
    console.log("Instructions deactivated");
  };

  // Initial state (starts hidden by default)
  if (!localStorage.getItem("hasVisitedInstructions")) {
    // Only show if first visit
    setTimeout(() => showInstructions(), 100); // Small delay for CSS to initialize
  }

  // Event listeners
  closeButton.addEventListener("click", hideInstructions);
  reopenButton.addEventListener("click", showInstructions);

  // Close button visibility observer
  const updateCloseButtonVisibility = () => {
    closeButton.style.display =
      nextArrow.style.display === "none" ? "block" : "none";
  };

  const observer = new MutationObserver(updateCloseButtonVisibility);
  observer.observe(nextArrow, { attributes: true, attributeFilter: ["style"] });
  updateCloseButtonVisibility();
});
