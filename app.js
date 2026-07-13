// src/middleware/accessCode.js
//
// If config.accessCode is set, requests must include a matching
// "x-access-code" header. Lets you share a public demo link without
// letting anyone who finds it run up your API bill.

const config = require("../config");

function isValid(req) {
  if (!config.accessCode) return true;
  const provided = req.get("x-access-code") || req.query.access_code;
  return provided === config.accessCode;
}

function accessCode(req, res, next) {
  if (!isValid(req)) {
    return res.status(401).json({ error: "Invalid or missing access code." });
  }
  next();
}

module.exports = accessCode;
module.exports.isValid = isValid;
