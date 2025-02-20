const { spawn } = require("child_process");
const pool = require("../../db");
const fetch = require("./fetchBillsFromWeb");
const getCurrentCongress = require("../../getCurrentCongress");
const insert = require("./insertIntoDB");


const CURRENT_CONGRESS = getCurrentCongress();
const START_CONGRESS = 113;
const END_CONGRESS = 114;


async function main()
{
    const caffeinate = spawn("caffeinate",
                             ["-d", "-i", "-s", "-u"],
                             { detached: false, stdio: "ignore" });
    const connection = await pool.getConnection();
    try {
        for (let congress = START_CONGRESS; congress <= END_CONGRESS; congress++) {
            const rows = await fetch(congress);
            await insert(rows, connection);
        }
    } finally {
        connection.release();
        await pool.end();
        caffeinate.kill("SIGTERM");
    }
}


if (require.main === module) {
    (async () => {
        await main();
        process.exit(0);
    })();
}
