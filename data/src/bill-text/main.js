const pool = require("../db");
const { spawn } = require("child_process");
const buildWebDriver = require("./buildWebDriver");
const convertBillType = require("./convertBillType");
const createURL = require("./createURL");
const currentCongress = require("../currentCongress");
const fetchBillMetadataFromDB = require("./fetchBillMetadataFromDB");
const getSavedBillIDs = require("./getSavedBillIDs");
const saveBillTextToTxtFile = require("./saveBillTextToTxtFile");
const scrapeBillTextFromWeb = require("./scrapeBillTextFromWeb");
const writeLog = require("../utils/writeLog");


const START_CONGRESS = 102;
const END_CONGRESS = currentCongress();


async function main()
{
    const caffeinate = spawn(
        "caffeinate",
        ["-d", "-i", "-s", "-u"],
        { detached: false, stdio: "ignore" }
    );
    let webDriver = null;
    let webDriverWrapper = null;
    try {
        const billMetadata = await fetchBillMetadataFromDB(
            await pool.getConnection(),
            START_CONGRESS,
            END_CONGRESS
        );
        await pool.end();
        const savedBillIDs = getSavedBillIDs();
        const bills = billMetadata.filter(
            bill => !savedBillIDs.includes(bill.bill_id)
        );
        const len = bills.length;
        webDriver = await buildWebDriver();
        webDriverWrapper = { instance: webDriver };
        writeLog(`\n${"—".repeat(50)}\nNEW RUN\n${"—".repeat(50)}`);
        for (const [i, bill] of bills.entries()) {
            const { congress, type, bill_num, bill_id } = bill;
            console.log(`\n[${i + 1}/${len}]`, bill_id);
            const url = createURL(congress, convertBillType(type), bill_num);
            const billText = await scrapeBillTextFromWeb(webDriverWrapper, url);
            if (!billText) {
                console.log("❌");
                continue;
            }
            saveBillTextToTxtFile(bill_id, billText);
            console.log("✅");
        }
    } catch (error) {
        console.error(error);
    } finally {
        if (webDriverWrapper && webDriverWrapper.instance) {
            await webDriverWrapper.instance.quit();
        }
        caffeinate.kill("SIGTERM");
    }
}


if (require.main === module) {
    (async () => {
        await main();
        process.exit(0);
    })();
}
