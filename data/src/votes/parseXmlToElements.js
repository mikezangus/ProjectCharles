const { DOMParser } = require("xmldom");
const xpath = require("xpath");


function parseHouseXmlToElements(xml)
{
    try {
        xml = xml.toString();
        xml = xml.replace(/<!DOCTYPE[^>]*>/, "");
        const dom = new DOMParser().parseFromString(xml, "text/xml");
        return xpath.select("/rollcall-vote/vote-data/recorded-vote", dom);
    } catch (error) {
        console.error(error);
        throw error;
    }
}


function parseSenateXmlToElements(xml)
{
    try {
        const dom = new DOMParser().parseFromString(xml, "text/xml");
        return xpath.select("//members/member", dom);
    } catch (error) {
        console.error(error);
        throw error;
    }
}


module.exports = { parseHouseXmlToElements, parseSenateXmlToElements };
