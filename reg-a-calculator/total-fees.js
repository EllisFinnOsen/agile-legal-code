document.addEventListener("DOMContentLoaded", function () {
  // Select all table caption elements and filing fee cells
  const captionElements = document.querySelectorAll(".table_caption");
  const filingFeeCells = document.querySelectorAll(
    ".table_row .table_cell:nth-child(3)"
  );

  function formatCurrency(value) {
    return `$${parseFloat(value).toLocaleString("en-US")}`;
  }

  function calculateTotalFilingFees() {
    let total = 0;

    // Sum up the values in all third cells of each table row
    filingFeeCells.forEach((cell) => {
      const value = parseFloat(cell.textContent.replace(/[$,\s]/g, "")) || 0;
      total += parseFloat(value.toFixed(2));
    });

    // Update each table_caption element with the formatted total
    captionElements.forEach((caption) => {
      caption.textContent = `Total Filing Fees: ${formatCurrency(total)}`;
    });
  }

  // Initial calculation on page load
  calculateTotalFilingFees();

  // Observe changes to each filing fee cell and update the total
  filingFeeCells.forEach((cell) => {
    const observer = new MutationObserver(calculateTotalFilingFees);
    observer.observe(cell, {
      characterData: true,
      childList: true,
      subtree: true,
    });
  });
});
