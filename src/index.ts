import { DatabaseConnection } from "./database/sqlite"
import { ApiHandlers } from "./database/access/_"
import { TransactionHandlers } from "./database/access/transactions"
import { AllocationHandlers } from "./database/access/allocations"
import { BalanceHandlers } from "./database/access/balance"
import { FilterHandlers } from "./database/access/filters"
import { BucketHandlers } from "./database/access/bucket"
import { SourceHandlers } from "./database/access/source"
import { CalculationsHandler } from "./database/access/calculations"
import { SettingsHandlers } from "./database/access/settings"

interface ZynithConfig {
    sqlite_filename: string
}

export class Zynith {

    private config: ZynithConfig 
    public database: DatabaseConnection
    public api: ApiHandlers

    public constructor (config: Partial<ZynithConfig> = {}) {

        this.config = {
            sqlite_filename: config.sqlite_filename || process.env.ZYNITH_SQLITE_FILENAME || (__dirname + '/../zynith.sqlite')
        }

        console.log('Zynith config:', this.config)

        this.database = new DatabaseConnection({
            sqlite_filename: this.config.sqlite_filename,
        })

        this.api = {
            transactions: new TransactionHandlers(this.database),
            allocations: new AllocationHandlers(this.database),
            ballances: new BalanceHandlers(this.database),
            filters: new FilterHandlers(this.database),
            buckets: new BucketHandlers(this.database),    
            sources: new SourceHandlers(this.database),  
            calculate: new CalculationsHandler(this.database),      
            settings: new SettingsHandlers(this.database),
        }

    }

}
