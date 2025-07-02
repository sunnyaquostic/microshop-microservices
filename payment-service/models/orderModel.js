
import db from "../config/db.js";
import { configDotenv } from "dotenv";

export const createTable = async () => {
    try {
        await db.query(`
                CREATE TABLE IF NOT EXISTS Ecommerce.orders (
                id SERIAL PRIMARY KEY,
                user_email VARCHAR(100) NOT NULL,
                shipping_address TEXT NOT NULL,
                shipping_city VARCHAR(100) NOT NULL,
                shipping_state VARCHAR(100) NOT NULL,
                shipping_country VARCHAR(100) NOT NULL,
                shipping_pin_code INTEGER NOT NULL,
                shipping_phone_number BIGINT NOT NULL,
                payment_id VARCHAR(255) NOT NULL,
                payment_status VARCHAR(100) NOT NULL,
                paid_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                item_price NUMERIC NOT NULL DEFAULT 0,
                tax_price NUMERIC NOT NULL DEFAULT 0,
                shipping_price NUMERIC NOT NULL DEFAULT 0,
                total_price NUMERIC NOT NULL DEFAULT 0,
                order_status VARCHAR(100) NOT NULL DEFAULT 'processing',
                delivered_at TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_email) REFERENCES Ecommerce.users(email)
            );
        `)
        console.log(`table orders successfully created`)
    } catch (err) {
        console.error(`Error creating Table: orders`, err);
    }
}

export const insertNewUser = async (data) => {
    await db.query(`INSERT INTO Ecommerce.orders 
        (user_email, shipping_address, shipping_city, shipping_state, shipping_country, 
        shipping_pin_code, shipping_phone_number, payment_id, payment_status, paid_at, item_price, tax_price,
        shipping_price, total_price, order_status, delivered_at, created_at) 
        VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) 
        RETURNING id`,
        [data.email, data.shipping_address, data.shipping_city, data.shipping_state, data.shipping_county, data.shipping_pin_code,
         data.shipping_phone_number, data.payment_id, data.payment_status, data.paid_at, data.item_price, data.tax_price,
         data.shipping_price, data.total_price, data.order_status, data.delivered_at, data.created_at
        ]
    ) 
}

export const getAllOrders = async () => {
    const orders = await db.query(`SELECT * FROM Ecommerce.orders`) 
    if (!orders) {
        return  {}
    }
    return orders.rows
}

export const getSingleOrder = async (id) => {
    
    const order = await db.query(`SELECT * FROM Ecommerce.orders WHERE id = ($1)`, [id]) 
    if (order.rows.length === 0) {
        return  null
    }
    
    return order.rows[0]
}

export const deleteUser = async (id) => {
    await db.query(`DELETE FROM Ecommerce.orders WHERE id = $1`, [id])
    return null
}

