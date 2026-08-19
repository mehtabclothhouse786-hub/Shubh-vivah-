import { UserProfile, MarriageWorkflowData } from '../types';

export function generateMarriageCertificateHTML(
  groom: UserProfile,
  bride: UserProfile,
  workflow: MarriageWorkflowData
): string {
  const isMuslim = workflow.tradition === 'Muslim' || groom.religion === 'Muslim' || bride.religion === 'Muslim';
  const certNo = workflow.certificateNumber || `SV-REG-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const regDate = workflow.registrationDate || new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const marriageDate = workflow.weddingDate || new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  return `
    <div style="font-family: 'Cormorant Garamond', 'Plus Jakarta Sans', Georgia, serif; max-width: 800px; margin: 0 auto; padding: 32px; background: #FFFDF9; border: 8px double #5A5A40; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); color: #2D2A26;">
      
      <!-- Top Crest & Header -->
      <div style="text-align: center; border-bottom: 2px solid #D4A373; padding-bottom: 18px; margin-bottom: 24px;">
        <div style="font-size: 26px; font-weight: bold; color: #5A5A40; letter-spacing: 2px;">
          ${isMuslim ? '☪️ स्मार्ट निकाहनामा एवं विवाह पंजीकरण' : '🕉️ स्मार्ट विवाह पंजीकरण प्रमाण पत्र'}
        </div>
        <div style="font-size: 15px; color: #D4A373; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 4px;">
          ${isMuslim ? 'OFFICIAL ISLAMIC NIKAHNAMA & MARRIAGE RECORD' : 'CERTIFICATE OF HINDU / SPECIAL MARRIAGE REGISTRATION'}
        </div>
        <div style="font-size: 12px; color: #8C8479; margin-top: 4px;">
          (Issued under Smart Vivah Verified Digital Registry • Reference ID: ${certNo})
        </div>
      </div>

      <!-- Main Declaration -->
      <div style="text-align: center; font-size: 14px; font-style: italic; color: #5A5A40; margin-bottom: 24px; line-height: 1.6;">
        ${isMuslim 
          ? 'यह तस्दीक की जाती है कि अल्लाह तआला के फ़ज़्ल-ओ-करम से शरई उसूलों, रज़ामंदी एवं गवाहों की मौजूदगी में मुकद्दस निकाह संपन्न हुआ।'
          : 'यह प्रमाणित किया जाता है कि दोनों पक्षों एवं परिवारों की पूर्ण सहमति, वैदिक संस्कारों एवं सामाजिक मर्यादा के अनुसार शुभ विवाह संपन्न हुआ।'}
      </div>

      <!-- Couple Details Cards -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
        
        <!-- Groom Card -->
        <div style="border: 1px solid #E8E4DE; background: #FAF9F6; border-radius: 8px; padding: 16px; text-align: center;">
          <img src="${groom.photos[0] || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200'}" 
               style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid #D4A373; margin-bottom: 8px;" />
          <div style="font-size: 12px; text-transform: uppercase; color: #D4A373; font-weight: bold;">
            ${isMuslim ? 'दूल्हा (The Groom / शौहर)' : 'वर (The Groom)'}
          </div>
          <div style="font-size: 18px; font-weight: bold; color: #5A5A40; margin: 2px 0;">${groom.fullName}</div>
          <div style="font-size: 13px; color: #4A453E;">सुपुत्र: श्री ${groom.family.fatherOccupation ? 'पिताजी' : 'पारिवारिक मुखिया'} & श्रीमती माताजी</div>
          <div style="font-size: 12px; color: #8C8479; margin-top: 4px;">स्थान: ${groom.city}, ${groom.state}</div>
          <div style="font-size: 12px; color: #8C8479;">समुदाय: ${groom.caste} (${groom.religion})</div>
        </div>

        <!-- Bride Card -->
        <div style="border: 1px solid #E8E4DE; background: #FAF9F6; border-radius: 8px; padding: 16px; text-align: center;">
          <img src="${bride.photos[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}" 
               style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid #D4A373; margin-bottom: 8px;" />
          <div style="font-size: 12px; text-transform: uppercase; color: #D4A373; font-weight: bold;">
            ${isMuslim ? 'दुल्हन (The Bride / ज़ौजा)' : 'वधू (The Bride)'}
          </div>
          <div style="font-size: 18px; font-weight: bold; color: #5A5A40; margin: 2px 0;">${bride.fullName}</div>
          <div style="font-size: 13px; color: #4A453E;">सुपुत्री: श्री ${bride.family.fatherOccupation ? 'पिताजी' : 'पारिवारिक मुखिया'} & श्रीमती माताजी</div>
          <div style="font-size: 12px; color: #8C8479; margin-top: 4px;">स्थान: ${bride.city}, ${bride.state}</div>
          <div style="font-size: 12px; color: #8C8479;">समुदाय: ${bride.caste} (${bride.religion})</div>
        </div>

      </div>

      <!-- Wedding Particulars Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px;">
        <tr style="background: #F5F5F0;">
          <td style="padding: 8px 12px; border: 1px solid #E8E4DE; font-weight: bold; width: 35%; color: #5A5A40;">विवाह/निकाह की तिथि (Date of Solemnization):</td>
          <td style="padding: 8px 12px; border: 1px solid #E8E4DE; color: #2D2A26;">${marriageDate}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; border: 1px solid #E8E4DE; font-weight: bold; color: #5A5A40;">विवाह स्थल / मंडप (Venue):</td>
          <td style="padding: 8px 12px; border: 1px solid #E8E4DE; color: #2D2A26;">${workflow.weddingVenue || `${groom.city}, भारत`}</td>
        </tr>
        ${isMuslim ? `
        <tr style="background: #F5F5F0;">
          <td style="padding: 8px 12px; border: 1px solid #E8E4DE; font-weight: bold; color: #5A5A40;">तयशुदा मेहर (Mehr Settled):</td>
          <td style="padding: 8px 12px; border: 1px solid #E8E4DE; color: #2D2A26; font-weight: bold;">
            ${workflow.expectations.mehrAmount || '₹1,51,000 / शरई मेहर'} (${workflow.expectations.mehrType || 'Mu\'ajjal - तत्काल देय'})
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; border: 1px solid #E8E4DE; font-weight: bold; color: #5A5A40;">काज़ी / वक़ील एवं गवाह (Officiant & Witnesses):</td>
          <td style="padding: 8px 12px; border: 1px solid #E8E4DE; color: #2D2A26;">
            काज़ी: ${workflow.qaziName || 'मौलाना हाफ़िज़ मुफ़्ती साहब'} | गवाह 1: ${workflow.witness1Name || 'पारिवारिक साक्षी'} | गवाह 2: ${workflow.witness2Name || 'पारिवारिक साक्षी'}
          </td>
        </tr>
        ` : `
        <tr style="background: #F5F5F0;">
          <td style="padding: 8px 12px; border: 1px solid #E8E4DE; font-weight: bold; color: #5A5A40;">वैदिक संस्कार एवं पंडित जी (Officiating Priest):</td>
          <td style="padding: 8px 12px; border: 1px solid #E8E4DE; color: #2D2A26;">${workflow.panditName || 'पं. शशिकांत शास्त्री (वैदिक पुरोहित)'} • सप्तपदी एवं पाणिग्रहण संस्कार</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; border: 1px solid #E8E4DE; font-weight: bold; color: #5A5A40;">दहेज रहित घोषणा (Anti-Dowry Declaration):</td>
          <td style="padding: 8px 12px; border: 1px solid #E8E4DE; color: #2E7D32; font-weight: bold;">
            ✓ दोनों पक्षों द्वारा पूर्ण रूप से दहेज मुक्त, सादगीपूर्ण एवं सम्मानजनक विवाह संकल्पित
          </td>
        </tr>
        `}
      </table>

      <!-- Signatures & Official Stamp Grid -->
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-top: 32px; padding-top: 20px; border-top: 1px dashed #D4A373; text-align: center;">
        <div>
          <div style="height: 40px; font-family: 'Brush Script MT', cursive; font-size: 20px; color: #5A5A40;">${groom.fullName}</div>
          <div style="border-top: 1px solid #8C8479; padding-top: 4px; font-size: 11px; color: #8C8479;">हस्ताक्षर: वर / दूल्हा (Groom)</div>
        </div>
        
        <div>
          <div style="height: 40px; display: flex; align-items: center; justify-content: center;">
            <div style="border: 2px solid #D4A373; color: #5A5A40; border-radius: 50%; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; text-transform: uppercase;">
              SEAL
            </div>
          </div>
          <div style="border-top: 1px solid #8C8479; padding-top: 4px; font-size: 11px; color: #8C8479;">Smart Vivah Digital Seal</div>
        </div>

        <div>
          <div style="height: 40px; font-family: 'Brush Script MT', cursive; font-size: 20px; color: #5A5A40;">${bride.fullName}</div>
          <div style="border-top: 1px solid #8C8479; padding-top: 4px; font-size: 11px; color: #8C8479;">हस्ताक्षर: वधू / दुल्हन (Bride)</div>
        </div>
      </div>

      <!-- Footer Note -->
      <div style="margin-top: 24px; text-align: center; font-size: 11px; color: #8C8479;">
        पंजीकरण संख्या: <strong>${certNo}</strong> • जारी दिनांक: ${regDate} • 
        <span style="color: #5A5A40; font-weight: 600;">स्मार्ट विवाह डिजिटल वैवाहिक रजिस्टर (Smart Vivah Registry)</span>
      </div>
    </div>
  `;
}
