const scrapeBill = require("./scrapeBill");
const scrapeBills = require("./scrapeBills");
const scrapeActions = require("./scrapeActions");
const insertRecords = require("./insertRecords");
const getMaxLens = require("../getMaxLens");

const START = 0;
const BATCH_SIZE = 250;
const TOTAL_BILLS = 1000000;


async function main()
{
    let records = [];
    TOTAL_BILLS > 1
        ? records = await scrapeBills(START, BATCH_SIZE, TOTAL_BILLS)
        : records = await scrapeBill()
    await scrapeActions(records);
    await insertRecords(records);
    getMaxLens(records);
}


if (require.main === module) {
    (async () => {
       await main();
    })();
}
