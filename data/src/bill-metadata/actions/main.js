const { spawn } = require("child_process");
const pool = require("../../db");
const currentCongress = require("../../currentCongress");
const deleteNullBichamBills = require("./deleteNullBichamBills");
const driver = require("./driver");


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
            if (congress !== currentCongress()) {
                await driver('B', connection, congress);
                await deleteNullBichamBills(congress, connection);
            }
            await driver('H', connection, congress);
            await driver('S', connection, congress);
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
