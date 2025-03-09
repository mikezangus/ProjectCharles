const y2c = require("../data/years-congresses.json");


const currentCongress = () =>
{
    return y2c[String(new Date().getFullYear())];
}


module.exports = currentCongress;
