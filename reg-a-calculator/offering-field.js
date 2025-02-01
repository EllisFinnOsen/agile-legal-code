const inputField = document.getElementById("is-total_offering");
const maxAllowedValue = 75000000; // Set max limit

// Function to update all matching cells on the page
function updateMaxOfferingCells(formattedValue) {
  const maxOfferingCells = document.querySelectorAll(
    '[is-max-offering="true"]'
  ); // Select all matching elements
  maxOfferingCells.forEach((cell) => {
    cell.textContent = `$${formattedValue}`;
  });
}

// Event listener for input field changes
inputField.addEventListener("input", function (e) {
  let value = e.target.value.replace(/,/g, ""); // Remove existing commas

  // Check if value exceeds max allowed value
  if (parseFloat(value) > maxAllowedValue) {
    value = maxAllowedValue; // Cap value at the maximum
    alert("The maximum allowed offering value is 75,000,000.");
  }

  if (!isNaN(value) && value !== "") {
    // Format the value with commas
    const numericValue = parseFloat(value).toFixed(1); // Fix to two decimal places
    const formattedValue = Number(numericValue).toLocaleString("en-US"); // Format with commas
    e.target.value = formattedValue;

    // Update all matching elements across the page with a $ prefix
    updateMaxOfferingCells(formattedValue);
  } else if (value === "") {
    // Clear input and all matching cells if the input is empty
    updateMaxOfferingCells("");
  }
});
