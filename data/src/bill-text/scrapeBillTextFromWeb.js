const { By, until } = require("selenium-webdriver");
const buildWebDriver = require("./buildWebDriver");
const sludge = require("../utils/sludge");
const writeLog = require("../utils/writeLog");


async function findTextElement(driver)
{
    const xpath = "/html/body/div[2]/div/main/div[2]/div[2]/div[2]/pre";
    try {
        return await driver.wait(
            until.elementLocated(By.xpath(xpath)),
            5000
        );
    } catch (error) {
        return null;
    }
}


async function findPdfElement(driver)
{
    const xpath = "/html/body/div[2]/div/main/div[2]/div/embed";
    try {
        return await driver.wait(
            until.elementLocated(By.xpath(xpath)),
            5000
        );
    } catch (error) {
        return null;
    }
}


async function getTextElement(webDriver, url)
{
    try {
        const textElement = await findTextElement(webDriver);
        if (textElement) {
            return textElement;
        }
        const pdfElement = await findPdfElement(webDriver);
        if (pdfElement) {
            return 1;
        }
    } catch (error) {
        return null;
    }
}


async function scrapeBillTextFromWeb(webDriverWrapper, url)
{
    const maxAttempts = 5;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        if (attempt > 0) {
            console.log(`Attempt ${attempt + 1}/${maxAttempts}`);
        }
        const webDriver = webDriverWrapper.instance;
        try {
            await webDriver
                .manage()
                .setTimeouts({ pageLoad: 10000 });
            await webDriver.get(url);
        } catch (error) {
            continue;
        }
        const result = await sludge(
            () => getTextElement(webDriver, url),
            10000
        );
        if (typeof result === "number" && result === 1) {
            console.log("PDF only");
            writeLog(`PDF only | ${url}`);
            return null;
        }
        if (!result) {
            await webDriver.quit();
            webDriverWrapper.instance = await buildWebDriver();
            continue;
        }
        return await result.getText();
    }
    writeLog(url);
    return null;
}


module.exports = scrapeBillTextFromWeb;
