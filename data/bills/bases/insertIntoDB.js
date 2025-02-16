const printError = require("../../printError");


async function createTable(connection)
{
    const query = `
        CREATE TABLE IF NOT EXISTS Bills (
            bill_id VARCHAR(15) PRIMARY KEY,
            congress TINYINT,
            type VARCHAR(7),
            bill_num VARCHAR(5),
            h_vote_num VARCHAR(5),
            h_year SMALLINT,
            s_vote_num VARCHAR(5),
            s_session TINYINT
        );
    `;
    try {
        await connection.execute(query);
    } catch (error) {
        printError(__filename, "createTable()", error);
    }
}


module.exports = async function (rows, connection)
{
    await createTable(connection);
    const query = `
        INSERT IGNORE INTO Bills
        (bill_id, congress, type, bill_num, h_vote_num, h_year, s_vote_num, s_session)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;
    let affectedCount = 0;
    let ignoredCount = 0;
    console.log(`\nStarted inserting ${rows.length} rows`);
    for (const row of rows) {
        try {
            const [result] = await connection.execute(query, [
                row.bill_id,
                row.congress,
                row.type,
                row.bill_num,
                row.h_vote_num,
                row.h_year,
                row.s_vote_num,
                row.s_session
            ]);
            result.affectedRows > 0 ? affectedCount++ : ignoredCount++; 
        } catch (error) {
            printError(__filename, null, error);
        }
    }
    console.log(`Finished inserting ${affectedCount} rows. Ignored ${ignoredCount} rows\n`);
}
