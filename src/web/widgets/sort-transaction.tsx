import { FC, useState } from 'react';
import { FilterRef } from './filter-ref';
import { TrashIcon } from '@heroicons/react/20/solid';
import { Icon } from '../componenets/icons';
import { TransactionRecord } from '../../database/schema/transaction';
import { useAllBuckets, useCreateFilter, useModifyTransactions } from '../state/hooks';
import { KeyValueCard } from '../componenets/key-value-card';
import { Button } from '../componenets/button';
import { InputBox } from '../componenets/input';
import { Spinner } from '../componenets/spinner';
import { BucketRef } from './bucket-ref';

interface TransactionSorter {
    transaction: TransactionRecord
}

export const SortTransaction : FC<TransactionSorter> = ({ transaction }) => {

    const buckets = useAllBuckets()
    const currentBucket = buckets[transaction.bucketRef!]
    const api = useModifyTransactions()

    const [filterText, setFilterText] = useState(transaction.description)
    const {createFilter} = useCreateFilter()
    
    const removeFilter = () => api.update({ ...transaction, filterRef: undefined })
    const assignToBucket = (bucketId?: string) => {
        api.update({ ...transaction, bucketRef: bucketId })
        removeFilter()
    }

    if (!transaction || !currentBucket) { return <Spinner /> }

    return <>
        <KeyValueCard
            rows={[
                {
                    'Current Bucket': <div className='flex gap-2 py-2'>
                        <BucketRef bucketId={transaction.bucketRef} />
                    </div>,
                },
                {
                    'Assign Bucket': (
                        <div className="flex flex-wrap gap-2 py-4">
                        {
                            Object.values(buckets).map(bucket => {
                                return <div 
                                    key={bucket.id}
                                    className={`p-1 px-2 flex gap-2 rounded-md border border-transparent hover:border-gray-200 cursor-pointer font-xs ${bucket.id === transaction.bucketRef ? 'border-gray-500 bg-gray-200' : 'hover:bg-gray-100'}`} 
                                    onClick={() => assignToBucket(bucket.id)}>
                                        <div className="scale-70">
                                            <Icon name={bucket.icon} />
                                        </div>
                                    {bucket.name}
                                </div>
                            })   
                        }
                    </div>
                    )
                },
                {
                    'Applied Filter': (
                        <div className='flex gap-2 py-2'>
                            <FilterRef filterId={transaction.filterRef} />
                            {
                                transaction.filterRef &&
                                <div className="ml-4 flex p-1 gap-2 cursor-pointer"  onClick={removeFilter}>
                                    <TrashIcon className="w-5 h-5 text-gray-500 hover:text-red-500 " />
                                </div>
                            }
                        </div>
                    )
                },
                {
                    'CreateFilter': (
                        <div className="flex gap-2">
                            <InputBox
                                value={filterText}
                                onChange={(e) => setFilterText(e)}
                            />
                            <div className="py-2">
                                <Button 
                                    onClick={() => {
                                        createFilter({
                                            label: filterText,
                                            bucket: transaction.bucketRef,
                                            filter: filterText
                                        }, transaction)}
                                    } 
                                    text='Create'
                                />
                            </div>
                        </div>
                    )
                }
            ]}
        />
    </>

}