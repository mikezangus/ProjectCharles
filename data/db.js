const sql = require("mysql2/promise");
const { SQL_HOST_NAME, SQL_USER_NAME, SQL_PASSWORD } = require("../config.json");


module.exports = sql.createConnection({
    host: SQL_HOST_NAME,
    user: SQL_USER_NAME,
    password: SQL_PASSWORD,
    database: "DB"
});
