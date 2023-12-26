import { Zynith } from "../index";
import { ServerAction } from "./actions";
import { logger } from "./log";

type respond = (message: any, data: any) => void
let log = logger('ws-actions')

const Handlers: any = {

    // Direct SQL invokes
    [ServerAction.requestRunSQL]: async (request: any, zynith: Zynith, send: respond) => {
        send( ServerAction.provideRunSQL, await zynith.database.run(request.command))
    },

    // Transactions
    [ServerAction.requestTransactionById]: async (request: any, zynith: Zynith, send: respond) => {
        send( ServerAction.provideTransactions, {
            [request.id]: await zynith.api.transactions.getTransactionById(request.id)
        })
    },
    [ServerAction.requestUpdateTransactionById]: async (request: any, zynith: Zynith, send: respond) => {
        await zynith.api.transactions.updateTransaction(request)
        send( ServerAction.provideTransactions, {
            [request.id]: await zynith.api.transactions.getTransactionById(request.id)
        })
    },
    [ServerAction.requestAllTransactions]: async (_: any, zynith: Zynith, send: respond) => {
        const allTransactions = await zynith.api.transactions.getAllTransactions()
        const response : any= {}
        allTransactions.forEach((t) => response[t.id] = t)
        send( ServerAction.provideTransactions, response)
    },
    
    [ServerAction.requestTransactionsByBucket]: async (request: any, zynith: Zynith, send: respond) => {
        const allTransactions = await zynith.api.transactions.getTransactionsInBucket(request.id)
        send( ServerAction.provideTransactionsByRelation, {
            [request.id]: allTransactions
        })
    },
    [ServerAction.requestTransactionsByFilter]: async (request: any, zynith: Zynith, send: respond) => {
        const allTransactions = await zynith.api.transactions.getTransactionsInFilter(request.id)
        send( ServerAction.provideTransactionsByRelation, {
            [request.id]: allTransactions
        })
    },
    [ServerAction.requestTransactionsBySource]: async (request: any, zynith: Zynith, send: respond) => {
        const allTransactions = await zynith.api.transactions.getTransactionsInSource(request.id)
        send( ServerAction.provideTransactionsByRelation, {
            [request.id]: allTransactions
        })
    },
    [ServerAction.requestTransactionsByDescription]: async (request: any, zynith: Zynith, send: respond) => {
        const allTransactions = await zynith.api.transactions.getAllTransactionsWithDescription(request.description)
        send( ServerAction.provideTransactionsByRelation, {
            [request.description]: allTransactions
        })
    },

    // Buckets
    [ServerAction.requestBucketById]: async (request: any, zynith: Zynith, send: respond) => {
        send( ServerAction.provideBuckets, {
            [request.id]: await zynith.api.buckets.getBucketById(request.id)
        })
    },
    [ServerAction.requestAllBuckets]: async (_: any, zynith: Zynith, send: respond) => {
        const allBuckets = await zynith.api.buckets.getAllBuckets()
        const response : any= {}
        allBuckets.forEach((t) => response[t.id] = t)
        send( ServerAction.provideBuckets, response)
    },
    [ServerAction.requestCreateBucket]: async (request: any, zynith: Zynith, send: respond) => {
        const created = await zynith.api.buckets.createBucket(request)
        send( ServerAction.provideBuckets, {[created.id]: created})
    },
    [ServerAction.requestUpdateBucketById]: async (request: any, zynith: Zynith, send: respond) => {
        const updatd = await zynith.api.buckets.updateBucket(request)
        send( ServerAction.provideBuckets, {[updatd.id]: updatd})
    },
    [ServerAction.requestDeleteBucket]: async (request: any, zynith: Zynith, send: respond) => {
        await zynith.api.buckets.deleteBucket(request.id)
        send( ServerAction.provideBuckets, {[request.id]: 0})
    },

    // Filters
    [ServerAction.requestFilter]: async (request: any, zynith: Zynith, send: respond) => {
        send( ServerAction.provideFilters, {
            [request.id]: await zynith.api.filters.getFilterById(request.id)
        })
    },
    [ServerAction.requestAllFilters]: async (_: any, zynith: Zynith, send: respond) => {
        const allFilters = await zynith.api.filters.getAllFilters()
        const response : any= {}
        allFilters.forEach((t) => response[t.id] = t)
        send( ServerAction.provideFilters, response)
    },
    [ServerAction.requestCreateFilter]: async (request: any, zynith: Zynith, send: respond) => {
        const created = await zynith.api.filters.createFilter(request)
        send( ServerAction.provideFilters, {[created.id]: created})
    },
    [ServerAction.requestDeleteFilter]: async (request: any, zynith: Zynith, send: respond) => {
        await zynith.api.filters.deleteFilter(request.id)
        send( ServerAction.provideFilters, {[request.id]: 0})
    },    
    [ServerAction.requestFiltersByBucket]: async (request: any, zynith: Zynith, send: respond) => {
        const getBucketFilters = await zynith.api.filters.getFilterByBucket(request.id)
        send( ServerAction.provideFiltersByRelation, {
            [request.id]: getBucketFilters
        })
    },

    //Allocations
    [ServerAction.requestAllAllocations]: async (_: any, zynith: Zynith, send: respond) => {
        const allAllocations = await zynith.api.allocations.getAllAllocations()
        const response : any= {}
        allAllocations.forEach((t) => response[t.id] = t)
        send( ServerAction.provideAllocations, allAllocations)
    },
    [ServerAction.requestCreateAllocation]: async (request: any, zynith: Zynith, send: respond) => {
        const created = await zynith.api.allocations.createAllocation(request)
        send( ServerAction.provideAllocations, {[created.id]: created})
        const getAllAllocations = await zynith.api.allocations.getAllocationByBucket(request.targetBucket)
        send( ServerAction.provideAllocationsByRelation, {
            [request.targetBucket]: getAllAllocations
        })
    },
    [ServerAction.requestDeleteAllocation]: async (request: any, zynith: Zynith, send: respond) => {
        await zynith.api.allocations.deleteAllocation(request.id)
        send( ServerAction.provideAllocations, {[request.id]: undefined})
        const getAllAllocations = await zynith.api.allocations.getAllocationByBucket(request.targetBucket)
        send( ServerAction.provideAllocationsByRelation, {
            [request.targetBucket]: getAllAllocations
        })
    },    
    [ServerAction.requestUpdateAllocation]: async (request: any, zynith: Zynith, send: respond) => {
        const updated = await zynith.api.allocations.updateAllocation(request.id, request)
        send( ServerAction.provideAllocations, {[updated.id]: updated})
        const getAllAllocations = await zynith.api.allocations.getAllocationByBucket(request.targetBucket)
        send( ServerAction.provideAllocationsByRelation, {
            [request.targetBucket]: getAllAllocations
        })
    },
    [ServerAction.requestAllocationsByBucket]: async (request: any, zynith: Zynith, send: respond) => {
        const getAllAllocations = await zynith.api.allocations.getAllocationByBucket(request.id)
        send( ServerAction.provideAllocationsByRelation, {
            [request.id]: getAllAllocations
        })
    },
    [ServerAction.requestCalculateByBucket]: async (request: any, zynith: Zynith, send: respond) => {
        send( ServerAction.provideCalculateByBucket, {
            [request.id]: {
                spending: await zynith.api.calculate.CalcualateSpendingByDayForBucket(request.id),
                allocations: await zynith.api.calculate.CalculateallocationByDayForBucket(request.id)
            }
        })
    },
    [ServerAction.requestBalances]: async (_: any, zynith: Zynith, send: respond) => {
        const allBalances = await zynith.api.ballances.computeBalances()
        send( ServerAction.provideBalances, allBalances)
    }    
}

export async function OnClientMessage (send: respond, message: ServerAction, data: any, zynith: Zynith){
    let handler = Handlers[message]
    if (handler) handler(data, zynith, send)
    else log.log(`No action for '${message}'`)
}