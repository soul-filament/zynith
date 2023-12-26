import { useContext, useEffect } from "react";
import { Spinner } from "flowbite-react";
import { WebsocketContext } from "../state/data-connection";
import { useRecoilValue } from "recoil";
import { BucketsAtom, ServerAction } from "../state/store";
import { useNavigate } from "react-router-dom";
import { getIconsByName } from "./_old/icons";

export function BucketRef ({ bucketId }: { bucketId?: string }) {
    const nav = useNavigate();
    
    const websocket = useContext(WebsocketContext);
    const bucket = useRecoilValue(BucketsAtom)[bucketId || ''];

    useEffect(() => {
        websocket.send(ServerAction.requestBucketById, { id: bucketId })
    }, [])

    if (!bucketId) return <>-</>

    if (!bucket) { return <Spinner /> }

    return <>
        <div className="flex gap-2 items-center cursor-pointer hover:bg-gray-100 w-fit p-1 rounded" onClick={() => nav(`/bucket/${bucket.id}`)}>
            {getIconsByName(bucket.icon)}
            <h2 className="text-gray-900 ">{bucket.name}</h2>
        </div>
    </>
}