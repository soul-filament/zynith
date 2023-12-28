import { FC, useMemo, useState } from 'react';
import { TransactionRecord } from '../../../database/schema/transaction';
import { Table } from '../../componenets/table';
import { RenderMoney } from '../../componenets/money';
import { useNavigate } from 'react-router-dom';

interface TransactionsTableProps {
    transactions: TransactionRecord[]
}

export const TransactionsTable : FC<TransactionsTableProps> = ({ transactions }) => {

    const nav = useNavigate()
    const [sortColumn, setSortColumn] = useState('date')
    const [sortDirection, setSortDirection] = useState('desc')

    const sortedData = useMemo(() => {
        let transactionsCopy = [...transactions]
        transactionsCopy.sort((a, b) => {
            if (sortColumn === 'date') {
                let start = new Date(a.date).getTime()
                let end = new Date(b.date).getTime()
                if (sortDirection === 'asc') return  start - end
                else return end - start
            }   
            else if (sortColumn === 'source') {
                let sourceA = a.sourceRef || ''
                let sourceB = b.sourceRef || ''
                if (sortDirection === 'asc') return sourceA.localeCompare(sourceB)
                else return sourceB.localeCompare(sourceA)
            }
            else if (sortColumn === 'name') {
                if (sortDirection === 'asc') return (a.label || a.description).localeCompare(b.label || b.description)
                else return (b.label || b.description).localeCompare(a.label || a.description)
            }
            else if (sortColumn === 'amount') {
                if (sortDirection === 'asc') return a.total - b.total
                else return b.total - a.total
            }
            return 0
        })
        return transactionsCopy
    }, [transactions, sortColumn, sortDirection])

    return (
        <Table
            headers={['date', 'source', 'name', 'amount']}
            weight={[2,2,6,1]}
            onClick={(id) => nav(`/transaction/${id}`)}
            sortableColumns={['date', 'name', 'amount', 'source']}
            sortedColumn={sortColumn}
            sortedDirection={sortDirection}
            onSort={(column, direction) => {
                setSortColumn(column)
                setSortDirection(direction)
            }}
            rows={
                sortedData.map((transaction) => {
                    return {
                        id: transaction.id,
                        columns: {
                            date: new Date(transaction.date).toISOString().split('T')[0],
                            source: transaction.sourceRef,
                            name: <div className='truncate'>{(transaction.label || transaction.description).substring(0, 65)}</div>,
                            amount: (
                                <div className={`${transaction.total > 0 ? 'text-green-500' : ''}`}>
                                    <RenderMoney cents={transaction.total} />
                                </div>
                            )
                        }
                    }
                })
            }
        />
    )

}