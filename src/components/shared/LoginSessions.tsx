"use client"

import { Monitor, Smartphone, Laptop, MapPin, LogOut } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth, LoginSession } from "@/contexts/auth-context"

function DeviceIcon({ device }: { device: string }) {
    const iconClass = "h-5 w-5"
    switch (device) {
        case "Mobile":
            return <Smartphone className={iconClass} />
        case "Tablet":
            return <Laptop className={iconClass} />
        default:
            return <Monitor className={iconClass} />
    }
}

function getDeviceLabel(session: LoginSession) {
    // Combine device+OS and browser like "Windows PC • Chrome 122"
    const deviceNames: Record<string, string> = {
        "Windows 11": "Windows PC",
        "Windows 10": "Windows PC",
        "iOS 18": "iPhone 14",
        "macOS Sonoma": "MacBook Pro",
        "Android 14": "Tablet Android",
    }
    const deviceName = deviceNames[session.os] || session.device
    return `${deviceName} • ${session.browser}`
}

export function LoginSessions() {
    const { loginSessions } = useAuth()

    return (
        <div className="space-y-3">
            {loginSessions.map((session: LoginSession) => (
                <div
                    key={session.id}
                    className={`flex items-center gap-3 rounded-xl border p-3.5 transition-colors ${session.isCurrent
                            ? "border-emerald-500/40 bg-emerald-500/5 dark:border-emerald-500/30 dark:bg-emerald-500/10"
                            : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700/50 dark:bg-slate-800/50 dark:hover:bg-slate-800"
                        }`}
                >
                    {/* Device Icon */}
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${session.isCurrent
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                        }`}>
                        <DeviceIcon device={session.device} />
                    </div>

                    {/* Session Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                {getDeviceLabel(session)}
                            </p>
                            {session.isCurrent && (
                                <Badge className="bg-emerald-500 text-white hover:bg-emerald-500 text-[10px] px-1.5 py-0">
                                    Hiện tại
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span>
                                {session.location}, Việt Nam • {session.ip}
                                {session.isCurrent
                                    ? " • Đang hoạt động"
                                    : ` • ${session.time.split(",")[1]?.trim() || session.time}`
                                }
                            </span>
                        </div>
                    </div>

                    {/* Action */}
                    {!session.isCurrent && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-red-500"
                            title="Đăng xuất thiết bị này"
                        >
                            <LogOut className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            ))}
        </div>
    )
}
