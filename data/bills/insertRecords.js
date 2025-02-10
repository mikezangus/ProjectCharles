const sql = require("mysql2/promise");
const pool = require("../db");


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
        console.error(`
            ${__filename}
            Error in createTable() | ${error}
        `);
    }
}


async function insertRecords(connection, records)
{
    const query = `
        INSERT IGNORE INTO Bills
        (bill_id, congress, type, bill_num, vote, h_vote_num, h_year, s_vote_num, s_session)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `
    for (const record of records) {
        try {
            await connection.execute(query, [
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
        } catch (error) {
            console.error(`
                ${__filename}
                Error in insertRecords() | ${error}
            `);
        }
    }
}


async function main(records)
{
    const connection = await pool.getConnection();
    await createTable(connection);
    await insertRecords(connection, records);
    connection.release();
}


module.exports = main;
