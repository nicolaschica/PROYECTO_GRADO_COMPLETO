const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2");

const SECRET_KEY = "proyecto_grado_secret";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Conexión MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "proyecto_grado",
});

// Middleware para verificar JWT
function verificarToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, message: "Token requerido" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: "Token inválido o expirado" });
    req.user = user;
    next();
  });
}

// --------------------
// LOGIN ADMIN
// --------------------
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM admins WHERE email=?", [email], (err, results) => {
    if (err) {
      console.error("Error en DB:", err);
      return res.status(500).json({ 
        success: false, 
        message: "Error en el servidor" 
      });
    }

    // ❌ PRIMER CHEQUEO: Email no existe
    if (results.length === 0) {
      console.log("❌ ERROR: Email no encontrado ->", email);
      return res.status(401).json({ 
        success: false, 
        message: "El correo no está registrado",
        errorType: "email"
      });
    }

    const admin = results[0];
    
    // ❌ SEGUNDO CHEQUEO: Contraseña incorrecta (comparación directa)
    if (password !== admin.password) {
      console.log("❌ ERROR: Contraseña incorrecta para email ->", email);
      console.log("   Password ingresado:", password);
      console.log("   Password en BD:", admin.password);
      return res.status(401).json({ 
        success: false, 
        message: "La contraseña es incorrecta",
        errorType: "password"
      });
    }

    // ✅ Login exitoso
    console.log("✅ Login exitoso ->", email);
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: "admin" }, 
      SECRET_KEY, 
      { expiresIn: "2h" }
    );

    res.json({ 
      success: true, 
      token, 
      admin: { 
        id: admin.id, 
        email: admin.email, 
        name: admin.name 
      } 
    });
  });
});

// --------------------
// RESERVAS 
// --------------------
app.get("/reservas", verificarToken, (req, res) => {
  const { nombre, restaurante, fecha } = req.query;

  let sql = `
    SELECT r.id, r.nombre, r.telefono, r.restaurante_nombre, r.fecha, r.hora, r.user_id, r.created_at,
           COALESCE(p.estado, 'pendiente') AS estado_pago
    FROM reservas r
    LEFT JOIN pagos p ON r.id = p.reserva_id
    WHERE 1=1
  `;
  let params = [];

  if (nombre) {
    sql += " AND r.nombre LIKE ?";
    params.push(`%${nombre}%`);
  }
  if (restaurante) {
    sql += " AND r.restaurante_nombre LIKE ?";
    params.push(`%${restaurante}%`);
  }
  if (fecha) {
    sql += " AND r.fecha = ?";
    params.push(fecha);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error SQL:", err);
      return res.status(500).json({ success: false, message: "Error al obtener reservas" });
    }
    res.json({ success: true, reservas: results });
  });
});

//EDITAR RESERVA
app.put("/reserva/:id", verificarToken, (req, res) => {
  const { nombre, telefono, restaurante_nombre, fecha, hora } = req.body;

  const sql = `
    UPDATE reservas 
    SET nombre=?, telefono=?, restaurante_nombre=?, fecha=?, hora=? 
    WHERE id=?
  `;

  db.query(
    sql,
    [nombre, telefono, restaurante_nombre, fecha, hora, req.params.id],
    (err, result) => {
      if (err) {
        console.error("Error SQL:", err);
        return res.status(500).json({ success: false, message: "Error al actualizar reserva" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Reserva no encontrada" });
      }
      res.json({ success: true, message: "Reserva actualizada correctamente" });
    }
  );
});




app.delete("/reserva/:id", verificarToken, (req, res) => {
  db.query("DELETE FROM reservas WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ success: false, message: "Error al eliminar reserva" });
    res.json({ success: true, message: "Reserva eliminada" });
  });
});

app.listen(3000, () => console.log("Servidor corriendo en http://localhost:3000"));