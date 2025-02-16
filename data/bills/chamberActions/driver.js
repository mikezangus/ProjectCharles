const deleteRows = require("./deleteNullChamberRows");
const fetch = require("./fetchChamberFields");
const insert = require("./insertIntoDB");


module.exports = async function (src, mode, connection)
{
    if (src.length < 1) return;
    const dst = await fetch(src, mode);
    await insert(dst, connection);
    await deleteRows(src.map(row => row.bill_id), connection);
}
