const fs = require("fs");


function writeLog(message) {
    const timestamp = new Date().toLocaleString();
    const log = `[${timestamp}] ${message}\n`;
    fs.appendFileSync("log.log", log, "utf8");
}


module.exports = writeLog;
