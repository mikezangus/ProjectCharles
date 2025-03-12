const fs = require("fs");
const path = require("path");


const FILES_DIR = path.resolve(
    __dirname,
    "../../data/bill-texts/"
);


function filterForTxtFiles(files)
{
    return files.filter(file => 
        file.endsWith(".txt") && 
        fs.statSync(path.join(FILES_DIR, file)).isFile()
    );
}


function filterForMultipleLines(files)
{
    return files
        .map(file => {
            const filePath = path.join(FILES_DIR, file);
            const content = fs.readFileSync(filePath, "utf8");
            return content.includes("\n")
                ? path.parse(file).name
                : null;
        })
        .filter(Boolean);
}


function getSavedBillIDs()
{
    let files = fs.readdirSync(FILES_DIR);
    files = filterForTxtFiles(files);
    files = filterForMultipleLines(files);
    return files;
}


module.exports = getSavedBillIDs;
