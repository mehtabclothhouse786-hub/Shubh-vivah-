import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Circle,
  Calendar,
  Sparkles,
  Heart,
  Users,
  ShieldCheck,
  Award,
  Download,
  Printer,
  ChevronRight,
  ChevronDown,
  Info,
  Scroll,
  Coins,
  Home,
  Briefcase,
  AlertCircle,
  PartyPopper,
  Flame,
  Moon,
  Sun,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, MarriageWorkflowData, ExpectationsAgreement } from '../types';
import { generateMarriageCertificateHTML } from '../utils/marriageCertificateGenerator';
import { calculateKundaliMilan } from '../utils/kundali';

interface MarriageWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  partner: UserProfile;
  onOpenKundaliMilan: (partner: UserProfile) => void;
  onOpenFamilyConnect: (partner: UserProfile) => void;
  onOpenChat: (partnerId: string) => void;
  onMarkAsMarried: (partnerId: string, partnerName: string) => void;
  language: 'hi' | 'en';
}

export const MarriageWorkflowModal: React.FC<MarriageWorkflowModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  partner,
  onOpenKundaliMilan,
  onOpenFamilyConnect,
  onOpenChat,
  onMarkAsMarried,
  language
}) => {
  // Determine tradition based on partner and current user
  const isMuslimDefault = partner.religion === 'Muslim' || currentUser.religion === 'Muslim';
  const [selectedTradition, setSelectedTradition] = useState<'Hindu' | 'Muslim'>(
    isMuslimDefault ? 'Muslim' : 'Hindu'
  );

  // Workflow Data State
  const [workflowData, setWorkflowData] = useState<MarriageWorkflowData>({
    id: `workflow_${currentUser.id}_${partner.id}`,
    userId1: currentUser.id,
    userId2: partner.id,
    tradition: isMuslimDefault ? 'Muslim' : 'Hindu',
    currentStepIndex: 5, // Start with some initial progress for interactive feel
    familyConsentStatus: 'consented',
    familyMeetingDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    communityCheckStatus: 'verified_by_relatives',
    communityReferences: ['श्री विनोद कुमार (चाचाजी)', 'पंडित / मौलाना स्थानीय समिति'],
    weddingDate: new Date(Date.now() + 86400000 * 45).toISOString().split('T')[0],
    weddingVenue: `${partner.city || 'जयपुर'} हेरिटेज रिसॉर्ट एवं मंडप`,
    shubhMuhuratDetails: 'कार्तिक शुक्ल पक्ष, शुभ लग्न एवं अमृत सिद्धि योग',
    expectations: {
      antiDowryPledgeAccepted: true,
      mehrAmount: '₹1,51,000 / 5 तोला स्वर्ण',
      mehrType: "Mu'ajjal (Prompt)",
      weddingBudgetShare: 'Equal 50-50',
      livingArrangement: 'Independent Couple Residence',
      careerPlan: 'Full-time Working Supported',
      specialNotes: 'दोनों परिवारों की सहमति से सादगीपूर्ण एवं मर्यादापूर्ण वैवाहिक कार्यक्रम संपन्न होगा।'
    },
    rokaDate: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
    mandapLocation: 'शुभ विवाह वाटिका',
    panditName: 'पं. देवकीनंदन शास्त्री (वैदिक पुरोहित)',
    mangniDate: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
    qaziName: 'मौलाना मुफ़्ती मोहम्मद अकरम साहब',
    witness1Name: 'जनाब इमरान खान (मामा)',
    witness2Name: 'जनाब रईस अहमद (पारिवारिक गवाह)',
    vakilName: 'एडवोकेट तारिक जमाल',
    isCertificateIssued: false,
    certificateNumber: `SV-REG-2026-${Math.floor(100000 + Math.random() * 900000)}`,
    registrationDate: new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  });

  // Active viewing step tab / accordion
  const [activeStepTab, setActiveStepTab] = useState<number>(workflowData.currentStepIndex);
  const [showCertificatePreview, setShowCertificatePreview] = useState<boolean>(false);
  const [saptapadiActiveVow, setSaptapadiActiveVow] = useState<number>(0);

  if (!isOpen) return null;

  // Determine Groom & Bride
  const groom = currentUser.gender === 'male' ? currentUser : partner;
  const bride = currentUser.gender === 'female' ? currentUser : partner;

  // Kundali score calculate
  const kundaliScore = calculateKundaliMilan(groom, bride);

  // 7 Sacred Vows (सप्तपदी के 7 फेरे एवं वचन) for Hindu Vivah
  const SAPTAPADI_VOWS = [
    {
      round: 1,
      vowHi: 'पहला फेरा: प्रथमं धान्यं - अन्न, पोषण एवं स्वास्थ्य',
      descHi: 'वर एवं वधू एक-दूसरे के उत्तम स्वास्थ्य, पौष्टिक आहार एवं गृहस्थी की समृद्धि का संकल्प लेते हैं।',
      mantra: 'ॐ एकमिषे विष्णुस्त्वान्वेतु'
    },
    {
      round: 2,
      vowHi: 'दूसरा फेरा: द्वितीये बलं - मानसिक, शारीरिक एवं आत्मिक बल',
      descHi: 'जीवन के सुख-दुख में एक-दूसरे की शक्ति बनने और पारिवारिक मर्यादा की रक्षा का वचन।',
      mantra: 'ॐ द्वे ऊर्जे विष्णुस्त्वान्वेतु'
    },
    {
      round: 3,
      vowHi: 'तीसरा फेरा: तृतीये सुखं - धन, धर्म एवं समृद्धि',
      descHi: 'धर्म सम्मत आजीविका, पारिवारिक उन्नति और आध्यात्मिक कल्याण का साझा प्रयास।',
      mantra: 'ॐ त्रीणि रायस्पोषाय विष्णुस्त्वान्वेतु'
    },
    {
      round: 4,
      vowHi: 'चौथा फेरा: चतुर्थे मयोभव - आपसी प्रेम, सामंजस्य एवं परिवार सेवा',
      descHi: 'दोनों परिवारों के माता-पिता, गुरुजनों एवं संतानों के प्रति निष्ठा व आदर।',
      mantra: 'ॐ चत्वारि मायोभवाय विष्णुस्त्वान्वेतु'
    },
    {
      round: 5,
      vowHi: 'पाँचवाँ फेरा: पञ्चमे पशवः - उत्तम संतान एवं संस्कार',
      descHi: 'आदर्श, सुसंस्कृत एवं धर्मपरायण संतति के पालन-पोषण का संयुक्त संकल्प।',
      mantra: 'ॐ पञ्च पशुभ्यो विष्णुस्त्वान्वेतु'
    },
    {
      round: 6,
      vowHi: 'छठा फेरा: षष्ठे ऋतवः - हर ऋतु, समय व परिस्थिति में साथ',
      descHi: 'जीवन की प्रत्येक ऋतु व बदलाव में सदा अविचल प्रेम और सहयोग का वादा।',
      mantra: 'ॐ षड् ऋतुभ्यो विष्णुस्त्वान्वेतु'
    },
    {
      round: 7,
      vowHi: 'सातवाँ फेरा: सप्ते सखा - शाश्वत मित्रता एवं जीवनपर्यंत समर्पण',
      descHi: 'सच्चा मित्र बनकर एक प्राण दो देह की भांति आजीवन वैवाहिक धर्म का पालन।',
      mantra: 'ॐ सखे सप्तपदा भव सा मामनुव्रता भव'
    }
  ];

  // Islamic Nikah Pillars
  const ISLAMIC_NIKAH_PILLARS = [
    {
      titleHi: '१. ईजाब-ओ-क़ुबूल (Ijab-o-Qubool)',
      descHi: 'दूल्हा एवं दुल्हन दोनों की बिना किसी दबाव के स्वतंत्र एवं स्पष्ट रज़ामंदी ("क़ुबूल है")।',
      icon: '💍'
    },
    {
      titleHi: '२. तयशुदा मेहर (Mehr Settlement)',
      descHi: 'शौहर द्वारा ज़ौजा (पत्नी) को दिया जाने वाला अनिवार्य सम्मानजनक वित्तीय अधिकार व उपहार।',
      icon: '🪙'
    },
    {
      titleHi: '३. दो बालिग गवाह एवं वली (Witnesses & Wali)',
      descHi: 'निकाह की सत्यता व वैधता हेतु २ नेक मुस्लिम गवाह एवं वली/वक़ील की मौजूदगी।',
      icon: '📜'
    },
    {
      titleHi: '४. निकाहनामा पर हस्ताक्षर (Nikahnama Registry)',
      descHi: 'शरई शर्तों, मेहर की रकम व दोनों पक्षों के अधिकारों का आधिकारिक दस्तावेजीकरण।',
      icon: '✍️'
    },
    {
      titleHi: '५. सुन्नत वलीमा (Sunnah Walima Feast)',
      descHi: 'निकाह के पश्चात पारिवारिक दावत व समाज के साथ खुशियों का सुन्नत साझाकरण।',
      icon: '🍽️'
    }
  ];

  // Workflow steps definitions
  const ALL_STEPS = [
    {
      step: 1,
      id: 'step_search',
      titleHi: '१. रिश्ता ढूँढना (Partner Search)',
      titleEn: '1. Finding the Match',
      descHi: 'जाति, धर्म, शिक्षा, आय एवं स्थान के आधार पर उपयुक्त जीवनसाथी खोजना।'
    },
    {
      step: 2,
      id: 'step_profile',
      titleHi: '२. लड़का/लड़की की प्रोफ़ाइल देखना (View Profile)',
      titleEn: '2. Profile & Biodata Review',
      descHi: 'सत्यापित विवरण, तस्वीरें, शिक्षा, बायोडाटा एवं पारिवारिक पृष्ठभूमि की समीक्षा।'
    },
    {
      step: 3,
      id: 'step_family_info',
      titleHi: '३. परिवार की जानकारी लेना (Family Details)',
      titleEn: '3. Family Connect & Values',
      descHi: 'माता-पिता का व्यवसाय, भाई-बहन, पारिवारिक मूल्य, मूल निवास व संपर्क सूत्र।'
    },
    {
      step: 4,
      id: 'step_chat',
      titleHi: '४. पहली बातचीत / परिचय (First Chat & Intro)',
      titleEn: '4. First Conversation & Meeting',
      descHi: 'सुरक्षित संदेश प्रणाली के माध्यम से प्राथमिक बातचीत एवं विचारों का आदान-प्रदान।'
    },
    {
      step: 5,
      id: 'step_family_consent',
      titleHi: '५. दोनों परिवारों की सहमति (Mutual Family Approval)',
      titleEn: '5. Family Approval & Meeting',
      descHi: 'दोनों पक्षों के माता-पिता व अभिभावकों की औपचारिक मुलाकात एवं सहमति।'
    },
    {
      step: 6,
      id: 'step_relationship_dialogue',
      titleHi: '६. रिश्ता पक्का करने पर चर्चा (Confirmation Dialogue)',
      titleEn: '6. Rishta Pakka Discussion',
      descHi: 'रिश्ता तय करने की दिशा में सकारात्मक पारिवारिक सहमति एवं निर्णय।'
    },
    {
      step: 7,
      id: 'step_kundali_or_islamic',
      titleHi: selectedTradition === 'Hindu' ? '७. कुंडली मिलान (Astrological Match)' : '७. मुकद्दस निकाह अनुकूलता (Islamic Compatibility)',
      titleEn: selectedTradition === 'Hindu' ? '7. Kundali Milan (36 Gunas)' : '7. Islamic Compatibility & Values',
      descHi: selectedTradition === 'Hindu' 
        ? '३६ गुणों का अष्टकूट मिलान, मांगलिक विचार एवं नाड़ी दोष परीक्षण।' 
        : 'दीनदारी, मसलक, नमाज़-रोज़ा एवं पारिवारिक मूल्यों की अनुकूलता।'
    },
    {
      step: 8,
      id: 'step_verification',
      titleHi: '८. परिवार/समुदाय की जाँच-पड़ताल (Background Check)',
      titleEn: '8. Community & Reference Check',
      descHi: 'रिश्तेदारों, पड़ोसियों एवं कार्यक्षेत्र के माध्यम से विश्वसनीयता का सत्यापन।'
    },
    {
      step: 9,
      id: 'step_date_fixing',
      titleHi: '९. शादी/निकाह की तारीख तय करना (Date Fixing)',
      titleEn: '9. Auspicious Date & Venue Fixing',
      descHi: selectedTradition === 'Hindu' ? 'शुभ विवाह मुहूर्त, लग्न एवं मंडप का चयन।' : 'निकाह एवं वलीमा की तारीख व स्थल तय करना।'
    },
    {
      step: 10,
      id: 'step_expectations',
      titleHi: '१०. मांग/उम्मीदों पर चर्चा (Transparent Expectations)',
      titleEn: '10. Expectations & Dowry-Free / Mehr Settlement',
      descHi: 'दहेज-मुक्त संकल्प, मेहर, शादी का बजट, रहने की व्यवस्था एवं करियर पर स्पष्ट सहमति।'
    },
    // Traditions branch
    ...(selectedTradition === 'Hindu' ? [
      {
        step: 11,
        id: 'step_roka_sagai',
        titleHi: '११A. सगाई / रोका (Roka & Engagement)',
        titleEn: '11A. Roka & Ring Ceremony',
        descHi: 'तिलक, रोका एवं अंगूठी पहनाने की रस्म के साथ रिश्ते का सार्वजनिक ऐलान।'
      },
      {
        step: 12,
        id: 'step_prep',
        titleHi: '१२A. विवाह की तैयारी (Wedding Preparations)',
        titleEn: '12A. Pre-wedding Functions (Haldi/Mehndi/Sangeet)',
        descHi: 'हल्दी, मेहंदी, संगीत एवं बारात की तैयारियां व कार्यक्रम सूची।'
      },
      {
        step: 13,
        id: 'step_ceremony',
        titleHi: '१३A. विवाह समारोह (Vivah Mandap Ceremony)',
        titleEn: '13A. Wedding Mandap & Jaimala',
        descHi: 'बारात स्वागत, जयमाला, कन्यादान एवं पाणिग्रहण संस्कार।'
      },
      {
        step: 14,
        id: 'step_saptapadi',
        titleHi: '१४A. फेरे एवं विवाह संस्कार (Saptapadi / 7 Vows)',
        titleEn: '14A. 7 Sacred Rounds (Saptapadi)',
        descHi: 'अग्नि साक्षी मानकर सप्तपदी के सात पवित्र फेरे एवं जीवनभर के वचन।'
      },
      {
        step: 15,
        id: 'step_vidaai',
        titleHi: '१५A. विदाई एवं गृह प्रवेश (Vidaai & Griha Pravesh)',
        titleEn: '15A. Vidaai & Welcoming to New Family',
        descHi: 'भावपूर्ण विदाई एवं ससुराल में वधू का मांगलिक गृह प्रवेश।'
      },
      {
        step: 16,
        id: 'step_registration',
        titleHi: '१६A. विवाह पंजीकरण (Marriage Registration)',
        titleEn: '16A. Official Certificate & Digital Registry',
        descHi: 'डिजिटल विवाह प्रमाण पत्र जारी करना एवं स्मार्ट विवाह पर प्रोफाइल को "विवाहित" करना।'
      }
    ] : [
      {
        step: 11,
        id: 'step_mangni',
        titleHi: '११B. मंगनी / रिश्ता पक्का (Mangni & Announcement)',
        titleEn: '11B. Mangni / Baat Pakki',
        descHi: 'मीठाई तक़सीम, अंगूठी एवं दोनों परिवारों द्वारा रिश्ते का मुकद्दस ऐलान।'
      },
      {
        step: 12,
        id: 'step_mehr_fixing',
        titleHi: '१२B. मेहर तय करना (Fixing Mehr & Settlement)',
        titleEn: '12B. Mehr Amount & Conditions Agreed',
        descHi: 'शौहर एवं ज़ौजा के बीच मेहर की मुअज्जल/मुवज्जल रकम का तय होना।'
      },
      {
        step: 13,
        id: 'step_witnesses',
        titleHi: '१३B. निकाह की तारीख एवं गवाह तय (Witnesses & Qazi)',
        titleEn: '13B. 2 Witnesses, Wali & Qazi Appointed',
        descHi: 'काज़ी साहब एवं २ नेक गवाहों की नियुक्ति व निकाह का समय मुक़र्रर।'
      },
      {
        step: 14,
        id: 'step_nikah_ceremony',
        titleHi: '१४B. निकाह - ईजाब-ओ-क़ुबूल (Nikah Solemnization)',
        titleEn: '14B. Ijab-o-Qubool (Qubool Hai Ceremony)',
        descHi: 'काज़ी साहब के सामने तीन बार "क़ुबूल है" की मुकद्दस अदायगी।'
      },
      {
        step: 15,
        id: 'step_nikahnama',
        titleHi: '१५B. निकाहनामा (Official Nikahnama Signatures)',
        titleEn: '15B. Digital Nikahnama Signed & Sealed',
        descHi: 'दूल्हा, दुल्हन, गवाहों एवं काज़ी साहब के आधिकारिक दस्तख़त।'
      },
      {
        step: 16,
        id: 'step_walima',
        titleHi: '१६B. वलीमा / विदाई (Walima Feast & Rukhsati)',
        titleEn: '16B. Sunnah Walima & Rukhsati',
        descHi: 'सुन्नत वलीमा की पुरतकल्लुफ़ दावत एवं नए घर में बा-इज्ज़त रुख़सती।'
      },
      {
        step: 17,
        id: 'step_registration_muslim',
        titleHi: '१७B. विवाह पंजीकरण (Marriage Registration)',
        titleEn: '17B. Official Marriage Registration Certificate',
        descHi: 'आधिकारिक डिजिटल विवाह प्रमाण पत्र एवं विवाहित प्रोफाइल स्टेटस।'
      }
    ]),
    {
      step: selectedTradition === 'Hindu' ? 17 : 18,
      id: 'step_final_journey',
      titleHi: '❤️ वैवाहिक जीवन एवं समाज में नई पहचान (Post-Marriage Life)',
      titleEn: 'Post-Marriage Life & Lifelong Harmony',
      descHi: 'शादी/निकाह के बाद सुखमय वैवाहिक जीवन, परिवार में नया दर्जा और समाज में नई पहचान।'
    }
  ];

  const handleStepComplete = (stepNum: number) => {
    setWorkflowData((prev) => ({
      ...prev,
      currentStepIndex: Math.max(prev.currentStepIndex, stepNum)
    }));
    setActiveStepTab(stepNum);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
  };

  const handleFinalizeMarriage = () => {
    setWorkflowData((prev) => ({
      ...prev,
      isCertificateIssued: true,
      currentStepIndex: ALL_STEPS.length
    }));
    onMarkAsMarried(partner.id, partner.fullName);
    confetti({ particleCount: 100, spread: 100, origin: { y: 0.6 } });
  };

  const handlePrintCertificate = () => {
    const htmlContent = generateMarriageCertificateHTML(groom, bride, workflowData);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Smart Vivah Marriage Certificate - ${groom.fullName} & ${bride.fullName}</title>
            <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
            <style>
              @media print {
                body { margin: 0; padding: 20px; background: white; }
                button { display: none !important; }
              }
              body { font-family: 'Plus Jakarta Sans', sans-serif; background: #FAF9F6; padding: 30px; }
            </style>
          </head>
          <body>
            ${htmlContent}
            <div style="text-align: center; margin-top: 20px;">
              <button onclick="window.print()" style="padding: 10px 24px; background: #5A5A40; color: white; border: none; border-radius: 20px; font-weight: bold; cursor: pointer;">
                🖨️ प्रमाण पत्र प्रिंट करें (Print Certificate)
              </button>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const completionPercentage = Math.min(
    100,
    Math.round((workflowData.currentStepIndex / ALL_STEPS.length) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div
        id="marriage-workflow-modal"
        className="bg-[#FFFDF9] rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#E8E4DE] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Top Header */}
        <div className="bg-[#5A5A40] text-white px-5 py-4 flex items-center justify-between border-b border-[#4A453E]/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D4A373] text-white flex items-center justify-center text-xl shadow-xs">
              💍
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-serif font-bold text-[#FFFDF9]">
                  {language === 'hi' ? 'शादी / निकाह का पूरा फ्लो एवं यात्रा' : 'Complete Marriage & Nikah Lifecycle Workflow'}
                </h2>
                <span className="bg-[#D4A373] text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                  Smart Vivah Process
                </span>
              </div>
              <p className="text-xs text-[#E8E4DE]">
                {language === 'hi'
                  ? 'रिश्ता देखने से लेकर सात फेरे / निकाह एवं मैरिज सर्टिफिकेट तक का सम्पूर्ण मार्गदर्शक'
                  : 'From Partner Search to Wedding/Nikah Rituals & Marriage Certificate'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Tradition Switcher */}
            <div className="flex bg-[#4A453E] p-1 rounded-xl border border-[#E8E4DE]/20 text-xs font-semibold">
              <button
                onClick={() => {
                  setSelectedTradition('Hindu');
                  setWorkflowData((prev) => ({ ...prev, tradition: 'Hindu' }));
                }}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  selectedTradition === 'Hindu'
                    ? 'bg-[#D4A373] text-white shadow-xs'
                    : 'text-[#E8E4DE] hover:text-white'
                }`}
              >
                🕉️ <span>हिंदू विवाह</span>
              </button>
              <button
                onClick={() => {
                  setSelectedTradition('Muslim');
                  setWorkflowData((prev) => ({ ...prev, tradition: 'Muslim' }));
                }}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  selectedTradition === 'Muslim'
                    ? 'bg-[#D4A373] text-white shadow-xs'
                    : 'text-[#E8E4DE] hover:text-white'
                }`}
              >
                ☪️ <span>मुस्लिम निकाह</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-[#E8E4DE] hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Couple Summary Card & Progress Banner */}
        <div className="bg-[#FAF9F6] border-b border-[#E8E4DE] px-5 py-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Couple Avatars */}
            <div className="flex items-center gap-3">
              <div className="flex items-center -space-x-3">
                <img
                  src={groom.photos[0] || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100'}
                  alt={groom.fullName}
                  className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs ring-2 ring-[#D4A373]"
                />
                <img
                  src={bride.photos[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={bride.fullName}
                  className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs ring-2 ring-[#5A5A40]"
                />
              </div>
              <div>
                <div className="text-sm font-bold text-[#4A453E] flex items-center gap-1.5">
                  <span>{groom.fullName}</span>
                  <span className="text-[#D4A373] text-xs">❤️</span>
                  <span>{bride.fullName}</span>
                </div>
                <div className="text-[11px] text-[#8C8479]">
                  {groom.caste} ({groom.religion}) • {bride.caste} ({bride.religion}) • {partner.city}
                </div>
              </div>
            </div>

            {/* Overall Progress Counter */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs font-bold text-[#5A5A40]">
                  {language === 'hi' ? 'विवाह प्रक्रिया प्रगति' : 'Workflow Progress'}: {completionPercentage}%
                </div>
                <div className="text-[10px] text-[#8C8479]">
                  {language === 'hi'
                    ? `चरण ${workflowData.currentStepIndex} / ${ALL_STEPS.length} पूर्ण`
                    : `Step ${workflowData.currentStepIndex} of ${ALL_STEPS.length}`}
                </div>
              </div>
              <div className="w-28 bg-[#E8E4DE] h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#D4A373] h-full rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>

              {/* Action Buttons */}
              <button
                onClick={() => setShowCertificatePreview(!showCertificatePreview)}
                className="px-3 py-1.5 bg-white border border-[#D4A373] text-[#5A5A40] hover:bg-[#FAF9F6] text-xs font-semibold rounded-lg flex items-center gap-1 shadow-2xs"
              >
                <FileText className="w-3.5 h-3.5 text-[#D4A373]" />
                <span>{selectedTradition === 'Muslim' ? 'निकाहनामा' : 'मैरिज सर्टिफिकेट'}</span>
              </button>

              <button
                onClick={handlePrintCertificate}
                className="px-3 py-1.5 bg-[#5A5A40] text-white hover:bg-[#4a4a35] text-xs font-semibold rounded-lg flex items-center gap-1 shadow-2xs"
              >
                <Printer className="w-3.5 h-3.5 text-[#D4A373]" />
                <span>प्रिंट / PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Main Content Body: Left Step Timeline Sidebar & Right Active Step Detail Panel */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Left Step Timeline List */}
          <div className="w-full md:w-72 bg-[#FAF9F6] border-r border-[#E8E4DE] overflow-y-auto p-3 space-y-1.5 max-h-[30vh] md:max-h-none">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#8C8479] px-2 py-1 flex items-center justify-between">
              <span>{language === 'hi' ? 'विवाह/निकाह चरण' : 'Workflow Stages'}</span>
              <span className="text-[10px] bg-[#E8E4DE] text-[#4A453E] px-1.5 py-0.2 rounded-full font-bold">
                {ALL_STEPS.length} Steps
              </span>
            </div>

            {ALL_STEPS.map((s) => {
              const isCompleted = s.step <= workflowData.currentStepIndex;
              const isCurrent = s.step === activeStepTab;

              return (
                <button
                  key={s.id}
                  onClick={() => setActiveStepTab(s.step)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-start gap-2.5 transition-all ${
                    isCurrent
                      ? 'bg-[#5A5A40] text-white font-bold shadow-xs'
                      : isCompleted
                      ? 'bg-white text-[#4A453E] hover:bg-[#F5F5F0] border border-[#E8E4DE]'
                      : 'bg-transparent text-[#8C8479] hover:bg-[#F5F5F0]'
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle2
                        className={`w-4 h-4 ${isCurrent ? 'text-[#D4A373]' : 'text-[#2E7D32]'}`}
                      />
                    ) : (
                      <Circle className="w-4 h-4 text-[#8C8479]" />
                    )}
                  </div>
                  <div className="truncate flex-1">
                    <div className="truncate">{s.titleHi}</div>
                    <div className={`text-[10px] truncate ${isCurrent ? 'text-[#E8E4DE]' : 'text-[#8C8479]'}`}>
                      {s.titleEn}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Active Step Detail & Action Panel */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Step 1 to 4: Early Discovery & Intro */}
            {activeStepTab === 1 && (
              <div className="space-y-4">
                <div className="border-b border-[#E8E4DE] pb-3">
                  <span className="text-xs font-bold text-[#D4A373] uppercase tracking-wider">चरण १ / Step 1</span>
                  <h3 className="text-xl font-serif font-bold text-[#5A5A40]">
                    रिश्ता ढूँढना (Partner Search & Filtering)
                  </h3>
                  <p className="text-xs text-[#8C8479] mt-1">
                    जाति, धर्म, शिक्षा, वार्षिक आय एवं कुंडली अनुकूलता के आधार पर वर/वधू की खोज।
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#E8E4DE]">
                    <div className="text-xs font-bold text-[#5A5A40] mb-2">सर्च प्राथमिकताएं (Search Filters)</div>
                    <ul className="text-xs space-y-1.5 text-[#4A453E]">
                      <li>• <strong>धर्म/मज़हब:</strong> {partner.religion}</li>
                      <li>• <strong>समुदाय/बिरादरी:</strong> {partner.caste}</li>
                      <li>• <strong>शिक्षा एवं पेशा:</strong> {partner.highestEducation} - {partner.occupation}</li>
                      <li>• <strong>स्थान:</strong> {partner.city}, {partner.state}</li>
                    </ul>
                  </div>

                  <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#E8E4DE]">
                    <div className="text-xs font-bold text-[#5A5A40] mb-2">Smart Vivah AI स्कोर</div>
                    <div className="flex items-center gap-3">
                      <div className="text-3xl font-serif font-bold text-[#D4A373]">
                        {kundaliScore.totalPoints}/36
                      </div>
                      <div className="text-xs text-[#4A453E]">
                        गुण मिलान स्कोर ({kundaliScore.compatibilityLevel})
                      </div>
                    </div>
                    <p className="text-[11px] text-[#8C8479] mt-2">
                      दोनों प्रोफाइल्स एक-दूसरे की पारिवारिक एवं वैवाहिक अपेक्षाओं पर ९०% से अधिक अनुकूल हैं।
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleStepComplete(2)}
                  className="px-5 py-2 bg-[#5A5A40] text-white text-xs font-bold rounded-xl hover:bg-[#4a4a35] flex items-center gap-1.5"
                >
                  <span>अगला चरण: प्रोफ़ाइल देखना</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step 2: View Profile & Biodata */}
            {activeStepTab === 2 && (
              <div className="space-y-4">
                <div className="border-b border-[#E8E4DE] pb-3">
                  <span className="text-xs font-bold text-[#D4A373] uppercase tracking-wider">चरण २ / Step 2</span>
                  <h3 className="text-xl font-serif font-bold text-[#5A5A40]">
                    लड़का/लड़की की प्रोफ़ाइल एवं बायोडाटा देखना
                  </h3>
                  <p className="text-xs text-[#8C8479] mt-1">
                    सत्यापित तस्वीरें, करियर, पारिवारिक विवरण एवं वैवाहिक बायोडाटा का अध्ययन।
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#E8E4DE] flex flex-wrap items-center gap-4">
                  <img
                    src={partner.photos[0]}
                    alt={partner.fullName}
                    className="w-16 h-16 rounded-xl object-cover border border-[#E8E4DE]"
                  />
                  <div>
                    <div className="text-base font-bold text-[#4A453E]">{partner.fullName}</div>
                    <div className="text-xs text-[#8C8479]">
                      {partner.age} वर्ष • {partner.heightFeet}'{partner.heightInches}" • {partner.occupation}
                    </div>
                    <div className="text-xs text-[#5A5A40] font-medium mt-1">
                      सत्यापन: {partner.isVerified ? '✓ १००% सरकारी आईडी द्वारा सत्यापित' : 'सत्यापन प्रक्रियाधीन'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleStepComplete(3)}
                  className="px-5 py-2 bg-[#5A5A40] text-white text-xs font-bold rounded-xl hover:bg-[#4a4a35] flex items-center gap-1.5"
                >
                  <span>अगला चरण: परिवार की जानकारी</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step 3: Family Info */}
            {activeStepTab === 3 && (
              <div className="space-y-4">
                <div className="border-b border-[#E8E4DE] pb-3">
                  <span className="text-xs font-bold text-[#D4A373] uppercase tracking-wider">चरण ३ / Step 3</span>
                  <h3 className="text-xl font-serif font-bold text-[#5A5A40]">
                    परिवार की जानकारी एवं पृष्ठभूमि
                  </h3>
                  <p className="text-xs text-[#8C8479] mt-1">
                    माता-पिता, भाई-बहन, मूल निवास, पारिवारिक मूल्य एवं प्रतिष्ठा की जानकारी लेना।
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#E8E4DE] space-y-2">
                    <div><strong>पिताजी:</strong> {partner.family.fatherOccupation}</div>
                    <div><strong>माताजी:</strong> {partner.family.motherOccupation}</div>
                    <div><strong>भाई-बहन:</strong> {partner.family.brothers} भाई, {partner.family.sisters} बहन</div>
                  </div>
                  <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#E8E4DE] space-y-2">
                    <div><strong>परिवार का प्रकार:</strong> {partner.family.familyType}</div>
                    <div><strong>पारिवारिक मूल्य:</strong> {partner.family.familyValues}</div>
                    <div><strong>मूल निवास:</strong> {partner.family.nativePlace || partner.city}</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => onOpenFamilyConnect(partner)}
                    className="px-4 py-2 bg-[#D4A373] text-white text-xs font-bold rounded-xl hover:bg-[#c29263] flex items-center gap-1.5"
                  >
                    <Users className="w-4 h-4" />
                    <span>फैमिली कनेक्ट एवं कॉल शेड्यूल</span>
                  </button>

                  <button
                    onClick={() => handleStepComplete(4)}
                    className="px-5 py-2 bg-[#5A5A40] text-white text-xs font-bold rounded-xl hover:bg-[#4a4a35] flex items-center gap-1.5"
                  >
                    <span>अगला चरण: पहली बातचीत</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: First Chat / Introduction */}
            {activeStepTab === 4 && (
              <div className="space-y-4">
                <div className="border-b border-[#E8E4DE] pb-3">
                  <span className="text-xs font-bold text-[#D4A373] uppercase tracking-wider">चरण ४ / Step 4</span>
                  <h3 className="text-xl font-serif font-bold text-[#5A5A40]">
                    पहली बातचीत / परिचय (First Chat & Meeting)
                  </h3>
                  <p className="text-xs text-[#8C8479] mt-1">
                    वर एवं वधू के बीच प्राथमिक संवाद, रुचियों की समझ एवं जीवन लक्ष्यों पर चर्चा।
                  </p>
                </div>

                <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#E8E4DE]">
                  <p className="text-xs text-[#4A453E] leading-relaxed">
                    सुरक्षित चैट मेसेंजर के जरिए दोनों परिवारों एवं अभ्यर्थियों ने शुरुआती बातचीत पूरी कर ली है। विचार एवं जीवन दृष्टिकोण में सामंजस्य पाया गया।
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      onOpenChat(partner.id);
                      onClose();
                    }}
                    className="px-4 py-2 bg-[#5A5A40] text-white text-xs font-bold rounded-xl hover:bg-[#4a4a35]"
                  >
                    💬 चैट मेसेंजर खोलें
                  </button>
                  <button
                    onClick={() => handleStepComplete(5)}
                    className="px-5 py-2 bg-[#D4A373] text-white text-xs font-bold rounded-xl hover:bg-[#c29263] flex items-center gap-1.5"
                  >
                    <span>अगला चरण: दोनों परिवारों की सहमति</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Mutual Family Consent */}
            {activeStepTab === 5 && (
              <div className="space-y-4">
                <div className="border-b border-[#E8E4DE] pb-3">
                  <span className="text-xs font-bold text-[#D4A373] uppercase tracking-wider">चरण ५ / Step 5</span>
                  <h3 className="text-xl font-serif font-bold text-[#5A5A40]">
                    दोनों परिवारों की सहमति (Mutual Family Approval)
                  </h3>
                  <p className="text-xs text-[#8C8479] mt-1">
                    दोनों पक्षों के अभिभावकों एवं पारिवारिक सदस्यों की औपचारिक सहमति व बैठक।
                  </p>
                </div>

                <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#E8E4DE] space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#5A5A40]">पारिवारिक मीटिंग की तिथि:</span>
                    <input
                      type="date"
                      value={workflowData.familyMeetingDate}
                      onChange={(e) => setWorkflowData({ ...workflowData, familyMeetingDate: e.target.value })}
                      className="border border-[#E8E4DE] rounded-lg px-2 py-1 bg-white text-xs"
                    />
                  </div>

                  <div className="text-xs space-y-2">
                    <div className="font-bold text-[#5A5A40]">सहमति स्थिति:</div>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="consent"
                          checked={workflowData.familyConsentStatus === 'consented'}
                          onChange={() => setWorkflowData({ ...workflowData, familyConsentStatus: 'consented' })}
                        />
                        <span className="text-[#2E7D32] font-semibold">✓ दोनों परिवार पूर्ण सहमत हैं</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="consent"
                          checked={workflowData.familyConsentStatus === 'further_discussion'}
                          onChange={() => setWorkflowData({ ...workflowData, familyConsentStatus: 'further_discussion' })}
                        />
                        <span>चर्चा जारी है</span>
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleStepComplete(6)}
                  className="px-5 py-2 bg-[#5A5A40] text-white text-xs font-bold rounded-xl hover:bg-[#4a4a35] flex items-center gap-1.5"
                >
                  <span>अगला चरण: रिश्ता पक्का करने पर चर्चा</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step 6: Rishta Pakka Confirmation */}
            {activeStepTab === 6 && (
              <div className="space-y-4">
                <div className="border-b border-[#E8E4DE] pb-3">
                  <span className="text-xs font-bold text-[#D4A373] uppercase tracking-wider">चरण ६ / Step 6</span>
                  <h3 className="text-xl font-serif font-bold text-[#5A5A40]">
                    रिश्ता पक्का करने पर चर्चा (Relationship Confirmation)
                  </h3>
                  <p className="text-xs text-[#8C8479] mt-1">
                    दोनों पक्षों द्वारा रिश्ते को अंतिम रूप देने एवं वैवाहिक रीति-रिवाजों पर सर्वसम्मति।
                  </p>
                </div>

                <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#E8E4DE] text-xs text-[#4A453E] space-y-2">
                  <div className="flex items-center gap-2 text-[#2E7D32] font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>रिश्ते पर दोनों परिवारों की सैद्धांतिक मुहर लग चुकी है।</span>
                  </div>
                  <p>
                    अगले चरणों में कुंडली परीक्षण/दीनदारी मिलान, पारिवारिक संदर्भ जाँच एवं मांग/उम्मीदों पर पारदर्शी लिखित सहमति होगी।
                  </p>
                </div>

                <button
                  onClick={() => handleStepComplete(7)}
                  className="px-5 py-2 bg-[#5A5A40] text-white text-xs font-bold rounded-xl hover:bg-[#4a4a35] flex items-center gap-1.5"
                >
                  <span>अगला चरण: {selectedTradition === 'Hindu' ? 'कुंडली मिलान' : 'मुकद्दस निकाह अनुकूलता'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step 7: Kundali Milan / Islamic Compatibility */}
            {activeStepTab === 7 && (
              <div className="space-y-4">
                <div className="border-b border-[#E8E4DE] pb-3">
                  <span className="text-xs font-bold text-[#D4A373] uppercase tracking-wider">चरण ७ / Step 7</span>
                  <h3 className="text-xl font-serif font-bold text-[#5A5A40]">
                    {selectedTradition === 'Hindu'
                      ? '🕉️ अष्टकूट कुंडली मिलान (Kundali Milan)'
                      : '☪️ मुकद्दस निकाह अनुकूलता एवं दीनदारी'}
                  </h3>
                  <p className="text-xs text-[#8C8479] mt-1">
                    {selectedTradition === 'Hindu'
                      ? 'वर्ण, वश्य, तारा, योनि, ग्रहमैत्री, गण, भकूट एवं नाड़ी दोष का ३६-गुण विश्लेषण।'
                      : 'मसलक, नमाज़, कुरआन, रोज़ा, अख़लाक़ एवं इस्लामी पारिवारिक जीवन की संगति।'}
                  </p>
                </div>

                {selectedTradition === 'Hindu' ? (
                  <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#E8E4DE] space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-[#5A5A40]">कुल गुण मिलान:</div>
                        <div className="text-2xl font-serif font-bold text-[#D4A373]">
                          {kundaliScore.totalPoints} / 36 गुण
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 bg-[#2E7D32]/10 text-[#2E7D32] rounded-full font-bold text-xs">
                          {kundaliScore.compatibilityLevel}
                        </span>
                        <div className="text-[11px] text-[#8C8479] mt-1">
                          मांगलिक स्थिति: {kundaliScore.isManglikMatch ? 'अनुकूल' : 'सामान्य'}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenKundaliMilan(partner)}
                      className="w-full py-2 bg-white border border-[#D4A373] text-[#5A5A40] rounded-xl text-xs font-bold hover:bg-[#FAF9F6] flex items-center justify-center gap-1"
                    >
                      <Sparkles className="w-4 h-4 text-[#D4A373]" />
                      <span>संपूर्ण ३६-गुण अष्टकूट तालिका एवं दोष समाधान देखें</span>
                    </button>
                  </div>
                ) : (
                  <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#E8E4DE] space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded-lg border border-[#E8E4DE]">
                        <strong>मसलक:</strong> {partner.islamicDetails?.maslak || 'सुन्नी अहले सुन्नत'}
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-[#E8E4DE]">
                        <strong>नमाज़ व रोज़ा:</strong> {partner.islamicDetails?.namazSalah || '५ वक़्त पाबंद'}
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-[#E8E4DE] text-[#2E7D32] font-semibold">
                      ✓ दीनदार एवं शरीअत सम्मत वैवाहिक तालमेल पूर्णतः अनुकूल पाया गया।
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleStepComplete(8)}
                  className="px-5 py-2 bg-[#5A5A40] text-white text-xs font-bold rounded-xl hover:bg-[#4a4a35] flex items-center gap-1.5"
                >
                  <span>अगला चरण: समाज एवं पारिवारिक जाँच-पड़ताल</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step 8: Community & Background Verification */}
            {activeStepTab === 8 && (
              <div className="space-y-4">
                <div className="border-b border-[#E8E4DE] pb-3">
                  <span className="text-xs font-bold text-[#D4A373] uppercase tracking-wider">चरण ८ / Step 8</span>
                  <h3 className="text-xl font-serif font-bold text-[#5A5A40]">
                    परिवार / समुदाय की आवश्यक जाँच-पड़ताल (Background Verification)
                  </h3>
                  <p className="text-xs text-[#8C8479] mt-1">
                    पारिवारिक संबंधियों, कार्यस्थल एवं स्थानीय समुदाय के माध्यम से पृष्ठभूमि की पुष्टि।
                  </p>
                </div>

                <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#E8E4DE] space-y-3 text-xs">
                  <div className="font-bold text-[#5A5A40]">सत्यापन संदर्भ बिंदु (Verification Checklist):</div>
                  <div className="space-y-1.5 text-[#4A453E]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                      <span>सरकारी आईडी (आधार / पैन) एवं पता सत्यापन - पूर्ण</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                      <span>कार्यस्थल / कंपनी एवं आय प्रमाण पत्र - सत्यापित</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                      <span>पारिवारिक प्रतिष्ठा एवं सामाजिक संदर्भ जाँच - सकारात्मक</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleStepComplete(9)}
                  className="px-5 py-2 bg-[#5A5A40] text-white text-xs font-bold rounded-xl hover:bg-[#4a4a35] flex items-center gap-1.5"
                >
                  <span>अगला चरण: शादी/निकाह की तारीख तय करना</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step 9: Shubh Muhurat & Date Fixing */}
            {activeStepTab === 9 && (
              <div className="space-y-4">
                <div className="border-b border-[#E8E4DE] pb-3">
                  <span className="text-xs font-bold text-[#D4A373] uppercase tracking-wider">चरण ९ / Step 9</span>
                  <h3 className="text-xl font-serif font-bold text-[#5A5A40]">
                    {selectedTradition === 'Hindu' ? 'शुभ विवाह मुहूर्त एवं तारीख तय करना' : 'निकाह एवं वलीमा की तारीख तय करना'}
                  </h3>
                  <p className="text-xs text-[#8C8479] mt-1">
                    वैदिक पंचांग अनुसार शुभ लग्न अथवा शुक्रवार/मुबारक दिन का चयन एवं मंडप निर्धारण।
                  </p>
                </div>

                <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#E8E4DE] space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#5A5A40] mb-1">विवाह/निकाह की तारीख:</label>
                      <input
                        type="date"
                        value={workflowData.weddingDate}
                        onChange={(e) => setWorkflowData({ ...workflowData, weddingDate: e.target.value })}
                        className="w-full border border-[#E8E4DE] rounded-lg px-3 py-1.5 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#5A5A40] mb-1">विवाह स्थल / रिसॉर्ट / हॉल:</label>
                      <input
                        type="text"
                        value={workflowData.weddingVenue}
                        onChange={(e) => setWorkflowData({ ...workflowData, weddingVenue: e.target.value })}
                        placeholder="शहर, राज्य व स्थल का नाम"
                        className="w-full border border-[#E8E4DE] rounded-lg px-3 py-1.5 bg-white"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-[#E8E4DE] text-[11px] text-[#8C8479]">
                    शुभ मुहूर्त विवरण: {workflowData.shubhMuhuratDetails}
                  </div>
                </div>

                <button
                  onClick={() => handleStepComplete(10)}
                  className="px-5 py-2 bg-[#5A5A40] text-white text-xs font-bold rounded-xl hover:bg-[#4a4a35] flex items-center gap-1.5"
                >
                  <span>अगला चरण: मांग एवं अपेक्षाओं पर पारदर्शी चर्चा</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step 10: Expectations, Dowry-Free Pledge & Mehr Agreement */}
            {activeStepTab === 10 && (
              <div className="space-y-4">
                <div className="border-b border-[#E8E4DE] pb-3">
                  <span className="text-xs font-bold text-[#D4A373] uppercase tracking-wider">चरण १० / Step 10</span>
                  <h3 className="text-xl font-serif font-bold text-[#5A5A40]">
                    मांग/उम्मीदों पर पारदर्शी चर्चा एवं समझौता (Expectations Settlement)
                  </h3>
                  <p className="text-xs text-[#8C8479] mt-1">
                    दहेज मुक्त विवाह संकल्प, मेहर (मुस्लिम), शादी का बजट, रहने की व्यवस्था एवं करियर पर स्पष्टता।
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Anti-Dowry Pledge */}
                  <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#2E7D32]/30 space-y-2">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={workflowData.expectations.antiDowryPledgeAccepted}
                        onChange={(e) =>
                          setWorkflowData({
                            ...workflowData,
                            expectations: {
                              ...workflowData.expectations,
                              antiDowryPledgeAccepted: e.target.checked
                            }
                          })
                        }
                        className="mt-0.5"
                      />
                      <div className="text-xs">
                        <div className="font-bold text-[#2E7D32]">
                          🛡️ दहेज मुक्त विवाह संकल्प (Anti-Dowry Legal & Moral Pledge)
                        </div>
                        <div className="text-[#4A453E] mt-0.5 leading-relaxed">
                          हम दोनों पक्ष स्वेच्छा से घोषणा करते हैं कि इस विवाह में किसी भी प्रकार का दहेज, अनुचित उपहार या आर्थिक मांग नहीं की जाएगी। विवाह पूर्णतः सम्मान, प्रेम व सादगी से संपन्न होगा।
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Mehr settlement (If Muslim Tradition) */}
                  {selectedTradition === 'Muslim' && (
                    <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#D4A373]/40 space-y-3">
                      <div className="text-xs font-bold text-[#5A5A40] flex items-center gap-1.5">
                        <Coins className="w-4 h-4 text-[#D4A373]" />
                        <span>मेहर तय करना (Mehr Agreement)</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block text-[#4A453E] mb-1 font-semibold">मेहर की रकम / वस्तु:</label>
                          <input
                            type="text"
                            value={workflowData.expectations.mehrAmount}
                            onChange={(e) =>
                              setWorkflowData({
                                ...workflowData,
                                expectations: {
                                  ...workflowData.expectations,
                                  mehrAmount: e.target.value
                                }
                              })
                            }
                            placeholder="उदा. ₹1,51,000 अथवा ५ तोला सोना"
                            className="w-full border border-[#E8E4DE] rounded-lg px-3 py-1.5 bg-white text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[#4A453E] mb-1 font-semibold">मेहर का प्रकार:</label>
                          <select
                            value={workflowData.expectations.mehrType}
                            onChange={(e) =>
                              setWorkflowData({
                                ...workflowData,
                                expectations: {
                                  ...workflowData.expectations,
                                  mehrType: e.target.value as any
                                }
                              })
                            }
                            className="w-full border border-[#E8E4DE] rounded-lg px-3 py-1.5 bg-white text-xs"
                          >
                            <option value="Mu'ajjal (Prompt)">मुअज्जल (Mu'ajjal - तत्काल देय)</option>
                            <option value="Mu'wajjal (Deferred)">मुवज्जल (Mu'wajjal - भविष्य में देय)</option>
                            <option value="Partially Prompt">आंशिक तत्काल एवं आंशिक भविष्य में</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Budget & Living Arrangement */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-[#FAF9F6] p-3 rounded-xl border border-[#E8E4DE]">
                      <label className="block font-bold text-[#5A5A40] mb-1">शादी का खर्च विभाजन:</label>
                      <select
                        value={workflowData.expectations.weddingBudgetShare}
                        onChange={(e) =>
                          setWorkflowData({
                            ...workflowData,
                            expectations: {
                              ...workflowData.expectations,
                              weddingBudgetShare: e.target.value as any
                            }
                          })
                        }
                        className="w-full border border-[#E8E4DE] rounded-lg px-2 py-1.5 bg-white"
                      >
                        <option value="Equal 50-50">बराबर ५०-५०% साझेदारी</option>
                        <option value="Simple Court/Masjid/Mandir Wedding">सादगीपूर्ण मंदिर/मस्जिद/कोर्ट विवाह</option>
                        <option value="Groom Family">वर पक्ष द्वारा मुख्य खर्च</option>
                        <option value="Bride Family">वधू पक्ष द्वारा मुख्य खर्च</option>
                      </select>
                    </div>

                    <div className="bg-[#FAF9F6] p-3 rounded-xl border border-[#E8E4DE]">
                      <label className="block font-bold text-[#5A5A40] mb-1">रहने की व्यवस्था:</label>
                      <select
                        value={workflowData.expectations.livingArrangement}
                        onChange={(e) =>
                          setWorkflowData({
                            ...workflowData,
                            expectations: {
                              ...workflowData.expectations,
                              livingArrangement: e.target.value as any
                            }
                          })
                        }
                        className="w-full border border-[#E8E4DE] rounded-lg px-2 py-1.5 bg-white"
                      >
                        <option value="With Groom Parents (Joint)">माता-पिता के साथ संयुक्त परिवार</option>
                        <option value="Independent Couple Residence">दंपति का स्वतंत्र निवास</option>
                        <option value="Relocating to New City">नौकरी अनुसार नए शहर में</option>
                        <option value="Mutual Decision">आपसी सहमति अनुसार</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleStepComplete(11)}
                  className="px-5 py-2 bg-[#5A5A40] text-white text-xs font-bold rounded-xl hover:bg-[#4a4a35] flex items-center gap-1.5"
                >
                  <span>अगला चरण: {selectedTradition === 'Hindu' ? 'सगाई / रोका' : 'मंगनी / रिश्ता पक्का'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step 11 to 16 (Hindu Vivah Track) */}
            {selectedTradition === 'Hindu' && activeStepTab === 11 && (
              <div className="space-y-4">
                <div className="border-b border-[#E8E4DE] pb-3">
                  <span className="text-xs font-bold text-[#D4A373] uppercase tracking-wider">चरण ११A / Step 11A</span>
                  <h3 className="text-xl font-serif font-bold text-[#5A5A40]">
                    🕉️ सगाई / रोका (Roka & Ring Ceremony)
                  </h3>
                  <p className="text-xs text-[#8C8479] mt-1">
                    तिलक, मिष्ठान्न वितरण, अंगूठी पहनाना एवं संबंध को पारिवारिक रूप से सार्वजनिक करना।
                  </p>
                </div>

                <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#E8E4DE] space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#5A5A40]">रोका/सगाई की तिथि:</span>
                    <input
                      type="date"
                      value={workflowData.rokaDate}
                      onChange={(e) => setWorkflowData({ ...workflowData, rokaDate: e.target.value })}
                      className="border border-[#E8E4DE] rounded-lg px-3 py-1 bg-white"
                    />
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-[#E8E4DE] text-[#4A453E]">
                    ✓ दोनों परिवारों की उपस्थिति में शुभ मुहूर्त पर अंगूठी एवं शगुन का आदान-प्रदान पूर्ण।
                  </div>
                </div>

                <button
                  onClick={() => handleStepComplete(12)}
                  className="px-5 py-2 bg-[#5A5A40] text-white text-xs font-bold rounded-xl hover:bg-[#4a4a35] flex items-center gap-1.5"
                >
                  <span>अगला चरण: विवाह की तैयारी (हल्दी/मेहंदी/संगीत)</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {selectedTradition === 'Hindu' && activeStepTab === 12 && (
              <div className="space-y-4">
                <div className="border-b border-[#E8E4DE] pb-3">
                  <span className="text-xs font-bold text-[#D4A373] uppercase tracking-wider">चरण १२A / Step 12A</span>
                  <h3 className="text-xl font-serif font-bold text-[#5A5A40]">
                    विवाह की तैयारी (Haldi, Mehndi, Sangeet Planner)
                  </h3>
                  <p className="text-xs text-[#8C8479] mt-1">
                    वैवाहिक रस्मों की समय-सारिणी एवं आत्मीय उत्सवों का आयोजन।
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-[#FAF9F6] p-3 rounded-xl border border-[#E8E4DE] text-center">
                    <div className="text-lg">🌿</div>
                    <div className="font-bold text-[#5A5A40] mt-1">हल्दी रस्म</div>
                    <div className="text-[11px] text-[#8C8479]">सुगंधित उबटन एवं मंगल स्नान</div>
                  </div>
                  <div className="bg-[#FAF9F6] p-3 rounded-xl border border-[#E8E4DE] text-center">
                    <div className="text-lg">🎨</div>
                    <div className="font-bold text-[#5A5A40] mt-1">मेहंदी उत्सव</div>
                    <div className="text-[11px] text-[#8C8479]">हथेली पर प्रियतम का नाम</div>
                  </div>
                  <div className="bg-[#FAF9F6] p-3 rounded-xl border border-[#E8E4DE] text-center">
                    <div className="text-lg">🪕</div>
                    <div className="font-bold text-[#5A5A40] mt-1">संगीत संध्या</div>
                    <div className="text-[11px] text-[#8C8479]">लोकगीत एवं पारिवारिक नृत्य</div>
                  </div>
                </div>

                <button
                  onClick={() => handleStepComplete(13)}
                  className="px-5 py-2 bg-[#5A5A40] text-white text-xs font-bold rounded-xl hover:bg-[#4a4a35] flex items-center gap-1.5"
                >
                  <span>अगला चरण: विवाह समारोह एवं जयमाला</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {selectedTradition === 'Hindu' && activeStepTab === 13 && (
              <div className="space-y-4">
                <div className="border-b border-[#E8E4DE] pb-3">
                  <span className="text-xs font-bold text-[#D4A373] uppercase tracking-wider">चरण १३A / Step 13A</span>
                  <h3 className="text-xl font-serif font-bold text-[#5A5A40]">
                    विवाह समारोह (Mandap & Jaimala)
                  </h3>
                  <p className="text-xs text-[#8C8479] mt-1">
                    भव्य बारात स्वागत, वर-माला (जयमाला) एवं कन्यादान संस्कार।
                  </p>
                </div>

                <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#E8E4DE] space-y-3 text-xs text-[#4A453E]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#5A5A40] mb-1">पुरोहित / पंडित जी:</label>
                      <input
                        type="text"
                        value={workflowData.panditName}
                        onChange={(e) => setWorkflowData({ ...workflowData, panditName: e.target.value })}
                        className="w-full border border-[#E8E4DE] rounded-lg px-3 py-1.5 bg-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#5A5A40] mb-1">विवाह मंडप स्थल:</label>
                      <input
                        type="text"
                        value={workflowData.mandapLocation}
                        onChange={(e) => setWorkflowData({ ...workflowData, mandapLocation: e.target.value })}
                        className="w-full border border-[#E8E4DE] rounded-lg px-3 py-1.5 bg-white text-xs"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleStepComplete(14)}
                  className="px-5 py-2 bg-[#5A5A40] text-white text-xs font-bold rounded-xl hover:bg-[#4a4a35] flex items-center gap-1.5"
                >
                  <span>अगला चरण: सप्तपदी एवं सात फेरे</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {selectedTradition === 'Hindu' && activeStepTab === 14 && (
              <div className="space-y-4">
                <div className="border-b border-[#E8E4DE] pb-3">
                  <span className="text-xs font-bold text-[#D4A373] uppercase tracking-wider">चरण १४A / Step 14A</span>
                  <h3 className="text-xl font-serif font-bold text-[#5A5A40]">
                    फेरे एवं सप्तपदी विवाह संस्कार (7 Sacred Vows)
                  </h3>
                  <p className="text-xs text-[#8C8479] mt-1">
                    पवित्र अग्नि के समक्ष लिए जाने वाले सात फेरे एवं सात वचन।
                  </p>
                </div>

                {/* Saptapadi Interactive Card */}
                <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#D4A373]/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-[#D4A373]" />
                      <span className="text-xs font-bold text-[#5A5A40]">
                        सप्तपदी वचन ({saptapadiActiveVow + 1} / 7)
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {SAPTAPADI_VOWS.map((vow, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSaptapadiActiveVow(idx)}
                          className={`w-6 h-6 rounded-full text-xs font-bold transition-all ${
                            saptapadiActiveVow === idx
                              ? 'bg-[#5A5A40] text-white'
                              : 'bg-white text-[#8C8479] border border-[#E8E4DE]'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-[#E8E4DE] space-y-2">
                    <div className="font-serif font-bold text-sm text-[#5A5A40]">
                      {SAPTAPADI_VOWS[saptapadiActiveVow].vowHi}
                    </div>
                    <div className="text-xs text-[#4A453E] leading-relaxed">
                      {SAPTAPADI_VOWS[saptapadiActiveVow].descHi}
                    </div>
                    <div className="text-[11px] font-mono text-[#D4A373] italic">
                      मंत्र: {SAPTAPADI_VOWS[saptapadiActiveVow].mantra}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleStepComplete(15)}
                  className="px-5 py-2 bg-[#5A5A40] text-white text-xs font-bold rounded-xl hover:bg-[#4a4a35] flex items-center gap-1.5"
                >
                  <span>अगला चरण: विदाई एवं गृह प्रवेश</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {selectedTradition === 'Hindu' && activeStepTab === 15 && (
              <div className="space-y-4">
                <div className="border-b border-[#E8E4DE] pb-3">
                  <span className="text-xs font-bold text-[#D4A373] uppercase tracking-wider">चरण १५A / Step 15A</span>
                  <h3 className="text-xl font-serif font-bold text-[#5A5A40]">
                    विदाई एवं गृह प्रवेश (Vidaai & Griha Pravesh)
                  </h3>
                  <p className="text-xs text-[#8C8479] mt-1">
                    मातृकुल से स्नेहिल विदाई एवं वर के गृह में लक्ष्मी रूप में मांगलिक स्वागत।
                  </p>
                </div>

                <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#E8E4DE] text-xs text-[#4A453E] leading-relaxed">
                  चावल फेंकने की विदाई रस्म के पश्चात ससुराल में कलश ढुलकाने एवं कुमकुम पदचिह्नों के साथ गृह प्रवेश संपन्न हुआ।
                </div>

                <button
                  onClick={() => handleStepComplete(16)}
                  className="px-5 py-2 bg-[#5A5A40] text-white text-xs font-bold rounded-xl hover:bg-[#4a4a35] flex items-center gap-1.5"
                >
                  <span>अगला चरण: विवाह पंजीकरण एवं प्रमाण पत्र</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {selectedTradition === 'Hindu' && activeStepTab === 16 && (
              <div className="space-y-4">
                <div className="border-b border-[#E8E4DE] pb-3">
                  <span className="text-xs font-bold text-[#D4A373] uppercase tracking-wider">चरण १६A / Step 16A</span>
                  <h3 className="text-xl font-serif font-bold text-[#5A5A40]">
                    📜 विवाह पंजीकरण एवं डिजिटल सर्टिफिकेट (Marriage Registration)
                  </h3>
                  <p className="text-xs text-[#8C8479] mt-1">
                    हिंदू विवाह अधिनियम १९५५ एवं विशेष विवाह अधिनियम के तहत डिजिटल प्रमाण पत्र।
                  </p>
                </div>

                <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#2E7D32]/30 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-[#2E7D32]">पंजीकरण संख्या: {workflowData.certificateNumber}</div>
                      <div className="text-[#8C8479]">जारी तिथि: {workflowData.registrationDate}</div>
                    </div>
                    <button
                      onClick={handlePrintCertificate}
                      className="px-4 py-2 bg-[#5A5A40] text-white rounded-xl text-xs font-bold hover:bg-[#4a4a35] flex items-center gap-1.5 shadow-xs"
                    >
                      <Download className="w-4 h-4" />
                      <span>प्रमाण पत्र डाउनलोड / प्रिंट</span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => handleStepComplete(17)}
                  className="px-5 py-2 bg-[#D4A373] text-white text-xs font-bold rounded-xl hover:bg-[#c29263] flex items-center gap-1.5"
                >
                  <span>अंतिम चरण: वैवाहिक जीवन एवं स्टेटस अपडेट</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step 11 to 17 (Muslim Nikah Track) */}
            {selectedTradition === 'Muslim' && activeStepTab === 11 && (
              <div className="space-y-4">
                <div className="border-b border-[#E8E4DE] pb-3">
                  <span className="text-xs font-bold text-[#D4A373] uppercase tracking-wider">चरण ११B / Step 11B</span>
                  <h3 className="text-xl font-serif font-bold text-[#5A5A40]">
                    ☪️ मंगनी / बात पक्की (Mangni & Formal Announcement)
                  </h3>
                  <p className="text-xs text-[#8C8479] mt-1">
                    मिठाई तक़सीम, मुकद्दस दुआएं एवं दोनों ख़ानदानों द्वारा रिश्ते का ऐलान।
                  </p>
                </div>

                <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#E8E4DE] space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#5A5A40]">मंगनी की तारीख:</span>
                    <input
                      type="date"
                      value={workflowData.mangniDate}
                      onChange={(e) => setWorkflowData({ ...workflowData, mangniDate: e.target.value })}
                      className="border border-[#E8E4DE] rounded-lg px-3 py-1 bg-white"
                    />
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-[#E8E4DE] text-[#4A453E]">
                    ✓ दोनों परिवारों की रज़ामंदी से मंगनी की रस्म बा-ख़ैरियत संपन्न हुई।
                  </div>
                </div>

                <button
                  onClick={() => handleStepComplete(12)}
                  className="px-5 py-2 bg-[#5A5A40] text-white text-xs font-bold rounded-xl hover:bg-[#4a4a35] flex items-center gap-1.5"
                >
                  <span>अगला चरण: मेहर तय करना</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {selectedTradition === 'Muslim' && activeStepTab === 12 && (
              <div className="space-y-4">
                <div className="border-b border-[#E8E4DE] pb-3">
                  <span className="text-xs font-bold text-[#D4A373] uppercase tracking-wider">चरण १२B / Step 12B</span>
                  <h3 className="text-xl font-serif font-bold text-[#5A5A40]">
                    मेहर तय करना एवं शरई शर्तें (Fixing Mehr)
                  </h3>
                  <p className="text-xs text-[#8C8479] mt-1">
                    दूल्हे द्वारा दुल्हन को दिया जाने वाला अनिवार्य सम्मानजनक मेहर।
                  </p>
                </div>

                <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#D4A373]/40 space-y-3 text-xs">
                  <div className="font-bold text-[#5A5A40]">तयशुदा मेहर विवरण:</div>
                  <div className="bg-white p-3 rounded-lg border border-[#E8E4DE] font-semibold text-[#4A453E]">
                    रकम: {workflowData.expectations.mehrAmount || '₹1,51,000'} ({workflowData.expectations.mehrType || "Mu'ajjal (तत्काल देय)"})
                  </div>
                </div>

                <button
                  onClick={() => handleStepComplete(13)}
                  className="px-5 py-2 bg-[#5A5A40] text-white text-xs font-bold rounded-xl hover:bg-[#4a4a35] flex items-center gap-1.5"
                >
                  <span>अगला चरण: गवाह एवं काज़ी साहब तय</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {selectedTradition === 'Muslim' && activeStepTab === 13 && (
              <div className="space-y-4">
                <div className="border-b border-[#E8E4DE] pb-3">
                  <span className="text-xs font-bold text-[#D4A373] uppercase tracking-wider">चरण १३B / Step 13B</span>
                  <h3 className="text-xl font-serif font-bold text-[#5A5A40]">
                    निकाह की तारीख, २ गवाह एवं काज़ी तय (Witnesses & Qazi)
                  </h3>
                  <p className="text-xs text-[#8C8479] mt-1">
                    शरई निकाह हेतु दो बालिग नेक गवाह, वली/वक़ील एवं काज़ी साहब का विवरण।
                  </p>
                </div>

                <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#E8E4DE] space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#5A5A40] mb-1">काज़ी साहब का नाम:</label>
                      <input
                        type="text"
                        value={workflowData.qaziName}
                        onChange={(e) => setWorkflowData({ ...workflowData, qaziName: e.target.value })}
                        className="w-full border border-[#E8E4DE] rounded-lg px-3 py-1.5 bg-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#5A5A40] mb-1">वक़ील (Wali / Representative):</label>
                      <input
                        type="text"
                        value={workflowData.vakilName}
                        onChange={(e) => setWorkflowData({ ...workflowData, vakilName: e.target.value })}
                        className="w-full border border-[#E8E4DE] rounded-lg px-3 py-1.5 bg-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#5A5A40] mb-1">गवाह १ (Witness 1):</label>
                      <input
                        type="text"
                        value={workflowData.witness1Name}
                        onChange={(e) => setWorkflowData({ ...workflowData, witness1Name: e.target.value })}
                        className="w-full border border-[#E8E4DE] rounded-lg px-3 py-1.5 bg-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#5A5A40] mb-1">गवाह २ (Witness 2):</label>
                      <input
                        type="text"
                        value={workflowData.witness2Name}
                        onChange={(e) => setWorkflowData({ ...workflowData, witness2Name: e.target.value })}
                        className="w-full border border-[#E8E4DE] rounded-lg px-3 py-1.5 bg-white text-xs"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleStepComplete(14)}
                  className="px-5 py-2 bg-[#5A5A40] text-white text-xs font-bold rounded-xl hover:bg-[#4a4a35] flex items-center gap-1.5"
                >
                  <span>अगला चरण: ईजाब-ओ-क़ुबूल (निकाह)</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {selectedTradition === 'Muslim' && activeStepTab === 14 && (
              <div className="space-y-4">
                <div className="border-b border-[#E8E4DE] pb-3">
                  <span className="text-xs font-bold text-[#D4A373] uppercase tracking-wider">चरण १४B / Step 14B</span>
                  <h3 className="text-xl font-serif font-bold text-[#5A5A40]">
                    निकाह - ईजाब-ओ-क़ुबूल (Ijab-o-Qubool Ceremony)
                  </h3>
                  <p className="text-xs text-[#8C8479] mt-1">
                    काज़ी साहब के समक्ष तीन बार "क़ुबूल है (Qubool Hai)" का पाक इक़रारनामा।
                  </p>
                </div>

                <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#D4A373]/40 text-center space-y-3">
                  <div className="text-3xl">🤲 💍</div>
                  <div className="font-serif font-bold text-lg text-[#5A5A40]">
                    "बारकल-लाहु लका व बारका अलैका व जमाआ बयनकुमा फ़ी ख़ैर"
                  </div>
                  <div className="text-xs text-[#4A453E] max-w-lg mx-auto leading-relaxed">
                    दूल्हा एवं दुल्हन ने काज़ी साहब एवं गवाहों की मौजूदगी में तयशुदा मेहर के साथ मुकद्दस निकाह को तीन बार "क़ुबूल है" कहकर स्वीकार किया।
                  </div>
                </div>

                <button
                  onClick={() => handleStepComplete(15)}
                  className="px-5 py-2 bg-[#5A5A40] text-white text-xs font-bold rounded-xl hover:bg-[#4a4a35] flex items-center gap-1.5"
                >
                  <span>अगला चरण: निकाहनामा हस्ताक्षर</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {selectedTradition === 'Muslim' && activeStepTab === 15 && (
              <div className="space-y-4">
                <div className="border-b border-[#E8E4DE] pb-3">
                  <span className="text-xs font-bold text-[#D4A373] uppercase tracking-wider">चरण १५B / Step 15B</span>
                  <h3 className="text-xl font-serif font-bold text-[#5A5A40]">
                    📜 निकाहनामा (Official Digital Nikahnama)
                  </h3>
                  <p className="text-xs text-[#8C8479] mt-1">
                    दूल्हा, दुल्हन, गवाहों एवं काज़ी साहब के आधिकारिक दस्तख़त युक्त निकाहनामा।
                  </p>
                </div>

                <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#E8E4DE] text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#5A5A40]">निकाहनामा रजिस्ट्रेशन: {workflowData.certificateNumber}</span>
                    <button
                      onClick={handlePrintCertificate}
                      className="px-3 py-1.5 bg-[#5A5A40] text-white rounded-lg font-bold flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>निकाहनामा डाउनलोड</span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => handleStepComplete(16)}
                  className="px-5 py-2 bg-[#5A5A40] text-white text-xs font-bold rounded-xl hover:bg-[#4a4a35] flex items-center gap-1.5"
                >
                  <span>अगला चरण: वलीमा एवं रुख़सती</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {selectedTradition === 'Muslim' && activeStepTab === 16 && (
              <div className="space-y-4">
                <div className="border-b border-[#E8E4DE] pb-3">
                  <span className="text-xs font-bold text-[#D4A373] uppercase tracking-wider">चरण १६B / Step 16B</span>
                  <h3 className="text-xl font-serif font-bold text-[#5A5A40]">
                    वलीमा एवं रुख़सती (Walima & Rukhsati)
                  </h3>
                  <p className="text-xs text-[#8C8479] mt-1">
                    सुन्नत वलीमा की दावत एवं नए ख़ानदान में इज़्ज़त व सम्मान के साथ रुख़सती।
                  </p>
                </div>

                <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#E8E4DE] text-xs text-[#4A453E] leading-relaxed">
                  दूल्हे के परिवार द्वारा सुन्नत वलीमा दावत का आयोजन एवं ज़ौजा का नए घर में दुआओं के साथ प्रवेश।
                </div>

                <button
                  onClick={() => handleStepComplete(17)}
                  className="px-5 py-2 bg-[#5A5A40] text-white text-xs font-bold rounded-xl hover:bg-[#4a4a35] flex items-center gap-1.5"
                >
                  <span>अगला चरण: विवाह पंजीकरण एवं सर्टिफिकेट</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {selectedTradition === 'Muslim' && activeStepTab === 17 && (
              <div className="space-y-4">
                <div className="border-b border-[#E8E4DE] pb-3">
                  <span className="text-xs font-bold text-[#D4A373] uppercase tracking-wider">चरण १७B / Step 17B</span>
                  <h3 className="text-xl font-serif font-bold text-[#5A5A40]">
                    📜 विवाह पंजीकरण प्रमाण पत्र (Marriage Certificate)
                  </h3>
                  <p className="text-xs text-[#8C8479] mt-1">
                    मुस्लिम पर्सनल लॉ एवं विशेष विवाह एक्ट के तहत आधिकारिक डिजिटल विवाह प्रमाण पत्र।
                  </p>
                </div>

                <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#2E7D32]/30 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-[#2E7D32]">पंजीकरण संख्या: {workflowData.certificateNumber}</div>
                      <div className="text-[#8C8479]">जारी तिथि: {workflowData.registrationDate}</div>
                    </div>
                    <button
                      onClick={handlePrintCertificate}
                      className="px-4 py-2 bg-[#5A5A40] text-white rounded-xl text-xs font-bold hover:bg-[#4a4a35] flex items-center gap-1.5 shadow-xs"
                    >
                      <Download className="w-4 h-4" />
                      <span>सर्टिफिकेट डाउनलोड / प्रिंट</span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => handleStepComplete(18)}
                  className="px-5 py-2 bg-[#D4A373] text-white text-xs font-bold rounded-xl hover:bg-[#c29263] flex items-center gap-1.5"
                >
                  <span>अंतिम चरण: वैवाहिक जीवन एवं स्टेटस अपडेट</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Final Common Step: Post-Marriage Life & Lifelong Harmony */}
            {((selectedTradition === 'Hindu' && activeStepTab === 17) ||
              (selectedTradition === 'Muslim' && activeStepTab === 18)) && (
              <div className="space-y-5">
                <div className="border-b border-[#E8E4DE] pb-3">
                  <span className="text-xs font-bold text-[#D4A373] uppercase tracking-wider">अंतिम चरण / Final Step</span>
                  <h3 className="text-xl font-serif font-bold text-[#5A5A40]">
                    ❤️ वैवाहिक जीवन, नए परिवार में प्रवेश एवं समाज में नई पहचान
                  </h3>
                  <p className="text-xs text-[#8C8479] mt-1">
                    शादी / निकाह के बाद सुखमय, समरसतापूर्ण गृहस्थ जीवन एवं Smart Vivah पर विवाहित प्रोफाइल स्टेटस।
                  </p>
                </div>

                <div className="bg-linear-to-br from-[#FFFDF9] to-[#FAF9F6] p-5 rounded-2xl border-2 border-[#D4A373] text-center space-y-3 shadow-xs">
                  <div className="w-14 h-14 bg-[#D4A373] text-white rounded-full flex items-center justify-center text-2xl mx-auto shadow-xs">
                    🎉
                  </div>
                  <h4 className="text-lg font-serif font-bold text-[#5A5A40]">
                    बधाई! विवाह / निकाह प्रक्रिया सफलतापूर्वक संपन्न हुई
                  </h4>
                  <p className="text-xs text-[#4A453E] max-w-md mx-auto leading-relaxed">
                    {groom.fullName} एवं {bride.fullName} का रिश्ता पवित्र बंधन में बंध चुका है। नीचे दिए गए बटन से अपनी प्रोफाइल को <strong>"विवाहित (Married / रिश्ता पक्का)"</strong> के रूप में अपडेट करें।
                  </p>

                  <div className="pt-2 flex flex-wrap justify-center gap-3">
                    <button
                      onClick={handleFinalizeMarriage}
                      className="px-6 py-2.5 bg-[#5A5A40] text-white rounded-full text-xs font-bold hover:bg-[#4a4a35] flex items-center gap-2 shadow-xs transform hover:scale-105 transition-transform"
                    >
                      <PartyPopper className="w-4 h-4 text-[#D4A373]" />
                      <span>प्रोफाइल स्टेटस "विवाहित / Married" करें</span>
                    </button>

                    <button
                      onClick={handlePrintCertificate}
                      className="px-6 py-2.5 bg-white border border-[#5A5A40] text-[#5A5A40] rounded-full text-xs font-bold hover:bg-[#FAF9F6] flex items-center gap-2"
                    >
                      <Printer className="w-4 h-4 text-[#D4A373]" />
                      <span>प्रमाण पत्र प्रिंट करें</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Embedded Live Certificate Preview if toggled */}
            {showCertificatePreview && (
              <div className="mt-6 border-t-2 border-[#D4A373] pt-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider">
                    {selectedTradition === 'Muslim' ? 'डिजिटल निकाहनामा पूर्वावलोकन' : 'डिजिटल मैरिज सर्टिफिकेट पूर्वावलोकन'}
                  </span>
                  <button
                    onClick={() => setShowCertificatePreview(false)}
                    className="text-xs text-[#8C8479] hover:text-[#5A5A40]"
                  >
                    छिपाएं (Hide)
                  </button>
                </div>
                <div
                  className="bg-white p-4 rounded-xl border border-[#E8E4DE] shadow-xs overflow-x-auto"
                  dangerouslySetInnerHTML={{
                    __html: generateMarriageCertificateHTML(groom, bride, workflowData)
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="bg-[#FAF9F6] px-5 py-3 border-t border-[#E8E4DE] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-[#8C8479] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#5A5A40]" />
            <span>Smart Vivah Verified Marriage & Nikah Lifecycle System</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 border border-[#E8E4DE] text-[#4A453E] hover:bg-white rounded-lg font-medium"
            >
              बंद करें (Close)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
