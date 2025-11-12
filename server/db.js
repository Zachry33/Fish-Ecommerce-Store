import { Pool } from "pg";
import { configDotenv } from "dotenv";
configDotenv();

export const client = new Pool({
    host: "silly-fishy-site.c9ok822g2yru.ca-central-1.rds.amazonaws.com",
    //user: "your-username",
    password: process.env.db_password,
    port: 5432,
});

client.connect(function(err) {
    if (err) {
        console.error("Database connection failed: " + err.stack);
        return;
    }
    console.log("Connected to database.");
});