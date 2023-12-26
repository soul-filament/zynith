import { Table } from 'flowbite-react';
import { FC, useContext } from 'react';

import { useNavigate } from 'react-router';
import { BucketRef } from './bucket-ref';
import { WebsocketContext } from '../state/data-connection';
import { ServerAction } from '../state/store';
import { FilterRecord } from '../../database/schema/filter';

interface FiltersTableProps {
    filters: FilterRecord[]
    hideBucket?: boolean
}

export const FiltersTable : FC<FiltersTableProps> = ({ filters, hideBucket }) => {

    const nav = useNavigate();
    const websocket = useContext(WebsocketContext);

    const deleteFilter = (filter: FilterRecord) => {
        websocket.send(ServerAction.requestDeleteFilter, { id: filter.id })
    }

    return (
        <>
        <div className='w-full'>
            <div className="overflow-x-auto border rounded-md  mb-10 shadow">
                <Table className=' w-full'>
                    <Table.Head className='border-b'>
                        <Table.HeadCell>Matching Description</Table.HeadCell>
                        <Table.HeadCell>Label</Table.HeadCell>
                        { !hideBucket && <Table.HeadCell>Bucket</Table.HeadCell> }
                        <Table.HeadCell>Delete</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {
                            filters.map((filter, index) => {
                                return (
                                <Table.Row key={index} className="bg-white cursor-pointer hover:bg-gray-100" onClick={() => nav(`/filter/${filter.id}`)}>
                                    <Table.Cell>{filter.filter}</Table.Cell>
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900">
                                        {filter.label}
                                    </Table.Cell>
                                    { !hideBucket  && <Table.Cell><BucketRef bucketId={filter.bucket}/></Table.Cell> }
                                    <Table.Cell>
                                        <button className="text-red-600 hover:text-red-900" onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            deleteFilter(filter);
                                        }}>
                                            Delete
                                        </button>
                                    </Table.Cell>
                                </Table.Row>
                                )
                            })
                        }
                        {
                            filters.length === 0 && (
                                <Table.Row>
                                    <Table.Cell colSpan={4} className="text-center">
                                        No Filters
                                    </Table.Cell>
                                </Table.Row>
                            )
                        }
                    </Table.Body>
                    
                </Table>
            </div>
        </div>
      </>
    );
}