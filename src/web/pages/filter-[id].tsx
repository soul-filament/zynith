import { TransactionsTable } from "../widgets/tables/transactions-table"
import { FilterDisplayed } from "../widgets/records/filter-displayed"
import { PageTitle, SectionTitle } from "../componenets/titles"
import { idFromPage } from "../utils"
import { useFilterById } from "../state/hooks"
import { Spinner } from "../componenets/spinner"

export function FilterById () {

    const filterId = idFromPage()
    const {filter, transactionByFilter} = useFilterById(filterId)

    if (!filter || !transactionByFilter) return <Spinner />

    return <>
        <PageTitle title={`Filter ${filter.label || filter.filter}`} />    

        <SectionTitle title="Filter details" />   
        <FilterDisplayed Filter={filter} />
        <div className="h-10"></div>

        <SectionTitle title="Transactions Assigned to Filter" />
        <TransactionsTable transactions={transactionByFilter} />
    </>

}