export type Gender = 'male' | 'female';

export type MaritalStatus = 'Never Married' | 'Divorced' | 'Awaiting Divorce' | 'Widowed';

export type DietType = 'Vegetarian' | 'Non-Vegetarian' | 'Eggetarian' | 'Jain' | 'Vegan';

export type ManglikStatus = 'Manglik' | 'Non-Manglik' | 'Anshik Manglik' | 'Don\'t Know';

export type FamilyType = 'Joint Family' | 'Nuclear Family';

export type FamilyValues = 'Traditional' | 'Moderate' | 'Liberal';

export interface IslamicDetails {
  maslak?: string;
  namazSalah?: string;
  quranReading?: string;
  fastingRoza?: string;
  hijabOrBeard?: string;
  mehrExpectation?: string;
  familyReligiousValues?: 'Very Religious' | 'Practicing' | 'Moderate' | 'Liberal';
}

export interface KundaliDetails {
  rashi: string;
  nakshatra: string;
  manglik: ManglikStatus;
  birthTime?: string;
  birthPlace?: string;
  gotra?: string;
  gana?: string;
}

export interface FamilyDetails {
  fatherOccupation: string;
  motherOccupation: string;
  brothers: number;
  sisters: number;
  familyType: FamilyType;
  familyValues: FamilyValues;
  nativePlace: string;
  familyIncomeAnnual?: string;
}

export interface PartnerPreferences {
  minAge: number;
  maxAge: number;
  minHeightFeet: number;
  maxHeightFeet: number;
  religions: string[];
  castes: string[];
  motherTongues: string[];
  educationLevels: string[];
  occupations: string[];
  locations: string[];
  diet: DietType[];
  manglikPreference: 'Any' | 'Non-Manglik Only' | 'Manglik Only';
  minIncomeLakhs: number;
}

export interface UserProfile {
  id: string;
  userId: string;
  fullName: string;
  gender: Gender;
  age: number;
  dob: string;
  heightFeet: number;
  heightInches: number;
  religion: 'Hindu' | 'Muslim' | string;
  caste: string;
  subCaste?: string;
  motherTongue: string;
  maritalStatus: MaritalStatus;
  city: string;
  state: string;
  country: string;
  mobile: string;
  email: string;
  
  // Education & Work
  highestEducation: string;
  collegeUniversity: string;
  occupation: string;
  companyName: string;
  annualIncomeLakhs: number;
  isGovtJob?: boolean;
  
  // Lifestyle & Bio
  diet: DietType;
  smoking: 'No' | 'Yes' | 'Occasionally';
  drinking: 'No' | 'Yes' | 'Occasionally';
  bio: string;
  photos: string[];
  
  // Kundali & Religious Details
  kundali: KundaliDetails;
  islamicDetails?: IslamicDetails;
  family: FamilyDetails;
  preferences: PartnerPreferences;
  
  // Status & Verification
  isVerified: boolean;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  govtIdType?: string;
  profileCreatedBy: 'Self' | 'Parents' | 'Sibling' | 'Relative' | 'Friend';
  lastActive: string;
  isFeatured?: boolean;
  isRishtaFixed?: boolean;
  fixedWithPartnerName?: string;
  fixedDate?: string;
  subscribedPackageId?: string;
  hasPaidServiceCharge?: boolean;
  commissionStatus?: 'pending' | 'paid' | 'waived';
  commissionAmount?: number;
}

export interface MarriagePackage {
  id: string;
  name: string;
  nameHindi: string;
  price: number; // 20000, 10000, 5000, 500
  originalPrice: number;
  durationDays: number;
  connects: number; // e.g. 5, 25, 50, 999 (unlimited)
  commissionOnMarriage: number; // e.g. 10000, 5000, 2500, 1000 or custom admin commission
  taglineHindi: string;
  taglineEn: string;
  features: string[];
  featuresHindi: string[];
  isPopular?: boolean;
  isElite?: boolean;
  isActive: boolean;
  colorScheme: 'gold' | 'platinum' | 'silver' | 'bronze';
}

export interface ServiceChargeConfig {
  startServiceCharge: number; // Default 1000
  isEnabled: boolean;
  chargeTitleHindi: string;
  chargeTitleEn: string;
  descriptionHindi: string;
  descriptionEn: string;
  mandatoryForMatchmaking: boolean;
  includeKycVerification: boolean;
  includeKundaliCheck: boolean;
  includeFirstConsultation: boolean;
  discountPercentage?: number;
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  userName: string;
  userMobile: string;
  partnerName?: string;
  type: 'start_service_charge' | 'marriage_package' | 'marriage_commission';
  packageId?: string;
  packageName?: string;
  amount: number;
  paymentMethod: 'UPI' | 'NetBanking' | 'Card' | 'Cash / Office Desk';
  status: 'completed' | 'pending' | 'refunded';
  transactionDate: string;
  invoiceNumber: string;
  notes?: string;
}

export interface MarriageCommissionRecord {
  id: string;
  groomId: string;
  groomName: string;
  brideId: string;
  brideName: string;
  weddingDate: string;
  packageTier: string;
  packagePrice: number;
  commissionAmount: number;
  serviceChargePaid: number;
  status: 'pending' | 'paid' | 'waived' | 'partially_paid';
  settlementDate?: string;
  receiptNumber?: string;
  paymentMode?: string;
  assignedManager?: string;
}

export interface InterestRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'declined';
  message?: string;
  sentAt: string;
  respondedAt?: string;
}

export interface ChatMessage {
  id: string;
  matchId: string; // e.g. senderId_receiverId
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  isMedia?: boolean;
  mediaUrl?: string;
  isFamilyContactCard?: boolean;
}

export interface AdminReport {
  id: string;
  reportedUserId: string;
  reporterUserId: string;
  reason: 'Fake Profile' | 'Inappropriate Photos' | 'Financial Fraud' | 'Already Married' | 'Misbehavior';
  details: string;
  status: 'pending' | 'reviewed' | 'action_taken' | 'dismissed';
  reportedAt: string;
}

export interface AshtaKootaGun {
  name: string;
  nameHindi: string;
  maxPoints: number;
  obtainedPoints: number;
  description: string;
  isFavorable: boolean;
}

export interface KundaliMilanReport {
  groomName: string;
  brideName: string;
  totalPoints: number;
  maxPoints: number;
  compatibilityLevel: 'उत्कृष्ट (Excellent)' | 'अच्छा (Good)' | 'औसत (Average)' | 'अस्वीकार्य (Not Recommended)';
  isManglikMatch: boolean;
  doshas: string[];
  kootas: AshtaKootaGun[];
  summary: string;
}

export interface ExpectationsAgreement {
  antiDowryPledgeAccepted: boolean;
  mehrAmount?: string;
  mehrType?: 'Mu\'ajjal (Prompt)' | 'Mu\'wajjal (Deferred)' | 'Partially Prompt';
  weddingBudgetShare: 'Equal 50-50' | 'Groom Family' | 'Bride Family' | 'Simple Court/Masjid/Mandir Wedding';
  livingArrangement: 'With Groom Parents (Joint)' | 'Independent Couple Residence' | 'Relocating to New City' | 'Mutual Decision';
  careerPlan: 'Full-time Working Supported' | 'Homemaker & Family' | 'Open / Flexible';
  specialNotes?: string;
}

export interface MarriageWorkflowStage {
  stepNumber: number;
  id: string;
  titleHi: string;
  titleEn: string;
  category: 'discovery' | 'discussion' | 'verification' | 'hindu_ceremony' | 'muslim_ceremony' | 'post_marriage';
  completed: boolean;
  notes?: string;
  completedDate?: string;
}

export interface MarriageWorkflowData {
  id: string;
  userId1: string;
  userId2: string;
  tradition: 'Hindu' | 'Muslim' | 'General';
  currentStepIndex: number;
  familyMeetingDate?: string;
  familyConsentStatus: 'pending' | 'consented' | 'further_discussion';
  communityCheckStatus: 'pending' | 'verified_by_relatives' | 'verified_by_community';
  communityReferences?: string[];
  weddingDate?: string;
  weddingVenue?: string;
  shubhMuhuratDetails?: string;
  expectations: ExpectationsAgreement;
  // Hindu Specific
  rokaDate?: string;
  mandapLocation?: string;
  panditName?: string;
  // Muslim Specific
  mangniDate?: string;
  qaziName?: string;
  witness1Name?: string;
  witness2Name?: string;
  vakilName?: string;
  // Final Status
  isCertificateIssued: boolean;
  certificateNumber?: string;
  registrationDate?: string;
}
