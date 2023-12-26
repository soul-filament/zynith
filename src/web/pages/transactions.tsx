import { useRecoilValue } from "recoil";
import { ServerAction, TransactionsAtom } from "../state/store";
import { useContext, useEffect, useState } from "react";
import { WebsocketContext } from "../state/data-connection";
import { TransactionsTable } from "../widgets/transactions-table";
import { TransactionRecord } from "../../database/schema/transaction";
import { PageTitle } from "../widgets/page-title";
import { MultiChoiceButton } from "../widgets/multi-choice-buttons";

export function TransactionsPage () {
    
    const websocket = useContext(WebsocketContext);
    const transactions = useRecoilValue(TransactionsAtom);

    const [selection, setSelection] = useState('unsorted');
    const [renderedTransactions, setRenderedTransactions] = useState([] as TransactionRecord[]);

    useEffect(() => {
        if (selection === 'month') {

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

    useEffect(() => {
        websocket.send(ServerAction.requestAllTransactions)
    }, [])

    return <>
        <PageTitle title={`Transactions (${renderedTransactions.length})`}>
            <MultiChoiceButton
                options={['month', 'all', 'unsorted']}
                selected={selection}
                onSelect={setSelection}
            />
        </PageTitle>
        <TransactionsTable transactions={renderedTransactions} />
    </>
}