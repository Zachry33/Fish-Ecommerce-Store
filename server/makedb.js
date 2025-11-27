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

add_product("goldfish.jpg", "Goldfish", "Small freshwater carp. Average houshold pet.", 3, 30);
add_product("guppy.jpg", "Guppy", "Popular South American freshwater fish", 6, 18);
add_product("molly.jpg", "Molly", "Small oblong fish with wide range of fin shapes.", 5, 25);
add_product("Neon-Tetra-1.jpg", "Neon Tetra", "Vibrant colorful school fish.", 4, 12);
add_product("betta.jpg", "Betta Fish", "Siamese fighting fish", 10, 15);
add_product("pleco.jpg", "Plecostomus", "Algae eating freshwater fish.", 8, 5);
add_user("testuser123", "testemail123@gmail.com", "password123");
add_user("admin", "adminemailidk@gmail.com", "password321");
console.log("DONE!");