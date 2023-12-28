import { useEffect, useState } from "react";
import { TransactionsTable } from "../widgets/tables/transactions-table";
import { TransactionRecord } from "../../database/schema/transaction";
import { PageTitle, SectionTitle } from "../componenets/titles";
import { MultiChoiceButton } from "../componenets/button";
import { useAllTransactions } from "../state/hooks";

export function TransactionsPage () {
    
    const transactions = useAllTransactions();
    const [selection, setSelection] = useState('unsorted');
    const [renderedTransactions, setRenderedTransactions] = useState([] as TransactionRecord[]);

    useEffect(() => {
        if (selection === 'this month') {

            const now = new Date();
            const month = now.getMonth();
            const year = now.getFullYear();

            setRenderedTransactions(
                Object.keys(transactions)
                    .map(i => transactions[i])
                    .filter(t => new Date(t.date).getMonth() === month && new Date(t.date).getFullYear() === year)
            )
        }
        else if (selection === 'all') {
            setRenderedTransactions(
                Object.keys(transactions)
                    .map(i => transactions[i])
            )
        }
        else if (selection === 'unsorted') {
            setRenderedTransactions(
                Object.keys(transactions)
                    .map(i => transactions[i])
                    .filter(t => !t.bucketRef)
            )
        }
    }, [selection, transactions])

    return <>
        <PageTitle title={`Transactions`} />

        <SectionTitle title={`Transactions (${renderedTransactions.length})`}>
            <MultiChoiceButton
                    options={['this month', 'all', 'unsorted']}
                    selected={selection}
                    onSelect={setSelection}
                />
        </SectionTitle>
        <TransactionsTable transactions={renderedTransactions} />
    </>
}