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

/**
 * 
 * @param {string} username
 */
export async function get_user_extended(username) {
    let query = await client.query("select * from users where username = ? inner join cart_items on users.uid = cart_items.uid", [username]);
    console.log(query);
    return query[0];
}

export async function add_product() {
    
}

for (let file of fs.readdirSync('./server/gen')) {

    let path = `./server/gen/${file}`;

    let sql_string = fs.readFileSync(path, {encoding: "utf-8"});

    await client.query(sql_string);
}