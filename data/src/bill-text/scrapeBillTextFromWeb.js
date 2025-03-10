const { By, until } = require("selenium-webdriver");
const buildWebDriver = require("./buildWebDriver");
const sludge = require("../utils/sludge");
const writeLog = require("../utils/writeLog");


const PDF_ONLY = 1;
const PAGE_DOESNT_EXIST = 2;


async function findTextElement(isOriginalURL, webDriver)
{
    const originalXpath = "/html/body/div[2]/div/main/div[2]/div[2]/div[2]/pre";
    const versionXpath = '//*[@id="billTextContainer"]'
    const xpath = isOriginalURL ? originalXpath : versionXpath;
    try {
        return await webDriver.wait(
            until.elementLocated(By.xpath(xpath)),
            5000
        );
    } catch (error) {
        return null;
    }
}


async function findPdfElement(webDriver)
{
    const xpath = "/html/body/div[2]/div/main/div[2]/div/embed";
    try {
        return await webDriver.wait(
            until.elementLocated(By.xpath(xpath)),
            5000
        );
    } catch (error) {
        return null;
    }
}


async function findVersionElement(webDriver)
{
    const xpath = "/html/body/div[2]/div/main/div[2]/div[2]/div[1]/ul/li[2]/a";
    try {
        return await webDriver.wait(
            until.elementLocated(By.xpath(xpath)),
            5000
        );
    } catch (error) {
        return null;
    }
}


async function findErrorElement(webDriver)
{
    const xpath = "/html/body/div[2]/div/main/main/article/h1";
    try {
        const element = await webDriver.wait(
            until.elementLocated(By.xpath(xpath)),
            5000
        );
        const text = await element.getText();
        if (text.includes("couldn't find")) {
            return PAGE_DOESNT_EXIST;
        }
        return null;
    } catch (error) {
        return null;
    }
}


async function getTextElement(isOriginalURL, webDriver)
{
    try {
        const result = await Promise.race([
            findTextElement(isOriginalURL, webDriver),
            findPdfElement(webDriver).then(result => result ? PDF_ONLY : null),
            findErrorElement(webDriver).then(result => result ? PAGE_DOESNT_EXIST : null),
        ]);
        return result ?? await findVersionElement(webDriver);
    } catch (error) {
        return null;
    }
}


async function scrapeBillTextFromWeb(webDriverWrapper, url)
{
    const maxAttempts = 5;
    let privateURL = url;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        if (attempt > 0) {
            console.log(`Attempt ${attempt + 1}/${maxAttempts}`);
        }
        const webDriver = webDriverWrapper.instance;
        try {
            await webDriver
                .manage()
                .setTimeouts({ pageLoad: 10000 });
            await webDriver.get(privateURL);
        } catch (error) {
            continue;
        }
        const result = await getTextElement(privateURL === url, webDriver);
        if (typeof result === "number" && result === PDF_ONLY) {
            console.log("PDF only");
            writeLog(`PDF only | ${url}`);
            return null;
        }
        if (typeof result === "number" && result === PAGE_DOESNT_EXIST) {
            console.log("Page doesn't exist");
            writeLog(`Page doesn't exist | ${url}`);
            return null;
        }
        if (!result) {
            await webDriver.quit();
            webDriverWrapper.instance = await buildWebDriver();
            continue;
        }
        const href = await result.getAttribute("href") || null;
        if (href && href.includes("bill/")) {
            privateURL = href;
            continue;
        }
        return await result.getText();
    }
    writeLog(url);
    return null;
}


module.exports = scrapeBillTextFromWeb;
