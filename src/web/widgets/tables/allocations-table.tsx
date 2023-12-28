import { FC } from 'react';
import { useAllocationsByBucket, useModifyAllocations } from '../../state/hooks';
import { Table } from '../../componenets/table';
import { DateInputBox, InputBox } from '../../componenets/input';
import { AllocationRecord } from '../../../database/schema/allocation';
import { SectionTitle } from '../../componenets/titles';
import { Button } from '../../componenets/button';
import { DeleteButton } from '../../componenets/icons';

interface AllocationsTableProps {
    allocations: AllocationRecord[]
}

export const AllocationsTable : FC<AllocationsTableProps> = ({ allocations }) => {

    const api = useModifyAllocations()

    return (
        <>
            <Table 
                headers={['start', 'end', 'daily', 'monthly', 'total', 'delete']}
                weight={[3,3,3,3,3,1]}
                rows={
                    allocations.map((a) => {

                        const start = new Date(new Date(a.startDate).toDateString())
                        const end = a.endDate ? new Date(new Date(a.endDate).toDateString()) : new Date(new Date().toDateString())

                        const days = Math.round((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1
                        const total = a.amount * days

                        const startElement = (
                            <DateInputBox 
                                value={new Date(a.startDate).toDateString()}
                                onSelectedDateChanged={(date) => api.updateStartDate({
                                    id: a.id,
                                    startDate: date.toISOString()
                                })}
                            />
                        )

                        const endElement = (
                            <DateInputBox 
                                value={a.endDate ? new Date(a.endDate).toDateString() : ''}
                                onSelectedDateChanged={(date) => api.updateEndDate({
                                    id: a.id,
                                    endDate: date.toISOString()
                                })}
                                minDate={new Date(a.startDate)}
                            />
                        )

                        const dailyElement = (
                            <InputBox
                                value={'$' + Math.round(a.amount) / 100}
                                onChange={(v) => {
                                    v = v.replace('$', '')
                                    if (parseFloat(v) > 0) {
                                        api.updateAmount({
                                            id: a.id,
                                            amount: parseFloat(v) * 100
                                        })
                                    }
                                }}
                            />
                        )

                        const monthlyElement = (
                            <InputBox
                                value={'$' + Math.round(3000 * a.amount / 100) / 100}
                                onChange={(v) => {
                                    v = v.replace('$', '')
                                    if (parseFloat(v) > 0) {
                                        api.updateAmount({
                                            id: a.id,
                                            amount: 100 * parseFloat(v) / 30
                                        })
                                    }
                                }}
                            />
                        )

                        const totalElement = (
                            <div className='p-2'>
                                ${Math.round(total / 100)}
                            </div>
                        )

                        const deleteElement = <DeleteButton onClick={() => api.delete(a.id)} />

                        return {
                            id: a.id,
                            columns: {
                                start: startElement,
                                end: endElement,  
                                daily: dailyElement,
                                monthly: monthlyElement,
                                total: totalElement,
                                delete: deleteElement
                            }
                        }
                    })
                }
            />
        </>
    );
}

interface AllocationsTableForBucket {
    bucketId: string
}

export const AllocationsTableForBucket : FC<AllocationsTableForBucket> = ({ bucketId }) => {

    const allocations = useAllocationsByBucket(bucketId)
    const api = useModifyAllocations()

    return <>
        <SectionTitle title='Allocations'>
            <Button onClick={() => api.create({ targetBucket: bucketId })} text='Add Allocation' />
        </SectionTitle>
        <AllocationsTable allocations={allocations} />
    </>
}