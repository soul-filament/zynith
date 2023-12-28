import { ReactNode } from "react";

export interface KeyValueCardProps {
    rows: {
        [key: string]: ReactNode
    }[]
}

export function KeyValueCard ({ rows }: KeyValueCardProps) {
    return (
        <div className='flex flex-col gap-4 p-4 border rounded-sm shadow-sm bg-white'>
            {rows.map((row, i) => (
                <div key={i} className='flex flex-row gap-4'>
                    {
                        Object.entries(row).map(([key, value]) => (
                            <div key={key} className='flex flex-col' style={{flex: 1}}>
                                <div className='font-semibold'>{key}</div>
                                <div>{value}</div>
                            </div>
                        ))
                    }
                </div>
            ))}
        </div>
    )
}