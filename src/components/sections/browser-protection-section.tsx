"use client"

import {
    Globe,
    ShieldCheck,
    Monitor,
    ChevronLeft,
    ChevronRight,
    Chrome,
    Shield,
    Bug,
    Wifi,
    Download,
} from "lucide-react"
import { useState } from "react"

const browsers = [
    { name: "Microsoft Edge", icon: Globe },
    { name: "Google Chrome", icon: Chrome },
    { name: "Opera", icon: Globe },
    { name: "Brave", icon: Shield },
    { name: "Firefox", icon: Globe },
    { name: "Cốc Cốc", icon: Globe },
]

const integrations = [
    { name: "OpenDNS", icon: Wifi },
    { name: "NextDNS", icon: Wifi },
    { name: "Phần mềm diệt virus", icon: Bug },
]

export function BrowserProtectionSection() {
    const [activeSlide, setActiveSlide] = useState(0)

    const slides = [
        {
            icon: Globe,
            title: "Bảo vệ trình duyệt",
            description:
                "Chặn tự động các website lừa đảo, phishing và mã độc khi bạn duyệt web.",
        },
        {
            icon: Monitor,
            title: "Bảo vệ thiết bị",
            description:
                "Tích hợp với phần mềm diệt virus để bảo vệ toàn diện thiết bị của bạn.",
        },
        {
            icon: Wifi,
            title: "Bảo vệ mạng",
            description:
                "Tích hợp DNS bảo mật để chặn truy cập vào các trang web nguy hiểm từ cấp mạng.",
        },
    ]

    const nextSlide = () => setActiveSlide((prev) => (prev + 1) % slides.length)
    const prevSlide = () =>
        setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length)

    return (
        <section className="py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    {/* Left side – text content */}
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-widest text-primary dark:text-primary">
                            Tiện ích miễn phí
                        </p>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                            An toàn{" "}
                            <span className="text-primary">
                                trong tầm tay
                            </span>
                        </h2>

                        <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
                            Cốt lõi của hệ thống danh sách chặn AntiScam VN là bảo vệ người
                            dùng Internet một cách tự động và âm thầm khi bạn sử dụng các
                            trình duyệt sau:{" "}
                            <span className="font-medium text-foreground">
                                Microsoft Edge, Chrome, Opera, Brave, Firefox và Cốc Cốc
                            </span>
                            . Ngoài ra, dữ liệu danh sách chặn của chúng tôi được tích hợp
                            vào{" "}
                            <span className="font-medium text-foreground">
                                OpenDNS, NextDNS
                            </span>{" "}
                            và nhiều nhà cung cấp phần mềm diệt virus phổ biến.
                        </p>

                        {/* Supported browsers */}
                        <div className="mt-8">
                            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Trình duyệt hỗ trợ
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {browsers.map((b) => (
                                    <div
                                        key={b.name}
                                        className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent"
                                    >
                                        <b.icon className="h-4 w-4 text-primary" />
                                        {b.name}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Integrations */}
                        <div className="mt-6">
                            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Tích hợp với
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {integrations.map((i) => (
                                    <div
                                        key={i.name}
                                        className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent"
                                    >
                                        <i.icon className="h-4 w-4 text-primary" />
                                        {i.name}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Download button */}
                        <div className="mt-8">
                            <a
                                href="https://chromewebstore.google.com/detail/antiscaq/dfjakhhnfjfidbbepniaklmjbgeamikm?hl=en-US&utm_source=ext_sidebar"
                                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-opacity hover:opacity-90"
                            >
                                <Download className="h-4 w-4" />
                                Tải tiện ích miễn phí
                            </a>
                        </div>
                    </div>

                    {/* Right side – illustration/slider card */}
                    <div className="relative flex items-center justify-center">
                        {/* Background decorative ring */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-72 w-72 rounded-full border border-primary/20 sm:h-80 sm:w-80 lg:h-96 lg:w-96" />
                            <div className="absolute h-56 w-56 rounded-full border border-primary/10 sm:h-64 sm:w-64 lg:h-80 lg:w-80" />
                        </div>

                        {/* Slider card */}
                        <div className="relative w-full max-w-sm">
                            <div className="overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-lg shadow-primary/5">
                                <div className="flex flex-col items-center text-center">
                                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
                                        {(() => {
                                            const Icon = slides[activeSlide].icon
                                            return <Icon className="h-10 w-10" />
                                        })()}
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground">
                                        {slides[activeSlide].title}
                                    </h3>
                                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                        {slides[activeSlide].description}
                                    </p>
                                </div>

                                {/* Dots indicator */}
                                <div className="mt-6 flex items-center justify-center gap-2">
                                    {slides.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveSlide(idx)}
                                            className={`h-2 rounded-full transition-all ${idx === activeSlide
                                                ? "w-6 bg-primary"
                                                : "w-2 bg-muted-foreground/30"
                                                }`}
                                            aria-label={`Slide ${idx + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Navigation arrows */}
                            <button
                                onClick={prevSlide}
                                className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition-colors hover:bg-accent"
                                aria-label="Previous slide"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition-colors hover:bg-accent"
                                aria-label="Next slide"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>

                            {/* Verified badge */}
                            <div className="absolute -right-2 -top-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
