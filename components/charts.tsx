import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    Legend
} from "recharts"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']

interface ChartCardProps {
    title: string
    children: React.ReactNode
}

export function ChartCard({ title, children }: ChartCardProps) {
    return (
        <Card className="col-span-2">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
                {children}
            </CardContent>
        </Card>
    )
}

interface BarChartProps {
    data: Array<{ name: string; value: number }>
    xAxisLabel?: string
    yAxisLabel?: string
}

export function CustomBarChart({ data, xAxisLabel, yAxisLabel }: BarChartProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" label={{ value: xAxisLabel, position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    )
}

interface PieChartProps {
    data: Array<{ name: string; value: number }>
}

export function CustomPieChart({ data }: PieChartProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    )
}

interface LineChartProps {
    data: Array<{ time: string; count: number }>
    xAxisLabel?: string
    yAxisLabel?: string
}

export function CustomLineChart({ data, xAxisLabel, yAxisLabel }: LineChartProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="time"
                    label={{ value: xAxisLabel, position: 'insideBottom', offset: -5 }}
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                />
                <YAxis label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                    name="Requests"
                />
            </LineChart>
        </ResponsiveContainer>
    )
} 