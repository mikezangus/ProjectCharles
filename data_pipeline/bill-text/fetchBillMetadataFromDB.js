async function fetchBillMetadataFromDB(connection, startCongress, endCongress)
{
    const query = `
        SELECT * FROM Bills WHERE congress BETWEEN ? AND ?;
    `;
    try {
        const [response] = await connection.execute(
            query,
            [startCongress, endCongress]
        );
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


module.exports = fetchBillMetadataFromDB;
