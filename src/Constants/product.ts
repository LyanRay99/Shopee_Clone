/**
 ** Khai báo Constant cho sortBy và order
 ** Trong quá trình code ta có thể vô tình gán property của chúng thành value khác
 ** Nên ta cần gán từ khóa "as const" cho nó
 ** Khi đó 2 object này chỉ có thể đọc chứ không thể thay đổi
 */
export const sortBy = {
  createdAt: 'createdAt',
  view: 'view',
  sold: 'sold',
  price: 'price'
} as const

export const order = {
  desc: 'desc',
  asc: 'asc'
} as const
