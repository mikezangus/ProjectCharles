const axios = require("axios");
const { CONGRESS_API_KEY: API_KEY } = require("../../config.json");
const createRecord = require("../createRecord");
const schema = require("./schema");
const getBillID = require("../createBillID");


async function fetchResponse(offset, batchSize)
{
    try {
        const response = await axios.get(
            "https://api.congress.gov/v3/bill",
            {
                params: {
                    api_key: API_KEY,
                    format: "json",
                    offset: offset,
                    limit: batchSize,
                    sort: "updateDate+desc"
                }
            }
        );
        return response.data.bills || [];
    } catch (error) {
        console.error(`\n${__filename}\n` +
                      `Error on fetchResponse |`, error.message);
        return [];
    }
}


async function main(start, batchSize, totalBills)
{
    const bills = [];
    for (let i = start; i < start + totalBills; i += batchSize) {
        console.log(
            `\nStarted fetching batch ${i} - ${i + batchSize} ` +
            `out of ${start + totalBills}`
        );
        const records = await fetchResponse(i, batchSize);
        bills.push(
            ...records.map(record => {
                let r = createRecord(schema);
                r.bill_id = getBillID(record.congress, record.type, record.number);
                r.congress = record.congress;
                r.type = record.type;
                r.bill_num = record.number;
                return r;
            })
        );
    }
    return bills;
}


if (require.main === module) {
    (async () => {
        console.log(await main(100000, 5, 5));
    })();
}


module.exports = main;
