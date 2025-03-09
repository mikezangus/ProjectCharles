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
        await webDriver.get(url);
        const textElement = await findTextElement(webDriver);
        if (textElement) {
            return textElement;
        }
        const pdfElement = await findPdfElement(webDriver);
        if (pdfElement) {
            return 1;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}


async function scrapeBillTextFromWeb(webDriverWrapper, url) {
    let attempts = 0;
    const maxAttempts = 5;
    while (attempts < maxAttempts) {
        const webDriver = webDriverWrapper.instance;
        try {
            await webDriver.manage().setTimeouts({ pageLoad: 10000 });
        } catch (error) {
            writeLog(`Error: ${error} | ${url}`);
            continue;
        }
        const result = await sludge(
            () => getTextElement(webDriver, url),
            10000
        );
        if (typeof result === "number" && result === 1) {
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
