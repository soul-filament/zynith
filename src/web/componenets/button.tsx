
export interface MultiChoiceButtonProps {
    selected: string
    options: string[]
    onSelect: (item: string) => void 
}


export function MultiChoiceButton (props: MultiChoiceButtonProps) {
    return (
        <div className='isolate inline-flex rounded-md shadow-sm ring-1 divide-x divide-blue-200 text-white h-7'>
            {
                props.options.map((o) => {
                    return (
                        <button 
                            className={
                                `capitalize relative inline-flex items-center first:rounded-l-md last:rounded-r-md bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-100 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 active:bg-gray-100 ${o === props.selected ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' : 'text-gray-900 '}}`
                            }
                            color="gray" 
                            key={o} 
                            onClick={() => props.onSelect(o)}>
                                {o}
                        </button>
                    )
                })
            }
        </div>
    )
}

export interface ButtonProps {
    onClick: () => void
    text: string
}

export function Button (props: ButtonProps) {
    return (
        <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 rounded bg-gradient-to-r from-purple-500 to-blue-500 text-white h-7"
            onClick={(e) => {
                props.onClick()
                e.stopPropagation()
            }}
        >
            {props.text}
        </button>
    )
}
