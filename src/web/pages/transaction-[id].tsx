import { PageTitle, SectionTitle } from "../componenets/titles";
import { SortTransaction } from "../widgets/sort-transaction";
import { TransactionDisplayed } from "../widgets/records/transaction-displayed";
import { TransactionsTable } from "../widgets/tables/transactions-table";
import { Spinner } from "../componenets/spinner";
import { idFromPage } from "../utils";
import { useTransactionById } from "../state/hooks";

export function TransactionByIdPage () {
    
    const transactionId = idFromPage()
    const {transaction, otherSimilar} = useTransactionById(transactionId)

    if (!transaction) return <Spinner />

    return <>
        <PageTitle title="Viewing Transaction"/>

        <SectionTitle title="Transaction Details"/>
        <TransactionDisplayed transaction={transaction} />
        <div className="h-10"></div>

        <SectionTitle title="Assign To Bucket"/>
        <SortTransaction transaction={transaction} />
        <div className="h-10"></div>

        <SectionTitle title="All Transactions Like This"/>
        <TransactionsTable transactions={otherSimilar} />
        <div className="h-10"></div>
    </>
}