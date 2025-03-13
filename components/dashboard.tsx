import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatsCard } from "./stats-card"
import { ChartCard, CustomBarChart, CustomPieChart, CustomLineChart } from "./charts"
import { DataTable } from "./data-table"
import { HitLog, DashboardStats } from "../types"

interface DashboardProps {
    logs: HitLog[]
    stats: DashboardStats
}

export function Dashboard({ logs, stats }: DashboardProps) {
    const [activeTab, setActiveTab] = useState("overview")
    const [isSecurityData, setIsSecurityData] = useState(false)

    useEffect(() => {
        // Determine if we're dealing with security testing data
        setIsSecurityData(logs.length > 0 && logs[0].goal !== undefined)
    }, [logs])

    // Prepare data for charts
    const methodChartData = Object.entries(stats.requestsByMethod).map(([name, value]) => ({
        name,
        value,
    }))

    const statusChartData = Object.entries(stats.requestsByStatus).map(([name, value]) => ({
        name: `${name}`,
        value,
    }))

    const topEndpointsData = stats.topEndpoints.map(({ url, count }) => ({
        name: url,
        value: count,
    }))

    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title={isSecurityData ? "Total Attempts" : "Total Requests"}
                    value={stats.totalRequests}
                    icon={
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                        >
                            <path d="M12 2v20M2 12h20" />
                        </svg>
                    }
                />
                <StatsCard
                    title={isSecurityData ? "Success Rate" : "Average Response Time"}
                    value={isSecurityData ? `${stats.successRate}%` : `${stats.averageResponseTime} ms`}
                    icon={
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                    }
                />
                <StatsCard
                    title={isSecurityData ? "Failure Rate" : "Success Rate"}
                    value={`${isSecurityData ? stats.errorRate : stats.successRate}%`}
                    icon={
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                        >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                    }
                />
                <StatsCard
                    title={isSecurityData ? "Unique Models" : "Unique IPs"}
                    value={stats.uniqueIPs}
                    icon={
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                        >
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </svg>
                    }
                />
            </div>

            <Tabs
                defaultValue="overview"
                className="space-y-4"
                onValueChange={setActiveTab}
            >
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="methods">{isSecurityData ? "Attack Types" : "Methods"}</TabsTrigger>
                    <TabsTrigger value="status">{isSecurityData ? "Detectors" : "Status Codes"}</TabsTrigger>
                    <TabsTrigger value="timeline">{isSecurityData ? "Attempts" : "Timeline"}</TabsTrigger>
                    <TabsTrigger value="raw">Raw Data</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <ChartCard title={isSecurityData ? "Top Triggers" : "Top Endpoints"}>
                            <CustomBarChart
                                data={topEndpointsData}
                                xAxisLabel={isSecurityData ? "Trigger" : "Endpoint"}
                                yAxisLabel="Count"
                            />
                        </ChartCard>
                        <ChartCard title={isSecurityData ? "Attack Types" : "Requests by Method"}>
                            <CustomPieChart data={methodChartData} />
                        </ChartCard>
                    </div>
                </TabsContent>

                <TabsContent value="methods" className="space-y-4">
                    <ChartCard title={isSecurityData ? "Attack Types Distribution" : "Requests by HTTP Method"}>
                        <CustomBarChart
                            data={methodChartData}
                            xAxisLabel={isSecurityData ? "Attack Type" : "Method"}
                            yAxisLabel="Count"
                        />
                    </ChartCard>
                </TabsContent>

                <TabsContent value="status" className="space-y-4">
                    <ChartCard title={isSecurityData ? "Detector Types" : "Requests by Status Code"}>
                        <CustomPieChart data={statusChartData} />
                    </ChartCard>
                </TabsContent>

                <TabsContent value="timeline" className="space-y-4">
                    <ChartCard title={isSecurityData ? "Attempts Over Time" : "Requests Over Time"}>
                        <CustomLineChart
                            data={stats.requestsOverTime}
                            xAxisLabel={isSecurityData ? "Attempt" : "Time"}
                            yAxisLabel="Count"
                        />
                    </ChartCard>
                </TabsContent>

                <TabsContent value="raw" className="space-y-4">
                    <DataTable data={logs} />
                </TabsContent>
            </Tabs>
        </div>
    )
} 