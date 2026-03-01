const fs = require("fs");
const path = require("path");

// Mengarah ke folder data/users.json di luar folder src
const DB_FILE = path.join(__dirname, "../../data/users.json");

const loadDB = () => {
  return fs.existsSync(DB_FILE) ? JSON.parse(fs.readFileSync(DB_FILE)) : {};
};

const saveDB = (users) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
};

module.exports = { loadDB, saveDB };