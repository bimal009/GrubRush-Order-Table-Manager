"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const chartData = [
    { month: "January", sales: 186 },
    { month: "February", sales: 305 },
    { month: "March", sales: 237 },
    { month: "April", sales: 73 },
    { month: "May", sales: 209 },
    { month: "June", sales: 214 },
]

function SalesChart() {
    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle className="text-base font-medium">Total Sales</CardTitle>
                    <p className="text-xs text-muted-foreground">May - June 2025</p>
                </div>
                <div className="flex gap-1 text-xs text-muted-foreground items-center">
                    <TrendingUp className="h-3 w-3 text-orange-500" />
                    <span className="text-orange-500 font-medium">+5.2%</span> this month
                </div>
            </CardHeader>            <CardContent className="h-[300px] pb-2">
                <div className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={chartData}
                            margin={{
                                top: 5,
                                right: 5,
                                left: -20,
                                bottom: 0,
                            }}
                        >
                            <defs>
                                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="rgb(249 115 22)" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="rgb(249 115 22)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="#e5e7eb"
                            />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, 3)}
                                fontSize={11}
                                tickMargin={5}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                fontSize={11}
                                tickCount={5}
                                tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="sales"
                                stroke="rgb(249 115 22)"
                                strokeWidth={2}
                                fill="url(#salesGradient)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}

export default SalesChart