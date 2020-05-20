let mysql = require('mysql');
let credenciales = require('./credentials')

let sql = 'CREATE DATABASE IF NOT EXISTS finanzas';
mysql.createConnection({
    host: credenciales.server,
    user: credenciales.user,
    password: credenciales.password
}).query(sql, (err, result) => {
    if (err) throw err
});
db = mysql.createConnection({
    host: credenciales.server,
    user: credenciales.user,
    password: credenciales.password,
    database: 'finanzas'
});
db.connect((err) => {
    if (err) {
        throw err
    }
})

module.exports = db