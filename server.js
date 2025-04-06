const express = require("express");
const bodyParse = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./db/courses.db");