const scrape = require("./scrape");
const insert = require("./insert");


const CONGRESS = 117;


async function main()
{
    const records = await scrape(CONGRESS);
    await insert(records);
    process.exit(0);
}


if (require.main === module) {
    (async () => {
        return await main(118);
    })();
}
