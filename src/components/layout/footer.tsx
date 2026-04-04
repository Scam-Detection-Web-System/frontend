import { Link } from "react-router-dom"
import { Facebook, Mail, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full border-t border-primary-foreground/10 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src="/logo.svg"
                alt="AnTiScaQ logo"
                className="h-9 w-9 invert"
              />
              <span className="text-xl font-bold text-primary-foreground">AnTiScaQ</span>
            </Link>
            <p className="mt-4 text-sm text-primary-foreground/70">
              Trang web cộng đồng giúp người Việt Nam nhận biết và phòng tránh các chiêu trò lừa đảo trực tuyến.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-primary-foreground">Tính năng</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  to="/kiemtra"
                  className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                >
                  Kiểm tra SĐT
                </Link>
              </li>
              <li>
                <Link
                  to="/baocao"
                  className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                >
                  Báo cáo Lừa đảo
                </Link>
              </li>
              <li>
                <Link
                  to="/tintuc"
                  className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                >
                  Tin tức
                </Link>
              </li>
              <li>
                <Link
                  to="/huongdan"
                  className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                >
                  Hướng dẫn
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-primary-foreground">Liên hệ</h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <Mail className="h-4 w-4" />
                contact@antiscaq.vn
              </li>
              <li className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <Phone className="h-4 w-4" />
                1900-xxxx-xxx
              </li>
              <li className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <Facebook className="h-4 w-4" />
                facebook.com/antiscaq
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-primary-foreground">Hỗ trợ</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  to="#"
                  className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                >
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                >
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                >
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                >
                  Góp ý phản hồi
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-primary-foreground/10 pt-8">
          <p className="text-center text-sm text-primary-foreground/60">
            &copy; 2026 AnTiScaQ. Tất cả quyền được bảo lưu. Xây dựng vì cộng đồng Việt Nam an toàn hơn.
          </p>
        </div>
      </div>
    </footer>
  )
}
