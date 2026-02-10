
const { Sequelize } = require('sequelize');
const setupDatabase = async () => {
    // 1. First connect without a database to CREATE it if missing
    const tempSequelize = new Sequelize('', 'root', '', {
        dialect: 'mysql',
        host: 'localhost',
        logging: false
    });

    try {
        await tempSequelize.query(`CREATE DATABASE IF NOT EXISTS eventsphere_db;`);
        console.log("Database 'eventsphere_db' checked/created.");
    } catch (error) {
        console.error("Error creating database:", error);
    } finally {
        await tempSequelize.close();
    }

    // 2. Now connect to the actual database
    const sequelize = new Sequelize('eventsphere_db', 'root', '', {
        dialect: 'mysql',
        host: 'localhost',
        logging: false
    });

    try {
        await sequelize.authenticate();
        console.log('MySQL Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
    
    return sequelize;
};

module.exports = setupDatabase;
