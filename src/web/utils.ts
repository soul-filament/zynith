export function moneyString (amount: number){

  const abs = Math.abs(amount)
  const sign = amount > 0 ? '' : '-'
  const dollars = Math.floor(abs / 100)
  const cents = abs % 100
  const centsString = cents.toString().padStart(2, '0')

  return sign + '$' + dollars + '.' + centsString

}