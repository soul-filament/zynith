import { useContext, useEffect } from "react";
import { Spinner } from "flowbite-react";
import { WebsocketContext } from "../state/data-connection";
import { useRecoilValue } from "recoil";
import { FiltersAtom, ServerAction } from "../state/store";
import { useNavigate } from "react-router-dom";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

export function FilterRef ({ filterId }: { filterId?: string }) {
    const nav = useNavigate();
    
    const websocket = useContext(WebsocketContext);
    const filter = useRecoilValue(FiltersAtom)[filterId || ''];

    useEffect(() => {
        websocket.send(ServerAction.requestAllFilters)
    }, [])

    if (!filterId) return <>-</>

    if (!filter) { return <Spinner /> }

    return <>
        <div className="flex gap-2 items-center cursor-pointer hover:bg-gray-100 w-fit p-1 rounded" onClick={() => nav(`/filter/${filter.id}`)}>
            <PaperAirplaneIcon className="w-5 h-5 text-gray-500" />
            <h2 className="text-gray-900 ">{filter.label || filter.filter }</h2>
        </div>
    </>
}