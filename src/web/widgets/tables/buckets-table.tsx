import { FC } from 'react';
import { useModifyBuckets } from '../../state/hooks';
import { Table } from '../../componenets/table';
import { BucketRecord } from '../../../database/schema/bucket';
import { useNavigate } from 'react-router-dom';
import { DeleteButton, Icon } from '../../componenets/icons';

interface BucketsTableProps {
    buckets: BucketRecord[]
}

export const BucketsTable : FC<BucketsTableProps> = ({ buckets }) => {

    const {bucketsMap, ...bucketApi} = useModifyBuckets()
    const nav = useNavigate()

    return (
        <>
            <Table
                headers={['icon', 'name', 'parent', 'delete']}
                weight={[1,10,10,1]}
                onClick={(row) => nav('/bucket/' + row)}
                rows={
                    buckets.map((bucket) => {

                        let iconElement = <div className='px-2'>
                            <Icon name={bucket.icon}/>
                        </div>

                        let nameElement = <div className='text-base font-normal'>
                            {bucket.name}
                        </div>

                        let parentElement = <div className='text-base font-normal'>
                            {bucket.parent ? bucketsMap[bucket.parent]?.name : '-'}
                        </div>

                        let deleteElement = <DeleteButton onClick={() => bucketApi.delete(bucket.id)} />

                        return {
                            id: bucket.id,
                            columns: {
                                icon: iconElement,
                                name: nameElement,
                                parent: parentElement,
                                delete: deleteElement
                            }
                        }
                    })
                }
            />
        </>
    );
}

