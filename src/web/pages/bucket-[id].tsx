import { useMemo, useState } from "react";
import { BucketDisplayed } from "../widgets/records/bucket-displayed";
import { TimeAxisLineChart } from "../widgets/chart";
import { TransactionsTable } from "../widgets/tables/transactions-table";
import { AllocationsTableForBucket } from "../widgets/tables/allocations-table";
import { DataAggregator } from "../../database/dataAggregator";
import { PageTitle, SectionTitle } from "../componenets/titles";
import { FiltersTable } from "../widgets/tables/filters-table";
import { MultiChoiceButton } from "../componenets/button";
import { useInfoByBucket, useModifySettings } from "../state/hooks";
import { idFromPage } from "../utils";
import { Spinner } from "../componenets/spinner";

export function BucketByIdPage () {
    
    const bucketId = idFromPage();
    const {calculations, transactions, filters, bucket, allocations, unloaded, childBuckets} = useInfoByBucket(bucketId)
    const {settings} = useModifySettings()

    const [shownGraph, setShownGraph] = useState('spending')

    const accumulation = useMemo(() => {

        let empty : any= { Direct: [] }
        if (childBuckets.length !== 0) empty.Cumulative = []
        
        if (unloaded) return { Cumulative: [], Direct: []}

        let {spending, allocations} = calculations;

        let spendingCumulitave = new DataAggregator(new Date(settings.globalStartDate))
        spendingCumulitave.selfAddDataRaw(spending.CumulativeSpending)
        let spendingDirect = new DataAggregator(new Date(settings.globalStartDate))
        spendingDirect.selfAddDataRaw(spending.DirectSpending)
        
        let allotmentCumulative = new DataAggregator(new Date(settings.globalStartDate))
        allotmentCumulative.selfAddDataRaw(allocations.Cumulativeallocations)
        let allotmentDirect = new DataAggregator(new Date(settings.globalStartDate))
        allotmentDirect.selfAddDataRaw(allocations.Directallocations)

        let balanceCumulative = allotmentCumulative
            .selfSubtractAggregator(spendingCumulitave)
            .exportRunningSum()

        let balanceDirect = allotmentDirect
            .selfSubtractAggregator(spendingDirect)
            .exportRunningSum()


        let result: any = { Direct: balanceDirect.exportData() }
        if (childBuckets.length !== 0) result.Cumulative = balanceCumulative.exportData()

        return result
    }, [calculations, allocations, bucket])

    if (unloaded) return <Spinner />

    return <>
        <PageTitle title={bucket.name} />
        <SectionTitle title="Graphed" >
            <MultiChoiceButton
                options={['spending', 'allocation', 'accumulation']}
                selected={shownGraph}
                onSelect={setShownGraph}
            />
        </SectionTitle>

        {
            shownGraph === 'spending' && 
            <TimeAxisLineChart data={calculations.spending} />
        }
        {
            shownGraph === 'allocation' && 
            <TimeAxisLineChart preferedView="day" data={calculations.allocations} />
        }
        {
            shownGraph === 'accumulation' && 
            <TimeAxisLineChart preferedView="day" data={accumulation} />
        }
        <BucketDisplayed bucket={bucket} />
        <div className="h-10"  />
        
        <AllocationsTableForBucket bucketId={bucketId} />
        <div className="h-10"  />

        <SectionTitle title={`Filters`} />
        <FiltersTable filters={filters} />
        <div className="h-10"  />

        <SectionTitle title={`Transactions`} />
        <TransactionsTable transactions={transactions} />
    </>


}