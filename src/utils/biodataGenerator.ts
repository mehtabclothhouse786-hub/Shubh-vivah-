import { UserProfile } from '../types';

export function generateMarriageBiodataHTML(profile: UserProfile): string {
  const isMuslim = profile.religion === 'Muslim';

  return `
    <div id="marriage-biodata-document" style="font-family: 'Cormorant Garamond', 'Georgia', serif; max-width: 750px; margin: 0 auto; padding: 36px; background: #FAF9F6; border: 2px solid #5A5A40; color: #4A453E; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border-radius: 16px;">
      <div style="text-align: center; border-bottom: 2px solid #D4A373; padding-bottom: 16px; margin-bottom: 20px;">
        <div style="font-size: ${isMuslim ? '22px' : '24px'}; color: #5A5A40; font-weight: bold; margin-bottom: 4px;">
          ${isMuslim ? '॥ بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ॥ (Bismillah ir-Rahman ir-Rahim)' : '॥ श्री गणेशाय नमः ॥'}
        </div>
        <h1 style="font-size: 26px; margin: 6px 0; color: #5A5A40; text-transform: uppercase; letter-spacing: 2px;">
          ${isMuslim ? 'निकाह बायोडाटा (Islamic Marriage Biodata)' : 'वैवाहिक बायोडाटा (Marriage Biodata)'}
        </h1>
        <div style="font-size: 14px; color: #8C8479; font-style: italic;">
          स्मार्ट विवाह (Smart Vivah) - ${isMuslim ? 'दीनदार एवं मुकद्दस निकाह हेतु' : 'शुभ संबंध हेतु'} व्यक्तिगत एवं पारिवारिक विवरण
        </div>
      </div>

      <div style="display: flex; gap: 24px; margin-bottom: 24px; align-items: center; border-bottom: 1px dashed #D4A373; padding-bottom: 20px;">
        ${profile.photos[0] ? `
          <div style="width: 140px; height: 160px; border-radius: 12px; overflow: hidden; border: 2px solid #5A5A40; flex-shrink: 0;">
            <img src="${profile.photos[0]}" alt="${profile.fullName}" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
        ` : ''}
        <div style="flex: 1;">
          <h2 style="font-size: 22px; color: #5A5A40; margin: 0 0 6px 0;">${profile.fullName}</h2>
          <div style="font-size: 15px; margin-bottom: 4px;"><strong>आयु / जन्म तिथि:</strong> ${profile.age} वर्ष (${profile.dob})</div>
          <div style="font-size: 15px; margin-bottom: 4px;"><strong>कद (Height):</strong> ${profile.heightFeet} फीट ${profile.heightInches} इंच</div>
          <div style="font-size: 15px; margin-bottom: 4px;"><strong>धर्म एवं बिरादरी/जाति:</strong> ${profile.religion} - ${profile.caste} ${profile.subCaste ? `(${profile.subCaste})` : ''}</div>
          <div style="font-size: 15px;"><strong>वर्तमान निवास:</strong> ${profile.city}, ${profile.state}</div>
        </div>
      </div>

      ${isMuslim ? `
        <!-- Islamic Religious Details Section -->
        <div style="margin-bottom: 20px;">
          <h3 style="background: #5A5A40; color: #FAF9F6; padding: 6px 12px; margin: 0 0 10px 0; font-size: 16px; border-radius: 6px;">
            १. इस्लामी व दीनी विवरण (Islamic & Deen Details)
          </h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 6px; border: 1px solid #E8E4DE; width: 25%;"><strong>मसलक / फ़िरक़ा:</strong></td>
              <td style="padding: 6px; border: 1px solid #E8E4DE; width: 25%;">${profile.islamicDetails?.maslak || 'सुन्नी हनफ़ी (Sunni)'}</td>
              <td style="padding: 6px; border: 1px solid #E8E4DE; width: 25%;"><strong>नमाज़ (Salah):</strong></td>
              <td style="padding: 6px; border: 1px solid #E8E4DE; width: 25%;">${profile.islamicDetails?.namazSalah || '५ वक़्त की पाबंदी (5 Times)'}</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid #E8E4DE;"><strong>क़ुरआन तिलावत:</strong></td>
              <td style="padding: 6px; border: 1px solid #E8E4DE;">${profile.islamicDetails?.quranReading || 'नियमित (Regular)'}</td>
              <td style="padding: 6px; border: 1px solid #E8E4DE;"><strong>रोज़े (Fasting):</strong></td>
              <td style="padding: 6px; border: 1px solid #E8E4DE;">${profile.islamicDetails?.fastingRoza || 'पूरे रमज़ान (All Ramadan)'}</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid #E8E4DE;"><strong>हिजाब / दाढ़ी:</strong></td>
              <td style="padding: 6px; border: 1px solid #E8E4DE;">${profile.islamicDetails?.hijabOrBeard || 'शालीन (Modest)'}</td>
              <td style="padding: 6px; border: 1px solid #E8E4DE;"><strong>महर (Mehr):</strong></td>
              <td style="padding: 6px; border: 1px solid #E8E4DE;">${profile.islamicDetails?.mehrExpectation || 'शरीयत के अनुसार (As per Shariah)'}</td>
            </tr>
          </table>
        </div>
      ` : `
        <!-- Hindu Kundali Details Section -->
        <div style="margin-bottom: 20px;">
          <h3 style="background: #5A5A40; color: #FAF9F6; padding: 6px 12px; margin: 0 0 10px 0; font-size: 16px; border-radius: 6px;">
            १. कुंडली एवं ज्योतिषीय विवरण (Horoscope Details)
          </h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 6px; border: 1px solid #E8E4DE; width: 25%;"><strong>राशि (Rashi):</strong></td>
              <td style="padding: 6px; border: 1px solid #E8E4DE; width: 25%;">${profile.kundali.rashi}</td>
              <td style="padding: 6px; border: 1px solid #E8E4DE; width: 25%;"><strong>नक्षत्र (Nakshatra):</strong></td>
              <td style="padding: 6px; border: 1px solid #E8E4DE; width: 25%;">${profile.kundali.nakshatra}</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid #E8E4DE;"><strong>मांगलिक स्थिति:</strong></td>
              <td style="padding: 6px; border: 1px solid #E8E4DE;">${profile.kundali.manglik}</td>
              <td style="padding: 6px; border: 1px solid #E8E4DE;"><strong>गोत्र (Gotra):</strong></td>
              <td style="padding: 6px; border: 1px solid #E8E4DE;">${profile.kundali.gotra || 'कश्यप'}</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid #E8E4DE;"><strong>जन्म समय:</strong></td>
              <td style="padding: 6px; border: 1px solid #E8E4DE;">${profile.kundali.birthTime || 'उपलब्ध नहीं'}</td>
              <td style="padding: 6px; border: 1px solid #E8E4DE;"><strong>जन्म स्थान:</strong></td>
              <td style="padding: 6px; border: 1px solid #E8E4DE;">${profile.kundali.birthPlace || profile.city}</td>
            </tr>
          </table>
        </div>
      `}

      <!-- Education & Career Section -->
      <div style="margin-bottom: 20px;">
        <h3 style="background: #5A5A40; color: #FAF9F6; padding: 6px 12px; margin: 0 0 10px 0; font-size: 16px; border-radius: 6px;">
          २. शिक्षा एवं कार्यक्षेत्र (Education & Career)
        </h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 6px; border: 1px solid #E8E4DE; width: 30%;"><strong>उच्चतम शिक्षा:</strong></td>
            <td style="padding: 6px; border: 1px solid #E8E4DE;">${profile.highestEducation}</td>
          </tr>
          <tr>
            <td style="padding: 6px; border: 1px solid #E8E4DE;"><strong>कॉलेज / संस्थान:</strong></td>
            <td style="padding: 6px; border: 1px solid #E8E4DE;">${profile.collegeUniversity}</td>
          </tr>
          <tr>
            <td style="padding: 6px; border: 1px solid #E8E4DE;"><strong>व्यवसाय / पद:</strong></td>
            <td style="padding: 6px; border: 1px solid #E8E4DE;">${profile.occupation} (${profile.companyName})</td>
          </tr>
          <tr>
            <td style="padding: 6px; border: 1px solid #E8E4DE;"><strong>वार्षिक आय:</strong></td>
            <td style="padding: 6px; border: 1px solid #E8E4DE;">₹${profile.annualIncomeLakhs} लाख प्रति वर्ष ${profile.isGovtJob ? '(सरकारी सेवा)' : ''}</td>
          </tr>
        </table>
      </div>

      <!-- Family Background Section -->
      <div style="margin-bottom: 20px;">
        <h3 style="background: #5A5A40; color: #FAF9F6; padding: 6px 12px; margin: 0 0 10px 0; font-size: 16px; border-radius: 6px;">
          ३. पारिवारिक पृष्ठभूमि (Family Background)
        </h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 6px; border: 1px solid #E8E4DE; width: 30%;"><strong>पिता का व्यवसाय:</strong></td>
            <td style="padding: 6px; border: 1px solid #E8E4DE;">${profile.family.fatherOccupation}</td>
          </tr>
          <tr>
            <td style="padding: 6px; border: 1px solid #E8E4DE;"><strong>माता का विवरण:</strong></td>
            <td style="padding: 6px; border: 1px solid #E8E4DE;">${profile.family.motherOccupation}</td>
          </tr>
          <tr>
            <td style="padding: 6px; border: 1px solid #E8E4DE;"><strong>परिवार का प्रकार:</strong></td>
            <td style="padding: 6px; border: 1px solid #E8E4DE;">${profile.family.familyType} (${profile.family.familyValues})</td>
          </tr>
        </table>
      </div>

      <!-- Contact Section -->
      <div style="background: #F5F5F0; padding: 14px; border: 1px dashed #D4A373; border-radius: 12px; text-align: center;">
        <div style="font-weight: bold; color: #5A5A40; font-size: 15px; margin-bottom: 4px;">संपर्क सूत्र (Contact Details for Family)</div>
        <div style="font-size: 14px; color: #4A453E;"><strong>मोबाइल:</strong> ${profile.mobile} &nbsp;|&nbsp; <strong>ईमेल:</strong> ${profile.email}</div>
        <div style="font-size: 12px; color: #8C8479; margin-top: 4px;">यह बायोडाटा 'स्मार्ट विवाह (Smart Vivah)' द्वारा सत्यापित है।</div>
      </div>
    </div>
  `;
}
