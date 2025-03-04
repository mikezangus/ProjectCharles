function populateNullBills(bills, actions)
{
    const populatedBills = [];
    for (const bill of bills) {
        const billActions = actions.find(actionSet =>
            actionSet.bill_id === bill.bill_id
        );
        if (!billActions || billActions.length === 0) {
            continue;
        }
        for (const action of billActions) {
            if (!action.recordedVotes) {
                continue;
            }
            for (const vote of action.recordedVotes) {
                if (vote.chamber === "House"
                    && vote.date && vote.rollNumber) {
                    bill.h_year = vote.date.slice(0, 4);
                    bill.h_vote_num = vote.rollNumber;
                } else if (vote.chamber === "Senate"
                           && vote.rollNumber && vote.sessionNumber) {
                    bill.s_vote_num = vote.rollNumber;
                    bill.s_session = vote.sessionNumber;
                }
            }
            populatedBills.push(bill);
        }
    }
    return populatedBills;
}


module.exports = populateNullBills;
