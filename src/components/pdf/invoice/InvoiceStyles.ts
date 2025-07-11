import { StyleSheet } from '@react-pdf/renderer';

export const invoiceStyles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 0,
    fontSize: 10,
    fontFamily: 'Helvetica'
  },
  
  // Header section with dark background
  headerBar: {
    backgroundColor: '#4a5568',
    paddingVertical: 12,
    paddingHorizontal: 20
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold'
  },
  
  // Main content area
  contentArea: {
    padding: 20
  },
  
  // Top section with company and invoice details
  topSection: {
    flexDirection: 'row',
    marginBottom: 25
  },
  
  // Left side - Company info
  leftPanel: {
    width: '40%',
    paddingRight: 20
  },
  companyLogo: {
    width: 60,
    height: 60,
    backgroundColor: '#2d3748',
    borderRadius: 30,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 5
  },
  companyDetails: {
    fontSize: 9,
    color: '#4a5568',
    marginBottom: 2
  },
  
  // Right side panels
  rightPanel: {
    width: '60%',
    paddingLeft: 20
  },
  
  // Details section
  detailsSection: {
    backgroundColor: '#f7fafc',
    padding: 15,
    marginBottom: 15,
    border: '1px solid #e2e8f0'
  },
  detailsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 10
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 4
  },
  detailLabel: {
    width: 90,
    fontSize: 9,
    color: '#4a5568'
  },
  detailValue: {
    flex: 1,
    fontSize: 9,
    color: '#2d3748',
    fontWeight: 'bold'
  },
  
  // Client section
  clientSection: {
    backgroundColor: '#f7fafc',
    padding: 15,
    border: '1px solid #e2e8f0'
  },
  clientTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 8
  },
  clientInfo: {
    fontSize: 9,
    color: '#2d3748',
    marginBottom: 2
  },
  
  // Amount due section - big blue box
  amountDueContainer: {
    backgroundColor: '#3182ce',
    padding: 20,
    marginVertical: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  amountDueLabel: {
    color: 'white',
    fontSize: 14,
    marginBottom: 5
  },
  amountDueValue: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold'
  },
  
  // Table styles
  tableContainer: {
    border: '1px solid #e2e8f0',
    marginBottom: 20
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#4a5568',
    paddingVertical: 10,
    paddingHorizontal: 8
  },
  tableHeaderText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold'
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottom: '1px solid #e2e8f0'
  },
  tableRowEven: {
    backgroundColor: '#f7fafc'
  },
  tableCell: {
    fontSize: 9,
    color: '#2d3748'
  },
  
  // Column widths
  colArticle: { width: '35%', paddingRight: 5 },
  colQuantity: { width: '10%', textAlign: 'center' },
  colUnitPrice: { width: '15%', textAlign: 'right' },
  colDiscount: { width: '10%', textAlign: 'center' },
  colTVA: { width: '10%', textAlign: 'center' },
  colTotal: { width: '20%', textAlign: 'right' },
  
  // Totals section
  totalsContainer: {
    alignItems: 'flex-end',
    marginTop: 20
  },
  totalRow: {
    flexDirection: 'row',
    width: 200,
    justifyContent: 'space-between',
    paddingVertical: 3,
    paddingHorizontal: 10
  },
  totalRowFinal: {
    backgroundColor: '#3182ce',
    color: 'white',
    fontWeight: 'bold'
  },
  totalLabel: {
    fontSize: 10
  },
  totalValue: {
    fontSize: 10,
    textAlign: 'right'
  },
  
  // Footer
  footer: {
    marginTop: 40,
    paddingTop: 15,
    borderTop: '1px solid #e2e8f0',
    fontSize: 8,
    color: '#4a5568',
    textAlign: 'center'
  },
  
  // Payment section
  paymentSection: {
    marginTop: 30
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 10
  }
});