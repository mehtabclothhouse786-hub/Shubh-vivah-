import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Heart,
  Sparkles,
  MapPin,
  Briefcase,
  GraduationCap,
  Users,
  Calendar,
  Award,
  Printer,
  ChevronLeft,
  ChevronRight,
  Send,
  AlertTriangle
} from 'lucide-react';
import { UserProfile } from '../types';
import { calculateKundaliMilan } from '../utils/kundali';
import { generateMarriageBiodataHTML } from '../utils/biodataGenerator';

interface ProfileDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  currentUser: UserProfile;
  onSendInterest: (targetId: string) => void;
  interestStatus?: 'pending' | 'accepted' | 'declined' | 'none';
  onReportProfile: (profileId: string) => void;
  onOpenMarriageWorkflow?: (profile: UserProfile) => void;
  language: 'hi' | 'en';
}

export const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({
  isOpen,
  onClose,
  profile,
  currentUser,
  onSendInterest,
  interestStatus = 'none',
  onReportProfile,
  onOpenMarriageWorkflow,
  language
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'kundali' | 'family' | 'preferences'>('overview');
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  if (!isOpen) return null;

  const kundali = calculateKundaliMilan(currentUser, profile);

  const handlePrintBiodata = () => {
    const html = generateMarriageBiodataHTML(profile);
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);

    const doc = printFrame.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${profile.fullName} - Marriage Biodata</title>
            <meta charset="utf-8" />
            <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,700;1,400&display=swap" rel="stylesheet">
            <style>
              @page { size: A4; margin: 15mm; }
              body { margin: 0; padding: 10px; background: white; font-family: 'Cormorant Garamond', serif; }
            </style>
          </head>
          <body>
            ${html}
          </body>
        </html>
      `);
      doc.close();
      setTimeout(() => {
        printFrame.contentWindow?.focus();
        printFrame.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(printFrame);
        }, 1000);
      }, 500);
    }
  };

  return (
    <div id="profile-detail-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] shadow-2xl max-w-4xl w-full overflow-hidden border border-[#E8E4DE] my-8 flex flex-col max-h-[90vh]">
        {/* Top Header Banner in Natural Tones */}
        <div className="bg-[#5A5A40] p-6 text-white flex items-center justify-between relative border-b border-[#4A453E]/40">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={profile.photos[0]}
                alt={profile.fullName}
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
              />
              {profile.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-[#D4A373] text-white rounded-full p-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-serif font-bold">{profile.fullName}</h2>
                <span className="text-[10px] bg-white/10 text-[#E8E4DE] px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold border border-white/20">
                  ID: {profile.id}
                </span>
              </div>
              <p className="text-xs text-[#E8E4DE] mt-0.5">
                {profile.age} {language === 'hi' ? 'वर्ष' : 'yrs'} • {profile.heightFeet}&apos;{profile.heightInches}&quot; • {profile.religion} ({profile.caste}) • {profile.city}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintBiodata}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-bold transition-colors border border-white/20"
            >
              <Printer className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>{language === 'hi' ? 'बायोडाटा प्रिंट' : 'Print Biodata'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation in Natural Tones */}
        <div className="flex bg-[#FAF9F6] border-b border-[#E8E4DE] px-6 gap-2 pt-2 overflow-x-auto">
          {[
            { id: 'overview', hi: 'मुख्य विवरण (Overview)', en: 'Overview' },
            {
              id: 'kundali',
              hi: profile.religion === 'Muslim' ? 'इस्लामी व वैवाहिक अनुकूलता' : `अष्टकूट कुंडली (${kundali.totalPoints}/३६ गुण)`,
              en: profile.religion === 'Muslim' ? 'Islamic Compatibility' : `Kundali Milan (${kundali.totalPoints}/36)`
            },
            { id: 'family', hi: 'पारिवारिक पृष्ठभूमि (Family)', en: 'Family Background' },
            { id: 'preferences', hi: 'साथी की पसंद (Partner Preferences)', en: 'Partner Preferences' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[#D4A373] text-[#5A5A40]'
                  : 'border-transparent text-[#8C8479] hover:text-[#4A453E]'
              }`}
            >
              {language === 'hi' ? tab.hi : tab.en}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-[#FAF9F6]">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Photo Slider */}
              <div className="relative h-72 rounded-[24px] overflow-hidden bg-white border border-[#E8E4DE] shadow-xs">
                <img
                  src={profile.photos[activePhotoIdx]}
                  alt=""
                  className="w-full h-full object-cover object-top"
                />
                {profile.photos.length > 1 && (
                  <div className="absolute inset-y-0 inset-x-3 flex items-center justify-between">
                    <button
                      onClick={() => setActivePhotoIdx((prev) => (prev - 1 + profile.photos.length) % profile.photos.length)}
                      className="p-2 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-xs"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setActivePhotoIdx((prev) => (prev + 1) % profile.photos.length)}
                      className="p-2 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-xs"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {profile.photos.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${i === activePhotoIdx ? 'bg-[#D4A373]' : 'bg-white/60'}`}
                    />
                  ))}
                </div>
              </div>

              {/* Bio Statement */}
              <div className="bg-white p-5 rounded-[24px] border border-[#E8E4DE] shadow-xs">
                <h3 className="text-xs uppercase tracking-widest font-bold text-[#A69F92] mb-2">
                  {language === 'hi' ? 'आत्मपरिचय एवं जीवन दृष्टिकोण' : 'About Me'}
                </h3>
                <p className="text-xs text-[#4A453E] leading-relaxed italic">
                  &quot;{profile.bio}&quot;
                </p>
              </div>

              {/* Specifications Matrix in Natural Tones */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 text-xs">
                <div className="p-4 bg-white rounded-2xl border border-[#E8E4DE]">
                  <span className="text-[#8C8479] text-[11px] block">उच्चतम शिक्षा</span>
                  <strong className="text-[#5A5A40] text-sm font-serif">{profile.highestEducation}</strong>
                  <div className="text-[#8C8479] mt-0.5">{profile.college}</div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#E8E4DE]">
                  <span className="text-[#8C8479] text-[11px] block">पेशा एवं आय</span>
                  <strong className="text-[#5A5A40] text-sm font-serif">{profile.occupation}</strong>
                  <div className="text-[#D4A373] font-bold mt-0.5">₹{profile.annualIncomeLakhs} लाख/वर्ष ({profile.companyName})</div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#E8E4DE]">
                  <span className="text-[#8C8479] text-[11px] block">स्थान एवं गृह नगर</span>
                  <strong className="text-[#5A5A40] text-sm font-serif">{profile.city}, {profile.state}</strong>
                  <div className="text-[#8C8479] mt-0.5">पिन: {profile.pincode}</div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#E8E4DE]">
                  <span className="text-[#8C8479] text-[11px] block">
                    {profile.religion === 'Muslim' ? 'धर्म एवं बिरादरी' : 'धर्म, जाति एवं गोत्र'}
                  </span>
                  <strong className="text-[#5A5A40] text-sm font-serif">{profile.religion} ({profile.caste})</strong>
                  <div className="text-[#8C8479] mt-0.5">
                    {profile.religion === 'Muslim'
                      ? `मसलक: ${profile.islamicDetails?.maslak || 'सुन्नी हनफ़ी'}`
                      : `गोत्र: ${profile.kundali?.gotra || 'कश्यप'}`}
                  </div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#E8E4DE]">
                  <span className="text-[#8C8479] text-[11px] block">खान-पान एवं आदतें</span>
                  <strong className="text-[#5A5A40] text-sm font-serif">{profile.lifestyle.diet}</strong>
                  <div className="text-[#8C8479] mt-0.5">धूम्रपान: {profile.lifestyle.smoking}, मदिरा: {profile.lifestyle.drinking}</div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#E8E4DE]">
                  <span className="text-[#8C8479] text-[11px] block">प्रोफ़ाइल निर्माता</span>
                  <strong className="text-[#5A5A40] text-sm font-serif">{profile.profileCreatedBy} द्वारा</strong>
                  <div className="text-[#8C8479] mt-0.5">सत्यापन: {profile.isVerified ? 'सत्यापित' : 'प्रतीक्षारत'}</div>
                </div>
              </div>

              {profile.religion === 'Muslim' && profile.islamicDetails && (
                <div className="bg-white p-5 rounded-[24px] border border-[#E8E4DE] shadow-xs">
                  <h3 className="text-xs uppercase tracking-widest font-bold text-[#5A5A40] mb-3 flex items-center gap-1.5">
                    <span>🌙</span>
                    <span>{language === 'hi' ? 'दीनी एवं इस्लामी विवरण' : 'Islamic Lifestyle & Values'}</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#E8E4DE]">
                      <span className="text-[#8C8479] text-[11px] block">नमाज़ (Salah)</span>
                      <strong className="text-[#5A5A40]">{profile.islamicDetails.namazSalah || 'नियमित ५ वक़्त'}</strong>
                    </div>
                    <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#E8E4DE]">
                      <span className="text-[#8C8479] text-[11px] block">क़ुरआन मजीद</span>
                      <strong className="text-[#5A5A40]">{profile.islamicDetails.quranReading || 'दैनिक तिलावत'}</strong>
                    </div>
                    <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#E8E4DE]">
                      <span className="text-[#8C8479] text-[11px] block">रमज़ान रोज़े</span>
                      <strong className="text-[#5A5A40]">{profile.islamicDetails.fastingRoza || 'पूरे रोज़े'}</strong>
                    </div>
                    <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#E8E4DE]">
                      <span className="text-[#8C8479] text-[11px] block">हिजाब / दाढ़ी</span>
                      <strong className="text-[#5A5A40]">{profile.islamicDetails.hijabOrBeard || 'शालीन'}</strong>
                    </div>
                    <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#E8E4DE]">
                      <span className="text-[#8C8479] text-[11px] block">महर अपेक्षा</span>
                      <strong className="text-[#5A5A40]">{profile.islamicDetails.mehrExpectation || 'शरीयत अनुसार'}</strong>
                    </div>
                    <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#E8E4DE]">
                      <span className="text-[#8C8479] text-[11px] block">दीनी मूल्य</span>
                      <strong className="text-[#5A5A40]">{profile.islamicDetails.familyReligiousValues || 'दीनदार'}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: KUNDALI MILAN (36 GUNAS) */}
          {activeTab === 'kundali' && (
            <div className="space-y-5">
              <div className="bg-white p-6 rounded-[28px] border border-[#E8E4DE] flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-xs uppercase font-bold text-[#A69F92]">कुल अनुकूलता स्कोर</span>
                  <h3 className="text-3xl font-serif font-bold text-[#5A5A40]">
                    {kundali.totalPoints} / ३६ <span className="text-lg font-normal text-[#8C8479]">गुण प्राप्त</span>
                  </h3>
                  <p className="text-xs text-[#8C8479] mt-1">{kundali.summary}</p>
                </div>
                <div className="text-right">
                  <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#F5F5F0] text-[#5A5A40] border border-[#E8E4DE]">
                    {kundali.compatibilityLevel}
                  </span>
                </div>
              </div>

              {/* Ashta Koota 8-fold Table in Natural Tones */}
              <div className="bg-white rounded-[24px] border border-[#E8E4DE] overflow-hidden shadow-xs">
                <table className="min-w-full divide-y divide-[#E8E4DE] text-xs">
                  <thead className="bg-[#FAF9F6] text-[#5A5A40] font-serif font-bold">
                    <tr>
                      <th className="px-4 py-3 text-left">कूट (Koota)</th>
                      <th className="px-4 py-3 text-left">महत्व</th>
                      <th className="px-4 py-3 text-center">प्राप्त अंक</th>
                      <th className="px-4 py-3 text-left">विवरण</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F5F5F0] bg-white text-[#4A453E]">
                    {kundali.kootas.map((k, i) => (
                      <tr key={i} className="hover:bg-[#FAF9F6]">
                        <td className="px-4 py-2.5 font-semibold text-[#5A5A40]">{k.nameHindi}</td>
                        <td className="px-4 py-2.5 text-[#8C8479]">{k.name}</td>
                        <td className="px-4 py-2.5 text-center font-bold text-[#D4A373]">
                          {k.obtainedPoints} / {k.maxPoints}
                        </td>
                        <td className="px-4 py-2.5 text-[11px] text-[#8C8479]">{k.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: FAMILY */}
          {activeTab === 'family' && (
            <div className="bg-white p-6 rounded-[28px] border border-[#E8E4DE] space-y-4 shadow-xs">
              <h3 className="text-xs uppercase tracking-widest font-bold text-[#A69F92]">
                {language === 'hi' ? 'पारिवारिक मूल्य एवं पृष्ठभूमि' : 'Family Details'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-[#E8E4DE]">
                  <span className="text-[#8C8479] block text-[11px]">पिताजी का व्यवसाय</span>
                  <strong className="text-[#5A5A40] text-sm font-serif">{profile.family.fatherOccupation}</strong>
                </div>
                <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-[#E8E4DE]">
                  <span className="text-[#8C8479] block text-[11px]">माताजी का व्यवसाय</span>
                  <strong className="text-[#5A5A40] text-sm font-serif">{profile.family.motherOccupation}</strong>
                </div>
                <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-[#E8E4DE]">
                  <span className="text-[#8C8479] block text-[11px]">परिवार का प्रकार</span>
                  <strong className="text-[#5A5A40] text-sm font-serif">{profile.family.familyType}</strong>
                </div>
                <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-[#E8E4DE]">
                  <span className="text-[#8C8479] block text-[11px]">पारिवारिक मूल्य</span>
                  <strong className="text-[#5A5A40] text-sm font-serif">{profile.family.familyValues}</strong>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PARTNER PREFERENCES */}
          {activeTab === 'preferences' && (
            <div className="bg-white p-6 rounded-[28px] border border-[#E8E4DE] space-y-4 shadow-xs">
              <h3 className="text-xs uppercase tracking-widest font-bold text-[#A69F92]">
                {language === 'hi' ? 'साथी की अपेक्षाएं' : 'Partner Expectations'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-[#E8E4DE]">
                  <span className="text-[#8C8479] block text-[11px]">अपेक्षित आयु सीमा</span>
                  <strong className="text-[#5A5A40] text-sm font-serif">{profile.preferences.minAge} - {profile.preferences.maxAge} वर्ष</strong>
                </div>
                <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-[#E8E4DE]">
                  <span className="text-[#8C8479] block text-[11px]">न्यूनतम वार्षिक आय</span>
                  <strong className="text-[#D4A373] text-sm font-bold">₹{profile.preferences.minIncomeLakhs} लाख/वर्ष</strong>
                </div>
                <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-[#E8E4DE]">
                  <span className="text-[#8C8479] block text-[11px]">मांगलिक वरीयता</span>
                  <strong className="text-[#5A5A40] text-sm font-serif">{profile.preferences.manglikPreference}</strong>
                </div>
                <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-[#E8E4DE]">
                  <span className="text-[#8C8479] block text-[11px]">पसंदीदा शहर</span>
                  <strong className="text-[#5A5A40] text-sm font-serif">{profile.preferences.locations.join(', ')}</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Footer in Natural Tones */}
        <div className="p-4 bg-white border-t border-[#E8E4DE] flex items-center justify-between gap-3">
          <button
            onClick={() => onReportProfile(profile.id)}
            className="text-xs text-[#8C8479] hover:text-red-700 font-medium flex items-center gap-1"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'प्रोफ़ाइल रिपोर्ट करें' : 'Report Profile'}</span>
          </button>

          <div className="flex items-center gap-3">
            {onOpenMarriageWorkflow && (
              <button
                onClick={() => {
                  onClose();
                  onOpenMarriageWorkflow(profile);
                }}
                className="px-4 py-2.5 bg-[#F5F5F0] hover:bg-[#E8E4DE] text-[#5A5A40] border border-[#D4A373] rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
              >
                <span>💍</span>
                <span>{language === 'hi' ? 'विवाह/निकाह फ्लो देखें' : 'Marriage Workflow'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-[#FAF9F6] hover:bg-[#F5F5F0] text-[#5A5A40] border border-[#E8E4DE] rounded-full text-xs font-semibold"
            >
              {language === 'hi' ? 'बंद करें' : 'Close'}
            </button>

            {interestStatus === 'accepted' ? (
              <button
                disabled
                className="px-6 py-2.5 bg-[#F5F5F0] text-[#5A5A40] border border-[#5A5A40]/30 rounded-full text-xs font-bold"
              >
                <span>✓ {language === 'hi' ? 'स्वीकृत (Connected)' : 'Connected'}</span>
              </button>
            ) : interestStatus === 'pending' ? (
              <button
                disabled
                className="px-6 py-2.5 bg-[#FAF9F6] text-[#D4A373] border border-[#D4A373]/40 rounded-full text-xs font-bold"
              >
                <span>⏳ {language === 'hi' ? 'इंटरेस्ट भेजा गया' : 'Interest Sent'}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onSendInterest(profile.id);
                  onClose();
                }}
                className="px-7 py-2.5 bg-[#D4A373] hover:bg-[#c49262] text-white rounded-full text-xs font-bold shadow-md shadow-[#D4A373]/20 flex items-center gap-2 cursor-pointer transition-all"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>{language === 'hi' ? 'इंटरेस्ट भेजें (Send Interest)' : 'Send Interest'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
