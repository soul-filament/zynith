import { ReactNode } from "react"

export interface TableHeaderProps {
    headers: string[]
    weight?: number[]
    sortableColumns?: string[]
    sortedColumn?: string
    sortedDirection?: string
    onSort?: (column: string, direction: 'asc' | 'desc') => void
}

export function TableHeader ({ headers, weight, sortableColumns, sortedColumn, sortedDirection, onSort}: TableHeaderProps) {
    return (
        <div className="flex flex-row gap-4 border px-4 py-3 text-xs uppercase bg-gray-50 rounded-t gap-4">
            {headers.map((header, i) => (
                <div 
                    key={i} 
                    className={`flex flex-row gap-2 items-center ${sortableColumns?.includes(header) ? 'cursor-pointer' : ''}`}
                    style={{flex: weight ? weight[i] : 1}}
                    onClick={() => onSort ? onSort(header, sortedDirection === 'asc' ? 'desc' : 'asc') : ''}
                >
                    <div className="font-semibold">{header}</div>
                    {
                        sortableColumns?.includes(header) && (
                            <div className="flex flex-row gap-1">
                                <div className={`${sortedColumn === header && sortedDirection === 'asc' ? 'text-gray-900' : 'hidden'}`}>▲</div>
                                <div className={`${sortedColumn === header && sortedDirection === 'desc' ? 'text-gray-900' : 'hidden'}`}>▼</div>
                            </div>
                        )
                    }
                </div>
            ))}
        </div>
    )
}

export interface TableRowsProps {
    headers: string[]
    rows: {
        id: string
        columns: {
            [key: string]: ReactNode
        }
    }[]
    weight?: number[]
    onClick?: (id: string) => void
}

export function TableRows ({ rows, weight, headers, onClick}: TableRowsProps) {

    return (
        <div className="flex flex-col gap-2 border-b border-x text-sm">
            {rows.map((row, i) => (
                <div className={`flex flex-row gap-4 py-4  px-4  ${onClick ? 'cursor-pointer hover:bg-gray-100' : ''}`} onClick={() => onClick?onClick(row.id):''} key={i}>
                    {
                        headers.map((header, i) => (
                            <div key={header} className="font-normal" style={{flex: weight ? weight[i] : 1}}>{row.columns[header]}</div>
                        ))
                    }
                </div>
            ))}
            {
                rows.length === 0 && (
                    <div className={`flex flex-row gap-4 py-4`}>
                        <div className="text-center" style={{flex: 1}}>No Rows</div>
                    </div>
                )
            }
        </div>
    )
}

export interface TableProps {
    headers: string[]
    sortableColumns?: string[]
    sortedColumn?: string
    sortedDirection?: string
    onSort?: (column: string, direction: 'asc' | 'desc') => void
    rows: {
        id: string
        columns: {
            [key: string]: ReactNode
        }
    }[]
    weight?: number[]
    onClick?: (id: string) => void
}

export function Table (props : TableProps) {
    return (
        <div >
            <TableHeader {...props} />
            <TableRows {...props} />
        </div>
    )
}