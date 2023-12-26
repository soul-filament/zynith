import { DatabaseConnection } from "../sqlite"
import { ForeignKey, ID, Timestamp } from "./_"

export interface AllocationRecord {
    // Some id for the allocation
    id: ID

    // The bucket to allocate to
    targetBucket: ForeignKey

    // The amount to allocate, in cents
    amount: number

    // The start date of the allocation
    startDate: Timestamp

    // The end date of the allocation, if any
    endDate?: Timestamp
}

export async function createAllocationTable (database: DatabaseConnection) {
    return database.run(`
        CREATE TABLE IF NOT EXISTS allocations (
            id TEXT PRIMARY KEY,
            targetBucket TEXT,
            amount REAL,
            startDate TEXT,
            endDate TEXT
    )`)
}