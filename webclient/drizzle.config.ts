import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import process from "node:process";

export default defineConfig({
    out: './lib/db/drizzle',
    schema: './lib/db',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DB_URL!,
    },
});

