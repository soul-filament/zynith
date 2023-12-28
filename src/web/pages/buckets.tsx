import { BucketRendered } from "../widgets/records/bucket-rendered"
import { PageTitle, SectionTitle } from "../componenets/titles"
import { useModifyBuckets } from "../state/hooks"
import { Button, MultiChoiceButton } from "../componenets/button";
import { useState } from "react";
import { BucketsTable } from "../widgets/tables/buckets-table";

export function BucketsPage () {

    const {bucketsWithoutParents, buckets, ...bucketsApi} = useModifyBuckets();
    const [displayMode, setDisplayMode] = useState("table")

    return <>
        <PageTitle title="Buckets">
            <Button 
                onClick={() => bucketsApi.create()}
                text="Create Bucket"
            />
        </PageTitle>

        <SectionTitle title="Your buckets">
            <MultiChoiceButton  
                options={["table", "list"]}
                selected={displayMode}
                onSelect={setDisplayMode}  
            />
        </SectionTitle>
        {
            displayMode === 'list' &&
            bucketsWithoutParents.map(bucket => <BucketRendered key={bucket.id} bucketId={bucket.id} />)
        }
        {
            displayMode === 'table' &&
            <BucketsTable buckets={buckets} />
        }
        {
            bucketsWithoutParents.length === 0 && <div className="text-gray-500 text-sm mt-4 px-4">No buckets yet</div>
        }
    </>

}