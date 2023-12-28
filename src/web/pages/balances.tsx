import { TimeAxisLineChart } from "../widgets/chart";
import { useAllBalances } from "../state/hooks";
import { Spinner } from "../componenets/spinner";
import { PageTitle } from "../componenets/titles";

export function BalancesPage () {
    
    const balances = useAllBalances();
    if (!balances) return <Spinner />

    return <>
        <PageTitle title="Balances" />
        <TimeAxisLineChart
            type="stackedbar"
            preferedView="day"
            data={balances}
        />
    </>
}