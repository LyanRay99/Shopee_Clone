//* Interface for axios success (data responsed when call api success)
export interface SuccessResponse<Data> {
  message: string
  data: Data
}

//* Interface for axios error (used whene call api occurs error)
export interface ErrorResponse<Data> {
  message: string
  data?: Data
}

/*
 * cú pháp `-?` sẽ loại bỏ undefiend của key optional
 * NonNullable của typescript sẽ loại bỏ đi giá trị undefined của 1 type nào đó
 * Cụ thể ta sẽ dùng để loại tỏ type undefined của price_max và price_min tại asideFilter.tsx
 * */
export type NoUndefinedField<T> = {
  [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>>
}
