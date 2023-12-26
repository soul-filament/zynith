import { Card, Label } from 'flowbite-react';
import { FC } from 'react';
import { BucketRef } from './bucket-ref';
import { getIconsByName } from './_old/icons';
import { useRecoilValue } from 'recoil';
import { BucketsAtom } from '../state/store';
import { BucketRecord } from '../../database/schema/bucket';

interface BucketDisplayed {
    bucket: BucketRecord
}

export const BucketDisplayed : FC<BucketDisplayed> = ({ bucket }) => {

    const bucketMap = useRecoilValue(BucketsAtom)
    const allBuckets = Object.values(bucketMap)
    const childBuckets = allBuckets.filter(b => b.parent === bucket.id)

    return <>
       <Card className="w-full shadow-none mb-10">
            <div className='flex'>
                <div style={{flex: 1}}>
                    <Label className="font-semibold">Bucket Id</Label>
                    <div>{bucket.id.substring(0,15)}...</div>
                </div>
                <div style={{flex: 1}}>
                    <Label className="font-semibold">Name</Label>
                    <div>{bucket.name}</div>
                </div>
                <div style={{flex: 1}}>
                    <Label className="font-semibold">Parent</Label>
                    <div><BucketRef bucketId={bucket.parent} /></div>
                </div>
                <div style={{flex: 1}}>
                    <Label className="font-semibold">Icon</Label>
                    <div>{getIconsByName(bucket.icon)}</div>
                </div>
            </div>
            <div className='flex'>
                <div style={{flex: 3}}>
                    <Label className="font-semibold">Children</Label>
                    <div className='flex flex-row gap-4'>
                    {
                        childBuckets.map(child => <BucketRef key={child.id} bucketId={child.id} />)
                    }
                    </div>
                </div>
            </div>
        </Card>
    </>

}