const express = require("express");
const ajv = require("./schemas");

const app = express();
app.use(express.json());

// Middleware para validar JSON con un esquema específico usando AJV
function validateSchema(schemaKey) {
  // Devuelve una función middleware de Express
  return (req, res, next) => {
    // Obtiene la función de validación para el esquema indicado
    const validate = ajv.getSchema(schemaKey);
    // Valida el cuerpo de la petición contra el esquema
    if (!validate(req.body)) {
      // Si no es válido, responde con error 400 y detalles de validación
      return res.status(400).json({ error: "JSON no válido", details: validate.errors });
    }
    // Si es válido, continúa con el siguiente middleware/controlador
    next();
  };
}

// Ruta para validar objetos tipo "persona"
// Usa el middleware de validación con el esquema "person"
app.post("/validate-person", validateSchema("person"), (req, res) => {
  // Si el JSON es válido, responde con mensaje de éxito
  res.status(200).json({ message: "JSON válido para esquema de persona" });
});

// Ruta para validar objetos tipo "coordenada"
// Usa el middleware de validación con el esquema "coordinate"
app.post("/validate-coordinate", validateSchema("coordinate"), (req, res) => {
  // Si el JSON es válido, responde con mensaje de éxito
  res.status(200).json({ message: "JSON válido para esquema de coordenadas" });
});

// Iniciar el servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
  // Mensaje en consola indicando que el servidor está corriendo
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
