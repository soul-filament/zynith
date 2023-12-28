import { atom } from 'recoil'
import { AllocationRecord } from '../../database/schema/allocation';
import { BucketRecord } from '../../database/schema/bucket';
import { FilterRecord } from '../../database/schema/filter';
import { TransactionRecord } from '../../database/schema/transaction';
import { SettingRecord } from '../../database/schema/settings';
export { ServerAction } from '../../api/actions'

let id = 0;

function createRecordMapState<T> () {
    return atom<{[id: string]: T}>({ key: (++id)+"", default: {} })
}

export const TransactionsAtom = createRecordMapState<TransactionRecord>()
export const BucketsAtom = createRecordMapState<BucketRecord>()
export const FiltersAtom = createRecordMapState<FilterRecord>()
export const AllocationAtom = createRecordMapState<AllocationRecord>()
export const BalancesAtom = createRecordMapState<any>()

export const TransactionsByRelationAtom = createRecordMapState<TransactionRecord[]>()
export const BucketByRelationAtom = createRecordMapState<BucketRecord[]>()
export const FilterByRelationAtom = createRecordMapState<FilterRecord[]>()
export const AllocationsByRelationAtom = createRecordMapState<AllocationRecord[]>()

export const CalculationsByBucketAtom = atom<{[id: string]: any}>({ key: (++id)+"", default: {} })
export const SettingsAtom = atom<SettingRecord>({ key: (++id)+"", default: undefined as any })

export function merge (old: any, withNew: any) {

    let result = { ... old, ... withNew }
    let toDelete: string[] = []
    Object.entries(withNew).forEach(([key, value]) => {
        if (value === 0) {
            toDelete.push(key)
        }
    })
    toDelete.forEach(key => delete result[key])

    return result
}