import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const createDatabase = async () => {
    try {
        const { DB_HOST, DB_USER, DB_USERNAME, DB_PASSWORD, DB_NAME, DB_DATABASE, DB_PORT } = process.env;
        const user = DB_USER || DB_USERNAME || 'root';
        const password = DB_PASSWORD;
        const database = DB_NAME || DB_DATABASE;
        const host = DB_HOST || 'localhost';
        const port = DB_PORT || 3306;

        console.log(`🔌 Connecting to MySQL at ${host}:${port} as ${user}...`);

        const connection = await mysql.createConnection({
            host,
            port,
            user,
            password,
        });

        console.log(`✅ Connected to MySQL server.`);
        console.log(`🔨 Creating database '${database}' if it doesn't exist...`);

        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
        console.log(`✅ Database '${database}' checked/created.`);

        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating database:', error);
        process.exit(1);
    }
};

createDatabase();
