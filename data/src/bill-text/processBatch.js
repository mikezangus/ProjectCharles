const buildWebDriver = require("./buildWebDriver");
const convertBillType = require("./convertBillType");
const createURL = require("./createURL");
const saveBillTextToTxtFile = require("./saveBillTextToTxtFile");
const scrapeBillTextFromWeb = require("./scrapeBillTextFromWeb");


async function processBatch(batch, index)
{
    let webDriver = null;
    let webDriverWrapper = null
    const len = batch.length;
    try {
        webDriver = await buildWebDriver();
        webDriverWrapper = { instance: webDriver };
        for (const [i, bill] of batch.entries()) {
            const { congress, type, bill_num, bill_id } = bill;
            const url = createURL(congress, convertBillType(type), bill_num);
            if ((i + 1) % Math.ceil(len * 0.05) === 0 || i === len - 1) {
                console.log(`\nBatch #${index}: ${((i + 1) / len * 100).toFixed(0)}%`);
            }
            const billText = await scrapeBillTextFromWeb(webDriverWrapper, url);
            if (!billText) {
                continue;
            }
            saveBillTextToTxtFile(bill_id, billText);
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
