# Dự án Shopee Clone Typescript

## Chức năng trong dự án

- Authentication module: Quản lý bằng JWT

  - Đăng ký
  - Đăng nhập
  - Đăng xuất

- Trang danh sách sản phẩm:

  - Có phân trang
  - Sort (sắp xếp) theo từng thuộc tính sản phẩm
  - filter nâng cao theo từng thuộc tính sản phẩm
  - Tìm kiếm sản phẩm

- Trang chi tiết sản phẩm:

  - Hiển thị thông tin chi tiết
  - Ảnh hiển thị theo slider + hover zoom effect
  - Mô tả thì hiển thị rich text dạng WYSIWYG HTML
  - Có chức năng mua hàng

- Giỏ hàng

  - Quản lý đơn hàng: Thêm, sửa, xóa sản phẩm
  - Mua hàng

- Quản lý Profile khách hàng

  - Update thông tin cá nhân
  - Upload Avatar
  - Đổi mật khẩu
  - Xem tình trạng đơn hàng

## Công nghệ sử dụng

- UI / CSS Library: Tailwindcss + HeadlessUI [https://tailwindcss.com/] [https://headlessui.com/]
- State Management: React Query cho async state [https://react-query-v3.tanstack.com/] và React Context cho state thường
- Form Management: React Hook Form [https://react-hook-form.com/] + Yup [https://github.com/jquense/yup]
- Router: React Router Dom [https://reactrouter.com/en/main]
- Build tool: Vite [https://vitejs.dev/]
- API: Rest API dựa trên server mình cung cấp sẵn
- Hỗ trợ đa ngôn ngữ với react.i18next
- Hỗ trợ SEO với React Helmet
- Mô hình hóa các component với story book
- Unit Test
- Và các Package khác...
