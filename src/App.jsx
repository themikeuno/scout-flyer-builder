// SCOUT FLYER BUILDER - Complete React App
// All-in-one component with local storage of form state only, no image persistence

import React, { useState, useRef } from 'react';

// ============================================================================
// IMAGE LIBRARY - Curated Scout Imagery from Unsplash/Pexels
// ============================================================================
const IMAGE_LIBRARY = {
  hero: [
    {
      id: 'adventure_1',
      name: 'Diverse Scout Group Hiking',
      url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&h=600&fit=crop',
      category: 'Hero'
    },
  ],
  activity: [
    {
      id: 'hiking_1',
      name: 'Scout Hiking Adventure',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      category: 'Hiking'
    },
    {
      id: 'leadership_1',
      name: 'Scout Leadership Training',
      url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
      category: 'Leadership'
    },
    {
      id: 'service_1',
      name: 'Community Service Project',
      url: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop',
      category: 'Service'
    },
    {
      id: 'campfire_1',
      name: 'Scout Campfire Gathering',
      url: 'https://images.unsplash.com/photo-1476611338391-6f395a0ebc7b?w=400&h=300&fit=crop',
      category: 'Social'
    },
    {
      id: 'diversity_1',
      name: 'Diverse Scout Group',
      url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop',
      category: 'Diversity'
    },
    {
      id: 'outdoor_skills_1',
      name: 'Outdoor Skills Training',
      url: 'https://images.unsplash.com/photo-1445522330404-369f8be6050b?w=400&h=300&fit=crop',
      category: 'Skills'
    },
  ]
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

// Export template as JSON
const exportTemplate = (formData) => {
  const template = {
    metadata: {
      savedDate: new Date().toISOString(),
      appVersion: '1.0'
    },
    troopBasics: {
      troopName: formData.troopName,
      troopType: formData.troopType,
      ageRange: formData.ageRange,
      programFocus: formData.programFocus
    },
    meetingLocation: {
      day: formData.meetingDay,
      time: formData.meetingTime,
      address: formData.address,
      alternateLocation: formData.alternateLocation
    },
    contact: {
      email: formData.email,
      website: formData.website,
      instagram: formData.instagram,
      phone: formData.phone
    },
    description: {
      whyJoin: formData.whyJoin,
      whatIsScouting: formData.whatIsScouting,
      highlights: formData.highlights,
      costs: formData.costs
    },
    images: {
      hero: formData.heroImageRef,
      activityGallery: formData.activityImagesRef,
      detailGallery: formData.detailImagesRef
    }
  };

  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(template, null, 2)));
  element.setAttribute('download', `${formData.troopName.replace(/\s+/g, '_')}_Template.json`);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

// Import template from JSON
const importTemplate = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const template = JSON.parse(e.target.result);
        resolve(template);
      } catch (error) {
        reject(new Error('Invalid template file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

// Generate HTML Flyer
const generateHTML = (formData) => {
  const heroImage = formData.heroImage || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22800%22 height=%22400%22%3E%3Crect fill=%22%234CAF50%22 width=%22800%22 height=%22400%22/%3E%3C/svg%3E';
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${formData.troopName} - Scout Recruitment Flyer</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    
    .slide {
      width: 8.5in;
      height: 11in;
      margin: 0 auto 0.5in;
      page-break-after: always;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    /* SLIDE 1 - HERO/TITLE */
    .slide-1 {
      position: relative;
      background: linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%);
      color: white;
      display: flex;
      flex-direction: column;
    }

    .hero-image-container {
      position: relative;
      width: 100%;
      height: 4in;
      overflow: hidden;
    }

    .hero-image-container img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .hero-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5));
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 1in;
      text-align: center;
    }

    .hero-title {
      font-size: 48px;
      font-weight: bold;
      margin-bottom: 0.5in;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    }

    .hero-tagline {
      font-size: 24px;
      margin-bottom: 0.25in;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
    }

    .hero-program-type {
      font-size: 14px;
      opacity: 0.95;
    }

    .highlights {
      padding: 0.75in;
      text-align: center;
      background: rgba(255,255,255,0.95);
      color: #333;
    }

    .highlights-title {
      font-weight: bold;
      margin-bottom: 0.3in;
      color: #2E7D32;
    }

    .highlights-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.3in;
      font-size: 13px;
    }

    .highlight-tag {
      background: #2E7D32;
      color: white;
      padding: 0.15in 0.3in;
      border-radius: 4px;
    }

    .activity-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.2in;
      padding: 0.4in;
      height: 2.5in;
    }

    .activity-grid img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
    }

    .slide-1-footer {
      padding: 0.5in;
      background: white;
      color: #333;
      font-size: 12px;
      line-height: 1.6;
      border-top: 2px solid #2E7D32;
    }

    .location-info {
      font-weight: bold;
      color: #2E7D32;
      margin-bottom: 0.15in;
    }

    .meeting-info {
      margin-bottom: 0.15in;
    }

    .contact-info {
      font-size: 11px;
      color: #666;
    }

    /* SLIDE 2 - DETAILS */
    .slide-2 {
      background: white;
      color: #333;
      padding: 0.5in;
      display: flex;
      flex-direction: column;
      font-size: 12px;
      line-height: 1.5;
    }

    .slide-2-header {
      text-align: center;
      margin-bottom: 0.4in;
      border-bottom: 2px solid #2E7D32;
      padding-bottom: 0.2in;
    }

    .slide-2-header h1 {
      font-size: 28px;
      color: #2E7D32;
      margin-bottom: 0.1in;
    }

    .slide-2-header p {
      font-size: 11px;
      color: #666;
    }

    .slide-2-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.3in;
      margin-bottom: 0.3in;
    }

    .content-section {
      padding: 0.2in;
    }

    .content-section h2 {
      font-size: 14px;
      color: #2E7D32;
      margin-bottom: 0.15in;
      font-weight: bold;
    }

    .content-section p {
      font-size: 11px;
      text-align: justify;
    }

    .info-box {
      background: #F5F5F5;
      border-left: 3px solid #2E7D32;
      padding: 0.2in;
      margin-bottom: 0.2in;
      border-radius: 2px;
    }

    .info-box h3 {
      font-size: 12px;
      color: #2E7D32;
      margin-bottom: 0.1in;
    }

    .info-box ul {
      margin-left: 0.2in;
      font-size: 10px;
    }

    .slide-2-gallery {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.2in;
      margin: 0.3in 0;
      height: 1.8in;
    }

    .slide-2-gallery img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
    }

    .slide-2-footer {
      text-align: center;
      padding-top: 0.2in;
      border-top: 1px solid #ddd;
      font-size: 11px;
      color: #666;
    }

    .contact-links {
      font-size: 10px;
      margin-top: 0.1in;
    }

    @media print {
      body { margin: 0; padding: 0; }
      .slide { box-shadow: none; margin: 0; width: 100%; height: 100%; }
      @page { size: 8.5in 11in; margin: 0; }
    }
  </style>
</head>
<body>

  <!-- SLIDE 1: HERO / TITLE -->
  <div class="slide slide-1">
    <div class="hero-image-container">
      <img src="${formData.heroImage || heroImage}" alt="Scout Adventure">
      <div class="hero-overlay">
        <div class="hero-title">${formData.troopName || 'Scout Troop'}</div>
        <div class="hero-tagline">Adventure starts here.</div>
        <div class="hero-program-type">Scouting America • ${formData.ageRange || 'Ages 11-17'}</div>
      </div>
    </div>

    <div class="highlights">
      <div class="highlights-title">What We Offer</div>
      <div class="highlights-list">
        ${(formData.highlights || ['Adventure', 'Leadership', 'Service']).map(h => `<span class="highlight-tag">${h}</span>`).join('')}
      </div>
    </div>

    <div class="activity-grid">
      ${(formData.activityImages || [heroImage, heroImage, heroImage]).map(img => `<img src="${img}" alt="Activity">`).join('')}
    </div>

    <div class="slide-1-footer">
      <div class="location-info">📍 ${formData.address || 'Meeting Location'}</div>
      <div class="meeting-info">📅 ${formData.meetingDay || 'Monday'} Nights • ${formData.meetingTime || '7:00 PM'}</div>
      <div class="contact-info">
        📧 ${formData.email || 'Contact us'} ${formData.instagram ? '| Instagram: ' + formData.instagram : ''}
      </div>
    </div>
  </div>

  <!-- SLIDE 2: DETAILS -->
  <div class="slide slide-2">
    <div class="slide-2-header">
      <h1>${formData.troopName || 'Scout Troop'} at a Glance</h1>
      <p>A quick guide for new Scouts and families</p>
    </div>

    <div class="slide-2-content">
      <div class="content-section">
        <h2>Why Join ${formData.troopName || 'Us'}?</h2>
        <p>${formData.whyJoin || 'We offer a supportive, inclusive community focused on leadership development, outdoor adventure, and lifelong friendships.'}</p>

        <div style="margin-top: 0.2in;"></div>

        <h2>What is Scouting America?</h2>
        <p>${formData.whatIsScouting || 'Scouting America is a youth-led organization that teaches leadership through outdoor, first aid, aquatics, service and hands-on activities. Scouts elect their own leaders and plan activities with adult guidance.'}</p>
      </div>

      <div class="content-section">
        <div class="info-box">
          <h3>When & How Much?</h3>
          <ul>
            <li><strong>Weekly meetings:</strong> ${formData.meetingDay || 'Monday'} nights, ${formData.meetingTime || '7:00 PM'}</li>
            <li><strong>Location:</strong> ${formData.address || 'TBD'}</li>
            <li><strong>Costs:</strong> ${formData.costs || '\$150 annual membership + troop dues'}</li>
            <li><strong>Financial assistance available</strong></li>
          </ul>
        </div>

        <div class="info-box">
          <h3>What Do Scouts Do?</h3>
          <ul>
            <li>Monthly camping trips</li>
            <li>Hiking & backpacking adventures</li>
            <li>Community service projects</li>
            <li>Leadership & merit badge training</li>
            <li>Summer camp experiences</li>
            <li>Outdoor skills development</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="slide-2-gallery">
      ${(formData.detailImages || [heroImage, heroImage, heroImage]).map(img => `<img src="${img}" alt="Activity">`).join('')}
    </div>

    <div class="slide-2-footer">
      <strong>Interested in Learning More?</strong>
      <div class="contact-links">
        ${formData.email ? `📧 <strong>${formData.email}</strong>` : ''} 
        ${formData.website ? `| 🌐 ${formData.website}` : ''} 
        ${formData.instagram ? `| Instagram: ${formData.instagram}` : ''}
      </div>
      <p style="margin-top: 0.1in; font-style: italic;">Prospective Scouts and families are always welcome.</p>
    </div>
  </div>

</body>
</html>
  `;
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================
const ScoutFlyerBuilder = () => {
  // Form state
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
    troopName: '',
    troopType: 'Girl Scouts',
    ageRange: 'Ages 11-17',
    programFocus: '',

    // Step 2
    meetingDay: 'Monday',
    meetingTime: '7:00 PM',
    address: '',
    alternateLocation: '',

    // Step 3
    email: '',
    website: '',
    instagram: '',
    phone: '',

    // Step 4
    whyJoin: '',
    whatIsScouting: '',
    highlights: ['Adventure', 'Leadership', 'Service'],
    costs: '',

    // Images (as base64 only during session)
    heroImage: '',
    heroImageRef: 'library:default',
    activityImages: [null, null, null],
    activityImagesRef: ['library:default', 'library:default', 'library:default'],
    detailImages: [null, null, null],
    detailImagesRef: ['library:default', 'library:default', 'library:default'],
  });

  // UI state
  const [previewTab, setPreviewTab] = useState('slide1');
  const [showPreview, setShowPreview] = useState(false);
  const [highlightInput, setHighlightInput] = useState('');
  const fileInputRef = useRef(null);
  const templateInputRef = useRef(null);

  // Handle form text input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle highlight management
  const addHighlight = () => {
    if (highlightInput.trim()) {
      setFormData(prev => ({
        ...prev,
        highlights: [...prev.highlights, highlightInput]
      }));
      setHighlightInput('');
    }
  };

  const removeHighlight = (index) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  // Handle image upload
  const handleImageUpload = async (e, imageType, index = null) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64 = await fileToBase64(file);
      
      if (imageType === 'hero') {
        setFormData(prev => ({
          ...prev,
          heroImage: base64,
          heroImageRef: 'custom_upload'
        }));
      } else if (imageType === 'activity' && index !== null) {
        const newImages = [...formData.activityImages];
        const newRefs = [...formData.activityImagesRef];
        newImages[index] = base64;
        newRefs[index] = 'custom_upload';
        setFormData(prev => ({
          ...prev,
          activityImages: newImages,
          activityImagesRef: newRefs
        }));
      } else if (imageType === 'detail' && index !== null) {
        const newImages = [...formData.detailImages];
        const newRefs = [...formData.detailImagesRef];
        newImages[index] = base64;
        newRefs[index] = 'custom_upload';
        setFormData(prev => ({
          ...prev,
          detailImages: newImages,
          detailImagesRef: newRefs
        }));
      }
    } catch (error) {
      alert('Failed to upload image: ' + error.message);
    }
  };

  // Select from library
  const selectFromLibrary = (imageId, imageType, index = null) => {
    const image = IMAGE_LIBRARY.hero.find(img => img.id === imageId) || 
                  IMAGE_LIBRARY.activity.find(img => img.id === imageId);
    
    if (!image) return;

    if (imageType === 'hero') {
      setFormData(prev => ({
        ...prev,
        heroImage: image.url,
        heroImageRef: imageId
      }));
    } else if (imageType === 'activity' && index !== null) {
      const newImages = [...formData.activityImages];
      const newRefs = [...formData.activityImagesRef];
      newImages[index] = image.url;
      newRefs[index] = imageId;
      setFormData(prev => ({
        ...prev,
        activityImages: newImages,
        activityImagesRef: newRefs
      }));
    } else if (imageType === 'detail' && index !== null) {
      const newImages = [...formData.detailImages];
      const newRefs = [...formData.detailImagesRef];
      newImages[index] = image.url;
      newRefs[index] = imageId;
      setFormData(prev => ({
        ...prev,
        detailImages: newImages,
        detailImagesRef: newRefs
      }));
    }
  };

  // Download HTML
  const downloadFlyer = () => {
    const html = generateHTML(formData);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(html));
    element.setAttribute('download', `${formData.troopName.replace(/\s+/g, '_') || 'Scout_Flyer'}_Recruitment_Flyer.html`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Handle template load
  const handleTemplateLoad = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const template = await importTemplate(file);
      setFormData(prev => ({
        ...prev,
        ...template.troopBasics,
        meetingDay: template.meetingLocation.day,
        meetingTime: template.meetingLocation.time,
        address: template.meetingLocation.address,
        alternateLocation: template.meetingLocation.alternateLocation,
        email: template.contact.email,
        website: template.contact.website,
        instagram: template.contact.instagram,
        phone: template.contact.phone,
        whyJoin: template.description.whyJoin,
        whatIsScouting: template.description.whatIsScouting,
        highlights: template.description.highlights,
        costs: template.description.costs,
        heroImageRef: template.images.hero,
        activityImagesRef: template.images.activityGallery,
        detailImagesRef: template.images.detailGallery,
      }));
      alert('Template loaded! Please re-select or re-upload images.');
    } catch (error) {
      alert('Failed to load template: ' + error.message);
    }
  };

  // Render steps
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="form-step">
            <h2>Troop Basics</h2>
            <div className="form-group">
              <label>Troop Name *</label>
              <input 
                type="text" 
                placeholder="e.g., Troop 111"
                value={formData.troopName}
                onChange={(e) => handleInputChange('troopName', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Troop Type</label>
              <select value={formData.troopType} onChange={(e) => handleInputChange('troopType', e.target.value)}>
                <option>Girl Scouts</option>
                <option>Boy Scouts</option>
                <option>Venturers</option>
              </select>
            </div>
            <div className="form-group">
              <label>Age Range</label>
              <input 
                type="text" 
                placeholder="Ages 11-17"
                value={formData.ageRange}
                onChange={(e) => handleInputChange('ageRange', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Program Focus</label>
              <input 
                type="text" 
                placeholder="e.g., Leadership, Outdoor Skills, Service"
                value={formData.programFocus}
                onChange={(e) => handleInputChange('programFocus', e.target.value)}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="form-step">
            <h2>Meeting & Location</h2>
            <div className="form-group">
              <label>Meeting Day</label>
              <select value={formData.meetingDay} onChange={(e) => handleInputChange('meetingDay', e.target.value)}>
                <option>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
                <option>Thursday</option>
                <option>Friday</option>
                <option>Saturday</option>
                <option>Sunday</option>
              </select>
            </div>
            <div className="form-group">
              <label>Meeting Time</label>
              <input 
                type="text" 
                placeholder="7:00 PM"
                value={formData.meetingTime}
                onChange={(e) => handleInputChange('meetingTime', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Address *</label>
              <textarea 
                placeholder="123 Main St, Charlotte, NC 28211"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows="2"
              />
            </div>
            <div className="form-group">
              <label>Alternate Location</label>
              <input 
                type="text" 
                placeholder="(Optional)"
                value={formData.alternateLocation}
                onChange={(e) => handleInputChange('alternateLocation', e.target.value)}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="form-step">
            <h2>Contact & Web</h2>
            <div className="form-group">
              <label>Email *</label>
              <input 
                type="email" 
                placeholder="contact@troop.org"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Website</label>
              <input 
                type="text" 
                placeholder="www.troopXXX.org"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Instagram Handle</label>
              <input 
                type="text" 
                placeholder="@troopXXX"
                value={formData.instagram}
                onChange={(e) => handleInputChange('instagram', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input 
                type="tel" 
                placeholder="(Optional)"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="form-step">
            <h2>Description & Highlights</h2>
            <div className="form-group">
              <label>Why Join Us?</label>
              <textarea 
                placeholder="We offer a supportive community focused on leadership development, outdoor adventure, and lifelong friendships..."
                value={formData.whyJoin}
                onChange={(e) => handleInputChange('whyJoin', e.target.value)}
                rows="3"
              />
            </div>
            <div className="form-group">
              <label>What is Scouting America?</label>
              <textarea 
                placeholder="Scouting America is a youth-led organization that teaches leadership through outdoor, first aid, aquatics, service..."
                value={formData.whatIsScouting}
                onChange={(e) => handleInputChange('whatIsScouting', e.target.value)}
                rows="3"
              />
            </div>
            <div className="form-group">
              <label>Annual Costs / Dues</label>
              <input 
                type="text" 
                placeholder="$150 national, $175 troop dues"
                value={formData.costs}
                onChange={(e) => handleInputChange('costs', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Key Highlights</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input 
                  type="text" 
                  placeholder="e.g., Adventure"
                  value={highlightInput}
                  onChange={(e) => setHighlightInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addHighlight()}
                />
                <button onClick={addHighlight} className="btn-secondary">Add</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {formData.highlights.map((h, i) => (
                  <span key={i} style={{ background: '#2E7D32', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '14px' }}>
                    {h} <button onClick={() => removeHighlight(i)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', marginLeft: '0.5rem' }}>×</button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="form-step">
            <h2>Select Images</h2>
            <div style={{ marginBottom: '1rem' }}>
              <h3>Hero Image</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '0.5rem' }}>
                {IMAGE_LIBRARY.hero.map(img => (
                  <button 
                    key={img.id}
                    onClick={() => selectFromLibrary(img.id, 'hero')}
                    style={{ 
                      border: formData.heroImageRef === img.id ? '3px solid #2E7D32' : '1px solid #ddd',
                      padding: '0',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}
                  >
                    <img src={img.url} alt={img.name} style={{ width: '100%', height: '80px', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
              <label>Or Upload Custom Hero Image: </label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'hero')}
              />
              {formData.heroImage && <p style={{ color: 'green', fontSize: '12px' }}>✓ Hero image selected</p>}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <h3>Activity Grid Images (3)</h3>
              {[0, 1, 2].map(index => (
                <div key={index} style={{ marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid #ddd' }}>
                  <label>Image {index + 1}:</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    {IMAGE_LIBRARY.activity.map(img => (
                      <button 
                        key={img.id}
                        onClick={() => selectFromLibrary(img.id, 'activity', index)}
                        style={{ 
                          border: formData.activityImagesRef[index] === img.id ? '3px solid #2E7D32' : '1px solid #ddd',
                          padding: '0',
                          cursor: 'pointer',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}
                      >
                        <img src={img.url} alt={img.name} style={{ width: '100%', height: '60px', objectFit: 'cover' }} />
                      </button>
                    ))}
                  </div>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'activity', index)}
                  />
                  {formData.activityImages[index] && <p style={{ color: 'green', fontSize: '12px' }}>✓ Image selected</p>}
                </div>
              ))}
            </div>

            <div>
              <h3>Detail Section Images (3)</h3>
              {[0, 1, 2].map(index => (
                <div key={index} style={{ marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid #ddd' }}>
                  <label>Image {index + 1}:</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    {IMAGE_LIBRARY.activity.map(img => (
                      <button 
                        key={img.id}
                        onClick={() => selectFromLibrary(img.id, 'detail', index)}
                        style={{ 
                          border: formData.detailImagesRef[index] === img.id ? '3px solid #2E7D32' : '1px solid #ddd',
                          padding: '0',
                          cursor: 'pointer',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}
                      >
                        <img src={img.url} alt={img.name} style={{ width: '100%', height: '60px', objectFit: 'cover' }} />
                      </button>
                    ))}
                  </div>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'detail', index)}
                  />
                  {formData.detailImages[index] && <p style={{ color: 'green', fontSize: '12px' }}>✓ Image selected</p>}
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: '#2E7D32', marginBottom: '0.5rem' }}>Scout Flyer Generator</h1>
          <p style={{ color: '#666' }}>Create a professional recruitment flyer for your Scout troop in minutes</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* LEFT: Form */}
          <div>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', justifyContent: 'space-between', fontSize: '12px', color: '#666' }}>
                {[1, 2, 3, 4, 5].map(s => (
                  <div 
                    key={s}
                    onClick={() => setStep(s)}
                    style={{
                      cursor: 'pointer',
                      padding: '0.5rem 1rem',
                      background: step === s ? '#2E7D32' : '#eee',
                      color: step === s ? 'white' : '#333',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}
                  >
                    Step {s}
                  </div>
                ))}
              </div>

              {renderStep()}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button 
                  onClick={() => setStep(Math.max(1, step - 1))}
                  disabled={step === 1}
                  className="btn-secondary"
                >
                  ← Back
                </button>
                {step < 5 && (
                  <button 
                    onClick={() => setStep(step + 1)}
                    className="btn-primary"
                  >
                    Next →
                  </button>
                )}
              </div>

              {step === 5 && (
                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                  <button 
                    onClick={() => setShowPreview(true)}
                    className="btn-primary"
                  >
                    ✓ Generate Flyer Preview
                  </button>
                  <button 
                    onClick={() => exportTemplate(formData)}
                    className="btn-secondary"
                  >
                    💾 Save Template
                  </button>
                  <button 
                    onClick={() => templateInputRef.current?.click()}
                    className="btn-secondary"
                  >
                    📂 Load Template
                  </button>
                  <input 
                    ref={templateInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleTemplateLoad}
                    style={{ display: 'none' }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Preview or Download */}
          <div>
            {!showPreview ? (
              <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center', color: '#666' }}>
                <p>Complete all steps and click "Generate Flyer Preview" to see your recruitment flyer.</p>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
                  <button 
                    onClick={() => setPreviewTab('slide1')}
                    style={{
                      padding: '0.5rem 1rem',
                      background: previewTab === 'slide1' ? '#2E7D32' : '#ddd',
                      color: previewTab === 'slide1' ? 'white' : '#333',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Slide 1 (Hero)
                  </button>
                  <button 
                    onClick={() => setPreviewTab('slide2')}
                    style={{
                      padding: '0.5rem 1rem',
                      background: previewTab === 'slide2' ? '#2E7D32' : '#ddd',
                      color: previewTab === 'slide2' ? 'white' : '#333',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Slide 2 (Details)
                  </button>
                </div>

                <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', maxHeight: '600px', overflowY: 'auto' }}>
                  {/* Embed simplified preview */}
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {previewTab === 'slide1' && (
                      <div style={{ background: '#2E7D32', color: 'white', padding: '1rem', borderRadius: '4px', textAlign: 'center' }}>
                        <h3>{formData.troopName || 'Troop Name'}</h3>
                        <p>Adventure starts here.</p>
                        <p>{formData.ageRange}</p>
                        <p style={{ fontSize: '11px', marginTop: '1rem' }}>
                          📍 {formData.address || 'Location'}<br/>
                          📅 {formData.meetingDay}, {formData.meetingTime}<br/>
                          📧 {formData.email || 'Email'}
                        </p>
                      </div>
                    )}
                    {previewTab === 'slide2' && (
                      <div style={{ padding: '1rem' }}>
                        <h3 style={{ color: '#2E7D32' }}>{formData.troopName} at a Glance</h3>
                        <p><strong>Why Join?</strong><br/>{formData.whyJoin || '(Your description)'}</p>
                        <p><strong>Costs:</strong> {formData.costs || '(To be determined)'}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                  <button 
                    onClick={downloadFlyer}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: '#2E7D32',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}
                  >
                    ⬇️ Download as HTML
                  </button>
                  <p style={{ fontSize: '11px', color: '#666', textAlign: 'center' }}>
                    💡 Open the HTML file in your browser, then print (Cmd+P / Ctrl+P) → Save as PDF
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .form-group {
          margin-bottom: 1rem;
        }
        .form-group label {
          display: block;
          font-weight: 500;
          margin-bottom: 0.25rem;
          font-size: 14px;
          color: #333;
        }
        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          font-family: inherit;
        }
        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
          outline: none;
          border-color: #2E7D32;
          box-shadow: 0 0 0 2px rgba(46, 125, 50, 0.1);
        }
        .btn-primary {
          padding: 0.75rem 1.5rem;
          background: #2E7D32;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          font-size: 14px;
        }
        .btn-primary:hover {
          background: #1b5e20;
        }
        .btn-primary:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        .btn-secondary {
          padding: 0.5rem 1rem;
          background: #eee;
          color: #333;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }
        .btn-secondary:hover {
          background: #ddd;
        }
        .form-step h2 {
          color: #2E7D32;
          margin-bottom: 1.5rem;
          font-size: 20px;
        }
        .form-step h3 {
          font-size: 14px;
          color: #333;
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default ScoutFlyerBuilder;
