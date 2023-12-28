import { useContext, useEffect } from "react";
import { WebsocketContext } from "../state/data-connection";
import { useRecoilValue } from "recoil";
import { BucketsAtom, ServerAction } from "../state/store";
import { useNavigate } from "react-router-dom";
import { Icon } from "../componenets/icons";
import { Spinner } from "../componenets/spinner";

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
        <div 
            className="flex gap-2 items-center cursor-pointer hover:underline w-fit rounded" 
            onClick={(e) => {
                nav(`/bucket/${bucket.id}`)
                e.stopPropagation()
            }}
        >
            <Icon name={bucket.icon} />
            <div className="text-gray-900 ">{bucket.name}</div>
        </div>
    </>
}