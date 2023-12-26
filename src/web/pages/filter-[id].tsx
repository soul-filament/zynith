import { useRecoilValue } from "recoil"
import { Spinner } from "flowbite-react"
import {  FiltersAtom, ServerAction, TransactionsByRelationAtom } from "../state/store"
import { WebsocketContext } from "../state/data-connection"
import { useContext, useEffect } from "react"
import { TransactionsTable } from "../widgets/transactions-table"
import { FilterDisplayed } from "../widgets/_old/filter-displayed"
import { PageTitle } from "../widgets/page-title"

export function FilterById () {

    const websocket = useContext(WebsocketContext);
    const filters = useRecoilValue(FiltersAtom)
    const filterId = window.location.pathname.split('/').pop()!
    const filter = filters[filterId]
    const transactionByFilter = useRecoilValue(TransactionsByRelationAtom)[filterId]

    useEffect(() => {
        websocket.send(ServerAction.requestFilter, { id: filterId })
        websocket.send(ServerAction.requestTransactionsByFilter, { id: filterId })
    }, [])

    if (!filter || !transactionByFilter) {
        return <Spinner />
    }

    return <>
        <PageTitle title={`Filter ${filter.label || filter.filter}`} />       
        <FilterDisplayed Filter={filter} />

        <PageTitle title="Transactions sorted" />
        <TransactionsTable 
            transactions={transactionByFilter} 
        />
    </>

}