import { Database } from "../core/Database";

export const upgrade = async (database: Database): Promise<void> => {
    await database.query("show tables");
};