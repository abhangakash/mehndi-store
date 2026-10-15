// =====================================================================
// Your business details — printed on every invoice (online + offline).
// Fill in the lines marked [ ... ]. Any value still wrapped in [ ] is
// simply left off the invoice, so nothing embarrassing gets printed.
// =====================================================================
export const BUSINESS = {
  name: 'CRABVEDA',
  tagline: 'Ayurvedic Pain Relief Oil',

  addressLines: [
    '[Shop / office address]',
    '[City, State - PIN code]',
  ],
  phone: '+91 99212 97518',
  email: 'crabveda@gmail.com',
  website: 'crabveda.com',

  // Printed under the totals. You are not GST registered, so no tax is charged.
  gstNote: 'Not registered under GST. No GST charged.',

  // Shown on the invoice while a balance is still due ("Pay to" box).
  // Leave a value as '' (or in [ ]) to hide that line.
  payment: {
    upiId: '[yourname@upi]',
    accountName: '[Account holder name]',
    bank: '[Bank name]',
    accountNo: '[Account number]',
    ifsc: '[IFSC code]',
  },

  // Terms printed on OFFLINE (wholesale / counter) invoices
  terms: [
    'Goods once sold are not returnable except for manufacturing defects reported within 7 days.',
    'Payment is due as per the agreed terms. Balance dues must be cleared by the due date.',
    'This is a computer-generated invoice and does not require a physical signature.',
  ],

  // Terms printed on ONLINE order invoices
  onlineTerms: [
    'Returns are accepted within 7 days of delivery for unused, sealed products.',
    'For support or returns, WhatsApp us on +91 99212 97518.',
    'This is a computer-generated invoice and does not require a physical signature.',
  ],
}

// True when a value is empty or still an unfilled "[placeholder]".
export const isBlank = (v) => !v || /^\s*\[.*\]\s*$/.test(String(v))
