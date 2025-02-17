const y2c = require("./years-congresses.json");


module.exports = function ()
{
    return y2c[String(new Date().getFullYear())];
}
