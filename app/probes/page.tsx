"use client"

import { useState } from "react"
import { ProbeSelector } from "../../components/probe-selector"
import { Dashboard } from "../../components/dashboard"
import { HitLog, DashboardStats, ProbeRequest } from "../../types"
import { analyzeHitLogs } from "../../lib/utils"
import { Toaster } from "sonner"
import { toast } from "sonner"

export default function ProbesPage() {
    const [logs, setLogs] = useState<HitLog[]>([])
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleRunProbe = async (request: ProbeRequest) => {
        try {
            setIsLoading(true)
            toast.info("Running Garak probes. This may take several minutes...")

            const response = await fetch('/api/run-probe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            })

            const result = await response.json()

            if (result.status === 'error') {
                toast.error(`Error: ${result.message}`)
                return
            }

            if (!result.logs || result.logs.length === 0) {
                toast.warning("No results were returned. Try different probes or check your API key.")
                return
            }

            const parsedLogs = result.logs as HitLog[]
            setLogs(parsedLogs)

            // Analyze the logs
            const analyzedStats = analyzeHitLogs(parsedLogs)
            setStats(analyzedStats)

            toast.success(`Successfully ran ${parsedLogs.length} probes!`)
        } catch (error: any) {
            console.error("Error running probes:", error)
            toast.error(`Failed to run probes: ${error.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="flex min-h-screen flex-col p-6 md:p-12">
            <Toaster />
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold">Garak LLM Vulnerability Testing</h1>
                    <p className="text-muted-foreground">
                        Test LLM vulnerabilities using Garak probes with Groq models.
                    </p>
                </div>

                {!stats && (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <div className="col-span-full lg:col-span-2">
                            <ProbeSelector
                                onRunProbe={handleRunProbe}
                                isLoading={isLoading}
                            />
                        </div>
                        <div className="col-span-full lg:col-span-1 space-y-4">
                            <h2 className="text-xl font-semibold">Instructions</h2>
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    1. Enter your Groq API key.
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    2. Select an LLM model to test.
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    3. Select one or more probes to run.
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    4. Optionally provide a custom prompt.
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    5. Click "Run Selected Probes" to start testing.
                                </p>
                                <p className="text-sm text-muted-foreground font-medium mt-4">
                                    Note: Running probes may take several minutes depending on the number selected.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {isLoading && (
                    <div className="flex items-center justify-center p-12">
                        <div className="flex flex-col items-center gap-2">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                            <p className="text-sm text-muted-foreground">Running probes...</p>
                        </div>
                    </div>
                )}

                {stats && !isLoading && (
                    <Dashboard logs={logs} stats={stats} />
                )}
            </div>
        </main>
    )
} 