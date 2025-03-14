async function fetchBillsFromDB(connection, startCongress, endCongress)
{
    const hQuery = `
        SELECT * FROM Bills
        WHERE congress = ?
            AND h_vote_num IS NOT NULL
            AND h_year IS NOT NULL
    `;
    const sQuery = `
        SELECT * FROM Bills
        WHERE congress = ?
            AND s_vote_num IS NOT NULL
            AND s_session IS NOT NULL
    `;
    try {
        const hBills = [];
        const sBills = [];
        for (let congress = startCongress; congress <= endCongress; congress++) {
            const [[hResponse], [sResponse]] = await Promise.all([
                connection.execute(hQuery, [congress]),
                connection.execute(sQuery, [congress])
            ]);
            hBills.push(...hResponse);
            sBills.push(...sResponse);
        }
        return [...hBills, ...sBills];
    } catch (error) {
        console.error(error);
        throw error;
    }
}


module.exports = fetchBillsFromDB;
