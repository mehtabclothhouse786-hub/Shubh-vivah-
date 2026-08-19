import React, { useState } from 'react';
import { Send, Phone, Video, Users, Sparkles, CheckCheck, Smile, Paperclip, HeartHandshake, ShieldCheck, ArrowLeft } from 'lucide-react';
import { UserProfile, ChatMessage } from '../types';

interface ChatMessengerProps {
  currentUser: UserProfile;
  activePartner: UserProfile;
  messages: ChatMessage[];
  onSendMessage: (text: string, isFamilyCard?: boolean) => void;
  onOpenFamilyModal: (partner: UserProfile) => void;
  onOpenMarriageWorkflow?: (partner: UserProfile) => void;
  onBackToList?: () => void;
  allMatchedProfiles: UserProfile[];
  onSelectPartner: (partner: UserProfile) => void;
  language: 'hi' | 'en';
}

export const ChatMessenger: React.FC<ChatMessengerProps> = ({
  currentUser,
  activePartner,
  messages,
  onSendMessage,
  onOpenFamilyModal,
  onOpenMarriageWorkflow,
  onBackToList,
  allMatchedProfiles,
  onSelectPartner,
  language
}) => {
  const [inputText, setInputText] = useState('');
  const [isCalling, setIsCalling] = useState<'audio' | 'video' | null>(null);

  const quickIcebreakers = [
    language === 'hi' ? 'नमस्ते! आपकी प्रोफ़ाइल और पारिवारिक मूल्य बहुत अच्छे लगे 🙏' : 'Namaste! Really liked your profile and family background 🙏',
    language === 'hi' ? 'क्या हमारे परिवार आपस में कुंडली एवं परिचर्चा हेतु बात कर सकते हैं?' : 'Can our families connect for Kundali and discussion?',
    language === 'hi' ? 'आपकी वर्तमान कार्यशैली और प्राथमिकताओं के बारे में जानना चाहते हैं।' : 'Would love to know more about your career goals and preferences.',
    language === 'hi' ? 'आइए इस सप्ताहांत एक संक्षिप्त वीडियो कॉल आयोजित करें 📹' : 'Let us plan a short video call this weekend 📹',
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleSendIcebreaker = (text: string) => {
    onSendMessage(text);
  };

  return (
    <div id="matrimonial-chat-view" className="max-w-6xl mx-auto bg-white rounded-[32px] border border-[#E8E4DE] shadow-sm overflow-hidden flex flex-col md:flex-row h-[750px]">
      {/* Left Sidebar - Matched Contacts List in Natural Tones */}
      <div className="w-full md:w-80 border-r border-[#E8E4DE] flex flex-col shrink-0 bg-[#FAF9F6]/60">
        <div className="p-5 border-b border-[#E8E4DE] bg-white">
          <h2 className="font-serif font-bold text-base text-[#5A5A40] flex items-center justify-between">
            <span>{language === 'hi' ? 'स्वीकृत रिश्तेदार एवं मैच' : 'Connected Matches'}</span>
            <span className="text-xs bg-[#F5F5F0] text-[#5A5A40] border border-[#E8E4DE] font-bold px-2 py-0.5 rounded-full">
              {allMatchedProfiles.length}
            </span>
          </h2>
          <p className="text-[11px] text-[#8C8479] mt-0.5">
            {language === 'hi' ? 'आप केवल परस्पर स्वीकृत संपर्कों से चैट कर सकते हैं।' : 'Chat unlocked for mutual accepted interests.'}
          </p>
        </div>

        <div className="overflow-y-auto flex-1 divide-y divide-[#F5F5F0]">
          {allMatchedProfiles.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#8C8479]">
              {language === 'hi' ? 'कोई सक्रिय चैट नहीं मिली' : 'No active chats found'}
            </div>
          ) : (
            allMatchedProfiles.map((p) => {
              const isSelected = p.id === activePartner.id;
              return (
                <div
                  key={p.id}
                  onClick={() => onSelectPartner(p)}
                  className={`p-4 flex items-center gap-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-white border-l-4 border-[#D4A373] shadow-2xs' : 'hover:bg-white/80'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={p.photos[0]}
                      alt={p.fullName}
                      className="w-12 h-12 rounded-full object-cover border border-[#E8E4DE]"
                    />
                    {p.isVerified && (
                      <div className="absolute -bottom-0.5 -right-0.5 bg-[#5A5A40] text-white rounded-full p-0.5">
                        <ShieldCheck className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-serif font-bold text-[#5A5A40] truncate">{p.fullName}</h3>
                      <span className="text-[10px] text-[#5A5A40] font-semibold">
                        {p.lastActive.includes('अभी') ? 'Online' : 'Active'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8C8479] truncate">{p.occupation} • {p.city}</p>
                    <p className="text-[10px] text-[#D4A373] font-medium truncate mt-0.5">
                      {p.kundali.rashi.split(' ')[0]} • {p.religion}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Chat Pane in Natural Tones */}
      <div className="flex-1 flex flex-col bg-[#FAF9F6] min-w-0">
        {/* Chat Header */}
        <div className="p-4 bg-white border-b border-[#E8E4DE] flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            {onBackToList && (
              <button onClick={onBackToList} className="md:hidden p-1 text-[#8C8479]">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <img
              src={activePartner.photos[0]}
              alt={activePartner.fullName}
              className="w-10 h-10 rounded-full object-cover border border-[#E8E4DE]"
            />
            <div>
              <h2 className="text-sm font-serif font-bold text-[#5A5A40] flex items-center gap-1.5">
                <span>{activePartner.fullName}</span>
                {activePartner.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-[#5A5A40]" />}
              </h2>
              <p className="text-[11px] text-[#8C8479]">
                {activePartner.occupation} ({activePartner.city}) • {activePartner.lastActive}
              </p>
            </div>
          </div>

          {/* Action CTAs: Call / Video / Family Connect */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCalling('audio')}
              className="p-2 text-[#8C8479] hover:text-[#5A5A40] hover:bg-[#FAF9F6] rounded-full transition-colors border border-[#E8E4DE]"
              title={language === 'hi' ? 'ऑडियो कॉल' : 'Audio Call'}
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsCalling('video')}
              className="p-2 text-[#8C8479] hover:text-[#5A5A40] hover:bg-[#FAF9F6] rounded-full transition-colors border border-[#E8E4DE]"
              title={language === 'hi' ? 'वीडियो कॉल' : 'Video Call'}
            >
              <Video className="w-4 h-4" />
            </button>
            {onOpenMarriageWorkflow && (
              <button
                onClick={() => onOpenMarriageWorkflow(activePartner)}
                className="px-3.5 py-2 bg-[#5A5A40] hover:bg-[#4a4a35] text-white rounded-full text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
                title={language === 'hi' ? 'शादी/निकाह का पूरा फ्लो देखें' : 'Marriage Workflow Tracker'}
              >
                <span>💍</span>
                <span className="hidden md:inline">
                  {language === 'hi' ? 'विवाह/निकाह फ्लो' : 'Vivah Flow'}
                </span>
              </button>
            )}

            <button
              onClick={() => onOpenFamilyModal(activePartner)}
              className="px-4 py-2 bg-[#D4A373] hover:bg-[#c49262] text-white rounded-full text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {language === 'hi' ? 'परिवार से बात' : 'Family Connect'}
              </span>
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-5 overflow-y-auto space-y-3.5">
          {/* Matrimonial Security Notice in Natural Tones */}
          <div className="mx-auto max-w-md bg-white border border-[#E8E4DE] rounded-2xl p-3 text-center text-[11px] text-[#4A453E] shadow-2xs">
            <span className="font-serif font-bold text-[#5A5A40]">🔒 {language === 'hi' ? 'सत्यापित पारिवारिक चैट' : 'Verified Family Chat'}:</span>{' '}
            {language === 'hi'
              ? 'आप दोनों का बायोडाटा सत्यापित है। सम्मानपूर्वक बातचीत करें।'
              : 'End-to-end moderated chat for matrimonial prospective matches.'}
          </div>

          {messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-2xs text-xs leading-relaxed ${
                    isMe
                      ? 'bg-[#5A5A40] text-white rounded-br-xs'
                      : 'bg-white text-[#4A453E] border border-[#E8E4DE] rounded-bl-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                  <div
                    className={`text-[10px] mt-1 text-right flex items-center justify-end gap-1 ${
                      isMe ? 'text-[#E8E4DE]' : 'text-[#8C8479]'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {isMe && <CheckCheck className="w-3 h-3 text-[#D4A373]" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Icebreakers Carousel */}
        <div className="px-5 py-2.5 bg-white border-t border-[#E8E4DE] flex items-center gap-2 overflow-x-auto">
          <Sparkles className="w-4 h-4 text-[#D4A373] shrink-0" />
          <span className="text-[10px] font-bold text-[#A69F92] uppercase tracking-wider shrink-0">
            {language === 'hi' ? 'सुझाव:' : 'Icebreakers:'}
          </span>
          {quickIcebreakers.map((ib, idx) => (
            <button
              key={idx}
              onClick={() => handleSendIcebreaker(ib)}
              className="text-[11px] bg-[#FAF9F6] hover:bg-[#F5F5F0] text-[#5A5A40] px-3.5 py-1 rounded-full whitespace-nowrap border border-[#E8E4DE] font-medium transition-colors shrink-0 cursor-pointer"
            >
              {ib}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t border-[#E8E4DE] flex items-center gap-2">
          <input
            type="text"
            placeholder={
              language === 'hi'
                ? 'संदेश लिखें (उदा. नमस्ते, क्या हम बात कर सकते हैं?)...'
                : 'Type your message here...'
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-2.5 text-xs bg-[#FAF9F6] border border-[#E8E4DE] rounded-full focus:ring-2 focus:ring-[#D4A373] focus:border-[#D4A373] outline-none text-[#4A453E]"
          />
          <button
            type="submit"
            className="p-3 bg-[#5A5A40] hover:bg-[#4a4a35] text-white rounded-full shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4 text-[#D4A373]" />
          </button>
        </form>
      </div>

      {/* Simulated Video/Audio Call Modal */}
      {isCalling && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#4A453E] text-white rounded-[32px] p-8 max-w-sm w-full text-center space-y-6 border border-[#E8E4DE]/30 shadow-2xl">
            <div className="relative w-28 h-28 mx-auto">
              <img
                src={activePartner.photos[0]}
                alt=""
                className="w-full h-full rounded-full object-cover border-4 border-[#D4A373] animate-pulse"
              />
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold">{activePartner.fullName}</h3>
              <p className="text-xs text-[#E8E4DE] mt-1">
                {isCalling === 'video'
                  ? (language === 'hi' ? 'वैवाहिक वीडियो कॉल रिंगिंग...' : 'Video Call Ringing...')
                  : (language === 'hi' ? 'सुरक्षित ऑडियो कॉल कनेक्ट हो रहा है...' : 'Connecting Secure Audio Call...')}
              </p>
            </div>
            <div className="p-3 bg-white/10 rounded-2xl text-xs text-[#E8E4DE]">
              {language === 'hi' ? 'पारिवारिक परिचर्चा हेतु सुरक्षित मंच।' : 'Family presence is encouraged.'}
            </div>
            <button
              onClick={() => setIsCalling(null)}
              className="w-full py-3 bg-[#5A5A40] hover:bg-[#4a4a35] text-white font-bold rounded-full shadow-lg transition-colors cursor-pointer"
            >
              {language === 'hi' ? 'कॉल समाप्त करें' : 'End Call'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
