export const transformJSON = (obj: unknown): string => {
    return JSON.stringify(obj).split("\",\"").join("\n");
}