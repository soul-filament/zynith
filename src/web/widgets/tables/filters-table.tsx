import { FC } from 'react';
import { BucketRef } from '../bucket-ref';
import { FilterRecord } from '../../../database/schema/filter';
import { useModifyFilters } from '../../state/hooks';
import { Table } from '../../componenets/table';
import { DeleteButton } from '../../componenets/icons';
import { useNavigate } from 'react-router-dom';

interface FiltersTableProps {
    filters: FilterRecord[]
}

export const FiltersTable : FC<FiltersTableProps> = ({ filters }) => {

    const api = useModifyFilters();
    const nav = useNavigate();

    return <>
        <Table
            headers={['matching description', 'label', 'bucket', 'delete']}
            weight={[5,5,3,1]}
            onClick={(id) => nav(`/filter/${id}`)}
            rows={
                filters.map((filter) => {
                    return {
                        id: filter.id,
                        columns: {
                            'matching description': filter.filter,
                            'label': filter.label,
                            'bucket': <BucketRef bucketId={filter.bucket}/>,
                            'delete': <DeleteButton onClick={() => api.delete(filter.id)} />
                        }
                    }
                })
            }
        />
    </>
}