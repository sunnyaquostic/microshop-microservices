import db from "../config/db.js";
import { configDotenv } from "dotenv";

export const createTable = async () => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS Ecommerce.products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
                stock INTEGER NOT NULL DEFAULT 0,
                image TEXT,
                category VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log(`table users successfully created`)
    } catch (err) {
        console.error(`Error creating Table: users`, err);
    }
}

export const insertNewProduct = async (data) => {
    await db.query(`
        INSERT INTO Ecommerce.products 
        (name, description, price, stock, image, category,created_at, updated_at) 
        VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
        [data.name, data.description, data.price, data.stock, data.image, data.category, data.created_at, data.updated_at]
    ) 
}

export const getProducts = async () => {
    const products = await db.query(`SELECT * FROM Ecommerce.products`) 
    if (!products) {
        return  {}
    }
    return products.rows
}

export const getSingleProductByName = async (name) => {
    const product = await db.query(`SELECT * FROM Ecommerce.products WHERE name = ($1)`, [name]) 
    if (product.rows.length === 0) {
        return  null
    }
    
    return product.rows[0]
}

export const getSingleProductByCategory = async (category) => {
    const product = await db.query(`SELECT * FROM Ecommerce.products WHERE name = ($1)`, [category]) 
    if (product.rows.length === 0) {
        return  null
    }
    
    return product.rows[0]
}

export const updateProduct = async (id, data) => {
    const fields = [];
    const values = [];
    let index = 1;

    // Dynamically construct fields and values
    for (const [key, value] of Object.entries(data)) {
        fields.push(`${key} = $${index}`);
        values.push(value);
        index++;
    }

    // Add the ID as the last parameter
    values.push(id);

    const query = `
        UPDATE Ecommerce.products
        SET ${fields.join(', ')}
        WHERE id = $${index}
        RETURNING *;
    `;

    const result = await db.query(query, values);
    return result.rows[0];
};


export const deleteProduct = async (id) => {
    await db.query(`DELETE FROM Ecommerce.products WHERE id = $1`, [id])
    return null
}



