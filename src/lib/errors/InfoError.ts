export class InfoError extends Error {
    constructor(fileName: string, functionName: string, extraMessage?: string) {
        super();
        this.name = "InfoError";
        this.message = `${this.name}: ${fileName}.${functionName}${extraMessage ? `, ${extraMessage}.` : ""}`;
    }
}