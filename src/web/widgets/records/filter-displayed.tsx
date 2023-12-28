import { FC } from 'react';
import { BucketRef } from '../bucket-ref';
import { FilterRecord } from '../../../database/schema/filter';
import { KeyValueCard } from '../../componenets/key-value-card';
import { useModifyFilter } from '../../state/hooks';
import { InputBox } from '../../componenets/input';

interface FilterDisplayed {
    Filter: FilterRecord
}

export const FilterDisplayed : FC<FilterDisplayed> = ({ Filter }) => {

    const api = useModifyFilter()

    return <>
        <KeyValueCard rows={
            [
                {
                    'Filter Id': Filter.id.substring(0,15),
                    'Label': (
                        <InputBox
                            value={Filter.label}
                            onChange={(e) => api.update({ ...Filter, label: e })}
                        />
                    ),
                    'Filter': Filter.filter,
                    'To Bucket': <BucketRef bucketId={Filter.bucket}/>   
                }
            ]}
        />
    </>
}