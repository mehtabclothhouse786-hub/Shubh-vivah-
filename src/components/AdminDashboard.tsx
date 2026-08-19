import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Sparkles,
  TrendingUp,
  Search,
  Eye,
  Lock,
  DollarSign,
  Crown,
  Percent,
  Sliders,
  Check,
  Printer,
  Receipt,
  ArrowUpRight,
  Send,
  Download,
  Clock,
  Briefcase
} from 'lucide-react';
import {
  UserProfile,
  AdminReport,
  InterestRequest,
  MarriagePackage,
  ServiceChargeConfig,
  PaymentTransaction,
  MarriageCommissionRecord
} from '../types';

interface AdminDashboardProps {
  profiles: UserProfile[];
  interests: InterestRequest[];
  reports: AdminReport[];
  packages: MarriagePackage[];
  onUpdatePackages: (updated: MarriagePackage[]) => void;
  serviceChargeConfig: ServiceChargeConfig;
  onUpdateServiceCharge: (updated: ServiceChargeConfig) => void;
  transactions: PaymentTransaction[];
  commissionRecords: MarriageCommissionRecord[];
  onUpdateCommissionRecord: (recordId: string, updates: Partial<MarriageCommissionRecord>) => void;
  onApproveProfile: (profileId: string) => void;
  onRejectProfile: (profileId: string, reason: string) => void;
  onToggleUserStatus: (profileId: string) => void;
  onResolveReport: (reportId: string, action: 'action_taken' | 'dismissed') => void;
  onOpenDetail: (profile: UserProfile) => void;
  language: 'hi' | 'en';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  profiles,
  interests,
  reports,
  packages,
  onUpdatePackages,
  serviceChargeConfig,
  onUpdateServiceCharge,
  transactions,
  commissionRecords,
  onUpdateCommissionRecord,
  onApproveProfile,
  onRejectProfile,
  onToggleUserStatus,
  onResolveReport,
  onOpenDetail,
  language
}) => {
  const [adminTab, setAdminTab] = useState<'commission' | 'approvals' | 'users' | 'reports'>('commission');
  const [searchTerm, setSearchTerm] = useState('');
  const [commissionSubTab, setCommissionSubTab] = useState<'overview' | 'packages' | 'service_charge' | 'settlements' | 'transactions'>('overview');

  // Local Editable state for Service Charge
  const [editableServiceCharge, setEditableServiceCharge] = useState<number>(serviceChargeConfig.startServiceCharge);
  const [isServiceChargeEnabled, setIsServiceChargeEnabled] = useState<boolean>(serviceChargeConfig.isEnabled);
  const [isMandatory, setIsMandatory] = useState<boolean>(serviceChargeConfig.mandatoryForMatchmaking);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Package editing state
  const [editingPkgId, setEditingPkgId] = useState<string | null>(null);
  const [editedPrice, setEditedPrice] = useState<number>(0);
  const [editedCommission, setEditedCommission] = useState<number>(0);
  const [editedConnects, setEditedConnects] = useState<number>(0);

  // Selected receipt for preview modal
  const [activeReceiptTx, setActiveReceiptTx] = useState<PaymentTransaction | null>(null);
  const [activeCommissionInvoice, setActiveCommissionInvoice] = useState<MarriageCommissionRecord | null>(null);

  // Pending KYC profiles
  const pendingApprovals = profiles.filter((p) => !p.isVerified || p.verificationStatus === 'pending');
  const pendingReports = reports.filter((r) => r.status === 'pending');

  const filteredUsers = profiles.filter(
    (p) =>
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.mobile.includes(searchTerm) ||
      p.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Financial Calculations
  const totalRevenue = transactions.reduce((acc, tx) => (tx.status === 'completed' ? acc + tx.amount : acc), 0);
  const totalServiceChargesCollected = transactions
    .filter((tx) => tx.type === 'start_service_charge' && tx.status === 'completed')
    .reduce((acc, tx) => acc + tx.amount, 0);
  const totalPackageRevenue = transactions
    .filter((tx) => tx.type === 'marriage_package' && tx.status === 'completed')
    .reduce((acc, tx) => acc + tx.amount, 0);
  const totalCommissionCollected = transactions
    .filter((tx) => tx.type === 'marriage_commission' && tx.status === 'completed')
    .reduce((acc, tx) => acc + tx.amount, 0);
  const pendingCommissionAmount = commissionRecords
    .filter((c) => c.status === 'pending')
    .reduce((acc, c) => acc + c.commissionAmount, 0);

  const handleSaveServiceCharge = () => {
    const updated: ServiceChargeConfig = {
      ...serviceChargeConfig,
      startServiceCharge: editableServiceCharge,
      isEnabled: isServiceChargeEnabled,
      mandatoryForMatchmaking: isMandatory
    };
    onUpdateServiceCharge(updated);
    setSaveSuccessMsg(
      language === 'hi'
        ? `✅ प्रारंभिक सेवा शुल्क ₹${editableServiceCharge} सफलतापूर्वक लागू कर दिया गया है!`
        : `✅ Start service charge updated to ₹${editableServiceCharge} successfully!`
    );
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  const handleStartEditPackage = (pkg: MarriagePackage) => {
    setEditingPkgId(pkg.id);
    setEditedPrice(pkg.price);
    setEditedCommission(pkg.commissionOnMarriage);
    setEditedConnects(pkg.connects);
  };

  const handleSavePackage = (pkgId: string) => {
    const updatedList = packages.map((p) => {
      if (p.id === pkgId) {
        return {
          ...p,
          price: editedPrice,
          commissionOnMarriage: editedCommission,
          connects: editedConnects
        };
      }
      return p;
    });
    onUpdatePackages(updatedList);
    setEditingPkgId(null);
    setSaveSuccessMsg(
      language === 'hi'
        ? `✅ पैकेज मूल्य एवं विवाह कमीशन सफलतापूर्वक अपडेट किया गया!`
        : `✅ Package price & marriage commission saved successfully!`
    );
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleTogglePackageActive = (pkgId: string) => {
    const updatedList = packages.map((p) => {
      if (p.id === pkgId) {
        return { ...p, isActive: !p.isActive };
      }
      return p;
    });
    onUpdatePackages(updatedList);
  };

  const handleSettleCommission = (recordId: string, status: 'paid' | 'waived') => {
    const today = new Date().toISOString().split('T')[0];
    onUpdateCommissionRecord(recordId, {
      status: status,
      settlementDate: today,
      receiptNumber: `REC-VIVAH-${Date.now().toString().slice(-6)}`
    });
    setSaveSuccessMsg(
      status === 'paid'
        ? (language === 'hi' ? '✅ विवाह कमीशन भुगतान दर्ज किया गया!' : '✅ Marriage commission marked as paid!')
        : (language === 'hi' ? 'ℹ️ कमीशन छूट (Waived) दर्ज की गई।' : 'ℹ️ Commission waived.')
    );
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  return (
    <div id="admin-control-portal" className="space-y-6 max-w-7xl mx-auto">
      {/* Admin Header in Natural Tones */}
      <div className="bg-[#5A5A40] rounded-[32px] p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-[#E8E4DE]">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#D4A373] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Lock className="w-3 h-3" />
            <span>{language === 'hi' ? 'प्रशासनिक नियंत्रण केंद्र' : 'Admin Security & Control Center'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold">
            {language === 'hi' ? 'स्मार्ट विवाह एडमिन पैनल' : 'Smart Vivah Admin Portal'}
          </h1>
          <p className="text-xs text-[#E8E4DE] mt-1 max-w-xl">
            {language === 'hi'
              ? '४ विवाह पैकेज (₹20k, ₹10k, ₹5k, ₹500), सेवा शुल्क (₹1,000) कंट्रोल, विवाह कमीशन सेटलमेंट व केवाईसी अनुमोदन'
              : '4 Marriage Packages (₹20k, ₹10k, ₹5k, ₹500), ₹1,000 Service Charge Control, Marriage Commission Settlement & KYC Approvals'}
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-[#4A453E]/60 p-1.5 rounded-full border border-[#E8E4DE]/30 text-xs font-semibold shrink-0 flex-wrap gap-1">
          <button
            id="admin-tab-commission"
            onClick={() => setAdminTab('commission')}
            className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
              adminTab === 'commission' ? 'bg-white text-[#5A5A40] shadow-xs font-bold' : 'text-[#E8E4DE] hover:text-white'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-[#D4A373]" />
            <span>{language === 'hi' ? 'पैकेज व कमीशन कंट्रोल' : 'Packages & Commission'}</span>
          </button>

          <button
            id="admin-tab-approvals"
            onClick={() => setAdminTab('approvals')}
            className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
              adminTab === 'approvals' ? 'bg-white text-[#5A5A40] shadow-xs font-bold' : 'text-[#E8E4DE] hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'केवाईसी (KYC)' : 'KYC Approvals'}</span>
            {pendingApprovals.length > 0 && (
              <span className="bg-[#D4A373] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {pendingApprovals.length}
              </span>
            )}
          </button>

          <button
            id="admin-tab-users"
            onClick={() => setAdminTab('users')}
            className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
              adminTab === 'users' ? 'bg-white text-[#5A5A40] shadow-xs font-bold' : 'text-[#E8E4DE] hover:text-white'
            }`}
          >
            <span>{language === 'hi' ? 'यूज़र सूची' : 'Users'}</span>
          </button>

          <button
            id="admin-tab-reports"
            onClick={() => setAdminTab('reports')}
            className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
              adminTab === 'reports' ? 'bg-white text-[#5A5A40] shadow-xs font-bold' : 'text-[#E8E4DE] hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'शिकायतें' : 'Reports'}</span>
            {pendingReports.length > 0 && (
              <span className="bg-[#D4A373] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {pendingReports.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Global Toast / Success feedback inside Admin */}
      {saveSuccessMsg && (
        <div className="bg-[#5A5A40] text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-md border border-[#D4A373] animate-fade-in flex items-center justify-between">
          <span>{saveSuccessMsg}</span>
          <button onClick={() => setSaveSuccessMsg(null)} className="text-white/80 hover:text-white text-xs ml-4">
            ✕
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: COMMISSION & MARRIAGE PACKAGES CONTROL PANEL */}
      {/* ========================================================================= */}
      {adminTab === 'commission' && (
        <div className="space-y-6">
          {/* Top Financial KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-[28px] border border-[#E8E4DE] shadow-xs">
              <div className="flex items-center justify-between text-[#8C8479] text-xs">
                <span>{language === 'hi' ? 'कुल राजस्व संकलन' : 'Total Gross Revenue'}</span>
                <span className="p-1.5 rounded-xl bg-[#FAF9F6] text-[#5A5A40] font-bold">₹</span>
              </div>
              <strong className="text-2xl sm:text-3xl font-serif font-bold text-[#5A5A40] mt-2 block">
                ₹{totalRevenue.toLocaleString('en-IN')}
              </strong>
              <span className="text-[10px] text-[#5A5A40] font-semibold flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-[#D4A373]" />
                {transactions.length} {language === 'hi' ? 'कुल भुगतान' : 'Total Transactions'}
              </span>
            </div>

            <div className="bg-white p-5 rounded-[28px] border border-[#E8E4DE] shadow-xs">
              <div className="flex items-center justify-between text-[#8C8479] text-xs">
                <span>{language === 'hi' ? 'प्रारंभिक सेवा शुल्क (₹1,000)' : 'Start Service Charges'}</span>
                <span className="p-1.5 rounded-xl bg-[#FAF9F6] text-[#D4A373]">
                  <Briefcase className="w-3.5 h-3.5" />
                </span>
              </div>
              <strong className="text-2xl sm:text-3xl font-serif font-bold text-[#5A5A40] mt-2 block">
                ₹{totalServiceChargesCollected.toLocaleString('en-IN')}
              </strong>
              <span className="text-[10px] text-[#8C8479] mt-1 block">
                {Math.round(totalServiceChargesCollected / (serviceChargeConfig.startServiceCharge || 1000))} {language === 'hi' ? 'प्रोफ़ाइल फ़ाइल पंजीकरण' : 'Files Registered'}
              </span>
            </div>

            <div className="bg-white p-5 rounded-[28px] border border-[#E8E4DE] shadow-xs">
              <div className="flex items-center justify-between text-[#8C8479] text-xs">
                <span>{language === 'hi' ? '४ विवाह पैकेज राजस्व' : '4 Packages Revenue'}</span>
                <span className="p-1.5 rounded-xl bg-[#FAF9F6] text-[#5A5A40]">
                  <Crown className="w-3.5 h-3.5" />
                </span>
              </div>
              <strong className="text-2xl sm:text-3xl font-serif font-bold text-[#5A5A40] mt-2 block">
                ₹{totalPackageRevenue.toLocaleString('en-IN')}
              </strong>
              <span className="text-[10px] text-[#5A5A40] font-semibold mt-1 block">
                ₹20k, ₹10k, ₹5k, ₹500 {language === 'hi' ? 'प्लान्स' : 'Plans'}
              </span>
            </div>

            <div className="bg-white p-5 rounded-[28px] border border-[#E8E4DE] shadow-xs">
              <div className="flex items-center justify-between text-[#8C8479] text-xs">
                <span>{language === 'hi' ? 'विवाह संपन्न कमीशन' : 'Marriage Commission'}</span>
                <span className="p-1.5 rounded-xl bg-[#FAF9F6] text-[#D4A373]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </span>
              </div>
              <strong className="text-2xl sm:text-3xl font-serif font-bold text-[#D4A373] mt-2 block">
                ₹{totalCommissionCollected.toLocaleString('en-IN')}
              </strong>
              <span className="text-[10px] text-amber-700 font-semibold mt-1 block">
                ₹{pendingCommissionAmount.toLocaleString('en-IN')} {language === 'hi' ? 'वसूली हेतु लंबित' : 'Pending Settlement'}
              </span>
            </div>
          </div>

          {/* Commission Navigation Sub-tabs */}
          <div className="flex items-center gap-2 border-b border-[#E8E4DE] pb-2 overflow-x-auto">
            <button
              onClick={() => setCommissionSubTab('overview')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                commissionSubTab === 'overview'
                  ? 'bg-[#5A5A40] text-white shadow-xs'
                  : 'bg-white text-[#5A5A40] border border-[#E8E4DE] hover:bg-[#FAF9F6]'
              }`}
            >
              <span>{language === 'hi' ? 'नियंत्रण डैशबोर्ड' : 'Control Dashboard'}</span>
            </button>

            <button
              onClick={() => setCommissionSubTab('service_charge')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                commissionSubTab === 'service_charge'
                  ? 'bg-[#5A5A40] text-white shadow-xs'
                  : 'bg-white text-[#5A5A40] border border-[#E8E4DE] hover:bg-[#FAF9F6]'
              }`}
            >
              <span>{language === 'hi' ? 'सेवा शुल्क कंट्रोल (₹1,000)' : 'Service Charge (₹1,000)'}</span>
            </button>

            <button
              onClick={() => setCommissionSubTab('packages')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                commissionSubTab === 'packages'
                  ? 'bg-[#5A5A40] text-white shadow-xs'
                  : 'bg-white text-[#5A5A40] border border-[#E8E4DE] hover:bg-[#FAF9F6]'
              }`}
            >
              <span>{language === 'hi' ? '४ विवाह पैकेज (₹20k, 10k, 5k, 500)' : '4 Packages (₹20k, 10k, 5k, 500)'}</span>
            </button>

            <button
              onClick={() => setCommissionSubTab('settlements')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                commissionSubTab === 'settlements'
                  ? 'bg-[#5A5A40] text-white shadow-xs'
                  : 'bg-white text-[#5A5A40] border border-[#E8E4DE] hover:bg-[#FAF9F6]'
              }`}
            >
              <span>{language === 'hi' ? 'विवाह कमीशन सेटलमेंट' : 'Commission Settlements'}</span>
              {pendingCommissionAmount > 0 && (
                <span className="ml-1.5 bg-[#D4A373] text-white text-[10px] px-1.5 py-0.2 rounded-full">
                  {commissionRecords.filter((c) => c.status === 'pending').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setCommissionSubTab('transactions')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                commissionSubTab === 'transactions'
                  ? 'bg-[#5A5A40] text-white shadow-xs'
                  : 'bg-white text-[#5A5A40] border border-[#E8E4DE] hover:bg-[#FAF9F6]'
              }`}
            >
              <span>{language === 'hi' ? 'लेन-देन एवं रसीदें' : 'Transactions & Invoices'}</span>
            </button>
          </div>

          {/* SUB-TAB: SERVICE CHARGE CONTROLLER (₹1,000) */}
          {(commissionSubTab === 'overview' || commissionSubTab === 'service_charge') && (
            <div className="bg-white rounded-[32px] border border-[#E8E4DE] p-6 space-y-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F5F5F0]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-[#D4A373]/20 text-[#5A5A40] rounded-xl font-serif font-bold text-sm">₹</span>
                    <h2 className="text-lg font-serif font-bold text-[#5A5A40]">
                      {language === 'hi' ? 'प्रारंभिक सेवा शुल्क कंट्रोल (Start Service Charges Control)' : 'Start Service Charges Control'}
                    </h2>
                  </div>
                  <p className="text-xs text-[#8C8479] mt-1">
                    {language === 'hi'
                      ? 'नए उपयोगकर्ता पंजीकरण, आधार/केवाईसी सत्यापन एवं व्यक्तिगत परामर्श हेतु लागू बेस फ़ीस (डिफ़ॉल्ट ₹1,000)'
                      : 'Set base registration, file opening & KYC verification charge for incoming profiles (Default ₹1,000).'}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs font-bold text-[#5A5A40] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isServiceChargeEnabled}
                      onChange={(e) => setIsServiceChargeEnabled(e.target.checked)}
                      className="w-4 h-4 rounded text-[#5A5A40] accent-[#5A5A40]"
                    />
                    <span>{language === 'hi' ? 'सेवा शुल्क सक्रिय (Enabled)' : 'Service Charge Enabled'}</span>
                  </label>
                </div>
              </div>

              {/* Service Charge Inputs & Controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-[#E8E4DE] space-y-2">
                  <label className="text-xs font-bold text-[#5A5A40] block">
                    {language === 'hi' ? 'प्रारंभिक सेवा शुल्क राशि (₹)' : 'Start Service Charge Amount (₹)'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 font-bold text-[#5A5A40] text-sm">₹</span>
                    <input
                      type="number"
                      value={editableServiceCharge}
                      onChange={(e) => setEditableServiceCharge(Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-2 text-sm font-serif font-bold bg-white border border-[#E8E4DE] rounded-xl outline-none text-[#5A5A40]"
                      min="0"
                      step="100"
                    />
                  </div>
                  <span className="text-[10px] text-[#8C8479]">
                    {language === 'hi' ? 'मानक डिफ़ॉल्ट: ₹1,000 प्रति फ़ाइल' : 'Standard default: ₹1,000 per file'}
                  </span>
                </div>

                <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-[#E8E4DE] space-y-2">
                  <label className="text-xs font-bold text-[#5A5A40] block">
                    {language === 'hi' ? 'नियम व शर्तें (Policy Control)' : 'Rules & Enforcement'}
                  </label>
                  <div className="space-y-1.5 text-xs text-[#4A453E]">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isMandatory}
                        onChange={(e) => setIsMandatory(e.target.checked)}
                        className="rounded accent-[#5A5A40]"
                      />
                      <span>{language === 'hi' ? 'मैचमेकिंग शुरू करने हेतु अनिवार्य' : 'Mandatory for matchmaking'}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded accent-[#5A5A40]" />
                      <span>{language === 'hi' ? 'आधार/केवाईसी सत्यापन शामिल' : 'Include Aadhaar KYC check'}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded accent-[#5A5A40]" />
                      <span>{language === 'hi' ? 'कुंडली मिलान विश्लेषण शामिल' : 'Include Kundali check'}</span>
                    </label>
                  </div>
                </div>

                <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-[#E8E4DE] flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#5A5A40] block">
                      {language === 'hi' ? 'वर्तमान स्थिति' : 'Current Status'}
                    </span>
                    <p className="text-xs text-[#8C8479] mt-1">
                      {isServiceChargeEnabled
                        ? (language === 'hi' ? `सक्रिय: प्रत्येक नए उपयोगकर्ता को ₹${editableServiceCharge} का चालान प्रस्तुत होगा।` : `Active: ₹${editableServiceCharge} invoiced on onboarding.`)
                        : (language === 'hi' ? 'निष्क्रिय: प्रारंभिक सेवा शुल्क माफ़ है।' : 'Disabled: Free registration active.')}
                    </p>
                  </div>

                  <button
                    onClick={handleSaveServiceCharge}
                    className="w-full py-2.5 bg-[#5A5A40] hover:bg-[#4a4a35] text-white rounded-full text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-3"
                  >
                    <Check className="w-3.5 h-3.5 text-[#D4A373]" />
                    <span>{language === 'hi' ? 'सेवा शुल्क लागू करें' : 'Apply Service Charge'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SUB-TAB: 4 MARRIAGE PACKAGES CONTROLLER */}
          {(commissionSubTab === 'overview' || commissionSubTab === 'packages') && (
            <div className="bg-white rounded-[32px] border border-[#E8E4DE] p-6 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F5F5F0]">
                <div>
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-[#D4A373]" />
                    <h2 className="text-lg font-serif font-bold text-[#5A5A40]">
                      {language === 'hi' ? '४ विवाह पैकेज व कमीशन दरें (4 Marriage Packages Applied)' : '4 Marriage Packages & Commission Rates'}
                    </h2>
                  </div>
                  <p className="text-xs text-[#8C8479] mt-1">
                    {language === 'hi'
                      ? 'रॉयल (₹20,000), गोल्ड (₹10,000), सिल्वर (₹5,000) एवं बेसिक (₹500) की दरें, कमीशन व संपर्क सीमा नियंत्रित करें।'
                      : 'Control prices, success commissions, and connect limits for ₹20,000, ₹10,000, ₹5,000, and ₹500 tiers.'}
                  </p>
                </div>
              </div>

              {/* 4 Packages Grid in Admin */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {packages.map((pkg) => {
                  const isEditing = editingPkgId === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      className={`rounded-[28px] p-5 border-2 flex flex-col justify-between transition-all ${
                        pkg.isActive
                          ? pkg.isElite
                            ? 'bg-white border-[#5A5A40] shadow-sm'
                            : pkg.isPopular
                            ? 'bg-white border-[#D4A373] shadow-sm'
                            : 'bg-white border-[#E8E4DE]'
                          : 'bg-[#FAF9F6] border-[#E8E4DE] opacity-60'
                      }`}
                    >
                      <div>
                        {/* Header & Status Toggle */}
                        <div className="flex items-center justify-between pb-3 border-b border-[#F5F5F0]">
                          <span className="font-serif font-bold text-sm text-[#5A5A40]">
                            {language === 'hi' ? pkg.nameHindi : pkg.name}
                          </span>
                          <button
                            onClick={() => handleTogglePackageActive(pkg.id)}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer transition-all ${
                              pkg.isActive ? 'bg-[#5A5A40] text-white' : 'bg-[#E8E4DE] text-[#8C8479]'
                            }`}
                          >
                            {pkg.isActive ? (language === 'hi' ? 'सक्रिय' : 'Active') : (language === 'hi' ? 'बंद' : 'Disabled')}
                          </button>
                        </div>

                        {/* Package Pricing / Editing */}
                        <div className="py-4 space-y-3">
                          {isEditing ? (
                            <div className="space-y-2 bg-[#FAF9F6] p-3 rounded-2xl border border-[#E8E4DE]">
                              <div>
                                <label className="text-[10px] font-bold text-[#8C8479] block">
                                  {language === 'hi' ? 'पैकेज मूल्य (₹):' : 'Package Price (₹):'}
                                </label>
                                <input
                                  type="number"
                                  value={editedPrice}
                                  onChange={(e) => setEditedPrice(Number(e.target.value))}
                                  className="w-full px-2.5 py-1 text-xs font-bold bg-white border border-[#E8E4DE] rounded-lg text-[#5A5A40]"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] font-bold text-[#8C8479] block">
                                  {language === 'hi' ? 'विवाह पर कमीशन (₹):' : 'Marriage Commission (₹):'}
                                </label>
                                <input
                                  type="number"
                                  value={editedCommission}
                                  onChange={(e) => setEditedCommission(Number(e.target.value))}
                                  className="w-full px-2.5 py-1 text-xs font-bold bg-white border border-[#E8E4DE] rounded-lg text-[#D4A373]"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] font-bold text-[#8C8479] block">
                                  {language === 'hi' ? 'संपर्क सीमा (Connects):' : 'Connects Limit:'}
                                </label>
                                <input
                                  type="number"
                                  value={editedConnects}
                                  onChange={(e) => setEditedConnects(Number(e.target.value))}
                                  className="w-full px-2.5 py-1 text-xs font-bold bg-white border border-[#E8E4DE] rounded-lg text-[#5A5A40]"
                                />
                              </div>

                              <div className="flex items-center gap-2 pt-1">
                                <button
                                  onClick={() => handleSavePackage(pkg.id)}
                                  className="flex-1 py-1.5 bg-[#5A5A40] text-white text-[11px] font-bold rounded-lg cursor-pointer"
                                >
                                  {language === 'hi' ? 'सहेजें' : 'Save'}
                                </button>
                                <button
                                  onClick={() => setEditingPkgId(null)}
                                  className="px-2 py-1.5 bg-[#FAF9F6] text-[#8C8479] border border-[#E8E4DE] text-[11px] font-bold rounded-lg cursor-pointer"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="text-2xl font-serif font-bold text-[#5A5A40]">
                                ₹{pkg.price.toLocaleString('en-IN')}
                              </div>
                              <span className="text-[10px] text-[#8C8479] block mt-0.5">
                                {pkg.durationDays} {language === 'hi' ? 'दिन' : 'Days'} •{' '}
                                {pkg.connects > 500 ? (language === 'hi' ? 'असीमित संपर्क' : 'Unlimited') : `${pkg.connects} ${language === 'hi' ? 'संपर्क' : 'Connects'}`}
                              </span>

                              <div className="mt-3 bg-[#FAF9F6] p-2.5 rounded-xl border border-[#E8E4DE]">
                                <span className="text-[10px] text-[#8C8479] block">
                                  {language === 'hi' ? 'विवाह तय होने पर कमीशन:' : 'Marriage Commission Fee:'}
                                </span>
                                <strong className="text-sm font-serif font-bold text-[#D4A373]">
                                  ₹{pkg.commissionOnMarriage.toLocaleString('en-IN')}
                                </strong>
                              </div>
                            </div>
                          )}

                          {/* Feature Highlights */}
                          <div className="text-[11px] text-[#4A453E] space-y-1 pt-2 border-t border-[#F5F5F0]">
                            {(language === 'hi' ? pkg.featuresHindi : pkg.features).slice(0, 3).map((f, idx) => (
                              <div key={idx} className="flex items-start gap-1.5">
                                <span className="text-[#5A5A40] font-bold">•</span>
                                <span className="line-clamp-1">{f}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {!isEditing && (
                        <div className="pt-3 border-t border-[#F5F5F0]">
                          <button
                            onClick={() => handleStartEditPackage(pkg)}
                            className="w-full py-2 bg-[#FAF9F6] hover:bg-[#F5F5F0] text-[#5A5A40] border border-[#E8E4DE] rounded-full text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                          >
                            <Sliders className="w-3 h-3 text-[#D4A373]" />
                            <span>{language === 'hi' ? 'मूल्य व कमीशन बदलें' : 'Edit Price & Commission'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SUB-TAB: MARRIAGE COMMISSION SETTLEMENTS */}
          {(commissionSubTab === 'overview' || commissionSubTab === 'settlements') && (
            <div className="bg-white rounded-[32px] border border-[#E8E4DE] p-6 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F5F5F0]">
                <div>
                  <h2 className="text-base font-serif font-bold text-[#5A5A40] flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#D4A373]" />
                    <span>{language === 'hi' ? 'सफल विवाह कमीशन सेटलमेंट लेजर (Marriage Settlements)' : 'Marriage Commission Settlement Ledger'}</span>
                  </h2>
                  <p className="text-xs text-[#8C8479] mt-0.5">
                    {language === 'hi'
                      ? 'रिश्ता पक्का होने एवं विवाह/निकाह सम्पन्न होने पर एडमिन कमीशन भुगतान की स्थिति'
                      : 'Records of successful matches, their package tier, commission amount, and collection status.'}
                  </p>
                </div>

                <span className="text-xs bg-[#F5F5F0] text-[#5A5A40] border border-[#E8E4DE] px-3.5 py-1.5 rounded-full font-bold">
                  {commissionRecords.length} {language === 'hi' ? 'विवाह मामले' : 'Cases Logged'}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#E8E4DE] text-xs">
                  <thead className="bg-[#FAF9F6] text-[#5A5A40] font-serif font-bold">
                    <tr>
                      <th className="px-4 py-3 text-left">वर एवं वधू (Couple)</th>
                      <th className="px-4 py-3 text-left">पैकेज एवं विवाह तिथि</th>
                      <th className="px-4 py-3 text-left">कमीशन राशि</th>
                      <th className="px-4 py-3 text-left">स्थिति</th>
                      <th className="px-4 py-3 text-right">कार्रवाई</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F5F5F0] bg-white text-[#4A453E]">
                    {commissionRecords.map((c) => (
                      <tr key={c.id} className="hover:bg-[#FAF9F6]">
                        <td className="px-4 py-3">
                          <div>
                            <strong className="text-xs text-[#5A5A40] font-serif block">
                              {c.groomName} 💍 {c.brideName}
                            </strong>
                            <span className="text-[10px] text-[#8C8479]">
                              मैनेजर: {c.assignedManager || 'सेंट्रल डेस्क'}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-[#5A5A40] block">{c.packageTier}</span>
                          <span className="text-[10px] text-[#8C8479]">विवाह: {c.weddingDate}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-serif font-bold text-sm text-[#D4A373]">
                            ₹{c.commissionAmount.toLocaleString('en-IN')}
                          </div>
                          <span className="text-[10px] text-[#8C8479]">
                            सेवा शुल्क: ₹{c.serviceChargePaid} जमा
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {c.status === 'paid' && (
                            <span className="bg-[#5A5A40] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                              ✓ {language === 'hi' ? 'कमीशन प्राप्त' : 'Paid & Settled'}
                            </span>
                          )}
                          {c.status === 'pending' && (
                            <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                              ⏳ {language === 'hi' ? 'वसूली लंबित' : 'Pending'}
                            </span>
                          )}
                          {c.status === 'waived' && (
                            <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                              {language === 'hi' ? 'छूट दी गई (Waived)' : 'Waived'}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right space-x-2">
                          {c.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleSettleCommission(c.id, 'paid')}
                                className="px-3 py-1 bg-[#5A5A40] hover:bg-[#4a4a35] text-white rounded-full text-[11px] font-bold cursor-pointer transition-all"
                              >
                                {language === 'hi' ? 'कमीशन प्राप्त हुआ' : 'Mark Paid'}
                              </button>
                              <button
                                onClick={() => handleSettleCommission(c.id, 'waived')}
                                className="px-2.5 py-1 bg-[#FAF9F6] text-[#8C8479] hover:bg-[#E8E4DE] rounded-full text-[11px] font-bold cursor-pointer"
                              >
                                {language === 'hi' ? 'छूट' : 'Waive'}
                              </button>
                            </>
                          )}
                          {c.status === 'paid' && (
                            <button
                              onClick={() => setActiveCommissionInvoice(c)}
                              className="px-3 py-1 bg-[#FAF9F6] hover:bg-[#F5F5F0] text-[#5A5A40] border border-[#E8E4DE] rounded-full text-[11px] font-bold cursor-pointer inline-flex items-center gap-1"
                            >
                              <Printer className="w-3 h-3 text-[#D4A373]" />
                              <span>{language === 'hi' ? 'रसीद देखें' : 'Receipt'}</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SUB-TAB: TRANSACTIONS & INVOICES AUDIT LEDGER */}
          {(commissionSubTab === 'overview' || commissionSubTab === 'transactions') && (
            <div className="bg-white rounded-[32px] border border-[#E8E4DE] p-6 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F5F5F0]">
                <div>
                  <h2 className="text-base font-serif font-bold text-[#5A5A40] flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-[#D4A373]" />
                    <span>{language === 'hi' ? 'लेन-देन एवं चालान बहीखाता (Transactions Ledger)' : 'Transactions & Invoices Audit Ledger'}</span>
                  </h2>
                  <p className="text-xs text-[#8C8479] mt-0.5">
                    {language === 'hi'
                      ? 'प्रारंभिक सेवा शुल्क (₹1,000), ४ पैकेज भुगतान एवं कमीशन चालान का संपूर्ण विवरण'
                      : 'All processed payments for ₹1,000 service charges, 4 package subscriptions, and marriage commissions.'}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#E8E4DE] text-xs">
                  <thead className="bg-[#FAF9F6] text-[#5A5A40] font-serif font-bold">
                    <tr>
                      <th className="px-4 py-3 text-left">चालान नं. एवं तिथि</th>
                      <th className="px-4 py-3 text-left">उपयोगकर्ता</th>
                      <th className="px-4 py-3 text-left">मद (Type)</th>
                      <th className="px-4 py-3 text-left">राशि एवं माध्यम</th>
                      <th className="px-4 py-3 text-right">रसीद</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F5F5F0] bg-white text-[#4A453E]">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-[#FAF9F6]">
                        <td className="px-4 py-3">
                          <strong className="font-mono text-xs text-[#5A5A40] block">{tx.invoiceNumber}</strong>
                          <span className="text-[10px] text-[#8C8479]">{tx.transactionDate}</span>
                        </td>
                        <td className="px-4 py-3">
                          <strong className="text-xs text-[#5A5A40] block">{tx.userName}</strong>
                          <span className="text-[10px] text-[#8C8479] font-mono">{tx.userMobile}</span>
                        </td>
                        <td className="px-4 py-3">
                          {tx.type === 'start_service_charge' && (
                            <span className="bg-[#D4A373]/15 text-[#5A5A40] border border-[#D4A373]/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {language === 'hi' ? 'सेवा शुल्क (₹1,000)' : 'Service Charge (₹1,000)'}
                            </span>
                          )}
                          {tx.type === 'marriage_package' && (
                            <span className="bg-[#5A5A40] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {tx.packageName || 'विवाह पैकेज'}
                            </span>
                          )}
                          {tx.type === 'marriage_commission' && (
                            <span className="bg-[#FAF9F6] text-[#D4A373] border border-[#D4A373] text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {language === 'hi' ? 'विवाह कमीशन' : 'Marriage Commission'}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-serif font-bold text-sm text-[#5A5A40]">
                            ₹{tx.amount.toLocaleString('en-IN')}
                          </div>
                          <span className="text-[10px] text-[#8C8479]">{tx.paymentMethod}</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setActiveReceiptTx(tx)}
                            className="px-3 py-1 bg-[#FAF9F6] hover:bg-[#F5F5F0] text-[#5A5A40] border border-[#E8E4DE] rounded-full text-[11px] font-bold cursor-pointer inline-flex items-center gap-1"
                          >
                            <Printer className="w-3 h-3 text-[#D4A373]" />
                            <span>{language === 'hi' ? 'प्रिंट रसीद' : 'Print Receipt'}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: KYC / APPROVALS QUEUE */}
      {/* ========================================================================= */}
      {adminTab === 'approvals' && (
        <div className="bg-white rounded-[32px] border border-[#E8E4DE] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-serif font-bold text-[#5A5A40] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#D4A373]" />
              <span>{language === 'hi' ? 'सत्यापन हेतु लंबित प्रोफाइल्स (KYC Verification Queue)' : 'KYC Verification Queue'}</span>
            </h2>
            <span className="text-xs bg-[#F5F5F0] text-[#5A5A40] border border-[#E8E4DE] px-3 py-1 rounded-full font-bold">
              {pendingApprovals.length} {language === 'hi' ? 'प्रतीक्षारत' : 'Pending'}
            </span>
          </div>

          {pendingApprovals.length === 0 ? (
            <div className="p-8 text-center text-[#8C8479] text-xs">
              <CheckCircle2 className="w-8 h-8 text-[#5A5A40] mx-auto mb-2" />
              <span>{language === 'hi' ? 'सभी प्रोफाइल्स स्वीकृत एवं सत्यापित हैं!' : 'All profiles are verified and active!'}</span>
            </div>
          ) : (
            <div className="divide-y divide-[#F5F5F0]">
              {pendingApprovals.map((profile) => (
                <div key={profile.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={profile.photos[0]}
                      alt={profile.fullName}
                      className="w-14 h-14 rounded-2xl object-cover border border-[#E8E4DE]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="font-serif text-sm text-[#5A5A40]">{profile.fullName}</strong>
                        <span className="text-[10px] bg-[#FAF9F6] text-[#4A453E] border border-[#E8E4DE] px-2 py-0.5 rounded-full">
                          {profile.gender === 'male' ? 'वर' : 'वधू'}
                        </span>
                      </div>
                      <p className="text-xs text-[#8C8479]">
                        {profile.age} वर्ष • {profile.occupation} ({profile.city}) • मोबाइल: {profile.mobile}
                      </p>
                      <p className="text-[11px] text-[#D4A373] mt-0.5">
                        धर्म: {profile.religion} ({profile.caste}) • आय: ₹{profile.annualIncomeLakhs} LPA
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => onOpenDetail(profile)}
                      className="px-3.5 py-1.5 bg-[#FAF9F6] hover:bg-[#F5F5F0] text-[#5A5A40] border border-[#E8E4DE] rounded-full text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'जाँचें' : 'Inspect'}</span>
                    </button>
                    <button
                      onClick={() => onRejectProfile(profile.id, 'अपर्याप्त दस्तावेज़')}
                      className="px-3.5 py-1.5 border border-[#E8E4DE] text-[#8C8479] hover:bg-[#FAF9F6] rounded-full text-xs font-bold cursor-pointer"
                    >
                      {language === 'hi' ? 'अस्वीकार' : 'Reject'}
                    </button>
                    <button
                      onClick={() => onApproveProfile(profile.id)}
                      className="px-4 py-1.5 bg-[#5A5A40] hover:bg-[#4a4a35] text-white rounded-full text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D4A373]" />
                      <span>{language === 'hi' ? 'अनुमोदित करें (Approve)' : 'Approve'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: USER DIRECTORY */}
      {/* ========================================================================= */}
      {adminTab === 'users' && (
        <div className="bg-white rounded-[32px] border border-[#E8E4DE] p-6 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <h2 className="text-base font-serif font-bold text-[#5A5A40]">
              {language === 'hi' ? 'पंजीकृत उपयोगकर्ता डायरेक्टरी' : 'User Database Directory'}
            </h2>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[#8C8479] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder={language === 'hi' ? 'यूज़र या फोन से खोजें...' : 'Search user or phone...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF9F6] border border-[#E8E4DE] rounded-full outline-none text-[#4A453E]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#E8E4DE] text-xs">
              <thead className="bg-[#FAF9F6] text-[#5A5A40] font-serif font-bold">
                <tr>
                  <th className="px-4 py-3 text-left">प्रोफ़ाइल</th>
                  <th className="px-4 py-3 text-left">संपर्क</th>
                  <th className="px-4 py-3 text-left">पेशा एवं आय</th>
                  <th className="px-4 py-3 text-left">सेवा शुल्क / पैकेज</th>
                  <th className="px-4 py-3 text-left">स्थिति</th>
                  <th className="px-4 py-3 text-right">कार्रवाई</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F5F0] bg-white text-[#4A453E]">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#FAF9F6]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <img src={u.photos[0]} alt="" className="w-8 h-8 rounded-full object-cover border border-[#E8E4DE]" />
                        <div>
                          <strong className="text-xs text-[#5A5A40] font-serif">{u.fullName}</strong>
                          <span className="text-[10px] text-[#8C8479] block">{u.city}, {u.state}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px]">{u.mobile}</td>
                    <td className="px-4 py-3 text-[#4A453E]">{u.occupation} (₹{u.annualIncomeLakhs} LPA)</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] bg-[#FAF9F6] text-[#5A5A40] border border-[#E8E4DE] font-semibold px-2 py-0.5 rounded-full block text-center">
                        {u.subscribedPackageId ? packages.find((p) => p.id === u.subscribedPackageId)?.nameHindi || 'पैकेज सक्रिय' : 'प्रारंभिक (₹1,000)'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {u.isVerified ? (
                        <span className="text-[10px] bg-[#F5F5F0] text-[#5A5A40] border border-[#E8E4DE] font-bold px-2 py-0.5 rounded-full">
                          सत्यापित
                        </span>
                      ) : (
                        <span className="text-[10px] bg-[#FAF9F6] text-[#D4A373] border border-[#D4A373]/40 font-bold px-2 py-0.5 rounded-full">
                          समीक्षाधीन
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onToggleUserStatus(u.id)}
                        className="text-xs text-[#5A5A40] hover:text-[#D4A373] font-bold underline cursor-pointer"
                      >
                        {u.isVerified ? 'रोकें' : 'सत्यापित करें'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: GRIEVANCES & REPORTS */}
      {/* ========================================================================= */}
      {adminTab === 'reports' && (
        <div className="bg-white rounded-[32px] border border-[#E8E4DE] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-serif font-bold text-[#5A5A40] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#D4A373]" />
              <span>{language === 'hi' ? 'शिकायत एवं रिपोर्ट निवारण' : 'Grievance & Moderation Queue'}</span>
            </h2>
            <span className="text-xs bg-[#F5F5F0] text-[#5A5A40] border border-[#E8E4DE] px-3 py-1 rounded-full font-bold">
              {pendingReports.length} {language === 'hi' ? 'सक्रिय शिकायतें' : 'Active Reports'}
            </span>
          </div>

          {reports.length === 0 ? (
            <div className="p-8 text-center text-[#8C8479] text-xs">
              {language === 'hi' ? 'कोई सक्रिय शिकायत दर्ज नहीं है।' : 'No active reports or grievances logged.'}
            </div>
          ) : (
            <div className="divide-y divide-[#F5F5F0]">
              {reports.map((r) => {
                const target = profiles.find((p) => p.id === r.reportedUserId);
                return (
                  <div key={r.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
                          {r.reason}
                        </span>
                        <span className="text-xs text-[#4A453E]">
                          रिपोर्टेड प्रोफ़ाइल: <strong className="font-serif text-[#5A5A40]">{target?.fullName || r.reportedUserId}</strong>
                        </span>
                      </div>
                      <p className="text-xs text-[#8C8479] mt-1">{r.details}</p>
                      <span className="text-[10px] text-[#A69F92]">दिनांक: {r.reportedAt} • स्थिति: {r.status}</span>
                    </div>

                    {r.status === 'pending' ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onResolveReport(r.id, 'dismissed')}
                          className="px-3.5 py-1.5 border border-[#E8E4DE] text-[#8C8479] hover:bg-[#FAF9F6] rounded-full text-xs font-bold cursor-pointer"
                        >
                          {language === 'hi' ? 'खारिज करें' : 'Dismiss'}
                        </button>
                        <button
                          onClick={() => onResolveReport(r.id, 'action_taken')}
                          className="px-4 py-1.5 bg-[#5A5A40] hover:bg-[#4a4a35] text-white rounded-full text-xs font-bold shadow-xs cursor-pointer"
                        >
                          {language === 'hi' ? 'चेतावनी / ब्लॉक' : 'Take Action'}
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-[#5A5A40]">✓ हल किया गया</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* RECEIPT / INVOICE PREVIEW MODAL */}
      {/* ========================================================================= */}
      {activeReceiptTx && (
        <div
          id="receipt-modal-backdrop"
          className="fixed inset-0 z-70 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveReceiptTx(null)}
        >
          <div
            id="receipt-card"
            className="bg-white rounded-[32px] max-w-md w-full border border-[#E8E4DE] shadow-2xl p-6 sm:p-7 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center pb-4 border-b border-[#E8E4DE]">
              <div className="inline-flex items-center gap-1.5 bg-[#D4A373] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                <span>स्मार्ट विवाह अधिकृत जीएसटी रसीद</span>
              </div>
              <h3 className="font-serif font-bold text-xl text-[#5A5A40]">SMART VIVAH MATRIMONY</h3>
              <p className="text-[10px] text-[#8C8479]">Official Tax Invoice & Receipt • GSTIN: 07AAACS1234F1Z5</p>
            </div>

            <div className="bg-[#FAF9F6] border border-[#E8E4DE] rounded-2xl p-4 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#8C8479]">रसीद संख्या (Invoice No):</span>
                <strong className="font-mono text-[#5A5A40]">{activeReceiptTx.invoiceNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C8479]">दिनांक (Date):</span>
                <span className="text-[#5A5A40]">{activeReceiptTx.transactionDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C8479]">उपयोगकर्ता नाम (Client):</span>
                <strong className="text-[#5A5A40]">{activeReceiptTx.userName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C8479]">मोबाइल (Mobile):</span>
                <span className="font-mono text-[#5A5A40]">{activeReceiptTx.userMobile}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#E8E4DE]">
                <span className="text-[#8C8479]">सेवा का प्रकार (Description):</span>
                <strong className="text-[#5A5A40] text-right">
                  {activeReceiptTx.packageName || (activeReceiptTx.type === 'start_service_charge' ? 'प्रारंभिक सेवा शुल्क (₹1,000)' : 'विवाह कमीशन')}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C8479]">भुगतान माध्यम (Mode):</span>
                <span className="text-[#5A5A40]">{activeReceiptTx.paymentMethod}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#E8E4DE] text-sm">
                <strong className="text-[#5A5A40] font-serif">कुल प्राप्त राशि (Total Paid):</strong>
                <strong className="text-[#5A5A40] font-serif text-base">₹{activeReceiptTx.amount.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2.5 bg-[#5A5A40] hover:bg-[#4a4a35] text-white rounded-full text-xs font-bold shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-[#D4A373]" />
                <span>प्रिंट / PDF सेव करें</span>
              </button>
              <button
                onClick={() => setActiveReceiptTx(null)}
                className="px-5 py-2.5 bg-[#FAF9F6] text-[#5A5A40] border border-[#E8E4DE] rounded-full text-xs font-bold cursor-pointer"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMMISSION INVOICE MODAL */}
      {activeCommissionInvoice && (
        <div
          id="commission-invoice-backdrop"
          className="fixed inset-0 z-70 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveCommissionInvoice(null)}
        >
          <div
            id="commission-invoice-card"
            className="bg-white rounded-[32px] max-w-md w-full border border-[#E8E4DE] shadow-2xl p-6 sm:p-7 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center pb-4 border-b border-[#E8E4DE]">
              <div className="inline-flex items-center gap-1.5 bg-[#5A5A40] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                <span>विवाह संपन्न कमीशन रसीद</span>
              </div>
              <h3 className="font-serif font-bold text-xl text-[#5A5A40]">SMART VIVAH MARRIAGE SETTLEMENT</h3>
              <p className="text-[10px] text-[#8C8479]">Official Commission Certificate & Settlement Voucher</p>
            </div>

            <div className="bg-[#FAF9F6] border border-[#E8E4DE] rounded-2xl p-4 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#8C8479]">रसीद संख्या:</span>
                <strong className="font-mono text-[#5A5A40]">{activeCommissionInvoice.receiptNumber || 'REC-VIVAH-2026'}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C8479]">वर (Groom):</span>
                <strong className="text-[#5A5A40]">{activeCommissionInvoice.groomName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C8479]">वधू (Bride):</span>
                <strong className="text-[#5A5A40]">{activeCommissionInvoice.brideName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C8479]">पैकेज श्रेणी (Tier):</span>
                <span className="text-[#5A5A40] font-semibold">{activeCommissionInvoice.packageTier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C8479]">विवाह तिथि:</span>
                <span className="text-[#5A5A40]">{activeCommissionInvoice.weddingDate}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#E8E4DE] text-sm">
                <strong className="text-[#5A5A40] font-serif">कमीशन राशि (Settled Amount):</strong>
                <strong className="text-[#D4A373] font-serif text-base">₹{activeCommissionInvoice.commissionAmount.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-[#5A5A40] hover:bg-[#4a4a35] text-white rounded-full text-xs font-bold shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-[#D4A373]" />
                <span>प्रिंट वाउचर</span>
              </button>
              <button
                onClick={() => setActiveCommissionInvoice(null)}
                className="px-5 py-2.5 bg-[#FAF9F6] text-[#5A5A40] border border-[#E8E4DE] rounded-full text-xs font-bold cursor-pointer"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
