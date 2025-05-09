var express = require('express');
var router = express.Router();

//ajv
const Ajv2020 = require("ajv/dist/2020");
const ajv = new Ajv2020();

const ciudad_schema = require('../schemas/ciudad.schema.json');
const famoso_schema = require('../schemas/famoso.schema.json');

ajv.addSchema(ciudad_schema,"ciudad");
ajv.addSchema(famoso_schema,"famoso")

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


//MUY IMPORTANTE METER EL REQ, AUNQ PAREZCA NO SE ESTÁ USANDO, VALIDATESCHEMA SI LO USA
router.post("/validate_famoso", validateSchema("famoso"), (req,res) => {
  res.status(200).json({"message":"el formato del JSON recibido de persona es correcto"})
})

router.post("/validate_ciudad", validateSchema("ciudad"), (req,res) => {
  res.status(200).json({"message":"el formato del JSON recibido de ciudad es correcto"})
})

module.exports = router;
