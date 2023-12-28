import { DatabaseConnection } from "../sqlite"

export interface SettingRecord {
    id: string
    globalStartDate: string
}

export async function createSettingsTable (database: DatabaseConnection) {
    await database.run(`
        CREATE TABLE IF NOT EXISTS settings (
            id TEXT PRIMARY KEY,
            globalStartDate TEXT
        )`)
    await database.run(`
        INSERT or IGNORE INTO settings (id, globalStartDate)
        VALUES ('global', '2020-01-01'
        )`)
}