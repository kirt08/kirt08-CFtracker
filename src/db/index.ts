import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import * as schema from "./schema"

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
    throw new Error("Connection string to database wasn't found.")
}

const globalForDb = globalThis as unknown as {
    client: postgres.Sql | undefined
}

export const client =
    globalForDb.client ??
    postgres(connectionString, {
        prepare: false,
        max: process.env.NODE_ENV === "production" ? 1 : 10,
        idle_timeout: 30,
        connect_timeout: 5,
    })

if (process.env.NODE_ENV === "development") {
    globalForDb.client = client
}

export const db = drizzle({ client, schema })
