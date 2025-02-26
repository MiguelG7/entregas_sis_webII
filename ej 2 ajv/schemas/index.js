const Ajv2020 = require("ajv/dist/2020");
const ajv = new Ajv2020();

const schema_persona = require("./persona.schema.json");
const schema_coordinate = require("./coordinate.schema.json");

ajv.addSchema(schema_persona, "person");
ajv.addSchema(schema_coordinate, "coordinate");

module.exports = ajv;
