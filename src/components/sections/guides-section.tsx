"use client"

import { BookOpen, Shield, Eye, Phone, CreditCard, Users, Lock, MessageSquare } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const guides = [
  {
    icon: Eye,
    title: "Nhận biết website giả mạo",
    description:
      "Học cách phân biệt website thật và website giả mạo qua domain, chứng chỉ SSL, và các dấu hiệu khác.",
    tips: ["Kiểm tra chính tả domain", "Tìm biểu tượng khóa SSL", "Xem xét thiết kế trang web"],
  },
  {
    icon: MessageSquare,
    title: "Phòng tránh lừa đảo qua tin nhắn",
    description:
      "Hướng dẫn xử lý tin nhắn đáng ngờ từ người lạ hoặc giả mạo ngân hàng, công ty.",
    tips: ["Không click link trong tin nhắn lạ", "Xác minh qua kênh chính thức", "Không chia sẻ OTP"],
  },
  {
    icon: CreditCard,
    title: "Bảo vệ thông tin tài chính",
    description:
      "Cách bảo vệ thông tin thẻ ngân hàng và tài khoản khỏi bị đánh cắp.",
    tips: ["Không chia sẻ mã PIN", "Dùng mật khẩu mạnh", "Bật thông báo giao dịch"],
  },
  {
    icon: Users,
    title: "An toàn trên mạng xã hội",
    description:
      "Hướng dẫn sử dụng mạng xã hội an toàn, tránh bị lừa đảo tình cảm và các chiêu trò khác.",
    tips: ["Kiểm tra tài khoản giả mạo", "Hạn chế chia sẻ thông tin cá nhân", "Cẩn thận với người lạ"],
  },
  {
    icon: Phone,
    title: "Xử lý cuộc gọi lừa đảo",
    description:
      "Cách nhận biết và xử lý các cuộc gọi giả mạo từ công an, ngân hàng hoặc cơ quan nhà nước.",
    tips: ["Cơ quan không gọi yêu cầu chuyển tiền", "Ghi lại số điện thoại", "Báo cáo cho cơ quan chức năng"],
  },
  {
    icon: Lock,
    title: "Bảo mật tài khoản trực tuyến",
    description:
      "Hướng dẫn thiết lập bảo mật 2 lớp và các biện pháp bảo vệ tài khoản.",
    tips: ["Bật xác thực 2 yếu tố", "Dùng mật khẩu khác nhau", "Cập nhật thông tin bảo mật"],
  },
]

export function GuidesSection() {
  return (
    <section id="huong-dan" className="bg-secondary py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Hướng dẫn phòng tránh lừa đảo
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Trang bị kiến thức cần thiết để bạn và người thân có thể nhận biết và phòng tránh các chiêu trò lừa đảo.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <Card
              key={guide.title}
              className="group cursor-pointer transition-all hover:shadow-lg hover:shadow-primary/5"
            >
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <guide.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{guide.title}</CardTitle>
                <CardDescription>{guide.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {guide.tips.map((tip, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
