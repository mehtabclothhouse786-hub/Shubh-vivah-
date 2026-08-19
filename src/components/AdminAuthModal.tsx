import React, { useState } from 'react';
import { Lock, Eye, EyeOff, X, ShieldCheck, AlertCircle } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  language: 'hi' | 'en';
}

export const ADMIN_MASTER_PASSWORD = 'K@7m#2';

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  language
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    setTimeout(() => {
      if (password === ADMIN_MASTER_PASSWORD) {
        setIsSubmitting(false);
        setPassword('');
        setError('');
        onSuccess();
      } else {
        setIsSubmitting(false);
        setError(
          language === 'hi'
            ? 'अमान्य एडमिन सुरक्षा कोड! कृपया सही पासवर्ड दर्ज करें।'
            : 'Invalid Admin Security Passcode! Please enter the authorized password.'
        );
      }
    }, 400);
  };

  return (
    <div
      id="admin-auth-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-in fade-in"
    >
      <div className="bg-white rounded-[32px] shadow-2xl max-w-md w-full overflow-hidden border border-[#E8E4DE]">
        {/* Header in Deep Olive */}
        <div className="bg-[#5A5A40] p-6 text-white text-center relative border-b border-[#4A453E]/40">
          <button
            onClick={() => {
              setPassword('');
              setError('');
              onClose();
            }}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-12 h-12 bg-[#D4A373] text-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-xs">
            <Lock className="w-6 h-6" />
          </div>
          
          <h2 className="text-xl font-serif font-bold">
            {language === 'hi' ? 'प्रशासनिक सुरक्षा सत्यापन' : 'Admin Security Verification'}
          </h2>
          <p className="text-xs text-[#E8E4DE] mt-1">
            {language === 'hi'
              ? 'गोपनीय एडमिन पोर्टल तक पहुँचने हेतु पासवर्ड दर्ज करें'
              : 'Enter master secret passcode to access Admin Control'}
          </p>
        </div>

        {/* Modal Form */}
        <div className="p-6 bg-[#FAF9F6]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#5A5A40] mb-1">
                {language === 'hi' ? 'एडमिन पासवर्ड (Admin Passcode)' : 'Admin Master Password'}
              </label>
              
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-4 pr-11 py-3 text-sm bg-white border ${
                    error ? 'border-red-400 focus:ring-red-300' : 'border-[#E8E4DE] focus:ring-[#D4A373]'
                  } rounded-xl focus:ring-2 focus:border-[#D4A373] outline-none text-[#4A453E] tracking-wider font-mono`}
                />
                
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#8C8479] hover:text-[#5A5A40] p-0.5"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="bg-white p-3.5 rounded-2xl border border-[#E8E4DE] text-[11px] text-[#8C8479] space-y-1">
              <span className="font-bold text-[#5A5A40] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#5A5A40]" />
                {language === 'hi' ? 'सुरक्षित प्रमाणीकरण' : 'Confidential Access'}
              </span>
              <p>
                {language === 'hi'
                  ? 'यह नियंत्रण केवल अधिकृत मंच प्रबंधकों के लिए आरक्षित है।'
                  : 'Authorized administrators only. Session actions are securely recorded.'}
              </p>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setPassword('');
                  setError('');
                  onClose();
                }}
                className="w-1/2 py-2.5 bg-white hover:bg-[#F5F5F0] text-[#5A5A40] border border-[#E8E4DE] font-bold rounded-full text-xs transition-colors"
              >
                {language === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !password.trim()}
                className="w-1/2 py-2.5 bg-[#5A5A40] hover:bg-[#4a4a35] disabled:opacity-50 text-white font-bold rounded-full text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isSubmitting ? '...' : language === 'hi' ? 'प्रवेश करें' : 'Unlock'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
