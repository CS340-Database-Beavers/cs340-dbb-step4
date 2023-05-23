/*
    SETUP for a simple webapp
*/
// Express
var fs = require("fs");
var express = require("express"); // We are using the express library for the web server
var exphbs = require("express-handlebars");
var app = express(); // We need to instantiate an express object to interact with the server in our code
PORT = process.env.PORT || 4221; // Set a port number at the top so it's easy to change in the future
// Database
var db = require("./db-connector");
var employeeData = require("./json/employeeData.json");
var roleData = require("./json/roleData.json");
var salaryData = require("./json/salaryData.json");
var projectData = require("./json/projectData.json");
var employeesProjectsData = require("./json/employeesProjectsData.json");
const data = {
  employee: employeeData,
  project: projectData,
  role: roleData,
  salary: salaryData,
};
var mainDir = require("./json/mainDir.json");
//Handlebars
app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.json());
app.use("/public", express.static("./public/"));
/*
    ROUTES
*/
app.get("/", function (req, res) {
  res.status(200).render("mainPage", { mainDirData: mainDir });
});

app.get("/readData", function (req, res, next) {
  try{
    res.header("Content-Type",'application/json')
    res.status(200).send(JSON.stringify(data['employee']));
  } catch(err) {
    res.status(500).send("Failed to read data: " + err);
  }
});

app.post("/addData", function (req, res, next) {
  data[req.body.page].push(req.body.newData);
  var addDataPath = "./json/" + req.body.page + "Data.json";
  fs.writeFile(
    addDataPath,
    JSON.stringify(data[req.body.page], null, 2),
    function (err) {
      if (err) {
        res.status(500).send("Failed to store new data.");
      } else {
        res.status(200).send("New data successfully stored.");
      }
    }
  );
});

app.post("/removeData", function (req, res, next) {
  data[req.body.page].splice(parseInt(req.body.index), 1);
  var addDataPath = "./json/" + req.body.page + "Data.json";
  fs.writeFile(
    addDataPath,
    JSON.stringify(data[req.body.page], null, 2),
    function (err) {
      if (err) {
        res.status(500).send("Failed to delete data point.");
      } else {
        res.status(200).send("Data successfully deleted.");
      }
    }
  );
});

app.post("/editData", function (req, res, next) {
  data[req.body.page][req.body.index][req.body.key] = req.body.newString;
  var addDataPath = "./json/" + req.body.page + "Data.json";
  fs.writeFile(
    addDataPath,
    JSON.stringify(data[req.body.page], null, 2),
    function (err) {
      if (err) {
        res.status(500).send("Failed to update data.");
      } else {
        res.status(200).send("Data updated successfully deleted.");
      }
    }
  );
});

app.get("/employee*-project*", function (req, res) {
  res.status(200).render("employeesProjects", {
    employeesProjectsData: employeesProjectsData,
    mainDirData: mainDir,
  });
});

app.get("/*employee*", function (req, res) {
  res
    .status(200)
    .render("employee", { employeeData: employeeData, mainDirData: mainDir });
});

app.get("/*project*", function (req, res) {
  res
    .status(200)
    .render("project", { projectData: projectData, mainDirData: mainDir });
});

app.get("/*salary", function (req, res) {
  res
    .status(200)
    .render("salary", { salaryData: salaryData, mainDirData: mainDir });
});

app.get("/*role*", function (req, res) {
  res.status(200).render("role", { roleData: roleData, mainDirData: mainDir });
});

app.get("*", function (req, res) {
  res.status(404).render("404", { mainDirData: mainDir });
});

app.listen(PORT, function (err) {
  if (err) throw err;
  console.log("== Server is listening on port", PORT);
});
