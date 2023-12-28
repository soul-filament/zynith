import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WebsocketContext } from "./data-connection";
import { AllocationAtom, AllocationsByRelationAtom, BalancesAtom, BucketsAtom, CalculationsByBucketAtom, FilterByRelationAtom, FiltersAtom, ServerAction, SettingsAtom, TransactionsAtom, TransactionsByRelationAtom } from "./store";
import { useRecoilValue } from "recoil";
import { TransactionRecord } from "../../database/schema/transaction";
import { FilterRecord } from "../../database/schema/filter";

export function useWebsocket () {
    useNavigate();
    return useContext(WebsocketContext);
}

export function useAllBalances () {
    const ws = useWebsocket();
    useEffect(() => ws.send(ServerAction.requestBalances), [])
    return useRecoilValue(BalancesAtom);
}

export function useBucketById (id: string) {
    const ws = useWebsocket();
    useEffect(() => ws.send(ServerAction.requestBucketById, {id}), [])
    return useRecoilValue(BucketsAtom)[id];
}

export function useAllBuckets () {
    const ws = useWebsocket();
    useEffect(() => ws.send(ServerAction.requestAllBuckets), [])
    return useRecoilValue(BucketsAtom);
}

export function useChildBuckets (id: string) {
    const allBuckets = useAllBuckets();
    return Object.values(allBuckets).filter(bucket => bucket.parent === id);
}

export function useModifyBuckets () {
    const ws = useWebsocket();
    const buckets = useAllBuckets()
    const bucketsWithoutParents = Object.values(buckets).filter(bucket => !bucket.parent)
    return {
        buckets: Object.values(buckets),
        bucketsMap: buckets,
        bucketsWithoutParents,
        create: (parentBucket: any = undefined) => {
            ws.send(ServerAction.requestCreateBucket, {
                name: "New Bucket - " + Math.random().toString(36).substring(7),
                icon: undefined,
                parent: parentBucket
            })
        },
        update: (props: { id: string, name: string, icon?: string, parentBucketRef?: string }) => {
            ws.send(ServerAction.requestUpdateBucketById, props)
        },
        delete: (id: string) => {
            ws.send(ServerAction.requestDeleteBucket, { id })
        }
    }
}

export function useInfoByBucket (id: string) {
    const ws = useWebsocket();

    let calculations = useRecoilValue(CalculationsByBucketAtom)[id]
    let transactions = useRecoilValue(TransactionsByRelationAtom)[id]
    let filters = useRecoilValue(FilterByRelationAtom)[id]
    let allocations = useRecoilValue(AllocationsByRelationAtom)[id]
    let bucket = useRecoilValue(BucketsAtom)[id]
    let allBuckets = useRecoilValue(BucketsAtom)
    let childBuckets = Object.values(allBuckets).filter(bucket => bucket.parent === id);

    useEffect(() => ws.send(ServerAction.requestBucketById, {id}), [id])
    useEffect(() => ws.send(ServerAction.requestCalculateByBucket, {id}), [allocations, id])
    useEffect(() => ws.send(ServerAction.requestTransactionsByBucket, {id}), [id])
    useEffect(() => ws.send(ServerAction.requestFiltersByBucket, {id}), [id])
    useEffect(() => ws.send(ServerAction.requestAllocationsByBucket, {id}), [id])
    useEffect(() => ws.send(ServerAction.requestAllBuckets), [])

    const unloaded = !calculations || !transactions || !filters || !allocations || !bucket

    return {
        allBuckets,
        childBuckets,
        calculations,
        transactions,
        filters,
        bucket,
        allocations,
        unloaded
    }
}

export function useAllocationsByBucket (id: string) {
    const ws = useWebsocket();
    useEffect(() => ws.send(ServerAction.requestAllocationsByBucket, {id}), [])
    return useRecoilValue(AllocationsByRelationAtom)[id];
}

export function useAllAllocations () {
    const ws = useWebsocket();
    useEffect(() => ws.send(ServerAction.requestAllAllocations), [])
    return useRecoilValue(AllocationAtom);
}

export function useModifyAllocations () {
    const ws = useWebsocket();
    const allAllocations = useAllAllocations()
    return {
        create: (props: { targetBucket: string }) => {
            ws.send(ServerAction.requestCreateAllocation, { ...props, amount: 10, startDate: new Date().toISOString(), endDate: undefined })
        },
        updateStartDate: (props: { id: string, startDate: string }) => {
            ws.send(ServerAction.requestUpdateAllocation, {
                ...allAllocations[props.id],
                startDate: new Date(props.startDate).toISOString()
            })
        },
        updateEndDate: (props: { id: string, endDate: string }) => {
            ws.send(ServerAction.requestUpdateAllocation, {
                ...allAllocations[props.id],
                endDate: new Date(props.endDate).toISOString()
            })
        },
        updateAmount: (props: { id: string, amount: number }) => {
            ws.send(ServerAction.requestUpdateAllocation, {
                ...allAllocations[props.id],
                amount: props.amount
            })
        },
        delete: (id: string) => {
            const allocation = allAllocations[id]
            ws.send(ServerAction.requestDeleteAllocation, { id: id, targetBucket: allocation.targetBucket })
        }
    }
}

export function useModifyFilters () {

    const ws = useWebsocket();

    return {
        create: (props: { bucket: string, filter: string, label: string }) => {
            ws.send(ServerAction.requestCreateFilter, props)
        },
        delete: (id: string) => {
            ws.send(ServerAction.requestDeleteFilter, { id })
        }
    }
}

export function useTransactionById (id: string) {
    const ws = useWebsocket();
    
    const transaction = useRecoilValue(TransactionsAtom)[id];
    const otherSimilar = useRecoilValue(TransactionsByRelationAtom)[transaction?.description || ''] || []

    useEffect(() => ws.send(ServerAction.requestTransactionById, { id }), [])
    useEffect(() => ws.send(ServerAction.requestTransactionsByDescription, {
        description: transaction ? transaction.description : ''
    }), [transaction])
    
    return {
        transaction,
        otherSimilar
    }
}

export function useModifyTransactions () {
    const ws = useWebsocket();
    return {
        update: (transaction: TransactionRecord) => {
            ws.send(ServerAction.requestUpdateTransactionById, transaction)
        },
    }
}

export function useCreateFilter () {
    const ws = useWebsocket();
    const nav = useNavigate();
    const createFilter = (filter: Partial<FilterRecord>, transaction: TransactionRecord) => {
        ws.send(ServerAction.requestCreateFilter, filter)
        setTimeout(() => {
            ws.send(ServerAction.requestTransactionById, transaction)
            nav('/transactions')
        }, 100)
    }
    return { createFilter }
}

export function useFilterById (id: string) {
    const ws = useWebsocket();
    const filter = useRecoilValue(FiltersAtom)[id];
    const transactionByFilter = useRecoilValue(TransactionsByRelationAtom)[id];

    useEffect(() => ws.send(ServerAction.requestAllFilters, { id }), [])
    useEffect(() => ws.send(ServerAction.requestTransactionsByFilter, { id }), [])

    return {
        filter,
        transactionByFilter
    }
}

export function useModifyFilter () {
    const ws = useWebsocket();
    return {
        update: (filter: FilterRecord) => {
            ws.send(ServerAction.requestUpdateFilter, filter)
        },
        delete: (filter: FilterRecord) => {
            ws.send(ServerAction.requestDeleteFilter, filter)
        },
    }
}

export function useAllTransactions () {
    const ws = useWebsocket();
    useEffect(() => ws.send(ServerAction.requestAllTransactions), [])
    return useRecoilValue(TransactionsAtom);
}

export function useModifySettings () {
    const ws = useWebsocket();
    const settings = useRecoilValue(SettingsAtom);
    useEffect(() => ws.send(ServerAction.requestSettings), [])

    return {
        settings, 
        update: (props: any) => {
            ws.send(ServerAction.requestUpdateSettings, props)
        }
    }
}