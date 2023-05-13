// var employeeData = require("../json/employeeData.json")

function addData() {
  const forminputs = document.getElementsByClassName("datainput")
  var newObject = {}
  for(let i = 0; i < forminputs.length; i++){
    newObject[forminputs[i].id] = forminputs[i].value
  }
  fetch("/addEmployeeData", {
    method: "POST",
    body: JSON.stringify(newObject),
    page: document.getElementById("dataform").className,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

employeeSubmit = document.getElementById("employeeSubmit");

employeeSubmit.addEventListener("click", () => addData());

removeEmployee = document.getElementById("datatable");

removeEmployee.addEventListener("click", function (event) {
  if (event.target.classList.contains("removeicon")) {
    if (removeEmployee.rows.length <= 2) {
      alert("You must have at least one Employee in the table");
    } else {
      fetch("/removeEmployeeData", {
        method: "POST",
        body: JSON.stringify({
          index: event.target.parentNode.id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      removeEmployee.deleteRow(parseInt(event.target.parentNode.id)+1);
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
      editEmployeeData();
    }
  });

  cell.addEventListener("blur", () => editEmployeeData());

  function editEmployeeData() {
    cell.contentEditable = "false";
    cell.classList.remove("editing");
    fetch("/editEmployeeData", {
      method: "POST",
      body: JSON.stringify({
        index: cell.parentNode.id,
        key: cell.className,
        newString: cell.textContent,
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
