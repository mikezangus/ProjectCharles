const BATCH_SIZE = 1000;


async function createTable(connection)
{
    const query = `
        CREATE TABLE IF NOT EXISTS Votes (
            bill_id VARCHAR(15) NOT NULL,
            bio_id CHAR(7) NOT NULL,
            vote CHAR(1) NOT NULL,
            chamber CHAR(1) NOT NULL,
            PRIMARY KEY (bill_id, bio_id)
        )
    `;
    try {
        await connection.execute(query);
    } catch (error) {
        console.error(error);
        throw error;
    }
}


async function insertIntoDB(rows, connection)
{
    const query = (placeholders) => `
        INSERT IGNORE INTO Votes
        (bill_id, bio_id, vote, chamber)
        VALUES ${placeholders}
    `;
    const len = rows.length;
    try {
        console.log(`Started inserting ${len} rows into table Votes`);
        await createTable(connection);
        let affectedCount = 0;
        for (let i = 0; i < len; i += BATCH_SIZE) {
            const batchEnd = Math.min(i + BATCH_SIZE, len);
            console.log(`Batch [${i} - ${batchEnd}] out of ${len}`);
            const batch = rows.slice(i, batchEnd);
            const placeholders = batch.map(() => "(?, ?, ?, ?)").join(", ");
            const values = batch.flatMap(row =>
                [row.bill_id, row.bio_id, row.vote, row.chamber]
            );
            const [result] = await connection.execute(query(placeholders), values);
            affectedCount += result.affectedRows;
        }
        console.log(`Finished inserting ${affectedCount} rows into table Votes. Ignored ${len - affectedCount} rows`);
    } catch (error) {
        console.error(error);
        throw error;
    }
}


module.exports = insertIntoDB;
