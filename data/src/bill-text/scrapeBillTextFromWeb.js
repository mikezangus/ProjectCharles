const { By, until } = require("selenium-webdriver");
const buildWebDriver = require("./buildWebDriver");
const writeLog = require("../utils/writeLog");


const TIMEOUT = 5000;
const PDF_ONLY = 1;
const PAGE_DOESNT_EXIST = 2;
const NOT_AVAILABLE = 3;


async function findTextElement(webDriver)
{
    const originalXpath = "/html/body/div[2]/div/main/div[2]/div[2]/div[2]/pre";
    const textVersionXpath = '//*[@id="billTextContainer"]';
    try {
        return await Promise.race([
            webDriver.wait(
                until.elementLocated(By.xpath(originalXpath)),
                TIMEOUT
            ),
            webDriver.wait(
                until.elementLocated(By.xpath(textVersionXpath)),
                TIMEOUT
            )
        ]);
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
            TIMEOUT
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
            TIMEOUT
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


async function findNotAvailableElement(webDriver)
{
    const xpath = "/html/body/div[2]/div/main/div[2]/p";
    try {
        const element = await webDriver.wait(
            until.elementLocated(By.xpath(xpath)),
            TIMEOUT
        );
        const text = await element.getText();
        if (text.includes("not available")) {
            return NOT_AVAILABLE;
        }
        return null;
    } catch (error) {
        return null;
    }
}


async function getTextVersionURL(webDriver)
{
    const xpath = "//div[@id='textSelector']//a[contains(text(),'TXT')]"
    try {
        const element = await webDriver.wait(
            until.elementLocated(By.xpath(xpath)),
            TIMEOUT
        );
        return await element.getAttribute("href") || null;
    } catch (error) {
        return null;
    }
}


async function getElement(webDriver)
{
    try {
        return await Promise.race([
            findTextElement(webDriver),
            findPdfElement(webDriver).then(result => result ? PDF_ONLY : null),
            findErrorElement(webDriver).then(result => result ? PAGE_DOESNT_EXIST : null),
            findNotAvailableElement(webDriver).then(result => result ? NOT_AVAILABLE : null),
            getTextVersionURL(webDriver)
        ]);
    } catch (error) {
        return null;
    }
}


async function handleCloudflare(webDriverWrapper, attempt)
{
    const webDriver = webDriverWrapper.instance;
    const html = await webDriver.executeScript("return document.documentElement.outerHTML;");
    if (!html.toLowerCase().includes("cloudflare")) {
        return
    }
    await webDriverWrapper.instance.quit();
    const cloudflareTimeout = TIMEOUT * attempt * 10
    console.log(`⚠️ Encountered cloudflare. Waiting ${cloudflareTimeout / 1000}s`);
    await new Promise(resolve => setTimeout(resolve, cloudflareTimeout));
    webDriverWrapper.instance = await buildWebDriver();
}


async function scrapeBillTextFromWeb(webDriverWrapper, url)
{
    const maxAttempts = 5;
    let privateURL = url;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        console.log(privateURL);
        if (attempt > 1) {
            console.log(`Trying attempt ${attempt}/${maxAttempts}`);
            await webDriverWrapper.instance.quit();
            webDriverWrapper.instance = await buildWebDriver();
        }
        const webDriver = webDriverWrapper.instance;
        try {
            await webDriver
                .manage()
                .setTimeouts({ pageLoad: TIMEOUT });
            await webDriver.get(privateURL);
        } catch (error) {
            continue;
        }
        const element = await getElement(webDriver, url === privateURL);
        if (typeof element === "string" && element.includes("congress.gov")) {
            privateURL = element;
            attempt--;
            continue;
        }
        if (typeof element === "number" && element === PDF_ONLY) {
            console.log("PDF only");
            writeLog(`PDF only | ${privateURL}`);
            return null;
        }
        if (typeof element === "number" && element === PAGE_DOESNT_EXIST) {
            console.log("Page doesn't exist");
            writeLog(`Page doesn't exist | ${privateURL}`);
            return null;
        }
        if (typeof element === "number" && element === NOT_AVAILABLE) {
            console.log("Digital text not available");
            writeLog(`Digital text not available | ${privateURL}`);
            return null;
        }
        if (!element) {
            await handleCloudflare(webDriverWrapper, attempt);
            continue;
        }
        const text = await element.getText();
        if (!text.includes("\n")) {
            if (attempt === maxAttempts) {
                console.log("No newline in parsed text");
                writeLog(`No newline in parsed text | ${privateURL} | Text:\n`, text);
                return null;
            }
            continue;
        }
        if (text.includes("XML/HTML")) {
            throw new Error("Parsed 'XML/HTML' as bill text");
        }
        return text;
    }
    writeLog(url);
    return null;
}


module.exports = scrapeBillTextFromWeb;
