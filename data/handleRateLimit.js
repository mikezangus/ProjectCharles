const writeLog = require("./writeLog");


async function handleRateLimit(fetchResponse, billID)
{
    let attempts = 1;
    let delay = 10000;
    let status = null;
    const maxAttempts = 10;
    while (attempts <= maxAttempts) {
        try {
            return await fetchResponse();
        } catch (error) {
            if (error.response && error.response.status === 429) {
                console.warn(`⏳ [${++attempts}/${maxAttempts}] Trying again in ${delay / 1000}s`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2;
            } else {
                status = error.response.status;
                console.error(error);
                console.warn(`❓ [${++attempts}/${maxAttempts}] Trying again now`);
                attempts++;
            }
        }
    }
    console.error("Maximum attempts hit. Failed to fetch response")
    writeLog(`Bill: ${billID} | Status: ${status}`);
    return [];
}


module.exports = handleRateLimit;
