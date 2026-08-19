import React, { useState } from 'react';
import { ShieldCheck, Heart, Sparkles, MapPin, Briefcase, GraduationCap, Bookmark, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { UserProfile } from '../types';
import { calculateKundaliMilan } from '../utils/kundali';

interface ProfileCardProps {
  profile: UserProfile;
  currentUser: UserProfile;
  onSendInterest: (targetId: string) => void;
  onOpenDetail: (profile: UserProfile) => void;
  onOpenKundali: (profile: UserProfile) => void;
  onToggleShortlist: (targetId: string) => void;
  isShortlisted: boolean;
  interestStatus?: 'pending' | 'accepted' | 'declined' | 'none';
  language: 'hi' | 'en';
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  currentUser,
  onSendInterest,
  onOpenDetail,
  onOpenKundali,
  onToggleShortlist,
  isShortlisted,
  interestStatus = 'none',
  language
}) => {
  const [photoIndex, setPhotoIndex] = useState(0);
  const kundali = calculateKundaliMilan(currentUser, profile);

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (profile.photos.length > 1) {
      setPhotoIndex((prev) => (prev + 1) % profile.photos.length);
    }
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (profile.photos.length > 1) {
      setPhotoIndex((prev) => (prev - 1 + profile.photos.length) % profile.photos.length);
    }
  };

  return (
    <div
      id={`profile-card-${profile.id}`}
      className="bg-white rounded-[32px] overflow-hidden border border-[#E8E4DE] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group"
    >
      {/* Top Image Container with Natural Tones Framing */}
      <div className="h-64 relative overflow-hidden cursor-pointer bg-[#FAF9F6]" onClick={() => onOpenDetail(profile)}>
        <img
          src={profile.photos[photoIndex] || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800'}
          alt={profile.fullName}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />

        {/* Ambient Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5">
            {profile.isVerified && (
              <span className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#5A5A40] flex items-center gap-1 shadow-xs border border-[#E8E4DE]/60">
                <ShieldCheck className="w-3 h-3 text-[#5A5A40]" />
                {language === 'hi' ? 'सत्यापित' : 'Verified'}
              </span>
            )}
            {profile.isGovtJob && (
              <span className="bg-[#D4A373] text-white px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs">
                {language === 'hi' ? 'सरकारी सेवा' : 'Govt Job'}
              </span>
            )}
          </div>

          {/* Shortlist Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleShortlist(profile.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${
              isShortlisted
                ? 'bg-[#D4A373] text-white shadow-xs'
                : 'bg-black/30 text-white hover:bg-black/50'
            }`}
            title={language === 'hi' ? 'शॉर्टलिस्ट करें' : 'Shortlist'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isShortlisted ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Photo navigation buttons if multiple photos */}
        {profile.photos.length > 1 && (
          <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button
              onClick={prevPhoto}
              className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextPhoto}
              className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Kundali Guna Chip floating over image bottom */}
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white z-10">
          <div>
            <span className="text-[11px] text-[#E8E4DE] font-medium block">
              {profile.age} {language === 'hi' ? 'वर्ष' : 'yrs'} • {profile.heightFeet}&apos;{profile.heightInches}&quot; • {profile.city}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenKundali(profile);
            }}
            className="bg-[#5A5A40]/90 hover:bg-[#5A5A40] text-white px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur flex items-center gap-1 shadow-xs border border-white/20 transition-all cursor-pointer shrink-0"
            title={language === 'hi' ? 'अष्टकूट कुंडली मिलान' : 'Kundali Milan'}
          >
            <Sparkles className="w-3 h-3 text-[#D4A373]" />
            <span>{kundali.totalPoints}/३६ {language === 'hi' ? 'गुण' : 'Guna'}</span>
          </button>
        </div>
      </div>

      {/* Card Info Body in Natural Tones Typography */}
      <div className="p-5 flex-1 flex flex-col justify-between cursor-pointer" onClick={() => onOpenDetail(profile)}>
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="text-lg font-serif font-bold text-[#5A5A40] leading-snug">
                {profile.fullName}
              </h4>
              <p className="text-xs text-[#8C8479] font-medium italic">
                {profile.occupation} • {profile.city}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleShortlist(profile.id);
              }}
              className="text-[#D4A373] hover:text-[#c49262] p-1"
            >
              <Heart className={`w-5 h-5 ${isShortlisted ? 'fill-[#D4A373]' : ''}`} />
            </button>
          </div>

          {/* Quick Specifications */}
          <div className="flex flex-wrap gap-1.5 my-2.5">
            <span className="px-2.5 py-0.5 bg-[#FAF9F6] border border-[#E8E4DE] text-[#4A453E] rounded-full text-[11px] font-medium">
              {profile.highestEducation}
            </span>
            <span className="px-2.5 py-0.5 bg-[#FAF9F6] border border-[#E8E4DE] text-[#5A5A40] rounded-full text-[11px] font-bold">
              ₹{profile.annualIncomeLakhs} {language === 'hi' ? 'लाख/वर्ष' : 'LPA'}
            </span>
            <span className="px-2.5 py-0.5 bg-[#FAF9F6] border border-[#E8E4DE] text-[#8C8479] rounded-full text-[11px]">
              {profile.religion} ({profile.caste})
            </span>
          </div>

          {/* Short Bio Snippet */}
          <p className="text-xs text-[#4A453E] line-clamp-2 mb-3 leading-relaxed">
            &quot;{profile.bio}&quot;
          </p>
        </div>

        {/* Astro details pill bar */}
        <div className="flex items-center justify-between text-[10px] text-[#8C8479] pt-2 border-t border-[#F5F5F0] mb-3">
          <span>
            {language === 'hi' ? 'राशि:' : 'Rashi:'} <strong className="text-[#4A453E]">{profile.kundali.rashi.split(' ')[0]}</strong>
          </span>
          <span>
            {language === 'hi' ? 'मांगलिक:' : 'Manglik:'} <strong className="text-[#5A5A40]">{profile.kundali.manglik}</strong>
          </span>
          <span>
            {language === 'hi' ? 'गोत्र:' : 'Gotra:'} <strong className="text-[#4A453E]">{profile.kundali.gotra || 'कश्यप'}</strong>
          </span>
        </div>

        {/* Action Buttons in Natural Tones styling */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail(profile);
            }}
            className="px-3 py-2.5 bg-[#FAF9F6] hover:bg-[#F5F5F0] text-[#5A5A40] border border-[#E8E4DE] rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#8C8479]" />
            <span>{language === 'hi' ? 'बायोडाटा' : 'Biodata'}</span>
          </button>

          {interestStatus === 'accepted' ? (
            <button
              disabled
              className="flex-1 py-2.5 bg-[#FAF9F6] text-[#5A5A40] border border-[#5A5A40]/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1"
            >
              <span>✓ {language === 'hi' ? 'स्वीकृत' : 'Connected'}</span>
            </button>
          ) : interestStatus === 'pending' ? (
            <button
              disabled
              className="flex-1 py-2.5 bg-[#FAF9F6] text-[#D4A373] border border-[#D4A373]/40 rounded-xl text-xs font-bold flex items-center justify-center gap-1"
            >
              <span>⏳ {language === 'hi' ? 'भेजा गया' : 'Pending'}</span>
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSendInterest(profile.id);
              }}
              className="flex-1 py-2.5 bg-[#D4A373] hover:bg-[#c49262] text-white rounded-xl text-xs font-bold shadow-md shadow-[#D4A373]/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>{language === 'hi' ? 'इंटरेस्ट भेजें' : 'Send Interest'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
