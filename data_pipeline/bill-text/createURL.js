function createURL(congress, type, billNum)
{
    return `https://www.congress.gov/bill/${congress}-congress/${type}/${billNum}/text`;
}


module.exports = createURL;
