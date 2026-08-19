import React, { useState } from 'react';
import { X, SlidersHorizontal, Check } from 'lucide-react';
import { PartnerPreferences, UserProfile } from '../types';
import { HINDU_CASTES, MUSLIM_CASTES } from '../data/castes';

interface PartnerPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSave: (preferences: PartnerPreferences) => void;
  language: 'hi' | 'en';
}

export const PartnerPreferencesModal: React.FC<PartnerPreferencesModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSave,
  language
}) => {
  const [pref, setPref] = useState<PartnerPreferences>(currentUser.preferences);
  const [cityInput, setCityInput] = useState('');

  if (!isOpen) return null;

  const handleAddCity = () => {
    if (cityInput.trim() && !pref.locations.includes(cityInput.trim())) {
      setPref((prev) => ({
        ...prev,
        locations: [...prev.locations, cityInput.trim()]
      }));
      setCityInput('');
    }
  };

  const handleRemoveCity = (city: string) => {
    setPref((prev) => ({
      ...prev,
      locations: prev.locations.filter((c) => c !== city)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(pref);
    onClose();
  };

  return (
    <div id="partner-preferences-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-[32px] shadow-2xl max-w-lg w-full overflow-hidden border border-[#E8E4DE]">
        {/* Header in Natural Tones */}
        <div className="bg-[#5A5A40] p-6 text-white text-center relative border-b border-[#4A453E]/40">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-10 h-10 bg-[#D4A373] text-white rounded-full flex items-center justify-center mx-auto mb-2 text-xl font-serif italic shadow-xs">
            M
          </div>
          <h2 className="text-xl font-serif font-bold">
            {language === 'hi' ? 'चरण ४: साथी की पसंद एवं प्राथमिकताएं' : 'Step 4: Partner Preferences'}
          </h2>
          <p className="text-xs text-[#E8E4DE] mt-0.5">
            {language === 'hi' ? 'इसके आधार पर आपको सर्वोत्तम सुयोग्य रिश्ते दिखाए जाएंगे।' : 'Discover profiles matching your cultural & financial criteria.'}
          </p>
        </div>

        {/* Form Body in Natural Tones */}
        <form onSubmit={handleSubmit} className="p-6 bg-[#FAF9F6] space-y-4 text-xs">
          {/* Religion Preference */}
          <div>
            <label className="block font-bold text-[#5A5A40] mb-1">
              {language === 'hi' ? 'धर्म वरीयता (Religion Preference)' : 'Preferred Religion'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Hindu', 'Muslim'].map((rel) => {
                const isSelected = pref.religions?.includes(rel);
                return (
                  <button
                    key={rel}
                    type="button"
                    onClick={() => {
                      const current = pref.religions || [];
                      const updated = isSelected
                        ? current.filter((r) => r !== rel)
                        : [...current, rel];
                      setPref({ ...pref, religions: updated.length ? updated : [rel] });
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#5A5A40] text-white border-[#5A5A40]'
                        : 'bg-white text-[#4A453E] border-[#E8E4DE]'
                    }`}
                  >
                    <span>{rel === 'Hindu' ? (language === 'hi' ? 'हिन्दू (Hindu)' : 'Hindu') : (language === 'hi' ? 'मुस्लिम (Muslim)' : 'Muslim')}</span>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Caste Preferences */}
          <div>
            <label className="block font-bold text-[#5A5A40] mb-1">
              {language === 'hi' ? 'जाति / बिरादरी वरीयता (Preferred Castes)' : 'Preferred Castes / Communities'}
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-white rounded-xl border border-[#E8E4DE]">
              <button
                type="button"
                onClick={() => setPref({ ...pref, castes: ['Any'] })}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  pref.castes?.includes('Any') || !pref.castes?.length
                    ? 'bg-[#5A5A40] text-white'
                    : 'bg-[#FAF9F6] text-[#4A453E] border border-[#E8E4DE]'
                }`}
              >
                {language === 'hi' ? '✨ सभी जातियाँ स्वीकार (Caste No Bar / Any)' : '✨ Any / Caste No Bar'}
              </button>

              {(pref.religions?.includes('Muslim') ? MUSLIM_CASTES : HINDU_CASTES).map((c) => {
                const isCasteSelected = pref.castes?.includes(c.nameEn) || pref.castes?.includes(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      const current = (pref.castes || []).filter((x) => x !== 'Any');
                      const updated = isCasteSelected
                        ? current.filter((x) => x !== c.nameEn && x !== c.id)
                        : [...current, c.nameEn];
                      setPref({ ...pref, castes: updated.length ? updated : ['Any'] });
                    }}
                    className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                      isCasteSelected
                        ? 'bg-[#D4A373] text-white font-bold'
                        : 'bg-[#FAF9F6] text-[#4A453E] border border-[#E8E4DE] hover:border-[#D4A373]'
                    }`}
                  >
                    {language === 'hi' ? c.nameHi.split(' (')[0] : c.nameEn}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Age Range Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-[#5A5A40]">
                {language === 'hi' ? 'अपेक्षित आयु सीमा' : 'Age Range'}
              </label>
              <span className="font-serif font-bold text-[#D4A373] text-sm">
                {pref.minAge} - {pref.maxAge} {language === 'hi' ? 'वर्ष' : 'yrs'}
              </span>
            </div>
            <div className="flex gap-3">
              <input
                type="range"
                min={18}
                max={40}
                value={pref.minAge}
                onChange={(e) => setPref({ ...pref, minAge: Number(e.target.value) })}
                className="w-1/2 accent-[#5A5A40]"
              />
              <input
                type="range"
                min={20}
                max={50}
                value={pref.maxAge}
                onChange={(e) => setPref({ ...pref, maxAge: Number(e.target.value) })}
                className="w-1/2 accent-[#5A5A40]"
              />
            </div>
          </div>

          {/* Min Income */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-[#5A5A40]">
                {language === 'hi' ? 'न्यूनतम वार्षिक आय (LPA)' : 'Min Annual Income'}
              </label>
              <span className="font-serif font-bold text-[#D4A373] text-sm">₹{pref.minIncomeLakhs} LPA+</span>
            </div>
            <input
              type="range"
              min={3}
              max={60}
              step={1}
              value={pref.minIncomeLakhs}
              onChange={(e) => setPref({ ...pref, minIncomeLakhs: Number(e.target.value) })}
              className="w-full accent-[#5A5A40]"
            />
          </div>

          {/* Manglik Filter */}
          <div>
            <label className="block font-bold text-[#5A5A40] mb-1">
              {language === 'hi' ? 'मांगलिक वरीयता' : 'Manglik Preference'}
            </label>
            <select
              value={pref.manglikPreference}
              onChange={(e) => setPref({ ...pref, manglikPreference: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-[#E8E4DE] rounded-xl outline-none text-[#4A453E]"
            >
              <option value="Non-Manglik Only">केवल गैर-मांगलिक (Non-Manglik Only)</option>
              <option value="Manglik Only">केवल मांगलिक (Manglik Only)</option>
              <option value="Doesn't Matter">मांगलिक का बंधन नहीं (Doesn&apos;t Matter)</option>
            </select>
          </div>

          {/* Locations */}
          <div>
            <label className="block font-bold text-[#5A5A40] mb-1">
              {language === 'hi' ? 'पसंदीदा शहर / राज्य' : 'Preferred Cities'}
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder={language === 'hi' ? 'उदा. दिल्ली, मुंबई, जयपुर...' : 'e.g. Delhi, Pune, Bengaluru...'}
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-[#E8E4DE] rounded-xl outline-none"
              />
              <button
                type="button"
                onClick={handleAddCity}
                className="px-4 py-2 bg-[#5A5A40] text-white rounded-xl font-bold hover:bg-[#4a4a35] cursor-pointer"
              >
                + जोड़ें
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {pref.locations.map((loc) => (
                <span
                  key={loc}
                  className="px-3 py-1 bg-white border border-[#E8E4DE] text-[#4A453E] rounded-full text-xs flex items-center gap-1.5 shadow-2xs"
                >
                  <span>{loc}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCity(loc)}
                    className="text-[#8C8479] hover:text-red-700 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-[#E8E4DE] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-white border border-[#E8E4DE] text-[#5A5A40] font-bold rounded-full cursor-pointer"
            >
              {language === 'hi' ? 'रद्द करें' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#D4A373] hover:bg-[#c49262] text-white font-bold rounded-full shadow-xs cursor-pointer"
            >
              {language === 'hi' ? 'प्राथमिकताएं सहेजें' : 'Save Preferences'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
