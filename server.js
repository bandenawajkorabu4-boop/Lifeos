const express = require("express");
const Database = require("better-sqlite3");
const path = require("path");

const app = express();
const PORT = 3000;


// =====================================
// MIDDLEWARE
// =====================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// =====================================
// DATABASE
// =====================================

const databaseFolder = path.join(__dirname, "database");

const fs = require("fs");

if (!fs.existsSync(databaseFolder)) {
    fs.mkdirSync(databaseFolder);
}

const db = new Database(
    path.join(databaseFolder, "bookings.db")
);


// =====================================
// CREATE BOOKINGS TABLE
// =====================================

db.prepare(`
    CREATE TABLE IF NOT EXISTS bookings (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        name TEXT NOT NULL,

        phone TEXT NOT NULL,

        email TEXT NOT NULL,

        checkin TEXT NOT NULL,

        checkout TEXT NOT NULL,

        guests INTEGER NOT NULL,

        room TEXT NOT NULL,

        booking_date TEXT DEFAULT CURRENT_TIMESTAMP

    )
`).run();


// =====================================
// FRONTEND
// =====================================

app.use(express.static(__dirname));


// =====================================
// GET ALL BOOKINGS
// =====================================

app.get("/api/bookings", (req, res) => {

    try {

        const bookings = db
            .prepare("SELECT * FROM bookings ORDER BY id DESC")
            .all();

        res.json(bookings);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Could not load bookings"
        });

    }

});


// =====================================
// CREATE BOOKING
// =====================================

app.post("/api/bookings", (req, res) => {

    try {

        const {
            name,
            phone,
            email,
            checkin,
            checkout,
            guests,
            room
        } = req.body;


        // CHECK REQUIRED DATA

        if (
            !name ||
            !phone ||
            !email ||
            !checkin ||
            !checkout ||
            !guests ||
            !room
        ) {

            return res.status(400).json({

                success: false,

                message: "Please fill all fields"

            });

        }


        // SAVE BOOKING

        const result = db.prepare(`
            INSERT INTO bookings
            (
                name,
                phone,
                email,
                checkin,
                checkout,
                guests,
                room
            )
            VALUES
            (
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?
            )
        `).run(

            name,
            phone,
            email,
            checkin,
            checkout,
            guests,
            room

        );


        res.json({

            success: true,

            message: "Booking successful!",

            bookingId: result.lastInsertRowid

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Booking failed"

        });

    }

});


// =====================================
// DELETE BOOKING
// =====================================

app.delete("/api/bookings/:id", (req, res) => {

    try {

        const id = req.params.id;

        const result = db
            .prepare("DELETE FROM bookings WHERE id = ?")
            .run(id);


        if (result.changes === 0) {

            return res.status(404).json({

                success: false,

                message: "Booking not found"

            });

        }


        res.json({

            success: true,

            message: "Booking deleted"

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Could not delete booking"

        });

    }

});


// =====================================
// START SERVER
// =====================================

app.listen(PORT, () => {

    console.log("");
    console.log("=================================");
    console.log(" Restaurant Website Server");
    console.log("=================================");
    console.log(`Server: http://localhost:${PORT}`);
    console.log("Database: database/bookings.db");
    console.log("=================================");
    console.log("");

});