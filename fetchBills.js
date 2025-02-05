const axios = require("axios");
const fs = require("fs");
const config = JSON.parse(fs.readFileSync("config.json", "utf-8"));

const API_KEY = config.API_KEY;
const URL_BASE = "https://api.congress.gov/v3/bill";
const BATCH_SIZE = 250;
const MAX_BILLS = 1000;

async function fetchBatch(offset) {
    console.log(`New batch: ${offset}`);
    try {
        const params = {
            api_key: API_KEY,
            offset: offset,
            limit: BATCH_SIZE
        };
        const response = await axios.get(URL_BASE, { params });
        return response.data.bills?.map(bill => ({
            congress: bill.congress,
            type: bill.type,
            number: bill.number
        })) || [];
    } catch (error) {
        console.error(`Error fetching data at offest ${offset}:`, error.message);
        return [];
    }
}

async function fetch()
{
    const bills = new Set();
    for (let i = 0; i < MAX_BILLS; i += BATCH_SIZE) {
        let batch = await fetchBatch(i);
        batch.forEach(bill => {bills.add(JSON.stringify(bill))});
    }
    const uniqueBills = [...bills].map(bill => JSON.parse(bill));
    console.log("Fetched bills:");
    console.log(uniqueBills);
}

fetch();
