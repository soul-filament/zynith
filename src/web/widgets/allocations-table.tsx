import { Table, Spinner, Datepicker, TextInput } from 'flowbite-react';
import { FC, useContext, useEffect } from 'react';
import { Button } from 'flowbite-react';
import { useNavigate } from 'react-router';
import { WebsocketContext } from '../state/data-connection';
import { AllocationsByRelationAtom, ServerAction } from '../state/store';
import { useRecoilValue } from 'recoil';

interface AllocationsTableProps {
    bucketId: string
}

export const AllocationsTable : FC<AllocationsTableProps> = ({ bucketId }) => {

    useNavigate();
    const websocket = useContext(WebsocketContext);
    const allocation = useRecoilValue(AllocationsByRelationAtom)[bucketId];

    const newAllocation = () => {
        websocket.send(ServerAction.requestCreateAllocation, { targetBucket: bucketId, amount: 10, startDate: new Date().toISOString(), endDate: null })
    }

    const setStartDate = (id: string, date: string) => {
        let object = allocation?.find((a) => a.id === id)
        websocket.send(ServerAction.requestUpdateAllocation, { ...object, startDate: new Date(date).toISOString() })
    }

    const setEndDate = (id: string, date: string) => {
        let object = allocation?.find((a) => a.id === id)
        websocket.send(ServerAction.requestUpdateAllocation, { ...object, endDate: new Date(date).toISOString() })
    }

    const setAmount = (id: string, amount: number) => {
        let object = allocation?.find((a) => a.id === id)
        websocket.send(ServerAction.requestUpdateAllocation, { ...object, amount: amount })
    }

    const deleteAllocation = (id: string) => {
        websocket.send(ServerAction.requestDeleteAllocation, { id: id, targetBucket: bucketId })
    }

    useEffect(() => {
        websocket.send(ServerAction.requestAllocationsByBucket, { id: bucketId })
    }, [])

    if (!allocation) { return <Spinner /> }

    return (
        <>
            <div className="flex justify-between items-center p-4 bg-white ">
                <h2 className="text-lg font-semibold text-gray-900 ">Allocations</h2>
                <div className="flex items-center text-sm gap-3">
                <Button color="gray" size={"sm"} className='h-8' gradientDuoTone={'purpleToBlue'} onClick={newAllocation}>Create</Button>
                </div>
            </div>
            <div className="overflow-x-auto border rounded-md mb-10 shadow" style={{overflow: 'inherit'}}>
                <Table className=' w-full'>
                    <Table.Head className='border-b'>
                        <Table.HeadCell>Start</Table.HeadCell>
                        <Table.HeadCell>End</Table.HeadCell>
                        <Table.HeadCell>Daily</Table.HeadCell>
                        <Table.HeadCell>Monthly</Table.HeadCell>
                        <Table.HeadCell>Total</Table.HeadCell>
                        <Table.HeadCell>Delete</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {
                            allocation.map((allocation, index) => {

                                let start = new Date(new Date(allocation.startDate).toDateString())
                                let end = allocation.endDate ? new Date(new Date(allocation.endDate).toDateString()) : new Date(new Date().toDateString())

                                const days = Math.round((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1
                                const total = allocation.amount * days 

                                return (
                                <Table.Row key={index} className="bg-white  hover:bg-gray-100" >
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900">
                                        <Datepicker 
                                            style={{backgroundColor: 'transparent', border: 'none'}}
                                            className='w-fit'
                                            value={new Date(allocation.startDate).toDateString()}
                                            onSelectedDateChanged={(date) => setStartDate(allocation.id, date.toISOString())}
                                        />
                                    </Table.Cell>
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900">
                                        <Datepicker 
                                            style={{backgroundColor: 'transparent', border: 'none'}}
                                            className='w-fit'
                                            value={allocation.endDate ? new Date(allocation.endDate).toDateString() : '-'}
                                            onSelectedDateChanged={(date) => setEndDate(allocation.id, date.toISOString())}
                                            minDate={new Date(allocation.startDate)}
                                        />
                                    </Table.Cell>
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900">
                                        <TextInput
                                            className='w-16'
                                            style={{backgroundColor: 'transparent', border: 'none'}}
                                            value={Math.round(allocation.amount) / 100}
                                            onChange={(e) => {
                                                if (parseFloat(e.target.value) > 0) {
                                                    setAmount(allocation.id, parseFloat(e.target.value) * 100)
                                                }
                                            }}
                                        />
                                    </Table.Cell>
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900">
                                        <TextInput
                                            className='w-16'
                                            value={Math.round(3000 * allocation.amount / 100) / 100}
                                            style={{backgroundColor: 'transparent', border: 'none'}}
                                            onChange={(e) => {
                                                if (parseFloat(e.target.value) > 0) {
                                                    setAmount(allocation.id, 100 * parseFloat(e.target.value) / 30)
                                                }
                                            }}
                                        />
                                    </Table.Cell>
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900">
                                        ${Math.round(total / 100)}
                                    </Table.Cell>
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900">
                                        <div className='hover:text-red-500 cursor-pointer' onClick={() => deleteAllocation(allocation.id)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                    d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                                )
                            })
                        }
                        {
                            allocation.length === 0 && (
                                <Table.Row>
                                    <Table.Cell colSpan={6} className="text-center">
                                        No Allocations
                                    </Table.Cell>
                                </Table.Row>
                            )
                        }
                    </Table.Body>
                    
                </Table>
            </div>
        </>
    );
}
