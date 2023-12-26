import { Card, Label, Spinner, TextInput } from 'flowbite-react';
import { FC, useContext, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { ServerAction, TransactionsAtom } from '../../state/store';
import { WebsocketContext } from '../../state/data-connection';
import { moneyString } from '../../utils';

interface TransactionDisplayed {
    transactionId: string
}

export const TransactionDisplayed : FC<TransactionDisplayed> = ({ transactionId }) => {

    const websocket = useContext(WebsocketContext);
    const transactionMap = useRecoilValue(TransactionsAtom);
    const transaction = transactionMap[transactionId];

    useEffect(() => {
        websocket.send(ServerAction.requestTransactionById, { id: transactionId })
    }, [])

    const updateTransactionLabel = (label: string) => {
        websocket.send(ServerAction.requestUpdateTransactionById, { ...transaction, label })
    }

    if (!transaction) { return <Spinner /> }

    return <>
        <Card className="w-full shadow-none mb-4">
            <div className='flex'>
                <div style={{flex: 1}}>
                    <Label className="font-semibold">Transaction</Label>
                    <div>{transaction.id.substring(0,15)}</div>
                </div>
                <div style={{flex: 1}}>
                    <Label className="font-semibold">Date</Label>
                    <div>{new Date(transaction.date).toDateString()}</div>
                </div>
                <div style={{flex: 1}}>
                    <Label className="font-semibold">Source</Label>
                    <div>{transaction.sourceRef?.toUpperCase()}</div>
                </div>
                <div style={{flex: 1}}>
                    <Label className="font-semibold">Amount</Label>                                    
                    <div className={`${transaction.total > 0 ? 'text-green-500' : ''}`}>{moneyString(transaction.total)}</div>
                </div>
            </div>
            <div style={{flex: 1}}>
                <Label className="font-semibold">Raw Description</Label>
                <div>{transaction.description}</div>
            </div>
            <div style={{flex: 1}}>
                <Label className="font-semibold">Given Label</Label>
                <TextInput value={transaction.label||''} onChange={(e) => updateTransactionLabel(e.target.value)} className='w-[500px]' />
            </div>
        </Card>
    </>

}