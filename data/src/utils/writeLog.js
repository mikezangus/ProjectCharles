const fs = require("fs");
const file = "log.log";


function writeLog(message) {
    const timestamp = new Date().toLocaleString();
    const log = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(file, log, "utf8");
}


module.exports = writeLog;
