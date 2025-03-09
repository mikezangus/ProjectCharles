async function sludge(fnctn, timeout)
{
    try {
        return await Promise.race([
            fnctn(),
            new Promise((_, reject) =>
                setTimeout(
                    () => reject(new Error()),
                    timeout
                )
            )
        ]);
    } catch (error) {
        return null;
    }
}


module.exports = sludge;
