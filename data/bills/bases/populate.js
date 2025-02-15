const createBillID = require("../../createBillID");
const createRecord = require("../../createRecord");
const schema = require("../schema");


module.exports = function (record)
{
    const r = createRecord(schema);
    if (!(r.bill_id = createBillID(record.congress,
                                   record.type,
                                   record.number))) return null;
    r.congress = record.congress;
    r.type = record.type;
    r.bill_num = record.number;
    return r;
}
