import React, { useState } from 'react';
import { X, HeartHandshake, Phone, Calendar, Printer, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile } from '../types';
import { generateMarriageBiodataHTML } from '../utils/biodataGenerator';

interface FamilyConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  partner: UserProfile;
  onFixRishta: (partnerName: string) => void;
  language: 'hi' | 'en';
}

export const FamilyConnectModal: React.FC<FamilyConnectModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  partner,
  onFixRishta,
  language
}) => {
  const [meetingDate, setMeetingDate] = useState('2026-08-25');
  const [meetingLocation, setMeetingLocation] = useState('पारिवारिक मिलन / होम विजिट (Family Home Visit)');
  const [isScheduled, setIsScheduled] = useState(false);

  if (!isOpen) return null;

  const handleFixRishtaClick = () => {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 }
    });
    onFixRishta(partner.fullName);
    onClose();
  };

  const handlePrintBiodata = () => {
    const html = generateMarriageBiodataHTML(partner);
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
            <title>${partner.fullName} - Marriage Biodata</title>
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
    <div id="family-connect-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-[32px] shadow-2xl max-w-xl w-full overflow-hidden border border-[#E8E4DE]">
        {/* Header in Natural Tones */}
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
            {language === 'hi' ? 'चरण १० एवं ११: परिवार से बात एवं रिश्ता तय' : 'Step 10 & 11: Family Connect & Rishta Fixed'}
          </h2>
          <p className="text-xs text-[#E8E4DE] mt-1">
            {currentUser.fullName} &amp; {partner.fullName}
          </p>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 bg-[#FAF9F6]">
          {/* Family Contact Cards */}
          <div className="bg-white p-5 rounded-[24px] border border-[#E8E4DE] space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider">
                {language === 'hi' ? 'माता-पिता एवं अभिभावक संपर्क सूत्र' : 'Parents Contact Numbers'}
              </span>
              <span className="text-[10px] bg-[#F5F5F0] text-[#5A5A40] border border-[#E8E4DE] font-bold px-2.5 py-0.5 rounded-full">
                ✓ {language === 'hi' ? 'सत्यापित अभिभावक' : 'Verified'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-[#E8E4DE]">
                <span className="text-[11px] text-[#8C8479] block">{partner.fullName} के पिताजी:</span>
                <strong className="text-[#5A5A40] text-sm font-serif">{partner.family.fatherOccupation}</strong>
                <div className="text-[#D4A373] font-mono font-bold mt-1">{partner.mobile}</div>
              </div>

              <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-[#E8E4DE]">
                <span className="text-[11px] text-[#8C8479] block">{partner.fullName} की माताजी:</span>
                <strong className="text-[#5A5A40] text-sm font-serif">{partner.family.motherOccupation}</strong>
                <div className="text-[#8C8479] font-mono text-[11px] mt-1">{partner.email}</div>
              </div>
            </div>
          </div>

          {/* Schedule Family Meeting Section */}
          <div className="bg-white p-5 rounded-[24px] border border-[#E8E4DE] space-y-3 shadow-xs">
            <h3 className="font-bold text-xs text-[#5A5A40] uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#D4A373]" />
              <span>{language === 'hi' ? 'पारिवारिक मिलन / मीटिंग तिथि तय करें' : 'Schedule Family Meeting'}</span>
            </h3>

            {isScheduled ? (
              <div className="p-4 bg-[#F5F5F0] border border-[#E8E4DE] rounded-2xl flex items-center gap-3 text-[#5A5A40] text-xs">
                <CheckCircle2 className="w-6 h-6 text-[#5A5A40] shrink-0" />
                <div>
                  <strong className="block text-sm font-serif font-bold">
                    {language === 'hi' ? 'पारिवारिक मिलन प्रस्तावित हो चुका है!' : 'Family Meeting Proposed!'}
                  </strong>
                  <span>दिनांक: {meetingDate} ({meetingLocation})</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#8C8479] mb-1">
                    {language === 'hi' ? 'प्रस्तावित तिथि' : 'Proposed Date'}
                  </label>
                  <input
                    type="date"
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E8E4DE] rounded-xl bg-[#FAF9F6] text-[#4A453E] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#8C8479] mb-1">
                    {language === 'hi' ? 'स्थान' : 'Venue'}
                  </label>
                  <input
                    type="text"
                    value={meetingLocation}
                    onChange={(e) => setMeetingLocation(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E8E4DE] rounded-xl bg-[#FAF9F6] text-[#4A453E] outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    onClick={() => setIsScheduled(true)}
                    className="w-full py-2.5 bg-[#FAF9F6] hover:bg-[#F5F5F0] text-[#5A5A40] font-bold rounded-xl text-xs border border-[#E8E4DE] transition-colors"
                  >
                    {language === 'hi' ? 'पारिवारिक मिलन का निमंत्रण भेजें' : 'Send Family Meeting Invite'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Biodata Share / Print */}
          <div className="flex items-center justify-between p-4 bg-white rounded-[24px] border border-[#E8E4DE] shadow-xs">
            <div className="text-xs text-[#4A453E]">
              <span className="font-serif font-bold text-[#5A5A40] block">{language === 'hi' ? 'पारिवारिक कुंडली एवं बायोडाटा:' : 'Family Kundali Biodata:'}</span>
              <span className="text-[11px] text-[#8C8479]">
                {language === 'hi' ? 'माता-पिता से साझा करने हेतु विधिवत प्रारूप' : 'Formal format for elders'}
              </span>
            </div>
            <button
              onClick={handlePrintBiodata}
              className="px-4 py-2 bg-[#FAF9F6] hover:bg-[#F5F5F0] text-[#5A5A40] border border-[#E8E4DE] rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>{language === 'hi' ? 'बायोडाटा प्रिंट' : 'Print PDF'}</span>
            </button>
          </div>

          {/* Final Milestone: रिश्ता तय (Rishta Fixed) */}
          <div className="pt-2">
            <button
              onClick={handleFixRishtaClick}
              className="w-full py-4 bg-[#5A5A40] hover:bg-[#4a4a35] text-white font-bold text-sm rounded-full shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-[#D4A373] fill-[#D4A373]" />
              <span className="font-serif tracking-wide">{language === 'hi' ? '🎉 रिश्ता तय हुआ! (Mark Rishta Fixed)' : '🎉 Mark Rishta Fixed!'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
