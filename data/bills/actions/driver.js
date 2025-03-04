const fetchNullBillsFromDB = require("./fetchNullBillsFromDB");
const fetchActionsFromWeb = require("./fetchActionsFromWeb");
const populateNullBills = require("./populateNullBills");
const insertIntoDB = require("./insertIntoDB");


async function driver(chamber, connection, congress)
{
    const nullBills = await fetchNullBillsFromDB(chamber, connection, congress);
    const actions = nullBills.length > 0
        ? await fetchActionsFromWeb(nullBills)
        : [];
    const populatedBills = actions.length > 0
        ? populateNullBills(nullBills, actions)
        : [];
    await insertIntoDB(populatedBills, connection);
}


module.exports = driver;
