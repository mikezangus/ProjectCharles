function createRow(schema)
{
    Object.freeze(schema);
    return new Proxy({ ...schema }, {
        set(target, prop, value) {
            if (!(prop in target)) {
                throw new Error(`Invalid prop: ${prop}\nExpected one of: ${Object.keys(target).join(" | ")}`);
            }
            target[prop] = value;
            return true;
        } 
    });
}


module.exports = createRow;
