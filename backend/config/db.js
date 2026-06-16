const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "unimate"
});

db.connect((err) => {
    if (err) {
        console.log("Kết nối database thất bại!");
        console.log(err);
    } else {
        console.log("Kết nối database thành công!");
    }
});

module.exports = db;