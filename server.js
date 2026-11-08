const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "crud_js",
});

db.connect(function (err) {
  if (err) {
    console.log("Koneksi database gagal:", err.message);
    return;
  }
  console.log("Berhasil terhubung ke MySql!");
});

app.get("/mahasiswa", function (req, res) {
  const sql = "SELECT * FROM mahasiswa";

  db.query(sql, function (err, hasil) {
    if (err) {
      return res.status(500).json({ pesan: "Gagal mengambil data" });
    }

    res.json(hasil);
  });
});

app.post("/mahasiswa", function (req, res) {
  const nama = req.body.nama;
  const nim = req.body.nim;

  const sql = "INSERT INTO mahasiswa (nama, nim) VALUES (?, ?)";

  db.query(sql, [nama, nim], function (err, hasil) {
    if (err) {
      return res.status(500).json({ pesan: "Gagal menambahkan data" });
    }

    res.status(201).json({
      pesan: "Mahasiswa berhasil ditambahkan",
      id: hasil.insertId,
    });
  });
});

app.put("/mahasiswa/:id", function (req, res) {
  const id = req.params.id;
  const nama = req.body.nama;
  const nim = req.body.nim;

  const sql = "UPDATE mahasiswa SET nama = ?, nim = ? WHERE id = ?";

  db.query(sql, [nama, nim, id], function (err, hasil) {
    if (err) {
      return res.status(500).json({
        pesan: "Gagal mengubah data",
      });
    }

    if (hasil.affectedRows === 0) {
      return res.status(404).json({
        pesan: "Data mahasiswa tidak ditemukan",
      });
    }

    res.json({
      pesan: "Data mahasiswa berhasil diubah",
    });
  });
});

app.delete("/mahasiswa/:id", function (req, res) {
  const id = req.params.id;

  const sql = "DELETE FROM mahasiswa WHERE id = ?";

  db.query(sql, [id], function (err, hasil) {
    if (err) {
      return res.status(500).json({
        pesan: "Gagal menghapus data",
      });
    }

    if (hasil.affectedRows === 0) {
      return res.status(404).json({
        pesan: "Data mahasiswa tidak ditemukan",
      });
    }

    res.json({
      pesan: "Mahasiswa berhasil dihapus",
    });
  });
});

app.listen(3000, function () {
  console.log("Server berjalan di http://localhost:3000");
});
