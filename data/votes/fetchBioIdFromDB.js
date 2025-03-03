const xpath = require("xpath");


function extractBioInfo(voteElements, chamber)
{
    let state = null;
    let lastName = null;
    let party = null;
    if (chamber === 'H') {
        state = voteElements.getAttribute("state") || null;
        lastName = voteElements.firstChild
            ? voteElements.firstChild.nodeValue.trim()
            : null;
        party = voteElements.getAttribute("party") || null;
    } else if (chamber === 'S') {
        state = xpath.select1("string(state)", voteElements) || null;
        lastName = xpath.select1("string(last_name)", voteElements) || null;
        party = xpath.select1("string(party)", voteElements) || null;
    } else {
        throw new Error(`Invalid chamber=${chamber}`);
    }
    if (!state || !lastName || !party) {
        throw new Error(`state=${state} | lastName=${lastName} | party=${party}`);
    }
    return { state, lastName, party };
}


async function fetchBioIdFromDB(connection, chamber, congress, voteElements)
{
    const query = `
        SELECT bio_id FROM Members
        WHERE last_name = ?
            AND state = ?
            AND congress = ?
            AND party = ?
            AND chamber = ?
    `;
    try {
        const { state, lastName, party } = extractBioInfo(voteElements, chamber);
        const [response] = await connection.execute(
            query,
            [lastName, state, congress, party, chamber]
        );
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


module.exports = fetchBioIdFromDB;
