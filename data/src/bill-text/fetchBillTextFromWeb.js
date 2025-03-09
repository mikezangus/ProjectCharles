const { By, until } = require("selenium-webdriver");
const writeLog = require("../utils/writeLog");
const buildWebDriver = require("./buildWebDriver");


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


async function sludge(fnctn, timeout)
{
    try {
        return await Promise.race([
            fnctn(),
            new Promise((_, reject) =>
                setTimeout(
                    () => reject(new Error()),
                    timeout
                )
            )
        ]);
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
            console.log("Only found PDF");
            return 1;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}


async function fetchBillTextFromWeb(webDriverWrapper, url) {
    let attempts = 0;
    const maxAttempts = 5;
    while (attempts < maxAttempts) {
        const webDriver = webDriverWrapper.instance;
        try {
            await webDriver.manage().setTimeouts({ pageLoad: 15000 });
        } catch (error) {
            console.error(error);
            continue;
        }
        const result = await sludge(
            () => getTextElement(webDriver, url),
            10000
        );
        if (typeof result === "number" && result === 1) {
            writeLog(`PDF only - ${url}`);
            return null;
        }
        if (!result) {
            console.log(`Failed on attempt ${++attempts}/${maxAttempts}.`);
            await webDriver.quit();
            webDriverWrapper.instance = await buildWebDriver();
            continue;
        }
        return await result.getText();
    }
    writeLog(url);
    return null;
}


module.exports = fetchBillTextFromWeb;
