// SCOUT FLYER BUILDER v3.0 - Professional Design with Official Scouting America Colors
import React, { useState, useRef, useEffect } from 'react';

// HEIC to JPEG converter (loaded on demand for iPhone photo support)
const convertHeicToJpeg = async (file) => {
  if (!file.name?.toLowerCase().match(/\.heic$|\.heif$/)) return file;
  try {
    const heic2any = (await import('https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js')).default || window.heic2any;
    const blob = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.85 });
    return new File([blob], file.name.replace(/\.heic$/i, '.jpg').replace(/\.heif$/i, '.jpg'), { type: 'image/jpeg' });
  } catch (err) {
    console.warn('HEIC conversion failed, trying original:', err);
    return file;
  }
};

// ============================================================================
// OFFICIAL SCOUTING AMERICA COLOR SCHEMES
// Source: Scouting America Brand Guidelines, Rev. May 2024
// ============================================================================
const COLOR_SCHEMES = {
  navy: { name: 'Blue & Yellow', primary: '#003F87', accent: '#FCD116', uiAccent: '#FCD116', textOnPrimary: '#FFFFFF', secondaryText: '#B8D4F0', programs: ['Cub Scouts'] },
  olive: { name: 'Olive & Gold', primary: '#243E2C', accent: '#D4A843', uiAccent: '#D4A843', textOnPrimary: '#FFFFFF', secondaryText: '#C8DFCC', programs: ['Scouts BSA - Boys', 'Scouts BSA - Girls', 'Scouts BSA - Family'] },
  tan: { name: 'Gray & Tan', primary: '#3D3D3D', accent: '#C9A96E', uiAccent: '#C9A96E', textOnPrimary: '#FFFFFF', secondaryText: '#D6CEBD', programs: [] },
  green: { name: 'Green & Yellow', primary: '#006B3F', accent: '#FCD116', uiAccent: '#FCD116', textOnPrimary: '#FFFFFF', secondaryText: '#C8EFDB', programs: ['Venturing'] },
  darkblue: { name: 'Navy & Gold', primary: '#003366', accent: '#CC9900', uiAccent: '#E8B820', textOnPrimary: '#FFFFFF', secondaryText: '#9AB3D5', programs: ['Sea Scouts'] },
  red: { name: 'Maroon & Gold', primary: '#8B1A2B', accent: '#F0C75E', uiAccent: '#F0C75E', textOnPrimary: '#FFFFFF', secondaryText: '#F5C6CB', programs: [] },
  custom: { name: 'Custom Colors', primary: '#333333', accent: '#D4A843', uiAccent: '#D4A843', textOnPrimary: '#FFFFFF', secondaryText: '#CCCCCC', programs: [] },
};

const getRecommendedScheme = (troopType) => {
  for (const [key, scheme] of Object.entries(COLOR_SCHEMES)) {
    if (scheme.programs.includes(troopType)) return key;
  }
  return 'olive';
};

// Pre-loaded content templates by program type
// Sources: scouting.org, ncacscouting.org, Scouting America Brand Guidelines

const PROGRAM_CONTENT = {
  'Cub Scouts': {
    whatIsScouting: 'Cub Scouting is a year-round family program for children in kindergarten through fifth grade. Everything in Cub Scouting is designed to keep kids active while building citizenship, character, and personal fitness. Scouts meet in small groups called dens organized by grade level, and all dens come together as a pack for monthly meetings, service projects, camping, and special events like Pinewood Derby. Cub Scouting is fun with a purpose — and it prepares kids to become Scouts.',
    whyJoinOptions: [
      'Kids want to have fun. Parents want them to learn positive values and skills that last a lifetime. Cub Scouting delivers both. From camping and hiking to Pinewood Derby and community service, every activity builds confidence, teaches teamwork, and helps kids develop into good citizens. Parents are part of the journey — this is not a drop-off activity, it is a family experience.',
      'Our pack brings families together through hands-on activities that build character, self-reliance, and lasting friendships. Scouts earn achievement badges, take on new challenges, and prepare for the adventures of Scouts BSA. Compared to sports, music, and other activities, Cub Scouting is one of the most affordable and rewarding programs available — because it is run entirely by parent volunteers who care about the kids.',
      'Cub Scouting fosters a sense of personal achievement by developing new interests and skills. It strengthens the ability to get along with others, reinforces habits of good citizenship, and improves understanding within the family. Scouts learn to be helpful, to do their best, and to respect nature and their community. Every activity has a purpose — and the result is confident, capable kids ready for what comes next.',
    ],
    defaultHighlights: ['Adventure', 'Family Fun', 'Camping', 'Pinewood Derby', 'Hiking', 'Service', 'Friendship', 'Badges', 'Character', 'Citizenship'],
    defaultActivities: ['Monthly pack meetings & den activities', 'Camping & outdoor adventures', 'Pinewood Derby racing', 'Community service & food drives', 'Field trips & special events', 'Day camp & resident camp', 'Badge & rank advancement', 'Preparation for Scouts BSA'],
  },
  'Scouts BSA - Boys': {
    whatIsScouting: 'Scouts BSA is the flagship Scouting America program for youth ages 11-17. It is a youth-led program where Scouts develop outdoor skills, confidence, and strong character through activities they plan and run themselves — with guidance from trained adult leaders. For over a century, Scouting has built capable, confident people ready to lead in their communities.',
    whyJoinOptions: [
      'Our troop is where Scouts build real confidence, develop leadership skills, and gain life skills that last. Scouts plan their own activities, lead their patrols, and learn by doing — from wilderness navigation to public speaking. Every campout, service project, and merit badge is a step toward becoming a capable, self-reliant person.',
      'Scouting builds leaders. Our troop provides hands-on experiences where Scouts learn to set goals, solve problems, and take responsibility for their actions. Through monthly campouts, high-adventure trips, and community service, Scouts develop the confidence and competence to tackle anything life throws at them.',
      'Our troop offers a supportive community where Scouts grow into confident, capable people. Through outdoor adventure, merit badges, leadership roles, and service projects, every Scout builds self-reliance, strong character, and lasting friendships. The skills learned here carry into school, careers, and everyday life.',
    ],
    defaultHighlights: ['Adventure', 'Leadership', 'Camping', 'Service', 'Hiking', 'Merit Badges', 'Confidence', 'Eagle Scout', 'Teamwork', 'Life Skills'],
    defaultActivities: ['Monthly camping trips', 'Hiking & backpacking adventures', 'Community service projects', 'Merit badge workshops', 'Summer camp & high adventure', 'Leadership training', 'Outdoor skills development', 'Advancement toward Eagle Scout'],
  },
  'Scouts BSA - Girls': {
    whatIsScouting: 'Scouts BSA is the flagship Scouting America program for youth ages 11-17. It is a youth-led program where Scouts develop outdoor skills, confidence, and strong character through activities they plan and run themselves — with guidance from trained adult leaders. Since 2019, Scouting America has welcomed all-girl troops, offering the same proven program, adventures, and path to Eagle Scout.',
    whyJoinOptions: [
      'Our troop is where Scouts build real confidence, develop leadership skills, and gain life skills that last. Scouts plan their own activities, lead their patrols, and learn by doing — from wilderness navigation to public speaking. Every campout, service project, and merit badge is a step toward becoming a capable, self-reliant person.',
      'Scouting builds leaders. Our troop provides hands-on experiences where Scouts learn to set goals, solve problems, and take responsibility for their actions. Through monthly campouts, high-adventure trips, and community service, Scouts develop the confidence and competence to tackle anything life throws at them.',
      'Our troop offers a supportive community where Scouts grow into confident, capable people. Through outdoor adventure, merit badges, leadership roles, and service projects, every Scout builds self-reliance, strong character, and lasting friendships. The skills learned here carry into school, careers, and everyday life.',
    ],
    defaultHighlights: ['Adventure', 'Leadership', 'Service', 'Hiking', 'Backpacking', 'Confidence', 'Advancement', 'Life Skills', 'Exploration', 'Teamwork'],
    defaultActivities: ['Monthly camping trips', 'Hiking & backpacking adventures', 'Community service projects', 'Leadership & merit badge training', 'Summer camp experiences', 'Outdoor skills development', 'High-adventure opportunities', 'Advancement toward Eagle Scout'],
  },
  'Scouts BSA - Family': {
    whatIsScouting: 'Scouts BSA is the flagship Scouting America program for youth ages 11-17. It is a youth-led program where Scouts develop outdoor skills, confidence, and strong character through activities they plan and run themselves — with guidance from trained adult leaders. Family troops welcome all Scouts in a shared environment focused on the same proven program of adventure, leadership, and service.',
    whyJoinOptions: [
      'Our troop is where Scouts build real confidence, develop leadership skills, and gain life skills that last. Scouts plan their own activities, lead their patrols, and learn by doing — from wilderness navigation to public speaking. Every campout, service project, and merit badge is a step toward becoming a capable, self-reliant person.',
      'Scouting builds leaders. Our troop provides hands-on experiences where Scouts learn to set goals, solve problems, and take responsibility for their actions. Through monthly campouts, high-adventure trips, and community service, Scouts develop the confidence and competence to tackle anything life throws at them.',
      'Our troop offers a supportive community where Scouts grow into confident, capable people. Through outdoor adventure, merit badges, leadership roles, and service projects, every Scout builds self-reliance, strong character, and lasting friendships. The skills learned here carry into school, careers, and everyday life.',
    ],
    defaultHighlights: ['Adventure', 'Leadership', 'Camping', 'Service', 'Hiking', 'Merit Badges', 'Confidence', 'Eagle Scout', 'Teamwork', 'Life Skills'],
    defaultActivities: ['Monthly camping trips', 'Hiking & backpacking adventures', 'Community service projects', 'Merit badge workshops', 'Summer camp & high adventure', 'Leadership training', 'Outdoor skills development', 'Advancement toward Eagle Scout'],
  },
  'Venturing': {
    whatIsScouting: 'Venturing is a youth-led Scouting America program for ages 14-20, built around high adventure and leadership. Crews plan and carry out activities based on shared interests — from backpacking and rock climbing to scuba diving and community service. Venturing develops confidence, teamwork, and real-world leadership skills.',
    whyJoinOptions: [
      'Our crew is where Scouts push their limits through high-adventure activities, leadership challenges, and meaningful service. Whether it is summiting a peak, navigating whitewater, or leading a community project, Venturers take charge. Join a crew that turns ambition into action and builds skills that matter.',
      'Venturing is Scouting for those who want more. Our crew offers youth-led adventures that go beyond traditional Scouting — think remote wilderness expeditions, emergency preparedness training, and real leadership experience. If you want challenge, confidence, and adventure, this is your crew.',
    ],
    defaultHighlights: ['High Adventure', 'Leadership', 'Confidence', 'Service', 'Exploration', 'Challenge', 'Teamwork', 'Life Skills'],
    defaultActivities: ['High-adventure expeditions', 'Backpacking & wilderness trips', 'Community service leadership', 'Crew-planned adventures', 'Leadership development', 'Specialty skills training', 'National & regional events'],
  },
  'Sea Scouts': {
    whatIsScouting: 'Sea Scouts is a year-round Scouting America program for ages 14-20 focused on adventure on and around the water. Ships learn seamanship, navigation, boat maintenance, and water safety while developing leadership, teamwork, and a deep appreciation for maritime traditions.',
    whyJoinOptions: [
      'Our ship offers Scouts the chance to learn seamanship, navigation, and water safety while building confidence, leadership skills, and lasting friendships. Whether sailing, powerboating, or paddling, Sea Scouts gain hands-on experience on the water and life skills that carry into every part of life.',
      'Sea Scouting combines adventure on the water with leadership development and community service. Our ship provides hands-on experience with sailing, navigation, and maritime traditions in a youth-led environment where every member has a role and a voice.',
    ],
    defaultHighlights: ['Sailing', 'Navigation', 'Leadership', 'Seamanship', 'Adventure', 'Water Safety', 'Teamwork', 'Confidence'],
    defaultActivities: ['Sailing & powerboating', 'Navigation & seamanship training', 'Water safety certification', 'Maritime traditions & ceremonies', 'Community service on the waterfront', 'Regattas & competitions', 'Ship maintenance & repair'],
  },
};

// ============================================================================
// IMAGE LIBRARY
// ============================================================================
const IMAGE_LIBRARY = {
  hero: [
    { id: 'hero_trail', name: 'Mountain Trail', url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&h=600&fit=crop' },
    { id: 'hero_camp', name: 'Camp at Sunset', url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&h=600&fit=crop' },
    { id: 'hero_forest', name: 'Forest Path', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&h=600&fit=crop' },
    { id: 'hero_lake', name: 'Lake Adventure', url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&h=600&fit=crop' },
    { id: 'hero_mountains', name: 'Mountain Vista', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=600&fit=crop' },
    { id: 'hero_river', name: 'River Canyon', url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1200&h=600&fit=crop' },
  ],
  activity: [
    { id: 'act_hiking', name: 'Hiking', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop', cat: 'Hiking' },
    { id: 'act_campfire', name: 'Campfire', url: 'https://images.unsplash.com/photo-1475483768296-6163e08872a1?w=600&h=400&fit=crop', cat: 'Campfire' },
    { id: 'act_tent', name: 'Tent Camping', url: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=600&h=400&fit=crop', cat: 'Camping' },
    { id: 'act_kayak', name: 'Kayaking', url: 'https://images.unsplash.com/photo-1472745433479-4556f22e32c2?w=600&h=400&fit=crop', cat: 'Water' },
    { id: 'act_climbing', name: 'Rock Climbing', url: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=600&h=400&fit=crop', cat: 'Adventure' },
    { id: 'act_compass', name: 'Navigation', url: 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=600&h=400&fit=crop', cat: 'Skills' },
    { id: 'act_backpack', name: 'Backpacking', url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop', cat: 'Backpacking' },
    { id: 'act_forest', name: 'Forest Walk', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop', cat: 'Nature' },
    { id: 'act_cooking', name: 'Camp Cooking', url: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=600&h=400&fit=crop', cat: 'Cooking' },
    { id: 'act_team', name: 'Teamwork', url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop', cat: 'Team' },
    { id: 'act_stars', name: 'Stargazing', url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&h=400&fit=crop', cat: 'Night' },
    { id: 'act_fishing', name: 'Fishing', url: 'https://images.unsplash.com/photo-1504309092620-4d0ec726efa4?w=600&h=400&fit=crop', cat: 'Fishing' },
    { id: 'act_knots', name: 'Rope Skills', url: 'https://images.unsplash.com/photo-1516571748831-5d461dd02b6c?w=600&h=400&fit=crop', cat: 'Skills' },
    { id: 'act_canoe', name: 'Canoeing', url: 'https://images.unsplash.com/photo-1502780402662-acc01917889a?w=600&h=400&fit=crop', cat: 'Water' },
    { id: 'act_service', name: 'Service', url: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop', cat: 'Service' },
    { id: 'act_flag', name: 'Flag Ceremony', url: 'https://images.unsplash.com/photo-1569429593410-b498b3fb3387?w=600&h=400&fit=crop', cat: 'Ceremony' },
  ]
};

// ============================================================================
// UTILITIES
// ============================================================================
const fileToBase64 = async (file) => {
  const converted = await convertHeicToJpeg(file);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(converted);
  });
};

const exportTemplate = (formData) => {
  const template = {
    metadata: { savedDate: new Date().toISOString(), appVersion: '3.0' },
    troopBasics: { troopName: formData.troopName, troopType: formData.troopType, ageRange: formData.ageRange },
    meetingLocation: { day: formData.meetingDay, time: formData.meetingTime, endTime: formData.meetingEndTime, frequency: formData.meetingFrequency, frequencyCustom: formData.meetingFrequencyCustom, address: formData.address, locationName: formData.locationName },
    contact: { email: formData.email, website: formData.website, instagram: formData.instagram, phone: formData.phone },
    description: { whyJoin: formData.whyJoin, whatIsScouting: formData.whatIsScouting, highlights: formData.highlights, costs: formData.costs, activities: formData.activities },
    design: { colorScheme: formData.colorScheme, imageAdjustments: formData.imageAdjustments, customColors: formData.colorScheme === 'custom' ? COLOR_SCHEMES.custom : null },
    images: { hero: formData.heroImageRef, activityGallery: formData.activityImagesRef, detailGallery: formData.detailImagesRef, logo: formData.logoImageRef }
  };
  const el = document.createElement('a');
  el.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(template, null, 2)));
  el.setAttribute('download', `${formData.troopName.replace(/\s+/g, '_') || 'Scout'}_Template.json`);
  el.style.display = 'none'; document.body.appendChild(el); el.click(); document.body.removeChild(el);
};

const importTemplate = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = (e) => { try { resolve(JSON.parse(e.target.result)); } catch { reject(new Error('Invalid template')); } };
  reader.onerror = () => reject(new Error('Failed to read file'));
  reader.readAsText(file);
});

// ============================================================================
// GENERATE HTML FLYER
// ============================================================================
const generateHTML = (formData) => {
  const cs = COLOR_SCHEMES[formData.colorScheme] || COLOR_SCHEMES.olive;
  const heroImg = formData.heroImage;
  const actImgs = formData.activityImages.filter(Boolean);
  const detImgs = formData.detailImages.filter(Boolean);
  const hasLogo = !!formData.logoImage;
  const hasHero = !!heroImg;

  const highlightStyles = [
    { size: '22px', color: cs.accent, bold: true },
    { size: '18px', color: '#FFFFFF', bold: true },
    { size: '16px', color: cs.secondaryText, bold: true },
    { size: '24px', color: cs.accent, bold: true },
    { size: '17px', color: '#FFFFFF', bold: false },
    { size: '20px', color: cs.secondaryText, bold: true },
    { size: '15px', color: cs.accent, bold: true },
    { size: '19px', color: '#FFFFFF', bold: true },
    { size: '21px', color: cs.secondaryText, bold: false },
    { size: '16px', color: cs.accent, bold: true },
    { size: '18px', color: '#FFFFFF', bold: true },
    { size: '23px', color: cs.secondaryText, bold: true },
  ];

  const highlightCloud = (formData.highlights || []).map((h, i) => {
    const s = highlightStyles[i % highlightStyles.length];
    return `<span style="font-size:${s.size};color:${s.color};font-weight:${s.bold?'bold':'normal'};margin:0 12px;display:inline-block;">${h}</span>`;
  }).join('');

  const defaultActivities = ['Monthly camping trips', 'Hiking & backpacking', 'Community service', 'Leadership training', 'Summer camp', 'Outdoor skills'];
  const activities = formData.activities?.length > 0 ? formData.activities : defaultActivities;

  // Build photo grid HTML only if images exist
  const photoGridHTML = actImgs.length > 0 ? `
  <div style="display:grid;grid-template-columns:repeat(${actImgs.length},1fr);gap:0;padding:0 0.42in;height:1.78in;">
    ${actImgs.map((img, idx) => { const a = formData.imageAdjustments?.['activity_' + idx] || {zoom:100,posX:50,posY:50}; return `<div style="position:relative;overflow:hidden;border-radius:8px;margin:0 4px;"><div style="width:100%;height:100%;background-image:url(${img});background-size:${a.zoom}%;background-position:${a.posX}% ${a.posY}%;background-repeat:no-repeat;"></div><div style="position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.1);border-radius:8px;"></div></div>`; }).join('')}
  </div>` : '';

  const detailPhotosHTML = detImgs.length > 0 ? `
  <div style="display:grid;grid-template-columns:repeat(${detImgs.length},1fr);gap:0;padding:0.2in 0.42in;height:1.4in;">
    ${detImgs.map((img, idx) => { const a = formData.imageAdjustments?.['detail_' + idx] || {zoom:100,posX:50,posY:50}; return `<div style="position:relative;overflow:hidden;border-radius:8px;margin:0 4px;"><div style="width:100%;height:100%;background-image:url(${img});background-size:${a.zoom}%;background-position:${a.posX}% ${a.posY}%;background-repeat:no-repeat;"></div><div style="position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.1);border-radius:8px;"></div></div>`; }).join('')}
  </div>` : '';

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

.slide-1{background:${cs.primary};color:${cs.textOnPrimary};display:flex;flex-direction:column;}
.hero-section{position:relative;width:100%;${hasHero ? 'height:5.6in;' : 'height:2.5in;'}overflow:hidden;}
${hasHero ? `.hero-section img{width:100%;height:100%;object-fit:cover;}` : ''}
.hero-overlay{position:absolute;top:0;left:0;right:0;bottom:0;background:${hasHero ? 'linear-gradient(180deg,rgba(0,0,0,0.25) 0%,rgba(0,0,0,0.55) 100%)' : cs.primary};display:flex;flex-direction:column;justify-content:flex-end;padding:0.6in;}
.hero-tagline{font-size:28pt;font-weight:800;color:#fff;text-shadow:2px 3px 6px rgba(0,0,0,0.5);letter-spacing:-0.5px;}
.hero-subtitle{font-size:10.5pt;font-weight:600;color:${cs.secondaryText};margin-top:6px;letter-spacing:1px;}
.logo-area{position:absolute;top:0.1in;right:0.1in;width:2.4in;height:2.4in;z-index:3;}
.logo-area img{width:100%;height:100%;object-fit:contain;}
.word-cloud{padding:0.25in 0.4in;text-align:center;line-height:2.2;min-height:0.9in;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;}
.meeting-bar{margin:0.15in 0.42in;padding:0.22in 0.3in;background:rgba(255,255,255,0.08);border-radius:8px;display:flex;align-items:center;}
.meeting-left{flex:0 0 auto;padding-right:0.3in;border-right:2px solid rgba(255,255,255,0.2);}
.meeting-right{padding-left:0.3in;}
.meeting-label{font-size:9pt;font-weight:700;color:${cs.accent};text-transform:uppercase;letter-spacing:1px;}
.meeting-value{font-size:11pt;font-weight:700;color:#fff;margin-top:2px;}
.contact-bar{margin:0.1in 0.42in 0.15in;text-align:center;padding:0.15in;font-size:9pt;color:rgba(255,255,255,0.7);}
.contact-bar a{color:${cs.accent};text-decoration:none;font-weight:600;}

.slide-2{background:#F8F9FA;display:flex;flex-direction:column;}
.s2-header{background:${cs.primary};padding:0.3in 0.5in;display:flex;align-items:center;}
.s2-title{font-size:22pt;font-weight:800;color:#fff;flex:1;}
.s2-subtitle{font-size:10pt;color:${cs.secondaryText};margin-top:4px;font-weight:600;}
.s2-logo{width:0.8in;height:0.8in;}
.s2-logo img{width:100%;height:100%;object-fit:contain;}
.s2-cards{display:grid;grid-template-columns:1fr 1fr;gap:0.2in;padding:0.3in 0.42in 0.2in;}
.s2-card{background:#fff;border-radius:12px;padding:0.3in;box-shadow:0 2px 8px rgba(0,0,0,0.06);}
.s2-card-title{font-size:13pt;font-weight:700;color:${cs.primary};margin-bottom:0.08in;padding-bottom:0.08in;border-bottom:2px solid ${cs.accent};}
.s2-card p{font-size:9.5pt;color:#1F2937;line-height:1.55;}
.s2-info-cards{display:grid;grid-template-columns:1fr 1fr;gap:0.2in;padding:0 0.42in 0.2in;}
.s2-info-card{background:${cs.primary};border-radius:12px;padding:0.25in;color:#fff;}
.s2-info-title{font-size:11pt;font-weight:700;color:${cs.accent};margin-bottom:0.08in;}
.s2-info-card ul{font-size:9pt;line-height:1.6;padding-left:0.15in;color:${cs.secondaryText};}
.s2-info-card li{margin-bottom:2px;}
.s2-contact{margin:0 0.42in;padding:0.25in 0.3in;background:${cs.primary};border-radius:12px;display:flex;align-items:flex-start;}
.s2-contact-left{flex:0 0 45%;}
.s2-contact-heading{font-size:14pt;font-weight:800;color:#fff;}
.s2-contact-sub{font-size:8.5pt;color:${cs.secondaryText};margin-top:4px;}
.s2-contact-divider{width:2px;background:rgba(255,255,255,0.2);align-self:stretch;margin:0 0.2in;}
.s2-contact-right{flex:1;display:grid;grid-template-columns:1fr 1fr;gap:8px;}
.s2-contact-label{font-size:7.5pt;font-weight:700;color:${cs.accent};text-transform:uppercase;letter-spacing:1px;}
.s2-contact-value{font-size:9.5pt;font-weight:700;color:#fff;margin-top:1px;word-break:break-all;}
.s2-footer{background:${cs.primary};padding:0.12in 0.42in;display:flex;justify-content:space-between;align-items:center;margin-top:auto;}
.s2-footer-left{font-size:8.5pt;font-weight:700;color:#fff;}
.s2-footer-right{font-size:8.5pt;font-weight:700;color:#fff;text-align:right;}
.s2-welcome{text-align:center;padding:0.08in;font-size:9pt;font-weight:600;color:${cs.primary};font-style:italic;}

@media print{body{background:#fff;margin:0;padding:0;}.slide{box-shadow:none;margin:0;width:100%;height:100%;}@page{size:8.5in 11in;margin:0;}}
</style>
</head>
<body>

<div class="slide slide-1">
  <div class="hero-section">
    ${hasHero ? `<div style="width:100%;height:100%;background-image:url(${heroImg});background-size:${(formData.imageAdjustments?.hero?.zoom || 100)}%;background-position:${(formData.imageAdjustments?.hero?.posX || 50)}% ${(formData.imageAdjustments?.hero?.posY || 50)}%;background-repeat:no-repeat;"></div>` : ''}
    <div class="hero-overlay">
      <div class="hero-tagline">Adventure starts here.</div>
      <div class="hero-subtitle">Scouting America &nbsp;•&nbsp; ${formData.troopType || 'Scouts BSA'} ${formData.ageRange || 'Ages 11-17'}</div>
    </div>
    ${hasLogo ? `<div class="logo-area"><img src="${formData.logoImage}" alt="Troop Logo"></div>` : ''}
  </div>
  <div class="word-cloud">${highlightCloud}</div>
  ${photoGridHTML}
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

<div class="slide slide-2">
  <div class="s2-header">
    <div>
      <div class="s2-title">${formData.troopName || 'Scout Troop'} at a Glance</div>
      <div class="s2-subtitle">A quick guide for new Scouts and families</div>
    </div>
    ${hasLogo ? `<div class="s2-logo"><img src="${formData.logoImage}" alt="Logo"></div>` : ''}
  </div>
  <div class="s2-cards">
    <div class="s2-card">
      <div class="s2-card-title">What is Scouting America?</div>
      <p>${formData.whatIsScouting || 'Scouting America is a youth-led organization that teaches leadership through outdoor, first aid, aquatics, service and other hands-on activities. Scouts elect their own leaders, plan activities and run meetings with guidance from adult volunteers.'}</p>
    </div>
    <div class="s2-card">
      <div class="s2-card-title">Why Join ${formData.troopName || 'Us'}?</div>
      <p>${formData.whyJoin || 'We offer a supportive, inclusive community focused on leadership development, outdoor adventure, and lifelong friendships.'}</p>
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
      <ul>${activities.map(a => `<li>${a}</li>`).join('')}</ul>
    </div>
  </div>
  <div class="s2-contact">
    <div class="s2-contact-left">
      <div class="s2-contact-heading">Interested in<br>Learning More?</div>
      <div class="s2-contact-sub">Visit a meeting, contact us, or explore the troop online.</div>
    </div>
    <div class="s2-contact-divider"></div>
    <div class="s2-contact-right">
      <div><div class="s2-contact-label">Email</div><div class="s2-contact-value">${formData.email || 'email@troop.org'}</div></div>
      ${formData.website ? `<div><div class="s2-contact-label">Website</div><div class="s2-contact-value">${formData.website}</div></div>` : ''}
      ${formData.instagram ? `<div><div class="s2-contact-label">Instagram</div><div class="s2-contact-value">${formData.instagram}</div></div>` : ''}
      ${formData.phone ? `<div><div class="s2-contact-label">Phone</div><div class="s2-contact-value">${formData.phone}</div></div>` : ''}
    </div>
  </div>
  <div class="s2-welcome">Prospective Scouts and families are always welcome.</div>
  ${detailPhotosHTML}
  <div class="s2-footer">
    <div class="s2-footer-left">${formData.email || ''}</div>
    <div class="s2-footer-right">${formData.troopName || 'Scout Troop'}${formData.address ? ', ' + formData.address.split(',').slice(-2).join(',').trim() : ''}</div>
  </div>
</div>

</body></html>`;
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================
const ScoutFlyerBuilder = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    troopName: '', troopType: 'Scouts BSA - Girls', ageRange: 'Ages 11-17',
    meetingDay: 'Monday', meetingTime: '7:00', meetingEndTime: '8:30 PM', meetingFrequency: 'Weekly', meetingFrequencyCustom: '', address: '', locationName: '',
    email: '', website: '', instagram: '', phone: '',
    whyJoin: '', whatIsScouting: '', highlights: ['Adventure', 'Leadership', 'Service', 'Friendship', 'Campfires', 'Hiking', 'Advancement', 'Teamwork'], costs: '',
    activities: ['Monthly camping trips', 'Hiking & backpacking adventures', 'Community service projects', 'Leadership & merit badge training', 'Summer camp experiences', 'Outdoor skills development'],
    colorScheme: 'olive',
    heroImage: '', heroImageRef: '', logoImage: '', logoImageRef: '',
    imageAdjustments: {},
    activityImages: [null, null, null], activityImagesRef: ['', '', ''],
    detailImages: [null, null, null], detailImagesRef: ['', '', ''],
  });

  const [showPreview, setShowPreview] = useState(false);
  const [highlightInput, setHighlightInput] = useState('');
  const [activityInput, setActivityInput] = useState('');
  const templateInputRef = useRef(null);

  // Auto-recommend color scheme and age/grade range when troop type changes
  useEffect(() => {
    const rangeMap = { 'Cub Scouts': 'Kindergarten - 5th Grade', 'Scouts BSA - Boys': 'Ages 11-17', 'Scouts BSA - Girls': 'Ages 11-17', 'Scouts BSA - Family': 'Ages 11-17', 'Venturing': 'Ages 14-20', 'Sea Scouts': 'Ages 14-20' };
    const recommended = getRecommendedScheme(formData.troopType);
    const range = rangeMap[formData.troopType] || 'Ages 11-17';
    const content = PROGRAM_CONTENT[formData.troopType];
    setFormData(prev => ({
      ...prev, colorScheme: recommended, ageRange: range,
      highlights: content?.defaultHighlights || prev.highlights,
      activities: content?.defaultActivities || prev.activities,
    }));
  }, [formData.troopType]);

  const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const getAdj = (key) => formData.imageAdjustments[key] || { zoom: 100, posX: 50, posY: 50 };
  const setAdj = (key, field, value) => setFormData(prev => ({
    ...prev, imageAdjustments: { ...prev.imageAdjustments, [key]: { ...getAdj(key), [field]: value } }
  }));
  const addHighlight = () => { if (highlightInput.trim()) { setFormData(prev => ({ ...prev, highlights: [...prev.highlights, highlightInput.trim()] })); setHighlightInput(''); } };
  const removeHighlight = (i) => setFormData(prev => ({ ...prev, highlights: prev.highlights.filter((_, idx) => idx !== i) }));
  const addActivity = () => { if (activityInput.trim()) { setFormData(prev => ({ ...prev, activities: [...prev.activities, activityInput.trim()] })); setActivityInput(''); } };
  const removeActivity = (i) => setFormData(prev => ({ ...prev, activities: prev.activities.filter((_, idx) => idx !== i) }));

  const handleImageUpload = async (e, imageType, index = null) => {
    const file = e.target.files?.[0]; if (!file) return;
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
    const file = e.target.files?.[0]; if (!file) return;
    try {
      const t = await importTemplate(file);
      setFormData(prev => ({
        ...prev, ...t.troopBasics,
        meetingDay: t.meetingLocation.day, meetingTime: t.meetingLocation.time, meetingEndTime: t.meetingLocation.endTime || '8:30 PM', meetingFrequency: t.meetingLocation.frequency || 'Weekly', meetingFrequencyCustom: t.meetingLocation.frequencyCustom || '',
        address: t.meetingLocation.address, locationName: t.meetingLocation.locationName || '',
        email: t.contact.email, website: t.contact.website, instagram: t.contact.instagram, phone: t.contact.phone,
        whyJoin: t.description.whyJoin, whatIsScouting: t.description.whatIsScouting, highlights: t.description.highlights, costs: t.description.costs,
        activities: t.description.activities || prev.activities,
        colorScheme: t.design?.colorScheme || getRecommendedScheme(t.troopBasics.troopType), imageAdjustments: t.design?.imageAdjustments || {},
        heroImageRef: t.images.hero, activityImagesRef: t.images.activityGallery, detailImagesRef: t.images.detailGallery, logoImageRef: t.images.logo || '',
      }));
      if (t.design?.customColors) { Object.assign(COLOR_SCHEMES.custom, t.design.customColors); }
      alert('Template loaded! Please re-select or re-upload images.');
    } catch (error) { alert('Failed to load template: ' + error.message); }
  };

  // ============================================================================
  // IMAGE PICKER
  // ============================================================================
  const ImageSlot = ({ label, imageType, index, currentRef, currentImage }) => {
    const adjKey = index !== null && index !== undefined ? imageType + '_' + index : imageType;
    const adj = getAdj(adjKey);
    const dragRef = useRef({ dragging: false, startX: 0, startY: 0, startPosX: 0, startPosY: 0, lastPinchDist: 0 });

    const handlePointerDown = (e) => {
      e.preventDefault();
      const d = dragRef.current;
      d.dragging = true;
      d.startX = e.clientX || e.touches?.[0]?.clientX || 0;
      d.startY = e.clientY || e.touches?.[0]?.clientY || 0;
      d.startPosX = adj.posX;
      d.startPosY = adj.posY;
    };

    const handlePointerMove = (e) => {
      const d = dragRef.current;
      if (!d.dragging) return;
      e.preventDefault();
      const clientX = e.clientX || e.touches?.[0]?.clientX || 0;
      const clientY = e.clientY || e.touches?.[0]?.clientY || 0;
      const sensitivity = 200 / adj.zoom;
      const dx = (d.startX - clientX) * sensitivity;
      const dy = (d.startY - clientY) * sensitivity;
      setAdj(adjKey, 'posX', Math.max(0, Math.min(100, d.startPosX + dx)));
      setAdj(adjKey, 'posY', Math.max(0, Math.min(100, d.startPosY + dy)));
    };

    const handlePointerUp = () => { dragRef.current.dragging = false; };

    const handleWheel = (e) => {
      e.preventDefault();
      const newZoom = Math.max(100, Math.min(300, adj.zoom + (e.deltaY > 0 ? -10 : 10)));
      setAdj(adjKey, 'zoom', newZoom);
    };

    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        dragRef.current.lastPinchDist = Math.sqrt(dx * dx + dy * dy);
      } else if (e.touches.length === 1) {
        handlePointerDown({ preventDefault: () => {}, clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const diff = dist - dragRef.current.lastPinchDist;
        const newZoom = Math.max(100, Math.min(300, adj.zoom + diff * 0.5));
        setAdj(adjKey, 'zoom', newZoom);
        dragRef.current.lastPinchDist = dist;
      } else if (e.touches.length === 1 && dragRef.current.dragging) {
        handlePointerMove({ preventDefault: () => {}, clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
      }
    };

    const resetAdj = () => setFormData(prev => ({
      ...prev, imageAdjustments: { ...prev.imageAdjustments, [adjKey]: { zoom: 100, posX: 50, posY: 50 } }
    }));

    return (
    <div style={{ marginBottom: '12px', padding: '10px', background: '#f8f8f8', borderRadius: '6px' }}>
      <label style={{ fontWeight: 600, fontSize: '13px', display: 'block', marginBottom: '6px' }}>{label}</label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '8px' }}>
        {(imageType === 'hero' ? IMAGE_LIBRARY.hero : IMAGE_LIBRARY.activity).map(img => (
          <button key={img.id} onClick={() => selectFromLibrary(img.id, imageType, index)}
            style={{ border: currentRef === img.id ? `3px solid ${COLOR_SCHEMES[formData.colorScheme]?.uiAccent || '#F4B400'}` : '2px solid #ddd', padding: 0, cursor: 'pointer', borderRadius: '6px', overflow: 'hidden', height: '50px' }}>
            <img src={img.url} alt={img.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </button>
        ))}
      </div>
      <input type="file" accept="image/*,.heic,.heif" onChange={(e) => handleImageUpload(e, imageType, index)} style={{ fontSize: '12px' }} />
      {currentImage && (
        <div style={{ marginTop: '8px' }}>
          <div
            onMouseDown={handlePointerDown} onMouseMove={handlePointerMove} onMouseUp={handlePointerUp} onMouseLeave={handlePointerUp}
            onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handlePointerUp}
            onWheel={handleWheel}
            style={{ width: '100%', height: imageType === 'hero' ? '140px' : '90px', borderRadius: '6px', overflow: 'hidden', border: '2px solid #ccc', marginBottom: '6px', cursor: 'grab', touchAction: 'none', userSelect: 'none', position: 'relative' }}>
            <div style={{ width: '100%', height: '100%', backgroundImage: `url(${currentImage})`, backgroundSize: `${adj.zoom}%`, backgroundPosition: `${adj.posX}% ${adj.posY}%`, backgroundRepeat: 'no-repeat', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '4px', left: '4px', background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: '9px', padding: '2px 6px', borderRadius: '3px', pointerEvents: 'none' }}>
              {adj.zoom > 100 ? `${adj.zoom}% — drag to reposition` : 'Scroll to zoom, drag to move'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <input type="range" min="100" max="300" value={adj.zoom} onChange={(e) => setAdj(adjKey, 'zoom', Number(e.target.value))} style={{ flex: 1 }} title="Zoom" />
            <span style={{ fontSize: '10px', color: '#888', width: '35px' }}>{adj.zoom}%</span>
            <button onClick={resetAdj} style={{ fontSize: '10px', padding: '3px 8px', background: '#eee', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', color: '#666', whiteSpace: 'nowrap' }}>Reset</button>
          </div>
        </div>
      )}
    </div>
  );};


  // ============================================================================
  // COLOR SCHEME PICKER
  // ============================================================================
  const ColorSchemePicker = () => {
    const recommended = getRecommendedScheme(formData.troopType);
    const handleCustomColor = (field, value) => {
      const current = COLOR_SCHEMES.custom;
      COLOR_SCHEMES.custom = { ...current, [field]: value };
      if (field === 'accent') COLOR_SCHEMES.custom.uiAccent = value;
      setFormData(prev => ({ ...prev, colorScheme: 'custom' }));
    };
    return (
      <div style={{ marginBottom: '16px' }}>
        <label style={styles.label}>Color Scheme</label>
        <p style={{ fontSize: '11px', color: '#666', marginBottom: '8px' }}>
          Recommended for {formData.troopType}: <strong>{COLOR_SCHEMES[recommended]?.name}</strong>
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
          {Object.entries(COLOR_SCHEMES).filter(([key]) => key !== 'custom').map(([key, scheme]) => (
            <button key={key} onClick={() => handleInputChange('colorScheme', key)}
              style={{
                padding: '8px', border: formData.colorScheme === key ? '3px solid #333' : '2px solid #ddd',
                borderRadius: '8px', cursor: 'pointer', background: '#fff', textAlign: 'left'
              }}>
              <div style={{ display: 'flex', gap: '3px', marginBottom: '4px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: scheme.primary }}></div>
                <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: scheme.accent }}></div>
              </div>
              <div style={{ fontSize: '10px', fontWeight: 600, color: '#333' }}>{scheme.name}</div>
              {key === recommended && <div style={{ fontSize: '8px', color: '#006B3F', fontWeight: 700 }}>★ Recommended</div>}
            </button>
          ))}
        </div>
        <div style={{ marginTop: '10px', padding: '10px', background: formData.colorScheme === 'custom' ? '#f0f7ff' : '#f8f8f8', border: formData.colorScheme === 'custom' ? '2px solid #333' : '1px solid #ddd', borderRadius: '8px' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', color: '#333' }}>Custom Colors</div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div>
              <label style={{ fontSize: '10px', color: '#666', display: 'block' }}>Primary</label>
              <input type="color" value={COLOR_SCHEMES.custom.primary} onChange={(e) => handleCustomColor('primary', e.target.value)}
                style={{ width: '40px', height: '30px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', padding: 0 }} />
            </div>
            <div>
              <label style={{ fontSize: '10px', color: '#666', display: 'block' }}>Accent</label>
              <input type="color" value={COLOR_SCHEMES.custom.accent} onChange={(e) => handleCustomColor('accent', e.target.value)}
                style={{ width: '40px', height: '30px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', padding: 0 }} />
            </div>
            <div>
              <label style={{ fontSize: '10px', color: '#666', display: 'block' }}>Light Text</label>
              <input type="color" value={COLOR_SCHEMES.custom.secondaryText} onChange={(e) => handleCustomColor('secondaryText', e.target.value)}
                style={{ width: '40px', height: '30px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', padding: 0 }} />
            </div>
            <div style={{ flex: 1, display: 'flex', gap: '3px', alignItems: 'center', justifyContent: 'flex-end' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: COLOR_SCHEMES.custom.primary }}></div>
              <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: COLOR_SCHEMES.custom.accent }}></div>
              <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: COLOR_SCHEMES.custom.secondaryText, border: '1px solid #ddd' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // FORM STEPS
  // ============================================================================
  const renderStep = () => {
    switch (step) {
      case 1: return (
        <div>
          <h2 style={styles.stepTitle}>Step 1: Troop Basics</h2>
          <div style={styles.field}><label style={styles.label}>Troop Name *</label><input style={styles.input} placeholder="e.g., Troop 111" value={formData.troopName} onChange={(e) => handleInputChange('troopName', e.target.value)} /></div>
          <div style={styles.field}><label style={styles.label}>Program Type</label>
            <select style={styles.input} value={formData.troopType} onChange={(e) => handleInputChange('troopType', e.target.value)}>
              <option>Scouts BSA - Girls</option><option>Scouts BSA - Boys</option><option>Scouts BSA - Family</option><option>Cub Scouts</option><option>Venturing</option><option>Sea Scouts</option>
            </select></div>
          <div style={styles.field}><label style={styles.label}>Age/Grade Range</label><input style={styles.input} placeholder="e.g., Ages 11-17 or Kindergarten - 5th Grade" value={formData.ageRange} onChange={(e) => handleInputChange('ageRange', e.target.value)} /></div>
          <ColorSchemePicker />
        </div>
      );
      case 2: return (
        <div>
          <h2 style={styles.stepTitle}>Step 2: Meeting & Location</h2>
          <div style={styles.field}><label style={styles.label}>Meeting Day</label>
            <select style={styles.input} value={formData.meetingDay} onChange={(e) => handleInputChange('meetingDay', e.target.value)}>
              {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(d => <option key={d}>{d}</option>)}
            </select></div>
          <div style={styles.field}><label style={styles.label}>Meeting Frequency</label>
            <select style={styles.input} value={formData.meetingFrequency} onChange={(e) => handleInputChange('meetingFrequency', e.target.value)}>
              <option>Weekly</option><option>Twice a Month</option><option>Monthly</option><option>Custom</option>
            </select></div>
          {formData.meetingFrequency === 'Custom' && (
            <div style={styles.field}><label style={styles.label}>Custom Frequency</label>
              <input style={styles.input} placeholder="e.g., 1st and 3rd Wednesdays" value={formData.meetingFrequencyCustom} onChange={(e) => handleInputChange('meetingFrequencyCustom', e.target.value)} />
            </div>
          )}
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
          <div style={styles.field}>
            <label style={styles.label}>Why Join Your Troop?</label>
            {PROGRAM_CONTENT[formData.troopType]?.whyJoinOptions && (
              <div style={{ marginBottom: '8px' }}>
                <p style={{ fontSize: '11px', color: '#666', marginBottom: '6px' }}>Pick a starting point, then customize:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {PROGRAM_CONTENT[formData.troopType].whyJoinOptions.map((opt, i) => (
                    <button key={i} onClick={() => handleInputChange('whyJoin', opt)}
                      style={{ padding: '8px 12px', background: formData.whyJoin === opt ? (COLOR_SCHEMES[formData.colorScheme]?.primary || '#243E2C') : '#f5f5f5', color: formData.whyJoin === opt ? '#fff' : '#333', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', textAlign: 'left', lineHeight: '1.4' }}>
                      {opt.substring(0, 120)}...
                    </button>
                  ))}
                </div>
              </div>
            )}
            <textarea style={{ ...styles.input, minHeight: '80px' }} placeholder="Pick a template above or write your own..." value={formData.whyJoin} onChange={(e) => handleInputChange('whyJoin', e.target.value)} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>What is Scouting America?</label>
            {PROGRAM_CONTENT[formData.troopType]?.whatIsScouting && !formData.whatIsScouting && (
              <button onClick={() => handleInputChange('whatIsScouting', PROGRAM_CONTENT[formData.troopType].whatIsScouting)}
                style={{ marginBottom: '6px', padding: '6px 12px', background: COLOR_SCHEMES[formData.colorScheme]?.primary || '#243E2C', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>
                ✨ Auto-fill for {formData.troopType}
              </button>
            )}
            <textarea style={{ ...styles.input, minHeight: '80px' }} placeholder="Scouting America is a youth-led organization..." value={formData.whatIsScouting} onChange={(e) => handleInputChange('whatIsScouting', e.target.value)} />
          </div>
          <div style={styles.field}><label style={styles.label}>Annual Costs / Dues</label>
            <input style={styles.input} placeholder="$150 national, $175 troop dues" value={formData.costs} onChange={(e) => handleInputChange('costs', e.target.value)} /></div>
          <div style={styles.field}>
            <label style={styles.label}>Highlight Words (word cloud on slide 1)</label>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
              <input style={{ ...styles.input, flex: 1 }} placeholder="e.g., Backpacking" value={highlightInput} onChange={(e) => setHighlightInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addHighlight()} />
              <button onClick={addHighlight} style={styles.btnSecondary}>Add</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {formData.highlights.map((h, i) => (
                <span key={i} style={{ background: COLOR_SCHEMES[formData.colorScheme]?.primary || '#243E2C', color: COLOR_SCHEMES[formData.colorScheme]?.uiAccent || '#D4A843', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
                  {h} <button onClick={() => removeHighlight(i)} style={{ background: 'none', border: 'none', color: COLOR_SCHEMES[formData.colorScheme]?.uiAccent || '#D4A843', cursor: 'pointer', marginLeft: '4px' }}>×</button>
                </span>
              ))}
            </div>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Scout Activities (slide 2 list)</label>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
              <input style={{ ...styles.input, flex: 1 }} placeholder="e.g., Rock climbing" value={activityInput} onChange={(e) => setActivityInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addActivity()} />
              <button onClick={addActivity} style={styles.btnSecondary}>Add</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {formData.activities.map((a, i) => (
                <span key={i} style={{ background: '#f0f0f0', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}>
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
          <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Images are optional. Sections without images will be hidden automatically.</p>
          <div style={{ padding: '10px 12px', background: '#EEF6FF', borderRadius: '8px', marginBottom: '14px', border: '1px solid #B8D4F0' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#003F87', marginBottom: '4px' }}>Looking for official Scouting America photos?</div>
            <p style={{ fontSize: '11px', color: '#444', lineHeight: '1.5', margin: 0 }}>
              Visit the <a href="https://scouting.webdamdb.com/bp/#/" target="_blank" rel="noopener noreferrer" style={{ color: '#003F87', fontWeight: 600 }}>Scouting America Brand Center</a> to browse and download official photos, logos, and graphics. Download what you need, then upload them here. Free registration required.
            </p>
          </div>
          <div style={{ marginBottom: '16px', padding: '10px', background: '#f8f8f8', borderRadius: '6px' }}>
            <label style={{ fontWeight: 600, fontSize: '13px', display: 'block', marginBottom: '6px' }}>Troop Logo (top-right corner)</label>
            <input type="file" accept="image/*,.heic,.heif" onChange={(e) => handleImageUpload(e, 'logo')} style={{ fontSize: '12px' }} />
            {formData.logoImage && <p style={{ color: '#2E7D32', fontSize: '11px', marginTop: '4px' }}>✓ Logo uploaded</p>}
          </div>
          <ImageSlot label="Hero Image (large banner)" imageType="hero" currentRef={formData.heroImageRef} currentImage={formData.heroImage} />
          <h3 style={{ fontSize: '14px', color: '#333', margin: '16px 0 8px' }}>Slide 1 Activity Photos (optional, up to 3)</h3>
          {[0, 1, 2].map(i => <ImageSlot key={`a${i}`} label={`Activity Photo ${i+1}`} imageType="activity" index={i} currentRef={formData.activityImagesRef[i]} currentImage={formData.activityImages[i]} />)}
          <h3 style={{ fontSize: '14px', color: '#333', margin: '16px 0 8px' }}>Slide 2 Detail Photos (optional, up to 3)</h3>
          {[0, 1, 2].map(i => <ImageSlot key={`d${i}`} label={`Detail Photo ${i+1}`} imageType="detail" index={i} currentRef={formData.detailImagesRef[i]} currentImage={formData.detailImages[i]} />)}
        </div>
      );
      default: return null;
    }
  };

  const cs = COLOR_SCHEMES[formData.colorScheme] || COLOR_SCHEMES.olive;

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px', padding: '20px', background: cs.primary, borderRadius: '12px', color: '#fff' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: cs.uiAccent, margin: 0 }}>Scout Flyer Generator</h1>
          <p style={{ color: cs.secondaryText, fontSize: '14px', marginTop: '6px' }}>Create a professional recruitment flyer for your Scout troop in minutes</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: showPreview ? '400px 1fr' : '1fr', gap: '20px' }}>
          <div>
            <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
                {[1,2,3,4,5].map(s => (
                  <button key={s} onClick={() => setStep(s)}
                    style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 600,
                      background: step === s ? cs.primary : '#f0f0f0', color: step === s ? cs.accent : '#666' }}>
                    {s}. {['Basics','Location','Contact','Content','Images'][s-1]}
                  </button>
                ))}
              </div>
              {renderStep()}
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                {step > 1 && <button onClick={() => setStep(step-1)} style={styles.btnSecondary}>← Back</button>}
                {step < 5 && <button onClick={() => setStep(step+1)} style={{ padding: '8px 20px', background: cs.primary, color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>Next →</button>}
              </div>
              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button onClick={() => setShowPreview(true)} style={{ width: '100%', padding: '14px', background: cs.primary, color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '15px', letterSpacing: '0.5px' }}>Generate Flyer Preview</button>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => exportTemplate(formData)} style={{ ...styles.btnSecondary, flex: 1 }}>💾 Save Template</button>
                  <button onClick={() => templateInputRef.current?.click()} style={{ ...styles.btnSecondary, flex: 1 }}>📂 Load Template</button>
                </div>
                <input ref={templateInputRef} type="file" accept=".json" onChange={handleTemplateLoad} style={{ display: 'none' }} />
              </div>
            </div>
          </div>
          {showPreview && (
            <div>
              <div style={{ marginBottom: '12px', display: 'flex', gap: '8px', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={downloadFlyer} style={{ padding: '10px 20px', background: cs.primary, color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}>⬇ Download HTML Flyer</button>
                  <button onClick={() => { try { const html = generateHTML(formData); const w = window.open('','_blank'); w.document.write(html); w.document.close(); } catch(err) { alert('Preview error: ' + err.message); } }} style={styles.btnSecondary}>🔍 Full Preview</button>
                </div>
                <p style={{ fontSize: '11px', color: '#666' }}>Open HTML → Print (Ctrl+P) → Save as PDF</p>
              </div>
              <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', maxHeight: '85vh', overflowY: 'auto' }}>
                {(() => {
                  try {
                    const html = generateHTML(formData);
                    return <iframe srcDoc={html} title="Preview" style={{ width: '100%', height: '800px', border: '1px solid #ddd', borderRadius: '8px' }} />;
                  } catch (err) {
                    return <div style={{ padding: '20px', color: 'red', background: '#fff0f0', borderRadius: '8px' }}>Preview error: {err.message}</div>;
                  }
                })()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  stepTitle: { color: '#333', fontSize: '18px', fontWeight: 700, marginBottom: '16px' },
  field: { marginBottom: '12px' },
  label: { display: 'block', fontWeight: 600, marginBottom: '4px', fontSize: '13px', color: '#333' },
  input: { width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', fontFamily: 'inherit', outline: 'none' },
  btnPrimary: { padding: '8px 16px', background: '#243E2C', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' },
  btnSecondary: { padding: '8px 16px', background: '#f0f0f0', color: '#333', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
};

export default ScoutFlyerBuilder;
