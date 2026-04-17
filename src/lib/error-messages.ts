/**
 * Bảng dịch thông báo lỗi từ backend (tiếng Anh) sang tiếng Việt.
 * Được áp dụng tự động trong apiFetch.
 */
const ERROR_MAP: Record<string, string> = {
  // ===== Auth & Access =====
  'Bad credentials': 'Email hoặc mật khẩu không chính xác',
  'Invalid credentials': 'Email hoặc mật khẩu không chính xác',
  'Unauthenticated': 'Phiên làm việc không hợp lệ hoặc bạn chưa đăng nhập',
  'Wrong password': 'Mật khẩu hiện tại không chính xác',
  'Access is denied': 'Bạn không có quyền thực hiện thao tác này',
  'Access denied': 'Bạn không có quyền thực hiện thao tác này',
  'Unauthorized': 'Bạn không có quyền truy cập chức năng này',
  'Forbidden': 'Tài khoản của bạn không có đặc quyền truy cập',
  'You do not have permission to access': 'Bạn không có quyền truy cập tính năng này',
  'Full authentication is required': 'Vui lòng đăng nhập để tiếp tục',
  'Token expired': 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
  'Token is expired': 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
  'Invalid token': 'Phiên đăng nhập không hợp lệ, vui lòng thử đăng nhập lại',

  // ===== Account & User =====
  'User not found': 'Không tìm thấy tài khoản người dùng',
  'Email not found': 'Email không tồn tại trong hệ thống',
  'Account not found': 'Không tìm thấy tài khoản này',
  'User does not exists': 'Tài khoản đăng ký với email này không tồn tại',
  'User does not exist': 'Tài khoản đăng ký với email này không tồn tại',
  'User already exists': 'Tài khoản này đã tồn tại trong hệ thống',
  'Email already exists': 'Email này đã được sử dụng, vui lòng chọn email khác',
  'Email already in use': 'Email này đã được sử dụng, vui lòng chọn email khác',
  'Username already exists': 'Tên đăng nhập đã có người sử dụng',
  'Account is disabled': 'Tài khoản của bạn chưa được kích hoạt',
  'Account is blocked': 'Tài khoản của bạn đã bị khóa do vi phạm chính sách',
  'Account is locked': 'Tài khoản đã bị tạm khóa',
  'Please verify your email': 'Vui lòng kiểm tra hộp thư email để xác minh tài khoản trước khi đăng nhập',
  'Email is not verified': 'Địa chỉ email của bạn chưa được xác minh',
  'Cannot delete yourself': 'Bạn không thể tự xóa tài khoản của chính mình',
  'Cannot block yourself': 'Bạn không thể tự khóa tài khoản của chính mình',
  'User is already active': 'Tài khoản này đang ở trạng thái hoạt động bình thường',
  'User is already blocked': 'Tài khoản này đã bị khóa từ trước',

  // ===== OTP & Password =====
  'Invalid OTP': 'Mã xác nhận (OTP) không chính xác',
  'OTP expired': 'Mã xác nhận (OTP) đã hết hạn, vui lòng yêu cầu mã mới',
  'OTP is expired': 'Mã xác nhận đã hết hạn',
  'OTP has expired': 'Mã xác nhận (OTP) đã hết hạn, vui lòng yêu cầu mã mới',
  'OTP not found': 'Không tìm thấy mã xác nhận',
  'Invalid or expired OTP': 'Mã xác nhận không đúng hoặc đã hết hiệu lực',
  'Please wait before requesting another OTP': 'Vui lòng đợi một lát trước khi yêu cầu mã xác nhận (OTP) mới',
  'Password is too short': 'Mật khẩu quá ngắn (Yêu cầu ít nhất 8 ký tự)',
  'Password must be at least 8 characters': 'Mật khẩu phải dài tối thiểu 8 ký tự',
  'Passwords do not match': 'Mật khẩu nhập lại không khớp',
  'Old password is incorrect': 'Mật khẩu cũ không đúng',
  'Current password is incorrect': 'Mật khẩu hiện tại không đúng',
  'New password must be different from old password': 'Mật khẩu mới phải khác với mật khẩu cũ',

  // ===== Validation & Form =====
  'Email is invalid': 'Địa chỉ email không đúng định dạng',
  'Invalid email': 'Địa chỉ email không đúng định dạng',
  'Email is required': 'Vui lòng không để trống địa chỉ email',
  'Password is required': 'Vui lòng không để trống mật khẩu',
  'Username is required': 'Vui lòng không để trống tên đăng nhập',
  'Field is required': 'Vui lòng điền đầy đủ các thông tin bắt buộc',
  'Validation failed': 'Dữ liệu nhập vào chưa hợp lệ, vui lòng kiểm tra lại',

  // ===== Network & Server =====
  'Internal server error': 'Hệ thống đang gặp sự cố, vui lòng thử lại sau',
  'Internal Server Error': 'Hệ thống đang gặp sự cố, vui lòng thử lại sau',
  'Service unavailable': 'Máy chủ đang bảo trì hoặc quá tải, mong bạn thông cảm quay lại sau',
  'Bad gateway': 'Không thể kết nối với dịch vụ (Bad Gateway)',
  'Gateway timeout': 'Hết thời gian phản hồi từ máy chủ, vui lòng thử lại',
  'Too many requests': 'Bạn thao tác quá nhanh, vui lòng nghỉ tay vài giây rồi ấn lại nhé',
  'Network error': 'Lỗi đường truyền mạng, vui lòng kiểm tra kết nối',
  'Uncategorized error': 'Đã xảy ra lỗi không xác định, vui lòng tải lại trang',
  'Something went wrong': 'Đã có sự cố ngoài ý muốn, xin thử lại sau',
  'Method Not Allowed': 'Thao tác không được hệ thống hỗ trợ',
  'Message not readable': 'Dữ liệu gửi lên không thể nhận diện được',

  // ===== Entities (Report / Scam / Domain / Blog) =====
  'Report not found': 'Không tìm thấy báo cáo này trong hệ thống',
  'Report already exists': 'Bạn đã gửi báo cáo cho trường hợp này rồi',
  'URL is invalid': 'Đường dẫn liên kết (URL) không hợp lệ',
  'Phone number is invalid': 'Số điện thoại không đúng định dạng',
  'Invalid domain': 'Tên miền không hợp lệ (Ví dụ đúng: example.com)',
  'Domain not found': 'Không thể trích xuất thông tin từ tên miền này',
  'Assessment not found': 'Không tìm thấy bài đánh giá nào phù hợp',
  'Assessment already exists': 'Bài đánh giá cho số điện thoại này đã tồn tại',
  'Blog not found': 'Không tìm thấy bài viết này',
  'Comment not found': 'Bình luận không tồn tại hoặc đã bị xóa',
  'Topic not found': 'Không tìm thấy chủ đề câu hỏi (Quiz)',
  'Question not found': 'Câu hỏi không tồn tại',
}

/**
 * Dịch thông báo lỗi từ tiếng Anh sang tiếng Việt.
 * Nếu không có bản dịch, trả về thông báo gốc.
 */
export function translateError(message: string): string {
  if (!message) return 'Đã xảy ra lỗi, vui lòng thử lại'

  // Exact match
  if (ERROR_MAP[message]) return ERROR_MAP[message]

  // Case-insensitive partial match
  const lower = message.toLowerCase()
  for (const [en, vi] of Object.entries(ERROR_MAP)) {
    if (lower.includes(en.toLowerCase())) {
      return vi
    }
  }

  // If message already appears to be Vietnamese, return as-is
  const hasVietnamese = /[àáâãăạảấầẩẫậắằẳẵặđèéêẹẻẽếềểễệìíịỉĩòóôõơọỏốồổỗộớờởỡợùúưụủũứừửữựỳýỵỷỹ]/i.test(message)
  if (hasVietnamese) return message

  return message
}
