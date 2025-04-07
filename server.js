const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

// En variabel med SQLite-databasen
const db = new sqlite3.Database("./db/courses.db");

// Initiera Express-applikationen
const app = express();
const port = 3000;

// Sätt upp EJS som vy-motor
app.set("view engine", "ejs");

app.use(express.static("public"));

// Använder bodyparser för att hantera inkommande formulärdata
app.use(bodyParser.urlencoded({ extended: true }));

// Routing

// Visa alla kurser (Startsidan)
app.get("/", (req, res) => {
    // Hämta alla kurser från databasen
    db.all("SELECT * FROM courses;", (err, rows) => {
        if (err) {
            console.error(err.message); // Logga eventuella fel
        }
        // Rendera index.ejs och skicka kurserna (rows) till vyn
        res.render("index", {
            error: "",
            rows: rows
        });
    });
});

// Visa formulär för att lägga till en ny kurs
app.get("/add", (req, res) => {
    res.render("add", {
        error: ""
    }); // Rendera add.ejs med ett tomt felmeddelande
});

// Om sidan
app.get("/about", (req, res) => {
    res.render("about"); // Rendera about.ejs för informationssidan
});

// Radera en kurs
app.get("/delete/:id", (req, res) => {
    // Hämta kursens ID från URL-parametern
    const id = req.params.id;

    // Kör SQL-satsen för att radera kursen med det specifika ID:t
    db.run("DELETE FROM courses WHERE id = ?", id, function(err) {
        if (err) {
            console.error(err.message); // Logga eventuella fel
        }
        // När kursen är raderad, omdirigera användaren tillbaka till startsidan
        res.redirect("/"); 
    });
});

// Hantera formulärinlämning för att lägga till en ny kurs
app.post("/add", (req, res) => {
    // Hämta kursdata från formuläret
    let coursecode = req.body.coursecode;
    let coursename = req.body.coursename;
    let syllabus = req.body.syllabus;
    let progression = req.body.progression;

    // Kontrollera att alla fält är ifyllda
    if (!coursecode || !coursename || !syllabus || !progression) {
        const error = "Du måste fylla i alla fält!"; // Sätt ett felmeddelande om fälten är tomma
        res.render("add", { error: error }); // Rendera add.ejs igen med felet
    } else {
        // Förbered SQL-frågan för att infoga kursen i databasen
        const stmt = db.prepare("INSERT INTO courses(coursecode, coursename, syllabus, progression) VALUES (?, ?, ?, ?);");
        stmt.run(coursecode, coursename, syllabus, progression, function(err) {
            if (err) {
                console.error(err.message); // Logga fel vid infogning
                res.render("add", { error: "Fel vid lagring av kurs!" }); // Visa felmeddelande om det uppstår problem
            } else {
                // Om kursen lagras framgångsrikt, omdirigera till startsidan
                res.redirect("/"); 
            }
        });
        stmt.finalize(); // Avsluta SQL-satsen
    }
});

// Starta servern på den angivna porten
app.listen(port, () => {
    console.log("Application started on port: " + port); // Skriv ut ett meddelande när servern är igång
});
