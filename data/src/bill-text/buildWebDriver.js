const { Builder, Browser } = require("selenium-webdriver");


async function buildWebDriver()
{
    return await new Builder()
        .forBrowser(Browser.FIREFOX)
        .build();
}


module.exports = buildWebDriver;
