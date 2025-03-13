import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { HitLog, DashboardStats } from "../types"
import { format, parseISO } from "date-fns"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export async function parseJSONL(file: File): Promise<HitLog[]> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (event) => {
            try {
                const text = event.target?.result as string
                const lines = text.trim().split('\n')
                const logs = lines.map(line => JSON.parse(line) as HitLog)
                resolve(logs)
            } catch (error) {
                reject(error)
            }
        }
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsText(file)
    })
}

export function analyzeHitLogs(logs: HitLog[]): DashboardStats {
    // Determine if we're dealing with HTTP logs or security testing logs
    const isSecurityTestingData = logs.length > 0 && logs[0].goal !== undefined;

    // Count total requests/attempts
    const totalRequests = logs.length;

    // For HTTP logs
    let averageResponseTime = 0;
    let successRate = 0;
    let errorRate = 0;
    let uniqueIPs = 0;
    let requestsByMethod: Record<string, number> = {};
    let requestsByStatus: Record<string, number> = {};
    let requestsOverTime: Array<{ time: string; count: number }> = [];
    let topEndpoints: Array<{ url: string; count: number }> = [];

    if (!isSecurityTestingData && logs.length > 0 && logs[0].timestamp) {
        // Calculate average response time for HTTP logs
        const totalResponseTime = logs.reduce((sum, log) => sum + (log.response_time || 0), 0);
        averageResponseTime = totalRequests > 0 ? Math.round(totalResponseTime / totalRequests) : 0;

        // Calculate success and error rates for HTTP logs
        const successfulRequests = logs.filter(log => log.status && log.status >= 200 && log.status < 400).length;
        successRate = totalRequests > 0 ? Math.round((successfulRequests / totalRequests) * 100) : 0;
        errorRate = totalRequests > 0 ? 100 - successRate : 0;

        // Count unique IPs for HTTP logs
        uniqueIPs = new Set(logs.filter(log => log.ip).map(log => log.ip)).size;

        // Count requests by method for HTTP logs
        logs.forEach(log => {
            if (log.method) {
                requestsByMethod[log.method] = (requestsByMethod[log.method] || 0) + 1;
            }
        });

        // Count requests by status code for HTTP logs
        logs.forEach(log => {
            if (log.status) {
                const statusCategory = Math.floor(log.status / 100) * 100;
                const statusKey = `${statusCategory}`;
                requestsByStatus[statusKey] = (requestsByStatus[statusKey] || 0) + 1;
            }
        });

        // Group requests by hour for HTTP logs
        const requestsByHour: Record<string, number> = {};
        logs.forEach(log => {
            if (log.timestamp) {
                const date = parseISO(log.timestamp);
                const hourKey = format(date, 'yyyy-MM-dd HH:00');
                requestsByHour[hourKey] = (requestsByHour[hourKey] || 0) + 1;
            }
        });

        Object.entries(requestsByHour)
            .sort(([a], [b]) => a.localeCompare(b))
            .forEach(([time, count]) => {
                requestsOverTime.push({ time, count });
            });

        // Count top endpoints for HTTP logs
        const endpointCounts: Record<string, number> = {};
        logs.forEach(log => {
            if (log.url) {
                try {
                    const url = new URL(log.url).pathname;
                    endpointCounts[url] = (endpointCounts[url] || 0) + 1;
                } catch (e) {
                    // Handle invalid URLs
                    endpointCounts[log.url] = (endpointCounts[log.url] || 0) + 1;
                }
            }
        });

        topEndpoints = Object.entries(endpointCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([url, count]) => ({ url, count }));
    } else {
        // For security testing data
        // Calculate success rate based on scores
        const totalScore = logs.reduce((sum, log) => sum + (log.score || 0), 0);
        successRate = totalRequests > 0 ? Math.round((totalScore / totalRequests) * 100) : 0;
        errorRate = 100 - successRate;

        // Count unique generators (models)
        uniqueIPs = new Set(logs.filter(log => log.generator).map(log => log.generator)).size;

        // Count by probe type (attack type)
        requestsByMethod = {};
        logs.forEach(log => {
            if (log.probe) {
                requestsByMethod[log.probe] = (requestsByMethod[log.probe] || 0) + 1;
            }
        });

        // Count by detector type
        requestsByStatus = {};
        logs.forEach(log => {
            if (log.detector) {
                requestsByStatus[log.detector] = (requestsByStatus[log.detector] || 0) + 1;
            }
        });

        // Group by attempt sequence
        const attemptsBySeq: Record<string, number> = {};
        logs.forEach(log => {
            if (log.attempt_seq !== undefined) {
                const seqKey = `Attempt ${log.attempt_seq}`;
                attemptsBySeq[seqKey] = (attemptsBySeq[seqKey] || 0) + 1;
            }
        });

        requestsOverTime = Object.entries(attemptsBySeq)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([time, count]) => ({ time, count }));

        // Count top triggers
        const triggerCounts: Record<string, number> = {};
        logs.forEach(log => {
            if (log.trigger) {
                triggerCounts[log.trigger] = (triggerCounts[log.trigger] || 0) + 1;
            }
        });

        topEndpoints = Object.entries(triggerCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([url, count]) => ({ url, count }));
    }

    return {
        totalRequests,
        averageResponseTime,
        successRate,
        errorRate,
        uniqueIPs,
        requestsByMethod,
        requestsByStatus,
        requestsOverTime,
        topEndpoints
    }
} 