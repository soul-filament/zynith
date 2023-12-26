import { FilterRecord } from "../schema/filter";
import { TransactionRecord } from "../schema/transaction";
import { DatabaseConnection } from "../sqlite";
import { hash } from "../utils";

export class TransactionHandlers {

    public constructor (private connection: DatabaseConnection) {}

    getTransactionById (id: string): Promise<TransactionRecord[]> {
        return this.connection.get('SELECT * FROM transactions WHERE id = ?', [id])
    }

    getTransactionsInBucket (bucketId: string): Promise<TransactionRecord[]> {
        return this.connection.all('SELECT * FROM transactions WHERE bucketRef = ?', [bucketId])
    }

    getTransactionsInSource (sourceId: string): Promise<TransactionRecord[]> {
        return this.connection.all('SELECT * FROM transactions WHERE sourceRef = ?', [sourceId])
    }

    getTransactionsInFilter (filterId: string): Promise<TransactionRecord[]> {
        return this.connection.all('SELECT * FROM transactions WHERE filterRef = ?', [filterId])
    }

    async getAllTransactions (): Promise<TransactionRecord[]> {
        return this.connection.all('SELECT * FROM transactions')
    }

    getAllTransactionsWithDescription (description: string): Promise<TransactionRecord[]> {
        return this.connection.all('SELECT * FROM transactions WHERE description = ?', [description])
    }

    async createTransaction (transaction: Partial<TransactionRecord>): Promise<TransactionRecord> {

        if (!transaction.date || !transaction.description || !transaction.total || !transaction.sourceRef) {
            console.log(transaction)
            throw new Error('Missing required fields, date, description, total, sourceRef')
        }

        let description = transaction.description.replaceAll(/[^a-zA-Z ]/g, '').toUpperCase()

        let generatedId = hash({
            date: transaction.date,
            description: description,
            total: transaction.total,
            sourceRef: transaction.sourceRef,
        })
        
        const matchedFilter = await this.connection.get<FilterRecord>(`
            SELECT * FROM filters 
            WHERE ? like '%' || filter || '%'`, [description])

        let transactionRecord = {
            ...transaction,
            description
        } as TransactionRecord

        if (!transaction.id) { transactionRecord.id = generatedId }
        if (!transaction.bucketRef) { transactionRecord.bucketRef = matchedFilter?.bucket }
        if (!transaction.filterRef) { transactionRecord.filterRef = matchedFilter?.id }
        if (!transaction.label) { transactionRecord.label = matchedFilter?.label }

        await this.connection.run(`
            INSERT or IGNORE INTO transactions ( id, date, description, label, total, bucketRef, filterRef, sourceRef )
            VALUES ( ?, ?, ?, ?, ?, ?, ?, ? )
        `, [
            transactionRecord.id,
            transactionRecord.date,
            transactionRecord.description,
            transactionRecord.label,
            transactionRecord.total,
            transactionRecord.bucketRef,
            transactionRecord.filterRef,
            transactionRecord.sourceRef
        ])

        return transactionRecord
    }

    async updateTransaction (transaction: TransactionRecord): Promise<TransactionRecord> {

        if (!transaction.id) {
            throw new Error('Missing required field, id')
        }

        await this.connection.run(`
            UPDATE transactions
            SET label = ?, bucketRef = ?, filterRef = ?
            WHERE id = ?
        `, [
            transaction.label,
            transaction.bucketRef,
            transaction.filterRef,
            transaction.id,
        ])

        return transaction
    }
}
