const config = require("./config.json");


module.exports = function getApiKey()
{
    const key = config.API_KEY;
    if (!key) {
        console.error("Error getting API key");
        process.exit(1);
    }
    return key;
}
