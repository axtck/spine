import * as dotenv from "dotenv";
dotenv.config();

const config = {
    port: Number(process.env.PORT) || 3001,
    environment: process.env.NODE_ENV || "development",
    mysqlHost: process.env.MYSQL_HOST,
    mysqlPort: isNaN(Number(process.env.MYSQL_PORT)) ? undefined : Number(process.env.MYSQL_PORT),
    mysqlDb: process.env.MYSQL_DATABASE,
    mysqlUser: process.env.MYSQL_USER,
    mysqlPw: process.env.MYSQL_PASSWORD,
    jwtAuthkey: process.env.JWT_AUTHKEY
};

export default config;