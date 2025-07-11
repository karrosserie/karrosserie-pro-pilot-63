import { StyleSheet } from '@react-pdf/renderer';

export const pdfStyles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 8,
    paddingTop: 30,
    paddingBottom: 60,
    paddingHorizontal: 30,
  },
  section: {
    margin: 8,
    padding: 8,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 15,
    paddingBottom: 15,
  },
  headerColumn: {
    flex: 1,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#404348',
    padding: 6,
    textAlign: 'center',
    marginBottom: 12,
  },
  logo: {
    maxWidth: 120,
    maxHeight: 60,
    marginBottom: 8,
    objectFit: 'scale-down',
  },
  companyInfo: {
    fontSize: 7,
    lineHeight: 1.4,
    marginBottom: 8,
  },
  companyName: {
    fontSize: 8,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#404348',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
    fontSize: 7,
  },
  detailLabel: {
    fontWeight: 'bold',
    fontSize: 7,
  },
  detailValue: {
    fontSize: 7,
    textAlign: 'right',
  },
  table: {
    marginTop: 15,
    marginBottom: 15,
  },
  tableHeader: {
    backgroundColor: '#404348',
    flexDirection: 'row',
    padding: 6,
  },
  tableHeaderText: {
    color: 'white',
    fontSize: 7,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 6
  },
  tableCell: {
    fontSize: 7,
  },
  tableCellRight: {
    fontSize: 7,
    textAlign: 'right',
  },
  totalsSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
  },
  totalsBox: {
    width: 180,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    fontSize: 7,
  },
  totalRowBold: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    fontSize: 7,
    fontWeight: 'bold',
  },
  finalTotal: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    fontSize: 8,
  },
  amountDue: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: 10,
    textAlign: 'center',
    marginTop: 8,
  },
  amountDueText: {
    fontSize: 7,
    marginBottom: 2,
  },
  amountDueValue: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 5,
    color: '#666',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  paymentTable: {
    marginTop: 15,
    marginBottom: 15,
  },
});