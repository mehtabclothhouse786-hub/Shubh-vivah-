import React, { useState } from 'react';
import { Heart, CheckCircle2, XCircle, MessageSquare, Sparkles, ShieldCheck, Phone } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, InterestRequest } from '../types';

interface InterestsManagerProps {
  currentUser: UserProfile;
  allProfiles: UserProfile[];
  interests: InterestRequest[];
  onAcceptInterest: (interestId: string) => void;
  onDeclineInterest: (interestId: string) => void;
  onStartChat: (targetProfileId: string) => void;
  onOpenDetail: (profile: UserProfile) => void;
  language: 'hi' | 'en';
}

export const InterestsManager: React.FC<InterestsManagerProps> = ({
  currentUser,
  allProfiles,
  interests,
  onAcceptInterest,
  onDeclineInterest,
  onStartChat,
  onOpenDetail,
  language
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'received' | 'sent' | 'matches'>('received');

  // Filter interests
  const receivedInterests = interests.filter((i) => i.receiverId === currentUser.id);
  const sentInterests = interests.filter((i) => i.senderId === currentUser.id);

  // Mutual matches
  const mutualMatches = interests.filter(
    (i) => (i.senderId === currentUser.id || i.receiverId === currentUser.id) && i.status === 'accepted'
  );

  const getProfile = (userId: string) => allProfiles.find((p) => p.id === userId);

  const handleAcceptWithConfetti = (interestId: string) => {
    onAcceptInterest(interestId);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div id="interests-management-view" className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner with Natural Tones Olive & Sand */}
      <div className="bg-[#5A5A40] rounded-[32px] p-8 text-white shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-[#E8E4DE]">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#D4A373] text-white text-[11px] font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
            <Heart className="w-3 h-3 fill-white" />
            <span>{language === 'hi' ? 'चरण ७ एवं ८: इंटरेस्ट एवं कनेक्शन' : 'Step 7 & 8: Interest & Match Connect'}</span>
          </div>
          <h1 className="text-2xl font-serif font-bold">
            {language === 'hi' ? 'पसंद, रिश्ते के निमंत्रण एवं मैच' : 'Interests & Connected Matches'}
          </h1>
          <p className="text-xs text-[#E8E4DE] mt-1">
            {language === 'hi'
              ? 'जब दोनों पक्ष इंटरेस्ट स्वीकार करते हैं, तो चैट एवं पारिवारिक संपर्क विवरण अनलॉक हो जाते हैं।'
              : 'When both parties accept interest, chat and family contact details are unlocked.'}
          </p>
        </div>

        {/* Sub-tab pills */}
        <div className="flex bg-[#4A453E]/60 p-1 rounded-full border border-[#E8E4DE]/30 text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveSubTab('received')}
            className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${
              activeSubTab === 'received' ? 'bg-white text-[#5A5A40] shadow-xs font-bold' : 'text-[#E8E4DE] hover:text-white'
            }`}
          >
            <span>{language === 'hi' ? 'प्राप्त इंटरेस्ट' : 'Received'}</span>
            <span className="bg-[#D4A373] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {receivedInterests.filter((i) => i.status === 'pending').length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('matches')}
            className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${
              activeSubTab === 'matches' ? 'bg-white text-[#5A5A40] shadow-xs font-bold' : 'text-[#E8E4DE] hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
            <span>{language === 'hi' ? 'स्वीकृत मैच' : 'Matches'}</span>
            <span className="bg-[#5A5A40] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {mutualMatches.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('sent')}
            className={`px-4 py-2 rounded-full transition-all ${
              activeSubTab === 'sent' ? 'bg-white text-[#5A5A40] shadow-xs font-bold' : 'text-[#E8E4DE] hover:text-white'
            }`}
          >
            <span>{language === 'hi' ? 'भेजे गए' : 'Sent'}</span>
            <span className="ml-1 opacity-80">({sentInterests.length})</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB: RECEIVED INTERESTS */}
      {activeSubTab === 'received' && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-[#5A5A40] flex items-center gap-2">
            <span>{language === 'hi' ? 'आपको मिले रिश्ते के निमंत्रण (Received Requests)' : 'Received Interest Requests'}</span>
            <span className="text-xs font-normal text-[#8C8479]">
              ({receivedInterests.length} {language === 'hi' ? 'कुल' : 'total'})
            </span>
          </h2>

          {receivedInterests.length === 0 ? (
            <div className="bg-white rounded-[28px] p-10 text-center border border-[#E8E4DE] text-[#8C8479]">
              <Heart className="w-10 h-10 text-[#D4A373] mx-auto mb-2" />
              <p className="font-serif font-bold text-sm text-[#5A5A40]">
                {language === 'hi' ? 'अभी कोई नया इंटरेस्ट प्राप्त नहीं हुआ है' : 'No new interest requests received yet.'}
              </p>
              <p className="text-xs text-[#8C8479] mt-1">
                {language === 'hi'
                  ? 'अपनी प्रोफ़ाइल पूरी करें या अन्य प्रोफाइल्स को पहले इंटरेस्ट भेजें।'
                  : 'Complete your profile or send interests to get responses.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {receivedInterests.map((interest) => {
                const sender = getProfile(interest.senderId);
                if (!sender) return null;

                return (
                  <div
                    key={interest.id}
                    className="bg-white rounded-[24px] border border-[#E8E4DE] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="flex items-start gap-3.5">
                      <img
                        src={sender.photos[0]}
                        alt={sender.fullName}
                        onClick={() => onOpenDetail(sender)}
                        className="w-16 h-16 rounded-2xl object-cover border border-[#E8E4DE] cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3
                            onClick={() => onOpenDetail(sender)}
                            className="font-serif font-bold text-base text-[#5A5A40] truncate hover:text-[#D4A373] cursor-pointer"
                          >
                            {sender.fullName}
                          </h3>
                          {sender.isVerified && <ShieldCheck className="w-4 h-4 text-[#5A5A40] shrink-0" />}
                        </div>
                        <p className="text-xs text-[#8C8479] truncate">
                          {sender.age} वर्ष • {sender.occupation} ({sender.city})
                        </p>
                        <p className="text-[11px] text-[#D4A373] font-semibold mt-0.5">
                          {sender.religion} ({sender.caste}) • {sender.highestEducation}
                        </p>
                      </div>
                    </div>

                    {interest.message && (
                      <div className="mt-3.5 p-3 bg-[#FAF9F6] rounded-xl border border-[#E8E4DE] text-xs text-[#4A453E] italic">
                        &quot;{interest.message}&quot;
                      </div>
                    )}

                    <div className="mt-4 pt-3 border-t border-[#F5F5F0] flex items-center justify-between gap-2">
                      <button
                        onClick={() => onOpenDetail(sender)}
                        className="text-xs text-[#5A5A40] hover:text-[#4A453E] font-bold px-2 py-1"
                      >
                        {language === 'hi' ? 'बायोडाटा देखें' : 'View Biodata'}
                      </button>

                      {interest.status === 'pending' ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onDeclineInterest(interest.id)}
                            className="px-3.5 py-1.5 rounded-full border border-[#E8E4DE] text-[#8C8479] hover:bg-[#FAF9F6] text-xs font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>{language === 'hi' ? 'अस्वीकार' : 'Decline'}</span>
                          </button>
                          <button
                            onClick={() => handleAcceptWithConfetti(interest.id)}
                            className="px-4 py-1.5 rounded-full bg-[#5A5A40] hover:bg-[#4a4a35] text-white text-xs font-bold shadow-xs flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#D4A373]" />
                            <span>{language === 'hi' ? 'स्वीकार करें' : 'Accept'}</span>
                          </button>
                        </div>
                      ) : interest.status === 'accepted' ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#5A5A40] bg-[#F5F5F0] px-3 py-1 rounded-full border border-[#E8E4DE]">
                            ✓ {language === 'hi' ? 'स्वीकृत' : 'Accepted'}
                          </span>
                          <button
                            onClick={() => onStartChat(sender.id)}
                            className="px-3.5 py-1 bg-[#D4A373] hover:bg-[#c49262] text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-xs"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>{language === 'hi' ? 'चैट करें' : 'Chat'}</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs font-medium text-[#8C8479]">
                          {language === 'hi' ? 'अस्वीकार किया गया' : 'Declined'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB: MUTUAL MATCHES */}
      {activeSubTab === 'matches' && (
        <div className="space-y-4">
          <div className="p-5 bg-white border border-[#E8E4DE] rounded-[24px] flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D4A373] text-white flex items-center justify-center font-serif text-xl font-bold shadow-xs">
                M
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-[#5A5A40]">
                  {language === 'hi' ? 'बधाई हो! ये आपके परस्पर स्वीकृत रिश्ते हैं' : 'Connected Mutual Matches'}
                </h3>
                <p className="text-xs text-[#8C8479]">
                  {language === 'hi'
                    ? 'आप दोनों ने एक-दूसरे को पसंद किया है। अब सीधे चैट या परिवार से बात शुरू करें।'
                    : 'Both parties showed interest. You can now chat directly or exchange family contacts.'}
                </p>
              </div>
            </div>
          </div>

          {mutualMatches.length === 0 ? (
            <div className="bg-white rounded-[28px] p-10 text-center border border-[#E8E4DE] text-[#8C8479]">
              <Sparkles className="w-10 h-10 text-[#D4A373] mx-auto mb-2" />
              <p className="font-serif font-bold text-sm text-[#5A5A40]">
                {language === 'hi' ? 'अभी कोई परस्पर स्वीकृत मैच नहीं है' : 'No mutual matches yet.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mutualMatches.map((interest) => {
                const partnerId = interest.senderId === currentUser.id ? interest.receiverId : interest.senderId;
                const partner = getProfile(partnerId);
                if (!partner) return null;

                return (
                  <div
                    key={interest.id}
                    className="bg-white rounded-[24px] border border-[#E8E4DE] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="flex items-start gap-3.5">
                      <img
                        src={partner.photos[0]}
                        alt={partner.fullName}
                        onClick={() => onOpenDetail(partner)}
                        className="w-16 h-16 rounded-2xl object-cover border border-[#D4A373] cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3
                            onClick={() => onOpenDetail(partner)}
                            className="font-serif font-bold text-base text-[#5A5A40] truncate hover:text-[#D4A373] cursor-pointer"
                          >
                            {partner.fullName}
                          </h3>
                          <span className="text-[10px] bg-[#F5F5F0] text-[#5A5A40] font-bold px-2.5 py-0.5 rounded-full border border-[#E8E4DE]">
                            ✓ {language === 'hi' ? 'कनेक्टेड' : 'Connected'}
                          </span>
                        </div>
                        <p className="text-xs text-[#8C8479] truncate">{partner.occupation} • ₹{partner.annualIncomeLakhs} LPA</p>
                        <div className="text-[11px] text-[#5A5A40] flex items-center gap-1 mt-1 font-mono">
                          <Phone className="w-3 h-3 text-[#D4A373]" />
                          <span>{partner.mobile}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#F5F5F0] flex items-center justify-between gap-2">
                      <button
                        onClick={() => onOpenDetail(partner)}
                        className="text-xs text-[#5A5A40] hover:text-[#4A453E] font-bold px-2 py-1"
                      >
                        {language === 'hi' ? 'बायोडाटा देखें' : 'View Biodata'}
                      </button>

                      <button
                        onClick={() => onStartChat(partner.id)}
                        className="px-4 py-1.5 bg-[#D4A373] hover:bg-[#c49262] text-white rounded-full text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{language === 'hi' ? 'बातचीत शुरू करें' : 'Start Chat'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB: SENT INTERESTS */}
      {activeSubTab === 'sent' && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-[#5A5A40] flex items-center gap-2">
            <span>{language === 'hi' ? 'आपके द्वारा भेजे गए इंटरेस्ट (Sent Requests)' : 'Sent Requests'}</span>
            <span className="text-xs font-normal text-[#8C8479]">
              ({sentInterests.length} {language === 'hi' ? 'कुल' : 'total'})
            </span>
          </h2>

          {sentInterests.length === 0 ? (
            <div className="bg-white rounded-[28px] p-10 text-center border border-[#E8E4DE] text-[#8C8479]">
              <Heart className="w-10 h-10 text-[#E8E4DE] mx-auto mb-2" />
              <p className="font-serif font-bold text-sm text-[#5A5A40]">
                {language === 'hi' ? 'आपने अभी किसी को इंटरेस्ट नहीं भेजा है' : 'You haven’t sent any interest requests yet.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sentInterests.map((interest) => {
                const receiver = getProfile(interest.receiverId);
                if (!receiver) return null;

                return (
                  <div
                    key={interest.id}
                    className="bg-white rounded-[24px] border border-[#E8E4DE] p-4 shadow-xs flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={receiver.photos[0]}
                        alt={receiver.fullName}
                        onClick={() => onOpenDetail(receiver)}
                        className="w-14 h-14 rounded-2xl object-cover border border-[#E8E4DE] cursor-pointer"
                      />
                      <div>
                        <h3
                          onClick={() => onOpenDetail(receiver)}
                          className="font-serif font-bold text-sm text-[#5A5A40] hover:text-[#D4A373] cursor-pointer"
                        >
                          {receiver.fullName}
                        </h3>
                        <p className="text-xs text-[#8C8479]">{receiver.age} वर्ष • {receiver.city}</p>
                      </div>
                    </div>

                    <div>
                      {interest.status === 'accepted' ? (
                        <button
                          onClick={() => onStartChat(receiver.id)}
                          className="px-3.5 py-1.5 bg-[#D4A373] hover:bg-[#c49262] text-white rounded-full text-xs font-bold flex items-center gap-1 shadow-xs"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{language === 'hi' ? 'चैट करें' : 'Chat'}</span>
                        </button>
                      ) : interest.status === 'declined' ? (
                        <span className="text-xs text-[#8C8479] font-medium">{language === 'hi' ? 'अस्वीकृत' : 'Declined'}</span>
                      ) : (
                        <span className="text-xs font-bold text-[#8C8479] bg-[#F5F5F0] px-3 py-1 rounded-full border border-[#E8E4DE]">
                          ⏳ {language === 'hi' ? 'प्रतीक्षारत' : 'Pending'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
