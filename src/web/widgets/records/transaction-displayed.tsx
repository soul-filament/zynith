import { FC  } from 'react';
import { TransactionRecord } from '../../../database/schema/transaction';
import { useModifyTransactions } from '../../state/hooks';
import { KeyValueCard } from '../../componenets/key-value-card';
import { RenderMoney } from '../../componenets/money';
import { InputBox } from '../../componenets/input';

interface TransactionDisplayed {
    transaction: TransactionRecord
}

export const TransactionDisplayed : FC<TransactionDisplayed> = ({ transaction }) => {

    const transactionAPI = useModifyTransactions()

    return <>
        <KeyValueCard rows={
            [
                {
                    'Transaction Id': transaction.id.substring(0,15),
                    'Date': new Date(transaction.date).toISOString().split('T')[0],
                    'Source': transaction.sourceRef?.toUpperCase(),
                    'Amount': <RenderMoney cents={transaction.total} />
                },
                {
                    'Raw Description': transaction.description,
                    'Given Label': (
                        <InputBox 
                            value={transaction.label||''} 
                            placeholder='No Label'
                            onChange={(v) => transactionAPI.update({
                                ...transaction,
                                label: v
                            })} 
                        />
                    )
                }
            ]
        } />
    </>

}