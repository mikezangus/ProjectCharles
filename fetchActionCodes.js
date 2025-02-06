const axios = require("axios");
const fs = require("fs");
const config = JSON.parse(fs.readFileSync("config.json", "utf-8"));
const fetchBills = require("./fetchBills");

const API_KEY = config.API_KEY;
const URL_BASE = "https://api.congress.gov/v3/bill";


async function fetchActionCode(congress, billType, billNumber)
{
    try {
        const url = `${URL_BASE}/${congress}/${billType.toLowerCase()}/${billNumber}/actions?api_key=${API_KEY}`;
        console.log("Url: ", url);
        const response = await axios.get(url);
        return response.data.actions?.[0]?.actionCode || null;
    } catch (error) {
        return null;
    }
}


async function fetchActionCodes()
{
    let bills = await fetchBills();
    bills = bills.map(bill => ({
        ...bill,
        actionCode: null
    }));
    console.log("\nFetching action codes");
    for (let i = 0; i < bills.length; i++) {
        if (i % Math.floor(bills.length / 10) === 0) {
            console.log(`${Math.round((i / bills.length) * 100)}% | ${i}/${bills.length}`);
        }
        bills[i].actionCode = await fetchActionCode(bills[i].congress,
                                                    bills[i].type,
                                                    bills[i].number);
    }
    return bills;
}


async function main()
{
    console.log(await fetchActionCodes());
}

if (require.main === module) {
    main();
}
