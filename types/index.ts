export interface HitLog {
    timestamp?: string;
    url?: string;
    method?: string;
    status?: number;
    ip?: string;
    user_agent?: string;
    response_time?: number;

    goal?: string;
    prompt?: string;
    output?: string;
    trigger?: string;
    score?: number;
    run_id?: string;
    attempt_id?: string;
    attempt_seq?: number;
    attempt_idx?: number;
    generator?: string;
    probe?: string;
    detector?: string;
    generations_per_prompt?: number;
}

export interface DashboardStats {
    totalRequests: number;
    averageResponseTime: number;
    successRate: number;
    errorRate: number;
    uniqueIPs: number;
    requestsByMethod: Record<string, number>;
    requestsByStatus: Record<string, number>;
    requestsOverTime: Array<{ time: string; count: number }>;
    topEndpoints: Array<{ url: string; count: number }>;
} 