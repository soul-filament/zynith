import { ReactNode } from "react"

export interface PageTitleProps {
    title: string
    children?: ReactNode
}

export function PageTitle (props: PageTitleProps) {
    return (
        <div className="flex justify-between items-center p-4 bg-white">
            <h2 className="text-lg font-semibold text-gray-900 ">{props.title}</h2>
            <div className="flex items-center text-sm gap-3">
                {props.children}
            </div>
        </div>
    )

}