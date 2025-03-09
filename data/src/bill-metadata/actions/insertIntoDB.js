async function insertIntoDB(bills, connection)
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
    const len = bills.length;
    if (len < 1) {
        return;
    }
    let affectedCount = 0;
    try {
        console.log(`Started inserting ${len} rows into table Bills`);
        for (const bill of bills) {
            const [result] = await connection.execute(query, [
                bill.h_vote_num,
                bill.h_year,
                bill.s_vote_num,
                bill.s_session,
                bill.bill_id
            ]);
            affectedCount += result.affectedRows;
        }
        console.log(`Finished inserting ${affectedCount} rows into table Bills. Ignored ${len - affectedCount} rows`);
    } catch (error) {
        console.error(error);
        throw error;
    }
}


module.exports = insertIntoDB;
