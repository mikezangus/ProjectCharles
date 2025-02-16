const printError = require("../../printError");


module.exports = async function (rows, connection)
{
    const query = `
        UPDATE Bills
        SET
            h_vote_num = COALESCE(?, h_vote_num),
            h_year = COALESCE(?, h_year),
            s_vote_num = COALESCE(?, s_vote_num),
            s_session = COALESCE(?, s_session)
        WHERE bill_id = ?;
    `;
    let affectedCount = 0;
    let ignoredCount = 0;
    for (const row of rows) {
        try {
            const [result] = await connection.execute(query, [
                row.h_vote_num,
                row.h_year,
                row.s_vote_num,
                row.s_session,
                row.bill_id
            ]);
            result.affectedRows > 0 ? affectedCount++ : ignoredCount++;
        } catch (error) {
            printError(__filename, null, error);
        }
    }
    console.log(`\nFinished inserting ${affectedCount} rows. Ignored ${ignoredCount} rows`);
}
