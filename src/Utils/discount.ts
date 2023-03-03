export const rateSale = (original: number, sale: number) => {
  const result = Math.round(((original - sale) / original) * 100)
  return result + '%'
}
