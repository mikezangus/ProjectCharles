const { spawn } = require("child_process");
const currentCongress = require("../../currentCongress");
const fetchBillsFromWeb = require("./fetchBillsFromWeb");
const insertIntoDB = require("./insertIntoDB");
const pool = require("../../db");
const populateFields = require("./populateFields");


const START_CONGRESS = currentCongress(); // 102 is minimum, no online vote archiving pre-102
const END_CONGRESS = currentCongress();


async function main()
{
    const caffeinate = spawn("caffeinate",
                             ["-d", "-i", "-s", "-u"],
                             { detached: false, stdio: "ignore" });
    let connection = null;
    try {
        connection = await pool.getConnection();
        for (let congress = START_CONGRESS; congress <= END_CONGRESS; congress++) {
            let bills = await fetchBillsFromWeb(congress);
            bills = bills.map(populateFields);
            await insertIntoDB(bills, connection);
        }
    } catch (error) {
        console.error(error);
    } finally {
        if (connection) {
            connection.release();
        }
    }
    try {
        await pool.end();
    } catch (error) {
        console.error(error);
    }
    caffeinate.kill("SIGTERM");
}


if (require.main === module) {
    (async () => {
        await main();
        process.exit(0);
    })();
}
