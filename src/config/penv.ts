import * as dotenv from "dotenv";
dotenv.config();

const config = {
    port: process.env.PORT,
    environment: process.env.NODE_ENV,
    mysqlHost: process.env.MYSQL_HOST,
    mysqlPort: process.env.MYSQL_PORT,
    mysqlDb: process.env.MYSQL_DATABASE,
    mysqlUser: process.env.MYSQL_USER,
    mysqlPw: process.env.MYSQL_PASSWORD
};

export default config;