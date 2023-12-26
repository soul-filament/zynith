import { SourceRecord } from "../schema/source";
import { DatabaseConnection } from "../sqlite";

export class SourceHandlers {

    public constructor (private connection: DatabaseConnection) {}

    async getAllSources (): Promise<SourceRecord[]> {
        return this.connection.all('SELECT * FROM sources')
    }

    async getSourceById (id: string) {
        return this.connection.get<SourceRecord>('SELECT * FROM sources WHERE id = ?', [id])
    }

    async getSourceByName (name: string) {
        return this.connection.get<SourceRecord>('SELECT * FROM sources WHERE name = ?', [name])
    }

    async createSource (source: SourceRecord) {
        return this.connection.run('INSERT or REPLACE INTO sources (id, name) VALUES (?, ?)', [source.id, source.name])
    }
}