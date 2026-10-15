import React from 'react'
import { Document, Page, View, Text, StyleSheet, Font } from '@react-pdf/renderer'
import { NOTO_REGULAR, NOTO_BOLD } from './invoiceFonts'
import { BUSINESS, isBlank } from './business'
import { money, amountInWords } from './format'

// Fonts are embedded (base64) so the Rupee sign prints correctly on any server.
Font.register({
  family: 'NotoSans',
  fonts: [
    { src: `data:font/truetype;base64,${NOTO_REGULAR}`, fontWeight: 400 },
    { src: `data:font/truetype;base64,${NOTO_BOLD}`, fontWeight: 700 },
  ],
})
Font.registerHyphenationCallback((word) => [word])

const INK = '#111111'
const MUTED = '#555555'
const LINE = '#9a9a9a'

const s = StyleSheet.create({
  page: { fontFamily: 'NotoSans', fontSize: 9, color: INK, paddingTop: 40, paddingBottom: 64, paddingHorizontal: 40, lineHeight: 1.35 },

  header: { flexDirection: 'row', justifyContent: 'space-between' },
  bizName: { fontSize: 17, fontWeight: 700, letterSpacing: 1.2, lineHeight: 1.2, marginBottom: 4 },
  tagline: { fontSize: 8.5, color: MUTED, marginBottom: 6 },
  small: { fontSize: 8.5, color: MUTED },

  titleBox: { width: 200 },
  docTitle: { fontSize: 20, fontWeight: 700, textAlign: 'right', letterSpacing: 2 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 3 },
  metaLabel: { color: MUTED },
  metaValue: { fontWeight: 700 },

  rule: { borderBottomWidth: 1.2, borderBottomColor: INK, marginTop: 14, marginBottom: 14 },

  twoCol: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  billTo: { width: '58%' },
  info: { width: '36%' },
  label: { fontSize: 7.5, fontWeight: 700, color: MUTED, letterSpacing: 1.2, marginBottom: 4 },
  partyName: { fontSize: 11, fontWeight: 700, marginBottom: 2 },

  thead: { flexDirection: 'row', backgroundColor: '#efefef', borderTopWidth: 1, borderBottomWidth: 1, borderColor: INK, paddingVertical: 5 },
  th: { fontSize: 8, fontWeight: 700, letterSpacing: 0.6 },
  tr: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: LINE, paddingVertical: 6 },
  cNo: { width: 26, paddingLeft: 6 },
  cDesc: { flexGrow: 1, flexShrink: 1, paddingRight: 8 },
  cQty: { width: 44, textAlign: 'right' },
  cRate: { width: 78, textAlign: 'right' },
  cAmt: { width: 88, textAlign: 'right', paddingRight: 6 },

  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 },
  words: { width: '52%' },
  totals: { width: '42%' },
  totLine: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2.5 },
  totStrong: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, borderTopWidth: 1, borderBottomWidth: 1, borderColor: INK, marginTop: 3 },
  balanceBox: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, paddingHorizontal: 6, borderWidth: 1.2, borderColor: INK, marginTop: 6 },
  bold: { fontWeight: 700 },

  section: { marginTop: 18 },
  payHead: { flexDirection: 'row', borderBottomWidth: 0.8, borderBottomColor: INK, paddingBottom: 3 },
  payRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#cfcfcf', paddingVertical: 3 },
  pDate: { width: 80 },
  pMethod: { width: 100 },
  pRef: { flexGrow: 1 },
  pAmt: { width: 90, textAlign: 'right' },

  payTo: { borderWidth: 0.8, borderColor: LINE, padding: 8 },
  bullet: { flexDirection: 'row', marginBottom: 2 },

  signRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 26 },
  signBox: { width: 190, alignItems: 'center' },
  signLine: { borderTopWidth: 0.8, borderTopColor: INK, width: '100%', marginTop: 34, paddingTop: 3, textAlign: 'center' },

  footer: { position: 'absolute', left: 40, right: 40, bottom: 26, flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 0.5, borderTopColor: LINE, paddingTop: 6 },
})

const Rs = ({ v, style }) => <Text style={style}>{'₹ ' + money(v)}</Text>

export default function InvoicePdf({ inv }) {
  const t = inv.totals
  const payLines = [
    ['UPI ID', BUSINESS.payment.upiId],
    ['Account name', BUSINESS.payment.accountName],
    ['Bank', BUSINESS.payment.bank],
    ['Account no.', BUSINESS.payment.accountNo],
    ['IFSC', BUSINESS.payment.ifsc],
  ].filter(([, v]) => !isBlank(v))
  const bizAddress = BUSINESS.addressLines.filter((l) => !isBlank(l))
  const contact = [BUSINESS.phone, BUSINESS.email, BUSINESS.website].filter(Boolean).join('   |   ')

  return (
    <Document title={`Invoice ${inv.number}`} author={BUSINESS.name} subject={`Invoice ${inv.number}`}>
      <Page size="A4" style={s.page}>
        {/* ---------- Header ---------- */}
        <View style={s.header}>
          <View style={{ flexGrow: 1, paddingRight: 20 }}>
            <Text style={s.bizName}>{BUSINESS.name}</Text>
            <Text style={s.tagline}>{BUSINESS.tagline}</Text>
            {bizAddress.map((l) => <Text key={l} style={s.small}>{l}</Text>)}
            <Text style={s.small}>{contact}</Text>
          </View>
          <View style={s.titleBox}>
            <Text style={s.docTitle}>INVOICE</Text>
            <View style={{ marginTop: 12 }}>
              <View style={s.metaRow}><Text style={s.metaLabel}>Invoice No.</Text><Text style={s.metaValue}>{inv.number}</Text></View>
              <View style={s.metaRow}><Text style={s.metaLabel}>Date</Text><Text style={s.metaValue}>{inv.date}</Text></View>
              <View style={s.metaRow}><Text style={s.metaLabel}>Status</Text><Text style={s.metaValue}>{inv.status}</Text></View>
            </View>
          </View>
        </View>

        <View style={s.rule} />

        {/* ---------- Bill to + info ---------- */}
        <View style={s.twoCol}>
          <View style={s.billTo}>
            <Text style={s.label}>BILL TO</Text>
            <Text style={s.partyName}>{inv.billTo.name}</Text>
            {inv.billTo.lines.map((l, i) => <Text key={i} style={s.small}>{l}</Text>)}
            {inv.billTo.phone ? <Text style={s.small}>Phone: {inv.billTo.phone}</Text> : null}
            {inv.billTo.email ? <Text style={s.small}>Email: {inv.billTo.email}</Text> : null}
            {inv.billTo.gstin ? <Text style={s.small}>GSTIN: {inv.billTo.gstin}</Text> : null}
          </View>
          <View style={s.info}>
            <Text style={s.label}>DETAILS</Text>
            {inv.infoRows.map(([k, v]) => (
              <View key={k} style={s.metaRow}><Text style={s.metaLabel}>{k}</Text><Text style={s.metaValue}>{v}</Text></View>
            ))}
          </View>
        </View>

        {/* ---------- Items ---------- */}
        <View style={s.thead} fixed>
          <Text style={[s.th, s.cNo]}>#</Text>
          <Text style={[s.th, s.cDesc]}>DESCRIPTION</Text>
          <Text style={[s.th, s.cQty]}>QTY</Text>
          <Text style={[s.th, s.cRate]}>RATE</Text>
          <Text style={[s.th, s.cAmt]}>AMOUNT</Text>
        </View>
        {inv.items.map((it, i) => (
          <View key={i} style={s.tr} wrap={false}>
            <Text style={s.cNo}>{i + 1}</Text>
            <Text style={s.cDesc}>{it.description}</Text>
            <Text style={s.cQty}>{it.qty}</Text>
            <Rs v={it.rate} style={s.cRate} />
            <Rs v={it.amount} style={[s.cAmt, s.bold]} />
          </View>
        ))}

        {/* ---------- Totals ---------- */}
        <View style={s.summaryRow} wrap={false}>
          <View style={s.words}>
            <Text style={s.label}>AMOUNT IN WORDS</Text>
            <Text style={s.bold}>{amountInWords(t.total)}</Text>
            {inv.cancelled ? <Text style={[s.bold, { marginTop: 10 }]}>THIS INVOICE HAS BEEN CANCELLED.</Text> : null}
          </View>
          <View style={s.totals}>
            <View style={s.totLine}><Text>Subtotal</Text><Rs v={t.subtotal} /></View>
            {t.discount > 0 ? <View style={s.totLine}><Text>Discount</Text><Text>{'- ₹ ' + money(t.discount)}</Text></View> : null}
            {t.shippingLabel ? <View style={s.totLine}><Text>Shipping</Text><Text>{t.shippingLabel}</Text></View> : null}
            <View style={s.totStrong}><Text style={s.bold}>TOTAL</Text><Rs v={t.total} style={s.bold} /></View>
            {inv.showBalance ? (
              <View>
                <View style={[s.totLine, { marginTop: 4 }]}><Text>Amount paid</Text><Rs v={t.paid} /></View>
                <View style={s.balanceBox}><Text style={s.bold}>BALANCE DUE</Text><Rs v={t.balance} style={s.bold} /></View>
              </View>
            ) : null}
          </View>
        </View>

        {/* ---------- Payment history ---------- */}
        {inv.payments.length > 0 ? (
          <View style={s.section} wrap={false}>
            <Text style={s.label}>PAYMENTS RECEIVED</Text>
            <View style={s.payHead}>
              <Text style={[s.th, s.pDate]}>DATE</Text>
              <Text style={[s.th, s.pMethod]}>METHOD</Text>
              <Text style={[s.th, s.pRef]}>REFERENCE</Text>
              <Text style={[s.th, s.pAmt]}>AMOUNT</Text>
            </View>
            {inv.payments.map((p, i) => (
              <View key={i} style={s.payRow}>
                <Text style={s.pDate}>{p.date}</Text>
                <Text style={s.pMethod}>{p.method}</Text>
                <Text style={s.pRef}>{p.reference || '-'}</Text>
                <Rs v={p.amount} style={s.pAmt} />
              </View>
            ))}
          </View>
        ) : null}

        {/* ---------- Pay to (only while something is due) ---------- */}
        {inv.showPayTo && payLines.length > 0 ? (
          <View style={s.section} wrap={false}>
            <Text style={s.label}>PAY TO</Text>
            <View style={s.payTo}>
              {payLines.map(([k, v]) => (
                <View key={k} style={{ flexDirection: 'row' }}>
                  <Text style={[s.small, { width: 80 }]}>{k}</Text>
                  <Text style={s.bold}>{v}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* ---------- Notes + terms ---------- */}
        <View style={s.section} wrap={false}>
          {inv.notes ? (
            <View style={{ marginBottom: 8 }}>
              <Text style={s.label}>NOTES</Text>
              <Text style={s.small}>{inv.notes}</Text>
            </View>
          ) : null}
          <Text style={s.label}>TERMS</Text>
          {BUSINESS.gstNote ? (
            <View style={s.bullet}><Text style={[s.small, { width: 10 }]}>{'•'}</Text><Text style={[s.small, { flex: 1 }]}>{BUSINESS.gstNote}</Text></View>
          ) : null}
          {(inv.terms || BUSINESS.terms).map((tm, i) => (
            <View key={i} style={s.bullet}><Text style={[s.small, { width: 10 }]}>{'•'}</Text><Text style={[s.small, { flex: 1 }]}>{tm}</Text></View>
          ))}
        </View>

        {/* ---------- Signature ---------- */}
        <View style={s.signRow} wrap={false}>
          <Text style={[s.small, { width: 230 }]}>Thank you for your business.</Text>
          <View style={s.signBox}>
            <Text style={s.bold}>For {BUSINESS.name}</Text>
            <Text style={s.signLine}>Authorised Signatory</Text>
          </View>
        </View>

        {/* ---------- Footer ---------- */}
        <View style={s.footer} fixed>
          <Text style={s.small}>{BUSINESS.name}  |  Invoice {inv.number}</Text>
          <Text style={s.small} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>
    </Document>
  )
}
