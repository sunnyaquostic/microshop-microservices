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
        // await db.query('DROP TABLE Ecommerce.users')

        // await db.query(`ALTER TABLE Ecommerce.users
        //     ALTER COLUMN resetPasswordExpire TYPE VARCHAR(100)
        // `)

        await db.query(`
            CREATE TABLE IF NOT EXISTS Ecommerce.users (
                id SERIAL NOT NULL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                password VARCHAR(200) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                resetToken VARCHAR(100),
                resetPasswordToken TEXT,
                resetPasswordExpire VARCHAR(255),
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
    if (user.rows.length === 0) {
        return  null
    }
    
    return user.rows[0]
}

export const updateUserNameAndPassword = async (id, data) => {
    const user = await db.query(`UPDATE Ecommerce.users 
        SET name = $1, 
        password = $2 
        WHERE id = $4 
        RETURNING id`, 
        [data.name, data.password, id]
    ) 

    return user[0]
}

export const updateUserName = async (email, data) => {
    const user = await db.query(`UPDATE Ecommerce.users 
        SET name = $1
        WHERE email = $2
        RETURNING *`, 
        [data, email]
    ) 

    return user.rows[0]
}

export const updateUserPassword = async (email, data) => {
    const user = await db.query(`UPDATE Ecommerce.users 
        SET password = $2
        WHERE email = $1 
        RETURNING *`, 
        [email, data.password]
    ) 
    
    return user.rows[0]
}

export const updateResetToken = async (email, data) => { 
    try {
        const user = await db.query(`UPDATE Ecommerce.users 
            SET resetToken = $2,
            resetPasswordToken = $3,
            resetPasswordExpire = $4
            WHERE email = $1 
            RETURNING *`, 
            [email, data.resetToken, data.resetPasswordToken, data.resetPasswordExpire]
        ) 
        return user.rows[0]
    } catch (error) {
        console.log('error occured!', error);
        
    }
}

export const deleteUser = async (id) => {
    await db.query(`DELETE FROM users WHERE id = $1`, [id])
    return `User deleted successfully!`
}

export const checkTokenExpireAndExist = async (data) => {  
    const user = await db.query(`
        SELECT * FROM Ecommerce.users 
        WHERE resetpasswordtoken = ($1)`, 
        [data.resetPasswordToken]
    ) 

    if (user.rows.length === 0) {
        return  null
    }
    
    return user.rows[0]
}



// CREATE SCHEMA analytics;

// CREATE TABLE analytics.user_activity (
//   id SERIAL PRIMARY KEY,
//   user_id INT,
//   activity TEXT,
//   created_at TIMESTAMP DEFAULT NOW()
// );
