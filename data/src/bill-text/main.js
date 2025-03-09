const pool = require("../db");
const { spawn } = require("child_process");
const convertBillType = require("./convertBillType");
const createWebDriver = require("./buildWebDriver");
const createURL = require("./createURL");
const fetchBillMetadataFromDB = require("./fetchBillMetadataFromDB");
const fetchBillTextFromWeb = require("./fetchBillTextFromWeb");
const saveBillTextToTxtFile = require("./saveBIllTextToTxtFile");


async function main() {
    const caffeinate = spawn("caffeinate",
                                ["-d", "-i", "-s", "-u"],
                                { detached: false, stdio: "ignore" });
    let dbConnection = null;
    let webDriver = null;
    let webDriverWrapper = null;
    try {
        dbConnection = await pool.getConnection();
        webDriver = await createWebDriver();
        webDriverWrapper = { instance: webDriver };
        const bills = await fetchBillMetadataFromDB(dbConnection);
        for (const bill of bills) {
            const { congress, type, bill_num, bill_id } = bill;
            const url = createURL(congress, convertBillType(type), bill_num);
            console.log(`\n${url}`);
            const billText = await fetchBillTextFromWeb(webDriverWrapper, url);
            if (!billText) {
                console.log("❌");
                continue;
            }
            saveBillTextToTxtFile(bill_id, billText);
            console.log("✅");
        }
    } finally {
        if (dbConnection) {
            dbConnection.release();
        }
        if (webDriverWrapper.instance) {
            await webDriverWrapper.instance.quit();
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
