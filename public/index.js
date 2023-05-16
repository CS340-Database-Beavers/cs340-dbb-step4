// var employeeData = require("../json/employeeData.json")

function addData() {
  const forminputs = document.getElementsByClassName("datainput");
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

submit = document.getElementById("submit");

submit.addEventListener("click", () => addData());

removeEmployee = document.getElementById("datatable");

removeEmployee.addEventListener("click", function (event) {
  if (event.target.classList.contains("removeicon")) {
    if (removeEmployee.rows.length <= 2) {
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
      removeEmployee.deleteRow(parseInt(event.target.parentNode.id) + 1);
    }
  }
});

const cells = document.querySelectorAll("td");

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

const table = document.getElementById("datatable");
const tbody = table.querySelector("tbody");

const sortTable = (columnIndex, ascending = true) => {
  const rows = Array.from(tbody.querySelectorAll("tr"));
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

const headerCells = table.querySelectorAll("th");
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
    sortTable(sortIndex, ascending);
  });
});




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



// // Get table elements
// const dataInfo = document.getElementById('dataInfo');
// const pagination = document.getElementById('pagination');

// // Function to render the table
// function renderTable(pageSize, currentPage) {
//   table.innerHTML = ''; // Clear existing table

//   // Calculate the start and end index of the current page
//   const startIndex = (currentPage - 1) * pageSize;
//   const endIndex = startIndex + pageSize;

//   // Iterate over the data and create table rows
//   for (let i = startIndex; i < endIndex && i < data.length; i++) {
//     const row = document.createElement('tr');

//     // Add table cells
//     const idCell = document.createElement('td');
//     idCell.textContent = data[i].id;
//     row.appendChild(idCell);

//     const nameCell = document.createElement('td');
//     nameCell.textContent = data[i].name;
//     row.appendChild(nameCell);

//     const ageCell = document.createElement('td');
//     ageCell.textContent = data[i].age;
//     row.appendChild(ageCell);

//     // Add the row to the table
//     table.appendChild(row);
//   }

//   // Update data info
//   const startInfo = startIndex + 1;
//   const endInfo = Math.min(endIndex, data.length);
//   dataInfo.textContent = `${startInfo} to ${endInfo} of ${data.length}`;
// }

// // Function to handle entries per page change
// function handleEntriesPerPageChange() {
//   const pageSize = parseInt(this.value);
//   const currentPage = 1;
//   renderTable(pageSize, currentPage);
//   renderPagination(pageSize, currentPage);
// }

// // Function to handle pagination navigation
// function handlePaginationNavigation() {
//   const pageSize = parseInt(document.getElementById('entriesDropdown').value);
//   const currentPage = parseInt(this.textContent);
//   renderTable(pageSize, currentPage);
//   renderPagination(pageSize, currentPage);
// }

// // Function to render pagination
// function renderPagination(pageSize, currentPage) {
//   pagination.innerHTML = ''; // Clear existing pagination

//   // Calculate the total number of pages
//   const totalPages = Math.ceil(data.length / pageSize);

//   // Create pagination buttons
//   for (let i = 1; i <= totalPages; i++) {
//     const button = document.createElement('button');
//     button.textContent = i;
//     button.addEventListener('click', handlePaginationNavigation);
//     pagination.appendChild(button);
//   }
// }

// Add event listeners
// document.getElementById('entriesDropdown').addEventListener('change', handleEntriesPerPageChange);
// document.getElementById('filterToggleBtn').addEventListener('click', toggleFilterRow);

// // Initial render
// const initialPageSize = 10;
// const initialCurrentPage = 1;
// renderTable(initialPageSize, initialCurrentPage);
// renderPagination(initialPageSize, initialCurrentPage);
