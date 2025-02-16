const createBillID = require("../../createBillID");
const createRow = require("../../createRow");
const schema = require("../schema");


module.exports = function (row)
{
    const row = createRow(schema);
    if (!(row.bill_id = createBillID(row.congress,
                                     row.type,
                                     row.number))) return null;
    row.congress = row.congress;
    row.type = row.type;
    row.bill_num = row.number;
    return row;
}
