const sql = require("mysql2/promise");
const { SQL_HOST_NAME, SQL_USER_NAME, SQL_PASSWORD } = require("../config.json");


const pool = sql.createPool({
    host: SQL_HOST_NAME,
    user: SQL_USER_NAME,
    password: SQL_PASSWORD,
    database: "DB",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


module.exports = pool;
