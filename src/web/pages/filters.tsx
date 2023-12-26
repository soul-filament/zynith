import { useRecoilValue } from "recoil"
import { FiltersAtom, ServerAction } from "../state/store"
import { WebsocketContext } from "../state/data-connection"
import { useContext, useEffect } from "react"
import { FiltersTable } from "../widgets/filters-table"
import { PageTitle } from "../widgets/page-title"

export function FiltersPage () {

    const websocket = useContext(WebsocketContext);
    const filters = useRecoilValue(FiltersAtom)
    const filtersList = Object.values(filters)

    useEffect(() => {
        websocket.send(ServerAction.requestAllFilters)
    }, [])

    return <>
        <PageTitle title="Filters" />
        <FiltersTable filters={filtersList} />
    </>

}