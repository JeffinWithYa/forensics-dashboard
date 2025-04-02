"use client"

import { useState } from "react"
import { FileUpload } from "../components/file-upload"
import { Dashboard } from "../components/dashboard"
import { parseJSONL, analyzeHitLogs } from "../lib/utils"
import { HitLog, DashboardStats } from "../types"
import { Toaster } from "@/components/ui/sonner"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Beaker } from "lucide-react"

export default function Home() {
    const [logs, setLogs] = useState<HitLog[]>([])
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleFileUpload = async (file: File) => {
        try {
            setIsLoading(true)

            // Parse the JSONL file
            const parsedLogs = await parseJSONL(file)
            setLogs(parsedLogs)

            // Analyze the logs
            const analyzedStats = analyzeHitLogs(parsedLogs)
            setStats(analyzedStats)
        } catch (error) {
            console.error("Error processing file:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="flex min-h-screen flex-col p-6 md:p-12">
            <Toaster />
            <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row justify-between gap-2 items-start sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Forensics Log Analyzer</h1>
                        <p className="text-muted-foreground">
                            Upload a hitlog.jsonl file to visualize and analyze the data.
                        </p>
                    </div>
                    <Link href="/probes">
                        <Button className="mt-2 sm:mt-0" variant="outline">
                            <Beaker className="mr-2 h-4 w-4" />
                            Run Garak Probes
                        </Button>
                    </Link>
                </div>

                {!stats && (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <div className="col-span-full lg:col-span-2">
                            <FileUpload onFileUpload={handleFileUpload} />
                        </div>
                        <div className="col-span-full lg:col-span-1 space-y-4">
                            <h2 className="text-xl font-semibold">Instructions</h2>
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    1. Upload a hitlog.jsonl file using the file uploader.
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    2. The dashboard will automatically analyze and visualize the data.
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    3. Use the tabs to explore different aspects of the data.
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    4. Alternatively, <Link href="/probes" className="text-primary hover:underline">run Garak probes</Link> to generate new vulnerability test data.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {isLoading && (
                    <div className="flex items-center justify-center p-12">
                        <div className="flex flex-col items-center gap-2">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                            <p className="text-sm text-muted-foreground">Processing data...</p>
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