import { FC } from 'react';
import { BucketRef } from '../bucket-ref';
import { BucketRecord } from '../../../database/schema/bucket';
import { useChildBuckets, useModifyBuckets } from '../../state/hooks';
import { KeyValueCard } from '../../componenets/key-value-card';
import { IconPicker } from '../../componenets/icons';
import { InputBox } from '../../componenets/input';

interface BucketDisplayed {
    bucket: BucketRecord
}

export const BucketDisplayed : FC<BucketDisplayed> = ({ bucket }) => {

    const childBuckets = useChildBuckets(bucket.id)
    const bucketsApi = useModifyBuckets()

    const childrenElements = (
        childBuckets.length
            ? childBuckets.map(child => <BucketRef key={child.id} bucketId={child.id} />)
            : '-'
    )

    return <>
        <KeyValueCard rows={
            [
                {
                    'Bucket Id': bucket.id.substring(0,15),
                    'Name': (
                        <InputBox
                            value={bucket.name}
                            onChange={(name) => bucketsApi.update({ ...bucket, name })}
                        />
                    ),
                    'Parent': <BucketRef bucketId={bucket.parent} />,
                    'Icon': <IconPicker selectedIcon={bucket.icon} onChange={(icon) => bucketsApi.update({ ...bucket, icon })} />
                },
                {
                    'Children': <div className='flex flex-row gap-4'>{childrenElements}</div>
                }
            ]
        } />
    </>
}