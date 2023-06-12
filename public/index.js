// const { response } = require("express");
const tableIDs = {
  employees: "employee_id",
  roles: "role_id",
  projects: "project_id",
};

// Object definitions
const submit = document.getElementById("submit");
const form = document.getElementById("dataform");

const table = document.getElementById("datatable");
const headerCells = table.querySelectorAll("th");
const tbody = table.querySelector("tbody");
const rows = tbody.getElementsByTagName("tr");

const searchInput = document.getElementById("searchInput");
const filterInputs = document.querySelectorAll("#input-row input");
const filterBtn = document.getElementById("filterToggleBtn");
const dataInfo = document.getElementById("dataInfo");
const pagination = document.getElementById("pagination");

const forminputs = document.getElementsByClassName("datainput");

var tableDataLength = 0;
let activeDropdown = null;
// ---------Functions---------

const findObjectByFirstKey = (array, value) =>
  array.find((obj) => obj[Object.keys(obj)[0]] === value);

function validate(element) {
  // console.log(element.value);
  if (
    (element.classList.contains("PRI") &&
      (element.value == "" || element.value == "NULL")) ||
    (element.classList.contains("YES") &&
      (element.value == "" || element.value == "NULL"))
  ) {
    return { bool: true, data: "DEFAULT" };
  }
  if (element.classList.contains("date")) {
    var newDate =
      element.value === undefined
        ? new Date(element.innerText)
        : element.value == ""
        ? new Date()
        : new Date(element.value);
    if (newDate == "Invalid Date") {
      return { bool: false, err: "Inavlid Date" };
    } else {
      return { bool: true, data: newDate.toISOString() };
    }
  }
  if (
    element.classList.contains("NO") &&
    (element.value == "" || element.value == "NULL") &&
    !element.classList.contains("PRI")
  ) {
    return { bool: false, err: "Field cannot be NULL" };
  }

  return {
    bool: true,
    data: element.value === undefined ? element.innerText : element.value,
  };
}

/**
 * Retrieves data from form on page
 * then passes it to the server through an POST call
 */
function addData() {
  event.preventDefault();
  const statuses = form.querySelectorAll(".error");
  statuses.forEach(function (status) {
    status.remove();
  });
  var newObject = {};
  for (let i = 0; i < forminputs.length; i++) {
    validateData = validate(forminputs[i]);
    if (validateData.bool) {
      newObject[forminputs[i].getAttribute("name")] = validateData.data;
    } else {
      const errorDiv = document.createElement("div");
      errorDiv.classList.add("error", "status");
      errorDiv.setAttribute("role", "alert");

      errorDiv.innerHTML = "<h3>❌ Error: " + validateData.err + "</h3>";
      forminputs[i].parentNode.insertBefore(
        errorDiv,
        forminputs[i].nextSibling
      );
      return;
    }
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
  })
    .then((response) => {
      if (!response.ok) {
        return response.text().then((error) => {
          throw new Error(error);
        });
      }

      form.reset();
      const pageSize = parseInt(
        document.getElementById("entriesDropdown").value
      );
      renderTable(pageSize, 1, 0);
    })
    .catch((error) => {
      const errorDiv = document.createElement("div");
      errorDiv.classList.add("error", "status");
      errorDiv.setAttribute("role", "alert");

      errorDiv.innerHTML = "<h3>❌ Error: " + error.message + "</h3>";
      form.appendChild(errorDiv);
    });
}

/**
 * This function updates the read of the data table
 * to be able to show only a limited amount of data at a time.
 * @param {number} pageSize The number of rows per page
 * @param {number} currentPage The current page index of pageSize rows to be shown
 */
function renderTable(pageSize, currentPage, sortIndex, ascending = true) {
  var page = table.className;
  const getData = fetch("/readData", {
    headers: {
      "Content-Type": "application/json",
      page: page,
    },
  })
    .then((response) => {
      // console.log(response)
      if (!response.ok) {
        throw new Error("Network response was not OK");
      }
      return response.json();
    })
    .then((data) => {
      console.log(document.getElementsByClassName("FKname"));
      var newQ =
        document.getElementsByClassName("FKname")[0] === undefined
          ? "employees"
          : document
              .getElementsByClassName("FKname")[0]
              .getAttribute("headers");
      // console.log(newQ);
      fetch("/custQuery", {
        headers: {
          "Content-Type": "application/json",
          query: "SELECT * FROM " + newQ + ";",
        },
      })
        .then((response) => {
          if (!response.ok) {
            return response.text().then((error) => {
              throw new Error(error);
            });
          }

          return response.json();
        })
        .then((fkdata) => {
          fkdata.sort(function (a, b) {
            var firstColA = parseFloat(a[Object.keys(a)[0]]);
            var firstColB = parseFloat(b[Object.keys(b)[0]]);
            return firstColA - firstColB;
          });
          var newQ =
            document.getElementsByClassName("FKname")[1] === undefined
              ? "projects"
              : document
                  .getElementsByClassName("FKname")[1]
                  .getAttribute("headers")
                  .includes("name")
              ? "projects"
              : document
                  .getElementsByClassName("FKname")[1]
                  .getAttribute("headers");
          // console.log(
          //   document.getElementsByClassName("FKname")[1] === undefined
          //     ? "projects"
          //     : document
          //         .getElementsByClassName("FKname")[1]
          //         .getAttribute("headers")
          //         .includes("name")
          // );
          fetch("/custQuery", {
            headers: {
              "Content-Type": "application/json",
              query: "SELECT * FROM " + newQ + ";",
            },
          })
            .then((response) => {
              if (!response.ok) {
                return response.text().then((error) => {
                  throw new Error(error);
                });
              }

              return response.json();
            })
            .then((fkdata1) => {
              fkdata1.sort(function (a, b) {
                var firstColA = parseFloat(a[Object.keys(a)[0]]);
                var firstColB = parseFloat(b[Object.keys(b)[0]]);
                return firstColA - firstColB;
              });
              // console.log(data);
              var rows = [];
              for (var i = 0; i < data.length; i++) {
                const row = document.createElement("tr");
                row.id = data[i][Object.keys(data[i])[0]];
                // Add table cells
                for (var key in data[i]) {
                  var newCell = document.createElement("td");
                  newCell.textContent = data[i][key];
                  if (document.getElementById(key).classList.contains("date")) {
                    newCell.textContent = newCell.textContent.split("T")[0];
                  } else if (
                    document.getElementById(key).classList.contains("datetime")
                  ) {
                    newCell.textContent =
                      newCell.textContent.split("T")[0] +
                      " " +
                      newCell.textContent.split("T")[1].split(".")[0];
                  }
                  newCell.setAttribute("headers", key);
                  document
                    .getElementById(key)
                    .classList.forEach((attribute) => {
                      newCell.classList.add(attribute);
                    });
                  row.appendChild(newCell);
                  if (document.getElementById(key).classList.contains("FK")) {
                    parentCell =
                      document.getElementById(key).nextSibling.nextSibling;

                    var fkCell = document.createElement("td");
                    fkCell.setAttribute("headers", parentCell.id);
                    parentCell.classList.forEach((attribute) => {
                      fkCell.classList.add(attribute);
                    });

                    // console.log(fkCells[i]);

                    // console.log(fkCell);
                    // for (var j = 1; j < fkCells.length; j++) {
                    // console.log(fkCell.innerText);
                    // if (fkCell.innerHTML == "") {
                    // console.log(fkdata);

                    var result = findObjectByFirstKey(fkdata, data[i][key]);
                    var result1 = findObjectByFirstKey(fkdata1, data[i][key]);
                    // console.log(result + " " + data[i][key]);
                    fkCell.innerText =
                      result === undefined ||
                      result[parentCell.id] === undefined
                        ? result1[parentCell.id]
                        : result[parentCell.id];
                    // break;
                    // }
                    // }

                    row.appendChild(fkCell);
                  }
                  // console.log(parentCell)
                }

                const removeCell = document.createElement("td");
                removeCell.innerHTML = "&#128465";
                removeCell.align = "center";
                removeCell.classList.add("removeicon");
                row.appendChild(removeCell);

                rows[i] = row;
                // console.log(row);
              }

              // const sortFn = (a, b) => {
              //   var keyA = Object.keys(a)[columnIndex];
              //   var keyB = Object.keys(b)[columnIndex];
              //   if ((isNaN(parseFloat(a[keyA])) ? a[keyA] : parseFloat(a[keyA])) < (isNaN(parseFloat(b[keyB])) ? b[keyB] : parseFloat(b[keyB]))) return ascending ? -1 : 1;
              //   if ((isNaN(parseFloat(a[keyA])) ? a[keyA] : parseFloat(a[keyA])) > (isNaN(parseFloat(b[keyB])) ? b[keyB] : parseFloat(b[keyB]))) return ascending ? 1 : -1;
              //   return 0; // If the values are equal
              // };
              const sortFn = (a, b) => {
                const cellA = isNaN(parseFloat(a.cells[sortIndex].textContent))
                  ? a.cells[sortIndex].textContent
                  : parseFloat(a.cells[sortIndex].textContent);
                const cellB = isNaN(parseFloat(b.cells[sortIndex].textContent))
                  ? b.cells[sortIndex].textContent
                  : parseFloat(b.cells[sortIndex].textContent);
                if (cellA < cellB) return ascending ? -1 : 1;
                if (cellA > cellB) return ascending ? 1 : -1;
                return 0;
              };
              rows.sort(sortFn);

              const filter = searchInput.value.toUpperCase();
              rowsToFilter = [];
              for (let i = 0; i < rows.length; i++) {
                let rowVisible = false;
                const cells = rows[i].childNodes;

                for (let j = 0; j < cells.length; j++) {
                  const cell = cells[j];
                  const cellValue = cell.textContent || cell.innerText;
                  if (filterInputs[j]) {
                    var colFilter = filterInputs[j].value.toUpperCase();
                  } else {
                    var colFilter = "";
                  }
                  // console.log(filterInputs[j].value.toUpperCase())

                  // if (cellValue.toUpperCase().indexOf(filter) > -1) {
                  //   rowVisible = true;
                  //   break;
                  // }
                  // const filterInputs = document.querySelectorAll("#input-row input");
                  // console.log(
                  //   "row " +
                  //     i +
                  //     " " +
                  //     cellValue.toUpperCase().indexOf(filter) +
                  //     " and " +
                  //     cellValue.toUpperCase().indexOf(colFilter)
                  // );
                  // console.log("col " + j + " filter " + colFilter)
                  if (cellValue.toUpperCase().indexOf(colFilter) == -1) {
                    rowVisible = false;
                    break;
                  } else if (cellValue.toUpperCase().indexOf(filter) > -1) {
                    rowVisible = true;
                  }
                }

                if (!rowVisible) {
                  rowsToFilter.unshift(i);
                }
              }
              for (var i = 0; i < rowsToFilter.length; i++) {
                console.log("Filtering row: " + rowsToFilter[i]);
                rows.splice(rowsToFilter[i], 1);
              }

              tbody.innerHTML = ""; // Clear existing table

              // Calculate the start and end index of the current page
              const startIndex = (currentPage - 1) * pageSize;
              const endIndex = startIndex + pageSize;

              // Iterate over the data and create table rows
              for (let i = startIndex; i < endIndex && i < rows.length; i++) {
                // const row = document.createElement("tr");
                // row.id = i;
                // // Add table cells
                // for (var key in data[i]) {
                //   var newCell = document.createElement("td");
                //   newCell.textContent = data[i][key];
                //   newCell.classList.add(key);
                //   row.appendChild(newCell);
                // }

                // const removeCell = document.createElement("td");
                // removeCell.innerHTML = "&#128465";
                // removeCell.align = "center";
                // removeCell.classList.add("removeicon");
                // row.appendChild(removeCell);

                // Add the row to the table
                tbody.appendChild(rows[i]);
                resizeTable();
              }

              // var fkCells = document.getElementsByClassName("FKname")
              // var parentCell = fkCells[0]
              // // console.log(fkCells[0].getAttribute("headers"))
              // for(var i = i; i < fkCells.length; i++) {
              // // fkCells.forEach(element => {
              //   console.log(fkCells[i]);
              //   fetch("/custQuery", {
              //     headers: {
              //       "Content-Type": "application/json",
              //       query:
              //         "SELECT " +
              //         parentCell.id +
              //         " FROM " +
              //         parentCell.getAttribute("headers") +
              //         " WHERE " +
              //         tableIDs[parentCell.getAttribute("headers")] +
              //         " = " +
              //         i +
              //         ";",
              //     },
              //   })
              //     .then((response) => {
              //       if (!response.ok) {
              //         return response.text().then((error) => {
              //           throw new Error(error);
              //         });
              //       }

              //       return response.json();
              //     })
              //     .then((fkdata) => {
              //       console.log(fkdata[0][parentCell.id]);
              //       for(var j = 1; j < fkCells.length; j++) {
              //         console.log(fkCells[j].innerText)
              //         if (fkCells[j].innerHTML==''){
              //           fkCells[j].innerText = fkdata[0][parentCell.id]
              //           break;
              //         }
              //       }
              //     })
              //     .catch((error) => {
              //       console.log(error);
              //     });
              // }

              // Update data info
              const startInfo = startIndex + 1;
              const endInfo = Math.min(endIndex, data.length);
              dataInfo.textContent = `${startInfo} to ${endInfo} of ${data.length}`;

              pagination.innerHTML = ""; // Clear existing pagination

              // Calculate the total number of pages
              const totalPages = Math.ceil(data.length / pageSize);
              // console.log(data.length + " / " + pageSize + " = " + totalPages);
              // Create pagination buttons
              for (let i = 1; i <= totalPages; i++) {
                // console.log("page making");
                const button = document.createElement("button");
                button.textContent = i;
                button.addEventListener("click", handlePaginationNavigation);
                pagination.appendChild(button);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      // Handle any errors that occurred during the request
      console.error("Error:", error);
    });
}

// Function to handle entries per page change
function handleEntriesPerPageChange() {
  const pageSize = parseInt(this.value);
  const currentPage = 1;
  renderTable(pageSize, currentPage, 0);
  // renderPagination(pageSize, currentPage);
}

// Function to handle pagination navigation
function handlePaginationNavigation() {
  const pageSize = parseInt(document.getElementById("entriesDropdown").value);
  const currentPage = parseInt(this.textContent);
  renderTable(pageSize, currentPage, 0);
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
      if (
        event.target.parentNode.parentNode.parentNode.className == "employees"
      ) {
        const terminate = confirm(
          "Are you sure you want to mark " +
            event.target.parentNode.querySelector("td[headers='name']")
              .innerText +
            " as inactive? You cannot delete old employees, only mark them as inactive."
        );
        if (terminate) {
          fetch("/editData", {
            method: "POST",
            body: JSON.stringify({
              pageID:
                event.target.parentNode.firstChild.getAttribute("headers"),
              index: event.target.parentNode.id,
              page: event.target.parentNode.parentNode.parentNode.className,
              key: "employee_status",
              newString: "4",
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }).then((response) => {
            const pageSize = parseInt(
              document.getElementById("entriesDropdown").value
            );
            renderTable(pageSize, 1, 0);
          });
        }
        return;
      }
      if (
        event.target.parentNode.parentNode.parentNode.className == "projects"
      ) {
        const terminate = confirm(
          "Are you sure you want to mark " +
            event.target.parentNode.querySelector("td[headers='project_name']")
              .innerText +
            " as inactive?"
        );
        if (terminate) {
          fetch("/editData", {
            method: "POST",
            body: JSON.stringify({
              pageID:
                event.target.parentNode.firstChild.getAttribute("headers"),
              index: event.target.parentNode.id,
              page: event.target.parentNode.parentNode.parentNode.className,
              key: "is_ongoing",
              newString: "0",
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }).then((response) => {
            const pageSize = parseInt(
              document.getElementById("entriesDropdown").value
            );
            renderTable(pageSize, 1, 0);
          });
        }
        return;
      }
      const deleteRow = confirm(
        "Are you sure you want to delete row " +
          event.target.parentNode.id +
          "? This action cannot be undone."
      );
      if (deleteRow) {
        fetch("/removeData", {
          method: "POST",
          body: JSON.stringify({
            pageID: event.target.parentNode.firstChild.getAttribute("headers"),
            index: event.target.parentNode.id,
            page: event.target.parentNode.parentNode.parentNode.className,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            if (!response.ok) {
              return response.text().then((error) => {
                throw new Error(error);
              });
            }

            table.deleteRow(parseInt(event.target.parentNode.rowIndex));
          })
          .catch((error) => {
            const errorDiv = document.createElement("div");
            errorDiv.classList.add("error", "status");
            errorDiv.setAttribute("role", "alert");

            errorDiv.innerHTML = "<h3>❌ Error: " + error.message + "</h3>";
            form.appendChild(errorDiv);
          });
      }
    }
  }
});

table.addEventListener("mouseover", function () {
  var cells = tbody.querySelectorAll("td");
  for (
    let i = 0;
    i < cells.length; //8 * parseInt(document.getElementById("entriesDropdown").value);
    i++
  ) {
    const cell = cells[i];
    if (
      cell.classList.contains("PRI") ||
      cell.classList.contains("removeicon") ||
      cell.classList.contains("FKname")
    ) {
      continue;
    }

    cell.addEventListener("mouseover", () => {
      cell.classList.add("editing");
    });

    cell.addEventListener("mouseout", () => {
      cell.classList.remove("editing");
    });

    cell.addEventListener("dblclick", () => {
      // console.log(
      //   activeDropdown +
      //     " " +
      //     !!activeDropdown +
      //     " " +
      //     (activeDropdown ? activeDropdown.parentNode == cell : null)
      // );
      if (activeDropdown && activeDropdown.parentNode != cell) {
        activeDropdown.parentNode.innerText = activeDropdown.value;
        activeDropdown.remove(); // Remove the previously opened dropdown
        activeDropdown = null;
      }
      if (cell.classList.contains("FK")) {
        const originalText = cell.innerText;
        const dropdown = activeDropdown
          ? activeDropdown.parentNode == cell
            ? activeDropdown
            : document.querySelector("select." + cell.headers).cloneNode(true)
          : document.querySelector("select." + cell.headers).cloneNode(true);
        // console.log(dropdown);
        activeDropdown = dropdown; // Set the active dropdown
        for (let option of dropdown.children) {
          // console.log(originalText);
          if (option.value === "") {
            option.remove();
          }
          if (option.value === originalText) {
            option.selected = "selected";
            break;
          }
        }
        cell.innerHTML = "";
        cell.appendChild(dropdown);
        dropdown.addEventListener("change", function () {
          const selectedOption = this.value; // Get the selected option

          // Store the selected option as text in the cell
          cell.innerText = selectedOption;

          activeDropdown = null; // Reset the active dropdown

          // Remove the dropdown
          this.remove();
          editData("dropdown");
          const pageSize = parseInt(
            document.getElementById("entriesDropdown").value
          );
          renderTable(pageSize, 1, 0);
        });
        dropdown.focus();
        // console.log("here");
        activeDropdown = dropdown; // Set the active dropdown
      } else {
        cell.contentEditable = "true";
        cell.focus();
      }
    });

    cell.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && cell.isContentEditable) {
        event.preventDefault();
        editData("enter");
      }
    });

    cell.addEventListener("blur", (event) => {
      if (cell.isContentEditable) {
        editData("blur");
      }
    });

    function editData(debugstr) {
      console.log(debugstr);
      var validateData = validate(cell);
      if (validateData.bool) {
        cell.contentEditable = "false";
        cell.classList.remove("editing");
        fetch("/editData", {
          method: "POST",
          body: JSON.stringify({
            pageID: cell.parentNode.firstChild.getAttribute("headers"),
            index: cell.parentNode.id,
            key: cell.getAttribute("headers"),
            newString: validateData.data,
            page: cell.parentNode.parentNode.parentNode.className,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        cell.contentEditable = "false";
        cell.classList.remove("editing");
        fetch("/custQuery", {
          headers: {
            "Content-Type": "application/json",
            query:
              "SELECT " +
              cell.getAttribute("headers") +
              " FROM " +
              cell.parentNode.parentNode.parentNode.className +
              " WHERE " +
              cell.parentNode.firstChild.getAttribute("headers") +
              " = " +
              cell.parentNode.id,
          },
        })
          .then((response) => {
            if (!response.ok) {
              return response.text().then((error) => {
                throw new Error(error);
              });
            }

            return response.json();
          })
          .then((data) => {
            alert("Error: " + validateData.err);
            cell.innerText = data[0][cell.getAttribute("headers")];
          })
          .catch((error) => {
            const errorDiv = document.createElement("div");
            errorDiv.classList.add("error", "status");
            errorDiv.setAttribute("role", "alert");

            errorDiv.innerHTML = "<h3>❌ Error: " + error.message + "</h3>";
            table.appendChild(errorDiv);
          });
      }
      // location.reload();
    }
  }
});

searchInput.addEventListener("keyup", function () {
  // var sortIndex = 0;
  // var sortasc = true;
  // headerCells.forEach((cell, index) => {
  //   if (cell.classList.contains("sorted-asc") || cell.classList.contains("sorted-desc")){
  //     sortasc = !cell.classList.contains("sorted-asc");
  //     sortIndex = index;
  //   }
  // });
  const pageSize = parseInt(document.getElementById("entriesDropdown").value);
  renderTable(pageSize, 1, 0);
  // const filter = searchInput.value.toUpperCase();

  // for (let i = 0; i < rows.length; i++) {
  //   let rowVisible = false;
  //   const cells = rows[i].getElementsByTagName("td");

  //   for (let j = 0; j < cells.length; j++) {
  //     const cell = cells[j];
  //     const cellValue = cell.textContent || cell.innerText;

  //     if (cellValue.toUpperCase().indexOf(filter) > -1) {
  //       rowVisible = true;
  //       break;
  //     }
  //   }

  //   rows[i].style.display = rowVisible ? "" : "none";
  // }
});

// Attach event listeners to each input element
filterInputs.forEach((input) => {
  input.addEventListener("keyup", function () {
    // console.log("keyup " + index)
    const pageSize = parseInt(document.getElementById("entriesDropdown").value);
    renderTable(pageSize, 1, 0);

    // // Get the value entered in the filter input
    // const filterValue = input.value.toLowerCase();

    // // Get the index of the corresponding column
    // const columnIndex = index + 1; // Add 1 to skip the first column

    // // Get all the cells in the table body of the corresponding column
    // const cells = document.querySelectorAll(
    //   `tbody td:nth-child(${columnIndex})`
    // );

    // // Loop through each cell and hide/show based on the filter value
    // cells.forEach((cell) => {
    //   const cellText = cell.textContent.toLowerCase();
    //   if (cellText.includes(filterValue)) {
    //     cell.parentNode.style.display = "";
    //   } else {
    //     cell.parentNode.style.display = "none";
    //   }
    // });
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

  var filterRow = document.getElementById("input-row");
  const filtered = filterRow.classList.contains("d-hidden");
  filterRow.classList.toggle("d-hidden", true);

  // Iterate over each column
  for (var i = 0; i < tablerows[0].cells.length; i++) {
    var maxWidth = 0;

    // Iterate over each row in the column
    for (var j = 0; j < tablerows.length; j++) {
      var cell = tablerows[j].cells[i];
      // console.log(cell)
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
      // console.log("Row " + j + " coloumn " + i + " wdith " + cellWidth);
    }

    maxWidths.push(maxWidth);
  }
  // console.log(maxWidths);
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
  filterRow.classList.toggle("d-hidden", filtered);
}

window.onresize = resizeTable;

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
