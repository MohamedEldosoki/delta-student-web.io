// DOM Elements
const findPartnersBtn = document.getElementById('findPartnersBtn');
const scheduleSessionBtn = document.getElementById('scheduleSessionBtn');
const scheduleModal = document.getElementById('scheduleModal');
const findPartnersModal = document.getElementById('findPartnersModal');
const closeModalBtns = document.querySelectorAll('.close-modal');
const partnersGrid = document.getElementById('partnersGrid');
const sessionsList = document.getElementById('sessionsList');
const recommendationsSlider = document.getElementById('recommendationsSlider');
const nextRecommendationsBtn = document.getElementById('nextRecommendations');
const prevRecommendationsBtn = document.getElementById('prevRecommendations');
const partnerSearch = document.getElementById('partnerSearch');
const filterTags = document.getElementById('filterTags');
const notificationCenter = document.querySelector('.notification-center');
const notificationsList = document.getElementById('notificationsList');
const subjectFilter = document.getElementById('subjectFilter');
const availabilityFilter = document.getElementById('availabilityFilter');
const ratingFilter = document.getElementById('ratingFilter');

// Sample Data
const partnersData = [
  {
    id: 1,
    name: 'Alex Johnson',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    subjects: ['Calculus', 'Physics'],
    status: 'online',
    sessions: 12,
    hours: 8.5,
    rating: 4.8
  },
  {
    id: 2,
    name: 'Samantha Lee',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    subjects: ['Chemistry', 'Biology'],
    status: 'offline',
    sessions: 8,
    hours: 6.2,
    rating: 4.5
  },
  {
    id: 3,
    name: 'David Chen',
    avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    subjects: ['Computer Science', 'Algebra'],
    status: 'busy',
    sessions: 15,
    hours: 12.7,
    rating: 4.9
  },
  {
    id: 4,
    name: 'Emily Wilson',
    avatar: 'https://randomuser.me/api/portraits/women/17.jpg',
    subjects: ['English Literature', 'History'],
    status: 'online',
    sessions: 6,
    hours: 4.5,
    rating: 4.6
  }
];

const sessionsData = [
  {
    id: 1,
    title: 'Calculus Chapter 3 Review',
    date: '2025-04-08',
    startTime: '15:30',
    endTime: '17:00',
    subject: 'Calculus',
    participants: [1, 3, 4],
    location: 'Zoom Meeting'
  },
  {
    id: 2,
    title: 'Computer Science Project Collaboration',
    date: '2025-04-10',
    startTime: '16:00',
    endTime: '18:00',
    subject: 'Computer Science',
    participants: [2, 3],
    location: 'Library Study Room 204'
  },
  {
    id: 3,
    title: 'Physics Problem Set Help',
    date: '2025-04-12',
    startTime: '14:00',
    endTime: '15:30',
    subject: 'Physics',
    participants: [1, 4],
    location: 'Zoom Meeting'
  }
];

const recommendationsData = [
  {
    id: 5,
    name: 'Michael Rodriguez',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    subjects: ['Physics', 'Computer Science'],
    mutualConnections: 2,
    rating: 4.7,
    availability: 'Evenings, Weekends'
  },
  {
    id: 6,
    name: 'Jessica Wang',
    avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
    subjects: ['Calculus', 'Chemistry'],
    mutualConnections: 1,
    rating: 4.9,
    availability: 'Weekdays'
  },
  {
    id: 7,
    name: 'Jamal Edwards',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    subjects: ['Algebra', 'Statistics'],
    mutualConnections: 3,
    rating: 4.8,
    availability: 'Mornings, Weekends'
  },
  {
    id: 8,
    name: 'Sophia Martinez',
    avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
    subjects: ['Biology', 'Chemistry'],
    mutualConnections: 2,
    rating: 4.6,
    availability: 'Evenings'
  },
  {
    id: 9,
    name: 'Ryan Kim',
    avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
    subjects: ['Computer Science', 'Physics'],
    mutualConnections: 1,
    rating: 4.5,
    availability: 'Weekends'
  }
];

const notificationsData = [
  {
    id: 1,
    type: 'session_invite',
    message: 'Alex Johnson invited you to a Calculus study session on April 8.',
    time: '10 minutes ago',
    read: false
  },
  {
    id: 2,
    type: 'message',
    message: 'New message from Samantha Lee regarding your Chemistry questions.',
    time: '1 hour ago',
    read: false
  },
  {
    id: 3,
    type: 'recommendation',
    message: 'We found 3 new study partners for your Computer Science course!',
    time: '3 hours ago',
    read: true
  },
  {
    id: 4,
    type: 'reminder',
    message: 'Reminder: Physics study session with David Chen starts in 2 hours.',
    time: 'Yesterday',
    read: true
  }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  renderPartners();
  renderSessions();
  renderRecommendations();
  renderNotifications();
  setupEventListeners();
  
  // Add animation classes
  document.querySelectorAll('.partner-card, .session-item, .recommendation-card').forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    setTimeout(() => {
      element.style.transition = 'opacity 500ms ease, transform 500ms ease';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, 100 * index);
  });
});

// Render Functions
function renderPartners() {
  partnersGrid.innerHTML = '';
  
  partnersData.forEach(partner => {
    const partnerCard = document.createElement('div');
    partnerCard.className = 'partner-card';
    partnerCard.innerHTML = `
      <div class="partner-header">
        <div class="partner-avatar">
          <img src="${partner.avatar}" alt="${partner.name}">
          <span class="status-indicator ${partner.status}"></span>
        </div>
        <div class="partner-info">
          <h3>${partner.name}</h3>
          <p class="partner-subjects">${partner.subjects.join(', ')}</p>
        </div>
      </div>
      <div class="partner-stats">
        <div class="stat-item">
          <span class="stat-label">Sessions</span>
          <span class="stat-value">${partner.sessions}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Hours</span>
          <span class="stat-value">${partner.hours}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Rating</span>
          <span class="stat-value">${partner.rating}</span>
        </div>
      </div>
      <div class="partner-actions">
        <button class="btn btn-outline btn-sm" data-partner-id="${partner.id}">Message</button>
        <button class="btn btn-primary btn-sm" data-partner-id="${partner.id}">Schedule</button>
      </div>
    `;
    partnersGrid.appendChild(partnerCard);
  });
}

function renderSessions() {
  sessionsList.innerHTML = '';
  
  sessionsData.forEach(session => {
    const sessionDate = new Date(session.date);
    const formattedDate = sessionDate.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
    
    const participants = session.participants.map(id => 
      partnersData.find(partner => partner.id === id)
    ).filter(Boolean);
    
    const sessionItem = document.createElement('div');
    sessionItem.className = 'session-item';
    sessionItem.innerHTML = `
      <div class="session-info">
        <h4>${session.title}</h4>
        <div class="session-details">
          <span class="session-date"><i class="fas fa-calendar-alt"></i> ${formattedDate}</span>
          <span class="session-time"><i class="fas fa-clock"></i> ${formatTime(session.startTime)} - ${formatTime(session.endTime)}</span>
          <span class="session-location"><i class="fas fa-map-marker-alt"></i> ${session.location}</span>
        </div>
        <div class="session-participants">
          <span class="participant-avatars">
            ${participants.map((participant, index) => `
              <img src="${participant.avatar}" alt="${participant.name}" style="z-index: ${10 - index}">
            `).join('')}
          </span>
          <span class="participant-count">${participants.length} participant${participants.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
      <div class="session-actions">
        <button class="btn btn-outline btn-sm"><i class="fas fa-pen"></i></button>
        <button class="btn btn-primary btn-sm">Join</button>
      </div>
    `;
    sessionsList.appendChild(sessionItem);
  });
}

function renderRecommendations() {
  recommendationsSlider.innerHTML = '';
  
  recommendationsData.forEach(recommendation => {
    const recommendationCard = document.createElement('div');
    recommendationCard.className = 'recommendation-card';
    recommendationCard.innerHTML = `
      <div class="recommendation-header">
        <img src="${recommendation.avatar}" alt="${recommendation.name}" class="recommendation-avatar">
        <h3>${recommendation.name}</h3>
        <div class="recommendation-rating">
          <i class="fas fa-star"></i> ${recommendation.rating}
        </div>
      </div>
      <div class="recommendation-body">
        <p><strong>Subjects:</strong> ${recommendation.subjects.join(', ')}</p>
        <p><strong>Availability:</strong> ${recommendation.availability}</p>
        <p><strong>Mutual Connections:</strong> ${recommendation.mutualConnections}</p>
      </div>
      <div class="recommendation-actions">
        <button class="btn btn-outline btn-sm">View Profile</button>
        <button class="btn btn-primary btn-sm">Connect</button>
      </div>
    `;
    recommendationsSlider.appendChild(recommendationCard);
  });
}

function renderNotifications() {
  notificationsList.innerHTML = '';
  
  notificationsData.forEach(notification => {
    const notificationItem = document.createElement('div');
    notificationItem.className = `notification-item ${notification.read ? '' : 'unread'}`;
    notificationItem.dataset.id = notification.id;
    
    let icon;
    switch(notification.type) {
      case 'session_invite':
        icon = 'fa-calendar-plus';
        break;
      case 'message':
        icon = 'fa-envelope';
        break;
      case 'recommendation':
        icon = 'fa-user-plus';
        break;
      case 'reminder':
        icon = 'fa-bell';
        break;
      default:
        icon = 'fa-info-circle';
    }
    
    notificationItem.innerHTML = `
      <div class="notification-content">
        <div class="notification-icon">
          <i class="fas ${icon}"></i>
        </div>
        <div class="notification-message">
          <p>${notification.message}</p>
          <span class="notification-time">${notification.time}</span>
        </div>
      </div>
      ${notification.read ? '' : '<div class="notification-badge"></div>'}
    `;
    
    notificationsList.appendChild(notificationItem);
  });
}

// Utility Functions
function formatTime(timeString) {
  const [hours, minutes] = timeString.split(':');
  let hour = parseInt(hours);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  
  if (hour > 12) hour -= 12;
  if (hour === 0) hour = 12;
  
  return `${hour}:${minutes} ${suffix}`;
}

function applyFilters() {
  const subjectValue = subjectFilter.value;
  const availabilityValue = availabilityFilter.value;
  const ratingValue = ratingFilter.value;
  
  // Clear previous tags
  filterTags.innerHTML = '';
  
  // Add tags for active filters
  if (subjectValue !== 'all') {
    addFilterTag('Subject: ' + subjectValue, 'subject');
  }
  
  if (availabilityValue !== 'all') {
    addFilterTag('Availability: ' + availabilityValue, 'availability');
  }
  
  if (ratingValue !== 'all') {
    addFilterTag('Rating: ' + ratingValue, 'rating');
  }
  
  // In a real app, you would filter the data here
  // This is just a demonstration
  animateFilterEffect();
}

function addFilterTag(text, type) {
  const tag = document.createElement('span');
  tag.className = 'filter-tag';
  tag.innerHTML = `${text} <i class="fas fa-times" data-filter-type="${type}"></i>`;
  filterTags.appendChild(tag);
  
  // Add click handler to remove the tag
  tag.querySelector('i').addEventListener('click', function() {
    const filterType = this.dataset.filterType;
    document.getElementById(filterType + 'Filter').value = 'all';
    applyFilters();
  });
}

function animateFilterEffect() {
  // Simple animation to show filter effect
  const cards = document.querySelectorAll('.partner-card, .recommendation-card');
  cards.forEach(card => {
    card.style.opacity = '0.5';
    card.style.transform = 'scale(0.98)';
    
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'scale(1)';
    }, 300);
  });
}

// Event Listeners
function setupEventListeners() {
  // Modal Triggers
  findPartnersBtn.addEventListener('click', () => toggleModal(findPartnersModal, true));
  scheduleSessionBtn.addEventListener('click', () => toggleModal(scheduleModal, true));
  
  // Close Modals
  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const modal = this.closest('.modal');
      toggleModal(modal, false);
    });
  });
  
  // Outside click closes modal
  document.addEventListener('click', function(e) {
    const modals = document.querySelectorAll('.modal.open');
    modals.forEach(modal => {
      if (e.target === modal) {
        toggleModal(modal, false);
      }
    });
  });
  
  // Slider Navigation
  nextRecommendationsBtn.addEventListener('click', () => {
    recommendationsSlider.scrollBy({ left: 300, behavior: 'smooth' });
  });
  
  prevRecommendationsBtn.addEventListener('click', () => {
    recommendationsSlider.scrollBy({ left: -300, behavior: 'smooth' });
  });
  
  // Search Functionality
  partnerSearch.addEventListener('input', function() {
    // Simple search functionality
    const searchTerm = this.value.toLowerCase();
    
    if (searchTerm.length > 0) {
      // Highlight matching partners
      document.querySelectorAll('.partner-card').forEach(card => {
        const partnerName = card.querySelector('h3').textContent.toLowerCase();
        const partnerSubjects = card.querySelector('.partner-subjects').textContent.toLowerCase();
        
        if (partnerName.includes(searchTerm) || partnerSubjects.includes(searchTerm)) {
          card.style.borderColor = 'var(--brand-blue)';
          card.style.boxShadow = '0 0 0 2px rgba(0, 123, 255, 0.25)';
        } else {
          card.style.opacity = '0.5';
        }
      });
    } else {
      // Reset styles
      document.querySelectorAll('.partner-card').forEach(card => {
        card.style.borderColor = 'var(--light-gray)';
        card.style.boxShadow = 'none';
        card.style.opacity = '1';
      });
    }
  });
  
  // Filter Changes
  subjectFilter.addEventListener('change', applyFilters);
  availabilityFilter.addEventListener('change', applyFilters);
  ratingFilter.addEventListener('change', applyFilters);
  
  // Toggle Notification Center
  document.querySelector('.fa-bell').addEventListener('click', function() {
    notificationCenter.classList.toggle('open');
  });
  
  document.getElementById('closeNotifications').addEventListener('click', function() {
    notificationCenter.classList.remove('open');
  });
  
  // Mark notifications as read when clicked
  notificationsList.addEventListener('click', function(e) {
    const notificationItem = e.target.closest('.notification-item');
    if (notificationItem) {
      notificationItem.classList.remove('unread');
      // In a real app, you would update the server
    }
  });
  
  // Notification count badge update
  updateNotificationCount();
  
  // Form handling for the schedule modal
  document.getElementById('scheduleForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // In a real app, you would save the form data
    showToast('Study session scheduled successfully!');
    toggleModal(scheduleModal, false);
  });
  
  // Location toggle buttons
  document.querySelectorAll('.btn-toggle').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.btn-toggle').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      const locationType = this.dataset.location;
      const locationInput = document.getElementById('sessionLocation');
      
      if (locationType === 'virtual') {
        locationInput.placeholder = 'Enter Zoom link or online meeting URL';
      } else {
        locationInput.placeholder = 'Enter physical location (e.g., Library Room 204)';
      }
    });
  });
}

function toggleModal(modal, open) {
  if (open) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  } else {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function updateNotificationCount() {
  const unreadCount = notificationsData.filter(n => !n.read).length;
  
  // Create or update the notification badge
  let badge = document.querySelector('.notification-count');
  
  if (!badge && unreadCount > 0) {
    badge = document.createElement('span');
    badge.className = 'notification-count';
    document.querySelector('.fa-bell').parentElement.appendChild(badge);
  }
  
  if (badge) {
    if (unreadCount > 0) {
      badge.textContent = unreadCount;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  }
}

function showToast(message) {
  // Create toast container if it doesn't exist
  let toastContainer = document.querySelector('.toast-container');
  
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <div class="toast-content">
      <i class="fas fa-check-circle"></i>
      <span>${message}</span>
    </div>
  `;
  
  // Add to container
  toastContainer.appendChild(toast);
  
  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 10);
  
  // Remove after timeout
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Additional CSS for toast notifications
document.head.insertAdjacentHTML('beforeend', `
  <style>
    .toast-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .toast {
      background-color: var(--success);
      color: white;
      padding: 12px 20px;
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-md);
      transform: translateX(100%);
      opacity: 0;
      transition: transform 300ms ease, opacity 300ms ease;
    }
    
    .toast.show {
      transform: translateX(0);
      opacity: 1;
    }
    
    .toast-content {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .notification-count {
      position: absolute;
      top: -5px;
      right: -5px;
      background-color: var(--danger);
      color: white;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      font-size: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }
    
    /* Additional animation for the partner cards */
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.02); }
      100% { transform: scale(1); }
    }
    
    .partner-card:hover .partner-avatar img {
      animation: pulse 1s infinite;
    }
  </style>
`);
