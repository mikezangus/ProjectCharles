module.exports = function (congress, type, num)
{
    if (!congress || !type || !num) {
        console.error(`
            ${__filename}
            Error | Missing param(s): congress=${congress} type=${type} num=${num}
        `);
        return null;
    }
    if (!/^\d{1,3}$/.test(String(congress))) {
        console.error(`
            ${__filename}
            Error | Invalid value: congress=${congress}
        `);
        return null;
    }
    if (type !== "HR" && type !== "HJRES" && type !== "HCONRES" && type !== "HRES"
        && type !== 'S' && type !== "SJRES" && type !== "SCONRES" && type !== "SRES") {
        console.error(`
            ${__filename}
            Error | Invalid value: type=${type}
        `);
        return null;
    }
    if (!/^\d+$/.test(String(num))) {
        console.error(`
            ${__filename}
            Error | Invalid value: num=${num}
        `);
        return null;
    }
    return `${congress}${type}${num}`;
}
