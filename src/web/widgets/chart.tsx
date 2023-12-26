import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, TimeScale, BarElement } from "chart.js";
import { FC, ReactNode, useState } from "react";
import 'chartjs-adapter-moment'; 
import { Bar } from "react-chartjs-2";
import { DataAggregator } from "../../database/dataAggregator";

ChartJS.register(ArcElement);
ChartJS.register(LineElement);
ChartJS.register(PointElement);
ChartJS.register(CategoryScale);
ChartJS.register(LinearScale);
ChartJS.register(TimeScale);
ChartJS.register(BarElement);
ChartJS.register(Tooltip, Legend);

const colorList = [
    'rgb(255, 99, 132)',
    'rgb(54, 162, 235)',
    'rgb(255, 206, 86)',
    'rgb(75, 192, 192)',
    'rgb(153, 102, 255)',
    'rgb(255, 159, 64)',
    'rgb(255, 99, 132)',
    'rgb(54, 162, 235)',
    'rgb(255, 206, 86)',
    'rgb(75, 192, 192)',
]

interface TimeAxisLineChartProps {
    data: {
        [datasetId: string]: {
            date: string
            value: number
        }[]
    }
    scaleFactor?: number
    preferedView?: 'day' | 'month'
    type?: 'bar' | 'stackedbar'
    actions?: ReactNode
}

export const TimeAxisLineChart: FC<TimeAxisLineChartProps> = ({ data, scaleFactor, preferedView, type }) => {

    const [grouping, _] = useState(preferedView||'month')

    let minimumDate = new Date(0)
    let maximumDate = new Date()

    let allStreams = Object.keys(data)

    let allDataSets = []
    
    for (let stream of allStreams) {
        let providedData = [...(data[stream] || [])]
        providedData.sort((a, b) => {  
            let aDate = new Date(a.date)
            let bDate = new Date(b.date)
            if (aDate < minimumDate) minimumDate = aDate
            if (bDate < minimumDate) minimumDate = bDate
            if (aDate > maximumDate) maximumDate = aDate
            if (bDate > maximumDate) maximumDate = bDate
            return new Date(a.date).getTime() - new Date(b.date).getTime()
        })

        let id : number = allDataSets.length

        let myResultData: any
        if (grouping === 'day') {
            myResultData = providedData.map((d) => ({
                x: new Date(d.date),
                y: d.value/(100 * (scaleFactor || 1))
            }))
        }
        else if (grouping === 'month') {
            let aggregator = new DataAggregator()
            aggregator.selfAddDataRaw(providedData)
            myResultData = aggregator.exportDataMonthly().map((d) => ({
                x: new Date(d.date),
                y: d.value/(100 * (scaleFactor || 1))
            }))
        }


        allDataSets.push({
            label: stream,
            data: myResultData,
            borderColor: colorList[id % colorList.length],
            backgroundColor: colorList[id % colorList.length],
            barPercentage: 1.1,
            categoryPercentage: 1.1,
            fill: true
        })
    }

    return (
        <div className="border rounded-md mb-10">
            <div className="p-4">
                {
                    ( type == 'bar' || !type ) &&
                    <Bar
                        datasetIdKey='id'
                        data={{
                            datasets: allDataSets,
                        }}
                        options={{
                            responsive: true,
                            scales: {
                                x: {
                                    type: 'time',
                                    time: {
                                        unit: 'month'
                                    },
                                    
                                },
                                y: {
                                    beginAtZero: true
                                }
                            },
                            animation: {
                                duration: 0
                            },
                            plugins: {
                                legend: {
                                    display: true,
                                    position: 'bottom',
                                },
                                tooltip: {
                                    enabled: true,
                                    mode: 'index',
                                    intersect: false
                                },
                            }
                        }}
                    />
                }
                {
                    type == 'stackedbar' &&
                    <Bar
                        datasetIdKey='id'
                        data={{
                            datasets: allDataSets,
                        }}
                        options={{
                            responsive: true,
                            scales: {
                                x: {
                                    type: 'time',
                                    time: {
                                        unit: 'month'
                                    },
                                    stacked: true,
                                    
                                },
                                y: {
                                    stacked: true,
                                    beginAtZero: true
                                }
                            },
                            animation: {
                                duration: 0
                            },
                            plugins: {
                                legend: {
                                    display: true,
                                    position: 'bottom',
                                },
                                tooltip: {
                                    enabled: true,
                                    mode: 'index',
                                    intersect: false
                                },
                            }
                        }}
                    />
                }

            </div>
        </div>
    )
}