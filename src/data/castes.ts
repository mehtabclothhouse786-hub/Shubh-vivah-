export interface CasteItem {
  id: string;
  nameHi: string;
  nameEn: string;
  subcastes: string[];
}

export const HINDU_CASTES: CasteItem[] = [
  {
    id: 'Brahmin',
    nameHi: 'ब्राह्मण (Brahmin)',
    nameEn: 'Brahmin',
    subcastes: [
      'Gaur Brahmin',
      'Kanyakubja Brahmin',
      'Saraswat Brahmin',
      'Saryupareen Brahmin',
      'Sanadhya Brahmin',
      'Maithil Brahmin',
      'Nagar Brahmin',
      'Iyer (Tamil Brahmin)',
      'Iyengar (Tamil Brahmin)',
      'Deshastha Brahmin',
      'Kokanastha (Chitpavan) Brahmin',
      'Namboodiri Brahmin',
      'Utkal (Odia) Brahmin',
      'Audichya Brahmin',
      'Bhargav Brahmin',
      'Pareek Brahmin',
      'Dadhich Brahmin',
      'Mohyal Brahmin',
      'Anavil Brahmin',
      'All Brahmin Subcastes'
    ]
  },
  {
    id: 'Rajput',
    nameHi: 'राजपूत / क्षत्रिय (Rajput / Kshatriya)',
    nameEn: 'Rajput / Kshatriya',
    subcastes: [
      'Chauhan',
      'Rathore',
      'Sisodia (Mewar)',
      'Parmar / Panwar',
      'Shekhawat',
      'Bhati (Jaisalmer)',
      'Tomar / Tanwar',
      'Solanki',
      'Jadeja',
      'Kachwaha',
      'Bundela',
      'Chandel',
      'Gautam Rajput',
      'Rawat Rajput',
      'Negi / Garhwali / Kumaoni',
      'Pundir',
      'All Rajput Subcastes'
    ]
  },
  {
    id: 'Vaishya_Baniya',
    nameHi: 'वैश्य / बनिया / मारवाड़ी (Vaishya / Agarwal / Baniya)',
    nameEn: 'Vaishya / Agarwal / Baniya',
    subcastes: [
      'Agarwal (Garg, Goyal, Mittal, Bansal, Singhal, Jindal)',
      'Gupta',
      'Maheshwari',
      'Khandelwal',
      'Oswal (Jain/Hindu)',
      'Porwal',
      'Barnwal',
      'Rauniyar',
      'Keshari',
      'Rustagi',
      'Jaiswal',
      'Kasodhan',
      'Modh Baniya',
      'Mahajan',
      'Gahoi',
      'Agrahari',
      'All Vaishya / Baniya Subcastes'
    ]
  },
  {
    id: 'Patel_Patidar',
    nameHi: 'पटेल / पाटीदार (Patel / Patidar)',
    nameEn: 'Patel / Patidar',
    subcastes: [
      'Kadva Patel',
      'Leva / Leuva Patel',
      'Anjana Patel',
      'Matiya Patel',
      'Chaudhari Patel',
      'All Patel Subcastes'
    ]
  },
  {
    id: 'Yadav_Ahir',
    nameHi: 'यादव / अहीर (Yadav / Ahir)',
    nameEn: 'Yadav / Ahir',
    subcastes: [
      'Yaduvanshi',
      'Nandvanshi',
      'Gwalvanshi',
      'Krishnaut',
      'Majraut',
      'Ahir',
      'All Yadav Subcastes'
    ]
  },
  {
    id: 'Jat',
    nameHi: 'जाट (Jat)',
    nameEn: 'Jat',
    subcastes: [
      'Malik',
      'Dahiya',
      'Ahlawat',
      'Rathi',
      'Hooda',
      'Punia',
      'Gill',
      'Dhillon',
      'Sandhu',
      'Mann',
      'Sangwan',
      'Grewal',
      'All Jat Gotras'
    ]
  },
  {
    id: 'Gujjar_Gurjar',
    nameHi: 'गुर्जर / गूजर (Gujjar / Gurjar)',
    nameEn: 'Gujjar / Gurjar',
    subcastes: [
      'Baisla',
      'Tanwar',
      'Bhati',
      'Chhana',
      'Poswal',
      'Tongad',
      'Dedha',
      'Kasana',
      'Khatana',
      'All Gujjar Subcastes'
    ]
  },
  {
    id: 'Kayastha',
    nameHi: 'कायस्थ (Kayastha)',
    nameEn: 'Kayastha',
    subcastes: [
      'Srivastava',
      'Saxena',
      'Mathur',
      'Nigam',
      'Bhatnagar',
      'Ambastha',
      'Asthana',
      'Kulshreshtha',
      'Karna',
      'Gaur Kayastha',
      'Surajdhwaj',
      'All Kayastha Subcastes'
    ]
  },
  {
    id: 'Khatri_Arora',
    nameHi: 'खत्री / अरोड़ा / भाटिया (Khatri / Arora / Bhatia)',
    nameEn: 'Khatri / Arora / Bhatia',
    subcastes: [
      'Kapoor',
      'Khanna',
      'Malhotra',
      'Sethi',
      'Tandon',
      'Vohra',
      'Chopra',
      'Anand',
      'Batra',
      'Chawla',
      'Grover',
      'Juneja',
      'Ahuja',
      'Bhatia',
      'All Khatri / Arora Subcastes'
    ]
  },
  {
    id: 'Maratha_Kunbi',
    nameHi: 'मराठा / कुणबी (Maratha / Kunbi)',
    nameEn: 'Maratha / Kunbi',
    subcastes: [
      '96 Kuli Maratha',
      'Kunbi Maratha',
      'Deshmukh',
      'Patil',
      'Jadhav',
      'Bhosale',
      'Shinde',
      'Gaikwad',
      'Pawar',
      'All Maratha Subcastes'
    ]
  },
  {
    id: 'Reddy',
    nameHi: 'रेड्डी (Reddy)',
    nameEn: 'Reddy',
    subcastes: [
      'Motati Reddy',
      'Gudati Reddy',
      'Pakanati Reddy',
      'Pedakanti Reddy',
      'All Reddy Subcastes'
    ]
  },
  {
    id: 'Kamma',
    nameHi: 'कम्मा (Kamma)',
    nameEn: 'Kamma',
    subcastes: [
      'Chowdary',
      'Naidu',
      'All Kamma Subcastes'
    ]
  },
  {
    id: 'Kapu_Balija',
    nameHi: 'कापू / बलिजा / मुन्नुरु कापू (Kapu / Balija)',
    nameEn: 'Kapu / Balija',
    subcastes: [
      'Kapu',
      'Balija',
      'Telaga',
      'Ontari',
      'Munnuru Kapu',
      'All Kapu Subcastes'
    ]
  },
  {
    id: 'Lingayat',
    nameHi: 'लिंगायत (Lingayat / Veerashaiva)',
    nameEn: 'Lingayat / Veerashaiva',
    subcastes: [
      'Panchamasali',
      'Banajiga',
      'Sadar',
      'Jangama',
      'All Lingayat Subcastes'
    ]
  },
  {
    id: 'Nair',
    nameHi: 'नायर (Nair)',
    nameEn: 'Nair',
    subcastes: [
      'Menon',
      'Pillai',
      'Nambiar',
      'Kurup',
      'Unnithan',
      'All Nair Subcastes'
    ]
  },
  {
    id: 'Ezhava_Thiyya',
    nameHi: 'एझवा / थिया (Ezhava / Thiyya)',
    nameEn: 'Ezhava / Thiyya',
    subcastes: [
      'Ezhava',
      'Thiyya',
      'Billava'
    ]
  },
  {
    id: 'Saini_Mali_Maurya',
    nameHi: 'सैनी / माली / मौर्य / कुशवाहा (Saini / Mali / Kushwaha / Maurya)',
    nameEn: 'Saini / Mali / Kushwaha / Maurya',
    subcastes: [
      'Saini',
      'Kushwaha',
      'Maurya',
      'Shakya',
      'Mali',
      'Koiri',
      'All Kushwaha/Saini Subcastes'
    ]
  },
  {
    id: 'Kurmi',
    nameHi: 'कुर्मी (Kurmi / Patel / Verma)',
    nameEn: 'Kurmi / Patel / Verma',
    subcastes: [
      'Awadhiya Kurmi',
      'Kochisa Kurmi',
      'Jaswar Kurmi',
      'Chandel Kurmi',
      'Dhanuk',
      'All Kurmi Subcastes'
    ]
  },
  {
    id: 'Vishwakarma_Jangid',
    nameHi: 'विश्वकर्मा / जांगिड़ / सुथार / लोहार (Vishwakarma / Jangid / Suthar)',
    nameEn: 'Vishwakarma / Jangid / Suthar',
    subcastes: [
      'Jangid Brahmin',
      'Suthar / Carpenter',
      'Lohar / Blacksmith',
      'Kansara',
      'All Vishwakarma Subcastes'
    ]
  },
  {
    id: 'Prajapati_Kumhar',
    nameHi: 'प्रजापति / कुम्हार (Prajapati / Kumhar)',
    nameEn: 'Prajapati / Kumhar',
    subcastes: [
      'Prajapati',
      'Kumhar',
      'Gola Prajapati',
      'All Prajapati Subcastes'
    ]
  },
  {
    id: 'Sunar_Swarnakar',
    nameHi: 'सुनार / स्वर्णकार / सोनी (Sunar / Swarnakar / Soni)',
    nameEn: 'Sunar / Swarnakar / Soni',
    subcastes: [
      'Swarnakar',
      'Soni',
      'Sunar',
      'Zaveri',
      'All Swarnakar Subcastes'
    ]
  },
  {
    id: 'SC_ScheduledCaste',
    nameHi: 'अनुसूचित जाति (SC Communities - Jatav, Mahar, Valmiki, Meghwal, etc.)',
    nameEn: 'Scheduled Caste (SC Communities)',
    subcastes: [
      'Jatav',
      'Chamar',
      'Valmiki / Balmiki',
      'Meghwal',
      'Mahar',
      'Ravidasia',
      'Madiga',
      'Mala',
      'Pasi',
      'Khatik',
      'Koli',
      'All SC Communities'
    ]
  },
  {
    id: 'ST_ScheduledTribe',
    nameHi: 'अनुसूचित जनजाति (ST Communities - Meena, Gond, Bhil, etc.)',
    nameEn: 'Scheduled Tribe (ST Communities)',
    subcastes: [
      'Meena / Mina',
      'Gond',
      'Bhil',
      'Santhal',
      'Oraon',
      'Munda',
      'All ST Communities'
    ]
  },
  {
    id: 'All_Hindu_Castes',
    nameHi: 'सर्व हिन्दू समाज (All Hindu Castes Welcome / Open to All)',
    nameEn: 'All Hindu Castes Welcome',
    subcastes: ['Caste No Bar / Open to All Hindu Castes']
  }
];

export const MUSLIM_CASTES: CasteItem[] = [
  {
    id: 'Khan_Pathan',
    nameHi: 'खान / पठान / पश्तून (Khan / Pathan / Pashtun)',
    nameEn: 'Khan / Pathan / Pashtun',
    subcastes: [
      'Yusufzai',
      'Afridi',
      'Khattak',
      'Bangash',
      'Niazi',
      'Durrani',
      'Rohilla Pathan',
      'Ghori',
      'Lodhi',
      'Sherwani',
      'Kakar',
      'All Pathan Clans'
    ]
  },
  {
    id: 'Ansari',
    nameHi: 'अंसारी / मोमिन अंसारी (Ansari / Momin Ansari)',
    nameEn: 'Ansari / Momin Ansari',
    subcastes: [
      'Momin Ansari',
      'Bunkar Ansari',
      'Sunni Ansari',
      'All Ansari Biradaris'
    ]
  },
  {
    id: 'Syed',
    nameHi: 'सैयद / सादात (Syed / Sayyid / Sadat)',
    nameEn: 'Syed / Sayyid / Sadat',
    subcastes: [
      'Rizvi / Razvi',
      'Zaidi',
      'Naqvi',
      'Kazmi',
      'Bukhari',
      'Gilani / Jilani',
      'Alvi',
      'Hasani',
      'Husaini',
      'Jafri / Jafari',
      'Abidi',
      'Tirmizi',
      'Baqri',
      'All Syed Lineages'
    ]
  },
  {
    id: 'Siddiqui',
    nameHi: 'सिद्दीकी (Siddiqui / Siddiki)',
    nameEn: 'Siddiqui / Siddiki',
    subcastes: [
      'Sunni Siddiqui',
      'Hanafi Siddiqui',
      'Shafi Siddiqui',
      'All Siddiqui Biradaris'
    ]
  },
  {
    id: 'Farooqui',
    nameHi: 'फ़ारूक़ी (Farooqui / Faruqi)',
    nameEn: 'Farooqui / Faruqi',
    subcastes: [
      'Sunni Farooqui',
      'All Farooqui Biradaris'
    ]
  },
  {
    id: 'Usmani',
    nameHi: 'उस्मानी (Usmani / Osmani)',
    nameEn: 'Usmani / Osmani',
    subcastes: [
      'Sunni Usmani',
      'All Usmani Biradaris'
    ]
  },
  {
    id: 'Abbasi',
    nameHi: 'अब्बासी (Abbasi)',
    nameEn: 'Abbasi',
    subcastes: [
      'Sunni Abbasi',
      'All Abbasi Biradaris'
    ]
  },
  {
    id: 'Alvi_Hashmi',
    nameHi: 'अलवी / हाशमी (Alvi / Hashmi)',
    nameEn: 'Alvi / Hashmi',
    subcastes: [
      'Alvi',
      'Hashmi',
      'All Hashmi Biradaris'
    ]
  },
  {
    id: 'Sheikh',
    nameHi: 'शेख / शैख़ (Sheikh / Shaikh)',
    nameEn: 'Sheikh / Shaikh',
    subcastes: [
      'Qureshi Shaikh',
      'Milki Sheikh',
      'Abbasi Sheikh',
      'Sunni Sheikh',
      'All Sheikh Biradaris'
    ]
  },
  {
    id: 'Qureshi',
    nameHi: 'कुरैशी / क़ुरैशी (Qureshi / Quraishi)',
    nameEn: 'Qureshi / Quraishi',
    subcastes: [
      'Hashemi Qureshi',
      'Sunni Qureshi',
      'Qassab Qureshi',
      'All Qureshi Biradaris'
    ]
  },
  {
    id: 'Malik',
    nameHi: 'मलिक (Malik)',
    nameEn: 'Malik',
    subcastes: [
      'Malik Pathan',
      'Sunni Malik',
      'All Malik Biradaris'
    ]
  },
  {
    id: 'Mirza_Mughal',
    nameHi: 'मिर्ज़ा / मुग़ल (Mirza / Mughal)',
    nameEn: 'Mirza / Mughal',
    subcastes: [
      'Barlas',
      'Chughtai',
      'Qizilbash',
      'All Mughal Subcastes'
    ]
  },
  {
    id: 'Mansoori',
    nameHi: 'मंसूरी / धुनिया / पिंजरा (Mansoori / Dhunia / Pinjara)',
    nameEn: 'Mansoori / Dhunia / Pinjara',
    subcastes: [
      'Mansoori',
      'Dhunia',
      'Pinjara',
      'All Mansoori Biradaris'
    ]
  },
  {
    id: 'Saifi',
    nameHi: 'सैफ़ी / लोहार / बढ़ई (Saifi / Lohar / Tarkhan)',
    nameEn: 'Saifi / Lohar / Tarkhan',
    subcastes: [
      'Saifi Lohar',
      'Saifi Suthar',
      'All Saifi Biradaris'
    ]
  },
  {
    id: 'Salmani',
    nameHi: 'सलमानी (Salmani / Hajjam / Nai)',
    nameEn: 'Salmani / Hajjam / Nai',
    subcastes: [
      'Salmani',
      'All Salmani Biradaris'
    ]
  },
  {
    id: 'Rayeen',
    nameHi: 'राईं / कुंजड़ा (Rayeen / Kunjra / Sabzifarosh)',
    nameEn: 'Rayeen / Kunjra / Sabzifarosh',
    subcastes: [
      'Rayeen',
      'Kunjra',
      'All Rayeen Biradaris'
    ]
  },
  {
    id: 'Memon',
    nameHi: 'मेमन (Memon)',
    nameEn: 'Memon',
    subcastes: [
      'Halai Memon',
      'Kutchi Memon',
      'Okhai Memon',
      'Sindhi Memon',
      'All Memon Subcastes'
    ]
  },
  {
    id: 'Bohra',
    nameHi: 'बोहरा / दाऊदी बोहरा (Bohra / Dawoodi Bohra)',
    nameEn: 'Bohra / Dawoodi Bohra',
    subcastes: [
      'Dawoodi Bohra',
      'Alavi Bohra',
      'Sulaymani Bohra'
    ]
  },
  {
    id: 'Khoja',
    nameHi: 'खोजा / इस्माइली (Khoja / Ismaili / Ithna Ashari)',
    nameEn: 'Khoja / Ismaili / Ithna Ashari',
    subcastes: [
      'Ismaili Khoja',
      'Ithna Ashari Khoja',
      'All Khoja Biradaris'
    ]
  },
  {
    id: 'Muslim_Rajput',
    nameHi: 'मुस्लिम राजपूत / रांघड़ / खानज़ादा / मलकाना (Muslim Rajput / Ranghar / Khanzada)',
    nameEn: 'Muslim Rajput / Ranghar / Khanzada',
    subcastes: [
      'Ranghar Rajput',
      'Khanzada Rajput',
      'Malkana Rajput',
      'Chauhan Muslim',
      'Bhati Muslim',
      'All Muslim Rajput Clans'
    ]
  },
  {
    id: 'Muslim_Jat',
    nameHi: 'मुस्लिम जाट / मुल्ला जाट / चौधरी (Muslim Jat / Choudhary)',
    nameEn: 'Muslim Jat / Choudhary',
    subcastes: [
      'Muslim Jat',
      'Choudhary',
      'All Muslim Jat Gotras'
    ]
  },
  {
    id: 'Muslim_Gujjar',
    nameHi: 'मुस्लिम गुर्जर / चेची / कसाना (Muslim Gujjar / Chechi)',
    nameEn: 'Muslim Gujjar / Chechi',
    subcastes: [
      'Chechi Gujjar',
      'Kasana Gujjar',
      'Bhati Gujjar',
      'All Muslim Gujjar Clans'
    ]
  },
  {
    id: 'Shah_Faqir',
    nameHi: 'शाह / फ़क़ीर / साईं (Shah / Faqir / Sai / Malang)',
    nameEn: 'Shah / Faqir / Sai / Malang',
    subcastes: [
      'Shah',
      'Faqir',
      'Malang',
      'All Shah Biradaris'
    ]
  },
  {
    id: 'Idrisi',
    nameHi: 'इदरीसी / दर्ज़ी (Idrisi / Darzi)',
    nameEn: 'Idrisi / Darzi',
    subcastes: [
      'Idrisi',
      'Darzi',
      'All Idrisi Biradaris'
    ]
  },
  {
    id: 'Ghosi_Gaddi',
    nameHi: 'घोसी / गद्दी (Ghosi / Gaddi)',
    nameEn: 'Ghosi / Gaddi',
    subcastes: [
      'Ghosi',
      'Gaddi',
      'All Ghosi Biradaris'
    ]
  },
  {
    id: 'All_Muslim_Biradaris',
    nameHi: 'सभी मुस्लिम बिरादरी (All Muslim Biradaris Welcome / Open to All)',
    nameEn: 'All Muslim Biradaris Welcome',
    subcastes: ['Biradari No Bar / Open to All Muslim Biradaris']
  }
];

export const getCastesForReligion = (religion: 'Hindu' | 'Muslim' | string): CasteItem[] => {
  if (religion === 'Muslim') return MUSLIM_CASTES;
  if (religion === 'Hindu') return HINDU_CASTES;
  return [...HINDU_CASTES, ...MUSLIM_CASTES];
};
