const writeLog = require("../src/utils/writeLog");


async function handleRateLimit(fetchResponse, id)
{
    let attempts = 0;
    let delay = 10000;
    let status = null;
    let errorMessage = null;
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
                errorMessage = error;
                console.warn(`❓ [${++attempts}/${maxAttempts}] Trying again now`);
            }
        }
    }
    console.error(`Maximum attempts hit. Failed to fetch response.\nError:\n${errorMessage}`);
    writeLog(`ID: ${id} | Status: ${status}`);
    return [];
}


module.exports = handleRateLimit;
