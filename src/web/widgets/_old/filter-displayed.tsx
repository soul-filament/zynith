import { Card, Label } from 'flowbite-react';
import { FC } from 'react';
import { useNavigate } from 'react-router';
import { BucketRef } from '../bucket-ref';
import { FilterRecord } from '../../../database/schema/filter';

interface FilterDisplayed {
    Filter: FilterRecord
}

export const FilterDisplayed : FC<FilterDisplayed> = ({ Filter }) => {

    useNavigate();

    return <>
        <Card className="w-full shadow-none mb-4">
            <div className='flex'>
                <div style={{flex: 1}}>
                    <Label className="font-semibold">Filter Id</Label>
                    <div>{Filter.id.substring(0,15)}</div>
                </div>
                <div style={{flex: 1}}>
                    <Label className="font-semibold">Label</Label>
                    <div>{Filter.label}</div>
                </div>
                <div style={{flex: 1}}>
                    <Label className="font-semibold">Filter</Label>
                    <div>{Filter.filter}</div>
                </div>
                <div style={{flex: 1}}>
                    <Label className="font-semibold">To Bucket</Label>                                    
                    <div><BucketRef bucketId={Filter.bucket}/> </div>
                </div>
            </div>
        </Card>
    </>

}