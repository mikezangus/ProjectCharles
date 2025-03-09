const os = require("os");
const pool = require("../db");
const { spawn } = require("child_process");
const fetchBillMetadataFromDB = require("./fetchBillMetadataFromDB");
const scrapeBatch = require("./processBatch");
const splitBillMetadataIntoBatches = require("./splitArrayBatches");


async function main() {
    const caffeinate = spawn("caffeinate",
                             ["-d", "-i", "-s", "-u"],
                             { detached: false, stdio: "ignore" });
    let connection = null;
    try {
        connection = await pool.getConnection();
        const billMetadata = await fetchBillMetadataFromDB(connection);
        const coreCount = os.cpus().length;
        console.log("Core count:", coreCount);
        const batchCount = parseInt(Math.min(coreCount, billMetadata.length));
        const batches = splitBillMetadataIntoBatches(billMetadata, batchCount);
        await Promise.all(batches.map(
            (batch, index) => scrapeBatch(batch, index)
        ));
    } finally {
        if (connection) {
            connection.release();
        }
    }
    caffeinate.kill("SIGTERM");
}


if (require.main === module) {
    (async () => {
        await main();
        process.exit(0);
    })();
}
