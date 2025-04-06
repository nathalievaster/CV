/**
 * Installation av databasen för kurser
 */
const sqlite3 = require("sqlite3").verbose();

// Skapar databasen
const db = new sqlite3.Database("./db/courses.db");

// Skapa tabellen för kurserna
db.serialize(() => {
    db.run("DROP TABLE IF EXISTS courses;");

    db.run(`
        CREATE TABLE courses(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        coursecode TEXT NOT NULL,
        coursename TEXT NOT NULL,
        syllabus TEXT NOT NULL,
        progression TEXT NOT NULL
        );
        `);
    
});

db.close();