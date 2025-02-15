const axios = require("axios");
const { CONGRESS_API_KEY: API_KEY } = require("../../../config.json");
const { populateHouseFields, populateSenateFields } = require("./populate");
const printError = require("../../printError");


async function request(congress, type, billNum)
{
    const url = "https://api.congress.gov/v3/bill/" +
                `${congress}/${type.toLowerCase()}/${billNum}/` +
                `actions?api_key=${API_KEY}&format=json&sort=updateDate+desc`;
    try {
        const response = await axios.get(url)
        return response.data.actions || [];
    } catch (error) {
        throw error;
    }
}


async function handleRateLimit(request)
{
    let attempts = 0;
    let delay = 10000;
    const maxAttempts = 10;
    while (attempts < maxAttempts) {
        try {
            return await request();
        } catch (error) {
            if (error.response && error.response.status === 429) {
                attempts++;
                console.warn(`⏳ Rate limit hit on attempt [${attempts}/${maxAttempts}]. Retrying in ${delay / 1000}s`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2;
            } else {
                printError(__filename, "handleRateLimit()", error);
                return [];
            }
        }
    }
    console.error(`\n${__filename}\nMaximum attempts hit. Failed to fetch response`);
    return [];
}


async function fetchResponse(congress, type, billNum)
{
    if (!congress || !type || !billNum) return [];
    const response = await handleRateLimit(() => request(congress, type, billNum));
    return response
        ? response.filter(action => 
            action.recordedVotes && action.recordedVotes.length > 0)
        : [];
}


module.exports = async function (srcRows, mode)
{ 
    if (!srcRows || srcRows.length < 1 || ![0, 1, 2].includes(mode)) return;
    let i = 0, y = 0, n = 0;
    let len = srcRows.length;
    let dstRows = [];
    for (const srcRow of srcRows) {
        const response = await fetchResponse(srcRow.congress,
                                             srcRow.type,
                                             srcRow.bill_num);
        console.log(`${response.length > 0 ? '✅' : '❌'} ${++i}/${len} | ${srcRow.bill_id}`);
        if (response.length == 0) {
            n++;
            continue;
        }
        y++;
        let dstRow = { ...srcRow };
        if (mode === 0 || mode === 1) populateHouseFields(dstRow, response);
        if (mode === 0 || mode === 2) populateSenateFields(dstRow, response);
        dstRows.push(dstRow);
    }
    console.log(`✅: ${y}  |  ❌: ${n}`);
    return dstRows;
}
