function calculateFilingFee() {
  // Get the checkbox values
  const isRealEstate = document.getElementById("is-real-estate").checked; // true if "Yes"
  const isOfficeNY = document.getElementById("is-office-ny").checked; // true if "Yes"
  const hasFiledNY = document.getElementById("has-filed-ny").checked; // true if "Yes"

  console.log("isRealEstate checked:", isRealEstate);
  console.log("isOfficeNY checked:", isOfficeNY);
  console.log("hasFiledNY checked:", hasFiledNY);

  let filingFee = 0;

  // Apply the condition for the "hasFiledNY" question
  if (hasFiledNY) {
    console.log(
      "Issuer has filed in NY in the past four years. No filing fee."
    );
    filingFee = null; // Use null to represent no fee
  } else {
    if (!isRealEstate) {
      // Equivalent to E5="No"
      console.log("Real estate investment is No. Base filing fee: $1200");
      filingFee += 1200;

      if (isOfficeNY === false) {
        // Equivalent to E6="No"
        console.log(
          "Issuer's office is not in New York. Adding $35 to filing fee."
        );
        filingFee += 35;
      } else {
        console.log("Issuer's office is in New York. No additional fee.");
      }
    } else {
      // Equivalent to E5="Yes"
      console.log(
        "Real estate investment is Yes. Filing fee is set to $1950 + $150."
      );
      filingFee += 1950 + 150;
    }
  }

  // Determine display text for the filing fee
  const displayFee = filingFee === null ? "$-" : `$${filingFee.toFixed(0)}`;

  // Display the calculated filing fee
  document.getElementById(
    "filing-fee"
  ).textContent = `New York Filing Fee: ${displayFee}`;

  // Update all table cells with is-newyork-filing="true"
  const newYorkFilingCells = document.querySelectorAll(
    '[is-newyork-filing="true"]'
  );
  newYorkFilingCells.forEach((cell) => {
    cell.textContent = displayFee;
  });
}

// Attach event listeners to checkboxes to recalculate on change
document
  .getElementById("is-real-estate")
  .addEventListener("change", calculateFilingFee);
document
  .getElementById("is-office-ny")
  .addEventListener("change", calculateFilingFee);
document
  .getElementById("has-filed-ny")
  .addEventListener("change", calculateFilingFee);

// Initial calculation on page load
calculateFilingFee();
