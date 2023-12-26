import { ServerAction } from "../state/store";
import { useContext, useState } from "react";
import { WebsocketContext } from "../state/data-connection";
import { Button, Textarea, Label } from "flowbite-react";

export function SettingsPage () {
    
    const websocket = useContext(WebsocketContext);
    const [sqlStatement, setSqlStatement] = useState<string>('');

    const runSql = (sql: string) => {
        websocket.send(ServerAction.requestRunSQL, {sql})
    }

    return <>
        <Label>Write SQL Statement</Label>
        <Textarea value={sqlStatement} onChange={e => setSqlStatement(e.target.value)}></Textarea>
        <div className="h-4"></div>
        <Button outline gradientDuoTone='purpleToBlue' onClick={() => runSql(sqlStatement)}>Execute</Button>
    </>
}