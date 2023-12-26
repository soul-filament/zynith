export enum ServerAction {

    // Useful for operations
    requestRunSQL = 'requestRunSQL',
    provideRunSQL = 'provideRunSQL',

    // Transaction records
    requestTransactionById = 'requestTransactionById',
    requestAllTransactions = 'requestAllTransactions',
    requestUpdateTransactionById = 'requestUpdateTransactionById',
    provideTransactions = 'provideTransactions',

    requestTransactionsByBucket = 'requestTransactionsByBucket',
    requestTransactionsBySource = 'requestTransactionsBySource',
    requestTransactionsByFilter = 'requestTransactionsByFilter',
    requestTransactionsByDescription = 'requestTransactionsByDescription',
    provideTransactionsByRelation = 'provideTransactionsByRelation',

    // Bucket record
    requestAllBuckets = 'requestAllBuckets',
    requestBucketById = 'requestBucketById',
    requestCreateBucket = 'requestCreateBucket',
    requestUpdateBucketById = 'requestUpdateBucketById',
    requestDeleteBucket = 'requestDeleteBucket',
    provideBuckets = 'provideBuckets',    

    provideBucketsByRelation = 'provideBucketsByRelation',

    // Filters
    requestFilter = 'requestFilter',
    requestAllFilters = 'requestAllFilters',
    requestCreateFilter = 'requestCreateFilter',
    requestDeleteFilter = 'requestDeleteFilter',
    provideFilters = 'provideFilters',

    requestFiltersByBucket = 'requestFiltersByBucket',
    provideFiltersByRelation = 'provideFiltersByRelation',

    // Allocations
    requestAllAllocations = 'requestAllAllocations',
    requestCreateAllocation = 'requestCreateAllocation',
    requestDeleteAllocation = 'requestDeleteAllocation',
    requestUpdateAllocation = 'requestUpdateAllocation',
    provideAllocations = 'provideAllocations',
    
    requestAllocationsByBucket = 'requestAllocationsByBucket',
    provideAllocationsByRelation = 'provideAllocationsByRelation',
    
    // Calculations
    requestCalculateByBucket = 'requestCalculateByBucket',
    provideCalculateByBucket = 'provideCalculateByBucket',

    // Balances
    requestBalances = 'requestBalances',
    provideBalances = 'provideBalances',
}
