const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./db/courses.db");

const app = express();
const port = 3000;
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true}));

// Visa alla kurser (Startsida)
app.get("/", (req, res) => {
    res.render("index"); // Renderar index.ejs
});

// Lägg till en ny kurs
app.get("/add", (req, res) => {
    res.render("add", {
        error: ""
    }); // Renderar add.ejs (lägg till kurs-formulär)
});

// Om sidan
app.get("/about", (req, res) => {
    res.render("about"); // Renderar about.ejs (om sidan)
});

app.post("/add", (req, res) => {
    let coursecode = req.body.coursecode;
    let coursename = req.body.coursename;
    let syllabus = req.body.syllabus;
    let progression = req.body.progression;
    let error = "";

    if (!coursecode || !coursename || !syllabus || !progression) {
        error = "Du måste fylla i alla fält!";
        res.render("add", { error: error }); // Rendera om "add" sidan och skicka med felet
    } else {
    }
        res.render("add", {
            error: error
        });
});

app.listen(port, () => {
    console.log("Application started on port: " + port);
})