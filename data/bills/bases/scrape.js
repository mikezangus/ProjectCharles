const axios = require("axios");
const { CONGRESS_API_KEY: API_KEY } = require("../../../config.json");
const createRecord = require("../../createRecord");
const schema = require("../schema");
const createBillID = require("../../createBillID");
const c2y = require("../../congresses-years.json");


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
        console.error(`\n${__filename}\nError on fetchResponse |`, error.message);
        return [];
    }
}


function populateRecord(record)
{
    const r = createRecord(schema);
    if (!(r.bill_id = createBillID(record.congress,
                                   record.type,
                                   record.number))) return null;
    r.congress = record.congress;
    r.type = record.type;
    r.bill_num = record.number;
    return r;
}


async function main(targetCongress)
{
    const records = [];
    let offset = START_OFFSET;
    while (true) {
        const batch = await scrapeBatch(offset, targetCongress);
        if (batch.length === 0) break;
        records.push(...batch.map(populateRecord));
        offset += BATCH_SIZE;
    }
    console.log(`\nFinished scraping ${records.length} records for Congress ${targetCongress}\n`);
    return records;
}


if (require.main === module) {
    (async () => {
        return await main(118);
    })();
}


module.exports = main;
