// Shared helpers — safe to import from server code AND client components.

export const num = (v) => {
  const n = parseFloat(v)
  return Number.isFinite(n) ? n : 0
}

// 1234.5 -> "1,234.50"  (Indian digit grouping)
export const money = (v) =>
  num(v).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

// 1234.5 -> "₹1,234.50"
export const inr = (v) => '₹' + money(v)

// Accepts 'YYYY-MM-DD' or a full ISO timestamp. Always rendered in IST so server and browser agree.
export function fmtDate(d) {
  if (!d) return ''
  const date = new Date(String(d).length === 10 ? `${d}T00:00:00+05:30` : d)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata',
  })
}

// Today's date in IST as 'YYYY-MM-DD'
export const todayIST = () =>
  new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })

const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven',
  'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

const two = (n) => (n < 20 ? ONES[n] : TENS[Math.floor(n / 10)] + (n % 10 ? ' ' + ONES[n % 10] : ''))
const three = (n) => {
  const h = Math.floor(n / 100)
  const r = n % 100
  return (h ? ONES[h] + ' Hundred' + (r ? ' ' : '') : '') + (r ? two(r) : '')
}

// 3500 -> "Rupees Three Thousand Five Hundred Only"  (Indian lakh / crore system)
export function amountInWords(amount) {
  const total = Math.round(num(amount) * 100)
  const rupees = Math.floor(total / 100)
  const paise = total % 100
  if (rupees === 0 && paise === 0) return 'Rupees Zero Only'

  const parts = []
  const crore = Math.floor(rupees / 10000000)
  const lakh = Math.floor(rupees / 100000) % 100
  const thousand = Math.floor(rupees / 1000) % 100
  const rest = rupees % 1000
  if (crore) parts.push(three(crore) + ' Crore')
  if (lakh) parts.push(two(lakh) + ' Lakh')
  if (thousand) parts.push(two(thousand) + ' Thousand')
  if (rest) parts.push(three(rest))

  let words = 'Rupees ' + (parts.length ? parts.join(' ') : 'Zero')
  if (paise) words += ' and ' + two(paise) + ' Paise'
  return words + ' Only'
}

export const PAYMENT_METHODS = {
  cash: 'Cash',
  upi: 'UPI',
  card: 'Card',
  bank_transfer: 'Bank transfer',
  cheque: 'Cheque',
  other: 'Other',
}

export const PAYMENT_STATUS_LABEL = {
  paid: 'Paid',
  partial: 'Partially paid',
  unpaid: 'Unpaid',
}
