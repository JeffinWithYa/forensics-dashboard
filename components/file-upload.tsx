import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'

interface FileUploadProps {
    onFileUpload: (file: File) => void
}

export function FileUpload({ onFileUpload }: FileUploadProps) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) {
            return
        }

        const file = acceptedFiles[0]

        if (!file.name.endsWith('.jsonl')) {
            toast.error('Please upload a JSONL file')
            return
        }

        onFileUpload(file)
        toast.success(`File "${file.name}" uploaded successfully`)
    }, [onFileUpload])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/jsonl': ['.jsonl'],
            'text/plain': ['.jsonl']
        },
        maxFiles: 1
    })

    return (
        <Card className="w-full">
            <CardContent className="pt-6">
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary/50'
                        }`}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="rounded-full bg-primary/10 p-3">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-6 w-6 text-primary"
                            >
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" x2="12" y1="3" y2="15" />
                            </svg>
                        </div>
                        <div className="space-y-1 text-center">
                            <p className="text-sm font-medium">
                                {isDragActive ? 'Drop the file here' : 'Drag and drop your hitlog.jsonl file'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                or click to browse
                            </p>
                        </div>
                        <Button variant="outline" size="sm">
                            Select File
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
} 