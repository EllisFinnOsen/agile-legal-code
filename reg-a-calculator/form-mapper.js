document.addEventListener("DOMContentLoaded", function () {
  console.log("Script loaded and ready.");

  // Utility function to clean formatting (remove only the $ sign)
  function cleanCurrency(value) {
    return value.replace(/\$/g, "").trim(); // Remove $ sign and trim whitespace
  }

  // Utility function to extract numbers from a string while keeping commas and decimals
  function extractNumber(value) {
    const match = value.match(/[\d,]+\.\d+|[\d,]+/); // Match numbers with optional commas and decimals
    return match ? cleanCurrency(match[0]) : ""; // Return the cleaned number or an empty string
  }

  // Select the button with id="is-open-download"
  const triggerButton = document.getElementById("is-open-download");

  if (!triggerButton) {
    console.error("Trigger button with ID 'is-open-download' not found.");
    return;
  }

  console.log("Trigger button found. Adding click event listener.");

  // Add a click event listener to the button
  triggerButton.addEventListener("click", function () {
    console.log("Trigger button clicked.");

    // Populate total filing fees field from the caption
    const captionElement = document.querySelector("caption.table_caption");
    const totalFilingFeesField = document.getElementById("total_filing_fees");

    if (captionElement && totalFilingFeesField) {
      const captionText = captionElement.textContent || "";
      const numericValue = extractNumber(captionText);
      totalFilingFeesField.value = numericValue;
      console.log(
        `Extracted number "${numericValue}" from caption and populated "total_filing_fees".`
      );
    } else {
      console.warn("Caption or total filing fees field not found.");
    }

    // Mapping of source IDs to target IDs for form fields
    const fieldMappings = {
      "is-total_offering": "total_offering_amount",
      "is-real-estate": "for_re_investments",
      "is-office-ny": "principal_office_in_NY",
      "has-filed-ny": "filed_NY_past_four_years",
      "is-broker-dealer": "engaged_broker_dealer",
      "is-issuer-dealer": "obtained_registration_NJ_TX_and_WA",
      "is-date": "map-date-field",
      "issuer-name-input": "Organization-Name",
    };

    // Copy form values
    for (const [sourceId, targetId] of Object.entries(fieldMappings)) {
      const sourceField = document.getElementById(sourceId);
      const targetField = document.getElementById(targetId);

      if (!sourceField) {
        console.warn(`Source field with ID "${sourceId}" not found.`);
        continue;
      }

      if (!targetField) {
        console.warn(`Target field with ID "${targetId}" not found.`);
        continue;
      }

      if (sourceField.type === "checkbox") {
        const valueToCopy = sourceField.checked ? "Yes" : "No";
        targetField.value = valueToCopy;
        console.log(
          `Copied value "${valueToCopy}" from "${sourceId}" to "${targetId}".`
        );
      } else {
        const rawValue = sourceField.value || "";
        const valueToCopy = cleanCurrency(rawValue);
        targetField.value = valueToCopy;
        console.log(
          `Copied cleaned value "${valueToCopy}" from "${sourceId}" to "${targetId}".`
        );
      }
    }

    // Map table values to modal fields
    const tableFieldMappings = {
      row_8_col_3: { jurisdiction: "Delaware", column: 3 },
      row_8_col_4: { jurisdiction: "Delaware", column: 4 },
      row_14_col_3: { jurisdiction: "Illinois", column: 3 },
      row_14_col_4: { jurisdiction: "Illinois", column: 4 },
      row_19_col_3: { jurisdiction: "Louisiana", column: 3 },
      row_19_col_4: { jurisdiction: "Louisiana", column: 4 },
      row_22_col_3: { jurisdiction: "Massachusetts", column: 3 },
      row_22_col_4: { jurisdiction: "Massachusetts", column: 4 },
      row_27_col_3: { jurisdiction: "Montana", column: 3 },
      row_27_col_4: { jurisdiction: "Montana", column: 4 },
      row_29_col_3: { jurisdiction: "Nevada", column: 3 },
      row_29_col_4: { jurisdiction: "Nevada", column: 4 },
      row_30_col_3: { jurisdiction: "New Hampshire", column: 3 },
      row_30_col_4: { jurisdiction: "New Hampshire", column: 4 },
      row_31_col_3: { jurisdiction: "New Jersey", column: 3 },
      row_31_col_4: { jurisdiction: "New Jersey", column: 4 },
      row_33_col_3: { jurisdiction: "New York", column: 3 },
      row_33_col_4: { jurisdiction: "New York", column: 4 },
      row_36_col_3: { jurisdiction: "Ohio", column: 3 },
      row_36_col_4: { jurisdiction: "Ohio", column: 4 },
      row_40_col_3: { jurisdiction: "Puerto Rico", column: 3 },
      row_40_col_4: { jurisdiction: "Puerto Rico", column: 4 },
      row_41_col_3: { jurisdiction: "Rhode Island", column: 3 },
      row_41_col_4: { jurisdiction: "Rhode Island", column: 4 },
      row_45_col_3: { jurisdiction: "Texas", column: 3 },
      row_45_col_4: { jurisdiction: "Texas", column: 4 },
      row_50_col_3: { jurisdiction: "Washington", column: 3 },
      row_50_col_4: { jurisdiction: "Washington", column: 4 },
    };

    // Loop through each row in the table and extract the values
    const tableRows = document.querySelectorAll(".table_row");
    Object.entries(tableFieldMappings).forEach(
      ([inputId, { jurisdiction, column }]) => {
        const targetInput = document.getElementById(inputId);
        if (!targetInput) {
          console.warn(`Target input with ID "${inputId}" not found.`);
          return;
        }

        let foundRow = false;
        tableRows.forEach((row) => {
          const jurisdictionCell = row.querySelector(".table_cell");
          if (
            jurisdictionCell &&
            jurisdictionCell.textContent.trim() === jurisdiction
          ) {
            const valueCell = row.querySelectorAll(".table_cell")[column - 1];
            if (valueCell) {
              const rawValue = valueCell.textContent.trim();
              const valueToCopy = cleanCurrency(rawValue);
              targetInput.value = valueToCopy;
              console.log(
                `Copied cleaned value "${valueToCopy}" from jurisdiction "${jurisdiction}" column ${column} to input "${inputId}".`
              );
              foundRow = true;
            }
          }
        });

        if (!foundRow) {
          console.warn(
            `No matching table row found for jurisdiction "${jurisdiction}".`
          );
        }
      }
    );

    console.log("All field values copied.");
  });
});
