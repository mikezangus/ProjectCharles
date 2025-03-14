function cleanLastName(lastName)
{
    if (!lastName.includes('(') && !lastName.includes(',')) {
        return lastName;
    }
    return lastName.replace(/[\s]*[\(,].*/, '').trim();
}


module.exports = cleanLastName;
