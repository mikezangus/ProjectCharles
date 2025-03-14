const buildWebDriver = require("./buildWebDriver");
const convertBillType = require("./convertBillType");
const createURL = require("./createURL");
const saveBillTextToTxtFile = require("./saveBillTextToTxtFile");
const scrapeBillTextFromWeb = require("./scrapeBillTextFromWeb");


async function processBatch(batch)
{
    let webDriver = null;
    let webDriverWrapper = null
    const len = batch.length;
    try {
        webDriver = await buildWebDriver();
        webDriverWrapper = { instance: webDriver };
        for (const [i, bill] of batch.entries()) {
            console.log(`\n[${i + 1} / ${len}]`);
            const { congress, type, bill_num, bill_id } = bill;
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
        if (webDriverWrapper.instance) {
            await webDriverWrapper.instance.quit();
        }
    }
}


module.exports = processBatch;
