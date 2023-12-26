import { Spinner } from "flowbite-react";
import { FC, createContext, useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { AllocationAtom, AllocationsByRelationAtom, BalancesAtom, BucketByRelationAtom, BucketsAtom, CalculationsByBucketAtom, FilterByRelationAtom, FiltersAtom, ServerAction, TransactionsAtom, TransactionsByRelationAtom, merge } from "./store";

export const WebsocketContext = createContext<DataConnectionState>(undefined as any);

interface DataConnectionProps {
    children: React.ReactNode;
}

interface DataConnectionState {
    send: (message: any, data?: any) => void;
}

export const DataConnection: FC<DataConnectionProps> = ({ children }) => {

    // create a ws connection
    const [webSocket, setWebSocket] = useState<WebSocket>();
    const [connected, setConnected] = useState<boolean>(false);

    // Tie into the data objects
    const setTransactionsAtom = useSetRecoilState(TransactionsAtom);
    const setBucketsAtom = useSetRecoilState(BucketsAtom)
    const setFiltersAtom = useSetRecoilState(FiltersAtom)
    const setAllocationAtom = useSetRecoilState(AllocationAtom)

    const setTransactionRelationAtom = useSetRecoilState(TransactionsByRelationAtom)
    const setBucketsRelationAtom = useSetRecoilState(BucketByRelationAtom)
    const setFiltersRelationAtom = useSetRecoilState(FilterByRelationAtom)
    const setAllocationsRelationsAtom = useSetRecoilState(AllocationsByRelationAtom)

    const setCalculationsByBucketIdAtom = useSetRecoilState(CalculationsByBucketAtom)
    const setBalancesByBucketIdAtom = useSetRecoilState(BalancesAtom)

    // handle incoming messages 
    const onMessageReceived : {[key: string]: (data: any) => void} = {
        [ServerAction.provideTransactions]: (data: any) => 
            setTransactionsAtom(prev => ({ ... prev, ... data }))
        ,
        [ServerAction.provideTransactionsByRelation]: (data: any) => 
            setTransactionRelationAtom(prev => ({ ... prev, ... data }))
        ,
        [ServerAction.provideBuckets]: (data: any) => 
            setBucketsAtom(prev => merge(prev, data))
        ,
        [ServerAction.provideBucketsByRelation]: (data: any) => 
            setBucketsRelationAtom(prev => merge(prev, data))
        ,
        [ServerAction.provideFilters]: (data: any) => 
            setFiltersAtom(prev => merge(prev, data))
        ,
        [ServerAction.provideFiltersByRelation]: (data: any) => 
            setFiltersRelationAtom(prev => merge(prev, data))
        ,
        [ServerAction.provideAllocations]: (data: any) => 
            setAllocationAtom(prev => merge(prev, data))
        ,
        [ServerAction.provideAllocationsByRelation]: (data: any) => 
            setAllocationsRelationsAtom(prev => merge(prev, data))
        ,
        [ServerAction.provideCalculateByBucket]: (data: any) => 
            setCalculationsByBucketIdAtom(prev => merge(prev, data))
        ,
        [ServerAction.provideBalances]: (data: any) => 
            setBalancesByBucketIdAtom(prev => merge(prev, data))
        ,
    }

    // create a ws connection
    useEffect(() => {
        let websocket = new WebSocket("ws://localhost:8080/ws");
        setWebSocket(websocket);

        websocket.addEventListener("open", () => {
            setConnected(true);
            websocket.addEventListener("message", e => {
                const message = JSON.parse(e.data.toString());
                onMessageReceived[message.action](message.data);
            })
        })

        return () => websocket.close();
    }, []);

    // create data connection object
    const dataConnection: DataConnectionState = {
        send: (message: string, data: any = {}) => {
            if (webSocket) {
                webSocket.send(JSON.stringify({
                    message,
                    data
                }));
            }
        }
    };

    if (!connected) {
        return <Spinner/>
    }

    return (
        <WebsocketContext.Provider value={dataConnection}>
            {children}
        </WebsocketContext.Provider>
    )
}
    