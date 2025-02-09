const { DOMParser } = require("xmldom");
const xpath = require("xpath");


module.exports = function populateRecords(xml, congress, chamber, voteNum)
{
    if (!xml || !congress || !chamber || !voteNum) {
        throw new Error("Error | Null param(s) passed into populateRecords");
    }
    const doc = new DOMParser().parseFromString(xml, "text/xml");
    const members = xpath.select("/roll_call_vote/members/member", doc);
    return members.map(member => ({
        bill_id: `${congress}${chamber}${voteNum}`,
        bio_id: null,
        vote: xpath.select1("string(vote_cast)", member)?.slice(0, 1) || null,
        congress: congress,
        chamber: chamber,
        state: xpath.select1("string(state)", member) || null,
        last_name: xpath.select1("string(last_name)", member) || null,
        first_name: xpath.select1("string(first_name)", member) || null,
        party: xpath.select1("string(party)", member) || null
    }));
}
