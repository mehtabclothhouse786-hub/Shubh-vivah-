import React, { useState } from 'react';
import {
  Compass,
  Heart,
  MessageSquare,
  User,
  ShieldCheck,
  Sparkles,
  SlidersHorizontal,
  Search,
  CheckCircle2,
  Filter,
  Users,
  Printer,
  ChevronRight,
  Star,
  Award,
  Lock,
  ArrowRight,
  Bookmark,
  Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';

import {
  UserProfile,
  InterestRequest,
  ChatMessage,
  AdminReport,
  PartnerPreferences
} from './types';
import {
  INITIAL_PROFILES,
  INITIAL_INTERESTS,
  INITIAL_CHATS,
  INITIAL_REPORTS
} from './data/mockProfiles';
import { HINDU_CASTES, MUSLIM_CASTES } from './data/castes';
import { calculateKundaliMilan } from './utils/kundali';
import { generateMarriageBiodataHTML } from './utils/biodataGenerator';

// Components
import { Header } from './components/Header';
import { AuthModal } from './components/AuthModal';
import { ProfileBuilder } from './components/ProfileBuilder';
import { ProfileCard } from './components/ProfileCard';
import { ProfileDetailModal } from './components/ProfileDetailModal';
import { KundaliMilanModal } from './components/KundaliMilanModal';
import { InterestsManager } from './components/InterestsManager';
import { ChatMessenger } from './components/ChatMessenger';
import { FamilyConnectModal } from './components/FamilyConnectModal';
import { AdminDashboard } from './components/AdminDashboard';
import { SuccessStoryModal } from './components/SuccessStoryModal';
import { PartnerPreferencesModal } from './components/PartnerPreferencesModal';

import { BiodataPreviewModal } from './components/BiodataPreviewModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { MarriageWorkflowModal } from './components/MarriageWorkflowModal';

export default function App() {
  // State Management
  const [profiles, setProfiles] = useState<UserProfile[]>(INITIAL_PROFILES);
  const [currentUserId, setCurrentUserId] = useState<string>('user_groom_1'); // Rahul Sharma default
  const [interests, setInterests] = useState<InterestRequest[]>(INITIAL_INTERESTS);
  const [chats, setChats] = useState<ChatMessage[]>(INITIAL_CHATS);
  const [reports, setReports] = useState<AdminReport[]>(INITIAL_REPORTS);
  const [shortlistedIds, setShortlistedIds] = useState<string[]>(['user_bride_1']);

  // Toast Notification System
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Navigation & View States
  const [activeTab, setActiveTab] = useState<'discover' | 'interests' | 'chat' | 'admin' | 'myProfile'>('discover');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState<boolean>(false);
  const [language, setLanguage] = useState<'hi' | 'en'>('hi');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterVerifiedOnly, setFilterVerifiedOnly] = useState<boolean>(false);
  const [filterGovtOnly, setFilterGovtOnly] = useState<boolean>(false);
  const [filterKundaliTop, setFilterKundaliTop] = useState<boolean>(false);
  const [selectedReligion, setSelectedReligion] = useState<string>('All');
  const [selectedCommunity, setSelectedCommunity] = useState<string>('All');
  const [selectedProfession, setSelectedProfession] = useState<string>('All');
  const [activeFeedTab, setActiveFeedTab] = useState<'all' | 'highGun' | 'verified' | 'shortlisted'>('all');

  // Modals State
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isProfileBuilderOpen, setIsProfileBuilderOpen] = useState<boolean>(false);
  const [selectedProfileForDetail, setSelectedProfileForDetail] = useState<UserProfile | null>(null);
  const [selectedProfileForKundali, setSelectedProfileForKundali] = useState<UserProfile | null>(null);
  const [selectedPartnerForFamily, setSelectedPartnerForFamily] = useState<UserProfile | null>(null);
  const [selectedBiodataProfile, setSelectedBiodataProfile] = useState<UserProfile | null>(null);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState<boolean>(false);
  const [successStoryPartner, setSuccessStoryPartner] = useState<string | null>(null);
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState<boolean>(false);
  const [selectedWorkflowPartner, setSelectedWorkflowPartner] = useState<UserProfile | null>(null);

  // Active Chat partner
  const [activeChatPartnerId, setActiveChatPartnerId] = useState<string>('user_bride_2');

  // Current active profile
  const currentUser = profiles.find((p) => p.id === currentUserId) || profiles[0];

  // Derive opposite gender matches
  const targetGender = currentUser.gender === 'male' ? 'female' : 'male';
  const oppositeGenderProfiles = profiles.filter((p) => p.gender === targetGender && p.id !== currentUser.id);

  // Filtered Discover List
  const displayedProfiles = oppositeGenderProfiles.filter((p) => {
    // Search query
    const matchSearch =
      searchQuery.trim() === '' ||
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.caste.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.occupation.toLowerCase().includes(searchQuery.toLowerCase());

    // Verified
    const matchVerified = !filterVerifiedOnly || p.isVerified;

    // Govt Job
    const matchGovt = !filterGovtOnly || Boolean(p.isGovtJob);

    // Religion
    const matchReligion = selectedReligion === 'All' || p.religion === selectedReligion;

    // Community / Caste
    const matchCommunity =
      selectedCommunity === 'All' ||
      p.caste.toLowerCase().includes(selectedCommunity.toLowerCase()) ||
      (p.subCaste && p.subCaste.toLowerCase().includes(selectedCommunity.toLowerCase()));

    // Profession
    const matchProfession =
      selectedProfession === 'All' ||
      p.occupation.toLowerCase().includes(selectedProfession.toLowerCase()) ||
      (selectedProfession === 'IT' && (p.occupation.includes('Software') || p.occupation.includes('Engineer') || p.occupation.includes('Tech'))) ||
      (selectedProfession === 'Doctor' && (p.occupation.includes('Doctor') || p.occupation.includes('Physician') || p.occupation.includes('Medical'))) ||
      (selectedProfession === 'Govt' && p.isGovtJob);

    // Kundali Milan 28+ gunas check
    const kScore = calculateKundaliMilan(currentUser, p);
    const matchKundali = !filterKundaliTop || kScore.totalPoints >= 26;

    // Feed tab
    if (activeFeedTab === 'highGun' && kScore.totalPoints < 26) return false;
    if (activeFeedTab === 'verified' && !p.isVerified) return false;
    if (activeFeedTab === 'shortlisted' && !shortlistedIds.includes(p.id)) return false;

    return matchSearch && matchVerified && matchGovt && matchReligion && matchCommunity && matchProfession && matchKundali;
  });

  // Calculate notification counters
  const pendingInterestsCount = interests.filter(
    (i) => i.receiverId === currentUser.id && i.status === 'pending'
  ).length;

  const unreadChatsCount = chats.filter(
    (c) => c.receiverId === currentUser.id && !c.isRead
  ).length;

  // Handlers
  const handleSendInterest = (targetId: string) => {
    const target = profiles.find((p) => p.id === targetId);
    const existing = interests.find(
      (i) => i.senderId === currentUser.id && i.receiverId === targetId
    );
    if (existing) {
      showToast(language === 'hi' ? 'आप पहले ही रुचि भेज चुके हैं।' : 'Interest already sent.');
      return;
    }

    const newInterest: InterestRequest = {
      id: `interest_${Date.now()}`,
      senderId: currentUser.id,
      receiverId: targetId,
      status: 'pending',
      message:
        language === 'hi'
          ? `नमस्ते! मुझे आपकी प्रोफ़ाइल एवं पारिवारिक मूल्य बहुत अच्छे लगे। क्या हम बातचीत आगे बढ़ा सकते हैं?`
          : `Hello! I really liked your profile. Would love to connect with family and take things forward.`,
      sentAt: new Date().toISOString()
    };

    setInterests((prev) => [newInterest, ...prev]);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
    showToast(
      language === 'hi'
        ? `💖 ${target?.fullName || 'प्रोफ़ाइल'} को विवाह हेतु इंटरेस्ट भेजा गया!`
        : `💖 Interest sent to ${target?.fullName || 'profile'}!`
    );
  };

  const handleAcceptInterest = (interestId: string) => {
    const interest = interests.find((i) => i.id === interestId);
    const sender = profiles.find((p) => p.id === interest?.senderId);
    setInterests((prev) =>
      prev.map((i) => (i.id === interestId ? { ...i, status: 'accepted', respondedAt: new Date().toISOString() } : i))
    );
    showToast(
      language === 'hi'
        ? `🎉 ${sender?.fullName || 'मैच'} का रिश्ता स्वीकार किया गया! चैट अनलॉक हो गई है।`
        : `🎉 Connected with ${sender?.fullName || 'match'}! Chat unlocked.`
    );
  };

  const handleDeclineInterest = (interestId: string) => {
    setInterests((prev) =>
      prev.map((i) => (i.id === interestId ? { ...i, status: 'declined', respondedAt: new Date().toISOString() } : i))
    );
    showToast(language === 'hi' ? 'अनुरोध अस्वीकार किया गया।' : 'Request declined.');
  };

  const handleToggleShortlist = (targetId: string) => {
    const isShort = shortlistedIds.includes(targetId);
    setShortlistedIds((prev) =>
      isShort ? prev.filter((id) => id !== targetId) : [...prev, targetId]
    );
    showToast(
      isShort
        ? (language === 'hi' ? 'शॉर्टलिस्ट से हटा दिया गया।' : 'Removed from shortlist.')
        : (language === 'hi' ? '⭐ प्रोफाइल शॉर्टलिस्ट में जोड़ी गई।' : '⭐ Profile added to shortlist.')
    );
  };

  const handleSendMessage = (text: string) => {
    const activePartner = profiles.find((p) => p.id === activeChatPartnerId);
    if (!activePartner) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      matchId: `${currentUser.id}_${activePartner.id}`,
      senderId: currentUser.id,
      receiverId: activePartner.id,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true
    };

    setChats((prev) => [...prev, newMsg]);

    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: `msg_reply_${Date.now()}`,
        matchId: `${currentUser.id}_${activePartner.id}`,
        senderId: activePartner.id,
        receiverId: currentUser.id,
        text:
          language === 'hi'
            ? `नमस्ते ${currentUser.fullName.split(' ')[0]} जी! संदेश हेतु धन्यवाद। आपकी प्रोफ़ाइल एवं पारिवारिक मूल्य बहुत सकारात्मक लगे 🙏`
            : `Hello ${currentUser.fullName.split(' ')[0]}! Thanks for reaching out. Looking forward to speaking with family 🙏`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false
      };
      setChats((prev) => [...prev, replyMsg]);
    }, 1200);
  };

  const handleStartChatFromInterest = (partnerId: string) => {
    setActiveChatPartnerId(partnerId);
    setActiveTab('chat');
  };

  const handleFixRishta = (partnerName: string) => {
    setSuccessStoryPartner(partnerName);
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === currentUser.id
          ? {
              ...p,
              isRishtaFixed: true,
              fixedWithPartnerName: partnerName,
              fixedDate: new Date().toLocaleDateString('hi-IN')
            }
          : p
      )
    );
    showToast(language === 'hi' ? '🎉 बधाई! रिश्ता तय हो गया!' : '🎉 Congratulations! Rishta Fixed!');
  };

  const handleAdminApprove = (profileId: string) => {
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === profileId ? { ...p, isVerified: true, verificationStatus: 'verified' } : p
      )
    );
    showToast(language === 'hi' ? 'प्रोफ़ाइल सत्यापित (Verified) कर दी गई।' : 'Profile verified successfully.');
  };

  const handleAdminReject = (profileId: string, reason: string) => {
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === profileId ? { ...p, isVerified: false, verificationStatus: 'rejected' } : p
      )
    );
    showToast(language === 'hi' ? 'प्रोफ़ाइल अस्वीकार की गई।' : 'Profile rejected.');
  };

  const handleToggleUserStatus = (profileId: string) => {
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === profileId ? { ...p, isVerified: !p.isVerified } : p
      )
    );
  };

  const handleResolveReport = (reportId: string, action: 'action_taken' | 'dismissed') => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: action } : r))
    );
    showToast(language === 'hi' ? 'शिकायत का समाधान हो गया।' : 'Report marked as resolved.');
  };

  const handlePrintMyBiodata = () => {
    setSelectedBiodataProfile(currentUser);
  };

  const handleOpenMarriageWorkflow = (targetPartner?: UserProfile) => {
    if (targetPartner) {
      setSelectedWorkflowPartner(targetPartner);
    } else if (activeChatPartner) {
      setSelectedWorkflowPartner(activeChatPartner);
    } else if (oppositeGenderProfiles.length > 0) {
      setSelectedWorkflowPartner(oppositeGenderProfiles[0]);
    } else {
      setSelectedWorkflowPartner(profiles[1]);
    }
    setIsWorkflowModalOpen(true);
  };

  const handleMarkAsMarried = (partnerId: string, partnerName: string) => {
    const todayStr = new Date().toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === currentUser.id) {
          return {
            ...p,
            isRishtaFixed: true,
            fixedWithPartnerName: partnerName,
            fixedDate: todayStr
          };
        }
        if (p.id === partnerId) {
          return {
            ...p,
            isRishtaFixed: true,
            fixedWithPartnerName: currentUser.fullName,
            fixedDate: todayStr
          };
        }
        return p;
      })
    );

    showToast(
      language === 'hi'
        ? `🎉 शुभ विवाह/निकाह मुबारक! ${currentUser.fullName} एवं ${partnerName} का वैवाहिक पंजीकरण सफल रहा।`
        : `🎉 Mubarak & Congratulations! Marriage registered between ${currentUser.fullName} & ${partnerName}.`
    );
    setSuccessStoryPartner(partnerName);
  };

  // 11-step interactive navigation helper
  const handleWorkflowStepClick = (stepIndex: number) => {
    if (isAdmin) setIsAdmin(false);
    switch (stepIndex) {
      case 1:
        setIsAuthOpen(true);
        break;
      case 2:
      case 3:
        setIsProfileBuilderOpen(true);
        break;
      case 4:
        setIsPreferencesOpen(true);
        break;
      case 5:
        setActiveTab('discover');
        break;
      case 6:
        if (displayedProfiles[0]) setSelectedProfileForDetail(displayedProfiles[0]);
        else setActiveTab('discover');
        break;
      case 7:
        if (displayedProfiles[0]) handleSendInterest(displayedProfiles[0].id);
        break;
      case 8:
        setActiveTab('interests');
        break;
      case 9:
        setActiveTab('chat');
        break;
      case 10:
        if (activeChatPartner) setSelectedPartnerForFamily(activeChatPartner);
        else if (oppositeGenderProfiles[0]) setSelectedPartnerForFamily(oppositeGenderProfiles[0]);
        break;
      case 11:
        setSuccessStoryPartner(activeChatPartner?.fullName || 'प्रिया पटेल (Priya Patel)');
        break;
      default:
        setActiveTab('discover');
    }
  };

  // Connected partners for chat
  const mutualPartnerIds = Array.from(
    new Set(
      interests
        .filter(
          (i) => (i.senderId === currentUser.id || i.receiverId === currentUser.id) && i.status === 'accepted'
        )
        .map((i) => (i.senderId === currentUser.id ? i.receiverId : i.senderId))
    )
  );

  const matchedProfilesList = profiles.filter((p) => mutualPartnerIds.includes(p.id));
  const activeChatPartner = profiles.find((p) => p.id === activeChatPartnerId) || matchedProfilesList[0] || oppositeGenderProfiles[0];

  const activeChatMessages = chats.filter(
    (c) =>
      (c.senderId === currentUser.id && c.receiverId === activeChatPartner?.id) ||
      (c.senderId === activeChatPartner?.id && c.receiverId === currentUser.id)
  );

  return (
    <div id="matrimonial-app-root" className="min-h-screen bg-[#FAF9F6] text-[#4A453E] flex flex-col font-sans selection:bg-[#D4A373]/20 selection:text-[#5A5A40]">
      {/* App Header in Natural Tones */}
      <Header
        currentUser={currentUser}
        allProfiles={profiles}
        onSwitchUser={(id) => {
          setCurrentUserId(id);
          setIsAdmin(false);
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingInterestsCount={pendingInterestsCount}
        unreadChatsCount={unreadChatsCount}
        isAdmin={isAdmin}
        onToggleAdmin={() => {
          if (isAdmin) {
            setIsAdmin(false);
            setActiveTab('discover');
            showToast(language === 'hi' ? '🔒 एडमिन सत्र समाप्त। सुरक्षित रूप से बाहर आए।' : '🔒 Admin session ended safely.');
          } else {
            setIsAdminAuthOpen(true);
          }
        }}
        onOpenAuthModal={() => setIsAuthOpen(true)}
        onOpenMarriageWorkflow={() => handleOpenMarriageWorkflow()}
        language={language}
        onToggleLanguage={() => setLanguage((prev) => (prev === 'hi' ? 'en' : 'hi'))}
      />

      {/* 11-Step Interactive Workflow Progress Bar with Natural Tones Framing */}
      <section id="workflow-steps-banner" className="bg-white border-b border-[#E8E4DE] py-2.5 px-4 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto text-[11px] text-[#8C8479]">
          <div className="flex items-center gap-1.5 shrink-0 font-bold text-[#5A5A40] bg-[#F5F5F0] px-3 py-1 rounded-full border border-[#E8E4DE]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
            <span>{language === 'hi' ? 'विवाह वर्कफ़्लो चरण (क्लिक करें):' : 'Interactive Workflow Protocol:'}</span>
          </div>

          {[
            { step: 1, title: language === 'hi' ? '१. रजिस्ट्रेशन' : '1. Register' },
            { step: 2, title: language === 'hi' ? '२. प्रोफ़ाइल' : '2. Profile' },
            { step: 3, title: language === 'hi' ? '३. फोटो/बायो' : '3. Photos' },
            { step: 4, title: language === 'hi' ? '४. पसंद' : '4. Preferences' },
            { step: 5, title: language === 'hi' ? '५. सर्च' : '5. Search' },
            { step: 6, title: language === 'hi' ? '६. देखें' : '6. View' },
            { step: 7, title: language === 'hi' ? '७. इंटरेस्ट' : '7. Interest' },
            { step: 8, title: language === 'hi' ? '८. स्वीकृति' : '8. Accept' },
            { step: 9, title: language === 'hi' ? '९. चैट' : '9. Chat' },
            { step: 10, title: language === 'hi' ? '१०. परिवार' : '10. Family' },
            { step: 11, title: language === 'hi' ? '११. रिश्ता तय' : '11. Rishta Fixed' },
          ].map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleWorkflowStepClick(s.step)}
              className="flex items-center gap-1.5 shrink-0 px-2 py-1 rounded-lg hover:bg-[#F5F5F0] transition-colors cursor-pointer group"
              title={language === 'hi' ? `चरण ${s.step} पर जाएं` : `Go to Step ${s.step}`}
            >
              <span className="w-5 h-5 rounded-full bg-[#E8E4DE] text-[#5A5A40] font-bold flex items-center justify-center text-[10px] group-hover:bg-[#5A5A40] group-hover:text-white transition-colors">
                {s.step}
              </span>
              <span className="font-semibold text-[#4A453E] group-hover:text-[#5A5A40]">{s.title.split('. ')[1]}</span>
              {idx < 10 && <span className="text-[#A69F92] ml-1">→</span>}
            </button>
          ))}
        </div>
      </section>

      {/* Main App Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* VIEW 1: ADMIN DASHBOARD */}
        {isAdmin && (
          <AdminDashboard
            profiles={profiles}
            interests={interests}
            reports={reports}
            onApproveProfile={handleAdminApprove}
            onRejectProfile={handleAdminReject}
            onToggleUserStatus={handleToggleUserStatus}
            onResolveReport={handleResolveReport}
            onOpenDetail={(p) => setSelectedProfileForDetail(p)}
            language={language}
          />
        )}

        {/* VIEW 2: DISCOVER / SEARCH MATCHES WITH SIDEBAR PATTERN */}
        {!isAdmin && activeTab === 'discover' && (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left Preferences Sidebar in Natural Tones */}
            <aside className="w-full lg:w-72 bg-white rounded-[28px] border border-[#E8E4DE] p-6 shadow-xs flex flex-col gap-6 shrink-0">
              <div>
                <h3 className="text-xs uppercase tracking-widest font-bold text-[#A69F92] mb-4">
                  {language === 'hi' ? 'आपकी प्राथमिकताएं' : 'Partner Preferences'}
                </h3>
                <div className="space-y-4 text-xs text-[#8C8479]">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium text-[#8C8479]">
                      {language === 'hi' ? 'आयु सीमा (Age Range)' : 'Age Range'}
                    </label>
                    <div className="flex items-center justify-between text-sm text-[#4A453E] font-medium">
                      <span>{currentUser.preferences.minAge} - {currentUser.preferences.maxAge} {language === 'hi' ? 'वर्ष' : 'yrs'}</span>
                      <span
                        onClick={() => setIsPreferencesOpen(true)}
                        className="text-[#D4A373] underline cursor-pointer font-bold"
                      >
                        {language === 'hi' ? 'बदलें' : 'Edit'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium text-[#8C8479]">
                      {language === 'hi' ? 'मांगलिक वरीयता' : 'Manglik Filter'}
                    </label>
                    <span className="text-xs font-semibold text-[#5A5A40]">
                      {currentUser.preferences.manglikPreference}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium text-[#8C8479]">
                      {language === 'hi' ? 'न्यूनतम वार्षिक आय' : 'Min Income'}
                    </label>
                    <span className="text-xs font-semibold text-[#5A5A40]">
                      ₹{currentUser.preferences.minIncomeLakhs} {language === 'hi' ? 'लाख/वर्ष या अधिक' : 'LPA or higher'}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium text-[#8C8479]">
                      {language === 'hi' ? 'पसंदीदा स्थान' : 'Preferred Cities'}
                    </label>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {currentUser.preferences.locations.map((loc, i) => (
                        <span key={i} className="px-2.5 py-0.5 bg-[#F5F5F0] rounded-full text-[10px] text-[#4A453E] border border-[#E8E4DE]">
                          {loc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Completion Assistant Card */}
              <div className="mt-auto pt-4 border-t border-[#F5F5F0]">
                <div className="bg-[#FDFCFB] p-4 rounded-2xl border border-[#F0ECE7] space-y-2">
                  <p className="text-xs text-[#8C8479] italic leading-snug">
                    {language === 'hi'
                      ? 'अपनी प्रोफ़ाइल १००% पूरी करके २ गुना अधिक रिश्ते प्राप्त करें।'
                      : 'Complete your bio and photo album to get 2x more matches.'}
                  </p>
                  <div className="w-full bg-[#E8E4DE] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#D4A373] w-4/5 h-full rounded-full"></div>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-[#5A5A40]">
                    <span>{language === 'hi' ? 'प्रोफ़ाइल स्कोर' : 'Profile Strength'}</span>
                    <span>85%</span>
                  </div>
                </div>
              </div>
            </aside>

            {/* Right Feed Area */}
            <div className="flex-1 min-w-0 space-y-6 w-full">
              {/* Header Title Section */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-serif font-bold text-[#5A5A40]">
                    {language === 'hi'
                      ? (currentUser.gender === 'male' ? 'सुयोग्य वधू मैच (Perfect Matches)' : 'सुयोग्य वर मैच (Perfect Matches)')
                      : 'Perfect Matches for You'}
                  </h2>
                  <p className="text-sm text-[#8C8479] mt-0.5">
                    {language === 'hi'
                      ? 'आपकी शैक्षिक, सांस्कृतिक और अष्टकूट कुंडली प्राथमिकताओं पर आधारित'
                      : 'Based on your cultural, educational, and Astrological compatibility'}
                  </p>
                </div>

                {/* Search Matches CTA & Marriage Workflow CTA */}
                <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto flex-wrap">
                  <button
                    onClick={() => handleOpenMarriageWorkflow()}
                    className="bg-[#D4A373] text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-[#c49262] transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>💍</span>
                    <span>{language === 'hi' ? 'शादी/निकाह का पूरा फ्लो देखें' : 'Vivah/Nikah Workflow'}</span>
                  </button>

                  <button
                    onClick={() => setIsPreferencesOpen(true)}
                    className="bg-[#5A5A40] text-white px-5 py-2.5 rounded-full text-xs font-medium hover:bg-[#4a4a35] transition-colors shadow-xs flex items-center gap-1.5"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#D4A373]" />
                    <span>{language === 'hi' ? 'फ़िल्टर एवं वरीयताएं' : 'Filter Matches'}</span>
                  </button>
                </div>
              </div>

              {/* Complete Marriage & Nikah Flow Interactive Banner */}
              <div
                onClick={() => handleOpenMarriageWorkflow()}
                className="bg-gradient-to-r from-[#FAF9F6] via-white to-[#FAF9F6] border-2 border-[#D4A373]/50 rounded-[28px] p-5 shadow-xs hover:border-[#D4A373] transition-all cursor-pointer group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#5A5A40] text-white flex items-center justify-center text-2xl shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                      💍
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-serif font-bold text-base text-[#5A5A40]">
                          {language === 'hi' ? 'शादी / निकाह की पूरी प्रक्रिया (Step-by-Step Flow)' : 'Complete Vivah & Nikah Process Workflow'}
                        </h3>
                        <span className="bg-[#D4A373]/20 text-[#5A5A40] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#D4A373]/30">
                          {language === 'hi' ? '१७ चरण • हिन्दू व मुस्लिम रीति' : '17 Stages • Hindu & Muslim'}
                        </span>
                      </div>
                      <p className="text-xs text-[#8C8479] mt-0.5">
                        {language === 'hi'
                          ? 'रिश्ता ढूँढने से लेकर पहली बातचीत, रजामंदी, कुंडली/इस्तिक़ामत, सगाई/मंगनी, सप्तपदी/निकाहनामा, महर एवं मैरिज सर्टिफिकेट तक'
                          : 'From matching & family consent to Saptapadi/Mehr, Nikahnama, registry certificate & post-marriage checklist.'}
                      </p>
                    </div>
                  </div>

                  <button className="px-5 py-2 bg-[#5A5A40] group-hover:bg-[#4a4a35] text-white text-xs font-bold rounded-full transition-colors shrink-0 shadow-xs flex items-center gap-1">
                    <span>{language === 'hi' ? 'फ्लो शुरू करें' : 'Start Flow'}</span>
                    <span>→</span>
                  </button>
                </div>
              </div>

              {/* Search input & Feed tags */}
              <div className="bg-white rounded-[24px] p-4 border border-[#E8E4DE] shadow-xs space-y-3">
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-[#8C8479] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder={
                      language === 'hi'
                        ? 'नाम, शहर, जाति, पेशा (उदा. सॉफ्टवेयर इंजीनियर, डॉक्टर, CA, IAS) से खोजें...'
                        : 'Search by name, city, caste, occupation (e.g. Doctor, Architect, Engineer)...'
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#FAF9F6] border border-[#E8E4DE] rounded-xl focus:ring-2 focus:ring-[#D4A373] focus:border-[#D4A373] outline-none text-[#4A453E]"
                  />
                </div>

                {/* Quick Filters Row: Religion, Community & Profession Chips */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#F5F5F0]">
                  {/* Religion Filter */}
                  <span className="text-[10px] font-bold text-[#A69F92] uppercase tracking-wider">
                    {language === 'hi' ? 'धर्म (Religion):' : 'Religion:'}
                  </span>
                  {[
                    { id: 'All', hi: 'सभी धर्म (All)', en: 'All Religions' },
                    { id: 'Hindu', hi: '🕉️ हिन्दू विवाह (Hindu)', en: '🕉️ Hindu' },
                    { id: 'Muslim', hi: '🌙 मुस्लिम निकाह (Muslim)', en: '🌙 Muslim' }
                  ].map((rel) => (
                    <button
                      key={rel.id}
                      onClick={() => {
                        setSelectedReligion(rel.id);
                        setSelectedCommunity('All');
                      }}
                      className={`text-[11px] px-3 py-1 rounded-full border transition-all cursor-pointer font-bold ${
                        selectedReligion === rel.id
                          ? 'bg-[#5A5A40] text-white border-[#5A5A40] shadow-xs'
                          : 'bg-[#FAF9F6] text-[#4A453E] border-[#E8E4DE] hover:border-[#D4A373]'
                      }`}
                    >
                      {language === 'hi' ? rel.hi : rel.en}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#F5F5F0]">
                  <span className="text-[10px] font-bold text-[#A69F92] uppercase tracking-wider">
                    {language === 'hi' ? 'समुदाय / बिरादरी:' : 'Community:'}
                  </span>
                  {(selectedReligion === 'Muslim'
                    ? ['All', 'Khan / Pathan', 'Ansari', 'Syed', 'Siddiqui', 'Qureshi', 'Mansoori', 'Sheikh']
                    : selectedReligion === 'Hindu'
                    ? ['All', 'Brahmin', 'Rajput', 'Agarwal', 'Patel', 'Yadav', 'Jat', 'Khatri']
                    : ['All', 'Brahmin', 'Khan / Pathan', 'Rajput', 'Syed', 'Agarwal', 'Ansari', 'Yadav', 'Qureshi']
                  ).map((comm) => (
                    <button
                      key={comm}
                      onClick={() => setSelectedCommunity(comm)}
                      className={`text-[11px] px-2.5 py-0.5 rounded-full border transition-all cursor-pointer ${
                        selectedCommunity === comm
                          ? 'bg-[#D4A373] text-white border-[#D4A373] font-bold shadow-xs'
                          : 'bg-[#FAF9F6] text-[#4A453E] border-[#E8E4DE] hover:border-[#D4A373]'
                      }`}
                    >
                      {comm === 'All' ? (language === 'hi' ? 'सभी समुदाय' : 'All') : comm}
                    </button>
                  ))}

                  {/* All Castes Dropdown */}
                  <select
                    value={
                      ['All', 'Khan / Pathan', 'Ansari', 'Syed', 'Siddiqui', 'Qureshi', 'Mansoori', 'Sheikh', 'Brahmin', 'Rajput', 'Agarwal', 'Patel', 'Yadav', 'Jat', 'Khatri'].includes(selectedCommunity)
                        ? ''
                        : selectedCommunity
                    }
                    onChange={(e) => {
                      if (e.target.value) {
                        setSelectedCommunity(e.target.value);
                      }
                    }}
                    className="text-[11px] px-2 py-0.5 rounded-full border border-[#D4A373] bg-white text-[#5A5A40] font-semibold outline-none cursor-pointer"
                  >
                    <option value="">{language === 'hi' ? '📜 अन्य सभी जातियाँ...' : '📜 All other castes...'}</option>
                    {(selectedReligion === 'Muslim' ? MUSLIM_CASTES : selectedReligion === 'Hindu' ? HINDU_CASTES : [...HINDU_CASTES, ...MUSLIM_CASTES]).map((c) => (
                      <option key={c.id} value={c.nameEn}>
                        {language === 'hi' ? c.nameHi : c.nameEn}
                      </option>
                    ))}
                  </select>

                  <span className="text-[10px] font-bold text-[#A69F92] uppercase tracking-wider ml-2">
                    {language === 'hi' ? 'पेशा:' : 'Profession:'}
                  </span>
                  {['All', 'IT', 'Doctor', 'Govt'].map((prof) => (
                    <button
                      key={prof}
                      onClick={() => setSelectedProfession(prof)}
                      className={`text-[11px] px-2.5 py-0.5 rounded-full border transition-all cursor-pointer ${
                        selectedProfession === prof
                          ? 'bg-[#5A5A40] text-white border-[#5A5A40] font-bold shadow-xs'
                          : 'bg-[#FAF9F6] text-[#4A453E] border-[#E8E4DE] hover:border-[#D4A373]'
                      }`}
                    >
                      {prof === 'All' ? (language === 'hi' ? 'सभी पेशे' : 'All') : prof === 'IT' ? 'Software / IT' : prof === 'Doctor' ? 'Medical / Doctor' : 'Govt Service'}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#F5F5F0]">
                  {/* Feed Tabs */}
                  <div className="flex bg-[#F5F5F0] p-1 rounded-xl gap-1 text-xs font-medium">
                    <button
                      onClick={() => setActiveFeedTab('all')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        activeFeedTab === 'all' ? 'bg-white text-[#5A5A40] shadow-xs font-bold' : 'text-[#8C8479] hover:text-[#4A453E]'
                      }`}
                    >
                      {language === 'hi' ? 'सभी मैच' : 'All'} ({oppositeGenderProfiles.length})
                    </button>
                    <button
                      onClick={() => setActiveFeedTab('highGun')}
                      className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                        activeFeedTab === 'highGun' ? 'bg-white text-[#5A5A40] shadow-xs font-bold' : 'text-[#8C8479] hover:text-[#4A453E]'
                      }`}
                    >
                      <Sparkles className="w-3 h-3 text-[#D4A373]" />
                      <span>{language === 'hi' ? 'कुंडली (२६+ गुण)' : 'Kundali (26+)'}</span>
                    </button>
                    <button
                      onClick={() => setActiveFeedTab('verified')}
                      className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                        activeFeedTab === 'verified' ? 'bg-white text-[#5A5A40] shadow-xs font-bold' : 'text-[#8C8479] hover:text-[#4A453E]'
                      }`}
                    >
                      <ShieldCheck className="w-3 h-3 text-[#5A5A40]" />
                      <span>{language === 'hi' ? 'सत्यापित' : 'Verified'}</span>
                    </button>
                    <button
                      onClick={() => setActiveFeedTab('shortlisted')}
                      className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                        activeFeedTab === 'shortlisted' ? 'bg-white text-[#5A5A40] shadow-xs font-bold' : 'text-[#8C8479] hover:text-[#4A453E]'
                      }`}
                    >
                      <Bookmark className="w-3 h-3 text-[#D4A373]" />
                      <span>{language === 'hi' ? 'शॉर्टलिस्ट' : 'Shortlisted'} ({shortlistedIds.length})</span>
                    </button>
                  </div>

                  {/* Fast Checkboxes */}
                  <div className="flex items-center gap-4 text-xs text-[#8C8479]">
                    <label className="flex items-center gap-1.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={filterGovtOnly}
                        onChange={(e) => setFilterGovtOnly(e.target.checked)}
                        className="rounded text-[#5A5A40] focus:ring-[#5A5A40]"
                      />
                      <span className="font-medium">{language === 'hi' ? 'सरकारी नौकरी' : 'Govt Job'}</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={filterVerifiedOnly}
                        onChange={(e) => setFilterVerifiedOnly(e.target.checked)}
                        className="rounded text-[#5A5A40] focus:ring-[#5A5A40]"
                      />
                      <span className="font-medium">{language === 'hi' ? 'केवल वेरीफाइड' : 'Verified Only'}</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Profiles Grid */}
              {displayedProfiles.length === 0 ? (
                <div className="bg-white rounded-[32px] p-12 text-center border border-[#E8E4DE] text-[#8C8479] max-w-lg mx-auto">
                  <Heart className="w-12 h-12 text-[#D4A373] mx-auto mb-3" />
                  <h3 className="text-base font-serif font-bold text-[#5A5A40]">
                    {language === 'hi' ? 'कोई मेल खाती प्रोफ़ाइल नहीं मिली' : 'No matching profiles found'}
                  </h3>
                  <p className="text-xs text-[#8C8479] mt-1">
                    {language === 'hi'
                      ? 'कृपया फ़िल्टर रीसेट करें या सर्च कीवर्ड बदलें।'
                      : 'Try broadening your preferences or clearing search keywords.'}
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilterGovtOnly(false);
                      setFilterVerifiedOnly(false);
                      setFilterKundaliTop(false);
                      setActiveFeedTab('all');
                    }}
                    className="mt-4 px-5 py-2 bg-[#5A5A40] text-white text-xs font-bold rounded-full shadow cursor-pointer"
                  >
                    {language === 'hi' ? 'फ़िल्टर हटाएं' : 'Reset Filters'}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {displayedProfiles.map((p) => {
                    const interestReq = interests.find(
                      (i) =>
                        (i.senderId === currentUser.id && i.receiverId === p.id) ||
                        (i.senderId === p.id && i.receiverId === currentUser.id)
                    );
                    const isShortlisted = shortlistedIds.includes(p.id);

                    return (
                      <ProfileCard
                        key={p.id}
                        profile={p}
                        currentUser={currentUser}
                        onSendInterest={handleSendInterest}
                        onOpenDetail={(prof) => setSelectedProfileForDetail(prof)}
                        onOpenKundali={(prof) => setSelectedProfileForKundali(prof)}
                        onToggleShortlist={handleToggleShortlist}
                        isShortlisted={isShortlisted}
                        interestStatus={interestReq ? interestReq.status : 'none'}
                        language={language}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 3: INTERESTS & MUTUAL MATCHES */}
        {!isAdmin && activeTab === 'interests' && (
          <InterestsManager
            currentUser={currentUser}
            allProfiles={profiles}
            interests={interests}
            onAcceptInterest={handleAcceptInterest}
            onDeclineInterest={handleDeclineInterest}
            onStartChat={handleStartChatFromInterest}
            onOpenDetail={(p) => setSelectedProfileForDetail(p)}
            language={language}
          />
        )}

        {/* VIEW 4: CHAT & CONTACT */}
        {!isAdmin && activeTab === 'chat' && (
          <ChatMessenger
            currentUser={currentUser}
            activePartner={activeChatPartner}
            messages={activeChatMessages}
            onSendMessage={handleSendMessage}
            onOpenFamilyModal={(partner) => setSelectedPartnerForFamily(partner)}
            onOpenMarriageWorkflow={(partner) => handleOpenMarriageWorkflow(partner)}
            allMatchedProfiles={matchedProfilesList.length > 0 ? matchedProfilesList : oppositeGenderProfiles.slice(0, 3)}
            onSelectPartner={(partner) => setActiveChatPartnerId(partner.id)}
            language={language}
          />
        )}

        {/* VIEW 5: MY PROFILE & BIODATA VIEW */}
        {!isAdmin && activeTab === 'myProfile' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Natural Tones Header Banner */}
            <div className="bg-[#5A5A40] rounded-[32px] p-8 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-[#E8E4DE]">
              <div className="flex items-center gap-5">
                <img
                  src={currentUser.photos[0]}
                  alt={currentUser.fullName}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white/90 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-serif font-bold">{currentUser.fullName}</h1>
                    {currentUser.isVerified && <ShieldCheck className="w-5 h-5 text-[#D4A373]" />}
                  </div>
                  <p className="text-xs text-[#E8E4DE] mt-1 font-medium">
                    {currentUser.gender === 'male' ? 'वर प्रोफाइल' : 'वधू प्रोफाइल'} • ID: {currentUser.id} • {currentUser.city}, {currentUser.state}
                  </p>
                  <div className="mt-3 inline-flex items-center gap-2 text-[11px] bg-white/10 px-3 py-1 rounded-full font-medium text-[#E8E4DE]">
                    <span>{currentUser.highestEducation}</span> • <span>{currentUser.occupation}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrintMyBiodata}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/20"
                >
                  <Printer className="w-4 h-4 text-[#D4A373]" />
                  <span>{language === 'hi' ? 'बायोडाटा प्रिंट / PDF' : 'Print Biodata'}</span>
                </button>
                <button
                  onClick={() => setIsProfileBuilderOpen(true)}
                  className="px-5 py-2.5 bg-[#D4A373] hover:bg-[#c49262] text-white rounded-full text-xs font-bold shadow-md shadow-[#D4A373]/20 transition-all cursor-pointer"
                >
                  {language === 'hi' ? 'प्रोफ़ाइल संपादित करें' : 'Edit Profile'}
                </button>
              </div>
            </div>

            {/* Profile Overview Card */}
            <div className="bg-white rounded-[32px] p-8 border border-[#E8E4DE] shadow-xs space-y-6">
              <div>
                <h3 className="text-xs uppercase tracking-widest font-bold text-[#A69F92] mb-3">
                  {language === 'hi' ? 'आत्मपरिचय एवं बायो (About Me)' : 'About Me'}
                </h3>
                <p className="text-sm text-[#4A453E] italic bg-[#FAF9F6] p-5 rounded-2xl border border-[#E8E4DE] leading-relaxed">
                  &quot;{currentUser.bio}&quot;
                </p>
              </div>

              {/* Specs Grid in Natural Tones styling */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-[#E8E4DE]">
                  <span className="text-[#8C8479] block text-[11px]">धर्म एवं जाति</span>
                  <strong className="text-[#5A5A40] text-sm font-serif">{currentUser.religion} - {currentUser.caste}</strong>
                  <div className="text-[#8C8479] mt-0.5">गोत्र: {currentUser.kundali.gotra || 'कश्यप'}</div>
                </div>

                <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-[#E8E4DE]">
                  <span className="text-[#8C8479] block text-[11px]">कुंडली एवं राशि</span>
                  <strong className="text-[#5A5A40] text-sm font-serif">{currentUser.kundali.rashi}</strong>
                  <div className="text-[#8C8479] mt-0.5">नक्षत्र: {currentUser.kundali.nakshatra} ({currentUser.kundali.manglik})</div>
                </div>

                <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-[#E8E4DE]">
                  <span className="text-[#8C8479] block text-[11px]">वार्षिक आय</span>
                  <strong className="text-[#D4A373] text-sm font-bold">₹{currentUser.annualIncomeLakhs} लाख/वर्ष</strong>
                  <div className="text-[#8C8479] mt-0.5">{currentUser.companyName}</div>
                </div>

                <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-[#E8E4DE]">
                  <span className="text-[#8C8479] block text-[11px]">कद एवं आयु</span>
                  <strong className="text-[#5A5A40] text-sm font-serif">{currentUser.heightFeet}&apos;{currentUser.heightInches}&quot; ({currentUser.age} वर्ष)</strong>
                  <div className="text-[#8C8479] mt-0.5">जन्म: {currentUser.dob}</div>
                </div>

                <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-[#E8E4DE]">
                  <span className="text-[#8C8479] block text-[11px]">पारिवारिक पृष्ठभूमि</span>
                  <strong className="text-[#5A5A40] text-sm font-serif">{currentUser.family.familyType}</strong>
                  <div className="text-[#8C8479] mt-0.5">पिता: {currentUser.family.fatherOccupation}</div>
                </div>

                <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-[#E8E4DE]">
                  <span className="text-[#8C8479] block text-[11px]">सत्यापित संपर्क</span>
                  <strong className="text-[#4A453E] text-sm font-mono">{currentUser.mobile}</strong>
                  <div className="text-[#8C8479] mt-0.5">{currentUser.email}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ALL INTERACTIVE MODALS */}
      {/* 1. Registration / OTP Flow Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(data) => {
          setIsAuthOpen(false);
          setIsProfileBuilderOpen(true);
        }}
        language={language}
      />

      {/* 2. 4-Step Profile Builder */}
      {isProfileBuilderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="max-w-3xl w-full my-8">
            <ProfileBuilder
              initialData={currentUser}
              onComplete={(newProfile) => {
                setProfiles((prev) => [newProfile, ...prev.filter((p) => p.id !== newProfile.id)]);
                setCurrentUserId(newProfile.id);
                setIsProfileBuilderOpen(false);
                confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
              }}
              onCancel={() => setIsProfileBuilderOpen(false)}
              language={language}
            />
          </div>
        </div>
      )}

      {/* 3. Detailed Profile Modal */}
      {selectedProfileForDetail && (
        <ProfileDetailModal
          isOpen={Boolean(selectedProfileForDetail)}
          onClose={() => setSelectedProfileForDetail(null)}
          profile={selectedProfileForDetail}
          currentUser={currentUser}
          onSendInterest={handleSendInterest}
          interestStatus={
            interests.find(
              (i) =>
                (i.senderId === currentUser.id && i.receiverId === selectedProfileForDetail.id) ||
                (i.senderId === selectedProfileForDetail.id && i.receiverId === currentUser.id)
            )?.status || 'none'
          }
          onReportProfile={(id) => {
            const newRep: AdminReport = {
              id: `rep_${Date.now()}`,
              reportedUserId: id,
              reporterUserId: currentUser.id,
              reason: 'Fake Profile',
              details: 'यूज़र द्वारा प्रोफाइल समीक्षा का अनुरोध किया गया।',
              status: 'pending',
              reportedAt: new Date().toISOString().split('T')[0]
            };
            setReports((prev) => [newRep, ...prev]);
            showToast(language === 'hi' ? 'आपकी रिपोर्ट दर्ज कर ली गई है। एडमिन टीम शीघ्र समीक्षा करेगी।' : 'Report submitted for admin review.');
          }}
          onOpenMarriageWorkflow={(profile) => handleOpenMarriageWorkflow(profile)}
          language={language}
        />
      )}

      {/* 4. Deep Kundali Milan Modal */}
      {selectedProfileForKundali && (
        <KundaliMilanModal
          isOpen={Boolean(selectedProfileForKundali)}
          onClose={() => setSelectedProfileForKundali(null)}
          currentUser={currentUser}
          targetProfile={selectedProfileForKundali}
          language={language}
          onSendInterest={handleSendInterest}
          isInterestSent={interests.some(
            (i) => i.senderId === currentUser.id && i.receiverId === selectedProfileForKundali.id
          )}
        />
      )}

      {/* 5. Family Connect & Rishta Fixed Modal */}
      {selectedPartnerForFamily && (
        <FamilyConnectModal
          isOpen={Boolean(selectedPartnerForFamily)}
          onClose={() => setSelectedPartnerForFamily(null)}
          currentUser={currentUser}
          partner={selectedPartnerForFamily}
          onFixRishta={handleFixRishta}
          language={language}
        />
      )}

      {/* 6. Partner Preferences Modal */}
      <PartnerPreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        currentUser={currentUser}
        onSave={(updatedPref) => {
          setProfiles((prev) =>
            prev.map((p) => (p.id === currentUser.id ? { ...p, preferences: updatedPref } : p))
          );
          showToast(language === 'hi' ? 'आपकी जीवनसाथी प्राथमिकताएं सहेज ली गईं।' : 'Partner preferences saved.');
        }}
        language={language}
      />

      {/* 7. Success Story / Rishta Fixed Celebration Modal */}
      {successStoryPartner && (
        <SuccessStoryModal
          isOpen={Boolean(successStoryPartner)}
          onClose={() => setSuccessStoryPartner(null)}
          currentUser={currentUser}
          partnerName={successStoryPartner}
          language={language}
        />
      )}

      {/* 8. Marriage Biodata Preview Modal */}
      {selectedBiodataProfile && (
        <BiodataPreviewModal
          isOpen={Boolean(selectedBiodataProfile)}
          onClose={() => setSelectedBiodataProfile(null)}
          profile={selectedBiodataProfile}
          language={language}
          onShowToast={showToast}
        />
      )}

      {/* 9. Admin Security Password Modal (Password: K@7m#2) */}
      <AdminAuthModal
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
        onSuccess={() => {
          setIsAdminAuthOpen(false);
          setIsAdmin(true);
          setActiveTab('admin');
          showToast(
            language === 'hi'
              ? '✅ सुरक्षा कोड सत्यापित! एडमिन कंट्रोल पैनल अनलॉक हो गया है।'
              : '✅ Admin passcode verified! Admin Control unlocked.'
          );
        }}
        language={language}
      />

      {/* 10. Complete Marriage & Nikah Workflow Modal */}
      {isWorkflowModalOpen && (
        <MarriageWorkflowModal
          isOpen={isWorkflowModalOpen}
          onClose={() => setIsWorkflowModalOpen(false)}
          currentUser={currentUser}
          partner={selectedWorkflowPartner || oppositeGenderProfiles[0] || profiles[1]}
          onMarkAsMarried={handleMarkAsMarried}
          language={language}
        />
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          id="app-global-toast"
          className="fixed bottom-6 right-6 z-50 bg-[#4A453E] text-white px-5 py-3 rounded-2xl shadow-xl border border-[#E8E4DE]/30 text-xs font-semibold flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          <Sparkles className="w-4 h-4 text-[#D4A373] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Bottom Footer styled in Natural Tones Olive & Sand */}
      <footer id="app-main-footer" className="bg-[#5A5A40] text-white py-6 mt-12 border-t border-[#4A453E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#D4A373] rounded-full flex items-center justify-center text-white font-serif italic text-lg font-bold">
              B
            </div>
            <div>
              <span className="font-serif font-bold text-lg text-white">Bandhan Vivah (बंधन विवाह)</span>
              <span className="text-[11px] text-[#E8E4DE] block opacity-80">पवित्र रिश्ते, अटूट विश्वास • 100% Verified Matrimonial</span>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 text-[10px] font-bold uppercase tracking-widest text-[#E8E4DE] flex-wrap">
            <span className="opacity-80 cursor-pointer hover:text-[#D4A373]" onClick={() => handleWorkflowStepClick(1)}>1. Register</span>
            <span className="opacity-80 cursor-pointer hover:text-[#D4A373]" onClick={() => handleWorkflowStepClick(2)}>2. Profile</span>
            <span className="text-[#D4A373] cursor-pointer" onClick={() => handleWorkflowStepClick(5)}>3. Discover</span>
            <span className="opacity-80 cursor-pointer hover:text-[#D4A373]" onClick={() => handleWorkflowStepClick(7)}>4. Interest</span>
            <span className="opacity-80 cursor-pointer hover:text-[#D4A373]" onClick={() => handleWorkflowStepClick(9)}>5. Connect</span>
            <span className="opacity-80 cursor-pointer hover:text-[#D4A373]" onClick={() => handleWorkflowStepClick(11)}>6. Rishta Fixed</span>
          </div>

          <div className="text-[11px] text-[#E8E4DE] opacity-70">
            Natural Tones Matrimonial Edition
          </div>
        </div>
      </footer>
    </div>
  );
}
