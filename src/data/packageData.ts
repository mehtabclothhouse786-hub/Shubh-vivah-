import { MarriagePackage, ServiceChargeConfig, PaymentTransaction, MarriageCommissionRecord } from '../types';

export const INITIAL_PACKAGES: MarriagePackage[] = [
  {
    id: 'pkg_20000',
    name: 'Royal Vivah Elite (VIP)',
    nameHindi: 'रॉयल विवाह / निकाह एलीट (VIP)',
    price: 20000,
    originalPrice: 25000,
    durationDays: 365,
    connects: 999,
    commissionOnMarriage: 5000,
    taglineHindi: 'समर्पित रिलेशनशिप मैनेजर, 1-on-1 बैकग्राउंड वेरिफिकेशन व संपूर्ण विवाह सहयोग',
    taglineEn: 'VIP Relationship Manager, 1-on-1 Background Check & Full Wedding Assistance',
    features: [
      'Dedicated Senior Relationship Manager (RM)',
      'Unlimited Direct Verified Phone & Video Connects',
      'Doorstep / Offline Family Background Verification',
      'Priority Top Featured Profile Placement (10x Views)',
      'Personalized Astrological & Sharia Istikhara Reports',
      'Mandap / Nikahnama / Marriage Registrar Concierge',
      'Zero Hidden Charges & Direct Family Introductions'
    ],
    featuresHindi: [
      'व्यक्तिगत सीनियर रिलेशनशिप मैनेजर (RM) सहयोग',
      'असीमित (Unlimited) डायरेक्ट फोन व वीडियो कनेक्ट्स',
      'घर/कार्यालय स्तर पर पारिवारिक बैकग्राउंड सत्यापन',
      'सर्च में सबसे ऊपर टॉप फीचर्ड प्रोफाइल (१० गुना अधिक रिश्ते)',
      'विस्तृत ज्योतिषीय गुण मिलान व शरई इस्तिक़ामत रिपोर्ट',
      'मंडप, निकाहनामा व मैरिज सर्टिफिकेट रजिस्ट्रार असिस्टेंस',
      'बिना किसी हिडन चार्ज के डायरेक्ट पारिवारिक मीटिंग'
    ],
    isPopular: false,
    isElite: true,
    isActive: true,
    colorScheme: 'platinum'
  },
  {
    id: 'pkg_10000',
    name: 'Gold Premium Vivah',
    nameHindi: 'गोल्ड प्रीमियम विवाह पैकेज',
    price: 10000,
    originalPrice: 13000,
    durationDays: 180,
    connects: 50,
    commissionOnMarriage: 3000,
    taglineHindi: 'सर्वाधिक लोकप्रिय • 50 डायरेक्ट कनेक्ट्स व पर्सनल मैचमेकिंग सपोर्ट',
    taglineEn: 'Most Popular • 50 Direct Connects & Matchmaking Executive',
    features: [
      '50 Direct Verified Family Phone Contacts',
      'Assigned Matrimonial Executive for 6 Months',
      'High Priority Profile Boost (5x Visibility)',
      'Comprehensive 36-Gun Kundali & Horoscope Matching',
      'Direct WhatsApp & Family Connect Facility',
      'Digital Marriage Registration Certificate Kit'
    ],
    featuresHindi: [
      '५० सीधे सत्यापित पारिवारिक फोन व व्हाट्सऐप नंबर',
      '६ माह हेतु समर्पित वैवाहिक कोऑर्डिनेटर का सहयोग',
      'हाई प्रायोरिटी प्रोफाइल बूस्ट (५ गुना दृश्यता)',
      'संपूर्ण ३६-गुण अष्टकूट एवं मांगलिक दोष विश्लेषण',
      'डायरेक्ट व्हाट्सऐप एवं फैमिली कॉन्फ्रेंस सुविधा',
      'डिजिटल मैरिज रजिस्ट्रेशन व निकाहनामा सर्टिफिकेट'
    ],
    isPopular: true,
    isElite: false,
    isActive: true,
    colorScheme: 'gold'
  },
  {
    id: 'pkg_5000',
    name: 'Silver Standard Vivah',
    nameHindi: 'सिल्वर स्टैंडर्ड विवाह पैकेज',
    price: 5000,
    originalPrice: 7000,
    durationDays: 90,
    connects: 25,
    commissionOnMarriage: 1500,
    taglineHindi: 'विश्वसनीय मैचमेकिंग • 25 डायरेक्ट फोन संपर्कों की सुविधा',
    taglineEn: 'Reliable Matching • 25 Verified Phone Numbers & Chat',
    features: [
      '25 Direct Verified Family Phone Numbers',
      'Official KYC Verified Profile Badge',
      'Ashtakoota & Manglik Dosha Analysis Report',
      'Unlimited Secure Direct Messaging & Chat',
      'Family Biodata PDF Generator & Share'
    ],
    featuresHindi: [
      '२५ सीधे सत्यापित परिवार के फोन नंबर',
      'आधिकारिक आधार/केवाईसी वेरिफाइड प्रोफाइल बैज',
      'अष्टकूट गुण मिलान एवं मांगलिक रिपोर्ट',
      'असीमित सुरक्षित मैसेजिंग एवं चैट सुविधा',
      'आकर्षक पारिवारिक बायोडाटा पीडीएफ डाउनलोड'
    ],
    isPopular: false,
    isElite: false,
    isActive: true,
    colorScheme: 'silver'
  },
  {
    id: 'pkg_500',
    name: 'Basic Starter Pack',
    nameHindi: 'बेसिक स्टार्टर पैक',
    price: 500,
    originalPrice: 1000,
    durationDays: 30,
    connects: 5,
    commissionOnMarriage: 500,
    taglineHindi: 'शुरुआती खोज हेतु • 5 सत्यापित संपर्क व बेसिक मैचिंग',
    taglineEn: 'Initial Search • 5 Verified Contacts & Profile Access',
    features: [
      '5 Direct Verified Phone Numbers',
      'Basic Horoscope & Family Details View',
      'Send & Receive Unlimited Interests',
      'Standard In-App Messaging Support'
    ],
    featuresHindi: [
      '५ सीधे सत्यापित पारिवारिक फोन नंबर',
      'बेसिक कुंडली विवरण एवं परिवार प्रोफाइल एक्सेस',
      'असीमित इंटरेस्ट (रुचि) भेजने की सुविधा',
      'मानक इन-ऐप चैट व मैसेजिंग सपोर्ट'
    ],
    isPopular: false,
    isElite: false,
    isActive: true,
    colorScheme: 'bronze'
  }
];

export const INITIAL_SERVICE_CHARGE_CONFIG: ServiceChargeConfig = {
  startServiceCharge: 1000,
  isEnabled: true,
  chargeTitleHindi: 'प्रारंभिक विवाह सेवा एवं फ़ाइल पंजीकरण शुल्क',
  chargeTitleEn: 'Start Service & File Registration Charge',
  descriptionHindi: '१००% आधार/केवाईसी सत्यापन, व्यक्तिगत कुंडली/इस्तिक़ामत मिलान एवं पहली पारिवारिक परामर्श सेवा शामिल है।',
  descriptionEn: 'Includes 100% Aadhaar/KYC verification, horoscope compatibility analysis, and onboarding by relationship manager.',
  mandatoryForMatchmaking: false,
  includeKycVerification: true,
  includeKundaliCheck: true,
  includeFirstConsultation: true,
  discountPercentage: 0
};

export const INITIAL_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 'tx_101',
    userId: 'user_groom_1',
    userName: 'रोहन शर्मा (Rohan Sharma)',
    userMobile: '9876543210',
    type: 'start_service_charge',
    amount: 1000,
    paymentMethod: 'UPI',
    status: 'completed',
    transactionDate: '2026-08-10',
    invoiceNumber: 'SV-SVC-2026-101',
    notes: 'प्रारंभिक सेवा शुल्क (Start Service Charge) - आधार व कुंडली सत्यापन'
  },
  {
    id: 'tx_102',
    userId: 'user_groom_1',
    userName: 'रोहन शर्मा (Rohan Sharma)',
    userMobile: '9876543210',
    type: 'marriage_package',
    packageId: 'pkg_10000',
    packageName: 'गोल्ड प्रीमियम विवाह पैकेज (₹10,000)',
    amount: 10000,
    paymentMethod: 'UPI',
    status: 'completed',
    transactionDate: '2026-08-11',
    invoiceNumber: 'SV-PKG-2026-204',
    notes: 'गोल्ड पैकेज 6 माह सब्सक्रिप्शन'
  },
  {
    id: 'tx_103',
    userId: 'user_groom_2',
    userName: 'फ़ैज़ान खान (Faizan Khan)',
    userMobile: '9823456789',
    type: 'marriage_package',
    packageId: 'pkg_20000',
    packageName: 'रॉयल विवाह / निकाह एलीट (VIP ₹20,000)',
    amount: 20000,
    paymentMethod: 'NetBanking',
    status: 'completed',
    transactionDate: '2026-08-12',
    invoiceNumber: 'SV-PKG-2026-305',
    notes: 'रॉयल वीआईपी पैकेज 1 वर्ष'
  },
  {
    id: 'tx_104',
    userId: 'user_bride_1',
    userName: 'अनन्या वर्मा (Ananya Verma)',
    userMobile: '9765432109',
    type: 'start_service_charge',
    amount: 1000,
    paymentMethod: 'UPI',
    status: 'completed',
    transactionDate: '2026-08-14',
    invoiceNumber: 'SV-SVC-2026-109',
    notes: 'प्रारंभिक सेवा शुल्क - वधू पक्ष'
  },
  {
    id: 'tx_105',
    userId: 'user_groom_3',
    userName: 'अमित पटेल (Amit Patel)',
    userMobile: '9811223344',
    type: 'marriage_package',
    packageId: 'pkg_5000',
    packageName: 'सिल्वर स्टैंडर्ड विवाह पैकेज (₹5,000)',
    amount: 5000,
    paymentMethod: 'Card',
    status: 'completed',
    transactionDate: '2026-08-15',
    invoiceNumber: 'SV-PKG-2026-401',
    notes: 'सिल्वर 90 दिन पैकेज'
  },
  {
    id: 'tx_106',
    userId: 'user_bride_3',
    userName: 'सिमरन कौर (Simran Kaur)',
    userMobile: '9988776655',
    type: 'marriage_package',
    packageId: 'pkg_500',
    packageName: 'बेसिक स्टार्टर पैक (₹500)',
    amount: 500,
    paymentMethod: 'UPI',
    status: 'completed',
    transactionDate: '2026-08-16',
    invoiceNumber: 'SV-PKG-2026-508',
    notes: 'बेसिक 5 संपर्क'
  },
  {
    id: 'tx_107',
    userId: 'user_groom_1',
    userName: 'रोहन शर्मा (Rohan Sharma)',
    userMobile: '9876543210',
    partnerName: 'पूजा अय्यर (Pooja Iyer)',
    type: 'marriage_commission',
    amount: 3000,
    paymentMethod: 'UPI',
    status: 'completed',
    transactionDate: '2026-08-17',
    invoiceNumber: 'SV-COM-2026-801',
    notes: 'सफल विवाह कमीशन - गोल्ड पैकेज सेटलमेंट'
  }
];

export const INITIAL_COMMISSION_RECORDS: MarriageCommissionRecord[] = [
  {
    id: 'com_01',
    groomId: 'user_groom_1',
    groomName: 'रोहन शर्मा (Rohan Sharma)',
    brideId: 'user_bride_2',
    brideName: 'पूजा अय्यर (Pooja Iyer)',
    weddingDate: '2026-08-18',
    packageTier: 'Gold Premium (₹10,000)',
    packagePrice: 10000,
    commissionAmount: 3000,
    serviceChargePaid: 1000,
    status: 'paid',
    settlementDate: '2026-08-17',
    receiptNumber: 'REC-VIVAH-2026-801',
    paymentMode: 'Google Pay UPI',
    assignedManager: 'पंडित राजेश शास्त्री (सीनियर काउंसलर)'
  },
  {
    id: 'com_02',
    groomId: 'user_groom_2',
    groomName: 'फ़ैज़ान खान (Faizan Khan)',
    brideId: 'user_bride_4',
    brideName: 'ज़ोया सिद्दीकी (Zoya Siddiqui)',
    weddingDate: '2026-09-05',
    packageTier: 'Royal VIP Elite (₹20,000)',
    packagePrice: 20000,
    commissionAmount: 5000,
    serviceChargePaid: 1000,
    status: 'pending',
    receiptNumber: 'REC-NIKAH-2026-802',
    paymentMode: 'Net Banking / Desk',
    assignedManager: 'मौलाना ज़ाहिद हुसैन (निकाह कोऑर्डिनेटर)'
  },
  {
    id: 'com_03',
    groomId: 'user_groom_3',
    groomName: 'अमित पटेल (Amit Patel)',
    brideId: 'user_bride_1',
    brideName: 'अनन्या वर्मा (Ananya Verma)',
    weddingDate: '2026-08-25',
    packageTier: 'Silver Standard (₹5,000)',
    packagePrice: 5000,
    commissionAmount: 1500,
    serviceChargePaid: 1000,
    status: 'pending',
    receiptNumber: 'REC-VIVAH-2026-803',
    assignedManager: 'सुश्री रेखा देसाई'
  }
];
