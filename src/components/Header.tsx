import React from 'react';
import { Heart, MessageSquare, ShieldCheck, Sparkles, User, Compass, Bell } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  currentUser: UserProfile;
  allProfiles: UserProfile[];
  onSwitchUser: (userId: string) => void;
  activeTab: 'discover' | 'interests' | 'chat' | 'admin' | 'myProfile';
  setActiveTab: (tab: 'discover' | 'interests' | 'chat' | 'admin' | 'myProfile') => void;
  pendingInterestsCount: number;
  unreadChatsCount: number;
  isAdmin: boolean;
  onToggleAdmin: () => void;
  onOpenAuthModal: () => void;
  onOpenMarriageWorkflow?: () => void;
  onOpenPackagesModal?: () => void;
  language: 'hi' | 'en';
  onToggleLanguage: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  allProfiles,
  onSwitchUser,
  activeTab,
  setActiveTab,
  pendingInterestsCount,
  unreadChatsCount,
  isAdmin,
  onToggleAdmin,
  onOpenAuthModal,
  onOpenMarriageWorkflow,
  onOpenPackagesModal,
  language,
  onToggleLanguage
}) => {
  return (
    <header id="main-app-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8E4DE] shadow-xs">
      {/* Top Banner with Natural Tones: Olive & Sand */}
      <div className="bg-[#5A5A40] text-white text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-[#4A453E]/20">
        <div className="flex items-center gap-2">
          <span className="bg-[#D4A373] text-white font-serif italic font-bold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider">
            {language === 'hi' ? 'स्मार्ट विवाह' : 'Smart Vivah'}
          </span>
          <span className="hidden sm:inline text-[#E8E4DE] text-[11px]">
            {language === 'hi'
              ? '१००% सत्यापित भारतीय वैवाहिक प्रोफाइल्स एवं प्राकृतिक अष्टकूट कुंडली मिलान'
              : '100% Verified Indian Matrimonial Profiles & Kundali Milan'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Demo Profile Switcher */}
          <div className="flex items-center gap-1.5 bg-[#4A453E]/60 px-2.5 py-0.5 rounded-full border border-[#E8E4DE]/30">
            <span className="text-[#E8E4DE] text-[11px] font-medium hidden md:inline">
              {language === 'hi' ? 'लॉगिन बदलें:' : 'Login as:'}
            </span>
            <select
              id="demo-user-selector"
              aria-label="Demo User Switcher"
              value={currentUser.id}
              onChange={(e) => onSwitchUser(e.target.value)}
              className="bg-transparent text-white text-[11px] font-semibold focus:outline-none cursor-pointer"
            >
              {allProfiles.map((p) => (
                <option key={p.id} value={p.id} className="text-[#4A453E] bg-[#FAF9F6]">
                  {p.gender === 'male' ? '🤵 ' : '👰 '} {p.fullName} ({p.gender === 'male' ? (language === 'hi' ? 'वर' : 'Groom') : (language === 'hi' ? 'वधू' : 'Bride')})
                </option>
              ))}
            </select>
          </div>

          {/* Language Toggle */}
          <button
            id="lang-toggle-btn"
            onClick={onToggleLanguage}
            className="px-2.5 py-0.5 bg-white/10 hover:bg-white/20 rounded-full border border-white/20 font-medium text-[11px] transition-colors"
          >
            {language === 'hi' ? 'English' : 'हिंदी'}
          </button>

          {/* Admin Switch */}
          <button
            id="admin-mode-toggle-btn"
            onClick={onToggleAdmin}
            className={`px-3 py-0.5 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 ${
              isAdmin
                ? 'bg-[#D4A373] text-white shadow-xs'
                : 'bg-[#4A453E]/80 text-[#E8E4DE] hover:bg-[#4A453E] border border-[#E8E4DE]/30'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            {language === 'hi' ? (isAdmin ? 'एडमिन पोर्टल (सक्रिय)' : 'एडमिन लॉगिन') : (isAdmin ? 'Admin Portal' : 'Admin Mode')}
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Name in Serif Natural Tones */}
          <div
            id="brand-logo-container"
            onClick={() => setActiveTab('discover')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-[#D4A373] rounded-full flex items-center justify-center text-white font-serif font-bold text-lg shadow-xs group-hover:scale-105 transition-transform tracking-tighter">
              SV
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-2xl tracking-tight text-[#5A5A40]">
                  {language === 'hi' ? 'स्मार्ट विवाह' : 'Smart Vivah'}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-[#F5F5F0] text-[#5A5A40] border border-[#E8E4DE] px-1.5 py-0.5 rounded-full">
                  {language === 'hi' ? 'स्मार्ट मैच' : 'Matrimony'}
                </span>
              </div>
              <p className="text-[11px] text-[#8C8479] font-medium hidden sm:block">
                {language === 'hi' ? 'स्मार्ट रिश्ते, अटूट विश्वास' : 'Smart Matchmaking • Family Trust'}
              </p>
            </div>
          </div>

          {/* Center Tabs Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button
              id="nav-tab-discover"
              onClick={() => {
                if (isAdmin) onToggleAdmin();
                setActiveTab('discover');
              }}
              className={`flex items-center gap-1.5 pb-1 transition-colors ${
                activeTab === 'discover' && !isAdmin
                  ? 'text-[#D4A373] border-b-2 border-[#D4A373] font-bold'
                  : 'text-[#4A453E] hover:text-[#D4A373]'
              }`}
            >
              <Compass className="w-4 h-4 text-[#D4A373]" />
              <span>{language === 'hi' ? 'मैच खोजें' : 'Discover'}</span>
            </button>

            <button
              id="nav-tab-interests"
              onClick={() => {
                if (isAdmin) onToggleAdmin();
                setActiveTab('interests');
              }}
              className={`relative flex items-center gap-1.5 pb-1 transition-colors ${
                activeTab === 'interests' && !isAdmin
                  ? 'text-[#D4A373] border-b-2 border-[#D4A373] font-bold'
                  : 'text-[#4A453E] hover:text-[#D4A373]'
              }`}
            >
              <Heart className="w-4 h-4 text-[#D4A373]" />
              <span>{language === 'hi' ? 'पसंद / इंटरेस्ट' : 'Interests'}</span>
              {pendingInterestsCount > 0 && (
                <span className="bg-[#D4A373] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {pendingInterestsCount}
                </span>
              )}
            </button>

            <button
              id="nav-tab-chat"
              onClick={() => {
                if (isAdmin) onToggleAdmin();
                setActiveTab('chat');
              }}
              className={`relative flex items-center gap-1.5 pb-1 transition-colors ${
                activeTab === 'chat' && !isAdmin
                  ? 'text-[#D4A373] border-b-2 border-[#D4A373] font-bold'
                  : 'text-[#4A453E] hover:text-[#D4A373]'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-[#D4A373]" />
              <span>{language === 'hi' ? 'चैट एवं संदेश' : 'Messages'}</span>
              {unreadChatsCount > 0 && (
                <span className="bg-[#5A5A40] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {unreadChatsCount}
                </span>
              )}
            </button>

            <button
              id="nav-tab-my-profile"
              onClick={() => {
                if (isAdmin) onToggleAdmin();
                setActiveTab('myProfile');
              }}
              className={`flex items-center gap-1.5 pb-1 transition-colors ${
                activeTab === 'myProfile' && !isAdmin
                  ? 'text-[#D4A373] border-b-2 border-[#D4A373] font-bold'
                  : 'text-[#4A453E] hover:text-[#D4A373]'
              }`}
            >
              <User className="w-4 h-4 text-[#D4A373]" />
              <span>{language === 'hi' ? 'मेरी प्रोफाइल' : 'My Profile'}</span>
            </button>

            {onOpenMarriageWorkflow && (
              <button
                id="nav-tab-workflow"
                onClick={onOpenMarriageWorkflow}
                className="flex items-center gap-1.5 px-3 py-1 bg-[#F5F5F0] hover:bg-[#E8E4DE] text-[#5A5A40] rounded-full text-xs font-bold transition-all border border-[#D4A373]/40 cursor-pointer"
              >
                <span>💍</span>
                <span>{language === 'hi' ? 'विवाह/निकाह फ्लो' : 'Vivah/Nikah Flow'}</span>
              </button>
            )}

            {onOpenPackagesModal && (
              <button
                id="nav-tab-packages"
                onClick={onOpenPackagesModal}
                className="flex items-center gap-1.5 px-3 py-1 bg-[#FAF9F6] hover:bg-[#F5F5F0] text-[#5A5A40] rounded-full text-xs font-bold transition-all border border-[#E8E4DE] cursor-pointer"
              >
                <span className="text-[#D4A373]">💎</span>
                <span>{language === 'hi' ? 'विवाह पैकेज (₹500-20k)' : 'Plans (₹500-20k)'}</span>
              </button>
            )}
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-3">
            {/* New Profile Registration Flow CTA */}
            <button
              id="btn-register-new-profile"
              onClick={onOpenAuthModal}
              className="hidden sm:inline-flex items-center gap-1.5 bg-[#5A5A40] text-white px-5 py-2 rounded-full text-xs font-medium hover:bg-[#4a4a35] transition-colors shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>{language === 'hi' ? '+ नया रजिस्ट्रेशन' : '+ Register Profile'}</span>
            </button>

            {/* Current Active User Chip */}
            <div
              id="current-user-avatar-badge"
              onClick={() => {
                if (isAdmin) onToggleAdmin();
                setActiveTab('myProfile');
              }}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full bg-[#FAF9F6] border border-[#E8E4DE] hover:border-[#D4A373] cursor-pointer transition-colors"
            >
              <div className="relative">
                <img
                  src={currentUser.photos[0] || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100'}
                  alt={currentUser.fullName}
                  className="w-8 h-8 rounded-full object-cover border-2 border-white"
                />
                {currentUser.isVerified && (
                  <div className="absolute -bottom-0.5 -right-0.5 bg-[#5A5A40] text-white rounded-full p-0.5">
                    <ShieldCheck className="w-2.5 h-2.5" />
                  </div>
                )}
              </div>
              <div className="text-left hidden lg:block">
                <div className="text-xs font-bold text-[#4A453E] truncate max-w-[120px]">
                  {currentUser.fullName}
                </div>
                <div className="text-[10px] text-[#8C8479] font-medium">
                  {currentUser.gender === 'male' ? (language === 'hi' ? 'वर' : 'Groom') : (language === 'hi' ? 'वधू' : 'Bride')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden border-t border-[#E8E4DE] bg-white px-2 py-1.5 flex items-center justify-around">
        <button
          onClick={() => {
            if (isAdmin) onToggleAdmin();
            setActiveTab('discover');
          }}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold ${
            activeTab === 'discover' && !isAdmin ? 'text-[#D4A373] bg-[#F5F5F0]' : 'text-[#8C8479]'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>{language === 'hi' ? 'मैच' : 'Matches'}</span>
        </button>

        <button
          onClick={() => {
            if (isAdmin) onToggleAdmin();
            setActiveTab('interests');
          }}
          className={`relative flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold ${
            activeTab === 'interests' && !isAdmin ? 'text-[#D4A373] bg-[#F5F5F0]' : 'text-[#8C8479]'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>{language === 'hi' ? 'इंटरेस्ट' : 'Interests'}</span>
          {pendingInterestsCount > 0 && (
            <span className="absolute top-0 right-2 w-2 h-2 bg-[#D4A373] rounded-full" />
          )}
        </button>

        <button
          onClick={() => {
            if (isAdmin) onToggleAdmin();
            setActiveTab('chat');
          }}
          className={`relative flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold ${
            activeTab === 'chat' && !isAdmin ? 'text-[#D4A373] bg-[#F5F5F0]' : 'text-[#8C8479]'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{language === 'hi' ? 'चैट' : 'Chat'}</span>
          {unreadChatsCount > 0 && (
            <span className="absolute top-0 right-2 w-2 h-2 bg-[#5A5A40] rounded-full" />
          )}
        </button>

        <button
          onClick={() => {
            if (isAdmin) onToggleAdmin();
            setActiveTab('myProfile');
          }}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold ${
            activeTab === 'myProfile' && !isAdmin ? 'text-[#D4A373] bg-[#F5F5F0]' : 'text-[#8C8479]'
          }`}
        >
          <User className="w-4 h-4" />
          <span>{language === 'hi' ? 'प्रोफ़ाइल' : 'Profile'}</span>
        </button>

        <button
          onClick={onOpenAuthModal}
          className="flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold text-[#5A5A40]"
        >
          <Sparkles className="w-4 h-4" />
          <span>{language === 'hi' ? 'OTP' : 'Register'}</span>
        </button>
      </div>
    </header>
  );
};
