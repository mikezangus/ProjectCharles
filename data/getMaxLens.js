module.exports = function (records)
{
    const maxLens = {};
    for (const record of records) {
        for (const key in record) {
            const valueLen = record[key] ? String(record[key]).length : 0;
            maxLens[key] = Math.max(maxLens[key] || 0, valueLen);
        }
    }
    console.log("Max lengths:\n", maxLens);
}
