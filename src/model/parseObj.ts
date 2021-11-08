
export function parseObj(objString) {
    const lines = objString.split('\n')

    for (let lineNumber = 0; lineNumber < lines.length; ++lineNumber) {
        console.debug(lines[lineNumber])
    }
}