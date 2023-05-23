// const { response } = require("express");

// Object definitions
const submit = document.getElementById("submit");

const table = document.getElementById("datatable");
const headerCells = table.querySelectorAll("th");
const tbody = table.querySelector("tbody");
const rows = tbody.getElementsByTagName("tr");
const cells = tbody.querySelectorAll("td");

const searchInput = document.getElementById("searchInput");
const filterInputs = document.querySelectorAll("#input-row input");
const filterBtn = document.getElementById("filterToggleBtn");
const dataInfo = document.getElementById("dataInfo");
const pagination = document.getElementById("pagination");
const forminputs = document.getElementsByClassName("datainput");

var tableDataLength = 0;
// ---------Functions---------

/**
 * Retrieves data from form on page
 * then passes it to the server through an POST call
 */
function addData() {
  var newObject = {};
  for (let i = 0; i < forminputs.length; i++) {
    newObject[forminputs[i].id] = forminputs[i].value;
  }
  fetch("/addData", {
    method: "POST",
    body: JSON.stringify({
      page: document.getElementById("dataform").className,
      newData: newObject,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * This function updates the read of the data table
 * to be able to show only a limited amount of data at a time.
 * @param {number} pageSize The number of rows per page
 * @param {number} currentPage The current page index of pageSize rows to be shown
 */
function renderTable(pageSize, currentPage, columnIndex, ascending = true) {
  const getData = fetch("/readData", {
    headers: {
      "Content-Type": "application/json",
      page: JSON.stringify(table.className),
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.length);

      const sortFn = (a, b) => {
        var keyA = Object.keys(a)[columnIndex]; 
        var keyB = Object.keys(b)[columnIndex]; 
        if ((isNaN(parseFloat(a[keyA])) ? a[keyA] : parseFloat(a[keyA])) < (isNaN(parseFloat(b[keyB])) ? b[keyB] : parseFloat(b[keyB]))) return ascending ? -1 : 1;
        if ((isNaN(parseFloat(a[keyA])) ? a[keyA] : parseFloat(a[keyA])) > (isNaN(parseFloat(b[keyB])) ? b[keyB] : parseFloat(b[keyB]))) return ascending ? 1 : -1;
        return 0; // If the values are equal
      };
      data.sort(sortFn);
      tbody.innerHTML = ""; // Clear existing table

      // Calculate the start and end index of the current page
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;

      // Iterate over the data and create table rows
      for (let i = startIndex; i < endIndex && i < data.length; i++) {
        const row = document.createElement("tr");
        row.id = i;
        // Add table cells
        for (var key in data[i]) {
          var newCell = document.createElement("td");
          newCell.textContent = data[i][key];
          newCell.classList.add(key);
          row.appendChild(newCell);
        }

        const removeCell = document.createElement("td");
        removeCell.innerHTML = "&#128465";
        removeCell.align = "center";
        removeCell.classList.add("removeicon");
        row.appendChild(removeCell);

        // Add the row to the table
        tbody.appendChild(row);
        resizeTable();
      }

      // Update data info
      const startInfo = startIndex + 1;
      const endInfo = Math.min(endIndex, data.length);
      dataInfo.textContent = `${startInfo} to ${endInfo} of ${data.length}`;

      pagination.innerHTML = ""; // Clear existing pagination

      // Calculate the total number of pages
      const totalPages = Math.ceil(data.length / pageSize);
      console.log(data.length + " / " + pageSize + " = " + totalPages);
      // Create pagination buttons
      for (let i = 1; i <= totalPages; i++) {
        console.log("page making");
        const button = document.createElement("button");
        button.textContent = i;
        button.addEventListener("click", handlePaginationNavigation());
        pagination.appendChild(button);
      }
    });
}

// Function to handle entries per page change
function handleEntriesPerPageChange() {
  const pageSize = parseInt(this.value);
  const currentPage = 1;
  // renderTable(pageSize, currentPage);
  // renderPagination(pageSize, currentPage);
}

// Function to handle pagination navigation
function handlePaginationNavigation() {
  const pageSize = parseInt(document.getElementById("entriesDropdown").value);
  const currentPage = parseInt(this.textContent);
  // renderTable(pageSize, currentPage);
  // renderPagination(pageSize, currentPage);
}

// Function to render pagination
// function renderPagination(pageSize, currentPage) {
//   pagination.innerHTML = ''; // Clear existing pagination

//   // Calculate the total number of pages
//   const totalPages = Math.ceil(tableDataLength / pageSize);
//   console.log(tableDataLength + ' / ' + pageSize + ' = ' + totalPages)
//   // Create pagination buttons
//   for (let i = 1; i <= totalPages; i++) {
//     console.log("page making")
//     const button = document.createElement('button');
//     button.textContent = i;
//     button.addEventListener('click', handlePaginationNavigation());
//     pagination.appendChild(button);
//   }
// }

/**
 * Function to sort data table by a certain column
 * @param {number} columnIndex Column index to sort table by
 * @param {boolean} ascending Is ascending, true or false
 */
const sortTable = (columnIndex, ascending = true) => {
  const rows = Array.from(tbody.querySelectorAll("tr"));
  console.log(rows);
  const sortFn = (a, b) => {
    const cellA = a.cells[columnIndex].textContent;
    const cellB = b.cells[columnIndex].textContent;
    if (cellA < cellB) return ascending ? -1 : 1;
    if (cellA > cellB) return ascending ? 1 : -1;
    return 0;
  };
  rows.sort(sortFn);
  rows.forEach((row) => tbody.removeChild(row));
  rows.forEach((row) => tbody.appendChild(row));
};

// ---------Event listeners---------
submit.addEventListener("click", () => addData());

table.addEventListener("click", function (event) {
  if (event.target.classList.contains("removeicon")) {
    if (table.rows.length <= 2) {
      alert("You must have at least one row in the table");
    } else {
      fetch("/removeData", {
        method: "POST",
        body: JSON.stringify({
          index: event.target.parentNode.id,
          page: event.target.parentNode.parentNode.parentNode.className,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      table.deleteRow(parseInt(event.target.parentNode.id) + 1);
    }
  }
});

for (let i = 0; i < cells.length; i++) {
  const cell = cells[i];
  if (cell.classList.contains("ID") || cell.classList.contains("removeicon")) {
    continue;
  }

  cell.addEventListener("mouseover", () => {
    cell.classList.add("editing");
  });

  cell.addEventListener("mouseout", () => {
    cell.classList.remove("editing");
  });

  cell.addEventListener("dblclick", () => {
    cell.contentEditable = "true";
    cell.focus();
  });

  cell.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      editData();
    }
  });

  cell.addEventListener("blur", () => editData());

  function editData() {
    cell.contentEditable = "false";
    cell.classList.remove("editing");
    fetch("/editData", {
      method: "POST",
      body: JSON.stringify({
        index: cell.parentNode.id,
        key: cell.className,
        newString: cell.textContent,
        page: cell.parentNode.parentNode.parentNode.className,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    // location.reload();
  }
}

searchInput.addEventListener("keyup", function () {
  const filter = searchInput.value.toUpperCase();

  for (let i = 0; i < rows.length; i++) {
    let rowVisible = false;
    const cells = rows[i].getElementsByTagName("td");

    for (let j = 0; j < cells.length; j++) {
      const cell = cells[j];
      const cellValue = cell.textContent || cell.innerText;

      if (cellValue.toUpperCase().indexOf(filter) > -1) {
        rowVisible = true;
        break;
      }
    }

    rows[i].style.display = rowVisible ? "" : "none";
  }
});

// Attach event listeners to each input element
filterInputs.forEach((input, index) => {
  input.addEventListener("input", () => {
    // Get the value entered in the filter input
    const filterValue = input.value.toLowerCase();

    // Get the index of the corresponding column
    const columnIndex = index + 1; // Add 1 to skip the first column

    // Get all the cells in the table body of the corresponding column
    const cells = document.querySelectorAll(
      `tbody td:nth-child(${columnIndex})`
    );

    // Loop through each cell and hide/show based on the filter value
    cells.forEach((cell) => {
      const cellText = cell.textContent.toLowerCase();
      if (cellText.includes(filterValue)) {
        cell.parentNode.style.display = "";
      } else {
        cell.parentNode.style.display = "none";
      }
    });
  });
});

headerCells.forEach((cell, index) => {
  cell.addEventListener("click", () => {
    const ascending = !cell.classList.contains("sorted-asc");
    const descending = !cell.classList.contains("sorted-desc");
    var sortIndex = index;
    headerCells.forEach((header) =>
      header.classList.remove("sorted-asc", "sorted-desc")
    );
    if (ascending && !descending) {
      sortIndex = 0;
    }
    cell.classList.toggle("sorted-asc", ascending && descending);
    cell.classList.toggle("sorted-desc", !ascending);
    const pageSize = parseInt(document.getElementById("entriesDropdown").value);
    renderTable(pageSize, 1, sortIndex, ascending);
  });
});

function resizeTable() {
  var tablerows = table.getElementsByTagName("tr");

  var maxWidths = [];

  // Iterate over each column
  for (var i = 0; i < tablerows[0].cells.length; i++) {
    var maxWidth = 0;

    // Iterate over each row in the column
    for (var j = 0; j < tablerows.length; j++) {
      var cell = tablerows[j].cells[i];
      var cellWidth = cell.offsetWidth;

      // Check if the cell contains an input field
      var inputField = cell.querySelector('input[type="text"]');
      if (inputField) {
        cellWidth = inputField.offsetWidth;
      }

      // Update the maximum width if necessary
      if (cellWidth > maxWidth) {
        maxWidth = cellWidth - 20;
        // maxWidth = "20px"
      }
      console.log("Row " + j + " coloumn " + i + " wdith " + cellWidth);
    }

    maxWidths.push(maxWidth);
  }
  console.log(maxWidths);
  // Set the width of each input cell in each column
  for (var i = 0; i < tablerows.length; i++) {
    var cells = tablerows[i].getElementsByTagName("td");

    for (var j = 0; j < cells.length; j++) {
      var inputField = cells[j].querySelector('input[type="text"]');
      if (inputField) {
        inputField.style.width = maxWidths[j] + "px";
      }
    }
  }
}

filterBtn.addEventListener("click", function () {
  var filterRow = document.getElementById("input-row");
  const filtered = !filterRow.classList.contains("d-hidden");
  filterRow.classList.toggle("d-hidden", filtered);
});

document
  .getElementById("entriesDropdown")
  .addEventListener("change", handleEntriesPerPageChange);
// document.getElementById('filterToggleBtn').addEventListener('click', toggleFilterRow);

/**
//  * Retrieves input data from a form and returns it as a JSON object.
//  * @param  {HTMLFormControlsCollection} elements  the form elements
//  * @return {Object}                               form data as an object literal
//  */
// const formToJSON = (elements) =>
//   [].reduce.call(
//     elements,
//     (data, element) => {
//       data[element.name] = element.value;
//       return data;
//     },
//     {}
//   );

// /**
//  * A handler function to prevent default submission and run our custom script.
//  * @param  {Event} event  the submit event triggered by the user
//  * @return {void}
//  */
// const handleFormSubmit = (event) => {
//   // Stop the form from submitting since we’re handling that with AJAX.
//   event.preventDefault();

//   // Call our function to get the form data.
//   const data = formToJSON(form.elements);

//   // ...this is where we’d actually do something with the form data...
//   console.log(data)
//   fetch("/addEmployeeData", {
//     method: "POST",
//     body: data,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
// };

// const form = document.getElementsByTagName("form")[0];
// form.addEventListener("submit", handleFormSubmit);

// Initial render
const initialPageSize = 10;
const initialCurrentPage = 1;
renderTable(initialPageSize, initialCurrentPage, 0);
// renderPagination(initialPageSize, initialCurrentPage);
