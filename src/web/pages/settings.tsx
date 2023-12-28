import { ServerAction } from "../state/store";
import { useContext, useState } from "react";
import { WebsocketContext } from "../state/data-connection";
import { PageTitle, SectionTitle } from "../componenets/titles";
import { KeyValueCard } from "../componenets/key-value-card";
import { DateInputBox, InputBox } from "../componenets/input";
import { Button } from "../componenets/button";
import { useModifySettings } from "../state/hooks";
import { Spinner } from "../componenets/spinner";

export function SettingsPage () {
    
    const websocket = useContext(WebsocketContext);
    const {settings, ...settingsAPi} = useModifySettings()
    const [sqlStatement, setSqlStatement] = useState<string>('');

    const runSql = (sql: string) => {
        websocket.send(ServerAction.requestRunSQL, {sql})
    }

    if (!settings) return <Spinner/>

    return <>

        <PageTitle title="Settings" />

        <SectionTitle title="Application Settings" />
        <KeyValueCard rows={[
            { 
                'Global Start Date': <>
                    <DateInputBox
                        value={settings.globalStartDate}
                        onSelectedDateChanged={date => settingsAPi.update({globalStartDate: date})}
                    />
                </>

            }
        ]} />

        <SectionTitle title="Direct SQL Invokes" />
        <KeyValueCard rows={[
            { 
                'Run SQL': <>
                    <div className="h-4"></div>
                    <InputBox
                        value={sqlStatement}
                        onChange={e => setSqlStatement(e)}
                        placeholder="SQL Statement"
                    />
                    <div className="h-4"></div>
                    <Button  onClick={() => runSql(sqlStatement)} text="Execute" />
                </>

            }
        ]} />
    </>
}