const axios = require("axios");
const { CONGRESS_API_KEY: API_KEY } = require("../../../config.json");
const c2y = require("../../congresses-years.json");
const populate = require("./populate");
const printError = require("../../printError");


const BATCH_SIZE = 250;
const START_OFFSET = 0;


async function scrapeBatch(offset, targetCongress)
{
    console.log(`\nStarted scraping for Congress ${targetCongress} [${offset} - ${offset + BATCH_SIZE}]`);
    try {
        const response = await axios.get(
            "https://api.congress.gov/v3/bill",
            {
                params: {
                    api_key: API_KEY,
                    format: "json",
                    offset: offset,
                    limit: BATCH_SIZE,
                    fromDateTime: `${c2y[targetCongress][0]}-01-03T00:00:00Z`,
                    toDateTime: `${c2y[targetCongress][1] + 1}-01-03T00:00:00Z`
                }
            }
        );
        return response.data.bills.filter(
            bill => bill.congress === targetCongress
        );
    } catch (error) {
        printError(__filename, "scrapeBatch()", error);
        return [];
    }
}


module.exports = async function (targetCongress)
{
    const rows = [];
    let offset = START_OFFSET;
    while (true) {
        const batch = await scrapeBatch(offset, targetCongress);
        if (batch.length === 0) break;
        rows.push(...batch.map(populate));
        offset += BATCH_SIZE;
    }
    console.log(`\nFinished scraping ${rows.length} records for Congress ${targetCongress}\n`);
    return rows;
}
