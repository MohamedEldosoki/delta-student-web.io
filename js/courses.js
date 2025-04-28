

document.addEventListener('DOMContentLoaded', () => {
          // --- DOM Element Selectors ---
          const greetingEl = document.getElementById('greeting');
          const currentDateEl = document.getElementById('current-date');
          const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
          const mainNavMenu = document.getElementById('main-nav-menu');
          const searchInput = document.querySelector('.search-input');
          const searchClear = document.querySelector('.search-clear');
          const searchIcon = document.querySelector('.search-icon');
          const notificationsToggle = document.querySelector('.notifications-toggle');
      
          // Roadmap Elements
          const roadmapActions = document.querySelector('.roadmap-actions');
          const roadmapToggles = document.querySelectorAll('.roadmap-toggle');
          const roadmapViews = document.querySelectorAll('.roadmap-view');
          const roadmapHeading = document.getElementById('roadmap-heading');
      
          // Course Filtering/Sorting Elements
          const filterTech = document.getElementById('filter-tech');
          const filterLevel = document.getElementById('filter-level');
          const sortCourses = document.getElementById('sort-courses');
          const coursesGrid = document.getElementById('courses-list');
          const allCourseCards = Array.from(coursesGrid.querySelectorAll('.course-card')); // Store initial cards
          const loadMoreBtn = document.getElementById('load-more-courses');
      
          // Modal Elements
          const modalContainer = document.getElementById('course-detail-modal');
          const modalTitle = document.getElementById('modal-title');
          const modalContent = document.getElementById('course-detail-content');
          const modalCloseBtns = modalContainer.querySelectorAll('.modal-close, .modal-close-btn');
          const modalEnrollBtn = modalContainer.querySelector('.modal-footer .enroll-btn');
      
          // Toast Container
          const toastContainer = document.querySelector('.toast-container');
      
          let currentlyFocusedElement = null; // For modal accessibility
      
          // --- Dynamic Content ---
      
          function updateGreeting() {
              if (!greetingEl) return;
              const hour = new Date().getHours();
              let greetingText = "Welcome Back";
              if (hour < 12) {
                  greetingText = "Good Morning";
              } else if (hour < 18) {
                  greetingText = "Good Afternoon";
              } else {
                  greetingText = "Good Evening";
              }
              greetingEl.textContent = `${greetingText}! Your Programming Journey`;
          }
      
          function updateDate() {
              if (!currentDateEl) return;
              const today = new Date();
              const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
              currentDateEl.textContent = today.toLocaleDateString('en-US', options);
          }
      
          // --- Event Listeners Setup ---
      
          function initializeEventListeners() {
              // Mobile Menu
              if (mobileMenuToggle && mainNavMenu) {
                  mobileMenuToggle.addEventListener('click', toggleMobileMenu);
              }
      
              // Search Input
              if (searchInput && searchClear) {
                  searchInput.addEventListener('input', handleSearchInput);
                  searchClear.addEventListener('click', clearSearch);
                  // Optional: focus input when icon is clicked
                  if (searchIcon) {
                      searchIcon.addEventListener('click', () => searchInput.focus());
                  }
              }
              
              // Notifications (Placeholder)
              if (notificationsToggle) {
                  notificationsToggle.addEventListener('click', () => {
                      showToast('Notifications panel coming soon!', 'info');
                  });
              }
      
              // Roadmap Toggles
              if (roadmapActions) {
                  roadmapActions.addEventListener('click', handleRoadmapToggle);
              }
      
              // Course Filters & Sort
              if (filterTech) filterTech.addEventListener('change', filterAndSortCourses);
              if (filterLevel) filterLevel.addEventListener('change', filterAndSortCourses);
              if (sortCourses) sortCourses.addEventListener('change', filterAndSortCourses);
      
              // Course Grid Interactions (Event Delegation)
              if (coursesGrid) {
                  coursesGrid.addEventListener('click', handleCourseGridClick);
              }
      
              // Modal Close Buttons
              modalCloseBtns.forEach(btn => btn.addEventListener('click', hideModal));
              // Close modal on overlay click
              if (modalContainer) {
                  modalContainer.addEventListener('click', (e) => {
                      if (e.target === modalContainer) {
                          hideModal();
                      }
                  });
                  // Close modal on Escape key
                   modalContainer.addEventListener('keydown', (e) => {
                      if (e.key === 'Escape') {
                          hideModal();
                      }
                  });
              }
              
              // Modal Enroll Button (links to grid handler for simulation)
              if (modalEnrollBtn) {
                  modalEnrollBtn.addEventListener('click', handleEnrollClick);
              }
      
      
              // Load More Courses
              if (loadMoreBtn) {
                  loadMoreBtn.addEventListener('click', loadMoreCourses);
              }
          }
      
          // --- Event Handlers ---
      
          function toggleMobileMenu() {
              const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
              mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
              mainNavMenu.classList.toggle('active');
              mobileMenuToggle.querySelector('i').classList.toggle('fa-bars');
              mobileMenuToggle.querySelector('i').classList.toggle('fa-times');
          }
      
          function handleSearchInput() {
              const searchTerm = searchInput.value.trim();
              searchClear.style.display = searchTerm ? 'block' : 'none';
              filterAndSortCourses(); // Trigger filtering based on search
          }
      
          function clearSearch() {
              searchInput.value = '';
              searchClear.style.display = 'none';
              filterAndSortCourses(); // Reset filter
              searchInput.focus();
          }
          
          function handleRoadmapToggle(event) {
              const clickedToggle = event.target.closest('.roadmap-toggle');
              if (!clickedToggle) return; // Clicked outside a button
      
              const targetView = clickedToggle.dataset.view;
              if (!targetView) return;
      
              // Update button states
              roadmapToggles.forEach(toggle => {
                  toggle.classList.remove('active');
                  toggle.setAttribute('aria-pressed', 'false');
              });
              clickedToggle.classList.add('active');
              clickedToggle.setAttribute('aria-pressed', 'true');
      
      
              // Update view visibility
              roadmapViews.forEach(view => {
                  view.classList.remove('active');
                  if (view.id === `${targetView}-roadmap`) {
                      view.classList.add('active');
                  }
              });
              
               // Update heading (optional)
              let headingText = "Full-Stack Developer Roadmap";
              if (targetView === 'frontend') headingText = "Frontend Developer Roadmap";
              if (targetView === 'backend') headingText = "Backend Developer Roadmap";
              roadmapHeading.textContent = headingText;
          }
      
          function filterAndSortCourses() {
              if (!coursesGrid) return;
              const selectedTech = filterTech ? filterTech.value : 'all';
              const selectedLevel = filterLevel ? filterLevel.value : 'all';
              const sortBy = sortCourses ? sortCourses.value : 'recommended';
              const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
      
              // 1. Filter
              let filteredCards = allCourseCards.filter(card => {
                  const tags = Array.from(card.querySelectorAll('.course-tag')).map(tag => tag.textContent.toLowerCase());
                  const level = card.querySelector('.course-level')?.textContent.toLowerCase() || '';
                  const title = card.querySelector('.course-title')?.textContent.toLowerCase() || '';
                  const description = card.querySelector('.course-description')?.textContent.toLowerCase() || '';
                  const instructor = card.querySelector('.course-instructor')?.textContent.toLowerCase() || '';
      
                  const techMatch = selectedTech === 'all' || tags.includes(selectedTech);
                  const levelMatch = selectedLevel === 'all' || level.includes(selectedLevel);
                  const searchMatch = searchTerm === '' || 
                                      title.includes(searchTerm) || 
                                      description.includes(searchTerm) || 
                                      instructor.includes(searchTerm) ||
                                      tags.some(tag => tag.includes(searchTerm));
      
      
                  return techMatch && levelMatch && searchMatch;
              });
      
              // 2. Sort (Basic simulation - real sorting needs more data)
              // For demo, we'll just log the sort criteria. A real implementation
              // would involve comparing data attributes (like rating, students, date added).
              console.log(`Sorting by: ${sortBy}`);
              // Example: Simple sort by title for 'newest' (alphabetical as proxy)
              if (sortBy === 'newest') {
                 filteredCards.sort((a, b) => {
                      const titleA = a.querySelector('.course-title')?.textContent || '';
                      const titleB = b.querySelector('.course-title')?.textContent || '';
                      return titleA.localeCompare(titleB);
                 });
              }
               // Example: Simple sort by rating (descending)
              else if (sortBy === 'rating') {
                  filteredCards.sort((a, b) => {
                      const ratingA = parseFloat(a.querySelector('.course-rating span')?.textContent.match(/(\d\.\d)/)?.[1] || 0);
                      const ratingB = parseFloat(b.querySelector('.course-rating span')?.textContent.match(/(\d\.\d)/)?.[1] || 0);
                      return ratingB - ratingA; // Descending
                  });
              }
              // Add more sort logic for 'popularity' (students) etc.
      
      
              // 3. Update Grid
              coursesGrid.innerHTML = ''; // Clear current grid
              if (filteredCards.length > 0) {
                  filteredCards.forEach(card => coursesGrid.appendChild(card));
              } else {
                  coursesGrid.innerHTML = '<p class="no-results">No courses found matching your criteria.</p>';
              }
              
              // Hide/show Load More button based on whether all original cards are displayed
              loadMoreBtn.style.display = (filteredCards.length < allCourseCards.length && searchTerm === '' && selectedLevel === 'all' && selectedTech === 'all') ? 'inline-block' : 'none';
          }
      
          function handleCourseGridClick(event) {
              const target = event.target;
              const courseCard = target.closest('.course-card');
              if (!courseCard) return;
      
              const courseId = courseCard.dataset.id;
      
              // Wishlist Toggle
              if (target.closest('.course-wishlist')) {
                  event.preventDefault(); // Prevent potential navigation if it were a link
                  const wishlistBtn = target.closest('.course-wishlist');
                  const isActive = wishlistBtn.classList.toggle('active');
                  wishlistBtn.setAttribute('aria-label', isActive ? 'Remove from wishlist' : 'Add to wishlist');
                  showToast(isActive ? 'Added to wishlist!' : 'Removed from wishlist.', 'success');
                  return; // Don't open modal on wishlist click
              }
      
              // Enroll Button Click
              if (target.matches('.enroll-btn') || target.closest('.enroll-btn')) {
                  event.preventDefault();
                   handleEnrollClick(courseId, courseCard); // Pass card to get title easily
                  return; // Don't open modal on enroll click
              }
              
              // Click on card content (image, title, etc.) -> Open Modal
              if (courseId && !target.closest('button') && !target.closest('a:not(.milestone-course)')) { // Ensure not clicking buttons/links
                   showModal(courseId, courseCard);
              }
          }
          
          function handleEnrollClick(courseIdFromModalOrEvent, courseCardElement = null) {
              let courseId = courseIdFromModalOrEvent;
              let courseTitle = "Selected Course";
      
              // If triggered from modal, courseIdFromModalOrEvent is the button itself
              if (typeof courseIdFromModalOrEvent !== 'string' ) {
                   courseId = modalEnrollBtn.dataset.courseId; // Get ID stored on modal button
                   const titleElement = modalContent.querySelector('h3') || modalTitle;
                   courseTitle = titleElement ? titleElement.textContent : "Course";
              } 
              // If triggered from grid click
              else if (courseCardElement) {
                   courseTitle = courseCardElement.querySelector('.course-title')?.textContent || "Course";
              }
              // If only ID is passed (less ideal)
              else {
                   const cardInGrid = coursesGrid.querySelector(`.course-card[data-id="${courseId}"]`);
                   if (cardInGrid) {
                       courseTitle = cardInGrid.querySelector('.course-title')?.textContent || "Course";
                   }
              }
      
              console.log(`Attempting to enroll in course ID: ${courseId}`); // For debugging
              showToast(`Enrolled in "${courseTitle}"! (Simulation)`, 'success');
              
              // Optionally update the button text or state in the grid/modal
              const gridEnrollBtn = coursesGrid.querySelector(`.course-card[data-id="${courseId}"] .enroll-btn`);
              if (gridEnrollBtn) {
                  gridEnrollBtn.textContent = 'Enrolled';
                  gridEnrollBtn.disabled = true;
              }
               if (modalContainer.classList.contains('active') && modalEnrollBtn.dataset.courseId === courseId) {
                  modalEnrollBtn.textContent = 'Enrolled';
                  modalEnrollBtn.disabled = true;
                  // Maybe close modal after enrollment?
                  // setTimeout(hideModal, 1500); 
              }
          }
      
          function loadMoreCourses() {
              loadMoreBtn.disabled = true;
              loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Loading...';
      
              // Simulate network request
              setTimeout(() => {
                  const currentCount = coursesGrid.querySelectorAll('.course-card').length;
                  const nextCourses = allCourseCards.slice(currentCount, currentCount + 3); // Load 3 more
      
                  if (nextCourses.length > 0) {
                      nextCourses.forEach(card => {
                          // Ensure we append clones if we modify originals elsewhere, or re-query if needed
                           coursesGrid.appendChild(card.cloneNode(true)); 
                      });
                       allCourseCards.push(...nextCourses); // Add newly "loaded" cards to the main list if they weren't there initially (adjust logic if needed)
                       
                       // Re-apply filters/sort after adding? Or assume they match current filters?
                       // For simplicity, we just append. A better way is to filter the *entire* dataset
                       // and just show more from the filtered list.
      
                      loadMoreBtn.disabled = false;
                      loadMoreBtn.innerHTML = '<i class="fas fa-spinner" aria-hidden="true"></i> Load More Courses';
      
                      // Hide button if all courses are now loaded
                      if (coursesGrid.querySelectorAll('.course-card').length >= allCourseCards.length) {
                           loadMoreBtn.style.display = 'none';
                       }
      
                  } else {
                      showToast("No more courses to load.", "info");
                      loadMoreBtn.style.display = 'none'; // Hide button definitely
                  }
                   filterAndSortCourses(); // Re-apply filters to ensure consistency (might hide newly loaded ones if they don't match)
              }, 1000); // Simulate 1 second loading time
          }
      
      
          // --- Modal Functions ---
      
          function showModal(courseId, courseCardElement) {
              if (!modalContainer || !courseCardElement) return;
              
              // --- Fetch/Generate Course Details (Replace with actual data fetching if needed) ---
              const courseImage = courseCardElement.querySelector('.course-image img')?.src || '../pic/placeholder.jpg';
              const courseTitle = courseCardElement.querySelector('.course-title')?.textContent || 'Course Details';
              const courseInstructor = courseCardElement.querySelector('.course-instructor')?.textContent || 'N/A';
              const courseDescription = courseCardElement.querySelector('.course-description')?.textContent || 'No description available.';
              const courseRating = courseCardElement.querySelector('.course-rating')?.innerHTML || ''; // Include stars
              const courseStudents = courseCardElement.querySelector('.course-students')?.textContent || '';
              const coursePrice = courseCardElement.querySelector('.course-price')?.innerHTML || 'Free'; // Include original price if exists
              const courseTags = Array.from(courseCardElement.querySelectorAll('.course-tag')).map(tag => `<span class="course-tag">${tag.textContent}</span>`).join(' ');
              const isEnrolled = courseCardElement.querySelector('.enroll-btn')?.disabled === true;
      
              // --- Populate Modal Content ---
              modalTitle.textContent = courseTitle;
              modalContent.innerHTML = `
                  <img src="${courseImage}" alt="${courseTitle}" class="modal-course-image">
                  <h3>${courseTitle}</h3>
                  <p class="modal-instructor">By ${courseInstructor}</p>
                  <div class="modal-meta">
                       ${courseRating ? `<div class="course-rating">${courseRating}</div>` : ''}
                       ${courseStudents ? `<div class="course-students"><i class="fas fa-user-graduate"></i> ${courseStudents}</div>` : ''}
                  </div>
                   <div class="modal-tags">${courseTags}</div>
                  <h4>Description</h4>
                  <p>${courseDescription}</p>
                  <h4>What you'll learn (Sample)</h4>
                   <ul>
                      <li>Understand the core concepts of ${courseTitle.split(' ')[0]}.</li>
                      <li>Build real-world applications.</li>
                      <li>Master advanced techniques and best practices.</li>
                      <li>Prepare for technical interviews.</li>
                  </ul>
                  <div class="modal-price">Price: ${coursePrice}</div>
              `;
              
              // Update modal enroll button state
              modalEnrollBtn.textContent = isEnrolled ? 'Enrolled' : 'Enroll Now';
              modalEnrollBtn.disabled = isEnrolled;
              modalEnrollBtn.dataset.courseId = courseId; // Store ID for enroll action
      
      
              // --- Display Modal & Accessibility ---
              currentlyFocusedElement = document.activeElement; // Store focus
              modalContainer.classList.add('active');
              modalContainer.setAttribute('aria-hidden', 'false');
              
              // Set focus inside the modal (e.g., on the close button)
              // Use timeout to ensure modal is visible before focusing
              setTimeout(() => {
                 const firstFocusable = modalContainer.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                  if(firstFocusable) firstFocusable.focus();
              }, 100); 
              
               // Trap focus within the modal (basic implementation)
              const focusableElements = modalContainer.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
              const firstElement = focusableElements[0];
              const lastElement = focusableElements[focusableElements.length - 1];
      
              modalContainer.addEventListener('keydown', trapFocus);
      
               function trapFocus(e) {
                  if (e.key !== 'Tab') return;
      
                  if (e.shiftKey) { // Shift + Tab
                      if (document.activeElement === firstElement) {
                          lastElement.focus();
                          e.preventDefault();
                      }
                  } else { // Tab
                       if (document.activeElement === lastElement) {
                          firstElement.focus();
                          e.preventDefault();
                      }
                  }
              }
          }
      
          function hideModal() {
               if (!modalContainer) return;
              modalContainer.classList.remove('active');
              modalContainer.setAttribute('aria-hidden', 'true');
              modalContainer.removeEventListener('keydown', trapFocus); // Remove focus trap listener
      
              // Restore focus to the element that opened the modal
              if (currentlyFocusedElement) {
                  currentlyFocusedElement.focus();
                  currentlyFocusedElement = null;
              }
          }
           // Define trapFocus globally within hideModal's scope or hoist its definition
          function trapFocus(e) { /* ... implementation as above ... */ }
      
      
          // --- Toast Notification Function ---
      
          function showToast(message, type = 'info', duration = 3000) {
              if (!toastContainer) return;
      
              const toast = document.createElement('div');
              toast.className = `toast toast-${type}`;
              toast.setAttribute('role', 'alert');
              
              // Add icon based on type
              let iconClass = 'fas fa-info-circle';
              if (type === 'success') iconClass = 'fas fa-check-circle';
              if (type === 'error') iconClass = 'fas fa-times-circle';
              if (type === 'warning') iconClass = 'fas fa-exclamation-triangle';
              
              toast.innerHTML = `<i class="${iconClass}" aria-hidden="true"></i> ${message}`;
      
              toastContainer.appendChild(toast);
      
              // Fade in
              setTimeout(() => toast.classList.add('show'), 10); 
      
              // Auto dismiss
              setTimeout(() => {
                   toast.classList.remove('show');
                  // Remove element after transition
                   toast.addEventListener('transitionend', () => toast.remove(), { once: true });
              }, duration);
          }
      
      
          // --- Initialization ---
          updateGreeting();
          updateDate();
          initializeEventListeners();
          filterAndSortCourses(); // Initial filter/sort on load
      
      }); // End DOMContentLoaded