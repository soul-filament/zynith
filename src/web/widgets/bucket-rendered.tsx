import { useRecoilValue } from "recoil";
import { Spinner } from 'flowbite-react';
import { Button } from "flowbite-react"
import { BucketsAtom, ServerAction } from "../state/store";
import { FC, useContext, useEffect, useState } from "react";
import { WebsocketContext } from "../state/data-connection";
import { ChevronDownIcon, ChevronRightIcon, PlusIcon, TrashIcon } from "@heroicons/react/20/solid";
import { getIconsByName, nextIcon } from "./_old/icons";
import { useNavigate } from "react-router-dom";

export interface BucketRenderedProps {
    bucketId: string;
}

export const BucketRendered: FC<BucketRenderedProps> = ({ bucketId }) => {

    const nav = useNavigate()
    const websocket = useContext(WebsocketContext)
    
    const bucketsMap = useRecoilValue(BucketsAtom)
    const bucket = bucketsMap[bucketId]
    const children = Object.values(bucketsMap).filter(b => b.parent === bucketId)

    const [showChildren, setShowChildren] = useState(true)
    const [ctrHeld, setCtrHeld] = useState(false)

    useEffect(() => websocket.send(ServerAction.requestAllBuckets), [])

    const doAddBucket = () => {
        const id = Math.random().toString(36).substring(7)
        websocket.send(ServerAction.requestCreateBucket, { name: "New Bucket " + id, parent: bucketId, icon: undefined })
    }

    const doUpdateBucket = (name: string, icon: string) => {
        websocket.send(ServerAction.requestUpdateBucketById, { id: bucketId, name, icon, parent: bucket.parent })
    }

    const doDeleteBucket = () => {
        websocket.send(ServerAction.requestDeleteBucket, { id: bucketId })
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Meta") setCtrHeld(true)
        }
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === "Meta") setCtrHeld(false)
        }
        window.addEventListener("keydown", handleKeyDown)
        window.addEventListener("keyup", handleKeyUp)
        return () => {
            window.removeEventListener("keydown", handleKeyDown)
            window.removeEventListener("keyup", handleKeyUp)
        }
    }, [])

    if (!bucket) return <Spinner />

    return <div className="">
        <div className="flex cursor-pointer" onClick={() => nav(`/bucket/${bucketId}`)}>
            <div className="translate-y-4 w-10">
                {
                    showChildren &&  children && children.length > 0 &&
                    <ChevronDownIcon className="h-8" color="purple" onClick={(e) => {
                        setShowChildren(!showChildren)
                        e.stopPropagation()
                    }} />
                }
                {
                    !showChildren && children && children.length > 0 &&
                    <ChevronRightIcon className="h-8" color="blue" onClick={(e) => {
                        setShowChildren(!showChildren)
                        e.stopPropagation()
                    }}/>
                }
            </div>
            <div className="hover:shadow-lg border w-[400px] h-[50px] rounded-sm p-4 flex justify-between items-center my-2 mr-1">
                <div className="cursor-pointer mr-3 ml-1" onClick={(e) => {
                    doUpdateBucket(bucket.name, nextIcon(bucket.icon))
                    e.stopPropagation()
                }}>
                    {getIconsByName(bucket.icon)}
                </div>
                <input className="w-full h-full bg-transparent p-4 mr-5" value={bucket.name} 
                    onClick={e => e.stopPropagation()}
                    onChange={e => {
                        doUpdateBucket(e.target.value, bucket.icon)
                        e.stopPropagation()
                    }} />  
                {
                    !ctrHeld && 
                    <Button gradientDuoTone="purpleToBlue" className="mt-0.5 h-8 bg-purple-200" style={{padding: 0, width: 22, height: 22}} size={"sm"} onClick={e => {
                        doAddBucket()
                        e.stopPropagation()
                    }}>
                        <PlusIcon className="h-5" />
                    </Button>
                }
                {
                    ctrHeld &&
                    <Button className="mt-0.5 h-8 bg-gray-200" gradientDuoTone="purpleToPink" style={{padding: 0, width: 22, height: 22}} size={"sm"} onClick={e => {
                        doDeleteBucket()
                        e.stopPropagation()
                    }}>
                        <TrashIcon className="h-4" color='white' />
                    </Button>
                }

            </div>
        </div>
        <div className="ml-20">
            { children && showChildren &&
                children?.map(childId => <BucketRendered key={childId.id} bucketId={childId.id} />)
            }
        </div>
    </div>

}
