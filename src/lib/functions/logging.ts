export const transformKeyValueJSON = (jsonData: unknown): string => {
    // split
    const splitRegex = new RegExp(/,"/);
    const splitted = JSON.stringify(jsonData).split(splitRegex);

    // join and remove quotes
    const replaceRegex = new RegExp(/["]/, "g");
    const joined: string = splitted.map((row) => {
        return row.replace(replaceRegex, "");
    }).join("\n");

    // remove brackets
    const result = joined.slice(1, joined.length - 1);
    return result;
}