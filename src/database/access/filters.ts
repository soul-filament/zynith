import { FilterRecord } from "../schema/filter";
import { DatabaseConnection } from "../sqlite";
import { hash } from "../utils";

export class FilterHandlers {

    public constructor (private connection: DatabaseConnection) {}

    async getAllFilters (): Promise<FilterRecord[]> {
        return this.connection.all('SELECT * FROM filters')
    }

    async getFilterById (id: string): Promise<FilterRecord> {
        return this.connection.get('SELECT * FROM filters WHERE id = ?', [id])
    }

    async getFilterByBucket (bucket: string): Promise<FilterRecord[]> {
        return this.connection.all('SELECT * FROM filters WHERE bucket = ?', [bucket])
    }

    async createFilter (filter: Partial<FilterRecord>): Promise<FilterRecord> {

        if (!filter.filter || !filter.bucket) {
            throw new Error('Missing required fields, label, bucket')
        }

        let filterStr = filter.filter.replaceAll(/[^a-zA-Z ]/g, '').toUpperCase()

        let filterRecord = {
            ...filter,
            filter: filterStr
        } as FilterRecord

        filterRecord.id = hash(filterRecord)

        await this.connection.run(`
            INSERT or IGNORE INTO filters ( id, label, filter, bucket )
            VALUES ( ?, ?, ?, ? )
        `, [
            filterRecord.id,
            filterRecord.label,
            filterRecord.filter,
            filterRecord.bucket,
        ])

        // Also find all transactions that match this filter and apply it to them
        await this.applyFilter(filterRecord.id)

        return filterRecord

    }

    async deleteFilter (id: string): Promise<void> {
        await this.connection.run('DELETE FROM filters WHERE id = ?', [id])
        await this.connection.run('UPDATE transactions SET filterRef = NULL, bucketRef = NULL, label = NULL WHERE filterRef = ?', [id])
    }

    async updateFilter (filter: Partial<FilterRecord>): Promise<FilterRecord> {
            
        if (!filter.id) {
            throw new Error('Missing required fields, id')
        }

        await this.connection.run(`
            UPDATE filters SET label = ?
            WHERE id = ?
        `, [
            filter.label,
            filter.id,
        ])

        await this.connection.run(`
            UPDATE transactions SET label = ?
            WHERE filterRef = ?
        `, [
            filter.label,
            filter.id,
        ])

        return await this.getFilterById(filter.id)
    }

    async getTransactionsMatchingFilter (id: string): Promise<FilterRecord[]> {
        const filter = await this.getFilterById(id)
        
        return this.connection.all(`
            SELECT * FROM transactions 
            WHERE description LIKE ?`, [`%${filter.filter}%`])
    }

    async applyFilter (id: string): Promise<void> {
        let matchingTransactions = await this.getTransactionsMatchingFilter(id)
        let filterData = await this.getFilterById(id)
        for (let transaction of matchingTransactions) {
            if (transaction.filter) {
                continue
            }
            await this.connection.run(`
                UPDATE transactions SET filterRef = ?, bucketRef = ?, label = ?
                WHERE id = ?
            `, [
                id,
                filterData.bucket,
                filterData.label,
                transaction.id,
            ])
        }
    }

    async applyAllFilters (): Promise<void> {
        let filters = await this.getAllFilters()
        for (let filter of filters) {
            await this.applyFilter(filter.id)
        }
    }
}