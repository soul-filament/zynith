import { ReactNode } from "react"

export interface TitleProps {
    title: string
    children?: ReactNode
}

export function PageTitle (props: TitleProps) {
    return (
        <div className="flex justify-between items-center p-4 bg-white">
            <h2 className="text-2xl font-semibold text-gray-900 ">{props.title}</h2>
            <div className="flex items-center text-sm gap-3">
                {props.children}
            </div>
        </div>
    )
}

export function SectionTitle (props: TitleProps) {
    return (
        <div className="flex justify-between items-center p-4 bg-white">
            <h2 className="text-lg font-semibold text-gray-900 ">{props.title}</h2>
            <div className="flex items-center text-sm gap-3">
                {props.children}
            </div>
        </div>
    )
}