function convertBillType(src)
{
    switch (src) {
        case "HCONRES": return "house-concurrent-resolution";
        case "HJRES": return "house-joint-resolution";
        case "HRES": return "house-resolution";
        case "HR": return "house-bill";
        case "SCONRES": return "senate-concurrent-resolution";
        case "SJRES": return "senate-joint-resolution";
        case "SRES": return "senate-resolution";
        case "S": return "senate-resolution";
        default: return null;
    }
}


module.exports = convertBillType;
