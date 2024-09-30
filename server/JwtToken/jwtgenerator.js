const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtgenerator(id) {
  const paylaod = {
    user_id: id,
  };
  return jwt.sign(paylaod, process.env.jwtSecret, { expiresIn: "24hr" });
}
module.exports = jwtgenerator;