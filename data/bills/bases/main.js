const insert = require("./insert");
const scrape = require("./scrape");


const CONGRESS = 119;


async function main()
{
    const rows = await scrape(CONGRESS);
    await insert(rows);
    process.exit(0);
}


if (require.main === module) {
    (async () => { await main() })();
}
