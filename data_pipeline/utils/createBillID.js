function createBillID(congress, type, num)
{
    if (!congress || !type || !num) {
        throw new Error(`Invalid value(s):\ncongress=${congress} type=${type} num=${num}`)
    }
    if (!/^\d{1,3}$/.test(String(congress))) {
        throw new Error(`Invalid value:\ncongress=${congress}`);
    }
    if (type !== "HR" && type !== "HJRES" && type !== "HCONRES" && type !== "HRES"
        && type !== 'S' && type !== "SJRES" && type !== "SCONRES" && type !== "SRES") {
        throw new Error(`Invalid value:\ntype=${type}`);
    }
    if (!/^\d+$/.test(String(num))) {
        throw new Error(`Invalid value:\nnum=${num}`);
    }
    return `${congress}${type}${num}`;
}


module.exports = createBillID;
