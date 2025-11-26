import { client, add_product, add_user } from "./client.js";
import fs from 'fs';

await client.query("drop table users");
await client.query("drop table products");
await client.query("drop table cart_items");

for (let file of fs.readdirSync('./server/gen')) {

    let path = `./server/gen/${file}`;

    let sql_string = fs.readFileSync(path, {encoding: "utf-8"});

    await client.query(sql_string);
}

add_product("goldfish.jpg", "Goldfish", "silly little goldfishies", 7, 9);
add_product("guppy.jpg", "Guppy", "Bubble Guppies???", 6, 16);
add_product("molly.jpg", "Molly", "Molly long, go B", 5, 6);
add_product("Neon-Tetra-1.jpg", "Neon Tetra", "i don't have a joke for this", 4, 12);

add_user("testuser123", "testemail123@gmail.com", "password123");
add_user("admin", "adminemailidk@gmail.com", "password321");
console.log("DONE!");