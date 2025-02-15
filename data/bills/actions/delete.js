const printError = require("../../printError");


module.exports = async function (billIDs, connection)
{
    if (!billIDs || billIDs.length === 0) {
        console.log(`\n${__filename}\nError | No billIDs provided`);
        return;
    }
    console.log(`Started deleting ${billIDs.length} possible rows with no chamber info`);
    const placeholders = billIDs.map(() => "?").join(", ");
    const query = `
        DELETE FROM Bills
        WHERE bill_id IN (${placeholders})
            AND h_vote_num IS NULL
            AND h_year IS NULL
            AND s_vote_num IS NULL
            AND s_session IS NULL
    `;
    try {
        const [result] = await connection.execute(query, billIDs);
        console.log(`Finished deleting ${result.affectedRows} rows with no chamber info`);
    } catch (error) {
        printError(__filename, null, error);
    }
}
