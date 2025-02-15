module.exports = function (filename, functionName, error)
{
    console.error(`\n${filename}\nError ${functionName ? `from ${functionName} ` : ""}|`, error);
}
