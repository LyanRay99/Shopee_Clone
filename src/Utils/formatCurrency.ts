//* format lại currency
export function formatCurrency(currency: number) {
  return new Intl.NumberFormat('de-DE').format(currency)
}

//* format "1200" => "1.2k"
export function formatNumberToSocialStyle(value: number) {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1
  })
    .format(value)
    .replace('.', ',')
    .toLowerCase()
}
