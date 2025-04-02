import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, CircleAlert, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { getAvailableModels, getAvailableProbes, getProbeCategories } from "../lib/utils"
import { GarakProbe, GroqModel, ProbeRequest } from "../types"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"

interface ProbeSelectorProps {
    onRunProbe: (request: ProbeRequest) => Promise<void>
    isLoading: boolean
}

export function ProbeSelector({ onRunProbe, isLoading }: ProbeSelectorProps) {
    const models: GroqModel[] = [
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

    const categories: string[] = [
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

    const probes: GarakProbe[] = [
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

    const [apiKey, setApiKey] = useState("")
    const [selectedModel, setSelectedModel] = useState<string>("")
    const [selectedProbes, setSelectedProbes] = useState<string[]>([])
    const [customPrompt, setCustomPrompt] = useState<string>("")
    const [isApiKeyVisible, setIsApiKeyVisible] = useState(false)

    const handleProbeToggle = (probeId: string) => {
        setSelectedProbes((prev) => {
            if (prev.includes(probeId)) {
                return prev.filter((id) => id !== probeId)
            } else {
                return [...prev, probeId]
            }
        })
    }

    const handleCategoryToggle = (category: string) => {
        const categoryProbes = probes
            .filter((probe) => probe.category === category)
            .map((probe) => probe.id)

        const allSelected = categoryProbes.every((probeId) =>
            selectedProbes.includes(probeId)
        )

        if (allSelected) {
            // If all are selected, unselect all in this category
            setSelectedProbes((prev) =>
                prev.filter((id) => !categoryProbes.includes(id))
            )
        } else {
            // If not all selected, select all in this category
            setSelectedProbes((prev) => {
                const newSelection = [...prev]
                categoryProbes.forEach((probeId) => {
                    if (!newSelection.includes(probeId)) {
                        newSelection.push(probeId)
                    }
                })
                return newSelection
            })
        }
    }

    const handleSubmit = () => {
        if (!apiKey) {
            alert("Please enter your Groq API key")
            return
        }

        if (!selectedModel) {
            alert("Please select a model")
            return
        }

        if (selectedProbes.length === 0) {
            alert("Please select at least one probe")
            return
        }

        onRunProbe({
            apiKey,
            model: selectedModel,
            probes: selectedProbes,
            customPrompt: customPrompt || undefined
        })
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Run Garak Probes on LLMs</CardTitle>
                <CardDescription>
                    Select models and probes to test LLM vulnerabilities using Garak via Groq
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* API Key Input */}
                <div className="space-y-2">
                    <Label htmlFor="apiKey">Groq API Key</Label>
                    <div className="flex space-x-2">
                        <Input
                            id="apiKey"
                            type={isApiKeyVisible ? "text" : "password"}
                            placeholder="Enter your Groq API key"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                        />
                        <Button
                            variant="outline"
                            onClick={() => setIsApiKeyVisible(!isApiKeyVisible)}
                        >
                            {isApiKeyVisible ? "Hide" : "Show"}
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Your API key is only used for making requests and is not stored.
                    </p>
                </div>

                {/* Model Selection */}
                <div className="space-y-2">
                    <Label htmlFor="model">LLM Model</Label>
                    <Select
                        value={selectedModel}
                        onValueChange={setSelectedModel}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a model" />
                        </SelectTrigger>
                        <SelectContent>
                            {models.map((model) => (
                                <SelectItem key={model.id} value={model.id}>
                                    {model.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Custom Prompt (Optional) */}
                <div className="space-y-2">
                    <Label htmlFor="customPrompt">Custom Prompt (Optional)</Label>
                    <Textarea
                        id="customPrompt"
                        placeholder="Enter a custom prompt to test"
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                    />
                </div>

                {/* Probe Selection */}
                <div className="space-y-2">
                    <Label>Select Probes</Label>
                    <Card className="border-gray-200">
                        <CardContent className="p-4">
                            <p className="text-sm mb-2">
                                Selected: <Badge>{selectedProbes.length}</Badge>
                            </p>
                            <ScrollArea className="h-64 pr-4">
                                <Accordion type="multiple" className="w-full">
                                    {categories.map((category) => {
                                        const categoryProbes = probes.filter(
                                            (probe) => probe.category === category
                                        )
                                        const selectedCount = categoryProbes.filter(
                                            (probe) => selectedProbes.includes(probe.id)
                                        ).length
                                        const allSelected = selectedCount === categoryProbes.length
                                        const someSelected = selectedCount > 0 && !allSelected

                                        return (
                                            <AccordionItem key={category} value={category}>
                                                <AccordionTrigger className="py-3">
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`category-${category}`}
                                                            checked={allSelected}
                                                            className={someSelected ? "bg-primary/50" : ""}
                                                            onCheckedChange={() => handleCategoryToggle(category)}
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                        <span>
                                                            {category} ({selectedCount}/{categoryProbes.length})
                                                        </span>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="space-y-2 pl-6">
                                                        {categoryProbes.map((probe) => (
                                                            <div key={probe.id} className="flex items-center space-x-2">
                                                                <Checkbox
                                                                    id={probe.id}
                                                                    checked={selectedProbes.includes(probe.id)}
                                                                    onCheckedChange={() => handleProbeToggle(probe.id)}
                                                                />
                                                                <label
                                                                    htmlFor={probe.id}
                                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                                >
                                                                    {probe.name}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        )
                                    })}
                                </Accordion>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>

                {/* Run Button */}
                <Button
                    className="w-full"
                    onClick={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Running Probes...
                        </>
                    ) : (
                        "Run Selected Probes"
                    )}
                </Button>
            </CardContent>
        </Card>
    )
} 