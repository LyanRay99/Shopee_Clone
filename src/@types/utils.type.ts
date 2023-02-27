//* Interface for axios error (used whene call api occurs error)
export interface ResponseAPI<Data> {
  message: string
  data?: Data
}
