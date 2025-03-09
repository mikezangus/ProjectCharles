async function fetchBillMetadataFromDB(connection) {
    const query = `
        SELECT * FROM Bills;
    `;
    try {
        const [response] = await connection.execute(query);
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


module.exports = fetchBillMetadataFromDB;
