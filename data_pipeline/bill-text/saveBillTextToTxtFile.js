const fs = require("fs");
const path = require("path");


function saveBillTextToTxtFile(billID, billText)
{
    const dstDir = path.resolve(__dirname, "../../data/bill-texts");
    if (!fs.existsSync(dstDir)) {
        fs.mkdirSync(dstDir, { recursive: true });
    }
    const dstPath = path.join(dstDir, `${billID}.txt`);
    fs.writeFileSync(dstPath, billText, "utf8");
}


module.exports = saveBillTextToTxtFile;
