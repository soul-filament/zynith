import { useRecoilValue } from "recoil";
import { useContext, useEffect } from "react";
import { WebsocketContext } from "../state/data-connection";
import { Spinner } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { TimeAxisLineChart } from "../widgets/chart";
import { BalancesAtom, ServerAction } from "../state/store";

export function BalancesPage () {
    
    const websocket = useContext(WebsocketContext);
    useNavigate();
    const balances = useRecoilValue(BalancesAtom);

    useEffect(() => {
        websocket.send(ServerAction.requestBalances)
    }, [])

    if (!balances) return <Spinner />

    return <>
        <div className="">
            <h2 className="text-lg font-semibold text-gray-900 p-4">Balances</h2>
            <TimeAxisLineChart
                preferedView="day"
                data={balances}
            />
        </div>
    </>
}