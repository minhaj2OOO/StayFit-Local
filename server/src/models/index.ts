// Using PostgreSQL for this project
// Database connection fail fix
// https://stackoverflow.com/questions/60678090/dbeaver-localhost-postgresql-connection-refused

// Tutorial taken from
// https://www.youtube.com/watch?v=7D0x79lLevs&ab_channel=WyattFleming

import { Client } from 'pg';

// Modify the following information as needed
export const client = new Client({
    host: "localhost",
    port: 5432,
    user: "postgres",
    database: "stayfit-local",
    password: "password",
});
// 

export const initDB = async () => {
    client.connect((err) => {
        if (err) {
            console.error('Error connecting to the database:', err.stack);
            return;
        }
        console.log('Connected to the database.');
    });
};