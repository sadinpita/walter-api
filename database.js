var mysql = require('mysql');

// Connection configurations.
const lampa_db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'walterapp'
});

// Connect to database.
lampa_db.connect();

module.exports = lampa_db;