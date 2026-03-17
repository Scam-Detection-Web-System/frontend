import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface AdminStatsCardProps {
    title: string
    value: string
    description: string
    icon: React.ReactNode
    trend?: "up" | "down" | "neutral"
    trendValue?: string
}

export function AdminStatsCard({ title, value, description, icon, trend = "neutral", trendValue }: AdminStatsCardProps) {
    return (
        <Card className="relative overflow-hidden border-slate-200 dark:border-slate-700/50">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <p className="text-3xl font-bold tracking-tight">{value}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        {icon}
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                    {trend === "up" && (
                        <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            <TrendingUp className="h-3 w-3" />
                            {trendValue}
                        </span>
                    )}
                    {trend === "down" && (
                        <span className="flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400">
                            <TrendingDown className="h-3 w-3" />
                            {trendValue}
                        </span>
                    )}
                    {trend === "neutral" && (
                        <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                            <Minus className="h-3 w-3" />
                            {trendValue || "Không đổi"}
                        </span>
                    )}
                    <span className="text-xs text-muted-foreground">{description}</span>
                </div>
            </CardContent>
            {/* Subtle gradient accent */}
            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-primary/50 to-primary/10" />
        </Card>
    )
}
