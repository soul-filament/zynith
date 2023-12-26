import { useRecoilValue } from "recoil";
import { PageTitle } from "../widgets/page-title";
import { SortTransaction } from "../widgets/sort-transaction";
import { TransactionDisplayed } from "../widgets/_old/transaction-displayed";
import { ServerAction, TransactionsAtom, TransactionsByRelationAtom } from "../state/store";
import { useContext, useEffect } from "react";
import { WebsocketContext } from "../state/data-connection";
import { TransactionsTable } from "../widgets/transactions-table";

export function TransactionByIdPage () {
    
    const transactionId = window.location.pathname.split('/').pop() as string;
    const transaction = useRecoilValue(TransactionsAtom)[transactionId];

    const websocket = useContext(WebsocketContext);
    const otherSimilar = useRecoilValue(TransactionsByRelationAtom)[transaction?.description || ''] || []

    useEffect(() => {
        websocket.send(ServerAction.requestTransactionById, { id: transactionId })
    }, [])

    useEffect(() => {
        if (transaction) 
            websocket.send(ServerAction.requestTransactionsByDescription, { description: transaction.description  })
    }, [transaction])

    return <>
        <PageTitle title="Viewing Transaction"/>
        <TransactionDisplayed transactionId={transactionId} />

        <PageTitle title="Assign To Bucket / Filter"/>
        <SortTransaction transactionId={transactionId} />

        <PageTitle title="Other Similar Transactions"/>
        <TransactionsTable transactions={otherSimilar} />
    </>
}