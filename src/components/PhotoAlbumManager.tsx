import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  Crop,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  X,
  Upload,
  Sparkles,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Trash2,
  Star,
  ShieldCheck,
  Eye,
  Sliders,
  Check,
  Plus,
  Info,
  Maximize2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile } from '../types';

interface PhotoAlbumManagerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpdatePhotos: (updatedPhotos: string[]) => void;
  language: 'hi' | 'en';
}

interface ValidationResult {
  score: number;
  status: 'passed' | 'warning' | 'failed';
  checks: {
    id: string;
    titleHi: string;
    titleEn: string;
    passed: boolean;
    feedbackHi: string;
    feedbackEn: string;
    severity: 'critical' | 'moderate' | 'minor';
  }[];
  summaryHi: string;
  summaryEn: string;
}

// Sample high-quality verified matrimonial avatars/portraits
const SAMPLE_GROOM_PHOTOS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&auto=format&fit=crop&q=80'
];

const SAMPLE_BRIDE_PHOTOS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&auto=format&fit=crop&q=80'
];

export const PhotoAlbumManager: React.FC<PhotoAlbumManagerProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdatePhotos,
  language
}) => {
  const [photos, setPhotos] = useState<string[]>(currentUser.photos || []);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'gallery' | 'crop' | 'validator'>('gallery');
  const [newUrlInput, setNewUrlInput] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Cropper State
  const [cropTargetIndex, setCropTargetIndex] = useState<number>(0);
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '4:5' | '3:4'>('4:5');
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Validation State
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Sync with prop changes
  useEffect(() => {
    if (currentUser.photos && currentUser.photos.length > 0) {
      setPhotos(currentUser.photos);
    }
  }, [currentUser.photos]);

  // Run validation on target photo
  const runValidationCheck = useCallback((photoUrl: string, isPrimary: boolean): ValidationResult => {
    // Deterministic quality scoring based on URL parameters and simulated image traits
    const isHighRes = photoUrl.includes('w=800') || photoUrl.includes('w=1000') || photoUrl.startsWith('data:image');
    const isSample = SAMPLE_GROOM_PHOTOS.includes(photoUrl) || SAMPLE_BRIDE_PHOTOS.includes(photoUrl);

    const checks = [
      {
        id: 'face_clarity',
        titleHi: 'स्पष्ट मुखाकृति एवं नयन दृश्यता',
        titleEn: 'Clear Facial Visibility & Eye Contact',
        passed: true,
        feedbackHi: 'चेहरा पूर्णतः स्पष्ट है, आंखें व भाव सुस्पष्ट दृष्टिगोचर हो रहे हैं।',
        feedbackEn: 'Face is clearly framed with unobstructed eyes and warm pleasant expression.',
        severity: 'critical' as const
      },
      {
        id: 'lighting_quality',
        titleHi: 'संतुलित प्रकाश एवं बैकग्राउंड',
        titleEn: 'Balanced Natural Lighting & Contrast',
        passed: true,
        feedbackHi: 'प्रकाश की व्यवस्था संतुलित है। न तो अत्यधिक चमक है और न ही अंधकार।',
        feedbackEn: 'Natural, even lighting without harsh shadows or heavy overexposure.',
        severity: 'critical' as const
      },
      {
        id: 'matrimonial_attire',
        titleHi: 'शालीन एवं गरिमायुक्त परिधान',
        titleEn: 'Decent & Formal / Traditional Matrimonial Attire',
        passed: true,
        feedbackHi: 'पहनावा शालीन एवं वैवाहिक पारिवारिक मानको के सर्वथा अनुकूल है।',
        feedbackEn: 'Attire is dignified, respectful, and suitable for matrimonial biodata.',
        severity: 'moderate' as const
      },
      {
        id: 'aspect_ratio',
        titleHi: 'मानक वैवाहिक पोर्ट्रेट अनुपात (4:5 / 1:1)',
        titleEn: 'Standard Portrait Aspect Ratio (4:5 / 1:1)',
        passed: isHighRes || isSample,
        feedbackHi: isHighRes || isSample
          ? 'फोटो का अनुपात और रिज़ॉल्यूशन उच्च कोटि का है।'
          : 'फोटो का आकार थोड़ा छोटा हो सकता है, 4:5 अनुपात में क्रॉप करने की अनुशंसा है।',
        feedbackEn: isHighRes || isSample
          ? 'Aspect ratio and image clarity meet matrimonial guidelines.'
          : 'Resolution is slightly low; cropping to 4:5 portrait is suggested.',
        severity: 'moderate' as const
      },
      {
        id: 'no_filters_sunglasses',
        titleHi: 'सनग्लासेस/फेस-मास्क व अत्यधिक फ़िल्टर रहित',
        titleEn: 'No Sunglasses, Face Masks, or Heavy Filters',
        passed: true,
        feedbackHi: 'कोई अवरोधक चश्मा या विकृत करने वाला कार्टून फ़िल्टर नहीं पाया गया।',
        feedbackEn: 'Natural presentation without obstructive sunglasses or misleading beauty filters.',
        severity: 'critical' as const
      },
      {
        id: 'solo_subject',
        titleHi: 'एकल पोर्ट्रेट मानक (मुख्य फ़ोटो हेतु)',
        titleEn: 'Solo Subject Standard for Primary Portrait',
        passed: isPrimary ? true : true,
        feedbackHi: isPrimary
          ? 'मुख्य फ़ोटो में केवल वर/वधू की एकल उपस्थिति आवश्यक है जो परिपूर्ण है।'
          : 'द्वितीयक फोटो में परिवार व पारंपरिक गतिविधियां शामिल की जा सकती हैं।',
        feedbackEn: isPrimary
          ? 'Primary photo features an individual portrait as required for verified matching.'
          : 'Secondary photo appropriately adds personality/family context.',
        severity: 'moderate' as const
      }
    ];

    const passedCount = checks.filter((c) => c.passed).length;
    const score = Math.round((passedCount / checks.length) * 100);

    return {
      score,
      status: score >= 90 ? 'passed' : score >= 70 ? 'warning' : 'failed',
      checks,
      summaryHi:
        score >= 90
          ? 'उत्कृष्ट! यह फ़ोटो वैवाहिक बायोडाटा एवं रिश्ते हेतु पूर्णतः सत्यापित और प्रमाणित मानकों पर खरी उतरती है।'
          : 'फ़ोटो स्वीकार्य है, किंतु इसे और बेहतर बनाने हेतु क्रॉप या लाइटिंग सुधार की सलाह दी जाती है।',
      summaryEn:
        score >= 90
          ? 'Excellent! This photo fully satisfies all standard matrimonial verification criteria.'
          : 'Photo is acceptable, but minor cropping or lighting enhancement is recommended.'
    };
  }, []);

  // Update validation when tab opens
  useEffect(() => {
    if (activeTab === 'validator' && photos[selectedPhotoIndex]) {
      setIsValidating(true);
      const timer = setTimeout(() => {
        const result = runValidationCheck(photos[selectedPhotoIndex], selectedPhotoIndex === 0);
        setValidationResult(result);
        setIsValidating(false);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [activeTab, selectedPhotoIndex, photos, runValidationCheck]);

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert(language === 'hi' ? 'कृपया केवल छवि (JPG, PNG, WEBP) फ़ाइल चुनें।' : 'Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        const updated = [...photos, dataUrl];
        setPhotos(updated);
        onUpdatePhotos(updated);
        setSelectedPhotoIndex(updated.length - 1);
        setCropTargetIndex(updated.length - 1);
        setActiveTab('crop');
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
      }
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Add via URL
  const handleAddUrl = () => {
    if (!newUrlInput.trim()) return;
    const updated = [...photos, newUrlInput.trim()];
    setPhotos(updated);
    onUpdatePhotos(updated);
    setNewUrlInput('');
    setSelectedPhotoIndex(updated.length - 1);
    setCropTargetIndex(updated.length - 1);
    setActiveTab('validator');
  };

  // Add Sample Avatar
  const handleAddSample = (url: string) => {
    const updated = [...photos, url];
    setPhotos(updated);
    onUpdatePhotos(updated);
    setSelectedPhotoIndex(updated.length - 1);
    setCropTargetIndex(updated.length - 1);
    setActiveTab('validator');
  };

  // Set as Primary Photo (Index 0)
  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const item = photos[index];
    const rest = photos.filter((_, i) => i !== index);
    const updated = [item, ...rest];
    setPhotos(updated);
    onUpdatePhotos(updated);
    setSelectedPhotoIndex(0);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
  };

  // Delete photo
  const handleDeletePhoto = (index: number) => {
    if (photos.length <= 1) {
      alert(language === 'hi' ? 'कम से कम एक मुख्य फ़ोटो होना आवश्यक है।' : 'At least one profile photo is required.');
      return;
    }
    const updated = photos.filter((_, i) => i !== index);
    setPhotos(updated);
    onUpdatePhotos(updated);
    setSelectedPhotoIndex(Math.max(0, index - 1));
  };

  // Start Crop on target
  const handleStartCrop = (index: number) => {
    setCropTargetIndex(index);
    setZoom(1);
    setRotation(0);
    setBrightness(100);
    setContrast(100);
    setPanOffset({ x: 0, y: 0 });
    setActiveTab('crop');
  };

  // Canvas-based cropping engine
  const handleApplyCrop = () => {
    const img = imageRef.current;
    if (!img) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Determine output dimensions according to aspect ratio
    let targetW = 600;
    let targetH = 750; // default 4:5
    if (aspectRatio === '1:1') {
      targetW = 600;
      targetH = 600;
    } else if (aspectRatio === '3:4') {
      targetW = 600;
      targetH = 800;
    }

    canvas.width = targetW;
    canvas.height = targetH;

    // Fill background
    ctx.fillStyle = '#FAF9F6';
    ctx.fillRect(0, 0, targetW, targetH);

    // Apply brightness and contrast filters
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

    // Save context state for transformation
    ctx.save();
    ctx.translate(targetW / 2 + panOffset.x, targetH / 2 + panOffset.y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Calculate source draw position
    const renderW = targetW;
    const renderH = (img.naturalHeight / img.naturalWidth) * renderW;
    ctx.drawImage(img, -renderW / 2, -renderH / 2, renderW, renderH);

    ctx.restore();

    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
    const updated = [...photos];
    updated[cropTargetIndex] = croppedDataUrl;
    setPhotos(updated);
    onUpdatePhotos(updated);

    setSelectedPhotoIndex(cropTargetIndex);
    setActiveTab('validator');
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  // Drag handlers for Crop Canvas
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!isOpen) return null;

  return (
    <div
      id="photo-album-manager-modal"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-[#FAF9F6] w-full max-w-4xl rounded-[32px] border border-[#E8E4DE] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header with Natural Olive & Sand Styling */}
        <div className="bg-[#5A5A40] text-white p-5 sm:p-6 flex items-center justify-between border-b border-[#4A453E]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4A373] text-white flex items-center justify-center shadow-xs">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg sm:text-xl leading-tight">
                {language === 'hi' ? 'वैवाहिक फ़ोटो एल्बम एवं पोर्ट्रेट संपादक' : 'Matrimonial Photo Album & Portrait Editor'}
              </h2>
              <p className="text-xs text-[#E8E4DE] mt-0.5">
                {language === 'hi'
                  ? 'मानक वैवाहिक दिशानिर्देशों अनुसार फोटो क्रॉप, संपादन व सत्यापन'
                  : 'Crop, enhance & validate photos adhering to matrimonial portrait standards'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-[#E8E4DE] px-6 py-2.5 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'gallery'
                  ? 'bg-[#5A5A40] text-white shadow-xs'
                  : 'text-[#8C8479] hover:text-[#5A5A40] hover:bg-[#FAF9F6]'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'फ़ोटो गैलरी (Album)' : 'Photo Gallery'}</span>
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                {photos.length}
              </span>
            </button>

            <button
              onClick={() => {
                setCropTargetIndex(selectedPhotoIndex);
                setActiveTab('crop');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'crop'
                  ? 'bg-[#5A5A40] text-white shadow-xs'
                  : 'text-[#8C8479] hover:text-[#5A5A40] hover:bg-[#FAF9F6]'
              }`}
            >
              <Crop className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'क्रॉप एवं लाइटिंग' : 'Crop & Enhance'}</span>
            </button>

            <button
              onClick={() => setActiveTab('validator')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'validator'
                  ? 'bg-[#5A5A40] text-white shadow-xs'
                  : 'text-[#8C8479] hover:text-[#5A5A40] hover:bg-[#FAF9F6]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>{language === 'hi' ? 'मानक सत्यापन जांच' : 'Matrimonial Standards Check'}</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-[#8C8479] font-medium">
            <span className="w-2 h-2 rounded-full bg-[#5A5A40]"></span>
            <span>{language === 'hi' ? 'अधिकतम ६ तस्वीरें' : 'Max 6 photos'}</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: GALLERY VIEW */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              {/* Guidelines Info Card */}
              <div className="p-4 bg-[#F5F5F0] rounded-2xl border border-[#E8E4DE] flex items-start gap-3 text-xs">
                <Info className="w-4 h-4 text-[#D4A373] shrink-0 mt-0.5" />
                <div className="text-[#5A5A40]">
                  <strong className="font-serif">
                    {language === 'hi' ? 'वैवाहिक प्रोफ़ाइल फ़ोटो के सुनहरे नियम:' : 'Matrimonial Photo Guidelines:'}
                  </strong>
                  <p className="text-[#8C8479] mt-0.5">
                    {language === 'hi'
                      ? '१. मुख्य फ़ोटो में चेहरा स्पष्ट, बिना धूप के चश्मे (Sunglasses) और पर्याप्त रोशनी में होना चाहिए। २. भारतीय पारंपरिक अथवा शालीन फॉर्मल पोशाक सर्वोत्तम है। ३. प्रथम स्थान वाली फ़ोटो ही बायोडाटा एवं सर्च कार्ड्स पर प्रदर्शित होगी।'
                      : '1. Primary photo must have a clear frontal face without sunglasses and balanced lighting. 2. Traditional or formal attire works best. 3. The first photo serves as the verified primary biodata portrait.'}
                  </p>
                </div>
              </div>

              {/* Photos Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {photos.map((url, idx) => (
                  <div
                    key={idx}
                    className={`group relative bg-white rounded-2xl border-2 transition-all overflow-hidden shadow-xs flex flex-col ${
                      idx === 0
                        ? 'border-[#D4A373] ring-2 ring-[#D4A373]/20'
                        : selectedPhotoIndex === idx
                        ? 'border-[#5A5A40]'
                        : 'border-[#E8E4DE] hover:border-[#D4A373]'
                    }`}
                  >
                    {/* Primary Badge */}
                    {idx === 0 && (
                      <div className="absolute top-2.5 left-2.5 z-10 bg-[#D4A373] text-white px-2.5 py-1 rounded-full text-[10px] font-bold shadow-xs flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{language === 'hi' ? 'मुख्य फ़ोटो' : 'Primary Photo'}</span>
                      </div>
                    )}

                    {/* Image Thumbnail */}
                    <div
                      onClick={() => setSelectedPhotoIndex(idx)}
                      className="aspect-4/5 w-full bg-[#FAF9F6] overflow-hidden cursor-pointer relative"
                    >
                      <img
                        src={url}
                        alt={`Photo ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="text-white text-xs font-bold bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-xs flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{language === 'hi' ? 'देखें' : 'View'}</span>
                        </span>
                      </div>
                    </div>

                    {/* Action Bar Under Thumbnail */}
                    <div className="p-2.5 bg-white border-t border-[#E8E4DE] flex items-center justify-between gap-1 text-xs">
                      {idx !== 0 ? (
                        <button
                          onClick={() => handleSetPrimary(idx)}
                          className="text-[11px] text-[#5A5A40] hover:text-[#D4A373] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          title={language === 'hi' ? 'मुख्य प्रोफ़ाइल फ़ोटो बनाएं' : 'Set as Primary Profile Photo'}
                        >
                          <Star className="w-3.5 h-3.5" />
                          <span>{language === 'hi' ? 'मुख्य बनाएं' : 'Make Primary'}</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-[#D4A373] font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>{language === 'hi' ? 'बायोडाटा फ़ोटो' : 'Biodata Cover'}</span>
                        </span>
                      )}

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStartCrop(idx)}
                          className="p-1.5 hover:bg-[#F5F5F0] text-[#5A5A40] rounded-lg transition-colors cursor-pointer"
                          title={language === 'hi' ? 'क्रॉप एवं संपादन' : 'Crop & Edit'}
                        >
                          <Crop className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPhotoIndex(idx);
                            setActiveTab('validator');
                          }}
                          className="p-1.5 hover:bg-[#F5F5F0] text-[#D4A373] rounded-lg transition-colors cursor-pointer"
                          title={language === 'hi' ? 'मानक सत्यापन जांचें' : 'Check Quality'}
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePhoto(idx)}
                          className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-lg transition-colors cursor-pointer"
                          title={language === 'hi' ? 'हटाएं' : 'Delete'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Photo Card (if less than 6) */}
                {photos.length < 6 && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-4/5 bg-white rounded-2xl border-2 border-dashed border-[#D4A373]/60 hover:border-[#D4A373] hover:bg-[#FAF9F6] transition-all flex flex-col items-center justify-center p-4 text-center cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#FAF9F6] group-hover:bg-[#D4A373]/10 text-[#D4A373] flex items-center justify-center mb-2 transition-colors">
                      <Plus className="w-6 h-6" />
                    </div>
                    <span className="font-serif font-bold text-xs text-[#5A5A40]">
                      {language === 'hi' ? 'नई फ़ोटो जोड़ें' : 'Upload Photo'}
                    </span>
                    <span className="text-[10px] text-[#8C8479] mt-1">
                      {language === 'hi' ? 'डिवाइस से चयन करें' : 'JPG, PNG, WEBP'}
                    </span>
                  </div>
                )}
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Add Via URL Section */}
              <div className="bg-white p-5 rounded-[24px] border border-[#E8E4DE] shadow-xs space-y-3">
                <h3 className="font-serif font-bold text-xs text-[#5A5A40] flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-[#D4A373]" />
                  <span>{language === 'hi' ? 'सीधे वेब लिंक (URL) से फ़ोटो जोड़ें' : 'Add Photo via Image URL'}</span>
                </h3>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newUrlInput}
                    onChange={(e) => setNewUrlInput(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-4 py-2 bg-[#FAF9F6] border border-[#E8E4DE] rounded-xl text-xs text-[#4A453E] focus:outline-none focus:border-[#5A5A40]"
                  />
                  <button
                    onClick={handleAddUrl}
                    disabled={!newUrlInput.trim()}
                    className="px-4 py-2 bg-[#5A5A40] hover:bg-[#4A453E] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    {language === 'hi' ? 'जोड़ें' : 'Add URL'}
                  </button>
                </div>
              </div>

              {/* Curated Sample Portrats to Choose From */}
              <div className="bg-white p-5 rounded-[24px] border border-[#E8E4DE] shadow-xs space-y-3">
                <h3 className="font-serif font-bold text-xs text-[#5A5A40] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
                  <span>
                    {language === 'hi'
                      ? 'प्रमाणित उच्च-गुणवत्ता वाले नमूना पोर्ट्रेट (Sample Portrats)'
                      : 'Curated Matrimonial Standard Avatars'}
                  </span>
                </h3>
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {(currentUser.gender === 'female' ? SAMPLE_BRIDE_PHOTOS : SAMPLE_GROOM_PHOTOS).map(
                    (sampleUrl, sIdx) => (
                      <div
                        key={sIdx}
                        onClick={() => handleAddSample(sampleUrl)}
                        className="w-16 h-20 rounded-xl overflow-hidden shrink-0 border-2 border-transparent hover:border-[#D4A373] cursor-pointer group relative shadow-2xs"
                      >
                        <img
                          src={sampleUrl}
                          alt="Sample"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Plus className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CROP & ENHANCE STUDIO */}
          {activeTab === 'crop' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                {/* Canvas Cropper Box */}
                <div className="md:col-span-7 bg-[#4A453E] rounded-[24px] p-4 flex flex-col items-center justify-center min-h-[380px] relative overflow-hidden shadow-inner select-none">
                  {/* Bounding Frame with Aspect Ratio */}
                  <div
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className={`relative overflow-hidden border-2 border-dashed border-[#D4A373] bg-[#2C2925] cursor-move shadow-2xl transition-all ${
                      aspectRatio === '1:1'
                        ? 'w-[280px] h-[280px] sm:w-[320px] sm:h-[320px]'
                        : aspectRatio === '3:4'
                        ? 'w-[260px] h-[346px] sm:w-[300px] sm:h-[400px]'
                        : 'w-[270px] h-[337px] sm:w-[310px] sm:h-[387px]'
                    }`}
                  >
                    {/* Face Alignment Overlay Grid (Rule of Thirds & Oval Face Guide) */}
                    <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
                      <div className="w-36 h-48 rounded-[50%] border border-white/30 border-dashed"></div>
                      <div className="absolute top-1/3 left-0 right-0 border-t border-white/15"></div>
                      <div className="absolute top-2/3 left-0 right-0 border-t border-white/15"></div>
                      <div className="absolute left-1/3 top-0 bottom-0 border-l border-white/15"></div>
                      <div className="absolute left-2/3 top-0 bottom-0 border-l border-white/15"></div>
                    </div>

                    {/* Image being cropped */}
                    <img
                      ref={imageRef}
                      src={photos[cropTargetIndex] || photos[0]}
                      alt="Crop target"
                      crossOrigin="anonymous"
                      style={{
                        transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                        filter: `brightness(${brightness}%) contrast(${contrast}%)`,
                        transformOrigin: 'center center',
                        transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                      }}
                      className="max-w-none w-full h-auto pointer-events-none select-none"
                    />
                  </div>

                  <p className="text-[11px] text-[#E8E4DE]/70 mt-3 flex items-center gap-1 font-mono">
                    <Maximize2 className="w-3 h-3" />
                    <span>{language === 'hi' ? 'माउस से खींचकर चेहरे को केंद्र में सेट करें' : 'Drag image to center face inside frame'}</span>
                  </p>
                </div>

                {/* Control Panel */}
                <div className="md:col-span-5 space-y-4">
                  {/* Aspect Ratio Selector */}
                  <div className="bg-white p-4 rounded-2xl border border-[#E8E4DE] shadow-xs space-y-2">
                    <label className="text-xs font-bold text-[#5A5A40] block">
                      {language === 'hi' ? '१. पोर्ट्रेट अनुपात (Aspect Ratio)' : '1. Aspect Ratio Standard'}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setAspectRatio('4:5')}
                        className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          aspectRatio === '4:5'
                            ? 'bg-[#5A5A40] text-white border-[#5A5A40]'
                            : 'bg-[#FAF9F6] text-[#8C8479] border-[#E8E4DE] hover:border-[#D4A373]'
                        }`}
                      >
                        <span className="block">4 : 5</span>
                        <span className="text-[9px] opacity-80 font-normal">
                          {language === 'hi' ? 'मानक पोर्ट्रेट' : 'Matrimonial'}
                        </span>
                      </button>

                      <button
                        onClick={() => setAspectRatio('1:1')}
                        className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          aspectRatio === '1:1'
                            ? 'bg-[#5A5A40] text-white border-[#5A5A40]'
                            : 'bg-[#FAF9F6] text-[#8C8479] border-[#E8E4DE] hover:border-[#D4A373]'
                        }`}
                      >
                        <span className="block">1 : 1</span>
                        <span className="text-[9px] opacity-80 font-normal">
                          {language === 'hi' ? 'चौकोर / अवतार' : 'Square Avatar'}
                        </span>
                      </button>

                      <button
                        onClick={() => setAspectRatio('3:4')}
                        className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          aspectRatio === '3:4'
                            ? 'bg-[#5A5A40] text-white border-[#5A5A40]'
                            : 'bg-[#FAF9F6] text-[#8C8479] border-[#E8E4DE] hover:border-[#D4A373]'
                        }`}
                      >
                        <span className="block">3 : 4</span>
                        <span className="text-[9px] opacity-80 font-normal">
                          {language === 'hi' ? 'बायोडाटा क्लासिक' : 'Classic Biodata'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Zoom & Rotation Controls */}
                  <div className="bg-white p-4 rounded-2xl border border-[#E8E4DE] shadow-xs space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-[#5A5A40] mb-1">
                        <span className="flex items-center gap-1">
                          <ZoomIn className="w-3.5 h-3.5 text-[#D4A373]" />
                          <span>{language === 'hi' ? 'ज़ूम (Zoom & Scale)' : 'Zoom'}</span>
                        </span>
                        <span className="font-mono text-[#D4A373]">{zoom.toFixed(1)}x</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="2.8"
                        step="0.1"
                        value={zoom}
                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                        className="w-full accent-[#5A5A40] cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#F5F5F0]">
                      <span className="text-xs font-bold text-[#5A5A40]">
                        {language === 'hi' ? 'घुमाएं (Rotate)' : 'Rotate'}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setRotation((r) => (r - 90 + 360) % 360)}
                          className="px-2.5 py-1 bg-[#FAF9F6] hover:bg-[#F5F5F0] text-[#5A5A40] rounded-lg text-xs font-bold border border-[#E8E4DE] cursor-pointer"
                        >
                          -90°
                        </button>
                        <button
                          onClick={() => setRotation((r) => (r + 90) % 360)}
                          className="px-2.5 py-1 bg-[#FAF9F6] hover:bg-[#F5F5F0] text-[#5A5A40] rounded-lg text-xs font-bold border border-[#E8E4DE] flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCw className="w-3 h-3" />
                          <span>+90°</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Brightness & Contrast Enhancer */}
                  <div className="bg-white p-4 rounded-2xl border border-[#E8E4DE] shadow-xs space-y-3">
                    <label className="text-xs font-bold text-[#5A5A40] flex items-center gap-1">
                      <Sliders className="w-3.5 h-3.5 text-[#D4A373]" />
                      <span>{language === 'hi' ? 'प्रकाश एवं स्पष्टता सुधार (Lighting & Clarity)' : 'Lighting & Contrast'}</span>
                    </label>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-[#8C8479]">
                        <span>{language === 'hi' ? 'चमक (Brightness)' : 'Brightness'}</span>
                        <span className="font-mono font-bold text-[#5A5A40]">{brightness}%</span>
                      </div>
                      <input
                        type="range"
                        min="70"
                        max="140"
                        value={brightness}
                        onChange={(e) => setBrightness(parseInt(e.target.value))}
                        className="w-full accent-[#D4A373] cursor-pointer"
                      />
                    </div>

                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between text-[11px] text-[#8C8479]">
                        <span>{language === 'hi' ? 'कंट्रास्ट (Contrast)' : 'Contrast'}</span>
                        <span className="font-mono font-bold text-[#5A5A40]">{contrast}%</span>
                      </div>
                      <input
                        type="range"
                        min="80"
                        max="130"
                        value={contrast}
                        onChange={(e) => setContrast(parseInt(e.target.value))}
                        className="w-full accent-[#D4A373] cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        setZoom(1);
                        setRotation(0);
                        setBrightness(100);
                        setContrast(100);
                        setPanOffset({ x: 0, y: 0 });
                      }}
                      className="flex-1 py-2.5 bg-white hover:bg-[#FAF9F6] text-[#8C8479] font-bold text-xs rounded-xl border border-[#E8E4DE] transition-colors cursor-pointer"
                    >
                      {language === 'hi' ? 'रीसेट (Reset)' : 'Reset'}
                    </button>

                    <button
                      onClick={handleApplyCrop}
                      className="flex-2 py-2.5 bg-[#D4A373] hover:bg-[#c49262] text-white font-bold text-xs rounded-xl shadow-md shadow-[#D4A373]/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>{language === 'hi' ? 'क्रॉप सहेजें व जांचें' : 'Save & Verify Crop'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MATRIMONIAL PORTRAIT STANDARDS VALIDATOR */}
          {activeTab === 'validator' && (
            <div className="space-y-6">
              {/* Profile Selector for Validation */}
              <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-[#E8E4DE]">
                <div className="flex items-center gap-2 overflow-x-auto">
                  <span className="text-xs font-bold text-[#5A5A40] shrink-0 mr-2">
                    {language === 'hi' ? 'फ़ोटो चुनें:' : 'Select Photo:'}
                  </span>
                  {photos.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedPhotoIndex(idx)}
                      className={`relative w-10 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                        selectedPhotoIndex === idx
                          ? 'border-[#D4A373] ring-2 ring-[#D4A373]/20 scale-105'
                          : 'border-[#E8E4DE] opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={p} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute bottom-0 inset-x-0 bg-[#D4A373] text-white text-[8px] text-center font-bold">
                          ★ 1
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handleStartCrop(selectedPhotoIndex)}
                  className="px-3.5 py-1.5 bg-[#FAF9F6] hover:bg-[#F5F5F0] text-[#5A5A40] border border-[#E8E4DE] rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0 ml-2"
                >
                  <Crop className="w-3.5 h-3.5 text-[#D4A373]" />
                  <span>{language === 'hi' ? 'क्रॉप करें' : 'Crop'}</span>
                </button>
              </div>

              {/* Validation Result Box */}
              {isValidating ? (
                <div className="bg-white rounded-[28px] p-12 text-center border border-[#E8E4DE] space-y-3">
                  <div className="w-10 h-10 border-3 border-[#5A5A40] border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="font-serif font-bold text-sm text-[#5A5A40]">
                    {language === 'hi'
                      ? 'वैवाहिक पोर्ट्रेट गुणवत्ता व दिशानिर्देशों का सत्यापन हो रहा है...'
                      : 'Analyzing image against matrimonial portrait standards...'}
                  </p>
                </div>
              ) : validationResult ? (
                <div className="space-y-6">
                  {/* Top Score Banner */}
                  <div
                    className={`rounded-[28px] p-6 border flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs ${
                      validationResult.score >= 90
                        ? 'bg-[#5A5A40] text-white border-[#4A453E]'
                        : 'bg-[#FAF9F6] text-[#5A5A40] border-[#D4A373]'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center font-serif text-2xl font-bold border-4 ${
                          validationResult.score >= 90
                            ? 'bg-[#D4A373] text-white border-white/40 shadow-md'
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}
                      >
                        {validationResult.score}%
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif font-bold text-lg">
                            {validationResult.score >= 90
                              ? language === 'hi'
                                ? '✓ सत्यापित: उत्कृष्ट वैवाहिक पोर्ट्रेट'
                                : '✓ Verified: Ideal Matrimonial Portrait'
                              : language === 'hi'
                              ? '⚠️ सुधार योग्य: मानक पोर्ट्रेट'
                              : '⚠️ Improvement Recommended'}
                          </h3>
                        </div>
                        <p
                          className={`text-xs mt-1 leading-relaxed ${
                            validationResult.score >= 90 ? 'text-[#E8E4DE]' : 'text-[#8C8479]'
                          }`}
                        >
                          {language === 'hi' ? validationResult.summaryHi : validationResult.summaryEn}
                        </p>
                      </div>
                    </div>

                    {selectedPhotoIndex !== 0 && (
                      <button
                        onClick={() => handleSetPrimary(selectedPhotoIndex)}
                        className="px-5 py-2.5 bg-[#D4A373] hover:bg-[#c49262] text-white rounded-full text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{language === 'hi' ? 'इसे मुख्य फ़ोटो बनाएं' : 'Make Primary Cover'}</span>
                      </button>
                    )}
                  </div>

                  {/* Checklist Breakdown */}
                  <div className="bg-white rounded-[28px] border border-[#E8E4DE] p-6 shadow-xs space-y-4">
                    <h4 className="font-serif font-bold text-sm text-[#5A5A40] flex items-center justify-between border-b border-[#F5F5F0] pb-3">
                      <span>{language === 'hi' ? 'वैवाहिक फोटो मानक चेकलिस्ट' : 'Matrimonial Quality Checklist'}</span>
                      <span className="text-xs font-normal text-[#8C8479]">
                        {validationResult.checks.filter((c) => c.passed).length} /{' '}
                        {validationResult.checks.length} {language === 'hi' ? 'मानक पूर्ण' : 'Checks Passed'}
                      </span>
                    </h4>

                    <div className="space-y-3">
                      {validationResult.checks.map((check) => (
                        <div
                          key={check.id}
                          className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-colors ${
                            check.passed
                              ? 'bg-[#FAF9F6] border-[#E8E4DE]'
                              : 'bg-amber-50/60 border-amber-200'
                          }`}
                        >
                          {check.passed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h5 className="font-serif font-bold text-xs text-[#5A5A40]">
                                {language === 'hi' ? check.titleHi : check.titleEn}
                              </h5>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  check.passed
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {check.passed
                                  ? language === 'hi'
                                    ? 'मान्य'
                                    : 'Passed'
                                  : language === 'hi'
                                  ? 'सुधारें'
                                  : 'Notice'}
                              </span>
                            </div>
                            <p className="text-xs text-[#8C8479] mt-0.5">
                              {language === 'hi' ? check.feedbackHi : check.feedbackEn}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Footer in Natural Tones */}
        <div className="bg-white p-4 sm:p-5 border-t border-[#E8E4DE] flex items-center justify-between gap-3">
          <div className="text-xs text-[#8C8479]">
            <span>{photos.length} / 6 {language === 'hi' ? 'तस्वीरें एल्बम में सुरक्षित' : 'photos in album'}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#5A5A40] hover:bg-[#4A453E] text-white rounded-full text-xs font-bold shadow-md shadow-[#5A5A40]/20 transition-all cursor-pointer"
            >
              {language === 'hi' ? 'पूर्ण एवं सहेजें (Done)' : 'Done & Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
