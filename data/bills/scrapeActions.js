const axios = require("axios");
const { CONGRESS_API_KEY: API_KEY } = require("../../config.json");


function populateHouseFields(dst, src)
{
    for (const action of src) {
        if (!action.recordedVotes) {
            continue;
        }
        for (const v of action.recordedVotes) {
            if (v.chamber === "House" && v.date && v.rollNumber) {
                dst.h_year = v.date.slice(0, 4);
                dst.h_vote_num = v.rollNumber;
                console.log("updated house\n", dst);
                return;
            }
        }
    }
}


function populateSenateFields(dst, src)
{
    console.log("senate response:\n", src);
    for (const action of src) {
        if (!action.recordedVotes) {
            continue;
        }
        for (const v of action.recordedVotes) {
            if (v.chamber === "Senate" && v.rollNumber && v.sessionNumber) {
                dst.s_vote_num = v.rollNumber;
                dst.s_session = v.sessionNumber;
                console.log("updated senate\n", dst);
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
        return response.data.actions.filter(
            action => action.recordedVotes && action.recordedVotes.length > 0
        ) || [];
    } catch (error) {
        console.error(`\n${__filename}\nError in fetchResponse for ${congress}${type}${billNum} |`, error.message);
        return [];
    }
}


async function main(records)
{
    let i = 0;
    let len = records.length;
    let yes = 0;
    let no = 0;
    for (const record of records) {
        const response = await fetchResponse(record.congress,
                                             record.type,
                                             record.bill_num);
        i++;
        console.log(`${i}/${len} ${response.length > 0 ? '✅' : '❌'}`);
        response.length > 0 ? yes++ : no++;
        if (response.length === 0) continue;
        populateHouseFields(record, response);
        populateSenateFields(record, response);
    }
    console.log(`Counts  |  Y = ${yes}, N = ${no}`);
    for (const rec of records) {
        if (rec.h_vote_num || rec.s_vote_num) {
            console.log(rec);
        }
    }
}


if (require.main === module) {
    (async () => {
        console.log(await main());
    })();
}


module.exports = main;
