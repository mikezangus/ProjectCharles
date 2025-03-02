function printMaxLengths(records)
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


function printMinLengths(records)
{
    const minLens = {};
    for (const record of records) {
        for (const key in record) {
            const valueLen = record[key] ? String(record[key]).length : 0;
            minLens[key] = Math.min(minLens[key] || 0, valueLen);
        }
    }
    console.log("Min lengths:\n", minLens);
}


function printLengths(records)
{
    printMaxLengths(records);
    printMinLengths(records);
}


module.exports = printLengths;
