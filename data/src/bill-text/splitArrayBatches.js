function splitBillMetadataIntoBatches(array, batchCount)
{
    const batches = [];
    const batchSize = Math.ceil(array.length / batchCount);
    for (let i = 0; i < batchCount; i++) {
        batches.push(
            array.slice(
                i * batchSize,
                (i + 1) * batchSize
            )
        );
    }
    return batches;
}


module.exports = splitBillMetadataIntoBatches;
