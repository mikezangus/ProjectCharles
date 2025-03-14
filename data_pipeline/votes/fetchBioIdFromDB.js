const xpath = require("xpath");
const cleanLastName = require("../utils/cleanLastName");
const writeLog = require("../utils/writeLog");


function extractBioInfo(voteElements, chamber)
{
    let state = null;
    let lastName = null;
    let party = null;
    try {
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
            throw new Error(`Invalid value:\nchamber=${chamber}`);
        }
        if (!state || !lastName || !party) {
            throw new Error(`Invalid value(s):\nstate=${state} | lastName=${lastName} | party=${party}`);
        }
        return { state, lastName, party };
    } catch (error) {
        console.error(`state=${state} lastName=${lastName} party=${party}`);
        throw error;
    }
}


async function fetchResponse(connection, lastName, state, congress, party, chamber)
{
    const query = `
        SELECT bio_id FROM Members
        WHERE last_name = ?
            AND state = ?
            AND congress = ?
            AND party = ?
            AND chamber = ?
    `;
    const [response] = await connection.execute(
        query,
        [lastName, state, congress, party, chamber]
    );
    return response.length > 0
        ? response[0].bio_id
        : null;
}


async function fetchBioIdFromDB(connection, chamber, congress, voteElements)
{
    try {
        const { state, lastName, party } = extractBioInfo(voteElements, chamber);
        let bioID = null;
        bioID = fetchResponse(
            connection, lastName, state, congress, party, chamber
        );
        if (bioID) {
            return bioID;
        }
        bioID = fetchResponse(
            connection, cleanLastName(lastName), state, congress, party, chamber
        );
        if (bioID) {
            return bioID;
        }
        writeLog(`Failed to get bio_id from DB:\nlastName=${lastName} | state=${state} | congress=${congress} | party=${party} | chamber=${chamber}\nResponse:\n${response}`);
        return null;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


module.exports = fetchBioIdFromDB;
