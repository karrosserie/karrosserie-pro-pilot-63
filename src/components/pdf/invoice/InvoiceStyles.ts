import { StyleSheet } from '@react-pdf/renderer';

export const invoiceStyles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 0,
    fontSize: 10,
    fontFamily: 'Helvetica'
  },
  headerSection: {
    backgroundColor: '#4a4a4a',
    color: 'white',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white'
  },
  mainContent: {
    padding: 20
  },
  topSection: {
    flexDirection: 'row',
    marginBottom: 20
  },
  leftInfo: {
    flex: 1,
    paddingRight: 20
  },
  rightInfo: {
    flex: 1,
    paddingLeft: 20
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333'
  },
  companyDetails: {
    fontSize: 9,
    marginBottom: 2,
    color: '#666'
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333'
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 4
  },
  label: {
    width: 80,
    fontSize: 9,
    color: '#666'
  },
  value: {
    flex: 1,
    fontSize: 9,
    color: '#333'
  },
  clientSection: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    marginBottom: 20,
    border: '1px solid #e9ecef'
  },
  clientTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333'
  },
  amountDueSection: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: 15,
    marginBottom: 20,
    textAlign: 'center'
  },
  amountDueLabel: {
    fontSize: 12,
    marginBottom: 5
  },
  amountDueValue: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  table: {
    marginBottom: 20
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#6c757d',
    color: 'white',
    padding: 8,
    fontSize: 10,
    fontWeight: 'bold'
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottom: '1px solid #dee2e6',
    fontSize: 9
  },
  tableRowEven: {
    backgroundColor: '#f8f9fa'
  },
  col1: { width: '35%', paddingRight: 5 },
  col2: { width: '10%', textAlign: 'center' },
  col3: { width: '15%', textAlign: 'right' },
  col4: { width: '10%', textAlign: 'center' },
  col5: { width: '10%', textAlign: 'center' },
  col6: { width: '20%', textAlign: 'right' },
  totalsSection: {
    marginTop: 20,
    alignItems: 'flex-end'
  },
  totalRow: {
    flexDirection: 'row',
    width: 250,
    justifyContent: 'space-between',
    marginBottom: 5,
    padding: 5
  },
  totalRowFinal: {
    backgroundColor: '#007bff',
    color: 'white',
    fontWeight: 'bold',
    padding: 10
  },
  totalLabel: {
    fontSize: 11
  },
  totalValue: {
    fontSize: 11,
    textAlign: 'right'
  },
  footer: {
    marginTop: 30,
    fontSize: 8,
    textAlign: 'center',
    color: '#666666',
    borderTop: '1px solid #dee2e6',
    paddingTop: 15
  },
  paymentSection: {
    marginTop: 20,
    marginBottom: 20
  },
  paymentTable: {
    border: '1px solid #dee2e6',
    marginTop: 10
  },
  paymentHeader: {
    flexDirection: 'row',
    backgroundColor: '#6c757d',
    color: 'white',
    padding: 5,
    fontSize: 9,
    fontWeight: 'bold'
  },
  paymentRow: {
    flexDirection: 'row',
    padding: 5,
    borderBottom: '1px solid #dee2e6',
    fontSize: 8
  },
  paymentCol1: { width: '12%' },
  paymentCol2: { width: '12%' },
  paymentCol3: { width: '12%' },
  paymentCol4: { width: '12%' },
  paymentCol5: { width: '12%' },
  paymentCol6: { width: '15%' },
  paymentCol7: { width: '25%' },
  summarySection: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f8f9fa',
    border: '1px solid #dee2e6'
  }
});