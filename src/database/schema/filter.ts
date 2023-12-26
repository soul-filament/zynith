import { DatabaseConnection } from "../sqlite"
import { ForeignKey, ID } from "./_"

export interface FilterRecord {
    // Some id for the filter
    id: ID

    // The label to assign to transactions within the filter
    label: string

    // The filter string to match against transactions
    filter: string

    // The bucket to assign transactions to
    bucket: ForeignKey

}

export async function createFilterTable (database: DatabaseConnection) {
    return database.run(`
        CREATE TABLE IF NOT EXISTS filters (
            id TEXT PRIMARY KEY,
            label TEXT,
            filter TEXT,
            bucket TEXT
    )`)
}
