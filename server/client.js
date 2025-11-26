import { configDotenv } from "dotenv";
import mysql from 'mysql2/promise.js';
import fs from 'fs';
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

for (let file of fs.readdirSync('./server/gen')) {

    let path = `./server/gen/${file}`;

    let sql_string = fs.readFileSync(path, {encoding: "utf-8"});

    await client.query(sql_string);
}

add_product("goldfish.jpg", "Goldfish", "silly little goldfishies", 7);
add_product("guppy.jpg", "Guppy", "Bubble Guppies???", 6);
add_product("molly.jpg", "Molly", "Molly long, go B", 5);
add_product("Neon-Tetra-1.jpg", "Neon Tetra", "i don't have a joke for this", 4);