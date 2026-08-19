import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  CreditCard,
  QrCode,
  ArrowRight,
  Receipt,
  HeartHandshake,
  Star,
  Award,
  Crown,
  Info
} from 'lucide-react';
import { MarriagePackage, ServiceChargeConfig, UserProfile, PaymentTransaction } from '../types';

interface PackagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  packages: MarriagePackage[];
  serviceChargeConfig: ServiceChargeConfig;
  currentUser: UserProfile;
  onSelectPackage: (pkg: MarriagePackage, paymentMethod: 'UPI' | 'NetBanking' | 'Card' | 'Cash / Office Desk') => void;
  onPayServiceCharge: (amount: number, paymentMethod: 'UPI' | 'NetBanking' | 'Card' | 'Cash / Office Desk') => void;
  language: 'hi' | 'en';
}

export const PackagesModal: React.FC<PackagesModalProps> = ({
  isOpen,
  onClose,
  packages,
  serviceChargeConfig,
  currentUser,
  onSelectPackage,
  onPayServiceCharge,
  language
}) => {
  const [selectedPkg, setSelectedPkg] = useState<MarriagePackage | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [checkoutType, setCheckoutType] = useState<'package' | 'service_charge'>('package');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'NetBanking' | 'Card' | 'Cash / Office Desk'>('UPI');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [successReceipt, setSuccessReceipt] = useState<PaymentTransaction | null>(null);

  if (!isOpen) return null;

  const currentPkg = packages.find((p) => p.id === currentUser.subscribedPackageId);

  const handleStartPackageCheckout = (pkg: MarriagePackage) => {
    setSelectedPkg(pkg);
    setCheckoutType('package');
    setIsCheckoutOpen(true);
    setSuccessReceipt(null);
  };

  const handleStartServiceChargeCheckout = () => {
    setCheckoutType('service_charge');
    setIsCheckoutOpen(true);
    setSuccessReceipt(null);
  };

  const handleProcessPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const invoiceNo = `SV-${checkoutType === 'package' ? 'PKG' : 'SVC'}-${Date.now().toString().slice(-6)}`;
      const amount = checkoutType === 'package' ? (selectedPkg?.price || 0) : serviceChargeConfig.startServiceCharge;
      
      const newTx: PaymentTransaction = {
        id: `tx_${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.fullName,
        userMobile: currentUser.mobile,
        type: checkoutType === 'package' ? 'marriage_package' : 'start_service_charge',
        packageId: checkoutType === 'package' ? selectedPkg?.id : undefined,
        packageName: checkoutType === 'package' ? (language === 'hi' ? selectedPkg?.nameHindi : selectedPkg?.name) : undefined,
        amount: amount,
        paymentMethod: paymentMethod,
        status: 'completed',
        transactionDate: new Date().toISOString().split('T')[0],
        invoiceNumber: invoiceNo,
        notes: checkoutType === 'package' ? 'पैकेज सब्सक्रिप्शन सफल' : 'प्रारंभिक सेवा शुल्क जमा'
      };

      if (checkoutType === 'package' && selectedPkg) {
        onSelectPackage(selectedPkg, paymentMethod);
      } else {
        onPayServiceCharge(serviceChargeConfig.startServiceCharge, paymentMethod);
      }

      setSuccessReceipt(newTx);
    }, 900);
  };

  return (
    <div
      id="packages-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="packages-modal-card"
        className="bg-white rounded-[32px] max-w-5xl w-full border border-[#E8E4DE] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#5A5A40] p-6 sm:p-7 text-white flex items-center justify-between border-b border-[#E8E4DE] shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#D4A373] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              <Crown className="w-3 h-3" />
              <span>{language === 'hi' ? 'विवाह पैकेज एवं सेवा शुल्क' : 'Marriage Packages & Service Fee'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold">
              {language === 'hi' ? 'स्मार्ट विवाह सदस्यता एवं मैरिज पैकेज' : 'Smart Vivah Membership & Marriage Plans'}
            </h2>
            <p className="text-xs text-[#E8E4DE] mt-1">
              {language === 'hi'
                ? 'पारदर्शी सेवा शुल्क (₹1,000) एवं ४ विशेष विवाह पैकेज (₹20,000, ₹10,000, ₹5,000, ₹500) • कोई छुपा शुल्क नहीं'
                : 'Transparent initial service fee (₹1,000) & 4 distinct packages (₹20k, ₹10k, ₹5k, ₹500) with dedicated matchmaker support.'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-7 bg-[#FAF9F6]">
          {/* Service Charge Banner */}
          {serviceChargeConfig.isEnabled && (
            <div className="bg-white rounded-[28px] border-2 border-[#D4A373] p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#D4A373]/15 text-[#5A5A40] flex items-center justify-center text-xl shrink-0 font-serif font-bold">
                  ₹{serviceChargeConfig.startServiceCharge}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-serif font-bold text-base text-[#5A5A40]">
                      {language === 'hi' ? serviceChargeConfig.chargeTitleHindi : serviceChargeConfig.chargeTitleEn}
                    </h3>
                    <span className="bg-[#5A5A40] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      {language === 'hi' ? 'प्रारंभिक सेवा शुल्क (Start Service)' : 'Registration Fee'}
                    </span>
                    {currentUser.hasPaidServiceCharge && (
                      <span className="bg-[#5A5A40] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#D4A373]" />
                        <span>{language === 'hi' ? 'जमा है (Active)' : 'Paid & Active'}</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#8C8479] mt-1 max-w-2xl">
                    {language === 'hi' ? serviceChargeConfig.descriptionHindi : serviceChargeConfig.descriptionEn}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-[#5A5A40] font-medium">
                    <span className="flex items-center gap-1">✓ {language === 'hi' ? 'आधार/केवाईसी सत्यापन' : 'Aadhaar/KYC Verification'}</span>
                    <span className="flex items-center gap-1">✓ {language === 'hi' ? 'कुंडली/इस्तिक़ामत मिलान' : 'Kundali/Istikhara Match'}</span>
                    <span className="flex items-center gap-1">✓ {language === 'hi' ? 'प्रथम पारिवारिक परामर्श' : 'Initial Consultation'}</span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 self-stretch md:self-auto flex flex-col items-end justify-center">
                {currentUser.hasPaidServiceCharge ? (
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#5A5A40] bg-[#F5F5F0] border border-[#E8E4DE] px-4 py-2 rounded-full inline-flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#5A5A40]" />
                      <span>{language === 'hi' ? 'सेवा शुल्क प्राप्त हुआ' : 'Service Fee Paid'}</span>
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={handleStartServiceChargeCheckout}
                    className="w-full md:w-auto px-6 py-3 bg-[#5A5A40] hover:bg-[#4a4a35] text-white rounded-full text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{language === 'hi' ? `सेवा शुल्क जमा करें (₹${serviceChargeConfig.startServiceCharge})` : `Pay Service Charge (₹${serviceChargeConfig.startServiceCharge})`}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D4A373]" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 4 Packages Grid */}
          <div>
            <div className="text-center max-w-xl mx-auto mb-6">
              <h3 className="text-lg font-serif font-bold text-[#5A5A40]">
                {language === 'hi' ? '४ विशेष विवाह एवं निकाह पैकेज' : '4 Tailored Marriage & Nikah Plans'}
              </h3>
              <p className="text-xs text-[#8C8479] mt-1">
                {language === 'hi'
                  ? 'अपनी आवश्यकतानुसार योजना चुनें। रिश्ता पक्का होने पर एडमिन कमीशन पॉलिसी लागू होती है।'
                  : 'Choose the package that suits your search pace. Fair commission applies upon successful solemnization.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {packages.map((pkg) => {
                const isCurrent = currentUser.subscribedPackageId === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    className={`rounded-[28px] p-5 flex flex-col justify-between border-2 transition-all relative ${
                      pkg.isPopular
                        ? 'bg-white border-[#D4A373] shadow-md ring-2 ring-[#D4A373]/20'
                        : pkg.isElite
                        ? 'bg-white border-[#5A5A40] shadow-md'
                        : 'bg-white border-[#E8E4DE] hover:border-[#D4A373]/60 shadow-2xs'
                    }`}
                  >
                    {/* Top Badges */}
                    {pkg.isPopular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D4A373] text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                        {language === 'hi' ? 'सर्वाधिक लोकप्रिय' : 'Most Popular'}
                      </span>
                    )}
                    {pkg.isElite && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#5A5A40] text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                        {language === 'hi' ? 'रॉयल वीआईपी' : 'Royal VIP'}
                      </span>
                    )}

                    <div>
                      {/* Title & Tagline */}
                      <div className="text-center pb-3 border-b border-[#F5F5F0]">
                        <h4 className="font-serif font-bold text-base text-[#5A5A40]">
                          {language === 'hi' ? pkg.nameHindi : pkg.name}
                        </h4>
                        <p className="text-[11px] text-[#8C8479] mt-0.5 min-h-[32px] line-clamp-2">
                          {language === 'hi' ? pkg.taglineHindi : pkg.taglineEn}
                        </p>
                      </div>

                      {/* Pricing */}
                      <div className="text-center py-4">
                        <div className="flex items-baseline justify-center gap-1.5">
                          <span className="text-2xl sm:text-3xl font-serif font-bold text-[#5A5A40]">
                            ₹{pkg.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-[#8C8479] line-through">
                            ₹{pkg.originalPrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#8C8479] block mt-0.5">
                          {pkg.durationDays} {language === 'hi' ? 'दिनों की वैधता' : 'Days Validity'} •{' '}
                          {pkg.connects > 500 ? (language === 'hi' ? 'असीमित संपर्क' : 'Unlimited Contacts') : `${pkg.connects} ${language === 'hi' ? 'संपर्क' : 'Contacts'}`}
                        </span>

                        {/* Commission on Marriage Notice */}
                        <div className="mt-2 bg-[#FAF9F6] border border-[#E8E4DE] rounded-xl p-2 text-center">
                          <span className="text-[10px] text-[#5A5A40] font-bold block">
                            {language === 'hi' ? 'सफल विवाह पर कमीशन:' : 'Commission on Marriage:'}
                          </span>
                          <span className="text-xs font-serif font-bold text-[#D4A373]">
                            ₹{pkg.commissionOnMarriage.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* Features List */}
                      <div className="space-y-2 py-3 border-t border-[#F5F5F0] text-xs">
                        {(language === 'hi' ? pkg.featuresHindi : pkg.features).map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-[#4A453E] text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#5A5A40] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4 border-t border-[#F5F5F0]">
                      {isCurrent ? (
                        <div className="w-full py-2.5 bg-[#F5F5F0] border border-[#E8E4DE] rounded-full text-center text-xs font-bold text-[#5A5A40] flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#5A5A40]" />
                          <span>{language === 'hi' ? 'सक्रिय प्लान' : 'Current Plan'}</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartPackageCheckout(pkg)}
                          className={`w-full py-2.5 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer ${
                            pkg.isPopular || pkg.isElite
                              ? 'bg-[#5A5A40] hover:bg-[#4a4a35] text-white'
                              : 'bg-[#FAF9F6] hover:bg-[#F5F5F0] text-[#5A5A40] border border-[#E8E4DE]'
                          }`}
                        >
                          {language === 'hi' ? `चुनें (₹${pkg.price.toLocaleString('en-IN')})` : `Choose (₹${pkg.price.toLocaleString('en-IN')})`}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Transparent Commission Policy Note */}
          <div className="bg-[#FAF9F6] border border-[#E8E4DE] rounded-[24px] p-5 text-xs text-[#5A5A40]">
            <div className="flex items-center gap-2 font-serif font-bold text-sm mb-1.5">
              <Info className="w-4 h-4 text-[#D4A373]" />
              <span>{language === 'hi' ? 'विवाह कमीशन एवं सेवा नीति विवरण' : 'Commission Policy & Service Terms'}</span>
            </div>
            <p className="text-[#8C8479] leading-relaxed">
              {language === 'hi'
                ? '१. प्रारंभिक सेवा शुल्क (₹1,000) प्रोफ़ाइल फ़ाइल पंजीकरण, आधार सत्यापन एवं प्रथम मैचमेकिंग सत्र हेतु लिया जाता है। २. विवाह/निकाह सफलतापूर्वक तय होने एवं सगाई/विवाह सम्पन्न होने पर ही संबंधित पैकेज का विवाह कमीशन देय होता है। ३. सभी भुगतानों हेतु जीएसटी चालान एवं रसीद एडमिन पोर्टल द्वारा तुरंत जारी की जाती है।'
                : '1. The initial service fee of ₹1,000 covers profile filing, KYC checks, and first onboarding consultation. 2. Success marriage commission is settled only after mutual engagement or wedding finalization. 3. Official GST invoices and payment receipts are issued instantly upon payment.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white p-4 sm:p-5 border-t border-[#E8E4DE] flex items-center justify-between shrink-0">
          <div className="text-xs text-[#8C8479]">
            {language === 'hi'
              ? 'हेल्पलाइन: +91 98765 43210 • info@smartvivah.in'
              : 'Helpline: +91 98765 43210 • info@smartvivah.in'}
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#FAF9F6] hover:bg-[#F5F5F0] text-[#5A5A40] border border-[#E8E4DE] rounded-full text-xs font-bold cursor-pointer"
          >
            {language === 'hi' ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>

      {/* Checkout Sub-Modal */}
      {isCheckoutOpen && (
        <div
          id="checkout-dialog-backdrop"
          className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsCheckoutOpen(false)}
        >
          <div
            id="checkout-dialog-card"
            className="bg-white rounded-[32px] max-w-md w-full border border-[#E8E4DE] shadow-2xl p-6 sm:p-7 space-y-5 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {successReceipt ? (
              /* Success Receipt View */
              <div className="text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#5A5A40] text-white mx-auto flex items-center justify-center text-2xl">
                  ✓
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#5A5A40]">
                    {language === 'hi' ? 'भुगतान सफल रहा!' : 'Payment Completed Successfully!'}
                  </h3>
                  <p className="text-xs text-[#8C8479] mt-0.5">
                    {language === 'hi' ? 'रसीद संख्या:' : 'Receipt No:'} <strong className="font-mono">{successReceipt.invoiceNumber}</strong>
                  </p>
                </div>

                <div className="bg-[#FAF9F6] border border-[#E8E4DE] rounded-2xl p-4 text-xs space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-[#8C8479]">{language === 'hi' ? 'उपयोगकर्ता:' : 'User:'}</span>
                    <strong className="text-[#5A5A40]">{successReceipt.userName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8C8479]">{language === 'hi' ? 'मद:' : 'Item:'}</span>
                    <strong className="text-[#5A5A40]">
                      {successReceipt.packageName || (language === 'hi' ? 'प्रारंभिक सेवा शुल्क (Start Service Fee)' : 'Start Service Charge')}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8C8479]">{language === 'hi' ? 'जमा राशि:' : 'Amount Paid:'}</span>
                    <strong className="text-[#5A5A40] font-serif text-sm">₹{successReceipt.amount.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8C8479]">{language === 'hi' ? 'माध्यम:' : 'Mode:'}</span>
                    <span className="text-[#5A5A40] font-semibold">{successReceipt.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8C8479]">{language === 'hi' ? 'दिनांक:' : 'Date:'}</span>
                    <span className="text-[#5A5A40]">{successReceipt.transactionDate}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      onClose();
                    }}
                    className="w-full py-3 bg-[#5A5A40] hover:bg-[#4a4a35] text-white rounded-full text-xs font-bold shadow-xs cursor-pointer"
                  >
                    {language === 'hi' ? 'स्वीकार करें एवं आगे बढ़ें' : 'Done & Continue'}
                  </button>
                </div>
              </div>
            ) : (
              /* Checkout Selection & Pay Form */
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#F5F5F0]">
                  <h3 className="font-serif font-bold text-base text-[#5A5A40]">
                    {checkoutType === 'package'
                      ? (language === 'hi' ? 'विवाह पैकेज भुगतान' : 'Package Payment')
                      : (language === 'hi' ? 'प्रारंभिक सेवा शुल्क' : 'Start Service Charge')}
                  </h3>
                  <button
                    onClick={() => setIsCheckoutOpen(false)}
                    className="w-7 h-7 rounded-full bg-[#F5F5F0] hover:bg-[#E8E4DE] text-[#5A5A40] flex items-center justify-center text-xs"
                  >
                    ✕
                  </button>
                </div>

                {/* Amount Summary */}
                <div className="bg-[#FAF9F6] border border-[#E8E4DE] rounded-2xl p-4 text-center">
                  <span className="text-[11px] text-[#8C8479] block">
                    {checkoutType === 'package' ? selectedPkg?.nameHindi : serviceChargeConfig.chargeTitleHindi}
                  </span>
                  <div className="text-3xl font-serif font-bold text-[#5A5A40] mt-1">
                    ₹{(checkoutType === 'package' ? (selectedPkg?.price || 0) : serviceChargeConfig.startServiceCharge).toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-[#5A5A40] font-bold block mt-1">
                    १००% सुरक्षित एवं अधिकृत गेटवे
                  </span>
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#5A5A40] block">
                    {language === 'hi' ? 'भुगतान का माध्यम चुनें:' : 'Select Payment Method:'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['UPI', 'Card', 'NetBanking', 'Cash / Office Desk'] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setPaymentMethod(m)}
                        className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all cursor-pointer flex items-center gap-2 ${
                          paymentMethod === m
                            ? 'bg-[#5A5A40] text-white border-[#5A5A40] shadow-xs'
                            : 'bg-white text-[#5A5A40] border-[#E8E4DE] hover:bg-[#FAF9F6]'
                        }`}
                      >
                        {m === 'UPI' && <QrCode className="w-4 h-4" />}
                        {m === 'Card' && <CreditCard className="w-4 h-4" />}
                        {m === 'NetBanking' && <Receipt className="w-4 h-4" />}
                        {m === 'Cash / Office Desk' && <HeartHandshake className="w-4 h-4" />}
                        <span>{m}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Simulated UPI QR Code if UPI chosen */}
                {paymentMethod === 'UPI' && (
                  <div className="bg-white border border-[#E8E4DE] rounded-2xl p-3 text-center space-y-1">
                    <div className="w-28 h-28 bg-[#FAF9F6] border-2 border-dashed border-[#D4A373] rounded-xl mx-auto flex items-center justify-center">
                      <QrCode className="w-16 h-16 text-[#5A5A40]" />
                    </div>
                    <span className="text-[10px] text-[#8C8479] block">UPI ID: smartvivah@upi • GPay / PhonePe / Paytm</span>
                  </div>
                )}

                {/* Pay Button */}
                <button
                  onClick={handleProcessPayment}
                  disabled={isProcessing}
                  className="w-full py-3.5 bg-[#5A5A40] hover:bg-[#4a4a35] text-white rounded-full text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>{language === 'hi' ? 'प्रक्रिया जारी है...' : 'Processing Payment...'}</span>
                  ) : (
                    <>
                      <span>
                        {language === 'hi'
                          ? `₹${(checkoutType === 'package' ? (selectedPkg?.price || 0) : serviceChargeConfig.startServiceCharge).toLocaleString('en-IN')} का भुगतान करें`
                          : `Pay ₹${(checkoutType === 'package' ? (selectedPkg?.price || 0) : serviceChargeConfig.startServiceCharge).toLocaleString('en-IN')}`}
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#D4A373]" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
