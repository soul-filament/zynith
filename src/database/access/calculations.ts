import { DataAggregator } from "../dataAggregator";
import { AllocationRecord } from "../schema/allocation";
import { BucketRecord } from "../schema/bucket";
import { SettingRecord } from "../schema/settings";
import { TransactionRecord } from "../schema/transaction";
import { DatabaseConnection } from "../sqlite";

export class CalculationsHandler {

    public constructor (private connection: DatabaseConnection) {}

    async CalculateallocationByDayForBucket (bucket: string) {

        let settings = await this.connection.get<SettingRecord>('SELECT * FROM settings where id = "global"')

        // Where to put results
        const aggregator: DataAggregator = new DataAggregator(new Date(settings.globalStartDate));
        const combinedAggregator: DataAggregator = new DataAggregator(new Date(settings.globalStartDate));
        
        // What was directly assigned to this bucket
        const directallocations = await this.connection.all<AllocationRecord>("SELECT * FROM allocations WHERE targetBucket = ?", [bucket]);
        for (let allocation of directallocations) {
            aggregator.selfAddOnRange(allocation.amount, new Date(allocation.startDate), !!allocation.endDate ? new Date(allocation.endDate) : undefined)
        }

        // What allocations were given to this bucket's children
        const childallocations: any = {}
        const childBuckets = await this.connection.all<BucketRecord>("SELECT * FROM buckets WHERE parent = ?", [bucket]);
        for (let childBucket of childBuckets) {
            const childTransactions = await this.CalculateallocationByDayForBucket(childBucket.id);
            childallocations[childBucket.name] = childTransactions.Cumulativeallocations
            combinedAggregator.selfAddDataRaw(childTransactions.Cumulativeallocations)
        }

        combinedAggregator.selfAddAggregator(aggregator);

        return {
            Cumulativeallocations: combinedAggregator.exportData(),
            Directallocations: aggregator.exportData(),
            ...childallocations
        }
        
    }

    async CalcualateSpendingByDayForBucket (bucket: string) {

        let settings = await this.connection.get<SettingRecord>('SELECT * FROM settings where id = "global"')

        // Where to put results
        const aggregator: DataAggregator = new DataAggregator(new Date(settings.globalStartDate));
        const combinedAggregator: DataAggregator = new DataAggregator(new Date(settings.globalStartDate));
        
        // What was directly assigned to this bucket
        const directTransactions = await this.connection.all<TransactionRecord>("SELECT * FROM transactions WHERE bucketRef = ?", [bucket]);
        for (let transaction of directTransactions) {
            aggregator.selfSubtractOnDate(new Date(transaction.date), transaction.total)
        }

        // What spending were given to this bucket's children
        const childSpendings: any = {}
        const childBuckets = await this.connection.all<BucketRecord>("SELECT * FROM buckets WHERE parent = ?", [bucket]);
        for (let childBucket of childBuckets) {
            const childTransactions = await this.CalcualateSpendingByDayForBucket(childBucket.id);
            childSpendings[childBucket.name] = childTransactions.CumulativeSpending
            combinedAggregator.selfAddDataRaw(childTransactions.CumulativeSpending)
        }

        combinedAggregator.selfAddAggregator(aggregator);

        return {
            CumulativeSpending: combinedAggregator.exportData(),
            DirectSpending: aggregator.exportData(),
            ...childSpendings
        }

    }
}