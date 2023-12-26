import { AllocationRecord } from "../schema/allocation";
import { DatabaseConnection } from "../sqlite";
import { randomId } from "../utils";

export class AllocationHandlers {
    
    public constructor (private connection: DatabaseConnection) {}

    async getAllAllocations (): Promise<AllocationRecord[]> {
        return this.connection.all('SELECT * FROM allocations')
    }

    async getAllocationByBucket (bucketId: string): Promise<AllocationRecord[]> {
        return await this.connection.all('SELECT * FROM allocations WHERE targetBucket = ?', [bucketId])
    }

    async getAllocationById (id: string): Promise<AllocationRecord> {
        return this.connection.get('SELECT * FROM allocations WHERE id = ?', [id])
    }

    async deleteAllocation (id: string): Promise<void> {
        await this.connection.run('DELETE FROM allocations WHERE id = ?', [id])
    }

    async updateAllocation (id: string, allocation: Partial<AllocationRecord>): Promise<AllocationRecord> {
            
            if (!allocation.targetBucket || !allocation.amount) {
                throw new Error('Missing required fields, targetBucket, amount')
            }
    
            let allocationRecord = {
                id: id,
                ...allocation,
            } as AllocationRecord
    
            await this.connection.run(`
                UPDATE allocations SET targetBucket = ?, amount = ?, startDate = ?, endDate = ?
                WHERE id = ?
            `, [
                allocationRecord.targetBucket,
                allocationRecord.amount,
                allocationRecord.startDate,
                allocationRecord.endDate,
                allocationRecord.id,
            ])
    
            return allocationRecord
        }

    async createAllocation (allocation: Partial<AllocationRecord>): Promise<AllocationRecord> {

        if (!allocation.targetBucket || !allocation.amount) {
            throw new Error('Missing required fields, targetBucket, amount')
        }

        let allocationRecord = {
            id: randomId(),
            ...allocation,
        } as AllocationRecord

        await this.connection.run(`
            INSERT INTO allocations ( id, targetBucket, amount, startDate, endDate )
            VALUES ( ?, ?, ?, ?, ? )
        `, [
            allocationRecord.id,
            allocationRecord.targetBucket,
            allocationRecord.amount,
            allocationRecord.startDate,
            allocationRecord.endDate,
        ])

        console.log(allocationRecord)

        console.log(await this.connection.all('SELECT * FROM allocations'))

        return allocationRecord
    }


}