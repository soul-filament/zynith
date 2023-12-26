import { DatabaseConnection } from "../sqlite"
import { ID } from "./_"

export interface SourceRecord {
    // Some id for the source
    id: ID

    // The name of the source
    name: string
}

export async function createSourceTable (database: DatabaseConnection) {
    return database.run(`
        CREATE TABLE IF NOT EXISTS sources (
            id TEXT PRIMARY KEY,
            name TEXT
        )
    `)
}