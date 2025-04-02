import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'
import { parseJSONL } from '../../../lib/utils'
import { ProbeRequest, ProbeResult, HitLog } from '../../../types'

export const maxDuration = 300 // Set max duration to 5 minutes
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
    try {
        const data: ProbeRequest = await request.json()
        const { apiKey, model, probes, customPrompt } = data

        if (!apiKey || !model || !probes || probes.length === 0) {
            return NextResponse.json(
                {
                    status: 'error',
                    message: 'Missing required parameters'
                } as ProbeResult,
                { status: 400 }
            )
        }

        // Create a temporary directory for output
        const tempDir = path.join('/tmp', `garak-run-${Date.now()}`)

        try {
            fs.mkdirSync(tempDir, { recursive: true })
        } catch (err: any) {
            console.error('Failed to create temp directory:', err)
            return NextResponse.json(
                {
                    status: 'error',
                    message: 'Failed to create temporary directory'
                } as ProbeResult,
                { status: 500 }
            )
        }

        const outputFile = path.join(tempDir, 'output.jsonl')

        // Format the probes for command line
        const probesString = probes.join(', ')

        // Construct the command
        let command = `export GROQ_API_KEY=${apiKey} && ` +
            `garak --model_type groq --model_name ${model} ` +
            `--probes "${probesString}" ` +
            `--output "${outputFile}"`

        // Add custom prompt if provided
        if (customPrompt) {
            command += ` --prompt "${customPrompt.replace(/"/g, '\\"')}"`
        }

        console.log(`Running command: ${command.replace(apiKey, '***')}`)

        return new Promise((resolve) => {
            // Execute the command
            exec(command, async (error, stdout, stderr) => {
                console.log('Command output:', stdout)

                if (error) {
                    console.error('Command error:', error)
                    console.error('Stderr:', stderr)

                    resolve(NextResponse.json({
                        status: 'error',
                        message: `Failed to run Garak: ${error.message}`
                    } as ProbeResult))
                    return
                }

                try {
                    // Check if output file exists
                    if (!fs.existsSync(outputFile)) {
                        resolve(NextResponse.json({
                            status: 'error',
                            message: 'No output file was generated'
                        } as ProbeResult))
                        return
                    }

                    // Read and parse the output file
                    const fileBuffer = fs.readFileSync(outputFile)
                    const fileBlob = new Blob([fileBuffer])
                    const file = new File([fileBlob], 'output.jsonl')

                    const logs = await parseJSONL(file) as HitLog[]

                    // Clean up temp files
                    try {
                        fs.unlinkSync(outputFile)
                        fs.rmdirSync(tempDir)
                    } catch (cleanupErr: any) {
                        console.error('Failed to clean up temp files:', cleanupErr)
                    }

                    resolve(NextResponse.json({
                        status: 'success',
                        logs
                    } as ProbeResult))
                } catch (readErr: any) {
                    console.error('Failed to read output file:', readErr)
                    resolve(NextResponse.json({
                        status: 'error',
                        message: `Failed to read results: ${readErr.message}`
                    } as ProbeResult))
                }
            })
        })
    } catch (err: any) {
        console.error('Request handling error:', err)
        return NextResponse.json(
            {
                status: 'error',
                message: `An unexpected error occurred: ${err.message}`
            } as ProbeResult,
            { status: 500 }
        )
    }
} 