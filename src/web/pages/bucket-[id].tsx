import { useContext, useEffect, useMemo, useState } from "react";
import { Spinner } from "flowbite-react";
import { WebsocketContext } from "../state/data-connection";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import { BucketDisplayed } from "../widgets/bucket-displayed";
import { TimeAxisLineChart } from "../widgets/chart";
import { TransactionsTable } from "../widgets/transactions-table";
import { AllocationsTable } from "../widgets/allocations-table";
import { DataAggregator } from "../../database/dataAggregator";
import { AllocationsByRelationAtom, BucketsAtom, CalculationsByBucketAtom, FilterByRelationAtom, FiltersAtom, ServerAction, TransactionsByRelationAtom } from "../state/store";
import { PageTitle } from "../widgets/page-title";
import { FiltersTable } from "../widgets/filters-table";
import { MultiChoiceButton } from "../widgets/multi-choice-buttons";

export function BucketByIdPage () {
    
    useNavigate();

    const bucketId = window.location.pathname.split('/').pop() as string;
    const websocket = useContext(WebsocketContext);

    const bucketMap = useRecoilValue(BucketsAtom)
    const bucket = bucketMap[bucketId]
    const calculations = useRecoilValue(CalculationsByBucketAtom)[bucketId]
    const allocation = useRecoilValue(AllocationsByRelationAtom)[bucketId];
    
    const transactionsByBucket = useRecoilValue(TransactionsByRelationAtom)
    const transactions = transactionsByBucket[bucketId] || []
    const allFilters = useRecoilValue(FiltersAtom)
    const filtersByBucket = useRecoilValue(FilterByRelationAtom)
    const filters = filtersByBucket[bucketId] || []

    const [shownGraph, setShownGraph] = useState('spending')

    useEffect(() => websocket.send(ServerAction.requestAllBuckets), [])
    useEffect(() => websocket.send(ServerAction.requestBucketById, {id: bucketId}), [])
    useEffect(() => websocket.send(ServerAction.requestCalculateByBucket, {id: bucketId}), [bucket, allocation])
    useEffect(() => websocket.send(ServerAction.requestTransactionsByBucket, {id: bucketId}), [])
    useEffect(() => websocket.send(ServerAction.requestFiltersByBucket, {id: bucketId}), [allFilters])
    useEffect(() => websocket.send(ServerAction.requestAllFilters, {id: bucketId}), [])

    const accumulation = useMemo(() => {

        if (!calculations) return {
            Cumulative: [],
            Direct: []
        }

        let {spending, allocations} = calculations;

        let spendingCumulitave = new DataAggregator()
        spendingCumulitave.selfAddDataRaw(spending.CumulativeSpending)

        let spendingDirect = new DataAggregator()
        spendingDirect.selfAddDataRaw(spending.DirectSpending)
        
        let allotmentCumulative = new DataAggregator()
        allotmentCumulative.selfAddDataRaw(allocations.Cumulativeallocations)

        let allotmentDirect = new DataAggregator()
        allotmentDirect.selfAddDataRaw(allocations.Directallocations)

        let balanceCumulative = allotmentCumulative
            .selfSubtractAggregator(spendingCumulitave)
            .exportRunningSum()

        let balanceDirect = allotmentDirect
            .selfSubtractAggregator(spendingDirect)
            .exportRunningSum()


        return {
            Cumulative: balanceCumulative.exportData(),
            Direct: balanceDirect.exportData()
        }


    }, [calculations, allocation, bucket])

    if (!bucket || !calculations) return <Spinner />

    return <>
        <PageTitle title={`Bucket Overview: ${bucket.name}`}>
            <MultiChoiceButton
                options={['spending', 'allocation', 'accumulation']}
                selected={shownGraph}
                onSelect={setShownGraph}
            />
        </PageTitle>
        {
            shownGraph === 'spending' && 
            <TimeAxisLineChart
                data={calculations.spending||[]}
            />
        }
        {
            shownGraph === 'allocation' && 
            <TimeAxisLineChart
                preferedView="day"
                data={calculations.allocations||[]}
            />
        }
        {
            shownGraph === 'accumulation' && 
            <TimeAxisLineChart
                preferedView="day"
                data={accumulation||{}}
            />
        }
        
        <BucketDisplayed bucket={bucket} />

        <AllocationsTable bucketId={bucketId} />

        <PageTitle title={`Filters pointing to this bucket`} />
        <FiltersTable hideBucket={true} filters={filters} />

        <PageTitle title={`Transactions in this bucket`} />
        <TransactionsTable transactions={transactions} />

    </>

}