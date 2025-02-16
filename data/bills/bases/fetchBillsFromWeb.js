const axios = require("axios");
const { CONGRESS_API_KEY: API_KEY } = require("../../../config.json");
const handleRateLimit = require("../handleRateLimit");
const populateFields = require("./populateFields");
const printError = require("../../printError");


const BATCH_SIZE = 250;


async function fetchResponse(congress, offset)
{
    try {
        const response = await axios.get(
            `https://api.congress.gov/v3/bill/${congress}`,
            {
                params: {
                    api_key: API_KEY,
                    format: "json",
                    offset: offset,
                    limit: BATCH_SIZE,
                }
            }
        );
        return response ? response.data.bills : [];
    } catch (error) {
        printError(__filename, "fetchResponse()", error);
        return [];
    }
}


async function fetchBatch(congress, offset)
{
    console.log(`Started scraping for Congress ${congress} [${offset} - ${offset + BATCH_SIZE}]`);
    const response = await handleRateLimit(
        () => fetchResponse(congress, offset)
    );
    return response ? response : [];
}


module.exports = async function (congress)
{
    const rows = [];
    let offset = 0;
    while (true) {
        const batch = await fetchBatch(congress, offset);
        if (!batch || batch.length === 0) break;
        rows.push(...batch.map(populateFields));
        offset += BATCH_SIZE;
    }
    console.log(`Finished scraping ${rows.length} records for Congress ${congress}`);
    return rows;
}
