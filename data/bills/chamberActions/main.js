const db = require("../../db");
const driver = require("./driver");
const { fetchNullBichameralRows,
        fetchNullHouseRows,
        fetchNullSenateRows } = require("./fetchNullChamberRowsFromDB");
const getCurrentCongress = require("../../getCurrentCongress");


const BICHAMERAL = 0;
const HOUSE = 1;
const SENATE = 2;

const CURRENT_CONGRESS = getCurrentCongress();
const START_CONGRESS = 101;
const END_CONGRESS = CURRENT_CONGRESS;


async function main()
{
    const connection = await db;
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
    await connection.end();
}


if (require.main === module) {
    (async () => { await main() })();
}
