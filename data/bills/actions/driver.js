const deleteRows = require("./delete");
const insert = require("./insert");
const scrape = require("./scrape");


module.exports = async function (src, mode, connection)
{
    if (src.length < 1) return;
    const dst = await scrape(src, mode);
    await insert(dst, connection);
    await deleteRows(src.map(row => row.bill_id), connection);
}
