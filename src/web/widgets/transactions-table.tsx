import { Table } from 'flowbite-react';
import { FC, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { TransactionRecord } from '../../database/schema/transaction';
import { moneyString } from '../utils';

interface TransactionsTableProps {
    transactions: TransactionRecord[]
}

export const TransactionsTable : FC<TransactionsTableProps> = ({ transactions }) => {

    const nav = useNavigate();

    const [sort, setSort] = useState('amount' as 'date' | 'amount')
    const [direction, setDirection] = useState('desc' as 'asc' | 'desc')

    const sortedTransactions = useMemo(() => {
        if (sort === 'amount') {
            let copy = [...transactions];
            if (direction === 'asc') {
                copy.sort((a, b) => a.total - b.total)
            }
            else {
                copy.sort((a, b) => b.total - a.total)
            }
            return copy;
        }
        if (sort === 'date') {
            let copy = [...transactions];
            if (direction === 'asc') {
                copy.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            }
            else {
                copy.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            }
            return copy;
        }
        return transactions;
    }, [transactions, sort, direction])

    let previous = '' as any
    let color = ['bg-blue-100', 'bg-white']

    return (
        <div className="overflow-x-auto border rounded-md shadow">
            <Table className='w-full'>
                <Table.Head className='border-b'>
                    <Table.HeadCell onClick={() => {
                        if (sort === 'date') {
                            if (direction === 'asc') {
                                setDirection('desc')
                            }
                            else {
                                setDirection('asc')
                            }
                        }
                        else {
                            setSort('date')
                            setDirection('desc')
                        }
                    }} className='cursor-pointer'>Date</Table.HeadCell>
                    <Table.HeadCell>Source</Table.HeadCell>
                    <Table.HeadCell>Name</Table.HeadCell>
                    <Table.HeadCell onClick={() => {
                        if (sort === 'amount') {
                            if (direction === 'asc') {
                                setDirection('desc')
                            }
                            else {
                                setDirection('asc')
                            }
                        }
                        else {
                            setSort('amount')
                            setDirection('desc')
                        }
                    }} className='cursor-pointer'>Amount</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                    {
                        sortedTransactions.map((transaction, index) => {
                            let dateStr = new Date(transaction.date).getMonth() 
                            if (dateStr !== previous) {
                                previous = dateStr
                                color.reverse()
                            }
                            return (
                            <Table.Row key={index} className={`bg-white cursor-pointer hover:bg-gray-100 ${color[0]} `} onClick={() => nav(`/transaction/${transaction.id}`)}>
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900">
                                    {new Date(transaction.date).toISOString().split('T')[0]}
                                </Table.Cell>
                                <Table.Cell>{transaction.sourceRef}</Table.Cell>
                                <Table.Cell>{(transaction.label || transaction.description).substring(0, 80)}</Table.Cell>
                                <Table.Cell className={`text-right ${transaction.total > 0 ? 'text-green-500' : ''}`}>{moneyString(transaction.total)}</Table.Cell>
                            </Table.Row>
                            )
                        })
                    }
                    {
                        sortedTransactions.length === 0 && (
                            <Table.Row>
                                <Table.Cell colSpan={4} className="text-center">
                                    No Transactions
                                </Table.Cell>
                            </Table.Row>
                        )
                    }
                </Table.Body>
            </Table>
        </div>
    );
}