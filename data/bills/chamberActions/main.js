const { spawn } = require("child_process");
const pool = require("../../db");
const driver = require("./driver");
const { fetchNullBichameralRows,
        fetchNullHouseRows,
        fetchNullSenateRows } = require("./fetchNullChamberRowsFromDB");
const getCurrentCongress = require("../../getCurrentCongress");


const BICHAMERAL = 0;
const HOUSE = 1;
const SENATE = 2;

const CURRENT_CONGRESS = getCurrentCongress();
const START_CONGRESS = 94;
const END_CONGRESS = CURRENT_CONGRESS;


async function main()
{
    const caffeinate = spawn("caffeinate", ["-d", "-i", "-s", "-u"],
                             { detached: false, stdio: "ignore" });
    const connection = await pool.getConnection();
    try {
        for (let congress = START_CONGRESS; congress <= END_CONGRESS; congress++) {
            await driver(
                await fetchNullBichameralRows(connection, congress),
                BICHAMERAL,
                connection
            );
            if (congress === CURRENT_CONGRESS) {
                await driver(
                    await fetchNullHouseRows(connection, congress),
                    HOUSE,
                    connection
                );
                await driver(
                    await fetchNullSenateRows(connection, congress),
                    SENATE,
                    connection
                );
            }
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
