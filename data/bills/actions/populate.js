function populateHouseFields(dst, src)
{
    for (const action of src) {
        if (!action.recordedVotes) continue;
        for (const v of action.recordedVotes) {
            if (v.chamber !== "House" || !v.date || !v.rollNumber) continue;
            dst.h_year = v.date.slice(0, 4);
            dst.h_vote_num = v.rollNumber;
            console.log("House:", dst);
            return;
        }
    }
}


function populateSenateFields(dst, src)
{
    for (const action of src) {
        if (!action.recordedVotes) continue;
        for (const v of action.recordedVotes) {
            if (v.chamber !== "Senate" || !v.rollNumber || !v.sessionNumber) continue;
            dst.s_vote_num = v.rollNumber;
            dst.s_session = v.sessionNumber;
            console.log("Senate:", dst);
            return;
        }
    }
}


module.exports = { populateHouseFields, populateSenateFields };
