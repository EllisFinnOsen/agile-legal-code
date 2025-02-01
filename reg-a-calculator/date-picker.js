$(document).ready(function () {
  // Initialize datepickers function
  function initDatePickers() {
    $('[data-toggle="datepicker"]').each(function () {
      // Destroy existing instance if it exists
      if ($(this).data("datepicker")) {
        $(this).datepicker("destroy");
      }

      // Initialize new datepicker
      $(this).datepicker({
        format: "mm-dd-yyyy",
      });

      // Mobile handling
      if (window.innerWidth < 768) {
        $(this).attr("readonly", "readonly");
      }
    });
  }

  // Initial initialization
  initDatePickers();

  function createDatePicker() {
    const container = $("#additional-date-container");

    if (container.find("#is-date").length) return;

    const datePickerHTML = `
            <div class="form-block is-date" id="is-date-block">
                <div class="field-label">Qualification Date</div>
                <div class="field-wrap">
                    <input class="date-field w-input" 
                           autocomplete="off" 
                           maxlength="256" 
                           name="Date" 
                           data-name="Date" 
                           placeholder="Select Date" 
                           data-toggle="datepicker" 
                           type="text" 
                           id="is-date">
                    <img loading="lazy" 
                         src="https://cdn.prod.website-files.com/671d5798d57508981d9cb745/67896fbe70c0745b2fad76e7_Date.svg" 
                         alt="" 
                         class="field-icon">
                </div>
            </div>`;

    container.append(datePickerHTML);
    initDatePickers(); // Reinitialize after adding
  }

  function removeDatePicker() {
    $("#is-date-block").remove();
  }

  // Toggle functionality
  $("#is-date-check").change(function () {
    if (this.checked) {
      createDatePicker();
    } else {
      removeDatePicker();
    }
  });

  // Initialize if checked by default
  if ($("#is-date-check").prop("checked")) {
    createDatePicker();
  }
});
