const axios = require("axios");
const { CONGRESS_API_KEY: API_KEY } = require("../../../config.json");
const handleRateLimit = require("../handleRateLimit");
const { populateHouseFields, populateSenateFields } = require("./populateFields");
const printError = require("../../printError");


async function fetchResponse(congress, type, billNum)
{
    const url = "https://api.congress.gov/v3/bill/" +
                `${congress}/${type.toLowerCase()}/${billNum}/` +
                `actions?api_key=${API_KEY}&format=json&sort=updateDate+desc`;
    const response = await axios.get(url);
    return response.data.actions || [];
}


async function handleFetch(congress, type, billNum)
{
    if (!congress || !type || !billNum) return [];
    try {
        const response = await handleRateLimit(
            () => fetchResponse(congress, type, billNum)
        );
        return response
            ? response.filter(action => 
                action.recordedVotes && action.recordedVotes.length > 0)
            : [];
    } catch (error) {
        printError(__filename, "handleFetch()", error);
        return [];
    }
}


module.exports = async function (srcRows, mode)
{ 
    if (!srcRows || srcRows.length < 1 || ![0, 1, 2].includes(mode)) return;
    let i = 0, y = 0, n = 0;
    let len = srcRows.length;
    let dstRows = [];
    for (const row of srcRows) {
        const response = await handleFetch(row.congress, row.type, row.bill_num);
        console.log(`${response.length > 0 ? '✅' : '❌'} [${++i}/${len}] ${row.bill_id}`);
        if (response.length === 0) {
            n++;
            continue;
        }
        y++;
        let dstRow = { ...row };
        if (mode === 0 || mode === 1) populateHouseFields(dstRow, response);
        if (mode === 0 || mode === 2) populateSenateFields(dstRow, response);
        dstRows.push(dstRow);
    }
    console.log(`✅: ${y}  |  ❌: ${n}`);
    return dstRows;
}
