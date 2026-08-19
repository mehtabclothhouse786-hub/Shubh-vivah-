import React from 'react';
import { X, Sparkles, Heart, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';
import { calculateKundaliMilan } from '../utils/kundali';

interface KundaliMilanModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  targetProfile: UserProfile;
  language: 'hi' | 'en';
  onSendInterest: (targetId: string) => void;
  isInterestSent: boolean;
}

export const KundaliMilanModal: React.FC<KundaliMilanModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  targetProfile,
  language,
  onSendInterest,
  isInterestSent
}) => {
  if (!isOpen) return null;

  const kundali = calculateKundaliMilan(currentUser, targetProfile);

  return (
    <div id="kundali-milan-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in zoom-in-95 duration-200">
      <div className="bg-white rounded-[32px] shadow-2xl max-w-2xl w-full overflow-hidden border border-[#E8E4DE] my-8 flex flex-col">
        {/* Header in Natural Tones Olive & Sand */}
        <div className="bg-[#5A5A40] p-6 text-white text-center relative border-b border-[#4A453E]/40">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-12 h-12 bg-[#D4A373] text-white rounded-full flex items-center justify-center mx-auto mb-2 text-2xl font-serif italic shadow-xs">
            M
          </div>
          <h2 className="text-2xl font-serif font-bold">
            {language === 'hi' ? 'वैदिक अष्टकूट ३६ गुण मिलान' : 'Vedic Ashta Koota Kundali Milan'}
          </h2>
          <p className="text-xs text-[#E8E4DE] mt-1">
            {currentUser.fullName} &amp; {targetProfile.fullName}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-5 bg-[#FAF9F6]">
          {/* Score Badge Card */}
          <div className="bg-white p-6 rounded-[28px] border border-[#E8E4DE] text-center space-y-2 shadow-xs">
            <span className="text-xs uppercase font-bold text-[#A69F92] tracking-wider">
              {language === 'hi' ? 'कुल गुण अनुकूलता' : 'Total Compatibility'}
            </span>
            <div className="text-4xl font-serif font-black text-[#5A5A40]">
              {kundali.totalPoints} <span className="text-xl font-normal text-[#8C8479]">/ ३६</span>
            </div>
            <div className="inline-block px-4 py-1 rounded-full text-xs font-bold bg-[#F5F5F0] text-[#5A5A40] border border-[#E8E4DE]">
              {kundali.compatibilityLevel}
            </div>
            <p className="text-xs text-[#4A453E] max-w-md mx-auto mt-2 leading-relaxed italic">
              &quot;{kundali.summary}&quot;
            </p>
          </div>

          {/* Planetary & Rashi Comparative Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-4 bg-white rounded-2xl border border-[#E8E4DE]">
              <span className="text-[#8C8479] text-[11px] block">{currentUser.fullName} ({currentUser.gender === 'male' ? 'वर' : 'वधू'})</span>
              <strong className="text-[#5A5A40] text-sm font-serif">{currentUser.kundali.rashi}</strong>
              <div className="text-[#8C8479] mt-0.5">नक्षत्र: {currentUser.kundali.nakshatra}</div>
              <div className="text-[#D4A373] font-semibold mt-0.5">मांगलिक: {currentUser.kundali.manglik}</div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#E8E4DE]">
              <span className="text-[#8C8479] text-[11px] block">{targetProfile.fullName} ({targetProfile.gender === 'male' ? 'वर' : 'वधू'})</span>
              <strong className="text-[#5A5A40] text-sm font-serif">{targetProfile.kundali.rashi}</strong>
              <div className="text-[#8C8479] mt-0.5">नक्षत्र: {targetProfile.kundali.nakshatra}</div>
              <div className="text-[#D4A373] font-semibold mt-0.5">मांगलिक: {targetProfile.kundali.manglik}</div>
            </div>
          </div>

          {/* 8 Kootas Table */}
          <div className="bg-white rounded-[24px] border border-[#E8E4DE] overflow-hidden shadow-xs">
            <table className="min-w-full divide-y divide-[#E8E4DE] text-xs">
              <thead className="bg-[#FAF9F6] text-[#5A5A40] font-serif font-bold">
                <tr>
                  <th className="px-4 py-3 text-left">कूट (Koota)</th>
                  <th className="px-4 py-3 text-center">प्राप्त / अधिकतम</th>
                  <th className="px-4 py-3 text-left">विवरण</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F5F0] bg-white text-[#4A453E]">
                {kundali.kootas.map((k, idx) => (
                  <tr key={idx} className="hover:bg-[#FAF9F6]">
                    <td className="px-4 py-2.5 font-semibold text-[#5A5A40]">{k.nameHindi}</td>
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

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#E8E4DE] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#FAF9F6] hover:bg-[#F5F5F0] text-[#5A5A40] border border-[#E8E4DE] rounded-full text-xs font-semibold"
          >
            {language === 'hi' ? 'बंद करें' : 'Close'}
          </button>
          {!isInterestSent && (
            <button
              onClick={() => {
                onSendInterest(targetProfile.id);
                onClose();
              }}
              className="px-6 py-2.5 bg-[#D4A373] hover:bg-[#c49262] text-white rounded-full text-xs font-bold shadow-md shadow-[#D4A373]/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>{language === 'hi' ? 'शुभ रिश्ता - इंटरेस्ट भेजें' : 'Send Interest'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
