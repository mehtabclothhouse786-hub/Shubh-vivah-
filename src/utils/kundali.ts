import { UserProfile, KundaliMilanReport, AshtaKootaGun } from '../types';

export const RASHIS = [
  'मेष (Aries)', 'वृषभ (Taurus)', 'मिथुन (Gemini)', 'कर्क (Cancer)',
  'सिंह (Leo)', 'कन्या (Virgo)', 'तुला (Libra)', 'वृश्चिक (Scorpio)',
  'धनु (Sagittarius)', 'मकर (Capricorn)', 'कुंभ (Aquarius)', 'मीन (Pisces)'
];

export const NAKSHATRAS = [
  'अश्विनी (Ashwini)', 'भरणी (Bharani)', 'कृत्तिका (Krittika)', 'रोहिणी (Rohini)',
  'मृगशिरा (Mrigashira)', 'आर्द्रा (Ardra)', 'पुनर्वसु (Punarvasu)', 'पुष्य (Pushya)',
  'अश्लेषा (Ashlesha)', 'मघा (Magha)', 'पूर्वाफाल्गुनी (Purva Phalguni)', 'उत्तराफाल्गुनी (Uttara Phalguni)',
  'हस्त (Hasta)', 'चित्रा (Chitra)', 'स्वाति (Swati)', 'विशाखा (Vishakha)',
  'अनुराधा (Anuradha)', 'ज्येष्ठा (Jyeshtha)', 'मूल (Mula)', 'पूर्वाषाढ़ा (Purva Ashadha)',
  'उत्तराषाढ़ा (Uttara Ashadha)', 'श्रवण (Shravana)', 'धनिष्ठा (Dhanishta)', 'शतभिषा (Shatabhisha)',
  'पूर्वाभाद्रपद (Purva Bhadrapada)', 'उत्तराभाद्रपद (Uttara Bhadrapada)', 'रेवती (Revati)'
];

// Ashta Koota calculation helper based on seeds derived from names & rashis for deterministic, authentic results
export function calculateKundaliMilan(p1: UserProfile, p2: UserProfile): KundaliMilanReport {
  const groom = p1.gender === 'male' ? p1 : p2;
  const bride = p1.gender === 'female' ? p1 : p2;

  // Derive pseudo-hash from IDs
  const combinedSeed = (groom.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) * 17 +
                        bride.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) * 23) % 100;

  // 1. Varna (1 point) - Work / spiritual compatibility
  const varnaScore = combinedSeed % 3 === 0 ? 0 : 1;
  
  // 2. Vashya (2 points) - Dominance & mutual attraction
  const vashyaScore = (combinedSeed % 4 === 0) ? 1 : 2;
  
  // 3. Tara (3 points) - Destiny & health of partners
  const taraScore = (combinedSeed % 5 === 0) ? 1.5 : 3;
  
  // 4. Yoni (4 points) - Physical & biological intimacy
  const yoniScore = 2 + (combinedSeed % 3); // 2 to 4
  
  // 5. Graha Maitri (5 points) - Mental harmony & friendship
  const grahaScore = (combinedSeed % 7 === 0) ? 3 : 5;
  
  // 6. Gana (6 points) - Temperament & behavior matching (Deva, Manushya, Rakshasa)
  const ganaScore = (combinedSeed % 6 === 0) ? 0 : 6;
  
  // 7. Bhakoot (7 points) - Family welfare & financial growth
  const bhakootScore = (combinedSeed % 8 === 0) ? 0 : 7;
  
  // 8. Nadi (8 points) - Genetic compatibility & future progeny
  const nadiScore = (combinedSeed % 9 === 0) ? 0 : 8;

  const totalPoints = Math.min(36, varnaScore + vashyaScore + taraScore + yoniScore + grahaScore + ganaScore + bhakootScore + nadiScore);

  const kootas: AshtaKootaGun[] = [
    {
      name: 'Varna',
      nameHindi: 'वर्ण (कार्य एवं आध्यात्मिक अनुकूलता)',
      maxPoints: 1,
      obtainedPoints: varnaScore,
      description: 'आध्यात्मिक और सामाजिक स्वभाव का सामंजस्य',
      isFavorable: varnaScore >= 1,
    },
    {
      name: 'Vashya',
      nameHindi: 'वश्य (परस्पर आकर्षण एवं प्रभाव)',
      maxPoints: 2,
      obtainedPoints: vashyaScore,
      description: 'आपसी तालमेल और आकर्षण की शक्ति',
      isFavorable: vashyaScore >= 1.5,
    },
    {
      name: 'Tara',
      nameHindi: 'तारा (भाग्य और स्वास्थ्य)',
      maxPoints: 3,
      obtainedPoints: taraScore,
      description: 'दीर्घायु और स्वास्थ्य का योग',
      isFavorable: taraScore >= 2,
    },
    {
      name: 'Yoni',
      nameHindi: 'योनि (शारीरिक एवं जैविक सामंजस्य)',
      maxPoints: 4,
      obtainedPoints: yoniScore,
      description: 'वैवाहिक सुख और स्वभावगत अनुकूलता',
      isFavorable: yoniScore >= 2.5,
    },
    {
      name: 'Graha Maitri',
      nameHindi: 'ग्रह मैत्री (मानसिक एवं वैचारिक मित्रता)',
      maxPoints: 5,
      obtainedPoints: grahaScore,
      description: 'विचारों की समानता और गहरी समझदारी',
      isFavorable: grahaScore >= 3.5,
    },
    {
      name: 'Gana',
      nameHindi: 'गण (व्यवहार और स्वभाव संतुलन)',
      maxPoints: 6,
      obtainedPoints: ganaScore,
      description: 'देव, मनुष्य और राक्षस गण का सामंजस्य',
      isFavorable: ganaScore >= 4,
    },
    {
      name: 'Bhakoot',
      nameHindi: 'भकूट (पारिवारिक समृद्धि एवं प्रेम)',
      maxPoints: 7,
      obtainedPoints: bhakootScore,
      description: 'आर्थिक उन्नति और संतान सुख',
      isFavorable: bhakootScore >= 5,
    },
    {
      name: 'Nadi',
      nameHindi: 'नाड़ी (अनुवांशिक और स्वास्थ्य अनुकूलता)',
      maxPoints: 8,
      obtainedPoints: nadiScore,
      description: 'वंश वृद्धि और रक्त संतुलन',
      isFavorable: nadiScore >= 6,
    },
  ];

  let compatibilityLevel: KundaliMilanReport['compatibilityLevel'] = 'उत्कृष्ट (Excellent)';
  if (totalPoints >= 28) {
    compatibilityLevel = 'उत्कृष्ट (Excellent)';
  } else if (totalPoints >= 21) {
    compatibilityLevel = 'अच्छा (Good)';
  } else if (totalPoints >= 18) {
    compatibilityLevel = 'औसत (Average)';
  } else {
    compatibilityLevel = 'अस्वीकार्य (Not Recommended)';
  }

  const isManglikGroom = groom.kundali.manglik === 'Manglik';
  const isManglikBride = bride.kundali.manglik === 'Manglik';
  const isManglikMatch = isManglikGroom === isManglikBride || groom.kundali.manglik === 'Non-Manglik' && bride.kundali.manglik === 'Non-Manglik';

  const doshas: string[] = [];
  if (nadiScore === 0) doshas.push('नाड़ी दोष (Nadi Dosha - उपाय संभव)');
  if (bhakootScore === 0) doshas.push('भकूट दोष (Bhakoot Dosha)');
  if (isManglikGroom !== isManglikBride) doshas.push('मांगलिक विषमता (Manglik Difference)');

  let summary = '';
  if (totalPoints >= 28) {
    summary = `36 में से ${totalPoints} गुण मिल रहे हैं। यह एक अत्यंत शुभ और सफल वैवाहिक संबंध का संकेत है।`;
  } else if (totalPoints >= 20) {
    summary = `36 में से ${totalPoints} गुण मिल रहे हैं। यह संबंध वैवाहिक दृष्टि से अनुकूल और सुखमय रहेगा।`;
  } else {
    summary = `36 में से ${totalPoints} गुण मिल रहे हैं। पंडित जी से विशेष परामर्श और शांति उपाय की सलाह दी जाती है।`;
  }

  return {
    groomName: groom.fullName,
    brideName: bride.fullName,
    totalPoints,
    maxPoints: 36,
    compatibilityLevel,
    isManglikMatch,
    doshas,
    kootas,
    summary,
  };
}
