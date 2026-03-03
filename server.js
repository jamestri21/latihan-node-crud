require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");

const app = express();
app.use(express.json());

// Koneksi MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "latihan_nod"
});

db.connect((err) => {
  if (err) {
    console.log("Koneksi gagal:", err);
  } else {
    console.log("MySQL Connected");
  }
});


// =======================
// CRUD API
// =======================

// CREATE
app.post("/users", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: "Name dan Email wajib diisi" });
  }

   const checkSql = "SELECT * FROM users WHERE email = ?";
   db.query(checkSql, [email], (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length > 0) {
      return res.status(400).json({ message: "Email sudah terdaftar!" });
    }

    // Jika belum ada → insert
    const insertSql = "INSERT INTO users (nama, email) VALUES (?, ?)";
    db.query(insertSql, [name, email], (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "User berhasil dibuat", id: result.insertId });
    });
  });
//   const sql = "INSERT INTO users (nama, email) VALUES (?, ?)";
  
//   db.query(sql, [name, email], (err, result) => {
//     if (err) return res.status(500).json(err);
//     res.json({ message: "User created", id: result.insertId });
//   });
});

// READ ALL
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// READ ONE
app.get("/users/:id", (req, res) => {
  db.query("SELECT * FROM users WHERE id=?", [req.params.id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results[0]);
  });
});

// UPDATE
app.put("/users/:id", (req, res) => {
 
   const { name, email } = req.body;
  const userId = req.params.id;

  const checkSql = "SELECT * FROM users WHERE email = ? AND id != ?";
  db.query(checkSql, [email, userId], (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length > 0) {
      return res.status(400).json({ message: "Email sudah digunakan user lain!" });
    }

    const updateSql = "UPDATE users SET nama=?, email=? WHERE id=?";
    db.query(updateSql, [name, email, userId], (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "User berhasil diupdate" });
    });
  });
});

// DELETE
app.delete("/users/:id", (req, res) => {
  db.query("DELETE FROM users WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "User deleted" });
  });
});


// Jalankan server
app.listen(process.env.PORT, () => {
  console.log("Server jalan di http://localhost:" + process.env.PORT);
});

app.post("/pendidikan",(req,res)=>{
    const { user_id, sekolah, degree, mulai, selesai } = req.body;
    // const { user_id, sekolah, degree, mulai, selesai } = req.body;
    if(!user_id||!sekolah){
        return res.status(400).json({pesan:"ID dan sekolah wajib diisi  "});
    }

//     if (!user_id || !sekolah) {
//     return res.status(400).json({ message: "ID dan sekolah wajib diisi " });
//   }

    const sql=`INSERT INTO Pendidikan 
    (user_id, sekolah, degree, mulai, selesai)
    VALUES (?, ?, ?, ?, ?)`;
    
    db.query(sql,[user_id,sekolah,degree,mulai,selesai],(err,result)=> {
        if(err) return res.status(500).json(err);
        res.json({pesan:"riwayat pendidikan ditambah",id:result.insertId })

    });

});