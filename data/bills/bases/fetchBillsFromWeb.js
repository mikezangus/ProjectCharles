const axios = require("axios");
const { CONGRESS_API_KEY: API_KEY } = require("../../../config.json");
const handleRateLimit = require("../../handleRateLimit");


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
        console.error(error);
        return [];
    }
}


async function fetchBatch(congress, offset)
{
    console.log(`Started fetching for Congress ${congress} [${offset} - ${offset + BATCH_SIZE}]`);
    try {
        const response = await handleRateLimit(
            () => fetchResponse(congress, offset),
            `Congress: ${congress} | Batch: ${offset} - ${BATCH_SIZE}`
        );
        return response ? response : [];
    } catch (error) {
        console.error(error);
    }
}


async function fetchBillsFromWeb(congress)
{
    const bills = [];
    let offset = 0;
    while (true) {
        const batch = await fetchBatch(congress, offset);
        if (!batch || batch.length === 0) break;
        bills.push(...batch);
        offset += BATCH_SIZE;
    }
    console.log(`Finished fetching ${bills.length} records for Congress ${congress}`);
    return bills;
}


module.exports = fetchBillsFromWeb;
