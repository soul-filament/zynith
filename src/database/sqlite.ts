import * as sqlite from 'sqlite3'
import { buildDatabaseTables } from './schema/_'

interface DataBaseConnectionConfig {
    sqlite_filename: string
}

export class DatabaseConnection {

    private connection: sqlite.Database

    // Boot the database connection
    public constructor (config: DataBaseConnectionConfig) {
        //@ts-ignore because sqlite is weird
        let _ = sqlite.default || sqlite
        this.connection = new (_.verbose().Database)(config.sqlite_filename)
    }

    // Build the database tables
    public async build () {
        await buildDatabaseTables(this)
        await this.connection.run(`PRAGMA case_sensitive_like=OFF;`)
        // this.connection.on('trace', (sql) => {
        //     console.log('trace', sql)
        // })
    }

    // Shutdown the database connection
    public async shutdown () {
        await new Promise<void>((resolve, reject) => {
            this.connection.close((err: any) => err ? reject(err) : resolve())
        })
    }

    // Running Queries

    public async run (statement: string, variables: any[] = []): Promise<sqlite.RunResult> {
        return await new Promise<sqlite.RunResult>((resolve, reject) => {
            this.connection.run(statement, variables, (error: any, result: sqlite.RunResult,  ) => {
                if (error) { 
                    console.log(statement, variables)
                    console.log(error)
                    reject(error) 
                }
                else { resolve(result) }
            })
        })
    }

    public async get<T> (statement: string, variables: any = []): Promise<T> {
        return await new Promise<any>((resolve, reject) => {
            this.connection.get(statement, variables, (error: any, result: any) => {
                if (error) { 
                    console.log(statement, variables)
                    console.log(error)
                    reject(error) 
                }
                else { resolve(result) }
            })
        })
    }

    public async all<T> (statement: string, variables: any[] = []): Promise<T[]> {
        return await new Promise<any[]>((resolve, reject) => {
            this.connection.all(statement, variables, (error: any, result: any[]) => {
                if (error) { 
                    console.log(statement, variables)
                    console.log(error)
                    reject(error) 
                }
                else { resolve(result) }
            })
        })
    }

}