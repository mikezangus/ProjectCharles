const schema = {
    bill_id: null,
    bio_id: null,
    vote: null,
    congress: null,
    chamber: null,
    state: null,
    last_name: null,
    first_name: null,
    party: null
};


module.exports = function populateVoteRecord()
{
    return new Proxy({ ...schema }, {
        set(target, prop, value) {
            if (!(prop in target)) {
                throw new Error(`\n${__filename}\nError | Invalid property: ${prop}\n` +
                                `Expected one of: ${Object.keys(target).join(", ")}`);
    
            }
            target[prop] = value;
            return true;
        } 
    });
}
