document.addEventListener("DOMContentLoaded", function () {
  const originalValues = new Map();

  // Function to dynamically create the additional question
  function createAdditionalQuestion() {
    const additionalQuestionContainer = document.getElementById(
      "additional-question-container"
    );

    // Check if the question already exists to avoid duplicates
    if (additionalQuestionContainer.querySelector("#is-issuer-dealer")) return;

    // Create the new question element
    const questionHtml = `
        <div class="form-block" id="additional-question">
            <label for="is-issuer-dealer">Has the Issuer obtained issuer dealer registration in NJ, TX, and WA?</label>
            <label class="w-checkbox ms-switch-wrap">
                <input type="checkbox" name="is-issuer-dealer" id="is-issuer-dealer" class="w-checkbox-input ms-toggle-checkbox">
                <span class="ms-switch-label dark w-form-label" for="is-issuer-dealer">
                    <span class="ms-switch-option">No</span>
                    <span class="ms-switch-option dark">Yes</span>
                </span>
                <div class="ms-switch-select"></div>
                <div class="ms-switch-bg dark"></div>
            </label>
        </div>`;

    // Add the question to the container
    additionalQuestionContainer.insertAdjacentHTML("beforeend", questionHtml);

    // Attach event listener to handle re-enabling of fields
    document
      .getElementById("is-issuer-dealer")
      .addEventListener("change", function () {
        const isIssuerDealer = this.checked;
        if (isIssuerDealer) {
          enableRestrictedFields();
        } else {
          disableRestrictedFields();
        }
      });
  }

  // Function to remove the additional question
  function removeAdditionalQuestion() {
    const additionalQuestion = document.getElementById("additional-question");
    if (additionalQuestion) additionalQuestion.remove();
  }

  // Function to disable restricted fields
  function disableRestrictedFields() {
    const restrictedStates = ["New Jersey", "Texas", "Washington"];
    const tableRows = document.querySelectorAll(".table_row");

    tableRows.forEach((row) => {
      const cells = row.querySelectorAll(".table_cell");
      const stateName = cells[0]?.textContent.trim();

      if (restrictedStates.includes(stateName)) {
        const lastCell = cells[cells.length - 1];
        const secondLastCell = cells[cells.length - 2];

        if (!originalValues.has(row)) {
          originalValues.set(row, {
            lastValue: lastCell.textContent,
            secondLastValue: secondLastCell.textContent,
          });
        }

        row.classList.add("no-broker-dealer");
        secondLastCell.textContent = "$-";
        lastCell.textContent = "$-";
        lastCell.setAttribute("is-input", "false");
        lastCell.removeEventListener("click", makeEditable);
      }
    });
  }

  // Function to enable restricted fields
  function enableRestrictedFields() {
    const restrictedStates = ["New Jersey", "Texas", "Washington"];
    const tableRows = document.querySelectorAll(".table_row");

    tableRows.forEach((row) => {
      const cells = row.querySelectorAll(".table_cell");
      const stateName = cells[0]?.textContent.trim();

      if (restrictedStates.includes(stateName) && originalValues.has(row)) {
        const lastCell = cells[cells.length - 1];
        const secondLastCell = cells[cells.length - 2];
        const { lastValue, secondLastValue } = originalValues.get(row);

        secondLastCell.textContent = secondLastValue;
        lastCell.textContent = lastValue;
        row.classList.remove("no-broker-dealer");
        lastCell.setAttribute("is-input", "true");
        lastCell.addEventListener("click", makeEditable, { once: true });
      }
    });
  }

  // Main switch function
  function updateBrokerDealerRestriction() {
    const isBrokerDealer = document.getElementById("is-broker-dealer").checked;

    if (!isBrokerDealer) {
      disableRestrictedFields();
      createAdditionalQuestion();
    } else {
      enableRestrictedFields();
      removeAdditionalQuestion();
    }
  }

  // Attach event listener to the broker-dealer switch
  document
    .getElementById("is-broker-dealer")
    .addEventListener("change", updateBrokerDealerRestriction);

  // Initial broker-dealer restriction check on page load
  updateBrokerDealerRestriction();

  function formatCurrency(value) {
    const numericValue = parseFloat(value);

    if (isNaN(numericValue)) {
      return "$0";
    }
    // Format as currency with commas
    return `$${numericValue.toLocaleString("en-US")}`;
  }

  function removeFormatting(value) {
    // Removes "$", commas, and spaces.
    return value.replace(/[$,\s]/g, "");
  }

  function formatWithCommas(value) {
    // Remove non-digit characters (including commas)
    const cleaned = value.replace(/[^\d.]/g, "");

    // If you only want whole numbers, remove any decimal parts:
    // const cleaned = value.replace(/\D/g, '');

    // Convert to a float
    const numericValue = parseFloat(cleaned) || 0;

    // Format the number with commas
    return numericValue.toLocaleString("en-US");
  }

  function onInputWithCommas(event) {
    // Get the raw value from the input
    const inputValue = event.target.value;

    // Save the cursor position if needed (optional advanced approach)
    const selectionStart = event.target.selectionStart;

    // Format the value with commas
    const formattedValue = formatWithCommas(inputValue);

    // Update the input’s value
    event.target.value = formattedValue;

    // (Optional) Attempt to restore the cursor position
    // For a perfectly smooth user experience, you’d have to do more advanced
    // caret management, especially if you allow decimals or other characters.
    event.target.selectionStart = event.target.selectionEnd = selectionStart;
  }

  function calculateFilingFee(associatedCell, baseValue, cell) {
    const min = parseFloat(cell.getAttribute("data-min"));
    const max = parseFloat(cell.getAttribute("data-max"));
    const divisor = parseFloat(cell.getAttribute("data-divisor"));
    const rate = parseFloat(cell.getAttribute("data-rate"));
    const constant = parseFloat(cell.getAttribute("data-constant")) || 0;
    const base = parseFloat(cell.getAttribute("data-base")) || 0;
    const threshold = parseFloat(cell.getAttribute("data-threshold"));
    const multiplier = parseFloat(cell.getAttribute("data-multiplier"));

    let calculatedFee;

    if (!isNaN(threshold) && !isNaN(multiplier) && !isNaN(base)) {
      calculatedFee = Math.max(
        100,
        base + (baseValue - threshold) * multiplier
      );
    } else if (!isNaN(multiplier) && !isNaN(base)) {
      calculatedFee = base + baseValue * multiplier;
    } else if (!isNaN(divisor)) {
      calculatedFee =
        Math.min(max, Math.max(min, baseValue / divisor)) + constant;
    } else if (!isNaN(rate)) {
      calculatedFee = Math.min(max, Math.max(min, baseValue * rate)) + constant;
    } else {
      console.warn("No applicable formula attributes found for this cell.");
      calculatedFee = 0;
    }

    associatedCell.textContent = `$ ${calculatedFee
      .toFixed(0)
      .toLocaleString("en-US")}`;
  }

  //NEW STUFF:

  function formatCurrency(value) {
    if (value === undefined || value === null || isNaN(value)) return "$0";
    const numericValue = parseFloat(value);
    return `$${numericValue.toLocaleString("en-US")}`;
  }

  function removeFormatting(value) {
    if (!value) return "0"; // Ensure no undefined errors
    return value.replace(/[$,\s]/g, ""); // Removes $, commas, and spaces
  }

  function makeEditable(event) {
    const cell = event.currentTarget;

    // If the cell is marked as not editable, return early
    if (cell.getAttribute("is-input") === "false") return;

    const currentFormattedValue = cell.textContent.trim();
    const currentValue = removeFormatting(currentFormattedValue) || "0"; // Ensure it's never undefined

    const filingFeeCell = cell.previousElementSibling;

    // Get attributes for validation
    const minValue = parseFloat(cell.getAttribute("data-input-min")) || 0;
    const maxValue =
      parseFloat(cell.getAttribute("data-input-max")) || 75000000;
    const stepSize = parseFloat(cell.getAttribute("data-input-step")) || 1;
    const minFiling = parseFloat(cell.getAttribute("data-min")) || 0;
    const maxFiling = parseFloat(cell.getAttribute("data-max")) || 0;
    const dataConstant = parseFloat(cell.getAttribute("data-constant")) || 0;
    const offeringMax =
      parseFloat(cell.getAttribute("max-offering")) || 75000000;
    const stateName = cell.getAttribute("state-name") || "This State";

    const combinedMin = parseFloat(dataConstant + minFiling) || 0;
    const combinedMax = parseFloat(dataConstant + maxFiling) || 0;

    // Store initial value for comparison
    let initialValue = parseFloat(currentValue);

    // Add editing class
    cell.classList.add("editing");

    // Create number input
    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("editable-input");
    input.value = formatCurrency(currentValue);

    // Ensure correct positioning & styling
    cell.textContent = "";
    cell.appendChild(input);
    input.focus();
    input.select();

    // Track if the alert has been shown for this cell
    cell.alertShown = cell.alertShown || false;

    // Function to enforce rounding and limits
    function enforceLimits(value) {
      let numericValue = parseFloat(removeFormatting(value)) || 0;

      if (numericValue > maxValue && numericValue > offeringMax) {
        alert(`The maximum offering amount permitted is ${offeringMax}.`);
        numericValue = offeringMax;
      } else if (numericValue < minValue) {
        alert(
          `${stateName}'s minimum filing fee ${formatCurrency(
            combinedMin
          )} authorizes ${formatCurrency(minValue)}.`
        );
        numericValue = minValue;
      }

      // Apply rounding step
      if (stepSize > 1) {
        numericValue = Math.round(numericValue / stepSize) * stepSize;
      }

      return numericValue;
    }

    // Handle user input: Format & validate number dynamically
    input.addEventListener("input", function (e) {
      let rawNumber = removeFormatting(e.target.value);
      let formattedNumber = parseFloat(rawNumber) || 0;

      // Apply live formatting
      e.target.value = formatCurrency(formattedNumber);

      // Update filing fee calculation
      calculateFilingFee(filingFeeCell, formattedNumber, cell);
    });

    // Handle blur (user clicking out of the field)
    function finalizeEdit() {
      let finalValue = enforceLimits(input.value);

      // Show the alert after the user clicks out, if conditions are met and the alert hasn’t been shown
      if (
        !cell.alertShown &&
        finalValue > maxValue &&
        finalValue < offeringMax
      ) {
        alert(
          `${stateName}'s maximum filing fee caps at ${formatCurrency(
            combinedMax
          )} when authorizing ${formatCurrency(
            maxValue
          )}. Consider authorizing the full offering amount for the same filing price.`
        );
        cell.alertShown = true;
      }

      // Restore formatted text
      cell.textContent = formatCurrency(finalValue);

      // Update calculations
      calculateFilingFee(filingFeeCell, finalValue, cell);

      // Cleanup: Remove input and restore cell styles
      cell.classList.remove("editing");
      cell.addEventListener("click", makeEditable, { once: true });
    }

    input.addEventListener("blur", finalizeEdit);

    // Allow Enter key to also finalize the edit
    input.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        input.blur();
      }
    });

    // Apply input to cell
    cell.textContent = "";
    cell.appendChild(input);
    input.focus();
    cell.removeEventListener("click", makeEditable);
  }

  // END NEW STUFF
  // Attach initial click listeners to editable cells
  document.querySelectorAll('.table_cell[is-input="true"]').forEach((cell) => {
    cell.addEventListener("click", makeEditable, { once: true });

    const initialFormattedValue = removeFormatting(cell.textContent.trim());
    cell.textContent = formatCurrency(initialFormattedValue);

    const filingFeeCell = cell.previousElementSibling;
    if (filingFeeCell) {
      calculateFilingFee(
        filingFeeCell,
        parseFloat(initialFormattedValue) || 0,
        cell
      );
    }
  });
});
