"use client"

import { useEffect, useState } from "react"
import { ShieldCheck } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function LogoutOverlay() {
    const { isLoggingOut } = useAuth()
    const [visible, setVisible] = useState(false)
    const [show, setShow] = useState(false)

    useEffect(() => {
        if (isLoggingOut) {
            setVisible(true)
            // Trigger the animation after mount
            requestAnimationFrame(() => setShow(true))
        } else {
            setShow(false)
            const t = setTimeout(() => setVisible(false), 400)
            return () => clearTimeout(t)
        }
    }, [isLoggingOut])

    if (!visible) return null

    return (
        <div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
            style={{
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                background: "rgba(0, 0, 0, 0.55)",
                opacity: show ? 1 : 0,
                transition: "opacity 0.35s ease",
            }}
        >
            {/* Animated shield icon */}
            <div
                style={{
                    transform: show ? "scale(1) translateY(0)" : "scale(0.6) translateY(20px)",
                    opacity: show ? 1 : 0,
                    transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.35s ease",
                }}
                className="flex flex-col items-center gap-6"
            >
                {/* Shield with spinner ring */}
                <div className="relative flex items-center justify-center">
                    {/* Pulsing outer ring */}
                    <div
                        className="absolute h-32 w-32 rounded-full border-2 border-primary/40"
                        style={{
                            animation: "ping 1.4s cubic-bezier(0,0,0.2,1) infinite",
                        }}
                    />
                    {/* Rotating dashed ring */}
                    <div
                        className="absolute h-24 w-24 rounded-full border-4 border-t-primary border-r-primary/40 border-b-primary/20 border-l-transparent"
                        style={{ animation: "spin 1s linear infinite" }}
                    />
                    {/* Shield icon */}
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary shadow-2xl shadow-primary/40">
                        <ShieldCheck className="h-10 w-10 text-primary-foreground" />
                    </div>
                </div>

                {/* Text */}
                <div className="text-center">
                    <p className="text-xl font-semibold text-white tracking-wide">
                        Đang đăng xuất...
                    </p>
                    <p className="mt-1 text-sm text-white/60">
                        Phiên làm việc của bạn đã được bảo vệ an toàn
                    </p>
                </div>

                {/* Dot loader */}
                <div className="flex gap-2">
                    {[0, 1, 2].map(i => (
                        <span
                            key={i}
                            className="h-2 w-2 rounded-full bg-primary"
                            style={{
                                animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Keyframe styles injected inline */}
            <style>{`
                @keyframes ping {
                    75%, 100% { transform: scale(1.8); opacity: 0; }
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                @keyframes bounce {
                    0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
                    40% { transform: translateY(-10px); opacity: 1; }
                }
            `}</style>
        </div>
    )
}
