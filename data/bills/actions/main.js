const db = require("../../db");
const { fetchNullBichameralRows, fetchNullHouseRows, fetchNullSenateRows } = require("./fetch");
const driver = require("./driver");
const y2c = require("../../years-congresses.json");


const START_CONGRESS = 118;
const END_CONGRESS = 119;

const BICHAMERAL = 0;
const HOUSE = 1;
const SENATE = 2;


async function main()
{
    const connection = await db.getConnection();
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
    await db.end();
    process.exit(0);
}


if (require.main === module) {
    (async () => { await main() })();
}
