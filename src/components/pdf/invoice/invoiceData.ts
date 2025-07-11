export const mockInvoiceData = {
  reference: '1',
  date: '06/05/2025',
  vehicle: {
    model: "I X1",
    brand: "BMW",
    license_plate: 'P837',
    mileage: '10000',
    fuel_level: "E"
  },
  company: {
    name: "DEMO GEOFFREY MOYA",
    address: "10 rue courteissade",
    zipCode: "13320",
    city: "Bouc bel air",
    country: "France",
    siren: "567890123",
    siret: "56789012300013",
    tva: "FR 567890123",
    phone: "+33650363126",
    email: "geoffrey.moya@gmail.com"
  },
  client: {
    nom: 'aaa',
    telephone: '+33612345678',
    email: 'geo@geo.fr',
    adresse: 'zfrrzfgrzf',
    zipCode: "13320",
    city: "Bouc bel air",
  },
  articles: [
    {
      description: 'peinture',
      quantity: '1',
      discount: '0',
      unitCost: '500,00',
      vat: '20',
      total: '500,00'
    },
    {
      description: 'mastic',
      quantity: '1',
      discount: '0',
      unitCost: '1.000,00',
      vat: '20',
      total: '1.000,00'
    }
  ],
  receipts: [
    {
      date: "01/06/2025",
      amount: "1000.00",
      reference: "",
      payment_method: "Virement bancaire",
      bank_account: "FR06000666544567876543456",
      notes: "paiement content"
    }
  ],
  notes: "aaaaa",
  amountHT: '1.500,00',
  amountVat: '300,00',
  amount: '1.800,00',
  payment_method: "especes",
  paidAmount: "1000.00",
  remainAmount: "800.00"
};