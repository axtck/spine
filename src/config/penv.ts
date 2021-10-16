import * as dotenv from "dotenv";
dotenv.config();

const config = {
    port: process.env.PORT,
    environment: process.env.NODE_ENV
};

export default config;