const { spawn } = require("child_process");
const { parseHouseXmlToElements, parseSenateXmlToElements} = require("./parseXmlToElements");
const { populateFieldsHouse, populateFieldsSenate } = require("./populateFields");
const currentCongress = require("../currentCongress");
const fetchBillsFromDB = require("./fetchBillsFromDB");
const fetchVotesFromWeb = require("./fetchVotesFromWeb");
const insertIntoDB = require("./insertIntoDB");
const pool = require("../db");


const START_CONGRESS = 102; // 102 is minimum, no online vote archiving pre-102
const END_CONGRESS = 118;


async function main()
{
    const caffeinate = spawn("caffeinate",
                             ["-d", "-i", "-s", "-u"],
                             { detached: false, stdio: "ignore" });
    let connection = null;
    try {
        const votes = [];
        connection = await pool.getConnection();
        const bills = await fetchBillsFromDB(connection, START_CONGRESS, END_CONGRESS);
        const len = bills.length;
        for (const [i, bill] of bills.entries()) {
            console.log(`[${i}/${len - 1}] ${bill.bill_id}`);
            const [hVotesXml, sVotesXml] = await fetchVotesFromWeb(bill);
            const hVotesElements = hVotesXml
                ? parseHouseXmlToElements(hVotesXml)
                : [];
            const sVotesElements = sVotesXml
                ? parseSenateXmlToElements(sVotesXml)
                : [];
            const hVotes = hVotesElements.length > 0
                ? await populateFieldsHouse(hVotesElements, bill.bill_id, bill.congress, connection)
                : [];
            const sVotes = sVotesElements.length > 0
                ? await populateFieldsSenate(sVotesElements, bill.bill_id, bill.congress, connection)
                : [];
            votes.push(...hVotes, ...sVotes);
        }
        if (votes.length < 0) {
            throw new Error("Empty votes array");
        }
        await insertIntoDB(votes, connection);
    } catch (error) {
        console.error(error);
    } finally {
        if (connection) {
            connection.release();
        }
    }
    try {
        await pool.end();
    } catch (error) {
        console.error(error);
    }
    caffeinate.kill("SIGTERM");
}


if (require.main === module) {
    (async () => {
        await main();
        process.exit(0);
    })();
}
