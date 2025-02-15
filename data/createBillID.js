module.exports = function (congress, type, num)
{
    if (!congress || !type || !num) {
        console.error(`${__filename}\nError | Invalid param(s):\ncongress=${congress} type=${type} num=${num}`);
        return null;
    }
    if (!/^\d{1,3}$/.test(String(congress))) {
        console.error(`${__filename}\nError | Invalid value: congress=${congress}`);
        return null;
    }
    if (type !== "HR" && type !== "HJRES" && type !== "HCONRES" && type !== "HRES"
        && type !== 'S' && type !== "SJRES" && type !== "SCONRES" && type !== "SRES") {
        console.error(`${__filename}\nError | Invalid value: type=${type}`);
        return null;
    }
    if (!/^\d+$/.test(String(num))) {
        console.error(`${__filename}\nError | Invalid value: num=${num}`);
        return null;
    }
    return `${congress}${type}${num}`;
}
