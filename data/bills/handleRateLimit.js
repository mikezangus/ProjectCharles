const printError = require("../printError");


module.exports = async function (fetchResponse)
{
    let attempts = 0;
    let delay = 10000;
    const maxAttempts = 10;
    while (attempts < maxAttempts) {
        try {
            return await fetchResponse();
        } catch (error) {
            if (error.response && error.response.status === 429) {
                console.warn(`⏳ Rate limit hit | Attempt [${++attempts}/${maxAttempts}] | Retrying in ${delay / 1000}s`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2;
            } else {
                printError(__filename, "handleRateLimit()", error);
                return [];
            }
        }
    }
    console.error(`\n${__filename}\nMaximum attempts hit. Failed to fetch response`);
    return [];
}
