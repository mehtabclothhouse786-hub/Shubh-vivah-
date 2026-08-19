import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Sparkles,
  Camera,
  Heart,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  X,
  Plus
} from 'lucide-react';
import { UserProfile } from '../types';
import { HINDU_CASTES, MUSLIM_CASTES, getCastesForReligion } from '../data/castes';

interface ProfileBuilderProps {
  initialData?: UserProfile;
  onComplete: (profile: UserProfile) => void;
  onCancel: () => void;
  language: 'hi' | 'en';
}

export const ProfileBuilder: React.FC<ProfileBuilderProps> = ({
  initialData,
  onComplete,
  onCancel,
  language
}) => {
  const [step, setStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState<Partial<UserProfile>>(
    initialData || {
      id: `user_${Date.now()}`,
      userId: `usr_${Date.now()}`,
      fullName: '',
      gender: 'male',
      age: 27,
      dob: '1998-05-15',
      heightFeet: 5,
      heightInches: 10,
      maritalStatus: 'Never Married',
      motherTongue: 'Hindi',
      religion: 'Hindu',
      caste: 'Brahmin',
      subCaste: 'Gour',
      highestEducation: 'B.Tech / M.Tech',
      collegeUniversity: 'IIT Delhi',
      occupation: 'Software Engineer',
      companyName: 'Microsoft India',
      annualIncomeLakhs: 28,
      isGovtJob: false,
      city: 'Gurugram',
      state: 'Haryana',
      country: 'India',
      bio: 'सांस्कृतिक पारिवारिक मूल्यों एवं आधुनिक जीवनशैली में संतुलन रखने वाला शांत एवं कर्तव्यनिष्ठ व्यक्तित्व।',
      mobile: '+91 98765 43210',
      email: 'user@example.com',
      photos: [
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800'
      ],
      isVerified: true,
      verificationStatus: 'verified',
      kundali: {
        rashi: 'सिंह (Leo)',
        nakshatra: 'मघा (Magha)',
        manglik: 'Non-Manglik',
        gotra: 'कश्यप',
        birthTime: '08:45 AM',
        birthPlace: 'Jaipur, Rajasthan'
      },
      family: {
        fatherOccupation: 'वरिष्ठ बैंक प्रबंधक (सेवानिवृत्त)',
        motherOccupation: 'गृहणी (Homemaker)',
        brothers: 1,
        sisters: 0,
        familyType: 'Joint Family',
        familyValues: 'Traditional',
        nativePlace: 'Jaipur, Rajasthan'
      },
      diet: 'Vegetarian',
      smoking: 'No',
      drinking: 'No',
      preferences: {
        minAge: 23,
        maxAge: 28,
        minHeightFeet: 5,
        maxHeightFeet: 6,
        religions: ['Hindu'],
        castes: ['Brahmin'],
        motherTongues: ['Hindi'],
        educationLevels: ['Bachelors', 'Masters'],
        occupations: ['Engineering', 'Finance'],
        locations: ['Delhi NCR', 'Jaipur', 'Mumbai'],
        diet: ['Vegetarian'],
        manglikPreference: 'Non-Manglik Only',
        minIncomeLakhs: 8
      },
      profileCreatedBy: 'Self',
      lastActive: 'अभी सक्रिय'
    }
  );

  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  const handleAddPhoto = () => {
    if (newPhotoUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        photos: [...(prev.photos || []), newPhotoUrl.trim()]
      }));
      setNewPhotoUrl('');
    }
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData as UserProfile);
  };

  return (
    <div id="profile-builder-container" className="bg-white rounded-[32px] shadow-2xl border border-[#E8E4DE] overflow-hidden">
      {/* Header in Natural Tones */}
      <div className="bg-[#5A5A40] p-6 text-white flex items-center justify-between border-b border-[#4A453E]/40">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#D4A373] text-white px-2.5 py-0.5 rounded-full">
            {language === 'hi' ? `चरण २ एवं ३: चरण ${step}/४` : `Step ${step}/4`}
          </span>
          <h2 className="text-xl font-serif font-bold mt-1">
            {language === 'hi' ? 'वैवाहिक बायोडाटा एवं प्रोफ़ाइल निर्माण' : 'Matrimonial Biodata Builder'}
          </h2>
        </div>
        <button onClick={onCancel} className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Dots */}
      <div className="flex bg-[#FAF9F6] border-b border-[#E8E4DE] px-6 py-3 justify-between text-xs font-semibold">
        {[
          { num: 1, title: language === 'hi' ? 'व्यक्तिगत विवरण' : 'Personal' },
          { num: 2, title: language === 'hi' ? 'शिक्षा एवं पेशा' : 'Career' },
          { num: 3, title: language === 'hi' ? 'कुंडली एवं परिवार' : 'Kundali & Family' },
          { num: 4, title: language === 'hi' ? 'फोटो एवं बायो' : 'Photos & Bio' },
        ].map((item) => (
          <div
            key={item.num}
            className={`flex items-center gap-2 ${
              step === item.num ? 'text-[#5A5A40] font-bold' : step > item.num ? 'text-[#D4A373]' : 'text-[#A69F92]'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                step === item.num
                  ? 'bg-[#5A5A40] text-white'
                  : step > item.num
                  ? 'bg-[#D4A373] text-white'
                  : 'bg-[#E8E4DE] text-[#8C8479]'
              }`}
            >
              {item.num}
            </span>
            <span className="hidden sm:inline">{item.title}</span>
          </div>
        ))}
      </div>

      {/* Form Content */}
      <form onSubmit={handleFinish} className="p-6 bg-[#FAF9F6] space-y-4">
        {/* STEP 1: PERSONAL & CONTACT */}
        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-[#5A5A40] mb-1">पूरा नाम (Full Name)</label>
              <input
                type="text"
                required
                value={formData.fullName || ''}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[#E8E4DE] rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#5A5A40] mb-1">आयु (Age in years)</label>
              <input
                type="number"
                value={formData.age || 26}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-white border border-[#E8E4DE] rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#5A5A40] mb-1">जन्म तिथि (Date of Birth)</label>
              <input
                type="date"
                value={formData.dob || '1998-05-15'}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[#E8E4DE] rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#5A5A40] mb-1">जन्म स्थान (Place of Birth)</label>
              <input
                type="text"
                value={formData.kundali?.birthPlace || 'Jaipur'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    kundali: { ...(formData.kundali as any), birthPlace: e.target.value }
                  })
                }
                className="w-full px-3 py-2 bg-white border border-[#E8E4DE] rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#5A5A40] mb-1">कद (Height in Feet/Inches)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Feet (5)"
                  value={formData.heightFeet || 5}
                  onChange={(e) => setFormData({ ...formData, heightFeet: Number(e.target.value) })}
                  className="w-1/2 px-3 py-2 bg-white border border-[#E8E4DE] rounded-xl outline-none"
                />
                <input
                  type="number"
                  placeholder="Inches (9)"
                  value={formData.heightInches || 9}
                  onChange={(e) => setFormData({ ...formData, heightInches: Number(e.target.value) })}
                  className="w-1/2 px-3 py-2 bg-white border border-[#E8E4DE] rounded-xl outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#5A5A40] mb-1">वैवाहिक स्थिति (Marital Status)</label>
              <select
                value={formData.maritalStatus || 'Never Married'}
                onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value as any })}
                className="w-full px-3 py-2 bg-white border border-[#E8E4DE] rounded-xl outline-none"
              >
                <option value="Never Married">अविवाहित (Never Married)</option>
                <option value="Divorced">तलाकशुदा (Divorced)</option>
                <option value="Widowed">विधुर / विधवा (Widowed)</option>
              </select>
            </div>
          </div>
        )}

        {/* STEP 2: CAREER & LOCATION */}
        {step === 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-[#5A5A40] mb-1">उच्चतम शिक्षा (Highest Degree)</label>
              <input
                type="text"
                placeholder="e.g. B.Tech / MBA / MBBS"
                value={formData.highestEducation || ''}
                onChange={(e) => setFormData({ ...formData, highestEducation: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[#E8E4DE] rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#5A5A40] mb-1">संस्थान / कॉलेज (College)</label>
              <input
                type="text"
                placeholder="e.g. IIT Delhi / Delhi University"
                value={formData.collegeUniversity || ''}
                onChange={(e) => setFormData({ ...formData, collegeUniversity: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[#E8E4DE] rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#5A5A40] mb-1">पेशा / पद (Occupation)</label>
              <input
                type="text"
                placeholder="e.g. Software Engineer / Bank PO"
                value={formData.occupation || ''}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[#E8E4DE] rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#5A5A40] mb-1">कंपनी / विभाग (Company)</label>
              <input
                type="text"
                placeholder="e.g. Google / Govt of India"
                value={formData.companyName || ''}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[#E8E4DE] rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#5A5A40] mb-1">वार्षिक आय (Annual Income in LPA)</label>
              <input
                type="number"
                placeholder="e.g. 18"
                value={formData.annualIncomeLakhs || 18}
                onChange={(e) => setFormData({ ...formData, annualIncomeLakhs: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-white border border-[#E8E4DE] rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#5A5A40] mb-1">वर्तमान शहर (City &amp; State)</label>
              <input
                type="text"
                placeholder="e.g. Gurugram, Haryana"
                value={formData.city || ''}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[#E8E4DE] rounded-xl outline-none"
              />
            </div>
          </div>
        )}

        {/* STEP 3: RELIGION, KUNDALI / DEEN & FAMILY */}
        {step === 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-[#5A5A40] mb-1">
                {language === 'hi' ? 'धर्म (Religion - हिन्दू अथवा मुस्लिम)' : 'Religion (Hindu or Muslim)'}
              </label>
              <select
                value={formData.religion || 'Hindu'}
                onChange={(e) => {
                  const rel = e.target.value;
                  const defaultCaste = rel === 'Muslim' ? 'Khan / Pathan' : 'Brahmin';
                  setFormData({
                    ...formData,
                    religion: rel,
                    caste: defaultCaste,
                    subCaste: ''
                  });
                }}
                className="w-full px-3 py-2 bg-white border border-[#E8E4DE] rounded-xl outline-none font-semibold text-[#5A5A40]"
              >
                <option value="Hindu">🕉️ हिन्दू (Hindu Matrimony)</option>
                <option value="Muslim">🌙 मुस्लिम (Muslim Nikah)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#5A5A40] mb-1">
                {formData.religion === 'Muslim'
                  ? (language === 'hi' ? 'बिरादरी चुनें (All Muslim Castes / Biradari)' : 'Muslim Biradari / Caste')
                  : (language === 'hi' ? 'जाति चुनें (All Hindu Castes)' : 'Hindu Caste / Community')}
              </label>
              <select
                value={formData.caste || (formData.religion === 'Muslim' ? 'Khan / Pathan' : 'Brahmin')}
                onChange={(e) => {
                  setFormData({ ...formData, caste: e.target.value, subCaste: '' });
                }}
                className="w-full px-3 py-2 bg-white border border-[#E8E4DE] rounded-xl outline-none font-medium text-[#4A453E]"
              >
                {(formData.religion === 'Muslim' ? MUSLIM_CASTES : HINDU_CASTES).map((c) => (
                  <option key={c.id} value={c.nameEn}>
                    {language === 'hi' ? c.nameHi : c.nameEn}
                  </option>
                ))}
                <option value="Custom">
                  {language === 'hi' ? '➕ अन्य / कस्टम (Type My Own)' : '➕ Other / Custom'}
                </option>
              </select>
            </div>

            {/* Custom Caste Input if needed */}
            {formData.caste === 'Custom' && (
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-[11px] font-bold text-[#D4A373] mb-1">
                  {language === 'hi' ? 'अपनी जाति / बिरादरी का नाम लिखें' : 'Type your Custom Caste / Biradari'}
                </label>
                <input
                  type="text"
                  placeholder={formData.religion === 'Muslim' ? 'उदा. क़ुरैशी, सिद्दीकी...' : 'उदा. गौर ब्राह्मण, राठौड़ राजपूत...'}
                  value={formData.subCaste || ''}
                  onChange={(e) => setFormData({ ...formData, subCaste: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#D4A373] rounded-xl outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-[#5A5A40] mb-1">
                {formData.religion === 'Muslim'
                  ? (language === 'hi' ? 'उप-बिरादरी / गोत्र / कबीला (Clan / Sub-caste)' : 'Clan / Sub-caste')
                  : (language === 'hi' ? 'उप-जाति / गोत्र (Sub-caste / Gotra)' : 'Sub-caste / Gotra')}
              </label>
              <input
                type="text"
                placeholder={
                  formData.religion === 'Muslim'
                    ? 'उदा. Yusufzai, Rizvi, Momin, Halai...'
                    : 'उदा. Kanyakubja, Sisodia, Garg, Kashi Gotra...'
                }
                value={formData.subCaste || ''}
                onChange={(e) => setFormData({ ...formData, subCaste: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[#E8E4DE] rounded-xl outline-none"
              />
            </div>

            {formData.religion === 'Muslim' ? (
              <>
                <div>
                  <label className="block text-[11px] font-bold text-[#5A5A40] mb-1">
                    {language === 'hi' ? 'मसलक / फ़िरक़ा (Maslak / Sect)' : 'Maslak / Sect'}
                  </label>
                  <select
                    value={formData.islamicDetails?.maslak || 'सुन्नी हनफ़ी (Sunni Hanafi)'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        islamicDetails: { ...(formData.islamicDetails || {}), maslak: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#E8E4DE] rounded-xl outline-none"
                  >
                    <option value="सुन्नी हनफ़ी (Sunni Hanafi)">सुन्नी हनफ़ी (Sunni Hanafi)</option>
                    <option value="सुन्नी बरेलवी (Sunni Barelvi)">सुन्नी बरेलवी (Sunni Barelvi)</option>
                    <option value="सुन्नी देवबंदी (Sunni Deobandi)">सुन्नी देवबंदी (Sunni Deobandi)</option>
                    <option value="अहले हदीस (Ahle Hadith)">अहले हदीस (Ahle Hadith)</option>
                    <option value="शिया (Shia Ithna Ashari)">शिया (Shia Ithna Ashari)</option>
                    <option value="अन्य / केवल मुस्लिम (Just Muslim)">अन्य / केवल मुस्लिम (Just Muslim)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5A5A40] mb-1">
                    {language === 'hi' ? 'नमाज़ की पाबंदी (Salah / Namaz)' : 'Namaz / Salah Frequency'}
                  </label>
                  <select
                    value={formData.islamicDetails?.namazSalah || 'प्रतिदिन ५ वक़्त (5 Times Daily)'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        islamicDetails: { ...(formData.islamicDetails || {}), namazSalah: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#E8E4DE] rounded-xl outline-none"
                  >
                    <option value="प्रतिदिन ५ वक़्त (5 Times Daily)">प्रतिदिन ५ वक़्त (5 Times Daily)</option>
                    <option value="नियमित (Regular)">नियमित (Regular)</option>
                    <option value="जुमा एवं अवसर (Jummah & Occasions)">जुमा एवं अवसर (Jummah & Occasions)</option>
                    <option value="प्रयासरत (Practicing)">प्रयासरत (Practicing)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5A5A40] mb-1">
                    {language === 'hi' ? 'हिजाब / दाढ़ी (Hijab / Beard)' : 'Hijab / Beard'}
                  </label>
                  <select
                    value={formData.islamicDetails?.hijabOrBeard || 'शालीन हिजाब (Modest)'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        islamicDetails: { ...(formData.islamicDetails || {}), hijabOrBeard: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#E8E4DE] rounded-xl outline-none"
                  >
                    <option value="शालीन हिजाब (Modest Hijab)">शालीन हिजाब (Modest Hijab)</option>
                    <option value="सुन्नत दाढ़ी (Sunnah Beard)">सुन्नत दाढ़ी (Sunnah Beard)</option>
                    <option value="आधुनिक शालीन (Modern Modest)">आधुनिक शालीन (Modern Modest)</option>
                    <option value="सख्त पर्दा (Niqab / Abaya)">सख्त पर्दा (Niqab / Abaya)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5A5A40] mb-1">
                    {language === 'hi' ? 'महर अपेक्षा (Mehr Expectation)' : 'Mehr Expectation'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. शरीयत के अनुसार / आपसी सहमति (As per Shariah)"
                    value={formData.islamicDetails?.mehrExpectation || 'शरीयत के अनुसार (As per Shariah)'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        islamicDetails: { ...(formData.islamicDetails || {}), mehrExpectation: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#E8E4DE] rounded-xl outline-none"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-[11px] font-bold text-[#5A5A40] mb-1">गोत्र (Gotra)</label>
                  <input
                    type="text"
                    placeholder="e.g. Kashyap, Bhardwaj, Vashishtha"
                    value={formData.kundali?.gotra || 'कश्यप'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        kundali: { ...formData.kundali!, gotra: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#E8E4DE] rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5A5A40] mb-1">मांगलिक स्थिति (Manglik Status)</label>
                  <select
                    value={formData.kundali?.manglik || 'नहीं (Non-Manglik)'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        kundali: { ...formData.kundali!, manglik: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#E8E4DE] rounded-xl outline-none"
                  >
                    <option value="नहीं (Non-Manglik)">नहीं (Non-Manglik)</option>
                    <option value="हाँ (Manglik)">हाँ (Manglik)</option>
                    <option value="आंशिक (Anshik Manglik)">आंशिक (Anshik Manglik)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5A5A40] mb-1">राशि (Rashi)</label>
                  <input
                    type="text"
                    placeholder="e.g. सिंह (Leo), मेष (Aries)"
                    value={formData.kundali?.rashi || 'सिंह (Leo)'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        kundali: { ...formData.kundali!, rashi: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#E8E4DE] rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5A5A40] mb-1">नक्षत्र (Nakshatra)</label>
                  <input
                    type="text"
                    placeholder="e.g. मघा (Magha), रोहिणी (Rohini)"
                    value={formData.kundali?.nakshatra || 'मघा (Magha)'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        kundali: { ...formData.kundali!, nakshatra: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#E8E4DE] rounded-xl outline-none"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-[11px] font-bold text-[#5A5A40] mb-1">पिताजी का व्यवसाय (Father&apos;s Occupation)</label>
              <input
                type="text"
                placeholder="e.g. Senior Bank Manager / Businessman"
                value={formData.family?.fatherOccupation || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    family: { ...formData.family!, fatherOccupation: e.target.value }
                  })
                }
                className="w-full px-3 py-2 bg-white border border-[#E8E4DE] rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#5A5A40] mb-1">माताजी का व्यवसाय (Mother&apos;s Occupation)</label>
              <input
                type="text"
                placeholder="e.g. Homemaker / Teacher"
                value={formData.family?.motherOccupation || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    family: { ...formData.family!, motherOccupation: e.target.value }
                  })
                }
                className="w-full px-3 py-2 bg-white border border-[#E8E4DE] rounded-xl outline-none"
              />
            </div>
          </div>
        )}

        {/* STEP 4: PHOTOS & BIO */}
        {step === 4 && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-[#5A5A40] mb-1">
                {language === 'hi' ? 'आत्मपरिचय एवं अपेक्षाएं (Bio)' : 'About Yourself & Partner Expectations'}
              </label>
              <textarea
                rows={3}
                required
                value={formData.bio || ''}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="अपने स्वभाव, जीवन मूल्यों, शौक और साथी से अपेक्षाओं के बारे में संक्षेप में लिखें..."
                className="w-full px-3 py-2 bg-white border border-[#E8E4DE] rounded-xl outline-none text-[#4A453E]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#5A5A40] mb-1">
                {language === 'hi' ? 'प्रोफ़ाइल फोटो URL जोड़ें' : 'Add Photo Image URL'}
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border border-[#E8E4DE] rounded-xl outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddPhoto}
                  className="px-4 py-2 bg-[#5A5A40] text-white rounded-xl font-bold hover:bg-[#4a4a35] cursor-pointer"
                >
                  + फोटो जोड़ें
                </button>
              </div>

              {/* Photos Gallery preview */}
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.photos?.map((url, i) => (
                  <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#E8E4DE]">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    {i === 0 && (
                      <span className="absolute bottom-0 inset-x-0 bg-[#D4A373] text-white text-[8px] text-center font-bold">
                        {language === 'hi' ? 'मुख्य' : 'Cover'}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          photos: formData.photos?.filter((_, idx) => idx !== i)
                        })
                      }
                      className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Curated Sample Portraits picker */}
              <div className="mt-3 pt-3 border-t border-[#E8E4DE]">
                <span className="text-[10px] text-[#8C8479] font-bold block mb-1.5">
                  {language === 'hi' ? 'या त्वरित प्रमाणित नमूना पोर्ट्रेट चुनें:' : 'Or select verified sample portraits:'}
                </span>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {(formData.gender === 'female'
                    ? [
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80'
                      ]
                    : [
                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop&q=80'
                      ]
                  ).map((sUrl, sIdx) => (
                    <img
                      key={sIdx}
                      src={sUrl}
                      alt="Sample"
                      onClick={() => {
                        if (!formData.photos?.includes(sUrl)) {
                          setFormData({
                            ...formData,
                            photos: [...(formData.photos || []), sUrl]
                          });
                        }
                      }}
                      className="w-12 h-14 rounded-lg object-cover border border-[#E8E4DE] hover:border-[#D4A373] cursor-pointer hover:scale-105 transition-all shrink-0"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="pt-4 border-t border-[#E8E4DE] flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="px-4 py-2 rounded-full border border-[#E8E4DE] bg-white text-[#5A5A40] font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{language === 'hi' ? 'पिछला' : 'Back'}</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="px-6 py-2.5 bg-[#5A5A40] hover:bg-[#4a4a35] text-white rounded-full font-bold text-xs flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <span>{language === 'hi' ? 'अगला चरण' : 'Next Step'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              className="px-8 py-2.5 bg-[#D4A373] hover:bg-[#c49262] text-white rounded-full font-bold text-xs shadow-md shadow-[#D4A373]/20 flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{language === 'hi' ? 'बायोडाटा प्रकाशित करें' : 'Publish Matrimonial Profile'}</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
