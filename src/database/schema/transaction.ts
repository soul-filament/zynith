import { DatabaseConnection } from "../sqlite"
import { ForeignKey, ID, Timestamp } from "./_"

export interface TransactionRecord {
    // Some id for the transaction
    id: ID

    // The date of the transaction
    date: Timestamp

    // The description of the transaction from the merchant
    description: string

    // The user can relabel the transaction, this is optional
    label?: string

    // The total amount of the transaction, in cents
    // positive if it's a credit, negative if it's an expense
    total: number

    // Optional relations
    bucketRef?: ForeignKey
    filterRef?: ForeignKey
    sourceRef?: ForeignKey
}

export async function createTransactionTable (database: DatabaseConnection) {
    return database.run(`
        CREATE TABLE IF NOT EXISTS transactions (
            id TEXT PRIMARY KEY,
            date INTEGER,
            description TEXT,
            label TEXT,
            total INTEGER,
            bucketRef TEXT,
            filterRef TEXT,
            sourceRef TEXT
        )
    `)
}