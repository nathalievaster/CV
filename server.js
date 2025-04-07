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
    db.all("SELECT * FROM courses;", (err, rows) => {
        if (err) {
            console.error(err.message);
        }
        res.render("index", {
            error: "",
            rows: rows
        });
    });
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

// Radera kurs
app.get("/delete/:id", (req, res) => {
    const id = req.params.id;

    db.run("DELETE FROM courses WHERE id = ?", id, function(err) {
        if (err) {
            console.error(err.message);
        }
        res.redirect("/"); 
    });
});


app.post("/add", (req, res) => {
    let coursecode = req.body.coursecode;
    let coursename = req.body.coursename;
    let syllabus = req.body.syllabus;
    let progression = req.body.progression;

    if (!coursecode || !coursename || !syllabus || !progression) {
        const error = "Du måste fylla i alla fält!";
        res.render("add", { error: error }); 
    } else {
        const stmt = db.prepare("INSERT INTO courses(coursecode, coursename, syllabus, progression) VALUES (?, ?, ?, ?);");
        stmt.run(coursecode, coursename, syllabus, progression, function(err) {
            if (err) {
                console.error(err.message);
                res.render("add", { error: "Fel vid lagring av kurs!" });
            } else {
                res.redirect("/"); // Redirect till startsidan när kursen lagts till
            }
        });
        stmt.finalize();
    }
});

app.listen(port, () => {
    console.log("Application started on port: " + port);
});