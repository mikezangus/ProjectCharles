const axios = require("axios");
const handleRateLimit = require("../handleRateLimit");


function createURLs(congress, hYear, hVoteNum, sVoteNum, sSession)
{
    if (hVoteNum) {
        hVoteNum = String(hVoteNum).padStart(3, '0');
    }
    if (sVoteNum) {
        sVoteNum = String(sVoteNum).padStart(5, '0');
    }
    const hURL = `https://clerk.house.gov/evs/${hYear}/roll${hVoteNum}.xml`;
    const sURL = `https://www.senate.gov/legislative/LIS/roll_call_votes/` +
                 `vote${congress}${sSession}/` +
                 `vote_${congress}_${sSession}_${sVoteNum}.xml`;
    if (congress && hYear && hVoteNum && sVoteNum && sSession) {
        return [hURL, sURL];
    } else if (hYear && hVoteNum && !sVoteNum && !sSession) {
        return [hURL];
    } else if (congress && sVoteNum && sSession && !hYear && !hVoteNum) {
        return [sURL];
    }
    throw new Error(`hYear=${hYear} | hVoteNum=${hVoteNum} | congress=${congress} | sVoteNum=${sVoteNum} | sSession=${sSession}`);
}


async function fetchVotesFromWeb(bill)
{
    const {
        congress,
        h_vote_num: hVoteNum,
        h_year: hYear,
        s_vote_num: sVoteNum,
        s_session: sSession
    } = bill;
    try {
        const urls = createURLs(congress, hYear, hVoteNum, sVoteNum, sSession);
        const responses = [];
        for (let url of urls) {
            const response = await handleRateLimit(
                () => axios.get(url, { responseType: "text" }),
                bill.bill_id
            );
            responses.push(response.data);
        }
        return responses;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


module.exports = fetchVotesFromWeb;
