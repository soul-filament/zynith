export interface SpinnerProps {
}

export function Spinner (_?: SpinnerProps) {
    return <>
        <div className="flex justify-center items-center h-20">
            <div className="animate-bounce rounded-full h-3 w-3 bg-pink-500"></div>
            <div className="animate-bounce rounded-full h-3 w-3 bg-indigo-500 ml-1"></div>
            <div className="animate-bounce rounded-full h-3 w-3 bg-cyan-500 ml-1"></div>
        </div>
    </>
}