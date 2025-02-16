module.exports = function (schema)
{
    Object.freeze(schema);
    return new Proxy({ ...schema }, {
        set(target, prop, value) {
            if (!(prop in target)) {
                throw new Error(
                    `\n${__filename}\nError | Invalid property: ${prop}\n` +
                    `Expected one of: ${Object.keys(target).join(" | ")}`
                );
            }
            target[prop] = value;
            return true;
        } 
    });
}
