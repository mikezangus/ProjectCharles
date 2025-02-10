const axios = require("axios");
const { CONGRESS_API_KEY: API_KEY } = require("../../config.json");


function populateHouseFields(record, response)
{
    for (const action of response) {
        if (!action.recordedVotes) {
            continue;
        }
        for (const v of action.recordedVotes) {
            if (v.chamber === "House" && v.date && v.rollNumber) {
                record.h_year = v.date.slice(0, 4);
                record.h_vote_num = v.rollNumber;
                return;
            }
        }
    }
}


function populateSenateFields(record, response)
{
    for (const action of response) {
        if (!action.recordedVotes) {
            continue;
        }
        for (const v of action.recordedVotes) {
            if (v.chamber === "Senate" && v.rollNumber && v.sessionNumber) {
                record.s_vote_num = v.rollNumber;
                record.s_session = v.sessionNumber;
                return;
            }
        }
    }
}


async function fetchResponse(congress, type, billNum)
{
    if (!congress || !type || !billNum) {
        return [];
    }
    const url = "https://api.congress.gov/v3/bill/" +
                `${congress}/${type.toLowerCase()}/${billNum}/` +
                `actions?api_key=${API_KEY}&format=json&sort=updateDate+desc`;
    try {
        const response = await axios.get(url);
        return response.data.actions || [];
    } catch (error) {
        console.error(`\n${__filename}\n` +
                      `Error on fetchResponse |`, error.message);
        return [];
    }
}


async function main(records)
{
    for (const record of records) {
        const response = await fetchResponse(record.congress,
                                             record.type,
                                             record.bill_num);
        populateHouseFields(record, response);
        populateSenateFields(record, response);
    }
}


if (require.main === module) {
    (async () => {
        console.log(await main());
    })();
}


module.exports = main;
