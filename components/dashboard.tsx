import { useState, useEffect } from "react"
import { ChartCard, CustomBarChart } from "./charts"
import { DataTable } from "./data-table"
import { HitLog, DashboardStats } from "../types"

interface DashboardProps {
    logs: HitLog[]
    stats: DashboardStats
}

export function Dashboard({ logs, stats }: DashboardProps) {
    const [isSecurityData, setIsSecurityData] = useState(false)

    useEffect(() => {
        // Determine if we're dealing with security testing data
        setIsSecurityData(logs.length > 0 && logs[0].goal !== undefined)
    }, [logs])

    // Prepare data for success/failure bar chart
    const successFailureData = [
        { name: "Successful", value: Math.round(stats.totalRequests * stats.successRate / 100) },
        { name: "Unsuccessful", value: Math.round(stats.totalRequests * stats.errorRate / 100) }
    ]

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Prompt Injection Analysis</h2>

            {/* Success vs Unsuccessful Bar Chart */}
            <div className="grid gap-4">
                <ChartCard title="Successful vs. Unsuccessful Prompt Injection Attempts">
                    <CustomBarChart
                        data={successFailureData}
                        xAxisLabel="Result"
                        yAxisLabel="Count"
                    />
                </ChartCard>
            </div>

            {/* Detailed Attempt Explorer */}
            <div className="space-y-2">
                <h3 className="text-xl font-semibold">Detailed Attempt Explorer</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    A searchable, paginated table that lists individual hitlog attempts.
                    Click on a row to expand the full details.
                </p>
                <DataTable data={logs} />
            </div>
        </div>
    )
} 