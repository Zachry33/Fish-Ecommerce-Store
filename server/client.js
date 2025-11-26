import { configDotenv } from "dotenv";
import mysql from 'mysql2/promise.js';
import bcrypt from "bcryptjs";
configDotenv();

export const client = await mysql.createConnection({
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_database,
    port: process.env.db_port,
});

/**
 * 
 * @param {string} username
 */
export async function get_user_minimal_from_username(username) {
    let query = await client.query("select * from users where username = ?", [username]);
    return query[0];
}

/**
 * 
 * @param {string} email
 */
export async function get_user_minimal_from_email(email) {
    let query = await client.query("select * from users where email = ?", [email]);
    return query[0];
}

export async function get_user_cart(id) {
    let query = await client.query("select * from cart_items where id = ?", [id]);
    return query[0];
}

export async function add_product(image_id, title, description, price) {
    await client.query("insert into products (image_id, title, description, price) values (?, ?, ?, ?)", [image_id, title, description, price])
}

export async function add_user(username, email, password) {
    await client.query('insert into users (username, email, hash_password) values (?, ?, ?)', [username, email, bcrypt.hashSync(password)])
}