const globalStart = new Date("2021-12-01");
const globalEnd = new Date()

export class DataAggregator {

    private dayBuckets: {[key: string]: number} = {};

    constructor() {}

    private cleanDate(date: Date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }
    
    private cleanDateToString(date: Date) {
        return this.cleanDate(date).toISOString();
    }

    public getDaysBetween(start: Date, end: Date = globalEnd) {
        let safeStart = this.cleanDate(start);
        let safeEnd = this.cleanDate(end);

        const days = [];
        for (let d = safeStart; d <= safeEnd; d.setDate(d.getDate() + 1)) {
            days.push(this.cleanDate(d));
        }
        return days;
    }

    // Direct actions on self

    public selfAddOnDate(date: Date, amount: number) {
        const dateString = this.cleanDateToString(date);
        if (!this.dayBuckets[dateString]) {
            this.dayBuckets[dateString] = 0;
        }
        this.dayBuckets[dateString] += amount;
        return this;
    }

    public selfSubtractOnDate(date: Date, amount: number) {
        this.selfAddOnDate(date, -amount);
        return this;
    }

    public selfAddOnRange(amount: number, start: Date, end: Date = globalEnd) {
        const days = this.getDaysBetween(start, end);
        for (let day of days) {
            this.selfAddOnDate(day, amount);
        }
        return this;
    }

    public selfSubtractOnRange(amount: number, start: Date, end: Date = globalEnd) {
        this.selfAddOnRange(-amount, start, end);
        return this;
    }

    public selfSetOnDate(date: Date, amount: number) {
        const dateString = this.cleanDateToString(date);
        this.dayBuckets[dateString] = amount;
        return this;
    }

    public selfSetOnRange(amount: number, start: Date, end: Date = globalEnd) {
        const days = this.getDaysBetween(start, end);
        for (let day of days) {
            this.selfSetOnDate(day, amount);
        }
        return this;
    }

    public selfAddDataRaw(data: {date: string, value: number}[]) {
        for (let entry of data) {
            this.selfAddOnDate(new Date(entry.date), entry.value);
        }
        return this;
    }

    public selfSubtractDataRaw(data: {date: string, value: number}[]) {
        for (let entry of data) {
            this.selfSubtractOnDate(new Date(entry.date), entry.value);
        }
        return this;
    }

    public selfSetDataRaw(data: {date: string, value: number}[]) {
        for (let entry of data) {
            this.selfSetOnDate(new Date(entry.date), entry.value);
        }
        return this;
    }

    public selfSetMultipleRangesRaw(data: {date: string, balance: number}[]) {
        for (let i = 1; i < data.length; i++) {
            let prev = data[i - 1];
            let curr = data[i];
            this.selfSetOnRange(prev.balance, new Date(prev.date), new Date(curr.date));
        }
        if (data.length > 0)
            this.selfSetOnRange(data[data.length - 1].balance, new Date(data[data.length - 1].date));
        return this;
    }

    public selfAddAggregator(aggregator: DataAggregator) {
        for (let day in aggregator.dayBuckets) {
            if (!this.dayBuckets[day]) {
                this.dayBuckets[day] = 0;
            }
            this.dayBuckets[day] += aggregator.dayBuckets[day];
        }
        return this;
    }

    public selfSubtractAggregator(aggregator: DataAggregator) {
        for (let day in aggregator.dayBuckets) {
            if (!this.dayBuckets[day]) {
                this.dayBuckets[day] = 0;
            }
            this.dayBuckets[day] -= aggregator.dayBuckets[day];
        }
        return this;
    }

    public exportData() {
        let days = this.getDaysBetween(globalStart);
        let data = [];
        for (let day of days) {
            const dayString = this.cleanDateToString(day);
            data.push({
                date: dayString,
                value: this.dayBuckets[dayString] || 0
            })
        }
        return data;
    }

    public sumData() {
        let days = this.getDaysBetween(globalStart);
        let sum = 0;
        for (let day of days) {
            const dayString = this.cleanDateToString(day);
            sum += this.dayBuckets[dayString] || 0;
        }
        return sum;
    }

    public exportDataMonthly() {
        let days = this.getDaysBetween(globalStart);
        let data = [];
        let currentMonth = days[0].getMonth();
        let currentMonthTotal = 0;
        for (let day of days) {
            if (day.getMonth() !== currentMonth) {
                let year = currentMonth == 11 ? day.getFullYear() - 1 : day.getFullYear();
                data.push({
                    date: new Date(year, currentMonth, 1).toISOString(),
                    value: currentMonthTotal
                });
                currentMonthTotal = 0;
                currentMonth = day.getMonth();
            }
            const dayString = day.toISOString();
            currentMonthTotal += this.dayBuckets[dayString] || 0;
        }
        return data;
    }

    public exportRunningSum() : DataAggregator {
        const aggregator = new DataAggregator();
        let days = this.getDaysBetween(globalStart);
        let runningSum = 0;
        for (let day of days) {
            const dayString = day.toISOString();
            runningSum += this.dayBuckets[dayString] || 0;
            aggregator.selfAddOnDate(day, runningSum);
        }
        return aggregator;
    }


}