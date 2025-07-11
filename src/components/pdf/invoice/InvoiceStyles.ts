import { StyleSheet } from '@react-pdf/renderer';

export const invoiceStyles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 20,
    fontSize: 10,
    fontFamily: 'Helvetica'
  },
  header: {
    marginBottom: 20,
    borderBottom: '1px solid #000',
    paddingBottom: 10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  companyInfo: {
    marginBottom: 10
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5
  },
  row: {
    flexDirection: 'row',
    marginBottom: 2
  },
  invoiceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  leftColumn: {
    flex: 1
  },
  rightColumn: {
    flex: 1
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 3
  },
  label: {
    width: 120,
    fontWeight: 'bold'
  },
  value: {
    flex: 1
  },
  clientSection: {
    marginBottom: 20,
    padding: 10,
    border: '1px solid #cccccc'
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 5,
    borderBottom: '1px solid #cccccc'
  },
  tableRow: {
    flexDirection: 'row',
    padding: 5,
    borderBottom: '1px solid #eeeeee'
  },
  col1: { width: '20%' },
  col2: { width: '15%' },
  col3: { width: '15%' },
  col4: { width: '15%' },
  col5: { width: '15%' },
  col6: { width: '20%' },
  totalsSection: {
    marginTop: 20,
    alignItems: 'flex-end'
  },
  totalRow: {
    flexDirection: 'row',
    width: 200,
    justifyContent: 'space-between',
    marginBottom: 3
  },
  totalLabel: {
    fontWeight: 'bold'
  },
  paymentSection: {
    marginTop: 20,
    marginBottom: 20
  },
  paymentTable: {
    border: '1px solid #cccccc',
    marginTop: 10
  },
  paymentHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 5,
    borderBottom: '1px solid #cccccc'
  },
  paymentRow: {
    flexDirection: 'row',
    padding: 5,
    borderBottom: '1px solid #eeeeee'
  },
  paymentCol1: { width: '12%' },
  paymentCol2: { width: '12%' },
  paymentCol3: { width: '12%' },
  paymentCol4: { width: '12%' },
  paymentCol5: { width: '12%' },
  paymentCol6: { width: '15%' },
  paymentCol7: { width: '10%' },
  paymentCol8: { width: '15%' },
  summarySection: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f9f9f9'
  },
  footer: {
    marginTop: 30,
    fontSize: 8,
    textAlign: 'center',
    borderTop: '1px solid #000',
    paddingTop: 10,
    color: '#666666'
  }
});