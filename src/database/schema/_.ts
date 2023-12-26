import { DatabaseConnection } from "../sqlite"
import { createBucketTable } from "./bucket"
import { createFilterTable } from "./filter"
import { createSourceTable } from "./source"
import { createTransactionTable } from "./transaction"
import { createBalanceTable } from "./balance"
import { createAllocationTable } from "./allocation"

export type ID = string
export type Timestamp = string
export type ForeignKey = string

export async function buildDatabaseTables (database: DatabaseConnection) {
    await createSourceTable(database)
    await createTransactionTable(database)
    await createBucketTable(database)
    await createFilterTable(database)
    await createBalanceTable(database)
    await createAllocationTable(database)
}