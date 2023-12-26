import { AllocationHandlers } from "./allocations";
import { BalanceHandlers } from "./balance";
import { BucketHandlers } from "./bucket";
import { CalculationsHandler } from "./calculations";
import { FilterHandlers } from "./filters";
import { SourceHandlers } from "./source";
import { TransactionHandlers } from "./transactions";

export interface ApiHandlers {
    transactions: TransactionHandlers,
    allocations: AllocationHandlers,
    ballances: BalanceHandlers,
    buckets: BucketHandlers,
    filters: FilterHandlers,
    sources: SourceHandlers,
    calculate: CalculationsHandler
}
