import db from "../config/db.js";
import { configDotenv } from "dotenv";

const createSchema = async () => {
  try {
    await db.query(`CREATE SCHEMA IF NOT EXISTS Ecommerce`);
    console.log('User Schema created!');
  } catch (err) {
    console.error('Error creating Ecommerce:', err);
  }
};

createSchema();

export const createTable = async () => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(1000),
                password VARCHAR(200),
                email VARCHAR(100) UNIQUE,
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);

        console.log(`table users successfully created`)
    } catch (err) {
        console.error(`Error creating Table: users`, err);
    }
}

export const insertNewUser = async (data) => {
    await db.query(`INSERT INTO Ecommerce.users (name, password, email) VALUES ($1, $2, $3) RETURNING id`,
             [data.name, data.password, data.email]
    ) 
}

export const getUsers = async () => {
    const users = await db.query(`SELECT * FROM Ecommerce.users`) 
    if (!users) {
        return  {}
    }
    return users.rows
}

export const getSingleUser = async (email) => {
    const user = await db.query(`SELECT * FROM Ecommerce.users WHERE email = ($1)`, [email]) 
    if (!user) {
        return  {message: "no user found"}
    }

    return user.rows
}

export const updateUser = async (id, data) => {
    const user = await db.query(`  UPDATE Ecommerce.users 
        SET name = $1, 
        password = $2, 
        email = $3 
        WHERE id = $4 
        RETURNING id`, 
        [data.name, data.password, data.email, id]
    ) 

    return "Information UPdated successfully"
}

export const deleteUser = async (id) => {
    await db.query(`DELETE FROM users WHERE id = $1`, [id])
    return `User deleted successfully!`
}



// CREATE SCHEMA analytics;

// CREATE TABLE analytics.user_activity (
//   id SERIAL PRIMARY KEY,
//   user_id INT,
//   activity TEXT,
//   created_at TIMESTAMP DEFAULT NOW()
// );
