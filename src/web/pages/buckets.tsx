import { useRecoilValue } from "recoil"
import { Button } from "flowbite-react"
import { BucketsAtom, ServerAction } from "../state/store"
import { BucketRendered } from "../widgets/bucket-rendered"
import { WebsocketContext } from "../state/data-connection"
import { useContext, useEffect } from "react"
import { PageTitle } from "../widgets/page-title"

export function BucketsPage () {

    const websocket = useContext(WebsocketContext);
    const bucketMap = useRecoilValue(BucketsAtom)
    const buckets = Object.values(bucketMap)
    const bucketsWithoutParents = buckets.filter(bucket => !bucket.parent)

    useEffect(() => websocket.send(ServerAction.requestAllBuckets), [])

    const doAddBucket = () => {
        console.log('doAddBucket')
        websocket.send(ServerAction.requestCreateBucket, { 
            name: "New Bucket - " + Math.random().toString(36).substring(7),
            icon: undefined,
            parentBucketRef: undefined
        })
    }

    return <>
        <PageTitle title="Buckets">
            <Button 
                className='capitalize' 
                color="gray" 
                size={"sm"} 
                gradientDuoTone={'purpleToBlue'} 
                onClick={doAddBucket}>
                    Create Bucket
            </Button>
        </PageTitle>
        {
            bucketsWithoutParents.map(bucket => <BucketRendered key={bucket.id} bucketId={bucket.id} />)
        }
        {
            bucketsWithoutParents.length === 0 && <div className="text-gray-500 text-sm mt-4 px-4">No buckets yet</div>
        }
    </>

}