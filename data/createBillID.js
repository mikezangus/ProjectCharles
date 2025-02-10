module.exports = function (congress, type, num)
{
    if (!congress || !type || !num) {
        throw new Error(
            `\n${__filename}\nError | Missing param(s):\n` +
            `congress=${congress} type=${type} num=${num}`
        );
    }
    if (!/^\d{1,3}$/.test(String(congress))) {
        throw new Error(
            `\n${__filename}\nError | Invalid value: congress=${congress}`
        );
    }
    if (type !== "HR" && type !== "HJRES" && type !== "HCONRES" && type !== "HRES"
        && type !== 'S' && type !== "SJRES" && type !== "SCONRES" && type !== "SRES") {
        throw new Error (
            `\n${__filename}\nError | Invalid value: type=${type}`
        );
    }
    if (!/^\d+$/.test(String(num))) {
        throw new Error(
            `\n${__filename}\nError | Invalid value: num=${num}`
        );
    }
    return `${congress}${type}${num}`;
}
