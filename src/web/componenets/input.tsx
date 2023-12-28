import { FC } from "react"

export interface InputBoxProps {
    value: string | number
    onChange: (newValue: string) => void
    placeholder?: string
}

export const InputBox: FC<InputBoxProps> = ({ value, onChange, placeholder }) => {
    return (
        <input
            className="w-full border-none rounded-sm p-2 text-sm"
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    )
}

export interface DateInputBoxProps {
    value: string
    onSelectedDateChanged: (newValue: Date) => void
    minDate?: Date
}

export const DateInputBox: FC<DateInputBoxProps> = ({ value, onSelectedDateChanged, minDate }) => {
    return (
        <input
            className="w-full border-none rounded-sm p-2 text-sm"
            type="date"
            value={value ? new Date(value).toISOString().split('T')[0] : value}
            onChange={(e) =>  onSelectedDateChanged(new Date(e.target.value))}
            min={minDate?.toISOString().split('T')[0]}
        />
    )
}