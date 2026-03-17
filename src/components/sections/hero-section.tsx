"use client"

import { Shield, AlertTriangle, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PhoneChecker } from "@/components/sections/phone-checker"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-primary py-20 sm:py-28 lg:py-32">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 opacity-20">
        <Shield className="h-96 w-96 text-primary-foreground" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <span className="text-sm font-medium text-primary-foreground">
              Cảnh báo: Lừa đảo trực tuyến đang gia tăng!
            </span>
          </div>

          <h1 className="text-balance text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
            Bảo vệ bạn khỏi{" "}
            <span className="text-accent">lừa đảo trực tuyến</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-primary-foreground/80 sm:text-xl">
            Kiểm tra số điện thoại đáng ngờ, báo cáo các vụ lừa đảo, và nhận thông tin cảnh báo mới nhất để bảo vệ bạn và người thân.
          </p>

          {/* Phone search bar */}
          <PhoneChecker variant="hero" />

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto"
              asChild
            >
              <a href="/kiemtra">
                <Phone className="mr-2 h-5 w-5" />
                Kiểm tra SĐT ngay
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 sm:w-auto"
              asChild
            >
              <a href="/baocao">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Báo cáo Lừa đảo
              </a>
            </Button>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            { number: "10,000+", label: "SĐT đã được kiểm tra" },
            { number: "500+", label: "Báo cáo lừa đảo" },
            { number: "50,000+", label: "Người dùng đã bảo vệ" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-6 text-center backdrop-blur"
            >
              <p className="text-3xl font-bold text-primary-foreground sm:text-4xl">
                {stat.number}
              </p>
              <p className="mt-2 text-sm text-primary-foreground/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
