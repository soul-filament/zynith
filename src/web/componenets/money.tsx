import { moneyString } from "../utils"

export interface RenderMoneyValue {
    cents: number
}

export function RenderMoney ({ cents }: RenderMoneyValue) {

    if (cents === 0) {
        return (
            <div className="">$0.00</div>
        )
    }

    if (cents < 0) {
        return (
            <div className="text-red-500">{moneyString(cents)}</div>
        )
    }

    return (
        <div className="text-green-500">{moneyString(cents)}</div>
    )
}