/**
 * schedule.js - Study Schedule Tracker
 * For Delta Students dashboard
 */

document.addEventListener('DOMContentLoaded', function() {
    // ========================================
    // 1. Date Configuration and Date Utilities
    // ========================================
    
    // Set the application date to April 7, 2025
    const CURRENT_DATE = new Date(2025, 3, 7); // April 7, 2025 (months are 0-indexed)
    
    // Update copyright year to match our system date
    document.querySelector('.footer-bottom p').textContent = `© ${CURRENT_DATE.getFullYear()} Delta Students. All rights reserved.`;

    // Date formatting utilities
    const DateUtils = {
        monthNames: ["January", "February", "March", "April", "May", "June", 
                     "July", "August", "September", "October", "November", "December"],
        
        shortMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        
        dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        
        shortDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        
        formatDate: function(date) {
            return `${this.monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
        },
        
        formatDateShort: function(date) {
            return `${this.shortMonthNames[date.getMonth()]} ${date.getDate()}`;
        },
        
        formatTime: function(date) {
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const hour12 = hours % 12 || 12;
            
            return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
        },
        
        formatTimeFromString: function(timeStr) {
            const [hours, minutes] = timeStr.split(':').map(Number);
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const hour12 = hours % 12 || 12;
            
            return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
        },
        
        formatDateForInput: function(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            
            return `${year}-${month}-${day}`;
        },
        
        getWeekRange: function(date) {
            // Get start of the week (Sunday)
            const startOfWeek = new Date(date);
            const day = date.getDay(); // 0 (Sunday) to 6 (Saturday)
            startOfWeek.setDate(date.getDate() - day);
            
            // Get end of the week (Saturday)
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            
            return { startOfWeek, endOfWeek };
        },
        
        formatWeekRange: function(date) {
            const { startOfWeek, endOfWeek } = this.getWeekRange(date);
            
            const startMonth = this.monthNames[startOfWeek.getMonth()];
            const endMonth = this.monthNames[endOfWeek.getMonth()];
            
            if (startMonth === endMonth) {
                return `${startMonth} ${startOfWeek.getDate()} - ${endOfWeek.getDate()}, ${startOfWeek.getFullYear()}`;
            } else {
                return `${startMonth} ${startOfWeek.getDate()} - ${endMonth} ${endOfWeek.getDate()}, ${startOfWeek.getFullYear()}`;
            }
        }
    };
    
    // ========================================
    // 2. Calendar & Date Display Functions
    // ========================================
    
    // Update mini calendar display
    function updateMiniCalendar() {
        const calendarHeader = document.querySelector('.calendar-header h3');
        const calendarDates = document.querySelector('.calendar-dates');
        
        // Set the month and year in the header
        calendarHeader.textContent = `${DateUtils.monthNames[CURRENT_DATE.getMonth()]} ${CURRENT_DATE.getFullYear()}`;
        
        // Clear the previous dates
        calendarDates.innerHTML = '';
        
        // Get the first day of the month
        const firstDay = new Date(CURRENT_DATE.getFullYear(), CURRENT_DATE.getMonth(), 1);
        const lastDay = new Date(CURRENT_DATE.getFullYear(), CURRENT_DATE.getMonth() + 1, 0);
        
        // Calculate days from previous month to display
        const startDayOfWeek = firstDay.getDay(); // 0 (Sunday) to 6 (Saturday)
        
        // Calculate the previous month's last days
        const prevMonthLastDay = new Date(CURRENT_DATE.getFullYear(), CURRENT_DATE.getMonth(), 0).getDate();
        
        // Add previous month days
        for (let i = 0; i < startDayOfWeek; i++) {
            const dateSpan = document.createElement('span');
            dateSpan.classList.add('inactive');
            dateSpan.textContent = prevMonthLastDay - startDayOfWeek + i + 1;
            calendarDates.appendChild(dateSpan);
            
            // Make inactive dates clickable too
            dateSpan.addEventListener('click', () => {
                const newDate = new Date(CURRENT_DATE);
                newDate.setMonth(newDate.getMonth() - 1);
                newDate.setDate(prevMonthLastDay - startDayOfWeek + i + 1);
                CURRENT_DATE.setTime(newDate.getTime());
                updateMiniCalendar();
                updateWeekNavigator();
            });
        }
        
        // Add current month days
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const dateSpan = document.createElement('span');
            
            // Check if this date is current date (April 7, 2025)
            if (i === CURRENT_DATE.getDate() && 
                CURRENT_DATE.getMonth() === CURRENT_DATE.getMonth() && 
                CURRENT_DATE.getFullYear() === CURRENT_DATE.getFullYear()) {
                dateSpan.classList.add('today');
            }
            
            // Add "has-event" class to some dates with events
            if ((CURRENT_DATE.getMonth() === 3 && [5, 8, 12, 15, 20, 22, 28].includes(i)) || 
                [5, 6, 12, 14, 20].includes(i)) {
                dateSpan.classList.add('has-event');
            }
            
            dateSpan.textContent = i;
            dateSpan.addEventListener('click', () => selectDate(i));
            calendarDates.appendChild(dateSpan);
        }
        
        // Add next month days
        const daysFromNextMonth = 42 - (startDayOfWeek + lastDay.getDate());
        for (let i = 1; i <= daysFromNextMonth; i++) {
            const dateSpan = document.createElement('span');
            dateSpan.classList.add('inactive');
            dateSpan.textContent = i;
            
            // Make inactive dates clickable too
            dateSpan.addEventListener('click', () => {
                const newDate = new Date(CURRENT_DATE);
                newDate.setMonth(newDate.getMonth() + 1);
                newDate.setDate(i);
                CURRENT_DATE.setTime(newDate.getTime());
                updateMiniCalendar();
                updateWeekNavigator();
            });
            
            calendarDates.appendChild(dateSpan);
        }
    }
    
    // Function to update week navigator
    function updateWeekNavigator() {
        const weekNavigator = document.getElementById('current-week');
        
        // Set the week range text (e.g., "April 6 - 12, 2025")
        weekNavigator.textContent = DateUtils.formatWeekRange(CURRENT_DATE);
        
        // Update the day headers in the schedule grid
        const { startOfWeek } = DateUtils.getWeekRange(CURRENT_DATE);
        updateDayHeaders(startOfWeek);
        
        // Update "current day" highlight in the grid
        highlightCurrentDay();
    }
    
    // Update day headers in the schedule grid
    function updateDayHeaders(startOfWeek) {
        const dayHeaders = document.querySelectorAll('.day-header');
        
        dayHeaders.forEach((header, index) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + index);
            
            header.innerHTML = `${DateUtils.shortDayNames[index]}<br>${date.getDate()}`;
            
            // Store the full date as a data attribute for later use
            header.dataset.date = DateUtils.formatDateForInput(date);
        });
        
        // Highlight the current day
        highlightCurrentDay();
    }
    
    // Highlight the current day in the grid
    function highlightCurrentDay() {
        const dayHeaders = document.querySelectorAll('.day-header');
        
        // Remove current-day class from all headers
        dayHeaders.forEach(header => header.classList.remove('current-day'));
        
        // Add current-day class to the current date (April 7, 2025 - Monday)
        dayHeaders.forEach(header => {
            const headerDate = new Date(header.dataset.date);
            if (headerDate.getDate() === CURRENT_DATE.getDate() && 
                headerDate.getMonth() === CURRENT_DATE.getMonth() && 
                headerDate.getFullYear() === CURRENT_DATE.getFullYear()) {
                header.classList.add('current-day');
            }
        });
    }
    
    // Set current time indicator based on actual time
    function setCurrentTimeIndicator() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        
        // Calculate position: each hour is 60px, starting from 8 AM
        const topPosition = ((hours - 8) * 60) + (minutes * 60 / 60);
        
        const timeIndicator = document.querySelector('.current-time-indicator');
        
        // Only show indicator during displayed hours (8 AM to 7 PM)
        if (hours >= 8 && hours < 20) {
            timeIndicator.style.display = 'block';
            timeIndicator.style.top = `${topPosition + 40}px`; // 40px offset for day header
        } else {
            timeIndicator.style.display = 'none';
        }
    }
    
    // Select a date from the mini calendar
    function selectDate(day) {
        CURRENT_DATE.setDate(day);
        updateMiniCalendar();
        updateWeekNavigator();
        showToast(`Selected date: ${DateUtils.formatDate(CURRENT_DATE)}`, 'info');
    }
    
    // ========================================
    // 3. Navigation & Interactive Elements
    // ========================================
    
    // Initialize navigation buttons
    function initializeNavigation() {
        // Previous month button
        document.getElementById('prev-month').addEventListener('click', function() {
            CURRENT_DATE.setMonth(CURRENT_DATE.getMonth() - 1);
            updateMiniCalendar();
        });
        
        // Next month button
        document.getElementById('next-month').addEventListener('click', function() {
            CURRENT_DATE.setMonth(CURRENT_DATE.getMonth() + 1);
            updateMiniCalendar();
        });
        
        // Previous week button
        document.getElementById('prev-week').addEventListener('click', function() {
            CURRENT_DATE.setDate(CURRENT_DATE.getDate() - 7);
            updateWeekNavigator();
        });
        
        // Next week button
        document.getElementById('next-week').addEventListener('click', function() {
            CURRENT_DATE.setDate(CURRENT_DATE.getDate() + 7);
            updateWeekNavigator();
        });
        
        // Today button - returns to April 7, 2025
        document.getElementById('today-btn').addEventListener('click', function() {
            CURRENT_DATE.setFullYear(2025, 3, 7); // Reset to April 7, 2025
            updateMiniCalendar();
            updateWeekNavigator();
            showToast('Returned to today: April 7, 2025', 'info');
        });
    }
    
    // Toggle notifications panel
    function initializeNotifications() {
        const notificationsToggle = document.querySelector('.notifications-toggle');
        const notificationsPanel = document.querySelector('.notifications-panel');
        
        notificationsToggle.addEventListener('click', function() {
            notificationsPanel.classList.toggle('active');
        });
        
        // Close notifications when clicking outside
        document.addEventListener('click', function(event) {
            if (!notificationsPanel.contains(event.target) && !notificationsToggle.contains(event.target)) {
                notificationsPanel.classList.remove('active');
            }
        });
        
        // Mark all as read
        const markAllReadBtn = document.querySelector('.notifications-header .btn-text');
        markAllReadBtn.addEventListener('click', function() {
            const unreadItems = document.querySelectorAll('.notification-item.unread');
            unreadItems.forEach(item => {
                item.classList.remove('unread');
            });
            
            // Update the notification badge
            document.querySelector('.notifications-toggle .badge').textContent = '0';
            
            showToast('All notifications marked as read', 'success');
        });
    }
    
    // Toggle dark mode
    function initializeThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            // Change theme
            document.documentElement.setAttribute('data-theme', newTheme);
            
            // Toggle the icon
            const icon = themeToggle.querySelector('i');
            if (icon.classList.contains('fa-moon')) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
            
            showToast(`Switched to ${newTheme} mode`, 'info');
            
            // Save theme preference to localStorage
            localStorage.setItem('theme', newTheme);
        });
        
        // Load saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            
            // Update icon if needed
            if (savedTheme === 'dark') {
                const icon = themeToggle.querySelector('i');
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        }
    }
    
    // Mobile menu toggle
    function initializeMobileMenu() {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const mainNav = document.querySelector('.main-nav ul');
        
        mobileMenuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
        });
        
        // Close menu when a link is clicked
        const navLinks = document.querySelectorAll('.main-nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mainNav.classList.remove('active');
            });
        });
    }
    
    // View filters (day, week, month)
    function initializeViewFilters() {
        const viewButtons = document.querySelectorAll('.btn-filter[data-view]');
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                viewButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get the view type
                const viewType = this.dataset.view;
                
                // Show toast notification
                showToast(`Switched to ${viewType} view`, 'info');
            });
        });
    }
    
    // Category filters
    function initializeCategoryFilters() {
        const categoryCheckboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
        categoryCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const category = this.dataset.category;
                const isChecked = this.checked;
                
                // Find all events of this category and show/hide them
                const events = document.querySelectorAll(`.schedule-event.${category}`);
                events.forEach(event => {
                    event.style.display = isChecked ? 'block' : 'none';
                });
                
                if (!isChecked) {
                    showToast(`${category.charAt(0).toUpperCase() + category.slice(1)} events hidden`, 'info');
                } else {
                    showToast(`${category.charAt(0).toUpperCase() + category.slice(1)} events shown`, 'info');
                }
            });
        });
    }
    
    // ========================================
    // 4. Add Event Modal
    // ========================================
    
    function initializeEventModal() {
        const addEventBtn = document.getElementById('add-event-btn');
        const addEventModal = document.getElementById('add-event-modal');
        const modalClose = document.querySelector('.modal-close');
        const modalCancel = document.querySelector('.modal-cancel');
        
        // Add the CSS for modal if not already in the stylesheet
        if (!document.getElementById('dynamic-css')) {
            const style = document.createElement('style');
            style.id = 'dynamic-css';
            style.textContent = `
                .modal-container { 
                    display: none; 
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0,0,0,0.5);
                    z-index: 1000;
                    align-items: center;
                    justify-content: center;
                }
                .modal-container.active {
                    display: flex;
                    animation: fadeIn 0.3s forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .toast-container {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 1000;
                }
                .toast {
                    display: flex;
                    align-items: center;
                    min-width: 250px;
                    margin-top: 10px;
                    padding: 15px;
                    border-radius: 4px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    background-color: white;
                    transform: translateX(120%);
                    transition: transform 0.3s ease;
                }
                .toast.active {
                    transform: translateX(0);
                }
                .toast.info {
                    border-left: 4px solid #007bff;
                }
                .toast.success {
                    border-left: 4px solid #28a745;
                }
                .toast.warning {
                    border-left: 4px solid #ffc107;
                }
                .toast.error {
                    border-left: 4px solid #dc3545;
                }
                .toast i {
                    margin-right: 10px;
                    font-size: 1.2rem;
                }
                .toast.info i {
                    color: #007bff;
                }
                .toast.success i {
                    color: #28a745;
                }
                .toast.warning i {
                    color: #ffc107;
                }
                .toast.error i {
                    color: #dc3545;
                }
                .toast p {
                    flex: 1;
                    margin: 0;
                }
                .toast-close {
                    background: none;
                    border: none;
                    cursor: pointer;
                    opacity: 0.7;
                }
                .toast-close:hover {
                    opacity: 1;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Open modal
        addEventBtn.addEventListener('click', function() {
            addEventModal.classList.add('active');
            
            // Set the default date to the current selected date
            const dateInput = document.getElementById('event-date');
            dateInput.value = DateUtils.formatDateForInput(CURRENT_DATE);
            
            // Focus the first field
            document.getElementById('event-title').focus();
        });
        
        // Close modal functions
        function closeModal() {
            addEventModal.classList.remove('active');
        }
        
        modalClose.addEventListener('click', closeModal);
        modalCancel.addEventListener('click', closeModal);
        
        // Close when clicking outside the modal content
        addEventModal.addEventListener('click', function(event) {
            if (event.target === addEventModal) {
                closeModal();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && addEventModal.classList.contains('active')) {
                closeModal();
            }
        });
        
        // Event form submission
        const eventForm = document.getElementById('event-form');
        eventForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form values
            const title = document.getElementById('event-title').value;
            const date = document.getElementById('event-date').value;
            const category = document.getElementById('event-category').value;
            const startTime = document.getElementById('event-start').value;
            const endTime = document.getElementById('event-end').value;
            const location = document.getElementById('event-location').value;
            const description = document.getElementById('event-description').value;
            const repeat = document.getElementById('event-repeat').checked;
            const reminder = document.getElementById('event-reminder').checked;
            
            // Create event object
            const newEvent = {
                id: generateUniqueId(),
                title,
                date,
                category,
                startTime,
                endTime,
                location,
                description,
                repeat,
                reminder
            };
            
            // In a real app, this would add the event to the schedule
            console.log('Event added:', newEvent);
            
            // Show success toast with event details
            showToast(`Added event: ${title} on ${DateUtils.formatTimeFromString(startTime)}`, 'success');
            
            // Close the modal
            closeModal();
            
            // Clear the form
            eventForm.reset();
        });
        
        // Generate unique ID for events
        function generateUniqueId() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
        }
    }
    
    // ========================================
    // 5. Toast Notifications
    // ========================================
    
    function showToast(message, type = 'info') {
        const toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.classList.add('toast', type);
        
        // Create an icon based on the toast type
        let icon;
        switch (type) {
            case 'success':
                icon = 'check-circle';
                break;
            case 'warning':
                icon = 'exclamation-triangle';
                break;
            case 'error':
                icon = 'times-circle';
                break;
            default:
                icon = 'info-circle';
        }
        
        toast.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <p>${message}</p>
            <button class="toast-close"><i class="fas fa-times"></i></button>
        `;
        
        // Add toast to container
        toastContainer.appendChild(toast);
        
        // Show the toast with animation
        setTimeout(() => {
            toast.classList.add('active');
        }, 10);
        
        // Set up close button
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            toast.classList.remove('active');
            setTimeout(() => {
                toast.remove();
            }, 300);
        });
        
        // Auto dismiss after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.classList.remove('active');
                setTimeout(() => {
                    if (toast.parentElement) {
                        toast.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
    
    // ========================================
    // 6. Event Interaction
    // ========================================
    
    function initializeEventInteractions() {
        // Enable drag and drop for events
        const scheduleEvents = document.querySelectorAll('.schedule-event');
        
        scheduleEvents.forEach(event => {
            event.setAttribute('draggable', 'true');
            
            event.addEventListener('dragstart', function(e) {
                e.dataTransfer.setData('text/plain', event.outerHTML);
                event.classList.add('dragging');
            });
            
            event.addEventListener('dragend', function() {
                event.classList.remove('dragging');
            });
            
            // Make events clickable for details
            event.addEventListener('click', function() {
                const title = this.querySelector('h4').textContent;
                const location = this.querySelector('p').textContent;
                
                showToast(`Event: ${title} at ${location}`, 'info');
            });
        });
        
        // Make day schedules droppable
        const daySchedules = document.querySelectorAll('.day-schedule');
        
        daySchedules.forEach(schedule => {
            schedule.addEventListener('dragover', function(e) {
                e.preventDefault();
                schedule.classList.add('drag-over');
            });
            
            schedule.addEventListener('dragleave', function() {
                schedule.classList.remove('drag-over');
            });
            
            schedule.addEventListener('drop', function(e) {
                e.preventDefault();
                schedule.classList.remove('drag-over');
                
                // Get the event HTML
                const eventHTML = e.dataTransfer.getData('text/plain');
                
                // Get the drop position to calculate new time
                const rect = schedule.getBoundingClientRect();
                const y = e.clientY - rect.top - 40; // Subtract header height
                
                // Calculate time based on position (each hour is 60px)
                const hour = Math.floor(y / 60) + 8; // 8 AM is the start time
                const minute = Math.round((y % 60) / 60 * 60);
                
                // Format the time
                const time = `${hour}:${minute.toString().padStart(2, '0')}`;
                
                // Get the day index
                const dayIndex = schedule.dataset.day;
                
                // Show a toast with the moved event info
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = eventHTML;
                const eventTitle = tempDiv.querySelector('h4').textContent;
                
                showToast(`Moved "${eventTitle}" to ${DateUtils.shortDayNames[dayIndex]} at ${DateUtils.formatTimeFromString(time)}`, 'success');
            });
        });
        
        // When clicking on upcoming events, go to that date
        const upcomingEvents = document.querySelectorAll('.event-item');
        upcomingEvents.forEach(event => {
            event.addEventListener('click', function() {
                const eventTime = this.querySelector('.event-time').textContent;
                const dateMatch = eventTime.match(/([A-Za-z]+),\s+([A-Za-z]+)\s+(\d+)/);
                
                if (dateMatch) {
                    const month = DateUtils.monthNames.findIndex(m => m.substring(0, 3) === dateMatch[2]);
                    if (month !== -1) {
                        CURRENT_DATE.setMonth(month);
                        CURRENT_DATE.setDate(parseInt(dateMatch[3]));
                        updateMiniCalendar();
                        updateWeekNavigator();
                        showToast(`Showing schedule for ${DateUtils.formatDate(CURRENT_DATE)}`, 'info');
                    }
                }
            });
        });
    }
    
    // ========================================
    // 7. Initialize Application
    // ========================================
    
    function initializeApp() {
        // Update calendar and date displays
        updateMiniCalendar();
        updateWeekNavigator();
        setCurrentTimeIndicator();
        
        // Initialize interactive elements
        initializeNavigation();
        initializeNotifications();
        initializeThemeToggle();
        initializeMobileMenu();
        initializeViewFilters();
        initializeCategoryFilters();
        initializeEventModal();
        initializeEventInteractions();
        
        // Search functionality
        const searchInput = document.querySelector('.search-input');
        searchInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                const searchTerm = this.value.trim().toLowerCase();
                if (searchTerm) {
                    showToast(`Searching for: ${searchTerm}`, 'info');
                }
            }
        });
        
        // Import and Export buttons
        document.getElementById('import-schedule').addEventListener('click', function() {
            showToast('Import schedule functionality activated', 'info');
        });
        
        document.getElementById('export-schedule').addEventListener('click', function() {
            showToast('Schedule exported successfully!', 'success');
        });
        
        // Update time indicator periodically
        setInterval(setCurrentTimeIndicator, 60000); // Update every minute
        
        // Welcome message
        setTimeout(() => {
            showToast('Welcome to your study schedule! Today is April 7, 2025', 'info');
        }, 1000);
    }
    
    // Initialize the application
    initializeApp();
});
