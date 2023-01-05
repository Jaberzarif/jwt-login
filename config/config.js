const mysql = require('mysql');
require('dotenv').config()

const options = {
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_DATABASE,
    multipleStatements: true
    
}
const connection = mysql.createConnection(options);


connection.connect(function (err) {
    if (!err) {
        console.log("Database is connected... 😄");
    } else {
        console.log("Error connecting database... 😧");
    }
});


module.exports = connection;
