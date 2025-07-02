
import db from "../config/db.js";
import { configDotenv } from "dotenv";

export const createTable = async () => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS Ecommerce.order_items (
                id SERIAL PRIMARY KEY,
                order_id INTEGER NOT NULL,
                name VARCHAR(255) NOT NULL,
                price NUMERIC NOT NULL,
                quantity INTEGER NOT NULL,
                imageurl TEXT NOT NULL,
                product_id INTEGER NOT NULL,

                FOREIGN KEY (order_id) REFERENCES Ecommerce.orders(id),
                FOREIGN KEY (product_id) REFERENCES Ecommerce.products(id)
            );
        `);
        console.log(`table order-items successfully created`)
    } catch (err) {
        console.error(`Error creating Table: order-items`, err);
    }
}

export const insertNewOrder = async (data) => {
    await db.query(`
        INSERT INTO Ecommerce.order_items 
        (order_id, name, price, quantity, imageurl, product_id) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *`,
        [data.order_id, data.name, data.price, data.quantity, data.imageurl, data.product_id]
    ) 
}

export const getOrders = async () => {
    const users = await db.query(`SELECT * FROM Ecommerce.order_items`) 
    if (!users) {
        return  null
    }

    return users.rows
}

export const getSingleOrders = async (orderId) => {
    const user = await db.query(`SELECT * FROM Ecommerce.order_items WHERE order_id = ($1)`, [orderId]) 
    if (user.rows.length === 0) {
        return  null
    }
    
    return user.rows[0]
}

export const deleteOrder = async (orderId) => {
    await db.query(`DELETE FROM Ecommerce.order_items WHERE order_id = $1`, [orderId])
    return null
}
