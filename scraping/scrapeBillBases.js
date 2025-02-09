const axios = require("axios");
const { CONGRESS_API_KEY: API_KEY } = require("../config.json");
const BATCH_SIZE = 10;
const TOTAL_BILLS = 10;


function populateRecord(bill)
{
    return {
        bill_id: `${bill.congress}${bill.type}${bill.number}`,
        congress: bill.congress,
        bill_type: bill.type,
        bill_num: bill.number,
    };
}


async function scrapeBatch(offset)
{
    console.log(`\nStarted fetching batch ${offset} - ${offset + BATCH_SIZE} out of ${TOTAL_BILLS}`);
    try {
        const response = await axios.get(
            "https://api.congress.gov/v3/bill",
            {
                params: {
                    api_key: API_KEY,
                    format: "json",
                    offset: offset,
                    limit: BATCH_SIZE,
                    sort: "updateDate+desc"
                }
            }
        );
        return response.data.bills.map(populateRecord) || [];
    } catch (error) {
        console.error("Error |", error.message);
        return [];
    }
}


async function scrapeBillBases()
{
    const bills = new Map();
    for (let i = 0; i < TOTAL_BILLS; i += BATCH_SIZE) {
        let batch = await scrapeBatch(i);
        batch.forEach(bill => {
            if (!bills.has(bill.bill_id)) {
                bills.set(bill.bill_id, bill);
            }
        });
    }
    return [...bills.values()];
}


async function main()
{
    console.log("\n\nFinished scraping bills:\n", await scrapeBillBases());
}


if (require.main === module) {
    main();
}


module.exports = scrapeBillBases;
