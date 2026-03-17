"use client"

import { useState, useCallback } from "react"
import { ChevronLeft, ChevronRight, Globe, AlertTriangle, ShieldAlert, Phone, Lock, Bell } from "lucide-react"

const features = [
    {
        icon: Globe,
        title: "Duyệt web an toàn",
        description:
            "Nắm bắt các mối đe dọa tiềm ẩn và bảo vệ an toàn của bạn trực tuyến trong khi duyệt web.",
        url: "antiscam.vn",
    },
    {
        icon: AlertTriangle,
        title: "Màn hình cảnh báo",
        description:
            "Hiển thị cảnh báo rõ ràng khi bạn truy cập vào các trang web có dấu hiệu lừa đảo.",
        url: "canh-bao.vn",
    },
    {
        icon: ShieldAlert,
        title: "Chặn trang độc hại",
        description:
            "Tự động chặn các trang web phishing, mã độc và lừa đảo trước khi chúng gây hại.",
        url: "block.antiscam.vn",
    },
    {
        icon: Phone,
        title: "Kiểm tra số điện thoại",
        description:
            "Tra cứu ngay số điện thoại đáng ngờ ngay từ trình duyệt mà không cần mở trang web.",
        url: "sdt.antiscam.vn",
    },
    {
        icon: Lock,
        title: "Bảo vệ thông tin cá nhân",
        description:
            "Ngăn chặn các trang web thu thập trái phép thông tin cá nhân của bạn.",
        url: "privacy.antiscam.vn",
    },
    {
        icon: Bell,
        title: "Thông báo thời gian thực",
        description:
            "Nhận cảnh báo tức thì khi phát hiện mối nguy hiểm trong quá trình duyệt web.",
        url: "alert.antiscam.vn",
    },
]

export function FeaturesShowcaseSection() {
    const [activeIndex, setActiveIndex] = useState(0)
    // "left" | "right" | null — direction of the last transition
    const [direction, setDirection] = useState<"left" | "right" | null>(null)
    const [animKey, setAnimKey] = useState(0)

    const goTo = useCallback((nextIndex: number, dir: "left" | "right") => {
        setDirection(dir)
        setAnimKey((k) => k + 1)
        setActiveIndex(nextIndex)
    }, [])

    const prev = () => goTo((activeIndex - 1 + features.length) % features.length, "right")
    const next = () => goTo((activeIndex + 1) % features.length, "left")

    const leftIdx = (activeIndex - 1 + features.length) % features.length
    const centerIdx = activeIndex
    const rightIdx = (activeIndex + 1) % features.length

    const ActiveIcon = features[centerIdx].icon

    // CSS animation name based on direction
    const slideAnim = direction === "left"
        ? "slide-in-from-right"
        : direction === "right"
            ? "slide-in-from-left"
            : ""

    return (
        <section className="bg-secondary py-16 sm:py-20 lg:py-24">
            {/* Keyframe definitions injected via a <style> tag */}
            <style>{`
                @keyframes slide-in-from-right {
                    from { opacity: 0; transform: translateX(40px) scale(0.97); }
                    to   { opacity: 1; transform: translateX(0)   scale(1);    }
                }
                @keyframes slide-in-from-left {
                    from { opacity: 0; transform: translateX(-40px) scale(0.97); }
                    to   { opacity: 1; transform: translateX(0)      scale(1);   }
                }
                .slide-in-from-right { animation: slide-in-from-right 0.38s cubic-bezier(0.22,1,0.36,1) both; }
                .slide-in-from-left  { animation: slide-in-from-left  0.38s cubic-bezier(0.22,1,0.36,1) both; }

                @keyframes fade-in-ghost {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                .fade-in-ghost { animation: fade-in-ghost 0.3s ease both; }
            `}</style>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center">
                    <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                        Chức năng
                    </p>
                    <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                        Một tiện ích
                    </h2>
                    <h2 className="text-3xl font-extrabold tracking-tight text-primary sm:text-4xl lg:text-5xl">
                        Nhiều chức năng
                    </h2>
                </div>

                {/* Laptop mockup + carousel */}
                <div className="relative mt-12 flex items-center justify-center gap-4 sm:gap-6">
                    {/* Prev arrow */}
                    <button
                        onClick={prev}
                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition-all duration-200 hover:scale-110 hover:bg-accent active:scale-95"
                        aria-label="Previous feature"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>

                    {/* Left ghost card */}
                    <div
                        key={`left-${animKey}`}
                        className="fade-in-ghost hidden cursor-pointer rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md sm:block sm:w-36 lg:w-48"
                        onClick={prev}
                    >
                        <p className="text-center text-sm font-semibold text-muted-foreground">
                            {features[leftIdx].title}
                        </p>
                    </div>

                    {/* Center – laptop mockup */}
                    <div className="flex flex-col items-center">
                        {/* Laptop screen */}
                        <div className="relative w-full max-w-md rounded-t-2xl border-4 border-border bg-card p-4 shadow-xl sm:max-w-lg">
                            {/* Browser URL bar — smooth text swap */}
                            <div className="mb-3 flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5">
                                <div className="flex gap-1.5">
                                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                                </div>
                                <div className="flex flex-1 items-center justify-between rounded-md bg-card px-3 py-1 text-xs text-muted-foreground">
                                    <span
                                        key={`url-${animKey}`}
                                        className={slideAnim}
                                    >
                                        {features[centerIdx].url}
                                    </span>
                                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                        <ShieldAlert className="h-2.5 w-2.5" />
                                    </div>
                                </div>
                            </div>

                            {/* Feature card inside screen — animated */}
                            <div
                                key={`card-${animKey}`}
                                className={`flex flex-col items-center rounded-xl border border-border bg-background px-6 py-8 text-center shadow-sm ${slideAnim}`}
                            >
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform duration-300">
                                    <ActiveIcon className="h-8 w-8" />
                                </div>
                                <h3 className="text-lg font-bold text-foreground">
                                    {features[centerIdx].title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                    {features[centerIdx].description}
                                </p>
                            </div>
                        </div>

                        {/* Laptop base */}
                        <div className="h-3 w-full max-w-md rounded-b-lg bg-border sm:max-w-lg" />
                        <div className="h-2 w-24 rounded-b-xl bg-muted" />

                        {/* Dots */}
                        <div className="mt-5 flex items-center gap-2">
                            {features.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        const dir = idx > centerIdx ? "left" : "right"
                                        goTo(idx, dir)
                                    }}
                                    className={`h-2 rounded-full transition-all duration-300 ${idx === centerIdx
                                        ? "w-6 bg-primary"
                                        : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                                        }`}
                                    aria-label={`Feature ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right ghost card */}
                    <div
                        key={`right-${animKey}`}
                        className="fade-in-ghost hidden cursor-pointer rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md sm:block sm:w-36 lg:w-48"
                        onClick={next}
                    >
                        <p className="text-center text-sm font-semibold text-muted-foreground">
                            {features[rightIdx].title}
                        </p>
                    </div>

                    {/* Next arrow */}
                    <button
                        onClick={next}
                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition-all duration-200 hover:scale-110 hover:bg-accent active:scale-95"
                        aria-label="Next feature"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </section>
    )
}
