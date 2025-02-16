const { spawn } = require("child_process");
const db = require("../../db");
const insert = require("./insertIntoDB");
const fetch = require("./fetchBillsFromWeb");


const START_CONGRESS = 95;
const END_CONGRESS = 119;


async function main()
{
    spawn("caffeinate", ["-i"]);
    const connection = await db;
    for (let congress = START_CONGRESS; congress <= END_CONGRESS; congress++) {
        const rows = await fetch(congress);
        await insert(rows, connection);
    }
    await connection.end();
    process.exit(0);
}


if (require.main === module) {
    (async () => { await main() })();
}
