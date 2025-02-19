const createBillID = require("../../createBillID");
const createRow = require("../../createRow");
const schema = require("../schema");


module.exports = function (src)
{
    const dst = createRow(schema);
    if (!(dst.bill_id = createBillID(src.congress,
                                     src.type,
                                     src.number))) return null;
    dst.congress = src.congress;
    dst.type = src.type;
    dst.bill_num = src.number;
    return dst;
}
