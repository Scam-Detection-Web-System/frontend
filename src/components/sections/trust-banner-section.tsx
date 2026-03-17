import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

export function TrustBannerSection() {
    return (
        <section className="py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    {/* Left – headline */}
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                            Báo chí &amp; Truyền thông đánh giá
                        </p>
                        <h2 className="mt-3 text-3xl font-extrabold uppercase leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                            Nguồn tin cậy hàng đầu
                        </h2>
                        <h2 className="text-3xl font-extrabold uppercase leading-tight tracking-tight text-primary sm:text-4xl lg:text-5xl">
                            Chống lừa đảo trực tuyến
                        </h2>
                    </div>

                    {/* Right – description + CTA */}
                    <div className="flex flex-col items-start gap-6">
                        <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                            AntiScam VN tự hào được các kênh truyền thông uy tín trong và
                            ngoài nước thường xuyên đề cập như một nguồn thông tin đáng tin
                            cậy về tình hình lừa đảo, giả mạo, mạo danh và tội phạm mạng tại
                            Việt Nam. Chúng tôi không ngừng cung cấp kiến thức thiết thực giúp
                            người dùng tự bảo vệ mình trong thế giới số ngày càng phức tạp.
                        </p>

                        <Link
                            to="/tintuc"
                            className="inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:opacity-90 hover:gap-4 active:scale-95"
                        >
                            Tìm hiểu thêm
                            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
