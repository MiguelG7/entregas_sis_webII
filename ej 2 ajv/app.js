const express = require("express");
const ajv = require("./schemas");

const app = express();
app.use(express.json());

// Middleware para validar JSON con un esquema específico
function validateSchema(schemaKey) {
  return (req, res, next) => {
    const validate = ajv.getSchema(schemaKey);
    if (!validate(req.body)) {
      return res.status(400).json({ error: "JSON no válido", details: validate.errors });
    }
    next();
  };
}

// Ruta para validar personas
app.post("/validate-person", validateSchema("person"), (req, res) => {
  res.status(200).json({ message: "JSON válido para esquema de persona" });
});

// Ruta para validar coordenadas
app.post("/validate-coordinate", validateSchema("coordinate"), (req, res) => {
  res.status(200).json({ message: "JSON válido para esquema de coordenadas" });
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
