const xpath = require("xpath");
const createRow = require("../createRow");
const getBioIdFromDB = require("./fetchBioIdFromDB");
const schema = require("./schema");


async function populateFieldsHouse(voteElements, billID, congress, connection)
{
    try {
        return await Promise.all(voteElements.map(async (vote) => {
            const legislator = xpath.select1("legislator", vote);
            if (!legislator) {
                return null;
            }
            const dst = createRow(schema);
            dst.bill_id = billID;
            dst.bio_id = legislator.getAttribute("name-id") || null;
            if (!dst.bio_id) {
                dst.bio_id = await getBioIdFromDB(connection,
                                                  'H',
                                                  congress,
                                                  legislator);
            }
            dst.vote = xpath.select1("string(vote)", vote)?.slice(0, 1) || null;
            dst.chamber = 'H';
            return dst;
        }));
    } catch (error) {
        console.error(error);
        throw error;
    }
}


async function populateFieldsSenate(voteElements, billID, congress, connection)
{
    try {
        return await Promise.all(voteElements.map(async (vote) => {
            const dst = createRow(schema);
            dst.bill_id = billID;
            dst.bio_id = await getBioIdFromDB(connection, 'S', congress, vote);
            dst.vote = xpath.select1("string(vote_cast)", vote)?.slice(0, 1) || null;
            dst.chamber = 'S';
            return dst;
        }));
    } catch (error) {
        console.error(error);
        throw error;
    }
}


module.exports = { populateFieldsHouse, populateFieldsSenate };
