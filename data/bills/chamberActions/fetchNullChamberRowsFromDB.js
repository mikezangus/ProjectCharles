const printError = require("../../printError");


async function fetchNullBichameralRows(connection, congress)
{
    const query = `
        SELECT * FROM Bills
        WHERE congress = ?
            AND h_vote_num IS NULL
            AND h_year IS NULL
            AND s_vote_num IS NULL
            AND s_session IS NULL
    `;
    try {
        const [response] = await connection.execute(query, [congress]);
        console.log(`\nFinished fetching Congress ${congress}'s ${response.length} null bichameral rows`);
        return response;
    } catch (error) {
        printError(__filename, "fetchNullBichameralRows()", error);
        return [];
    }
}


async function fetchNullHouseRows(connection, congress)
{
    const query = `
        SELECT * FROM Bills
        WHERE congress = ?
            AND (h_vote_num IS NULL OR h_year IS NULL)
            AND (s_vote_num IS NOT NULL AND s_session IS NOT NULL)
    `;
    try {
        const [response] = await connection.execute(query, [congress]);
        console.log(`\nFinished fetching Congress ${congress}'s ${response.length} null House rows`);
        return response;
    } catch (error) {
        printError(__filename, "fetchNullHouseRows()", error);
        return [];
    }
}


async function fetchNullSenateRows(connection, congress)
{
    const query = `
        SELECT * FROM Bills
        WHERE congress = ?
            AND (s_vote_num IS NULL OR s_session IS NULL)
            AND (h_vote_num IS NOT NULL AND h_year IS NOT NULL)
    `;
    try {
        const [response] = await connection.execute(query, [congress]);
        console.log(`\nFinished fetching Congress ${congress}'s ${response.length} null Senate rows`);
        return response;
    } catch (error) {
        printError(__filename, "fetchNullSenateRows()", error);
        return [];
    }
}


module.exports = { fetchNullBichameralRows, fetchNullHouseRows, fetchNullSenateRows };
