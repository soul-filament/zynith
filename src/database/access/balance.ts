import { DataAggregator } from "../dataAggregator";
import { BalanceRecord } from "../schema/balance";
import { SettingRecord } from "../schema/settings";
import { DatabaseConnection } from "../sqlite";
import { hash } from "../utils";

export class BalanceHandlers {

    public constructor (private connection: DatabaseConnection) {}

    async getAllBalances (): Promise<BalanceRecord[]> {
        return this.connection.all('SELECT * FROM balances ORDER BY date ASC')
    }

    async getBalanceBySource (source: string): Promise<BalanceRecord[]> {
        return this.connection.all('SELECT * FROM balances WHERE source = ? ORDER BY date ASC', [source])
    }

    async createBalance (balance: Partial<BalanceRecord>): Promise<BalanceRecord> {
            
        if (!balance.source || !balance.balance || !balance.date) {
            throw new Error('Missing required fields, source, amount, date')
        }

        let id = hash(balance)

        await this.connection.run(`
            INSERT or REPLACE INTO balances ( id, source, balance, date )
            VALUES ( ?, ?, ?, ? )
        `, [
            id,
            balance.source,
            balance.balance,
            balance.date,
        ])

        return {
            ...balance,
            id,
        } as BalanceRecord
    }

    async computeBalances () {
        let allSources = await this.connection.all<BalanceRecord>('SELECT DISTINCT source FROM balances')
        let settings = await this.connection.get<SettingRecord>('SELECT * FROM settings where id = "global"')

        let resultAggregators = {} as {[source: string]: any}

        for (let source of allSources) {
            let aggregator = new DataAggregator(new Date(settings.globalStartDate))
            let sourceBalances = await this.getBalanceBySource(source.source)
            aggregator.selfSetMultipleRangesRaw(sourceBalances)
            resultAggregators[source.source] = aggregator.exportData()
        }

        return resultAggregators
    }

    async deleteBalance (id: string): Promise<void> {
        await this.connection.run('DELETE FROM balances WHERE id = ?', [id])
    }

}