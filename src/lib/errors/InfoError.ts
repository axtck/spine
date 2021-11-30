export class InfoError extends Error {
    constructor(fileName: string, functionName: string, extraMessage?: string) {
        super();
        this.name = "InfoError";
        this.message = `Error in ${fileName}.${functionName}${extraMessage ? `, ${extraMessage}.` : ""}`;
    }
}