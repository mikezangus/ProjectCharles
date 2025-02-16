const db = require("../../db");
const driver = require("./driver");
const { fetchNullBichameralRows, fetchNullHouseRows, fetchNullSenateRows } = require("./fetch");
const y2c = require("../../years-congresses.json");


const BICHAMERAL = 0;
const HOUSE = 1;
const SENATE = 2;

const START_CONGRESS = 94;
const END_CONGRESS = 119;


async function main()
{
    const connection = await db;
    const currentCongress = y2c[new Date().getFullYear()];
    for (let congress = START_CONGRESS; congress <= END_CONGRESS; congress++) {
        await driver(
            await fetchNullBichameralRows(connection, congress),
            BICHAMERAL,
            connection
        );
        if (congress === currentCongress) {
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
    process.exit(0);
}


if (require.main === module) {
    (async () => { await main() })();
}
