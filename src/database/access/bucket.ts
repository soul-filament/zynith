import { BucketRecord } from "../schema/bucket";
import { DatabaseConnection } from "../sqlite";
import { hash } from "../utils";

export class BucketHandlers {

    public constructor (private connection: DatabaseConnection) {}

    async getAllBuckets (): Promise<BucketRecord[]> {
        return this.connection.all('SELECT * FROM buckets')
    }
    
    async getBucketById (id: string): Promise<BucketRecord> {
        return this.connection.get('SELECT * FROM buckets WHERE id = ?', [id])
    }

    async getBucketByName (name: string): Promise<BucketRecord> {
        return this.connection.get('SELECT * FROM buckets WHERE name = ?', [name])
    }

    async createBucket (bucket: Partial<BucketRecord>): Promise<BucketRecord> {
        if (!bucket.name) {
            throw new Error('Missing required fields, name')
        }

        let bucketRecord = {
            ...bucket,
        } as BucketRecord

        if (!bucketRecord.id) {
            bucketRecord.id = hash(bucketRecord)
        }

        await this.connection.run(`
            INSERT or IGNORE INTO buckets ( id, name, icon, parent )
            VALUES ( ?, ?, ?, ? )
        `, [
            bucketRecord.id,
            bucketRecord.name,
            bucketRecord.icon,
            bucketRecord.parent,
        ])

        return bucketRecord
    }

    async updateBucket (bucket: BucketRecord): Promise<BucketRecord> {
        if (!bucket.name) {
            throw new Error('Missing required fields, name')
        }

        await this.connection.run(`
            UPDATE buckets SET name = ?, icon = ?, parent = ?
            WHERE id = ?
        `, [
            bucket.name,
            bucket.icon,
            bucket.parent,
            bucket.id,
        ])

        return bucket
    }

    async deleteBucket (id: string): Promise<void> {
        await this.connection.run('DELETE FROM buckets WHERE id = ?', [id])
        await this.connection.run('UPDATE transactions SET bucketRef = NULL WHERE bucketRef = ?', [id])
        await this.connection.run('UPDATE buckets SET parent = NULL WHERE parent = ?', [id])
    }

}