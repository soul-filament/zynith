import { useRecoilValue } from "recoil"
import { AllocationAtom, BucketsAtom, ServerAction, TransactionsAtom } from "../state/store"
import { WebsocketContext } from "../state/data-connection"
import { useContext, useEffect, useMemo } from "react"
import { PageTitle } from "../widgets/page-title"
import { DataAggregator } from "../../database/dataAggregator"
import { TimeAxisLineChart } from "../widgets/chart"
import { Card, Label } from "flowbite-react"

export function HomePage () {

    const websocket = useContext(WebsocketContext)
    const allAllocations = useRecoilValue(AllocationAtom)
    const allBuckets = useRecoilValue(BucketsAtom)
    const allTransactions = useRecoilValue(TransactionsAtom)

    const addCommaToNumber = (x: number) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const allocationsResult = useMemo(() => {
        const data = {} as {[bucketId: string]: DataAggregator};

        if (!allAllocations || !allBuckets) return { rawData: {}}

        Object.keys(allAllocations).forEach((key) => {
            const allocation = allAllocations[key]
            const bucket = allBuckets[allocation.targetBucket] || {}

            let start = new Date(allocation.startDate)
            let end = allocation.endDate ? new Date(allocation.endDate) : undefined

            if (end && (end.getDate() - start.getDate()) <= 1) {
                return
            }

            if (!data[bucket.name]) {
                data[bucket.name] = new DataAggregator()
            }

            data[bucket.name].selfAddOnRange(
                allocation.amount,
                start,
                end
            )
        })

        const rawData = {} as {[bucketId: string]: {date: string, value: number}[]}
        let totalSum = 0;
        let latest = 0

        Object.keys(data).forEach((key) => {
            rawData[key] = data[key].exportData()
            totalSum += data[key].sumData()
            latest += rawData[key][rawData[key].length - 1].value
        })

        return {rawData, totalSum: Math.round(totalSum / 100), latest: Math.round(latest / 100)}

    }, [allAllocations, allBuckets])

    const allTranstionsSum = useMemo(() => {
        const excludedBucketNames = ['Transfers']
        const excludedBucketIds = Object.keys(allBuckets).filter((key) => excludedBucketNames.includes(allBuckets[key].name))

        let totalNet = 0;
        let totalSpend = 0;
        Object.keys(allTransactions).forEach((key) => {
            const transaction = allTransactions[key]
            if (!excludedBucketIds.includes(transaction.bucketRef!)) {
                totalNet += transaction.total
                if (transaction.total < 0) {
                    totalSpend += transaction.total
                }
            }
        })


        return {
            totalNet: Math.round(totalNet / 100),
            totalSpend: Math.round(totalSpend / 100)
        }

    }, [allTransactions, allBuckets])


    useEffect(() => {
        websocket.send(ServerAction.requestAllAllocations)
        websocket.send(ServerAction.requestAllBuckets)
        websocket.send(ServerAction.requestAllTransactions)
    }, [])

    if (!allocationsResult.latest) return <></>
    
    return <>
        <PageTitle title="Overview" />
        <TimeAxisLineChart data={allocationsResult.rawData} type="stackedbar" preferedView="day"  />
        <PageTitle title="Stats" />
        <Card className="w-full shadow-none mb-10">
            <div className='flex'>
                <div style={{flex: 1}}>
                    <Label className="font-semibold">Total Allocation</Label>
                    <div>${addCommaToNumber(allocationsResult.totalSum!)}</div>
                </div>
                <div style={{flex: 1}}>
                    <Label className="font-semibold">Latest Daily Allocation</Label>
                    <div>${allocationsResult.latest}</div>
                </div>

                <div style={{flex: 1}}>
                    <Label className="font-semibold">Latest Monthly Allocation</Label>
                    <div>${Math.round(allocationsResult.latest * 30)}</div>
                </div>
                <div style={{flex: 1}}>
                    <Label className="font-semibold">Total Net Transactions</Label>
                    <div>${addCommaToNumber(allTranstionsSum.totalNet)}</div>
                </div>
                <div style={{flex: 1}}>
                    <Label className="font-semibold">Total Spend Transactions</Label>
                    <div>${addCommaToNumber(allTranstionsSum.totalSpend)}</div>
                </div>
            </div>
        </Card>
    </>

}