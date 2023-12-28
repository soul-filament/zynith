import { SettingRecord } from "../schema/settings";
import { DatabaseConnection } from "../sqlite";

export class SettingsHandlers {

    public constructor (private connection: DatabaseConnection) {}

    async getSettings (): Promise<SettingRecord> {
        return this.connection.get('SELECT * FROM settings where id = "global"')
    }

    async setSettings (settings: SettingRecord) {
        await this.connection.run(`
            UPDATE settings
            SET globalStartDate = ?
            WHERE id = "global"`, [settings.globalStartDate])
    }
}