import { PageTitle, SectionTitle } from "../componenets/titles"
import { DataAggregator } from "../../database/dataAggregator"
import { TimeAxisLineChart } from "../widgets/chart"
import { useAllAllocations, useAllBuckets, useAllTransactions, useModifySettings } from "../state/hooks"
import { useMemo } from "react"
import { KeyValueCard } from "../componenets/key-value-card"

export function HomePage () {

    const allAllocations = useAllAllocations()
    const allBuckets = useAllBuckets()
    const allTransactions = useAllTransactions()
    const {settings} = useModifySettings()
    
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
                data[bucket.name] = new DataAggregator(new Date(settings.globalStartDate))
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

    if (allocationsResult.latest === undefined) return <>No allocations</>
    
    return <>
        <PageTitle title="Financial Overview" />

        <SectionTitle title="Allocations" />
        <TimeAxisLineChart data={allocationsResult.rawData} type="stackedbar" preferedView="day"  />

        <SectionTitle title="Stats" />
        <KeyValueCard rows={[
            {
                'Total Allocations': `$${addCommaToNumber(allocationsResult.totalSum!)}`,
                'Latest Daily Allocation': `$${allocationsResult.latest}`,
                'Latest Monthly Allocation': `$${Math.round(allocationsResult.latest * 30)}`,
                'Total Net Transactions': `$${addCommaToNumber(allTranstionsSum.totalNet)}`,
                'Total Spend Transactions': `$${addCommaToNumber(allTranstionsSum.totalSpend)}`
            },
        ]} />
    </>

}