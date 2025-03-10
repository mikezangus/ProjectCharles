const pool = require("../db");
const { spawn } = require("child_process");
const buildWebDriver = require("./buildWebDriver");
const convertBillType = require("./convertBillType");
const createURL = require("./createURL");
const currentCongress = require("../currentCongress");
const fetchBillMetadataFromDB = require("./fetchBillMetadataFromDB");
const saveBillTextToTxtFile = require("./saveBillTextToTxtFile");
const scrapeBillTextFromWeb = require("./scrapeBillTextFromWeb");


const START_CONGRESS = 103;
const END_CONGRESS = currentCongress();


async function main()
{
    const caffeinate = spawn(
        "caffeinate",
        ["-d", "-i", "-s", "-u"],
        { detached: false, stdio: "ignore" }
    );
    let connection = null;
    let webDriver = null;
    let webDriverWrapper = null;
    try {
        connection = await pool.getConnection();
        const billMetadata = await fetchBillMetadataFromDB(
            connection,
            START_CONGRESS,
            END_CONGRESS
        );
        const len = billMetadata.length;
        webDriver = await buildWebDriver();
        webDriverWrapper = { instance: webDriver };
        for (const [i, bill] of billMetadata.entries()) {
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
        if (connection) {
            connection.release();
        }
        if (webDriverWrapper.instance) {
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
