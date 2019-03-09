async function myFunction(): Promise<string> {
    try {
        const rank = await getRank()
        return "firebase is #" + rank
    }
    catch (err) {
        return "Error: " + err
    }
}

function getRank() {
    //return Promise.resolve(1)
    return Promise.reject("I don't know :-(")
}