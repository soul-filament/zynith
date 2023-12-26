import { Card, Label, Spinner, TextInput, Button } from 'flowbite-react';
import { FC, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useRecoilValue } from 'recoil';
import { BucketsAtom, ServerAction, TransactionsAtom } from '../state/store';
import { WebsocketContext } from '../state/data-connection';
import { getIconsByName } from './_old/icons';
import { FilterRef } from './filter-ref';
import { TrashIcon } from '@heroicons/react/20/solid';

interface TransactionSorter {
    transactionId: string
}

export const SortTransaction : FC<TransactionSorter> = ({ transactionId }) => {

    const nav = useNavigate();

    const websocket = useContext(WebsocketContext);

    const transaction = useRecoilValue(TransactionsAtom)[transactionId];
    const allBuckets = useRecoilValue(BucketsAtom);

    const [filterText, setFilterText] = useState('')

    useEffect(() => {
        websocket.send(ServerAction.requestTransactionById, { id: transactionId })
        websocket.send(ServerAction.requestAllBuckets)
    }, [])

    useEffect(() => {
        if (transaction) {
            setFilterText(transaction.description)
        }
    }, [transaction])

    const assignToBucket = (bucketId?: string) => {
        websocket.send(ServerAction.requestUpdateTransactionById, { id: transactionId, bucketRef: bucketId, label: transaction.label, filterRef: transaction.filterRef })
    }

    const removeFilter = () => {
        websocket.send(ServerAction.requestUpdateTransactionById, { id: transactionId, bucketRef: transaction.bucketRef, label: transaction.label, filterRef: undefined })
    }

    const createFilter = () => {
        if (!transaction.bucketRef) return 
        websocket.send(ServerAction.requestCreateFilter, { 
            name: filterText,
            label: transaction.label,
            filter: filterText,
            bucket: transaction.bucketRef,
        })
        setTimeout(() => {
            websocket.send(ServerAction.requestTransactionById, { id: transactionId })
            nav('/transactions')
        }, 100)
    }

    if (!transaction) { return <Spinner /> }

    return <>
        <Card className="w-full shadow-none mb-4">
            <Label className="">Assigned Bucket</Label>
            <div className="flex flex-wrap gap-2">
                {
                    Object.values(allBuckets).map(bucket => {
                        return <div 
                            key={bucket.id}
                            className={`p-2 flex gap-2 rounded-md border border-gray-200 cursor-pointer  font-xs ${bucket.id === transaction.bucketRef ? 'border-gray-500 bg-gray-200' : 'hover:bg-gray-100'}`} 
                            onClick={() => assignToBucket(bucket.id)}>
                            {getIconsByName(bucket.icon)}
                            {bucket.name}
                        </div>
                    })   
                }
            </div>
            <Label className="">Assigned Filter</Label>
            <div className='flex'>
                <FilterRef filterId={transaction.filterRef} />
                {
                    transaction.filterRef &&
                    <div className="ml-4 flex p-1 gap-2 cursor-pointer"  onClick={removeFilter}>
                        <TrashIcon className="w-5 h-5 text-gray-500 hover:text-red-500 " />
                    </div>
                }
            </div>

            <Label className="">Create Similar Filter</Label>
            <div className='flex'>
                <TextInput
                    className="w-[300px]"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                />
                <Button className="ml-2" outline gradientDuoTone='purpleToBlue' onClick={createFilter}>Create Filter</Button>
            </div>
        </Card>
    </>

}