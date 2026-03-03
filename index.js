require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.log("Koneksi gagal:", err);
  } else {
    console.log("Koneksi MySQL berhasil");
  }
});

app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post("/users", (req, res) => {
  const { nama, email } = req.body;
  db.query(
    "INSERT INTO users (nama, email) VALUES (?, ?)",
    [nama, email],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Data berhasil ditambahkan" });
    }
  );
});

app.listen(process.env.PORT, () => {
  console.log("Server jalan di http://localhost:" + process.env.PORT);
});