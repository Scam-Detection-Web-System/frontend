import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Clock, AlertTriangle, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export const newsArticles = [
  {
    id: 1,
    title: "Cảnh báo: Chiêu trò lừa đảo mới qua tin nhắn Zalo",
    excerpt:
      "Xuất hiện chiêu trò lừa đảo mới giả danh ngân hàng gửi tin nhắn qua Zalo yêu cầu cập nhật thông tin tài khoản...",
    date: "28/01/2026",
    category: "Cảnh báo mới",
    isUrgent: true,
    content: `
Gần đây, lực lượng công an đã ghi nhận nhiều trường hợp người dân bị mất tiền do sập bẫy chiêu trò lừa đảo qua ứng dụng nhắn tin Zalo. Kẻ xấu giả danh nhân viên ngân hàng, gửi đường dẫn giả mạo và yêu cầu nạn nhân "cập nhật thông tin tài khoản" để chiếm đoạt tài sản.

**Cách thức hoạt động:**
- Kẻ lừa đảo tạo tài khoản Zalo giả mạo logo, tên các ngân hàng lớn (Vietcombank, BIDV, Agribank…).
- Gửi tin nhắn hàng loạt đến người dùng với nội dung như: *"Tài khoản của bạn có dấu hiệu bất thường, vui lòng xác minh ngay để tránh bị khóa."*
- Đính kèm đường link dẫn đến website giả mạo giao diện ngân hàng, thu thập thông tin đăng nhập và OTP.

**Dấu hiệu nhận biết:**
1. Tin nhắn đến từ tài khoản Zalo cá nhân, không có biểu tượng xác thực của tổ chức.
2. Đường link có tên miền lạ, không phải domain chính thức của ngân hàng.
3. Yêu cầu nhập OTP hoặc mã xác thực qua điện thoại.
4. Ngôn ngữ ép buộc, tạo ra cảm giác khẩn cấp.

**Biện pháp phòng tránh:**
- Không nhấp vào các đường link lạ được gửi qua Zalo, kể cả từ tài khoản trông có vẻ chính thức.
- Chủ động liên hệ hotline ngân hàng để xác nhận thông tin.
- Bật xác thực hai yếu tố (2FA) cho tài khoản ngân hàng và ví điện tử.
- Báo cáo tài khoản giả mạo cho cơ quan chức năng hoặc trực tiếp trên nền tảng Zalo.

Nếu bạn đã bấm vào đường link hoặc cung cấp thông tin, hãy ngay lập tức liên hệ ngân hàng để khóa tài khoản và trình báo công an địa phương.
    `.trim(),
  },
  {
    id: 2,
    title: "Lừa đảo đầu tư tiền ảo: Thiệt hại hàng tỷ đồng",
    excerpt:
      "Nhiều nạn nhân đã mất tiền khi tham gia các sàn giao dịch tiền ảo lừa đảo với lời hứa lợi nhuận cao...",
    date: "25/01/2026",
    category: "Đầu tư",
    isUrgent: false,
    content: `
Trong thời gian gần đây, cơ quan điều tra đã triệt phá nhiều đường dây lừa đảo đầu tư tiền ảo, gây thiệt hại lên đến hàng chục tỷ đồng cho hàng trăm nạn nhân trên cả nước.

**Phương thức lừa đảo phổ biến:**
- Tiếp cận nạn nhân qua mạng xã hội (Facebook, Telegram, Zalo) với lời hứa đầu tư tiền ảo siêu lợi nhuận, cam kết lãi suất từ 20-50%/tháng.
- Cho phép rút tiền và lãi ở các lần đầu để tạo lòng tin, sau đó thúc đẩy nạn nhân nạp số tiền lớn hơn.
- Đột ngột đóng băng tài khoản hoặc biến mất sau khi thu gom đủ tiền.

**Các hình thức phổ biến:**
1. **Sàn giao dịch ảo**: Nền tảng tự xây dựng, không có giấy phép, thao túng giá tùy ý.
2. **Ponzi "tiền ảo"**: Dùng tiền người sau trả người trước.
3. **Copy trading giả**: Tự xưng là chuyên gia, nhận tiền chạy lệnh nhưng thực tế không giao dịch.

**Lời khuyên:**
- Không đầu tư vào các sàn không có giấy phép của cơ quan tài chính Việt Nam hoặc quốc tế uy tín.
- Tránh xa lời hứa lợi nhuận cố định, đặc biệt ở mức bất thường cao.
- Tham khảo danh sách sàn uy tín từ Ủy ban Chứng khoán Nhà nước trước khi đầu tư.
    `.trim(),
  },
  {
    id: 3,
    title: "Website giả mạo thương hiệu lớn để lừa khách hàng",
    excerpt:
      "Phát hiện hàng loạt website giả mạo các thương hiệu lớn như Shopee, Lazada để lừa đảo người mua hàng...",
    date: "22/01/2026",
    category: "Mua sắm",
    isUrgent: true,
    content: `
Cục An toàn thông tin (Bộ TT&TT) vừa phát đi cảnh báo về làn sóng website giả mạo các thương hiệu thương mại điện tử lớn như Shopee, Lazada, Tiki nhằm mục đích lừa đảo người tiêu dùng.

**Cách nhận biết website giả mạo:**
- Tên miền sai lệch nhỏ: ví dụ "shopee-vn.com", "lazaada.net" thay vì domain chính thức.
- Giao diện sao chép y hệt trang thật nhưng thiếu chứng chỉ SSL (không có khóa xanh hoặc "https" trên thanh địa chỉ).
- Giá sản phẩm rất thấp bất thường để thu hút mua sắm.
- Không có chính sách đổi trả hoặc chăm sóc khách hàng rõ ràng.

**Hậu quả khi sập bẫy:**
- Mất tiền mà không nhận được hàng.
- Thông tin thẻ ngân hàng bị đánh cắp.
- Dữ liệu cá nhân bị rao bán trên dark web.

**Biện pháp an toàn:**
1. Luôn truy cập trực tiếp qua app chính thức hoặc gõ tay địa chỉ trang web đã biết.
2. Kiểm tra thanh địa chỉ và chứng chỉ bảo mật trước khi thanh toán.
3. Không click vào quảng cáo mua sắm trên mạng xã hội mà không kiểm tra nguồn gốc.
4. Sử dụng thẻ thanh toán ảo (virtual card) để giới hạn rủi ro.
    `.trim(),
  },
  {
    id: 4,
    title: "Lừa đảo việc làm online: Cẩn trọng trước lời hứa thu nhập cao",
    excerpt:
      "Nhiều người đã bị lừa khi tìm việc làm online với các lời hứa thu nhập hấp dẫn nhưng thực chất là lừa đảo...",
    date: "20/01/2026",
    category: "Việc làm",
    isUrgent: false,
    content: `
Trong bối cảnh làm việc từ xa ngày càng phổ biến, các đối tượng lừa đảo đã lợi dụng nhu cầu tìm việc để dụ dỗ người lao động sa vào bẫy việc làm online giả mạo.

**Các hình thức lừa đảo việc làm online:**
- **Đánh giá sản phẩm ảo**: Yêu cầu đặt cọc tiền mua hàng trước, hứa hoàn tiền kèm hoa hồng nhưng sau đó "biến mất".
- **Gõ captcha/click quảng cáo**: Cam kết trả tiền theo tác vụ nhỏ, ban đầu trả đúng một vài lần rồi yêu cầu nạp tiền để "nâng cấp" tài khoản.
- **Cộng tác viên giả**: Hứa hoa hồng hấp dẫn khi giới thiệu người khác, vận hành theo mô hình đa cấp không được cấp phép.

**Dấu hiệu cảnh báo:**
1. Tuyển dụng qua Zalo, Telegram, không có hợp đồng lao động.
2. Yêu cầu nạp tiền để "kích hoạt" hoặc "mua nhiệm vụ".
3. Thu nhập cam kết quá cao so với công việc thực tế (vài triệu/ngày chỉ bằng điện thoại).
4. Áp lực tuyển thêm thành viên để hưởng hoa hồng.

**Lời khuyên:**
- Chỉ tìm việc qua các nền tảng uy tín có đăng ký với Bộ Lao động.
- Không bao giờ nộp tiền để "nhận việc".
- Đọc kỹ hợp đồng và xác minh thông tin công ty trước khi ký kết.
    `.trim(),
  },
  {
    id: 5,
    title: "Cách nhận biết email phishing giả mạo ngân hàng",
    excerpt:
      "Hướng dẫn chi tiết cách nhận biết và phòng tránh các email phishing giả mạo từ ngân hàng và tổ chức tài chính...",
    date: "18/01/2026",
    category: "Hướng dẫn",
    isUrgent: false,
    content: `
Email phishing (lừa đảo qua email) vẫn là một trong những hình thức tấn công mạng phổ biến và nguy hiểm nhất. Kẻ tấn công giả mạo email từ ngân hàng, tổ chức tài chính để đánh cắp thông tin đăng nhập và tài sản của bạn.

**Cách nhận biết email phishing:**

**1. Kiểm tra địa chỉ email người gửi**
Email chính thức của ngân hàng luôn có domain riêng (ví dụ: @vietcombank.com.vn). Hãy nhìn kỹ, tránh nhầm lẫn với @vietcombank.support.com hay @vietcombank-vn.net.

**2. Kiểm tra đường link trong email**
Đưa chuột qua link (không click) để xem địa chỉ thật hiển thị ở góc dưới trình duyệt. Nếu khác với tên ngân hàng, đó là phishing.

**3. Nội dung tạo áp lực khẩn cấp**
Các email như "Tài khoản của bạn sẽ bị khóa trong 24 giờ" hoặc "Xác minh ngay để nhận ưu đãi" thường là dấu hiệu lừa đảo.

**4. Lỗi chính tả và ngữ pháp**
Email từ tổ chức chuyên nghiệp thường không có lỗi chính tả. Nếu email chứa nhiều lỗi ngữ pháp, hãy cẩn thận.

**Biện pháp phòng tránh:**
- Không click vào link trong email, hãy truy cập trực tiếp website ngân hàng.
- Bật xác thực hai yếu tố cho tài khoản email.
- Cài đặt phần mềm diệt virus với tính năng chặn phishing.
- Báo cáo email đáng ngờ cho ngân hàng và nhà cung cấp email.
    `.trim(),
  },
  {
    id: 6,
    title: "Lừa đảo tình cảm qua mạng xã hội ngày càng tinh vi",
    excerpt:
      "Các đối tượng lừa đảo sử dụng mạng xã hội để làm quen, tạo lòng tin rồi lừa tiền nạn nhân...",
    date: "15/01/2026",
    category: "Tình cảm",
    isUrgent: false,
    content: `
Lừa đảo tình cảm (romance scam) qua mạng xã hội đang ngày càng gia tăng với thủ đoạn tinh vi hơn, gây thiệt hại cả về tài chính lẫn tinh thần cho nhiều nạn nhân.

**Cách thức hoạt động:**
Kẻ lừa đảo thường tạo hồ sơ giả với ảnh đẹp (thường là ảnh của người nổi tiếng hoặc được tổng hợp bởi AI), tự xưng là chuyên gia nước ngoài (bác sĩ, kỹ sư, quân nhân…) đang công tác xa nhà.

**Các giai đoạn:**
1. **Tiếp cận & xây dựng lòng tin** (vài tuần đến vài tháng): Nhắn tin liên tục, quan tâm, chia sẻ câu chuyện cảm động.
2. **Tạo khủng hoảng giả**: Bệnh đột ngột, tai nạn, khoản tiền bị phong tỏa… cần nạn nhân hỗ trợ tài chính.
3. **Leo thang yêu cầu**: Khi nạn nhân đã chuyển tiền lần đầu, tiếp tục đặt ra các tình huống khẩn cấp mới.

**Dấu hiệu nhận biết:**
- Người lạ tiếp cận chủ động, tình cảm nồng nhiệt bất thường.
- Hồ sơ mạng xã hội mới tạo, ít bạn bè, ảnh đẹp hoàn hảo.
- Luôn có lý do để không video call hoặc gặp mặt trực tiếp.
- Sớm đề cập đến vấn đề tiền bạc.

**Biện pháp tự bảo vệ:**
- Tìm kiếm ảnh đại diện trên Google ngay khi làm quen với người lạ.
- Không chuyển tiền cho người chưa gặp mặt trực tiếp dù bất cứ lý do gì.
- Thảo luận với người thân trước khi đưa ra quyết định tài chính lớn.
- Báo cáo tài khoản giả mạo cho nền tảng và cơ quan chức năng.
    `.trim(),
  },
]

export default function NewsDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const article = newsArticles.find((a) => a.id === Number(id))

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">Không tìm thấy bài viết</h2>
        <p className="text-muted-foreground mb-8">Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <Button onClick={() => navigate("/tintuc")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại trang tin tức
        </Button>
      </div>
    )
  }

  // Convert markdown-like bold (**text**) to JSX
  const renderContent = (text: string) => {
    return text.split("\n").map((line, index) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <p key={index} className="font-semibold text-foreground mt-5 mb-1">
            {line.replace(/\*\*/g, "")}
          </p>
        )
      }
      if (line.match(/^\d+\./)) {
        return (
          <li key={index} className="ml-5 mt-1 text-muted-foreground list-decimal">
            {line.replace(/^\d+\.\s*/, "").replace(/\*\*(.*?)\*\*/g, "$1")}
          </li>
        )
      }
      if (line.startsWith("- ")) {
        return (
          <li key={index} className="ml-5 mt-1 text-muted-foreground list-disc">
            {line.replace(/^- /, "").replace(/\*\*(.*?)\*\*/g, "$1")}
          </li>
        )
      }
      if (line.trim() === "") {
        return <div key={index} className="h-2" />
      }
      return (
        <p key={index} className="text-muted-foreground leading-relaxed">
          {line.replace(/\*\*(.*?)\*\*/g, "$1")}
        </p>
      )
    })
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Back button */}
      <Button
        variant="ghost"
        onClick={() => navigate("/tintuc")}
        className="mb-8 -ml-2 flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại tin tức
      </Button>

      {/* Article header */}
      <article>
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge
              variant={article.isUrgent ? "destructive" : "secondary"}
              className="flex items-center gap-1"
            >
              {article.isUrgent && <AlertTriangle className="h-3 w-3" />}
              {article.category}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {article.date}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Tag className="h-4 w-4" />
              Tin tức & Cảnh báo
            </div>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl leading-snug">
            {article.title}
          </h1>

          <p className="mt-4 text-lg text-muted-foreground border-l-4 border-primary pl-4 italic">
            {article.excerpt}
          </p>
        </header>

        {/* Divider */}
        <hr className="border-border mb-8" />

        {/* Article body */}
        <div className="prose-equivalent space-y-1">
          {renderContent(article.content)}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Nguồn: Ban biên tập An toàn mạng • {article.date}
          </p>
          <Button variant="outline" onClick={() => navigate("/tintuc")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Xem tất cả tin tức
          </Button>
        </div>
      </article>
    </div>
  )
}
