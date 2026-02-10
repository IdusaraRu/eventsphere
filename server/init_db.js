
import { Sequelize } from 'sequelize';

const initDatabase = async () => {
    // 1. Connect to MySQL server (without a specific DB)
    const tempSequelize = new Sequelize('', 'root', '', {
        dialect: 'mysql',
        host: 'localhost',
        logging: false
    });

    try {
        await tempSequelize.query(`CREATE DATABASE IF NOT EXISTS eventsphere_db;`);
        console.log("Database 'eventsphere_db' ensured.");
    } catch (error) {
        console.error("Error creating database:", error);
    } finally {
        await tempSequelize.close();
    }
};

initDatabase();
