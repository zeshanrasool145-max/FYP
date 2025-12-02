export const MOCK_LOCATIONS = [
  "Okara, Punjab",
  "Sahiwal, Punjab",
  "Faisalabad, Punjab",
  "Lahore, Punjab",
  "Multan, Punjab"
];

export const CROP_TYPES = [
  "Wheat",
  "Rice",
  "Cotton",
  "Sugarcane",
  "Maize",
  "Potato"
];

export const INITIAL_LISTINGS = [
  {
    id: '1',
    farmerName: 'Fazal-U-Rasool',
    cropType: 'Wheat',
    quantity: 500,
    quality: 'A',
    location: 'Okara, Punjab',
    basePrice: 4500,
    description: 'High quality golden wheat, freshly harvested. Moisture content below 12%.',
    imageUrl: 'https://picsum.photos/seed/wheat/400/300',
    status: 'OPEN',
    offers: [
      { id: 'o1', brokerName: 'Waqas Traders', amount: 4400, timestamp: Date.now() - 100000 },
      { id: 'o2', brokerName: 'Ali Grains', amount: 4550, timestamp: Date.now() - 50000 }
    ],
    createdAt: Date.now() - 200000
  },
  {
    id: '2',
    farmerName: 'Qamar Hanif',
    cropType: 'Maize',
    quantity: 1200,
    quality: 'B',
    location: 'Sahiwal, Punjab',
    basePrice: 3200,
    description: 'Hybrid maize suitable for poultry feed.',
    imageUrl: 'https://picsum.photos/seed/maize/400/300',
    status: 'OPEN',
    offers: [],
    createdAt: Date.now() - 500000
  }
];