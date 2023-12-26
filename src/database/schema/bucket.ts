import { DatabaseConnection } from "../sqlite"
import { ForeignKey, ID } from "./_"

export interface BucketRecord {
    // Some id for the bucket
    id: ID

    // The icon to display for the bucket from the list of icons available
    icon: string

    // The name of the bucket for the UI
    name: string

    // The parent bucket, if any for nesting and relations
    parent?: ForeignKey

}

export async function createBucketTable (database: DatabaseConnection) {
    return database.run(`
        CREATE TABLE IF NOT EXISTS buckets (
            id TEXT PRIMARY KEY,
            icon TEXT,
            name TEXT,
            parent TEXT
    )`)
}