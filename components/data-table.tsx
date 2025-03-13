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
    const [columns, setColumns] = useState<ColumnDef<HitLog>[]>(httpColumns)
    const [filterField, setFilterField] = useState<string>("url")

    useEffect(() => {
        // Determine if we're dealing with security testing data
        const isSecurityData = data.length > 0 && data[0].goal !== undefined
        setColumns(isSecurityData ? securityColumns : httpColumns)
        setFilterField(isSecurityData ? "prompt" : "url")
    }, [data])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
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
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
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