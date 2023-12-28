import { FC, useEffect, useState } from "react";
import { ChevronDownIcon, ChevronRightIcon, PlusIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";
import { useBucketById, useChildBuckets, useModifyBuckets } from "../../state/hooks";
import { Icon } from '../../componenets/icons';
import { Spinner } from "../../componenets/spinner";

export interface BucketRenderedProps {
    bucketId: string;
}

export const BucketRendered: FC<BucketRenderedProps> = ({ bucketId }) => {
    
    const nav = useNavigate()
    const bucket = useBucketById(bucketId)
    const childBuckets = useChildBuckets(bucketId)
    const bucketApi = useModifyBuckets()

    const [showChildren, setShowChildren] = useState(true)
    const [ctrHeld, setCtrHeld] = useState(false)

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

    if (!bucketApi || !childBuckets) return <Spinner />

    return <>
        <div className="flex cursor-pointer" onClick={() => nav(`/bucket/${bucketId}`)}>
            <div className="translate-y-4 w-10">
                {
                    showChildren && childBuckets.length > 0 &&
                    <ChevronDownIcon className="h-8" color="purple" onClick={(e) => {
                        setShowChildren(!showChildren)
                        e.stopPropagation()
                    }} />
                }
                {
                    !showChildren && childBuckets.length  > 0 &&
                    <ChevronRightIcon className="h-8" color="blue" onClick={(e) => {
                        setShowChildren(!showChildren)
                        e.stopPropagation()
                    }}/>
                }
            </div>
            <div className="hover:shadow-lg border w-[500px] h-[50px] rounded-sm p-4 flex justify-between items-center my-2 mr-1">
                <div className="mr-3 ml-1" >
                    <Icon name={bucket.icon} />
                </div>
                <input className="w-full h-full bg-transparent p-4 mr-5" value={bucket.name} 
                    onClick={e => e.stopPropagation()}
                    onChange={e => {
                        bucketApi.update({
                            id: bucket.id,
                            name: e.target.value,
                            icon: bucket.icon,
                            parentBucketRef: bucket.parent
                        })
                        e.stopPropagation()
                    }} />  
                {
                    !ctrHeld && 
                    <div onClick={(e) => { bucketApi.create(bucket.id); e.stopPropagation() }} >
                        <PlusIcon className="h-8 scale-[70%]" color="purple" />
                    </div>
                }
                {
                    ctrHeld &&
                    <div onClick={(e) => { bucketApi.delete(bucket.id); e.stopPropagation() }} >
                        <TrashIcon className="h-8 scale-[60%]" color="red" />
                    </div>
                }

            </div>
        </div>
        <div className="ml-20">
            { showChildren &&
                childBuckets?.map(childId => <BucketRendered key={childId.id} bucketId={childId.id} />)
            }
        </div>
    
    </>

}
