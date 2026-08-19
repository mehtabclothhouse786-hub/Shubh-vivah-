import React, { useState } from 'react';
import { X, Printer, Download, Copy, Check, Sparkles, FileText } from 'lucide-react';
import { UserProfile } from '../types';
import { generateMarriageBiodataHTML } from '../utils/biodataGenerator';

interface BiodataPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  language: 'hi' | 'en';
  onShowToast?: (msg: string) => void;
}

export const BiodataPreviewModal: React.FC<BiodataPreviewModalProps> = ({
  isOpen,
  onClose,
  profile,
  language,
  onShowToast
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const htmlContent = generateMarriageBiodataHTML(profile);

  const handleCopyText = () => {
    const textSummary = `
॥ श्री गणेशाय नमः ॥
*वैवाहिक बायोडाटा (Marriage Biodata)*
------------------------------------
• नाम: ${profile.fullName}
• आयु: ${profile.age} वर्ष (जन्म: ${profile.dob})
• कद: ${profile.heightFeet}'${profile.heightInches}"
• धर्म एवं जाति: ${profile.religion} - ${profile.caste} ${profile.subCaste ? `(${profile.subCaste})` : ''}
• स्थान: ${profile.city}, ${profile.state}

*शिक्षा एवं कार्य:*
• शिक्षा: ${profile.highestEducation} (${profile.collegeUniversity})
• पेशा: ${profile.occupation} - ${profile.companyName}
• वार्षिक आय: ₹${profile.annualIncomeLakhs} लाख/वर्ष ${profile.isGovtJob ? '(सरकारी सेवा)' : ''}

*कुंडली विवरण:*
• राशि: ${profile.kundali.rashi}
• नक्षत्र: ${profile.kundali.nakshatra}
• मांगलिक: ${profile.kundali.manglik}
• गोत्र: ${profile.kundali.gotra || 'कश्यप'}
• जन्म समय: ${profile.kundali.birthTime || 'उपलब्ध नहीं'} (${profile.kundali.birthPlace || profile.city})

*पारिवारिक पृष्ठभूमि:*
• पिता: ${profile.family.fatherOccupation}
• माता: ${profile.family.motherOccupation}
• परिवार: ${profile.family.familyType} (${profile.family.familyValues})
• संपर्क: ${profile.mobile} / ${profile.email}
------------------------------------
मिलन विवाह (Milan Matrimony) द्वारा सत्यापित
    `.trim();

    navigator.clipboard.writeText(textSummary);
    setCopied(true);
    if (onShowToast) {
      onShowToast(language === 'hi' ? 'बायोडाटा टेक्स्ट कॉपी हो गया!' : 'Biodata text copied to clipboard!');
    }
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadHTML = () => {
    const fullHtml = `<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <title>${profile.fullName} - Marriage Biodata</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    @media print {
      body { background: white !important; padding: 0 !important; }
      #marriage-biodata-document { border: 1.5px solid #5A5A40 !important; box-shadow: none !important; margin: 0 auto !important; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 24px; background: #FAF9F6; display: flex; justify-content: center; font-family: 'Plus Jakarta Sans', sans-serif;">
  ${htmlContent}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${profile.fullName.replace(/\s+/g, '_')}_Marriage_Biodata.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (onShowToast) {
      onShowToast(language === 'hi' ? 'बायोडाटा HTML फ़ाइल डाउनलोड हो गई!' : 'Biodata file downloaded!');
    }
  };

  const handlePrint = () => {
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
            <title>${profile.fullName} - Biodata</title>
            <meta charset="utf-8" />
            <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,700;1,400&display=swap" rel="stylesheet">
            <style>
              @page { size: A4; margin: 15mm; }
              body { margin: 0; padding: 10px; background: white; font-family: 'Cormorant Garamond', serif; }
            </style>
          </head>
          <body>
            ${htmlContent}
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
    <div id="biodata-preview-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-[32px] shadow-2xl max-w-3xl w-full overflow-hidden border border-[#E8E4DE] my-8 flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-[#5A5A40] px-6 py-4 text-white flex items-center justify-between border-b border-[#4A453E]/40">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#D4A373]" />
            <h2 className="text-lg font-serif font-bold">
              {language === 'hi' ? 'वैवाहिक बायोडाटा पूर्वावलोकन (Marriage Biodata)' : 'Marriage Biodata Preview'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-bold transition-colors flex items-center gap-1 border border-white/20"
              title="Copy text summary"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-300" /> : <Copy className="w-3.5 h-3.5 text-[#D4A373]" />}
              <span>{copied ? (language === 'hi' ? 'कॉपी हो गया' : 'Copied') : (language === 'hi' ? 'टेक्स्ट कॉपी' : 'Copy Text')}</span>
            </button>

            <button
              onClick={handleDownloadHTML}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-bold transition-colors flex items-center gap-1 border border-white/20"
              title="Download HTML"
            >
              <Download className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>{language === 'hi' ? 'डाउनलोड' : 'Download'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-[#D4A373] hover:bg-[#c49262] text-white rounded-full text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'प्रिंट / PDF' : 'Print / PDF'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Biodata Body Preview */}
        <div className="flex-1 p-6 overflow-y-auto bg-[#FAF9F6] flex justify-center">
          <div
            className="w-full max-w-[700px] shadow-sm rounded-2xl overflow-hidden bg-white"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>
      </div>
    </div>
  );
};
