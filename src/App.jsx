// SCOUT FLYER BUILDER - Complete React App
// Professional design matching Troop 111 flyer aesthetic

import React, { useState, useRef } from 'react';

// ============================================================================
// IMAGE LIBRARY - Curated Scout Imagery from Unsplash/Pexels
// ============================================================================
const IMAGE_LIBRARY = {
  hero: [
    { id: 'adventure_1', name: 'Group Hiking Adventure', url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&h=600&fit=crop', category: 'Hero' },
    { id: 'adventure_2', name: 'Mountain Trail', url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&h=600&fit=crop', category: 'Hero' },
    { id: 'adventure_3', name: 'Forest Exploration', url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&h=600&fit=crop', category: 'Hero' },
  ],
  activity: [
    { id: 'hiking_1', name: 'Hiking Adventure', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', category: 'Hiking' },
    { id: 'leadership_1', name: 'Leadership Training', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop', category: 'Leadership' },
    { id: 'service_1', name: 'Community Service', url: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop', category: 'Service' },
    { id: 'campfire_1', name: 'Campfire Gathering', url: 'https://images.unsplash.com/photo-1476611338391-6f395a0ebc7b?w=400&h=300&fit=crop', category: 'Social' },
    { id: 'diversity_1', name: 'Diverse Group', url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop', category: 'Diversity' },
    { id: 'outdoor_1', name: 'Outdoor Skills', url: 'https://images.unsplash.com/photo-1445522330404-369f8be6050b?w=400&h=300&fit=crop', category: 'Skills' },
    { id: 'camping_1', name: 'Camping', url: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400&h=300&fit=crop', category: 'Camping' },
    { id: 'nature_1', name: 'Nature Walk', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop', category: 'Nature' },
  ]
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
const fileToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = (error) => reject(error);
  reader.readAsDataURL(file);
});

const exportTemplate = (formData) => {
  const template = {
    metadata: { savedDate: new Date().toISOString(), appVersion: '2.0' },
    troopBasics: { troopName: formData.troopName, troopType: formData.troopType, ageRange: formData.ageRange, programFocus: formData.programFocus },
    meetingLocation: { day: formData.meetingDay, time: formData.meetingTime, endTime: formData.meetingEndTime, address: formData.address, locationName: formData.locationName },
    contact: { email: formData.email, website: formData.website, instagram: formData.instagram, phone: formData.phone },
    description: { whyJoin: formData.whyJoin, whatIsScouting: formData.whatIsScouting, highlights: formData.highlights, costs: formData.costs, activities: formData.activities },
    images: { hero: formData.heroImageRef, activityGallery: formData.activityImagesRef, detailGallery: formData.detailImagesRef }
  };
  const el = document.createElement('a');
  el.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(template, null, 2)));
  el.setAttribute('download', `${formData.troopName.replace(/\s+/g, '_')}_Template.json`);
  el.style.display = 'none';
  document.body.appendChild(el);
  el.click();
  document.body.removeChild(el);
};

const importTemplate = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = (e) => { try { resolve(JSON.parse(e.target.result)); } catch { reject(new Error('Invalid template file')); } };
  reader.onerror = () => reject(new Error('Failed to read file'));
  reader.readAsText(file);
});

// ============================================================================
// GENERATE HTML FLYER - Professional Design (Troop 111 Style)
// ============================================================================
const generateHTML = (formData) => {
  const placeholder = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22800%22 height=%22400%22%3E%3Crect fill=%22%23061A3A%22 width=%22800%22 height=%22400%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 fill=%22%23F4B400%22 font-size=%2224%22 text-anchor=%22middle%22 dy=%22.3em%22%3EUpload Image%3C/text%3E%3C/svg%3E';
  const heroImg = formData.heroImage || placeholder;
  const actImgs = formData.activityImages.map(img => img || placeholder);
  const detImgs = formData.detailImages.map(img => img || placeholder);

  // Build the word cloud with alternating styles
  const highlightStyles = [
    { size: '22px', color: '#F4B400', bold: true },
    { size: '18px', color: '#FFFFFF', bold: true },
    { size: '16px', color: '#8AAED0', bold: true },
    { size: '24px', color: '#F4B400', bold: true },
    { size: '17px', color: '#FFFFFF', bold: false },
    { size: '20px', color: '#8AAED0', bold: true },
    { size: '15px', color: '#F4B400', bold: true },
    { size: '19px', color: '#FFFFFF', bold: true },
    { size: '21px', color: '#8AAED0', bold: false },
    { size: '16px', color: '#F4B400', bold: true },
    { size: '18px', color: '#FFFFFF', bold: true },
    { size: '23px', color: '#8AAED0', bold: true },
  ];

  const highlightCloud = (formData.highlights || ['Adventure', 'Leadership', 'Service']).map((h, i) => {
    const style = highlightStyles[i % highlightStyles.length];
    return `<span style="font-size:${style.size};color:${style.color};font-weight:${style.bold ? 'bold' : 'normal'};margin:0 12px;display:inline-block;font-family:'Segoe UI',Arial,sans-serif;">${h}</span>`;
  }).join('');

  // Activity list for slide 2
  const defaultActivities = ['Monthly camping trips', 'Hiking & backpacking adventures', 'Community service projects', 'Leadership & merit badge training', 'Summer camp experiences', 'Outdoor skills development'];
  const activities = formData.activities && formData.activities.length > 0 ? formData.activities : defaultActivities;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${formData.troopName || 'Scout Troop'} - Recruitment Flyer</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Inter','Segoe UI',Arial,sans-serif;background:#f0f0f0;}

.slide{width:8.5in;height:11in;margin:0.25in auto;overflow:hidden;position:relative;box-shadow:0 4px 20px rgba(0,0,0,0.15);}

/* ===== SLIDE 1 ===== */
.slide-1{background:#061A3A;color:#fff;display:flex;flex-direction:column;}

.hero-section{position:relative;width:100%;height:5.6in;overflow:hidden;}
.hero-section img{width:100%;height:100%;object-fit:cover;}
.hero-overlay{position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(180deg,rgba(6,26,58,0.35) 0%,rgba(6,26,58,0.6) 100%);}

.hero-text{position:absolute;bottom:0.6in;left:0.6in;z-index:2;}
.hero-tagline{font-size:28pt;font-weight:800;color:#fff;text-shadow:2px 3px 6px rgba(0,0,0,0.5);letter-spacing:-0.5px;}
.hero-subtitle{font-size:10.5pt;font-weight:600;color:#EEF6FF;margin-top:6px;letter-spacing:1px;}

.logo-area{position:absolute;top:0.1in;right:0.1in;width:2.4in;height:2.4in;z-index:3;}
.logo-area img{width:100%;height:100%;object-fit:contain;}
.logo-placeholder{width:100%;height:100%;border:2px dashed rgba(255,255,255,0.3);border-radius:50%;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.4);font-size:11px;text-align:center;padding:20px;}

.word-cloud{padding:0.25in 0.4in;text-align:center;line-height:2.2;min-height:0.9in;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;}

.photo-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0;padding:0 0.42in;height:1.78in;}
.photo-grid-item{position:relative;overflow:hidden;border-radius:8px;margin:0 4px;}
.photo-grid-item img{width:100%;height:100%;object-fit:cover;}
.photo-grid-item::after{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(6,26,58,0.15);border-radius:8px;}

.meeting-bar{margin:0.15in 0.42in;padding:0.22in 0.3in;background:rgba(255,255,255,0.08);border-radius:8px;display:flex;align-items:center;}
.meeting-left{flex:0 0 auto;padding-right:0.3in;border-right:2px solid rgba(255,255,255,0.2);}
.meeting-right{padding-left:0.3in;}
.meeting-label{font-size:9pt;font-weight:700;color:#F4B400;text-transform:uppercase;letter-spacing:1px;}
.meeting-value{font-size:11pt;font-weight:700;color:#fff;margin-top:2px;}

.contact-bar{margin:0.1in 0.42in 0.15in;text-align:center;padding:0.15in;font-size:9pt;color:rgba(255,255,255,0.7);}
.contact-bar a{color:#F4B400;text-decoration:none;font-weight:600;}

/* ===== SLIDE 2 ===== */
.slide-2{background:#F8F9FA;display:flex;flex-direction:column;}

.s2-header{background:#061A3A;padding:0.25in 0.5in;display:flex;align-items:center;}
.s2-header-text{flex:1;}
.s2-title{font-size:22pt;font-weight:800;color:#fff;}
.s2-subtitle{font-size:10pt;color:#D8E8FF;margin-top:4px;font-weight:600;}
.s2-logo{width:0.8in;height:0.8in;}
.s2-logo img{width:100%;height:100%;object-fit:contain;}

.s2-cards{display:grid;grid-template-columns:1fr 1fr;gap:0.2in;padding:0.3in 0.42in 0.2in;}
.s2-card{background:#fff;border-radius:12px;padding:0.3in;box-shadow:0 2px 8px rgba(0,0,0,0.06);}
.s2-card-title{font-size:13pt;font-weight:700;color:#061A3A;margin-bottom:0.08in;padding-bottom:0.08in;border-bottom:2px solid #F4B400;}
.s2-card p{font-size:9.5pt;color:#1F2937;line-height:1.55;}
.s2-card ul{font-size:9.5pt;color:#1F2937;line-height:1.7;padding-left:0.2in;}
.s2-card li{margin-bottom:2px;}

.s2-info-cards{display:grid;grid-template-columns:1fr 1fr;gap:0.2in;padding:0 0.42in 0.2in;}
.s2-info-card{background:#061A3A;border-radius:12px;padding:0.25in;color:#fff;}
.s2-info-title{font-size:11pt;font-weight:700;color:#F4B400;margin-bottom:0.08in;}
.s2-info-card ul{font-size:9pt;line-height:1.6;padding-left:0.15in;color:#D8E8FF;}
.s2-info-card li{margin-bottom:2px;}

.s2-contact{margin:0 0.42in;padding:0.25in 0.3in;background:#061A3A;border-radius:12px;display:flex;align-items:flex-start;}
.s2-contact-left{flex:0 0 45%;}
.s2-contact-heading{font-size:14pt;font-weight:800;color:#fff;}
.s2-contact-sub{font-size:8.5pt;color:#D8E8FF;margin-top:4px;}
.s2-contact-divider{width:2px;background:rgba(255,255,255,0.2);align-self:stretch;margin:0 0.2in;}
.s2-contact-right{flex:1;display:grid;grid-template-columns:1fr 1fr;gap:8px;}
.s2-contact-label{font-size:7.5pt;font-weight:700;color:#F4B400;text-transform:uppercase;letter-spacing:1px;}
.s2-contact-value{font-size:9.5pt;font-weight:700;color:#fff;margin-top:1px;word-break:break-all;}

.s2-photos{display:grid;grid-template-columns:repeat(3,1fr);gap:0;padding:0.2in 0.42in;height:1.4in;}
.s2-photo-item{position:relative;overflow:hidden;border-radius:8px;margin:0 4px;}
.s2-photo-item img{width:100%;height:100%;object-fit:cover;}
.s2-photo-item::after{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(6,26,58,0.12);border-radius:8px;}

.s2-footer{background:#061A3A;padding:0.12in 0.42in;display:flex;justify-content:space-between;align-items:center;margin-top:auto;}
.s2-footer-left{font-size:8.5pt;font-weight:700;color:#fff;}
.s2-footer-right{font-size:8.5pt;font-weight:700;color:#fff;text-align:right;}
.s2-welcome{text-align:center;padding:0.08in;font-size:9pt;font-weight:600;color:#061A3A;font-style:italic;}

@media print{
  body{background:#fff;margin:0;padding:0;}
  .slide{box-shadow:none;margin:0;width:100%;height:100%;}
  @page{size:8.5in 11in;margin:0;}
}
</style>
</head>
<body>

<!-- SLIDE 1: HERO -->
<div class="slide slide-1">
  <div class="hero-section">
    <img src="${heroImg}" alt="${formData.troopName || 'Scout Troop'}">
    <div class="hero-overlay"></div>
    <div class="hero-text">
      <div class="hero-tagline">Adventure starts here.</div>
      <div class="hero-subtitle">Scouting America &nbsp;•&nbsp; ${formData.troopType || 'Scouts BSA'} ${formData.ageRange || 'Ages 11-17'}</div>
    </div>
    <div class="logo-area">
      ${formData.logoImage ? `<img src="${formData.logoImage}" alt="Troop Logo">` : `<div class="logo-placeholder">Upload<br>Troop Logo</div>`}
    </div>
  </div>

  <div class="word-cloud">${highlightCloud}</div>

  <div class="photo-grid">
    <div class="photo-grid-item"><img src="${actImgs[0]}" alt="Activity 1"></div>
    <div class="photo-grid-item"><img src="${actImgs[1]}" alt="Activity 2"></div>
    <div class="photo-grid-item"><img src="${actImgs[2]}" alt="Activity 3"></div>
  </div>

  <div class="meeting-bar">
    <div class="meeting-left">
      <div class="meeting-label">${formData.meetingDay || 'Monday'} Nights</div>
      <div class="meeting-value">${formData.meetingTime || '7:00'} - ${formData.meetingEndTime || '8:30 PM'}</div>
    </div>
    <div class="meeting-right">
      <div class="meeting-label">${formData.locationName || 'Meeting Location'}</div>
      <div class="meeting-value">${formData.address || '123 Main St'}</div>
    </div>
  </div>

  <div class="contact-bar">
    Questions? <a href="mailto:${formData.email || ''}">${formData.email || 'email@troop.org'}</a>
    ${formData.instagram ? `&nbsp;&nbsp;|&nbsp;&nbsp;Instagram: <a href="#">${formData.instagram}</a>` : ''}
  </div>
</div>

<!-- SLIDE 2: DETAILS -->
<div class="slide slide-2">
  <div class="s2-header">
    <div class="s2-header-text">
      <div class="s2-title">${formData.troopName || 'Scout Troop'} at a Glance</div>
      <div class="s2-subtitle">A quick guide for new Scouts and families</div>
    </div>
    <div class="s2-logo">
      ${formData.logoImage ? `<img src="${formData.logoImage}" alt="Logo">` : ''}
    </div>
  </div>

  <div class="s2-cards">
    <div class="s2-card">
      <div class="s2-card-title">What is Scouting America?</div>
      <p>${formData.whatIsScouting || 'Scouting America is a youth-led organization that teaches leadership through outdoor, first aid, aquatics, service and other hands-on activities. Scouts elect their own leaders, plan activities and run meetings with guidance from adult volunteers.'}</p>
    </div>
    <div class="s2-card">
      <div class="s2-card-title">Why Join ${formData.troopName || 'Us'}?</div>
      <p>${formData.whyJoin || 'We offer a supportive, inclusive community focused on leadership development, outdoor adventure, and lifelong friendships. Our scouts grow into confident, capable young adults.'}</p>
    </div>
  </div>

  <div class="s2-info-cards">
    <div class="s2-info-card">
      <div class="s2-info-title">When & How Much?</div>
      <ul>
        <li><strong>Weekly meetings:</strong> ${formData.meetingDay || 'Monday'} nights, ${formData.meetingTime || '7:00'} - ${formData.meetingEndTime || '8:30 PM'}</li>
        <li><strong>Location:</strong> ${formData.locationName || 'TBD'}</li>
        <li><strong>Costs:</strong> ${formData.costs || '$150 annual membership + troop dues'}</li>
        <li><strong>Financial assistance available</strong></li>
      </ul>
    </div>
    <div class="s2-info-card">
      <div class="s2-info-title">What Do Scouts Do?</div>
      <ul>
        ${activities.map(a => `<li>${a}</li>`).join('')}
      </ul>
    </div>
  </div>

  <div class="s2-contact">
    <div class="s2-contact-left">
      <div class="s2-contact-heading">Interested in<br>Learning More?</div>
      <div class="s2-contact-sub">Visit a meeting, contact us, or explore the troop online.</div>
    </div>
    <div class="s2-contact-divider"></div>
    <div class="s2-contact-right">
      <div>
        <div class="s2-contact-label">Email</div>
        <div class="s2-contact-value">${formData.email || 'email@troop.org'}</div>
      </div>
      <div>
        <div class="s2-contact-label">Website</div>
        <div class="s2-contact-value">${formData.website || 'www.troop.org'}</div>
      </div>
      ${formData.instagram ? `<div><div class="s2-contact-label">Instagram</div><div class="s2-contact-value">${formData.instagram}</div></div>` : ''}
      ${formData.phone ? `<div><div class="s2-contact-label">Phone</div><div class="s2-contact-value">${formData.phone}</div></div>` : ''}
    </div>
  </div>

  <div class="s2-welcome">Prospective Scouts and families are always welcome.</div>

  <div class="s2-photos">
    <div class="s2-photo-item"><img src="${detImgs[0]}" alt="Activity"></div>
    <div class="s2-photo-item"><img src="${detImgs[1]}" alt="Activity"></div>
    <div class="s2-photo-item"><img src="${detImgs[2]}" alt="Activity"></div>
  </div>

  <div class="s2-footer">
    <div class="s2-footer-left">${formData.email || ''}</div>
    <div class="s2-footer-right">${formData.troopName || 'Scout Troop'}${formData.address ? ', ' + formData.address.split(',').slice(-2).join(',').trim() : ''}</div>
  </div>
</div>

</body>
</html>`;
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================
const ScoutFlyerBuilder = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    troopName: '', troopType: 'Scouts BSA - Girls', ageRange: 'Ages 11-17', programFocus: '',
    meetingDay: 'Monday', meetingTime: '7:00', meetingEndTime: '8:30 PM', address: '', locationName: '',
    email: '', website: '', instagram: '', phone: '',
    whyJoin: '', whatIsScouting: '', highlights: ['Adventure', 'Leadership', 'Service', 'Friendship', 'Campfires', 'Hiking', 'Advancement', 'Teamwork'], costs: '',
    activities: ['Monthly camping trips', 'Hiking & backpacking adventures', 'Community service projects', 'Leadership & merit badge training', 'Summer camp experiences', 'Outdoor skills development'],
    heroImage: '', heroImageRef: '', logoImage: '', logoImageRef: '',
    activityImages: [null, null, null], activityImagesRef: ['', '', ''],
    detailImages: [null, null, null], detailImagesRef: ['', '', ''],
  });

  const [showPreview, setShowPreview] = useState(false);
  const [highlightInput, setHighlightInput] = useState('');
  const [activityInput, setActivityInput] = useState('');
  const templateInputRef = useRef(null);

  const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const addHighlight = () => {
    if (highlightInput.trim()) {
      setFormData(prev => ({ ...prev, highlights: [...prev.highlights, highlightInput.trim()] }));
      setHighlightInput('');
    }
  };
  const removeHighlight = (index) => setFormData(prev => ({ ...prev, highlights: prev.highlights.filter((_, i) => i !== index) }));

  const addActivity = () => {
    if (activityInput.trim()) {
      setFormData(prev => ({ ...prev, activities: [...prev.activities, activityInput.trim()] }));
      setActivityInput('');
    }
  };
  const removeActivity = (index) => setFormData(prev => ({ ...prev, activities: prev.activities.filter((_, i) => i !== index) }));

  const handleImageUpload = async (e, imageType, index = null) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await fileToBase64(file);
      if (imageType === 'hero') setFormData(prev => ({ ...prev, heroImage: base64, heroImageRef: 'custom' }));
      else if (imageType === 'logo') setFormData(prev => ({ ...prev, logoImage: base64, logoImageRef: 'custom' }));
      else if (imageType === 'activity' && index !== null) {
        const imgs = [...formData.activityImages]; const refs = [...formData.activityImagesRef];
        imgs[index] = base64; refs[index] = 'custom';
        setFormData(prev => ({ ...prev, activityImages: imgs, activityImagesRef: refs }));
      } else if (imageType === 'detail' && index !== null) {
        const imgs = [...formData.detailImages]; const refs = [...formData.detailImagesRef];
        imgs[index] = base64; refs[index] = 'custom';
        setFormData(prev => ({ ...prev, detailImages: imgs, detailImagesRef: refs }));
      }
    } catch (error) { alert('Failed to upload image: ' + error.message); }
  };

  const selectFromLibrary = (imageId, imageType, index = null) => {
    const image = [...IMAGE_LIBRARY.hero, ...IMAGE_LIBRARY.activity].find(img => img.id === imageId);
    if (!image) return;
    if (imageType === 'hero') setFormData(prev => ({ ...prev, heroImage: image.url, heroImageRef: imageId }));
    else if (imageType === 'activity' && index !== null) {
      const imgs = [...formData.activityImages]; const refs = [...formData.activityImagesRef];
      imgs[index] = image.url; refs[index] = imageId;
      setFormData(prev => ({ ...prev, activityImages: imgs, activityImagesRef: refs }));
    } else if (imageType === 'detail' && index !== null) {
      const imgs = [...formData.detailImages]; const refs = [...formData.detailImagesRef];
      imgs[index] = image.url; refs[index] = imageId;
      setFormData(prev => ({ ...prev, detailImages: imgs, detailImagesRef: refs }));
    }
  };

  const downloadFlyer = () => {
    const html = generateHTML(formData);
    const el = document.createElement('a');
    el.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(html));
    el.setAttribute('download', `${formData.troopName.replace(/\s+/g, '_') || 'Scout_Flyer'}_Recruitment_Flyer.html`);
    el.style.display = 'none'; document.body.appendChild(el); el.click(); document.body.removeChild(el);
  };

  const handleTemplateLoad = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const t = await importTemplate(file);
      setFormData(prev => ({
        ...prev, ...t.troopBasics,
        meetingDay: t.meetingLocation.day, meetingTime: t.meetingLocation.time, meetingEndTime: t.meetingLocation.endTime || '8:30 PM',
        address: t.meetingLocation.address, locationName: t.meetingLocation.locationName || '',
        email: t.contact.email, website: t.contact.website, instagram: t.contact.instagram, phone: t.contact.phone,
        whyJoin: t.description.whyJoin, whatIsScouting: t.description.whatIsScouting, highlights: t.description.highlights, costs: t.description.costs,
        activities: t.description.activities || prev.activities,
        heroImageRef: t.images.hero, activityImagesRef: t.images.activityGallery, detailImagesRef: t.images.detailGallery,
      }));
      alert('Template loaded! Please re-select or re-upload images.');
    } catch (error) { alert('Failed to load template: ' + error.message); }
  };

  // ============================================================================
  // IMAGE PICKER COMPONENT
  // ============================================================================
  const ImageSlot = ({ label, imageType, index, currentRef, currentImage }) => (
    <div style={{ marginBottom: '12px', padding: '10px', background: '#f8f8f8', borderRadius: '6px' }}>
      <label style={{ fontWeight: 600, fontSize: '13px', display: 'block', marginBottom: '6px' }}>{label}</label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '8px' }}>
        {(imageType === 'hero' ? IMAGE_LIBRARY.hero : IMAGE_LIBRARY.activity).map(img => (
          <button key={img.id} onClick={() => selectFromLibrary(img.id, imageType, index)}
            style={{ border: currentRef === img.id ? '3px solid #F4B400' : '2px solid #ddd', padding: 0, cursor: 'pointer', borderRadius: '6px', overflow: 'hidden', height: '50px' }}>
            <img src={img.url} alt={img.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </button>
        ))}
      </div>
      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, imageType, index)} style={{ fontSize: '12px' }} />
      {currentImage && <p style={{ color: '#2E7D32', fontSize: '11px', marginTop: '4px' }}>✓ Image selected</p>}
    </div>
  );

  // ============================================================================
  // FORM STEPS
  // ============================================================================
  const renderStep = () => {
    switch (step) {
      case 1: return (
        <div>
          <h2 style={styles.stepTitle}>Step 1: Troop Basics</h2>
          <div style={styles.field}><label style={styles.label}>Troop Name *</label><input style={styles.input} placeholder="e.g., Troop 111" value={formData.troopName} onChange={(e) => handleInputChange('troopName', e.target.value)} /></div>
          <div style={styles.field}><label style={styles.label}>Troop Type</label>
            <select style={styles.input} value={formData.troopType} onChange={(e) => handleInputChange('troopType', e.target.value)}>
              <option>Scouts BSA - Girls</option><option>Scouts BSA - Boys</option><option>Cub Scouts</option><option>Venturing</option><option>Sea Scouts</option>
            </select></div>
          <div style={styles.field}><label style={styles.label}>Age Range</label><input style={styles.input} placeholder="Ages 11-17" value={formData.ageRange} onChange={(e) => handleInputChange('ageRange', e.target.value)} /></div>
        </div>
      );
      case 2: return (
        <div>
          <h2 style={styles.stepTitle}>Step 2: Meeting & Location</h2>
          <div style={styles.field}><label style={styles.label}>Meeting Day</label>
            <select style={styles.input} value={formData.meetingDay} onChange={(e) => handleInputChange('meetingDay', e.target.value)}>
              {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(d => <option key={d}>{d}</option>)}
            </select></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={styles.field}><label style={styles.label}>Start Time</label><input style={styles.input} placeholder="7:00" value={formData.meetingTime} onChange={(e) => handleInputChange('meetingTime', e.target.value)} /></div>
            <div style={styles.field}><label style={styles.label}>End Time</label><input style={styles.input} placeholder="8:30 PM" value={formData.meetingEndTime} onChange={(e) => handleInputChange('meetingEndTime', e.target.value)} /></div>
          </div>
          <div style={styles.field}><label style={styles.label}>Location Name *</label><input style={styles.input} placeholder="e.g., Providence United Methodist Church" value={formData.locationName} onChange={(e) => handleInputChange('locationName', e.target.value)} /></div>
          <div style={styles.field}><label style={styles.label}>Full Address *</label><input style={styles.input} placeholder="2810 Providence Rd. • Charlotte, NC 28211" value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} /></div>
        </div>
      );
      case 3: return (
        <div>
          <h2 style={styles.stepTitle}>Step 3: Contact Info</h2>
          <div style={styles.field}><label style={styles.label}>Email *</label><input style={styles.input} type="email" placeholder="ScoutMaster@gmail.com" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} /></div>
          <div style={styles.field}><label style={styles.label}>Website</label><input style={styles.input} placeholder="www.TroopXXX.org" value={formData.website} onChange={(e) => handleInputChange('website', e.target.value)} /></div>
          <div style={styles.field}><label style={styles.label}>Instagram</label><input style={styles.input} placeholder="@TroopXXXBSA" value={formData.instagram} onChange={(e) => handleInputChange('instagram', e.target.value)} /></div>
          <div style={styles.field}><label style={styles.label}>Phone</label><input style={styles.input} type="tel" placeholder="(Optional)" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} /></div>
        </div>
      );
      case 4: return (
        <div>
          <h2 style={styles.stepTitle}>Step 4: Content</h2>
          <div style={styles.field}><label style={styles.label}>Why Join Your Troop?</label>
            <textarea style={{ ...styles.input, minHeight: '80px' }} placeholder="Young women ages 11-17 who want to build leadership skills, explore the outdoors..." value={formData.whyJoin} onChange={(e) => handleInputChange('whyJoin', e.target.value)} /></div>
          <div style={styles.field}><label style={styles.label}>What is Scouting America?</label>
            <textarea style={{ ...styles.input, minHeight: '80px' }} placeholder="Scouting America is a youth-led organization..." value={formData.whatIsScouting} onChange={(e) => handleInputChange('whatIsScouting', e.target.value)} /></div>
          <div style={styles.field}><label style={styles.label}>Annual Costs / Dues</label>
            <input style={styles.input} placeholder="$150 national, $175 troop dues" value={formData.costs} onChange={(e) => handleInputChange('costs', e.target.value)} /></div>
          <div style={styles.field}>
            <label style={styles.label}>Highlight Words (for word cloud on slide 1)</label>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
              <input style={{ ...styles.input, flex: 1 }} placeholder="e.g., Backpacking" value={highlightInput} onChange={(e) => setHighlightInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addHighlight()} />
              <button onClick={addHighlight} style={styles.btnSecondary}>Add</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {formData.highlights.map((h, i) => (
                <span key={i} style={{ background: '#061A3A', color: '#F4B400', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
                  {h} <button onClick={() => removeHighlight(i)} style={{ background: 'none', border: 'none', color: '#F4B400', cursor: 'pointer', marginLeft: '4px' }}>×</button>
                </span>
              ))}
            </div>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Scout Activities (for slide 2 list)</label>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
              <input style={{ ...styles.input, flex: 1 }} placeholder="e.g., Rock climbing" value={activityInput} onChange={(e) => setActivityInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addActivity()} />
              <button onClick={addActivity} style={styles.btnSecondary}>Add</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {formData.activities.map((a, i) => (
                <span key={i} style={{ background: '#f0f0f0', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {a} <button onClick={() => removeActivity(i)} style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer' }}>×</button>
                </span>
              ))}
            </div>
          </div>
        </div>
      );
      case 5: return (
        <div>
          <h2 style={styles.stepTitle}>Step 5: Images</h2>
          <div style={{ marginBottom: '16px', padding: '10px', background: '#f8f8f8', borderRadius: '6px' }}>
            <label style={{ fontWeight: 600, fontSize: '13px', display: 'block', marginBottom: '6px' }}>Troop Logo (appears in top-right corner)</label>
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo')} style={{ fontSize: '12px' }} />
            {formData.logoImage && <p style={{ color: '#2E7D32', fontSize: '11px', marginTop: '4px' }}>✓ Logo uploaded</p>}
          </div>
          <ImageSlot label="Hero Image (large banner photo)" imageType="hero" currentRef={formData.heroImageRef} currentImage={formData.heroImage} />
          <h3 style={{ fontSize: '14px', color: '#061A3A', margin: '16px 0 8px' }}>Slide 1 Activity Photos (3 images)</h3>
          {[0, 1, 2].map(i => <ImageSlot key={`act-${i}`} label={`Activity Photo ${i + 1}`} imageType="activity" index={i} currentRef={formData.activityImagesRef[i]} currentImage={formData.activityImages[i]} />)}
          <h3 style={{ fontSize: '14px', color: '#061A3A', margin: '16px 0 8px' }}>Slide 2 Detail Photos (3 images)</h3>
          {[0, 1, 2].map(i => <ImageSlot key={`det-${i}`} label={`Detail Photo ${i + 1}`} imageType="detail" index={i} currentRef={formData.detailImagesRef[i]} currentImage={formData.detailImages[i]} />)}
        </div>
      );
      default: return null;
    }
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px', padding: '20px', background: '#061A3A', borderRadius: '12px', color: '#fff' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#F4B400', margin: 0 }}>Scout Flyer Generator</h1>
          <p style={{ color: '#D8E8FF', fontSize: '14px', marginTop: '6px' }}>Create a professional recruitment flyer for your Scout troop in minutes</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: showPreview ? '400px 1fr' : '1fr', gap: '20px' }}>
          {/* Form Panel */}
          <div>
            <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              {/* Step indicators */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
                {[1, 2, 3, 4, 5].map(s => (
                  <button key={s} onClick={() => setStep(s)}
                    style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 600,
                      background: step === s ? '#061A3A' : '#f0f0f0', color: step === s ? '#F4B400' : '#666' }}>
                    {s}. {['Basics', 'Location', 'Contact', 'Content', 'Images'][s - 1]}
                  </button>
                ))}
              </div>

              {renderStep()}

              {/* Navigation */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                {step > 1 && <button onClick={() => setStep(step - 1)} style={styles.btnSecondary}>← Back</button>}
                {step < 5 && <button onClick={() => setStep(step + 1)} style={styles.btnPrimary}>Next →</button>}
              </div>

              {/* Action buttons */}
              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button onClick={() => setShowPreview(true)} style={{ ...styles.btnPrimary, width: '100%', padding: '12px', fontSize: '14px' }}>
                  ✓ Generate Flyer Preview
                </button>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => exportTemplate(formData)} style={{ ...styles.btnSecondary, flex: 1 }}>💾 Save Template</button>
                  <button onClick={() => templateInputRef.current?.click()} style={{ ...styles.btnSecondary, flex: 1 }}>📂 Load Template</button>
                </div>
                <input ref={templateInputRef} type="file" accept=".json" onChange={handleTemplateLoad} style={{ display: 'none' }} />
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div>
              <div style={{ marginBottom: '12px', display: 'flex', gap: '8px', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={downloadFlyer} style={{ ...styles.btnPrimary, padding: '10px 20px' }}>⬇️ Download HTML Flyer</button>
                  <button onClick={() => { const html = generateHTML(formData); const w = window.open('', '_blank'); w.document.write(html); w.document.close(); }} style={styles.btnSecondary}>
                    🔍 Full Preview
                  </button>
                </div>
                <p style={{ fontSize: '11px', color: '#666' }}>Open HTML → Print (Ctrl+P) → Save as PDF</p>
              </div>
              <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', maxHeight: '85vh', overflowY: 'auto' }}>
                <iframe srcDoc={generateHTML(formData)} title="Flyer Preview"
                  style={{ width: '100%', height: '800px', border: '1px solid #ddd', borderRadius: '8px' }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// STYLES
// ============================================================================
const styles = {
  stepTitle: { color: '#061A3A', fontSize: '18px', fontWeight: 700, marginBottom: '16px' },
  field: { marginBottom: '12px' },
  label: { display: 'block', fontWeight: 600, marginBottom: '4px', fontSize: '13px', color: '#333' },
  input: { width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', fontFamily: 'inherit', outline: 'none' },
  btnPrimary: { padding: '8px 16px', background: '#061A3A', color: '#F4B400', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' },
  btnSecondary: { padding: '8px 16px', background: '#f0f0f0', color: '#333', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
};

export default ScoutFlyerBuilder;
