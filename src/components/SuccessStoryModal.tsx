import React from 'react';
import { X, Sparkles, Heart, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile } from '../types';

interface SuccessStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  partnerName: string;
  language: 'hi' | 'en';
}

export const SuccessStoryModal: React.FC<SuccessStoryModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  partnerName,
  language
}) => {
  if (!isOpen) return null;

  return (
    <div id="success-story-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto animate-in zoom-in-95 duration-200">
      <div className="bg-white rounded-[32px] shadow-2xl max-w-md w-full overflow-hidden border border-[#E8E4DE] text-center p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8C8479] hover:text-[#4A453E] p-1 rounded-full hover:bg-[#FAF9F6]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Monogram Icon */}
        <div className="w-20 h-20 bg-[#D4A373] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-4xl font-serif italic shadow-lg">
          M
        </div>

        <span className="bg-[#5A5A40] text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full inline-block mb-3">
          {language === 'hi' ? 'चरण ११: पवित्र बंधन' : 'Step 11: Bandhan Fixed'}
        </span>

        <h2 className="text-3xl font-serif font-bold text-[#5A5A40] mb-2">
          {language === 'hi' ? '🎉 रिश्ता तय हुआ! हार्दिक बधाई!' : '🎉 Rishta Fixed! Congratulations!'}
        </h2>

        <p className="text-sm font-serif italic text-[#D4A373] font-bold">
          {currentUser.fullName} &amp; {partnerName}
        </p>

        <p className="text-xs text-[#4A453E] mt-3 leading-relaxed max-w-xs mx-auto">
          {language === 'hi'
            ? 'मिलन वैवाहिक मंच आपके उज्ज्वल भविष्य, सुखद वैवाहिक जीवन एवं अनंत खुशियों की कामना करता है।'
            : 'Milan Matrimony wishes both families a prosperous and blessed matrimonial journey ahead.'}
        </p>

        <div className="mt-6 pt-4 border-t border-[#E8E4DE] flex flex-col gap-2">
          <button
            onClick={() => {
              confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
            }}
            className="w-full py-3 bg-[#5A5A40] hover:bg-[#4a4a35] text-white rounded-full font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            {language === 'hi' ? 'पुनः उत्सव मनाएं 🎊' : 'Celebrate Again 🎊'}
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#FAF9F6] hover:bg-[#F5F5F0] text-[#5A5A40] border border-[#E8E4DE] rounded-full font-semibold text-xs cursor-pointer"
          >
            {language === 'hi' ? 'मुख्य पृष्ठ पर लौटें' : 'Back to Home'}
          </button>
        </div>
      </div>
    </div>
  );
};
