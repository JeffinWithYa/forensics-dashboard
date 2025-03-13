import { useState, useEffect } from "react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    getFilteredRowModel,
    ColumnFiltersState,
    ExpandedState,
    getExpandedRowModel,
} from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { HitLog } from "../types"
import { format, parseISO } from "date-fns"
import { ChevronDown, ChevronRight } from "lucide-react"

// HTTP log columns
const httpColumns: ColumnDef<HitLog>[] = [
    {
        accessorKey: "timestamp",
        header: "Timestamp",
        cell: ({ row }) => {
            const timestamp = row.getValue("timestamp") as string
            if (!timestamp) return "-"
            try {
                const date = parseISO(timestamp)
                return format(date, "yyyy-MM-dd HH:mm:ss")
            } catch (e) {
                return timestamp
            }
        },
    },
    {
        accessorKey: "method",
        header: "Method",
    },
    {
        accessorKey: "url",
        header: "URL",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as number
            if (!status) return "-"
            return (
                <div className="flex items-center">
                    <div
                        className={`h-2 w-2 rounded-full mr-2 ${status < 400
                            ? "bg-green-500"
                            : status < 500
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                    />
                    {status}
                </div>
            )
        },
    },
    {
        accessorKey: "ip",
        header: "IP Address",
    },
    {
        accessorKey: "user_agent",
        header: "User Agent",
    },
    {
        accessorKey: "response_time",
        header: "Response Time (ms)",
    },
]

// Security testing columns
const securityColumns: ColumnDef<HitLog>[] = [
    {
        id: "expander",
        header: () => null,
        cell: ({ row }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => row.toggleExpanded()}
                    className="p-0 h-6 w-6"
                >
                    {row.getIsExpanded() ? (
                        <ChevronDown className="h-4 w-4" />
                    ) : (
                        <ChevronRight className="h-4 w-4" />
                    )}
                </Button>
            )
        },
    },
    {
        accessorKey: "goal",
        header: "Attack Goal",
    },
    {
        accessorKey: "prompt",
        header: "Prompt",
        cell: ({ row }) => {
            const prompt = row.getValue("prompt") as string
            if (!prompt) return "-"
            // Truncate long prompts
            return prompt.length > 100 ? prompt.substring(0, 100) + "..." : prompt
        },
    },
    {
        accessorKey: "output",
        header: "Output",
        cell: ({ row }) => {
            const output = row.getValue("output") as string
            if (!output) return "-"
            // Truncate long outputs
            return output.length > 100 ? output.substring(0, 100) + "..." : output
        },
    },
    {
        accessorKey: "trigger",
        header: "Trigger",
    },
    {
        accessorKey: "score",
        header: "Score",
        cell: ({ row }) => {
            const score = row.getValue("score") as number
            if (score === undefined) return "-"
            return (
                <div className="flex items-center">
                    <div
                        className={`h-2 w-2 rounded-full mr-2 ${score >= 0.8
                            ? "bg-red-500"
                            : score >= 0.5
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                    />
                    {score}
                </div>
            )
        },
    },
    {
        accessorKey: "generator",
        header: "Model",
    },
    {
        accessorKey: "probe",
        header: "Attack Type",
    },
]

interface DataTableProps {
    data: HitLog[]
}

export function DataTable({ data }: DataTableProps) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [expanded, setExpanded] = useState<ExpandedState>({})
    const [filterField, setFilterField] = useState<string>("prompt")

    const table = useReactTable({
        data,
        columns: securityColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onExpandedChange: setExpanded,
        getExpandedRowModel: getExpandedRowModel(),
        state: {
            sorting,
            columnFilters,
            expanded,
        },
    })

    return (
        <div>
            <div className="flex items-center py-4">
                <Input
                    placeholder={`Filter ${filterField}...`}
                    value={(table.getColumn(filterField)?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn(filterField)?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <>
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                    {row.getIsExpanded() && (
                                        <TableRow>
                                            <TableCell colSpan={securityColumns.length} className="bg-muted/50 p-4">
                                                <div className="space-y-3">
                                                    <div>
                                                        <h4 className="font-medium">Full Prompt:</h4>
                                                        <pre className="mt-1 text-sm whitespace-pre-wrap bg-muted p-2 rounded-md">
                                                            {row.original.prompt || "N/A"}
                                                        </pre>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium">Full Output:</h4>
                                                        <pre className="mt-1 text-sm whitespace-pre-wrap bg-muted p-2 rounded-md">
                                                            {row.original.output || "N/A"}
                                                        </pre>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <h4 className="font-medium">Attack Method:</h4>
                                                            <p className="mt-1 text-sm">{row.original.probe || "N/A"}</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium">Detector:</h4>
                                                            <p className="mt-1 text-sm">{row.original.detector || "N/A"}</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium">Model:</h4>
                                                            <p className="mt-1 text-sm">{row.original.generator || "N/A"}</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium">Trigger:</h4>
                                                            <p className="mt-1 text-sm">{row.original.trigger || "N/A"}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={securityColumns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    )
} 