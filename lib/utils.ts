import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { HitLog, DashboardStats, GarakProbe, GroqModel } from "../types"
import { format, parseISO } from "date-fns"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Available Groq models
export function getAvailableModels(): GroqModel[] {
    return [
        { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B Instant" },
        { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B Versatile" },
        { id: "llama3-8b-8192", name: "Llama 3 8B" },
        { id: "llama3-70b-8192", name: "Llama 3 70B" },
        { id: "gemma2-9b-it", name: "Gemma 2 9B" },
        { id: "llama-guard-3-8b", name: "Llama Guard 3 8B" },
        { id: "mistral-saba-24b", name: "Mistral Saba 24B" },
        { id: "qwen-2.5-32b", name: "Qwen 2.5 32B" },
        { id: "qwen-2.5-coder-32b", name: "Qwen 2.5 Coder 32B" },
        { id: "qwen-qwq-32b", name: "Qwen QWQ 32B" },
        { id: "deepseek-r1-distill-qwen-32b", name: "DeepSeek R1 Distill Qwen 32B" },
        { id: "deepseek-r1-distill-llama-70b", name: "DeepSeek R1 Distill Llama 70B" },
        { id: "llama-3.2-1b-preview", name: "Llama 3.2 1B Preview" },
        { id: "llama-3.2-3b-preview", name: "Llama 3.2 3B Preview" },
        { id: "llama-3.2-11b-vision-preview", name: "Llama 3.2 11B Vision Preview" },
        { id: "llama-3.2-90b-vision-preview", name: "Llama 3.2 90B Vision Preview" },
        { id: "llama-3.3-70b-specdec", name: "Llama 3.3 70B SpecDec" },
    ]
}

// Get categories of Garak probes
export function getProbeCategories(): string[] {
    return [
        "ansiescape",
        "atkgen",
        "av_spam_scanning",
        "continuation",
        "dan",
        "divergence",
        "donotanswer",
        "encoding",
        "fileformats",
        "forensic_deception",
        "glitch",
        "goodside",
        "grandma",
        "latentinjection",
        "leakreplay",
        "lmrc",
        "malwaregen",
        "misleading",
        "packagehallucination",
        "phrasing",
        "promptinject",
        "realtoxicityprompts",
        "snowball",
        "suffix",
        "tap",
        "test",
        "topic",
        "visual_jailbreak",
        "xss"
    ]
}

// Get available Garak probes
export function getAvailableProbes(): GarakProbe[] {
    return [
        { id: "ansiescape.AnsiEscaped", name: "AnsiEscaped", category: "ansiescape" },
        { id: "ansiescape.AnsiRaw", name: "AnsiRaw", category: "ansiescape" },
        { id: "atkgen.Tox", name: "Tox", category: "atkgen" },
        { id: "av_spam_scanning.EICAR", name: "EICAR", category: "av_spam_scanning" },
        { id: "av_spam_scanning.GTUBE", name: "GTUBE", category: "av_spam_scanning" },
        { id: "av_spam_scanning.GTphish", name: "GTphish", category: "av_spam_scanning" },
        { id: "continuation.ContinueSlursReclaimedSlurs", name: "ContinueSlursReclaimedSlurs", category: "continuation" },
        { id: "dan.AntiDAN", name: "AntiDAN", category: "dan" },
        { id: "dan.AutoDANCached", name: "AutoDANCached", category: "dan" },
        { id: "dan.ChatGPT_Developer_Mode_RANTI", name: "ChatGPT_Developer_Mode_RANTI", category: "dan" },
        { id: "dan.ChatGPT_Developer_Mode_v2", name: "ChatGPT_Developer_Mode_v2", category: "dan" },
        { id: "dan.ChatGPT_Image_Markdown", name: "ChatGPT_Image_Markdown", category: "dan" },
        { id: "dan.DAN_Jailbreak", name: "DAN_Jailbreak", category: "dan" },
        { id: "dan.DUDE", name: "DUDE", category: "dan" },
        { id: "dan.DanInTheWild", name: "DanInTheWild", category: "dan" },
        { id: "dan.Dan_6_0", name: "Dan_6_0", category: "dan" },
        { id: "dan.Dan_6_2", name: "Dan_6_2", category: "dan" },
        { id: "dan.Dan_7_0", name: "Dan_7_0", category: "dan" },
        { id: "dan.Dan_8_0", name: "Dan_8_0", category: "dan" },
        { id: "dan.Dan_9_0", name: "Dan_9_0", category: "dan" },
        { id: "dan.Dan_10_0", name: "Dan_10_0", category: "dan" },
        { id: "dan.Dan_11_0", name: "Dan_11_0", category: "dan" },
        { id: "dan.STAN", name: "STAN", category: "dan" },
        { id: "divergence.Repeat", name: "Repeat", category: "divergence" },
        { id: "donotanswer.InformationHazard", name: "InformationHazard", category: "donotanswer" },
        { id: "encoding.InjectAscii85", name: "InjectAscii85", category: "encoding" },
        { id: "encoding.InjectBase16", name: "InjectBase16", category: "encoding" },
        { id: "encoding.InjectBase2048", name: "InjectBase2048", category: "encoding" },
        { id: "encoding.InjectBase32", name: "InjectBase32", category: "encoding" },
        { id: "encoding.InjectBase64", name: "InjectBase64", category: "encoding" },
        { id: "encoding.InjectBraille", name: "InjectBraille", category: "encoding" },
        { id: "encoding.InjectEcoji", name: "InjectEcoji", category: "encoding" },
        { id: "encoding.InjectHex", name: "InjectHex", category: "encoding" },
        { id: "encoding.InjectMorse", name: "InjectMorse", category: "encoding" },
        { id: "encoding.InjectNato", name: "InjectNato", category: "encoding" },
        { id: "encoding.InjectROT13", name: "InjectROT13", category: "encoding" },
        { id: "encoding.InjectUU", name: "InjectUU", category: "encoding" },
        { id: "encoding.InjectZalgo", name: "InjectZalgo", category: "encoding" },
        { id: "fileformats.HF_Files", name: "HF_Files", category: "fileformats" },
        { id: "forensic_deception.ForensicDeception", name: "ForensicDeception", category: "forensic_deception" },
        { id: "glitch.Glitch", name: "Glitch", category: "glitch" },
        { id: "goodside.Davidjl", name: "Davidjl", category: "goodside" },
        { id: "goodside.Tag", name: "Tag", category: "goodside" },
        { id: "goodside.ThreatenJSON", name: "ThreatenJSON", category: "goodside" },
        { id: "goodside.WhoIsRiley", name: "WhoIsRiley", category: "goodside" },
        { id: "grandma.Slurs", name: "Slurs", category: "grandma" },
        { id: "grandma.Substances", name: "Substances", category: "grandma" },
        { id: "grandma.Win10", name: "Win10", category: "grandma" },
        { id: "grandma.Win11", name: "Win11", category: "grandma" },
        { id: "latentinjection.LatentInjectionFactSnippetEiffel", name: "LatentInjectionFactSnippetEiffel", category: "latentinjection" },
        { id: "latentinjection.LatentInjectionFactSnippetLegal", name: "LatentInjectionFactSnippetLegal", category: "latentinjection" },
        { id: "latentinjection.LatentInjectionReport", name: "LatentInjectionReport", category: "latentinjection" },
        { id: "latentinjection.LatentInjectionResume", name: "LatentInjectionResume", category: "latentinjection" },
        { id: "latentinjection.LatentInjectionTranslationEnFr", name: "LatentInjectionTranslationEnFr", category: "latentinjection" },
        { id: "latentinjection.LatentInjectionTranslationEnZh", name: "LatentInjectionTranslationEnZh", category: "latentinjection" },
        { id: "latentinjection.LatentJailbreak", name: "LatentJailbreak", category: "latentinjection" },
        { id: "latentinjection.LatentWhois", name: "LatentWhois", category: "latentinjection" },
        { id: "latentinjection.LatentWhoisSnippet", name: "LatentWhoisSnippet", category: "latentinjection" },
        { id: "leakreplay.GuardianCloze", name: "GuardianCloze", category: "leakreplay" },
        { id: "leakreplay.GuardianComplete", name: "GuardianComplete", category: "leakreplay" },
        { id: "leakreplay.LiteratureCloze", name: "LiteratureCloze", category: "leakreplay" },
        { id: "leakreplay.LiteratureComplete", name: "LiteratureComplete", category: "leakreplay" },
        { id: "leakreplay.NYTCloze", name: "NYTCloze", category: "leakreplay" },
        { id: "leakreplay.NYTComplete", name: "NYTComplete", category: "leakreplay" },
        { id: "leakreplay.PotterCloze", name: "PotterCloze", category: "leakreplay" },
        { id: "leakreplay.PotterComplete", name: "PotterComplete", category: "leakreplay" },
        { id: "lmrc.Anthropomorphisation", name: "Anthropomorphisation", category: "lmrc" },
        { id: "lmrc.Bullying", name: "Bullying", category: "lmrc" },
        { id: "lmrc.Deadnaming", name: "Deadnaming", category: "lmrc" },
        { id: "lmrc.Profanity", name: "Profanity", category: "lmrc" },
        { id: "lmrc.QuackMedicine", name: "QuackMedicine", category: "lmrc" },
        { id: "lmrc.SexualContent", name: "SexualContent", category: "lmrc" },
        { id: "lmrc.Sexualisation", name: "Sexualisation", category: "lmrc" },
        { id: "lmrc.SlurUsage", name: "SlurUsage", category: "lmrc" },
        { id: "malwaregen.Evasion", name: "Evasion", category: "malwaregen" },
        { id: "malwaregen.Payload", name: "Payload", category: "malwaregen" },
        { id: "malwaregen.SubFunctions", name: "SubFunctions", category: "malwaregen" },
        { id: "malwaregen.TopLevel", name: "TopLevel", category: "malwaregen" },
        { id: "misleading.FalseAssertion", name: "FalseAssertion", category: "misleading" },
        { id: "packagehallucination.JavaScript", name: "JavaScript", category: "packagehallucination" },
        { id: "packagehallucination.Python", name: "Python", category: "packagehallucination" },
        { id: "packagehallucination.Ruby", name: "Ruby", category: "packagehallucination" },
        { id: "packagehallucination.Rust", name: "Rust", category: "packagehallucination" },
        { id: "phrasing.FutureTense", name: "FutureTense", category: "phrasing" },
        { id: "phrasing.PastTense", name: "PastTense", category: "phrasing" },
        { id: "promptinject.HijackHateHumans", name: "HijackHateHumans", category: "promptinject" },
        { id: "promptinject.HijackKillHumans", name: "HijackKillHumans", category: "promptinject" },
        { id: "promptinject.HijackLongPrompt", name: "HijackLongPrompt", category: "promptinject" },
        { id: "realtoxicityprompts.RTPBlank", name: "RTPBlank", category: "realtoxicityprompts" },
        { id: "realtoxicityprompts.RTPFlirtation", name: "RTPFlirtation", category: "realtoxicityprompts" },
        { id: "realtoxicityprompts.RTPIdentity_Attack", name: "RTPIdentity_Attack", category: "realtoxicityprompts" },
        { id: "realtoxicityprompts.RTPInsult", name: "RTPInsult", category: "realtoxicityprompts" },
        { id: "realtoxicityprompts.RTPProfanity", name: "RTPProfanity", category: "realtoxicityprompts" },
        { id: "realtoxicityprompts.RTPSevere_Toxicity", name: "RTPSevere_Toxicity", category: "realtoxicityprompts" },
        { id: "realtoxicityprompts.RTPSexually_Explicit", name: "RTPSexually_Explicit", category: "realtoxicityprompts" },
        { id: "realtoxicityprompts.RTPThreat", name: "RTPThreat", category: "realtoxicityprompts" },
        { id: "snowball.GraphConnectivity", name: "GraphConnectivity", category: "snowball" },
        { id: "snowball.Primes", name: "Primes", category: "snowball" },
        { id: "snowball.Senators", name: "Senators", category: "snowball" },
        { id: "suffix.GCGCached", name: "GCGCached", category: "suffix" },
        { id: "tap.TAPCached", name: "TAPCached", category: "tap" },
        { id: "topic.WordnetControversial", name: "WordnetControversial", category: "topic" },
        { id: "xss.ColabAIDataLeakage", name: "ColabAIDataLeakage", category: "xss" },
        { id: "xss.MarkdownImageExfil", name: "MarkdownImageExfil", category: "xss" },
        { id: "xss.MdExfil20230929", name: "MdExfil20230929", category: "xss" },
        { id: "xss.StringAssemblyDataExfil", name: "StringAssemblyDataExfil", category: "xss" }
    ]
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