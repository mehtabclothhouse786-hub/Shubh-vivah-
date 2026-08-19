import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  X,
  MessageSquare,
  Heart,
  ShieldCheck,
  CheckCircle2,
  Smile,
  Users,
  ChevronRight,
  Sparkle
} from 'lucide-react';
import { UserProfile } from '../types';

export interface GreetingTemplate {
  id: string;
  category: 'traditional' | 'friendly' | 'family' | 'kundali';
  titleHindi: string;
  titleEn: string;
  icon: string;
  getMessage: (currentUser: UserProfile, partner: UserProfile, language: 'hi' | 'en') => string;
}

export const GREETING_TEMPLATES: GreetingTemplate[] = [
  {
    id: 'traditional_namaste',
    category: 'traditional',
    titleHindi: 'पारंपरिक व आदरपूर्ण (Traditional Respectful)',
    titleEn: 'Traditional & Respectful',
    icon: '🙏',
    getMessage: (currentUser, partner, language) => {
      const partnerFirst = partner.fullName.split(' ')[0];
      const isMuslim = partner.religion === 'Muslim' || currentUser.religion === 'Muslim';
      if (isMuslim) {
        return language === 'hi'
          ? `अस्सलाम वालेकुम ${partnerFirst} जी! आपका वैवाहिक निमंत्रण स्वीकार करके दिली खुशी हुई। क्या हम दोनों परिवार सहित बातचीत आगे बढ़ा सकते हैं? 🤲`
          : `As-salamu alaykum ${partnerFirst}! Glad to connect on Smart Vivah. Would love to initiate conversation with family blessings 🤲`;
      }
      return language === 'hi'
        ? `नमस्ते ${partnerFirst} जी! आपका रिश्ता स्वीकार करके बहुत प्रसन्नता हुई। क्या हम दोनों परिवारों की सहमति से आगे बातचीत शुरू कर सकते हैं? 🙏`
        : `Namaste ${partnerFirst} ji! Happy to accept your interest. Would be wonderful to start conversing and connect our families 🙏`;
    }
  },
  {
    id: 'profile_friendly',
    category: 'friendly',
    titleHindi: 'प्रोफ़ाइल व करियर प्रशंसा (Profile Appreciation)',
    titleEn: 'Profile Appreciation',
    icon: '🌸',
    getMessage: (_currentUser, partner, language) => {
      const partnerFirst = partner.fullName.split(' ')[0];
      return language === 'hi'
        ? `नमस्ते ${partnerFirst} जी! आपकी प्रोफ़ाइल, शिक्षा (${partner.highestEducation.split(',')[0]}) एवं विचार बहुत सकारात्मक लगे। आपके बारे में और जानने की उत्सुकता है 😊`
        : `Hello ${partnerFirst}! Really impressed by your education and background. Looking forward to getting to know you better 😊`;
    }
  },
  {
    id: 'family_connect_invite',
    category: 'family',
    titleHindi: 'पारिवारिक परिचर्चा आमंत्रण (Family Connect)',
    titleEn: 'Family Discussion Invite',
    icon: '👨‍👩‍👧‍👦',
    getMessage: (currentUser, partner, language) => {
      const partnerFirst = partner.fullName.split(' ')[0];
      return language === 'hi'
        ? `सादर नमस्ते ${partnerFirst} जी! मेरे परिवार ने आपकी प्रोफ़ाइल देखी और उन्हें बहुत पसंद आई। क्या इस सप्ताहांत दोनों परिवारों की परिचर्चा आयोजित कर सकते हैं? 🤝`
        : `Greetings ${partnerFirst}! My family reviewed your profile and liked it very much. Could we coordinate a brief family call this weekend? 🤝`;
    }
  },
  {
    id: 'kundali_harmony',
    category: 'kundali',
    titleHindi: 'गुण मिलान व विचार (Harmony & Goals)',
    titleEn: 'Astrology & Harmony',
    icon: '✨',
    getMessage: (_currentUser, partner, language) => {
      const partnerFirst = partner.fullName.split(' ')[0];
      return language === 'hi'
        ? `नमस्ते ${partnerFirst} जी! हमारे गुण एवं जीवन मूल्य बहुत अच्छे से मेल खा रहे हैं। वैवाहिक प्राथमिकताओं पर बातचीत आगे बढ़ाते हैं ✨`
        : `Hello ${partnerFirst}! Our astrological and lifestyle values look very well aligned. Let's take this forward ✨`;
    }
  }
];

interface GreetingNotificationHelperProps {
  partner: UserProfile | null;
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSendGreeting: (partner: UserProfile, greetingText: string) => void;
  onOpenChatDirectly: (partner: UserProfile) => void;
  language: 'hi' | 'en';
}

export const GreetingNotificationHelper: React.FC<GreetingNotificationHelperProps> = ({
  partner,
  currentUser,
  isOpen,
  onClose,
  onSendGreeting,
  onOpenChatDirectly,
  language
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('traditional_namaste');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  if (!isOpen || !partner) return null;

  const currentTemplate =
    GREETING_TEMPLATES.find((t) => t.id === selectedTemplateId) || GREETING_TEMPLATES[0];

  const defaultGreetingText = currentTemplate.getMessage(currentUser, partner, language);
  const effectiveText = isEditing ? customMessage : defaultGreetingText;

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const tmpl = GREETING_TEMPLATES.find((t) => t.id === templateId) || GREETING_TEMPLATES[0];
    setCustomMessage(tmpl.getMessage(currentUser, partner, language));
  };

  const handleSend = () => {
    onSendGreeting(partner, effectiveText);
    onClose();
  };

  return (
    <div
      id="automated-greeting-notification-helper"
      className="fixed bottom-5 right-4 sm:right-6 z-60 max-w-lg w-[calc(100vw-2rem)] sm:w-[480px] bg-white rounded-[28px] border-2 border-[#D4A373] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300"
    >
      {/* Header with Olive & Gold Branding */}
      <div className="bg-[#5A5A40] text-white px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#D4A373] flex items-center justify-center text-white text-xs font-bold shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-bold text-sm">
                {language === 'hi' ? '🎉 रिश्ता स्वीकृत! पहला अभिवादन भेजें' : '🎉 Match Accepted! Send First Greeting'}
              </span>
            </div>
            <span className="text-[10px] text-[#E8E4DE] block opacity-90">
              {language === 'hi' ? 'शुभ शुरुआत के लिए तैयार संदेश (Automated Greeting Helper)' : 'Start positively with a ready-made greeting'}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 text-[#E8E4DE] hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          title={language === 'hi' ? 'बंद करें' : 'Close'}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-3.5 bg-[#FAF9F6]">
        {/* Partner Compact Card */}
        <div className="bg-white rounded-2xl p-3 border border-[#E8E4DE] flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={partner.photos[0]}
                alt={partner.fullName}
                className="w-11 h-11 rounded-full object-cover border border-[#E8E4DE]"
              />
              {partner.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-[#5A5A40] text-white rounded-full p-0.5 shadow-2xs">
                  <ShieldCheck className="w-2.5 h-2.5" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-serif font-bold text-xs text-[#5A5A40]">{partner.fullName}</h4>
                <span className="text-[10px] bg-[#FAF9F6] text-[#D4A373] font-bold border border-[#E8E4DE] px-1.5 py-0.2 rounded-full">
                  {partner.age} {language === 'hi' ? 'वर्ष' : 'yrs'}
                </span>
              </div>
              <p className="text-[10px] text-[#8C8479]">
                {partner.occupation} • {partner.city}
              </p>
            </div>
          </div>

          <span className="text-[10px] font-bold bg-[#F5F5F0] text-[#5A5A40] px-2 py-1 rounded-full border border-[#E8E4DE]">
            {language === 'hi' ? 'चैट सक्रिय' : 'Chat Unlocked'}
          </span>
        </div>

        {/* Suggestion Template Chips */}
        <div>
          <label className="text-[10px] font-bold text-[#8C8479] uppercase tracking-wider block mb-1.5">
            {language === 'hi' ? 'उपयुक्त अभिवादन चुनें (Select Greeting Style):' : 'Select Greeting Style:'}
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {GREETING_TEMPLATES.map((tmpl) => {
              const isSelected = selectedTemplateId === tmpl.id;
              return (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => handleSelectTemplate(tmpl.id)}
                  className={`text-left p-2 rounded-xl text-[11px] font-medium transition-all flex items-center gap-1.5 cursor-pointer border ${
                    isSelected
                      ? 'bg-white border-[#D4A373] text-[#5A5A40] shadow-xs font-bold ring-1 ring-[#D4A373]/50'
                      : 'bg-white/80 border-[#E8E4DE] text-[#8C8479] hover:bg-white'
                  }`}
                >
                  <span className="text-sm">{tmpl.icon}</span>
                  <span className="truncate">
                    {language === 'hi' ? tmpl.titleHindi.split(' (')[0] : tmpl.titleEn}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Greeting Preview / Editable Box */}
        <div className="bg-white rounded-2xl p-3 border border-[#E8E4DE] space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#5A5A40] flex items-center gap-1">
              <MessageSquare className="w-3 h-3 text-[#D4A373]" />
              <span>{language === 'hi' ? 'संदेश पूर्वावलोकन (Message Preview)' : 'Message Preview'}</span>
            </span>
            <button
              onClick={() => {
                if (!isEditing) {
                  setCustomMessage(defaultGreetingText);
                }
                setIsEditing(!isEditing);
              }}
              className="text-[10px] text-[#D4A373] font-bold hover:underline cursor-pointer"
            >
              {isEditing
                ? (language === 'hi' ? 'डिफ़ॉल्ट पर रीसेट' : 'Reset to Default')
                : (language === 'hi' ? 'संपादित करें (Edit)' : 'Edit Text')}
            </button>
          </div>

          {isEditing ? (
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={3}
              className="w-full text-xs p-2 bg-[#FAF9F6] border border-[#E8E4DE] rounded-xl text-[#4A453E] focus:ring-2 focus:ring-[#D4A373] focus:border-[#D4A373] outline-none resize-none leading-relaxed"
            />
          ) : (
            <p className="text-xs text-[#4A453E] bg-[#FAF9F6] p-2.5 rounded-xl border border-[#E8E4DE]/60 leading-relaxed font-sans">
              "{defaultGreetingText}"
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleSend}
            className="flex-1 py-2.5 bg-[#5A5A40] hover:bg-[#4a4a35] text-white rounded-full text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 group"
          >
            <Send className="w-3.5 h-3.5 text-[#D4A373] group-hover:translate-x-0.5 transition-transform" />
            <span>{language === 'hi' ? 'तुरंत भेजें व चैट खोलें (Send & Open)' : 'Send Greeting & Open Chat'}</span>
          </button>

          <button
            onClick={() => {
              onOpenChatDirectly(partner);
              onClose();
            }}
            className="px-3.5 py-2.5 bg-white hover:bg-[#FAF9F6] text-[#5A5A40] border border-[#E8E4DE] rounded-full text-xs font-bold transition-all cursor-pointer"
            title={language === 'hi' ? 'बिना संदेश चैट खोलें' : 'Open chat without sending'}
          >
            {language === 'hi' ? 'कस्टम चैट' : 'Chat'}
          </button>

          <button
            onClick={onClose}
            className="px-3 py-2.5 text-[#8C8479] hover:text-[#5A5A40] text-xs font-semibold rounded-full hover:bg-black/5 cursor-pointer"
          >
            {language === 'hi' ? 'बाद में' : 'Later'}
          </button>
        </div>
      </div>
    </div>
  );
};
