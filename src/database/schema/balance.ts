import { DatabaseConnection } from "../sqlite"
import { ForeignKey, ID, Timestamp } from "./_"

export interface BalanceRecord {
    // Some id for the balance
    id: ID

    // The date of the balance
    date: Timestamp

    // The source string to assign the balance to
    source: ForeignKey

    // The balance of the bucket on the date
    balance: number
}

export async function createBalanceTable (database: DatabaseConnection) {
    return database.run(`
        CREATE TABLE IF NOT EXISTS balances (
            id TEXT PRIMARY KEY,
            date TEXT,
            source TEXT,
            balance REAL
    )`)
}