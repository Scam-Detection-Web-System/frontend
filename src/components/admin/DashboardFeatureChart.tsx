import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

const featureAccessData = [
    { feature: "Kiểm tra SĐT", visits: 4820 },
    { feature: "Báo cáo lừa đảo", visits: 2340 },
    { feature: "Tra cứu CSDL", visits: 1890 },
    { feature: "Tin tức", visits: 1456 },
    { feature: "Hướng dẫn", visits: 987 },
]

const chartConfig = {
    visits: {
        label: "Lượt truy cập",
        color: "hsl(217, 91%, 60%)",
    },
} satisfies ChartConfig

export function DashboardFeatureChart() {
    return (
        <Card className="border-slate-200 dark:border-slate-700/50">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg">Tính năng phổ biến</CardTitle>
                <CardDescription>Số lượt truy cập các tính năng trong tháng</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <BarChart
                        data={featureAccessData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            horizontal={false}
                            className="stroke-border/30"
                        />
                        <XAxis
                            type="number"
                            tickLine={false}
                            axisLine={false}
                            fontSize={12}
                        />
                        <YAxis
                            dataKey="feature"
                            type="category"
                            tickLine={false}
                            axisLine={false}
                            width={120}
                            fontSize={12}
                        />
                        <ChartTooltip
                            cursor={{ fill: "hsl(var(--muted) / 0.3)" }}
                            content={<ChartTooltipContent />}
                        />
                        <defs>
                            <linearGradient id="featureGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.8} />
                                <stop offset="100%" stopColor="hsl(199, 89%, 48%)" stopOpacity={1} />
                            </linearGradient>
                        </defs>
                        <Bar
                            dataKey="visits"
                            fill="url(#featureGradient)"
                            radius={[0, 6, 6, 0]}
                            barSize={28}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
