async function deleteNullBichamBills(congress, connection)
{
    const query = `
        DELETE FROM Bills
        WHERE congress = ${congress}
            AND h_vote_num IS NULL
            AND h_year IS NULL
            AND s_vote_num IS NULL
            AND s_session IS NULL
    `;
    try {
        const [result] = await connection.execute(query, billIDs);
        console.log(`Finished deleting ${result.affectedRows} bills from Congress ${congress} with no fields for either chamber`);
    } catch (error) {
        console.error(error);
        throw error;
    }
}


module.exports = deleteNullBichamBills;
