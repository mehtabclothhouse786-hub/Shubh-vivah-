import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Phone, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: { mobile: string; name: string; gender: 'male' | 'female' }) => void;
  language: 'hi' | 'en';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  language
}) => {
  const [step, setStep] = useState<'mobile' | 'otp' | 'basic'>('mobile');
  const [mobile, setMobile] = useState('9876543210');
  const [otp, setOtp] = useState(['5', '4', '3', '2']);
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [profileFor, setProfileFor] = useState('self');

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length >= 10) {
      setStep('otp');
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('basic');
  };

  const handleCompleteBasic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    onSuccess({ mobile, name, gender });
  };

  return (
    <div id="auth-flow-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-[32px] shadow-2xl max-w-md w-full overflow-hidden border border-[#E8E4DE]">
        {/* Header in Natural Tones */}
        <div className="bg-[#5A5A40] p-6 text-white text-center relative border-b border-[#4A453E]/40">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 bg-[#D4A373] text-white rounded-full flex items-center justify-center mx-auto mb-2 text-xl font-serif font-bold shadow-xs tracking-tighter">
            SV
          </div>
          <h2 className="text-2xl font-serif font-bold">
            {language === 'hi' ? 'स्मार्ट विवाह पंजीकरण' : 'Smart Vivah Register'}
          </h2>
          <p className="text-xs text-[#E8E4DE] mt-0.5">
            {language === 'hi' ? 'चरण १: मोबाइल नंबर सत्यापन एवं प्रोफाइल निर्माण' : 'Step 1: Mobile OTP Verification'}
          </p>
        </div>

        {/* Modal Form */}
        <div className="p-6 bg-[#FAF9F6]">
          {/* STEP 1: MOBILE ENTRY */}
          {step === 'mobile' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#5A5A40] mb-1">
                  {language === 'hi' ? 'मोबाइल नंबर दर्ज करें' : 'Enter 10-digit Mobile Number'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-[#8C8479] font-bold">+91</span>
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="98765 43210"
                    className="w-full pl-12 pr-4 py-2.5 text-sm bg-white border border-[#E8E4DE] rounded-xl focus:ring-2 focus:ring-[#D4A373] focus:border-[#D4A373] outline-none text-[#4A453E]"
                  />
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-[#E8E4DE] text-[11px] text-[#4A453E] space-y-1">
                <span className="font-bold text-[#5A5A40] block">🔒 {language === 'hi' ? 'सुरक्षा एवं गोपनीयता:' : 'Privacy Protection:'}</span>
                <p className="text-[#8C8479]">
                  {language === 'hi'
                    ? 'आपका नंबर केवल आपके द्वारा स्वीकृत होने पर ही मैच के साथ साझा किया जाएगा।'
                    : 'Your number is strictly confidential and never displayed without your permission.'}
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#5A5A40] hover:bg-[#4a4a35] text-white font-bold rounded-full text-xs shadow-xs transition-colors cursor-pointer"
              >
                {language === 'hi' ? 'OTP प्राप्त करें' : 'Send OTP'}
              </button>
            </form>
          )}

          {/* STEP 2: OTP VERIFICATION */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center space-y-1">
                <span className="text-xs text-[#8C8479]">
                  {language === 'hi' ? '+91' : '+91'} {mobile} {language === 'hi' ? 'पर भेजा गया OTP दर्ज करें' : 'OTP Sent'}
                </span>
                <div className="flex justify-center gap-2 pt-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => {
                        const newOtp = [...otp];
                        newOtp[idx] = e.target.value;
                        setOtp(newOtp);
                      }}
                      className="w-12 h-12 text-center text-lg font-bold bg-white border border-[#E8E4DE] rounded-xl focus:ring-2 focus:ring-[#D4A373] focus:border-[#D4A373] outline-none text-[#5A5A40]"
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#5A5A40] hover:bg-[#4a4a35] text-white font-bold rounded-full text-xs shadow-xs transition-colors cursor-pointer"
              >
                {language === 'hi' ? 'OTP सत्यापित करें' : 'Verify & Continue'}
              </button>
            </form>
          )}

          {/* STEP 3: INITIAL BASIC DETAILS */}
          {step === 'basic' && (
            <form onSubmit={handleCompleteBasic} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#5A5A40] mb-1">
                  {language === 'hi' ? 'यह प्रोफ़ाइल किसके लिए बना रहे हैं?' : 'Profile is for:'}
                </label>
                <select
                  value={profileFor}
                  onChange={(e) => setProfileFor(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E8E4DE] rounded-xl text-[#4A453E] outline-none"
                >
                  <option value="self">{language === 'hi' ? 'स्वयं (Self)' : 'Self'}</option>
                  <option value="son">{language === 'hi' ? 'पुत्र (Son)' : 'Son'}</option>
                  <option value="daughter">{language === 'hi' ? 'पुत्री (Daughter)' : 'Daughter'}</option>
                  <option value="brother">{language === 'hi' ? 'भाई (Brother)' : 'Brother'}</option>
                  <option value="sister">{language === 'hi' ? 'बहन (Sister)' : 'Sister'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5A5A40] mb-1">
                  {language === 'hi' ? 'प्रत्याशी का पूरा नाम' : 'Candidate Full Name'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={language === 'hi' ? 'उदा. अमित कुमार' : 'e.g. Amit Kumar'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E8E4DE] rounded-xl text-[#4A453E] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5A5A40] mb-1">
                  {language === 'hi' ? 'लिंग (Gender)' : 'Gender'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      gender === 'male'
                        ? 'bg-[#5A5A40] text-white border-[#5A5A40]'
                        : 'bg-white text-[#4A453E] border-[#E8E4DE]'
                    }`}
                  >
                    🤵 {language === 'hi' ? 'वर (Male / Groom)' : 'Groom (Male)'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      gender === 'female'
                        ? 'bg-[#5A5A40] text-white border-[#5A5A40]'
                        : 'bg-white text-[#4A453E] border-[#E8E4DE]'
                    }`}
                  >
                    👰 {language === 'hi' ? 'वधू (Female / Bride)' : 'Bride (Female)'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#D4A373] hover:bg-[#c49262] text-white font-bold rounded-full text-xs shadow-md shadow-[#D4A373]/20 transition-colors cursor-pointer"
              >
                {language === 'hi' ? 'प्रोफ़ाइल निर्माण शुरू करें' : 'Proceed to Full Profile'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
