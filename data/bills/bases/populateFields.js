const createBillID = require("../../createBillID");
const createRow = require("../../createRow");
const schema = require("../schema");


function populateFields(srcBill)
{
    try {
        const dstBill = createRow(schema);
        if (!(dstBill.bill_id = createBillID(srcBill.congress, srcBill.type, srcBill.number))) {
            throw new Error(`Failed to create bill ID\ncongress=${srcBill.congress} | type=${srcBill.type} | bill_num=${srcBill.bill_num}`);
        }
        dstBill.congress = srcBill.congress;
        dstBill.type = srcBill.type;
        dstBill.bill_num = srcBill.number;
        return dstBill;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


module.exports = populateFields;
