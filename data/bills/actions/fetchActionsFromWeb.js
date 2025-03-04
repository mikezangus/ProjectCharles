const axios = require("axios");
const { CONGRESS_API_KEY: API_KEY } = require("../../../config.json");
const handleRateLimit = require("../../handleRateLimit");


const url = (congress, type, billNum) => 
    "https://api.congress.gov/v3/bill/" +
    `${congress}/${type.toLowerCase()}/${billNum}/` +
    `actions?api_key=${API_KEY}&format=json&sort=updateDate+desc`;


async function fetchActionsFromWeb(bills)
{
    let i = 0;
    const len = bills.length;
    const responses = [];
    try {
        for (const bill of bills) {
            let response = await handleRateLimit(
                () => axios.get(
                    url(bill.congress, bill.type, bill.bill_num),
                    { responseType: "json" }),
                bill.bill_id
            );
            const actions = response.data.actions || [];
            const votes = actions.filter(action => 
                action.recordedVotes && action.recordedVotes.length > 0
            );
            console.log(`${votes.length > 0 ? '✅' : '❌'} [${++i}/${len}] ${bill.bill_id}`);
            if (votes.length > 0) {
                responses.push({ billID: bill.bill_id, votes });
            }
        }
        return responses;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


module.exports = fetchActionsFromWeb;
