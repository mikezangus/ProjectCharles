const axios = require("axios");
const { CONGRESS_API_KEY: API_KEY } = require("../../config.json");
const createRecord = require("../createRecord");
const schema = require("./schema");
const getBillID = require("../createBillID");


const CONGRESS = 117;
const TYPE = "HR";
const BILL_NUM = 4346;


async function fetchResponse()
{
    try {
        const response = await axios.get(
            `https://api.congress.gov/v3/bill/${CONGRESS}/${TYPE}/${BILL_NUM}`,
            { params: { api_key: API_KEY, format: "json" } }
        );
        return response.data.bill || [];
    } catch (error) {
        console.error(`\n${__filename}\n` +
                      `Error on fetchResponse |`, error.message);
        return [];
    }
}


async function main()
{
    const record = await fetchResponse();
    let r = createRecord(schema);
    r.bill_id = getBillID(record.congress, record.type, record.number);
    r.congress = record.congress;
    r.type = record.type;
    r.bill_num = record.number;
    return [r];
}


module.exports = main;
