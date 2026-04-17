/**
 * Bảng dịch thông báo lỗi từ backend (tiếng Anh) sang tiếng Việt.
 * Được áp dụng tự động trong apiFetch.
 */
const ERROR_MAP: Record<string, string> = {
  // Auth
  'Bad credentials': 'Email hoặc mật khẩu không đúng',
  'Invalid credentials': 'Email hoặc mật khẩu không đúng',
  'Unauthenticated': 'Email hoặc mật khẩu không đúng',
  'Wrong password': 'Mật khẩu không đúng',
  'User not found': 'Không tìm thấy tài khoản',
  'Email not found': 'Email không tồn tại trong hệ thống',
  'Account not found': 'Không tìm thấy tài khoản',
  'User already exists': 'Email này đã được đăng ký',
  'Email already exists': 'Email này đã được đăng ký',
  'Email already in use': 'Email này đã được sử dụng',
  'Username already exists': 'Tên đăng nhập đã tồn tại',
  'Account is disabled': 'Tài khoản đã bị vô hiệu hóa',
  'Account is blocked': 'Tài khoản đã bị khóa',
  'Account is locked': 'Tài khoản đã bị khóa',
  'Please verify your email': 'Vui lòng xác minh email trước khi đăng nhập',
  'Email is not verified': 'Email chưa được xác minh',
  'Token expired': 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
  'Token is expired': 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
  'Invalid token': 'Phiên đăng nhập không hợp lệ',
  'Unauthorized': 'Bạn không có quyền thực hiện thao tác này',
  'Access denied': 'Truy cập bị từ chối',
  'Forbidden': 'Bạn không có quyền truy cập',
  'You do not have permission to access': 'Bạn không có quyền truy cập tính năng này',
  'Full authentication is required': 'Vui lòng đăng nhập để tiếp tục',

  // OTP
  'Invalid OTP': 'Mã OTP không đúng',
  'OTP expired': 'Mã OTP đã hết hạn',
  'OTP is expired': 'Mã OTP đã hết hạn',
  'OTP not found': 'Không tìm thấy mã OTP',
  'Invalid or expired OTP': 'Mã OTP không hợp lệ hoặc đã hết hạn',

  // Password
  'Password is too short': 'Mật khẩu phải có ít nhất 8 ký tự',
  'Password must be at least 8 characters': 'Mật khẩu phải có ít nhất 8 ký tự',
  'Passwords do not match': 'Mật khẩu xác nhận không khớp',
  'Old password is incorrect': 'Mật khẩu cũ không đúng',
  'Current password is incorrect': 'Mật khẩu hiện tại không đúng',

  // Validation
  'Email is invalid': 'Địa chỉ email không hợp lệ',
  'Invalid email': 'Địa chỉ email không hợp lệ',
  'Email is required': 'Vui lòng nhập email',
  'Password is required': 'Vui lòng nhập mật khẩu',
  'Username is required': 'Vui lòng nhập tên đăng nhập',
  'Field is required': 'Vui lòng điền đầy đủ thông tin',
  'Validation failed': 'Dữ liệu không hợp lệ, vui lòng kiểm tra lại',

  // Network / Server
  'Internal server error': 'Lỗi hệ thống, vui lòng thử lại sau',
  'Internal Server Error': 'Lỗi hệ thống, vui lòng thử lại sau',
  'Service unavailable': 'Dịch vụ tạm thời không khả dụng',
  'Bad gateway': 'Lỗi cổng kết nối',
  'Gateway timeout': 'Hết thời gian kết nối, vui lòng thử lại',
  'Too many requests': 'Bạn đã thực hiện quá nhiều yêu cầu, vui lòng chờ một lúc',
  'Network error': 'Lỗi kết nối mạng',
  'Uncategorized error': 'Đã xảy ra lỗi không xác định',
  'Something went wrong': 'Đã có lỗi xảy ra, vui lòng thử lại',

  // Report / Scam check
  'Report not found': 'Không tìm thấy báo cáo',
  'Report already exists': 'Báo cáo này đã tồn tại',
  'URL is invalid': 'Đường dẫn không hợp lệ',
  'Phone number is invalid': 'Số điện thoại không hợp lệ',

  // User management
  'Cannot delete yourself': 'Bạn không thể xóa chính mình',
  'Cannot block yourself': 'Bạn không thể tự khóa tài khoản của mình',
  'User is already active': 'Tài khoản người dùng đã ở trạng thái hoạt động',
  'User is already blocked': 'Tài khoản người dùng đã bị khóa',
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
