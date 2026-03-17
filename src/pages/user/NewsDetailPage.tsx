import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Clock, AlertTriangle, Tag, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export const newsArticles = [
  {
    id: 1,
    title: "Cách nhận biết và phòng chống các chiêu thức lừa đảo tài chính phổ biến",
    excerpt:
      "Tìm hiểu về các hình thức lừa đảo tài chính phổ biến và cách bảo vệ bản thân khỏi những kẻ lừa đảo chiếm đoạt tiền bạc.",
    date: "17/03/2026",
    category: "Cảnh báo mới",
    isUrgent: true,
    source: "trangtrang.com",
    content: [
      {
        heading: "Các hình thức lừa đảo tài chính phổ biến hiện nay",
        paragraphs: [
          "Lừa đảo liên quan đến vay nợ và đáo hạn ngân hàng là một trong những hình thức phổ biến nhất. Những đối tượng xấu thường lợi dụng tình cảnh khó khăn về tài chính của những người xung quanh, sau đó vay tiền với lý do cần đáo hạn nợ ngân hàng. Chúng tạo ra những cái cớ chính đáng để lấy được sự tin tưởng từ nạn nhân.",
          "Một đặc điểm chung của các vụ lừa đảo này là:",
        ],
        bullets: [
          "Tạo ra các thông tin gian dối về nhu cầu tài chính, như nhu cầu đáo hạn ngân hàng hoặc cần vốn kinh doanh",
          "Chiếm đoạt số tiền lớn từ nhiều người khác nhau trong thời gian dài",
          "Sử dụng tiền chiếm đoạt để trả cho các khoản nợ cũ hoặc chi tiêu cá nhân thay vì mục đích ban đầu",
          "Né tránh trách nhiệm khi bị đòi tiền bằng cách thái độ xấu hoặc vô trách nhiệm",
        ],
      },
      {
        heading: "Dấu hiệu cảnh báo để nhận biết kẻ lừa đảo",
        paragraphs: ["Để bảo vệ bản thân, bạn cần chú ý đến những dấu hiệu cảnh báo sau:"],
        bullets: [
          "Yêu cầu vay tiền với lý do mơ hồ — nếu ai đó liên tục yêu cầu vay tiền với những lý do chung chung hoặc hay thay đổi lý do, đây là tín hiệu đáng nghi",
          "Cam kết hoàn trả mơ hồ — các đối tượng lừa đảo thường không cam kết rõ ràng về thời gian và cách thức hoàn trả tiền",
          "Sử dụng mối quan hệ thân thiết để lợi dụng tình bạn, tình cảm gia đình lấy tiền",
          "Tránh né khi được đòi tiền — sau khi nhận tiền, chúng sẽ tìm cách tránh né hoặc thái độ thay đổi hoàn toàn",
          "Không có tài sản hoặc nguồn thu nhập rõ ràng",
        ],
      },
      {
        heading: "Cách bảo vệ tài sản và tránh trở thành nạn nhân",
        paragraphs: ["Để tránh bị lừa đảo chiếm đoạt tài sản, bạn nên áp dụng những biện pháp phòng chống sau:"],
        bullets: [
          "Xác minh thông tin trước khi cho vay — luôn yêu cầu bằng chứng cụ thể về nhu cầu tài chính, như giấy tờ từ ngân hàng hoặc hóa đơn",
          "Sử dụng các kênh giao dịch tài chính chính thức như ngân hàng hoặc tổ chức tài chính uy tín",
          "Giữ hồ sơ ghi chép rõ ràng — luôn lập biên bản, hợp đồng hoặc ghi chú chi tiết về các khoản vay nợ",
          "Không cho vay tiền lớn cho người lạ hoặc mới quen",
          "Tham khảo ý kiến gia đình hoặc bạn bè trước khi cho vay số tiền lớn",
        ],
      },
      {
        heading: "Biện pháp pháp lý khi bị lừa đảo",
        paragraphs: ["Nếu bạn hoặc người thân phát hiện bị lừa đảo chiếm đoạt tài sản, hãy:"],
        bullets: [
          "Tố giác ngay tới cơ quan công an với đầy đủ chứng cứ như: tin nhắn, cuộc gọi, biên bản ghi nợ",
          "Thu thập bằng chứng — lưu giữ tất cả các giao dịch, tin nhắn, email liên quan đến vụ lừa đảo",
          "Tìm kiếm hỗ trợ pháp lý — tham khảo ý kiến của luật sư hoặc các tổ chức pháp lý uy tín",
          "Cảnh báo người khác — chia sẻ thông tin về các đối tượng lừa đảo với cộng đồng để ngăn chặn các nạn nhân khác",
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Cảnh báo lừa đảo giả danh cán bộ: Cách nhận biết và bảo vệ bản thân",
    excerpt:
      "Trang Trắng cảnh báo về các chiêu lừa đảo giả danh cán bộ nhà nước. Tìm hiểu cách nhận biết những cuộc gọi, tin nhắn lừa đảo và bảo vệ tài sản của bạn.",
    date: "15/03/2026",
    category: "Cảnh báo mới",
    isUrgent: true,
    source: "trangtrang.com",
    content: [
      {
        heading: "Thủ đoạn lừa đảo giả danh cán bộ nhà nước",
        paragraphs: [
          "Kẻ lừa đảo thường sử dụng những thủ đoạn rất tinh vi để đánh lừa người dân. Trong vụ lừa đảo gần đây, đối tượng đã tiếp cận một nạn nhân vào dịp Tết Nguyên đán, khi nhu cầu mua bán hàng hóa tăng cao. Kẻ lừa đảo tự giới thiệu mình là cán bộ đang công tác tại một cơ quan chức năng của Bộ Công an, để tạo lòng tin với nạn nhân.",
          "Sau đó, đối tượng \"nổ\" rằng đang có một lô hàng cần thanh lý tại một cảng lớn và cần người mua. Bằng những lời lẽ thuyết phục, kẻ lừa đảo đã thuyết phục nạn nhân chuyển khoản và đưa tiền mặt nhiều lần. Tổng cộng, nạn nhân đã mất hơn 131 triệu đồng trước khi nhận ra bị lừa.",
          "Những chiêu trò này rất phổ biến bởi vì:",
        ],
        bullets: [
          "Lợi dụng lòng tin của người dân đối với cơ quan chức năng",
          "Tạo ra các câu chuyện hấp dẫn về cơ hội kinh doanh",
          "Tấn công vào tâm lý tham lợi của nạn nhân",
          "Sử dụng công nghệ để giả mạo số điện thoại hoặc thông tin cá nhân",
          "Lợi dụng các mùa cao điểm như Tết, lễ hội khi người dân bận rộn",
        ],
      },
      {
        heading: "Cách nhận biết các cuộc gọi, tin nhắn lừa đảo",
        paragraphs: [
          "Kiểm tra thông tin người gọi: Cán bộ nhà nước thực sự sẽ cung cấp số điện thoại chính thức của cơ quan mình. Nếu nghi ngờ, hãy tìm số điện thoại chính thức của cơ quan đó qua trang web chính thức hoặc danh bạ công khai và gọi lại để xác nhận.",
          "Cảnh báo đỏ từ những yêu cầu tài chính: Nếu ai đó xưng là cán bộ nhà nước mà yêu cầu bạn chuyển tiền, đưa tiền mặt, hoặc cung cấp thông tin tài khoản ngân hàng, đây là tín hiệu lừa đảo rõ ràng. Các cơ quan chính phủ hợp pháp không bao giờ yêu cầu công dân chuyển tiền qua điện thoại.",
          "Hứa hẹn lợi nhuận quá lớn: Những lời hứa về cơ hội kinh doanh với lợi nhuận cao, lô hàng cần thanh lý giá rẻ, hoặc bất kỳ cơ hội \"làm giàu nhanh\" nào đều là dấu hiệu của lừa đảo.",
          "Tạo cấp độ khẩn cấp: Kẻ lừa đảo thường tạo ra tâm lý khẩn cấp, bắt buộc bạn phải quyết định nhanh mà không có thời gian suy nghĩ.",
        ],
        bullets: [],
      },
      {
        heading: "Cách bảo vệ bản thân khỏi lừa đảo",
        paragraphs: ["Để giảm thiểu rủi ro trở thành nạn nhân của lừa đảo, bạn nên thực hiện những biện pháp sau:"],
        bullets: [
          "Xác minh thông tin trước khi tin tưởng — luôn xác minh danh tính của người gọi bằng cách gọi lại đến số điện thoại chính thức của cơ quan đó",
          "Tìm hiểu thêm trước khi quyết định — nếu ai đó cung cấp thông tin về cơ hội kinh doanh hoặc yêu cầu chuyển tiền, hãy dành thời gian tìm hiểu kỹ lưỡng",
          "Không chia sẻ thông tin cá nhân — tránh cung cấp thông tin tài khoản ngân hàng, số căn cước công dân qua điện thoại",
          "Sử dụng dịch vụ tra cứu đáng tin cậy để kiểm tra số điện thoại đáng ngờ",
          "Báo cáo ngay cho cơ quan công an địa phương nếu phát hiện mình đã bị lừa",
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Lừa đảo trực tuyến Đông Nam Á: Cảnh báo về sử dụng AI tinh vi",
    excerpt:
      "Các tổ chức lừa đảo ở Đông Nam Á đang lợi dụng công nghệ AI để nâng cao hiệu quả, mở rộng quy mô toàn cầu và gây thiệt hại hàng chục tỷ USD.",
    date: "12/03/2026",
    category: "Quốc tế",
    isUrgent: false,
    source: "trangtrang.com",
    content: [
      {
        heading: "Cách AI giúp các tội phạm nâng cao hiệu quả lừa đảo",
        paragraphs: [
          "Trước đây, các chiêu trò lừa đảo thường dễ dàng bị nhận diện nhờ vào các dấu hiệu bề ngoài như lỗi chính tả, chất lượng hình ảnh kém hoặc ngôn ngữ không tự nhiên. Tuy nhiên, tình hình đã thay đổi hoàn toàn khi công nghệ AI trở nên phổ biến và dễ tiếp cận.",
          "Các mô hình ngôn ngữ lớn (LLM) và công nghệ deepfake hiện nay cho phép các tội phạm:",
        ],
        bullets: [
          "Tạo nội dung giả mạo chất lượng cao — AI có thể tạo ra các bức ảnh, video và tin nhắn trông hoàn toàn chân thực",
          "Sao chép giọng nói — công nghệ deepfake voice cho phép tội phạm mạo danh các nhân vật nổi tiếng hoặc người thân quen",
          "Xác định nhóm nạn nhân tiềm năng — AI giúp phân tích dữ liệu và xác định những người có khả năng cao sẽ trở thành nạn nhân",
          "Tối ưu hóa chiến lược tấn công, nhanh chóng chuyển hướng sang các nhóm mục tiêu mới",
        ],
      },
      {
        heading: "Thiệt hại toàn cầu và nguy hiểm gia tăng",
        paragraphs: [
          "Theo các báo cáo từ các tổ chức quốc tế, tổn thất kinh tế từ các hoạt động lừa đảo trực tuyến là vô cùng lớn. Ước tính tính đến cuối năm 2023, các mạng tội phạm xuyên quốc gia đã đánh cắp tổng cộng ít nhất khoảng 64 tỷ USD thông qua các hoạt động cờ bạc trực tuyến và lừa đảo.",
          "Các nước trong khu vực Đông Nam Á đã bắt đầu hành động quyết liệt. Những chiến dịch liên quốc gia đã triệt phá hàng nghìn nghi phạm và phá bỏ hàng trăm khu phức hợp lừa đảo. Tuy nhiên, các chuyên gia cảnh báo rằng thay vì biến mất, các tổ chức tội phạm đang thích ứng bằng cách sử dụng AI nhiều hơn.",
          "Mối đe dọa không chỉ giới hạn ở Đông Nam Á. Các hoạt động lừa đảo đang lan rộng đến các khu vực khác như châu Mỹ, châu Phi và Trung Đông.",
        ],
        bullets: [],
      },
      {
        heading: "Cuộc chiến giữa công nghệ và pháp luật",
        paragraphs: [
          "Các cơ quan thực thi pháp luật cũng đang cố gắng sử dụng AI để truy bắt tội phạm. Tuy nhiên, họ gặp phải thách thức lớn trong việc theo kịp tốc độ phát triển công nghệ của các tội phạm.",
          "Vấn đề cốt lõi là: khi tội phạm có quyền truy cập vào các công cụ AI mạnh mẽ và giá rẻ, họ có thể nhanh chóng thích ứng và phát triển. Các quốc gia cần phải hợp tác chặt chẽ hơn, chia sẻ thông tin tình báo và phát triển các chiến lược chung để chống lại hiện tượng này.",
          "Người dùng internet cần nâng cao cảnh giác khi nhận được các thông tin đến từ những nguồn không xác minh. Hãy luôn kiểm tra kỹ lưỡng trước khi tin tưởng hoặc cung cấp thông tin cá nhân cho bất kỳ ai.",
        ],
        bullets: [],
      },
    ],
  },
  {
    id: 4,
    title: "Cảnh báo: Thủ đoạn lừa đảo giả danh ngân hàng qua điện thoại ảo",
    excerpt:
      "Nhóm tội phạm sử dụng VOIP giả danh ngân hàng, lừa hơn 1.200 người chiếm đoạt 100 tỷ đồng. Trang Trắng cảnh báo các dấu hiệu nhận biết để bảo vệ tài chính của bạn.",
    date: "10/03/2026",
    category: "Ngân hàng",
    isUrgent: true,
    source: "trangtrang.com",
    content: [
      {
        heading: "Cách thức hoạt động của nhóm lừa đảo",
        paragraphs: [
          "Nhóm tội phạm này có tổ chức rất chặt chẽ, chia thành nhiều bộ phận khác nhau để thực hiện các giai đoạn lừa đảo. Đầu tiên, họ tạo lập các trang giả mạo trên mạng xã hội, sử dụng tên gọi giống với các ngân hàng thật để thu hút sự chú ý của những người có nhu cầu mở thẻ tín dụng.",
          "Bộ phận \"sale\" của nhóm này quản lý các trang giả mạo, tiếp cận những khách hàng tiềm năng và hướng dẫn họ cung cấp thông tin cá nhân, số thẻ ngân hàng và mã CVV. Sau khi thu thập được thông tin, họ chuyển sang bước tiếp theo là \"thẩm định\".",
          "Ở bước thẩm định, những người trong nhóm sử dụng tổng đài ảo được tạo từ công nghệ VOIP để gọi điện đến nạn nhân. Họ giả danh là nhân viên ngân hàng, thông báo rằng nạn nhân cần phải chứng minh \"năng lực tài chính\" bằng cách nộp một khoản tiền nhất định vào tài khoản. Tiền lợi nhuận được chuyển ra nước ngoài thông qua tiền điện tử nhằm tránh sự phát hiện.",
        ],
        bullets: [],
      },
      {
        heading: "Những dấu hiệu cảnh báo của lừa đảo",
        paragraphs: ["Để bảo vệ bản thân khỏi những kẻ lừa đảo, bạn cần nhận biết các dấu hiệu đáng ngờ sau:"],
        bullets: [
          "Cuộc gọi bất ngờ từ \"ngân hàng\" — các ngân hàng thực sự sẽ không bao giờ gọi điện yêu cầu bạn cung cấp thông tin cá nhân, mã CVV hay mã OTP qua điện thoại",
          "Yêu cầu chứng minh tài chính — không có ngân hàng nào yêu cầu bạn nộp tiền để chứng minh khả năng tài chính trước khi cấp thẻ tín dụng",
          "Áp lực và khẩn cấp — những kẻ lừa đảo thường tạo áp lực, thông báo rằng hạn chế hoặc cơ hội sắp hết để buộc bạn đưa ra quyết định nhanh chóng",
          "Yêu cầu cung cấp mã OTP — không bao giờ cung cấp mã OTP cho bất kỳ ai, kể cả những người tự xưng là nhân viên ngân hàng",
          "Liên kết từ những nguồn không rõ — hãy cẩn thận với những liên kết được gửi qua tin nhắn hoặc email",
        ],
      },
      {
        heading: "Cách bảo vệ chính mình khỏi lừa đảo",
        paragraphs: ["Để tránh trở thành nạn nhân của các thủ đoạn lừa đảo này, bạn nên tuân thủ các biện pháp an toàn sau:"],
        bullets: [
          "Xác minh thông tin trực tiếp — nếu nhận được cuộc gọi từ ngân hàng, hãy cắt máy và gọi lại số chính thức của ngân hàng mà bạn biết",
          "Không cung cấp thông tin cá nhân qua điện thoại — ngân hàng không bao giờ yêu cầu mã CVV, mã OTP hay PIN qua điện thoại",
          "Kiểm tra tài khoản ngân hàng thường xuyên để phát hiện sớm nếu có hoạt động bất thường",
          "Sử dụng ứng dụng chính thức — tải ứng dụng ngân hàng từ các kho ứng dụng chính thức",
          "Cẩn thận với mọi yêu cầu liên quan đến tiền bạc hay thông tin cá nhân từ những người không rõ danh tính",
        ],
      },
    ],
  },
  {
    id: 5,
    title: "Hơn 1.500 nghi phạm lừa đảo trực tuyến bị dẫn độ: Bài học bảo vệ bản thân",
    excerpt:
      "Hành động dẫn độ hơn 1.500 nghi phạm lừa đảo cho thấy mối nguy hiểm của các hoạt động lừa đảo trực tuyến. Tìm hiểu cách bảo vệ bản thân khỏi những thủ đoạn này.",
    date: "08/03/2026",
    category: "Thời sự",
    isUrgent: false,
    source: "trangtrang.com",
    content: [
      {
        heading: "Quy mô của tệ nạn lừa đảo trực tuyến hiện nay",
        paragraphs: [
          "Các hoạt động lừa đảo viễn thông và lừa đảo trực tuyến đã từ lâu tồn tại ở các khu vực biên giới, đặc biệt là những nơi có sự kết hợp của công nghệ cao, quản lý lỏng lẻo và lực lượng nhân sự lớn. Những băng nhóm tội phạm này hoạt động quy mô lớn, với hàng trăm tòa nhà được sử dụng làm căn cứ để thực hiện các hoạt động lừa đảo.",
          "Những con số công bố gần đây cho thấy:",
        ],
        bullets: [
          "Hơn 7.600 công dân bị nghi ngờ liên quan đến các hoạt động lừa đảo trực tuyến tại những khu vực cụ thể",
          "Hơn 630 tòa nhà được phá hủy sau khi xác định chúng là nơi tiến hành các hoạt động lừa đảo",
          "1.500 nghi phạm bị bắt giữ và dẫn độ trong một chiến dịch phối hợp quốc tế",
        ],
      },
      {
        heading: "Những thủ đoạn lừa đảo phổ biến mà bạn cần biết",
        paragraphs: ["Các tội phạm lừa đảo trực tuyến sử dụng nhiều phương pháp khác nhau để lừa gạt người dùng. Hiểu rõ các thủ đoạn này là bước đầu tiên để bảo vệ bản thân:"],
        bullets: [
          "Giả mạo danh tính — tội phạm giả danh các công ty, ngân hàng hoặc cơ quan chính phủ để yêu cầu thông tin cá nhân hoặc tiền",
          "Lừa đảo tình cảm — xây dựng mối quan hệ giả tạo để chiếm đoạt tiền bạc và thông tin",
          "Đánh bạc trực tuyến giả — hứa hẹn những khoản lợi nhuận cao từ các trò chơi hoặc đầu tư",
          "Lừa đảo hóa đơn — gửi các hóa đơn giả mạo yêu cầu thanh toán ngay lập tức",
          "Phishing qua email — gửi email lừa đảo để đánh cắp thông tin đăng nhập",
        ],
      },
      {
        heading: "Cách bảo vệ bản thân khỏi lừa đảo trực tuyến",
        paragraphs: ["Mặc dù tội phạm lừa đảo trực tuyến rất thông minh, nhưng bạn vẫn có thể bảo vệ bản thân bằng cách tuân theo một số biện pháp phòng ngừa cơ bản:"],
        bullets: [
          "Xác minh danh tính — luôn kiểm tra kỹ danh tính của người hoặc tổ chức liên hệ với bạn",
          "Không chia sẻ thông tin cá nhân như mật khẩu, mã PIN, số tài khoản ngân hàng qua bất kỳ kênh nào",
          "Cẩn thận với các liên kết và tệp đính kèm từ những người hoặc tổ chức không quen biết",
          "Sử dụng mật khẩu mạnh và bật xác thực hai yếu tố trên các tài khoản quan trọng",
          "Cập nhật phần mềm thường xuyên để vá các lỗ hổng bảo mật",
          "Cài đặt và sử dụng phần mềm chống virus và tường lửa",
        ],
      },
    ],
  },
  {
    id: 6,
    title: "Cảnh báo lừa đảo công nghệ cao dịp Tết: Những chiêu trò tinh vi bạn cần biết",
    excerpt:
      "Dịp Tết, các hoạt động lừa đảo tài chính gia tăng mạnh với nhiều thủ đoạn tinh vi. Trang Trắng cảnh báo những chiêu trò phổ biến và cách phòng ngừa hiệu quả.",
    date: "05/03/2026",
    category: "Cảnh báo mới",
    isUrgent: true,
    source: "trangtrang.com",
    content: [
      {
        heading: "Những chiêu trò lừa đảo phổ biến dịp cận Tết",
        paragraphs: ["Các hoạt động lừa đảo dịp Tết có nhiều hình thức khác nhau, từ những trường hợp cũ lão được \"nâng cấp\" bằng công nghệ mới:"],
        bullets: [
          "Lừa đảo qua hỗ trợ Tết — người dân nhận được cuộc gọi từ những người tự xưng là cán bộ phường, thông báo được hỗ trợ tiền Tết theo chính sách Nhà nước, sau đó yêu cầu mã OTP để chiếm quyền kiểm soát tài khoản ngân hàng",
          "Vay nhanh trên mạng xã hội — các fanpage quảng cáo dịch vụ vay tiền \"trong 30 phút, không cần thế chấp\", sau khi người vay chuyển tiền phí hồ sơ thì bị chặn liên lạc ngay",
          "Bán vé máy bay, xe khách và tour du lịch giá rẻ giả — lập website và fanpage giả mạo hãng vận chuyển, sau khi nhận đặt cọc thì cắt liên lạc",
          "Đổi tiền mới trái phép — quảng cáo dịch vụ đổi tiền nhanh, giao tận nơi, sau khi nhận chuyển tiền trước thì biến mất",
          "Lừa đảo qua mua sắm online — giả danh shipper hoặc thực hiện thủ đoạn chuyển tiền nhầm để chiếm đoạt tiền",
          "Việc nhẹ lương cao — giả danh sàn thương mại điện tử tuyển cộng tác viên, ban đầu trả tiền nhỏ để tạo lòng tin rồi yêu cầu chuyển tiền với lý do mở khóa nhiệm vụ",
        ],
      },
      {
        heading: "Công nghệ cao giúp lừa đảo trở nên tinh vi hơn",
        paragraphs: [
          "Những thủ đoạn quen thuộc được \"nâng cấp\" bằng công nghệ cao. Các đối tượng gửi tin nhắn, gọi điện kèm đường link giả mạo để yêu cầu người dân cung cấp thông tin cá nhân, mã OTP hoặc tải ứng dụng giả, từ đó chiếm quyền kiểm soát tài khoản ngân hàng.",
          "Việc sử dụng trí tuệ nhân tạo và deepfake giọng nói, hình ảnh giúp các đối tượng dễ dàng giả danh cán bộ, nhân viên ngân hàng, thậm chí giả giọng người thân, khiến nhiều nạn nhân mất cảnh giác. Các website giả mạo chỉ khác trang thật vài ký tự tên miền, đi kèm hàng trăm bình luận và đánh giá giả, tạo cảm giác uy tín để lôi kéo khách hàng.",
        ],
        bullets: [],
      },
      {
        heading: "Cách phòng chống lừa đảo hiệu quả — nguyên tắc \"2 phải — 4 không\"",
        paragraphs: [],
        bullets: [
          "PHẢI: Luôn nâng cao cảnh giác và chủ động bảo mật thông tin cá nhân như căn cước công dân, tài khoản ngân hàng, mã OTP",
          "PHẢI: Kịp thời liên hệ cơ quan công an khi phát hiện dấu hiệu nghi vấn hoặc bị lừa đảo",
          "KHÔNG: Hoảng sợ trước cuộc gọi, tin nhắn từ người lạ",
          "KHÔNG: Nhẹ dạ trước tiền, quà tặng hay lợi nhuận bất thường",
          "KHÔNG: Tùy tiện kết bạn, tham gia hội nhóm chưa được kiểm chứng",
          "KHÔNG: Cung cấp thông tin cá nhân, không truy cập link lạ, không tải ứng dụng không rõ nguồn gốc",
        ],
      },
    ],
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

      <article>
        {/* Header */}
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

        <hr className="border-border mb-8" />

        {/* Structured body */}
        <div className="space-y-8">
          {article.content.map((section, sIdx) => (
            <div key={sIdx}>
              <h2 className="text-xl font-bold text-foreground mb-3">{section.heading}</h2>
              {section.paragraphs.map((para, pIdx) => (
                <p key={pIdx} className="text-muted-foreground leading-relaxed mb-3">
                  {para}
                </p>
              ))}
              {section.bullets.length > 0 && (
                <ul className="space-y-2 mt-2">
                  {section.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex gap-2 text-muted-foreground">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                      <span className="leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">
              Nguồn: Ban biên tập An toàn mạng • {article.date}
            </p>
            {article.source && (
              <a
                href="https://www.trangtrang.com/bai-viet"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                Xem bài gốc trên {article.source}
              </a>
            )}
          </div>
          <Button variant="outline" onClick={() => navigate("/tintuc")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Xem tất cả tin tức
          </Button>
        </div>
      </article>
    </div>
  )
}
