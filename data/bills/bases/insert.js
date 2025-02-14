const db = require("../../db");


async function createTable(connection)
{
    const query = `
        CREATE TABLE IF NOT EXISTS Bills (
            bill_id VARCHAR(15) PRIMARY KEY,
            congress TINYINT,
            type VARCHAR(7),
            bill_num VARCHAR(5),
            vote CHAR(1),
            h_vote_num VARCHAR(5),
            h_year SMALLINT,
            s_vote_num VARCHAR(5),
            s_session TINYINT
        );
    `;
    try {
        await connection.execute(query);
    } catch (error) {
        console.error(`${__filename}\nError in createTable() | ${error}`);
    }
}


async function insert(connection, records)
{
    const query = `
        INSERT IGNORE INTO Bills
        (bill_id, congress, type, bill_num, vote, h_vote_num, h_year, s_vote_num, s_session)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    let affectedRows = 0;
    let ignoredRecords = [];
    for (const record of records) {
        try {
            const [result] = await connection.execute(query, [
                record.bill_id,
                record.congress,
                record.type,
                record.bill_num,
                record.vote,
                record.h_vote_num,
                record.h_year,
                record.s_vote_num,
                record.s_session
            ]);
            result.affectedRows > 0
                ? affectedRows++
                : ignoredRecords.push(record.bill_id); 
        } catch (error) {
            console.error(`${__filename}\nError in insert() | ${error}`);

        }
    }
    console.log("\nFinished inserting record(s):");
    console.log(`  Inserted: ${affectedRows}`);
    console.log(`  Ignored:  ${ignoredRecords.length}  |  ${ignoredRecords.slice(0, 10)}...`);
}


async function main(records)
{
    console.log("\nStarted inserting records:\n", records.slice(0, 10));
    const connection = await db.getConnection()
    try {
        await createTable(connection);
        await insert(connection, records);
    } finally {
        connection.release();
    }
}


module.exports = main;
