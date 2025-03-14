async function fetchNullBillsFromDB(chamber, connection, congress)
{
    if (chamber !== 'B' && chamber !== 'H' && chamber !== 'S') {
        throw new Error(`Invalid value | chamber=${chamber}\nValid values: 'B' (Bichameral), 'H' (House), or 'S' (Senate)`);
    }
    const bQuery = `
        SELECT * FROM Bills
        WHERE congress = ?
            AND h_vote_num IS NULL
            AND h_year IS NULL
            AND s_vote_num IS NULL
            AND s_session IS NULL
    `;
    const hQuery = `
        SELECT * FROM Bills
        WHERE congress = ?
            AND (h_vote_num IS NULL OR h_year IS NULL)
            AND (s_vote_num IS NOT NULL AND s_session IS NOT NULL)
    `;
    const sQuery = `
        SELECT * FROM Bills
        WHERE congress = ?
            AND (s_vote_num IS NULL OR s_session IS NULL)
            AND (h_vote_num IS NOT NULL AND h_year IS NOT NULL)
    `;
    let query = null;
    if (chamber === 'B') {
        query = bQuery;
    } else if (chamber === 'H') {
        query = hQuery;
    } else if (chamber === 'S') {
        query = sQuery;
    }
    try {
        const [response] = await connection.execute(query, [congress]);
        console.log(`\nFinished fetching Congress ${congress}'s ${response.length} null ${chamber} bills from DB`);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


module.exports = fetchNullBillsFromDB;
