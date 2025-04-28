document.addEventListener('DOMContentLoaded', function() {
          // Cache DOM elements
          const elements = {
            notificationToggle: document.querySelector('.notifications-toggle'),
            notificationsPanel: document.getElementById('notifications-panel'),
            notificationDismiss: document.querySelectorAll('.notification-dismiss'),
            markAllRead: document.querySelector('.notifications-header .btn-text'),
            mobileMenuToggle: document.querySelector('.mobile-menu-toggle'),
            mainNav: document.querySelector('.main-nav'),
            themeToggle: document.querySelector('.theme-toggle')
          };
          
          // Toggle notifications panel
          elements.notificationToggle?.addEventListener('click', function(e) {
            e.stopPropagation();
            elements.notificationsPanel.classList.toggle('visible');
            this.classList.toggle('active');
          });
          
          // Close notifications when clicking outside
          document.addEventListener('click', function(event) {
            if (elements.notificationsPanel?.classList.contains('visible') && 
                !elements.notificationsPanel.contains(event.target) && 
                !elements.notificationToggle.contains(event.target)) {
              elements.notificationsPanel.classList.remove('visible');
              elements.notificationToggle.classList.remove('active');
            }
          });
          
          // Dismiss individual notifications
          elements.notificationDismiss?.forEach(button => {
            button.addEventListener('click', function() {
              const notificationItem = this.closest('.notification-item');
              notificationItem.classList.add('removing');
              
              setTimeout(() => {
                notificationItem.remove();
                updateNotificationCount();
              }, 300);
            });
          });
          
          // Mark all notifications as read
          elements.markAllRead?.addEventListener('click', function() {
            const unreadItems = document.querySelectorAll('.notification-item.unread');
            unreadItems.forEach(item => {
              item.classList.remove('unread');
            });
            
            updateNotificationCount();
            showToast('All notifications marked as read', 'success');
          });
          
          // Toggle mobile menu
          elements.mobileMenuToggle?.addEventListener('click', function() {
            elements.mainNav.classList.toggle('open');
          });
          
          // Toggle theme
          elements.themeToggle?.addEventListener('click', function() {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
            
            // Toggle icon
            const icon = this.querySelector('i');
            if (icon) {
              if (isDark) {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
              } else {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
              }
            }
            
            localStorage.setItem('theme_preference', isDark ? 'light' : 'dark');
          });
          
          // Update notification count
          function updateNotificationCount() {
            const unreadItems = document.querySelectorAll('.notification-item.unread');
            const count = unreadItems.length;
            
            const badge = document.querySelector('.notifications-toggle .badge');
            if (badge) {
              badge.textContent = count;
              badge.style.display = count > 0 ? '' : 'none';
            }
          }
          
          // Initialize theme from saved preference
          function initializeTheme() {
            const savedTheme = localStorage.getItem('theme_preference');
            if (savedTheme === 'dark') {
              document.documentElement.setAttribute('data-theme', 'dark');
              
              const icon = elements.themeToggle?.querySelector('i');
              if (icon) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
              }
            }
          }
          
          // Toast notification
          function showToast(message, type = 'info', duration = 3000) {
            // Create toast container if it doesn't exist
            let toastContainer = document.querySelector('.toast-container');
            if (!toastContainer) {
              toastContainer = document.createElement('div');
              toastContainer.className = 'toast-container';
              document.body.appendChild(toastContainer);
            }
            
            // Create toast element
            const toast = document.createElement('div');
            toast.className = `toast ${type}-toast`;
            
            // Add icon based on type
            let icon = 'info-circle';
            if (type === 'success') icon = 'check-circle';
            if (type === 'warning') icon = 'exclamation-triangle';
            if (type === 'error') icon = 'exclamation-circle';
            
            toast.innerHTML = `
              <i class="fas fa-${icon}"></i>
              <div class="toast-content">${message}</div>
              <button class="toast-close">
                <i class="fas fa-times"></i>
              </button>
            `;
            
            // Add to container
            toastContainer.appendChild(toast);
            
            // Animate in
            setTimeout(() => {
              toast.classList.add('show');
            }, 10);
            
            // Setup close button
            toast.querySelector('.toast-close').addEventListener('click', () => {
              toast.classList.remove('show');
              setTimeout(() => {
                toast.remove();
              }, 300);
            });
            
            // Auto close after duration
            setTimeout(() => {
              if (toast.parentNode) {
                toast.classList.remove('show');
                setTimeout(() => {
                  if (toast.parentNode) {
                    toast.remove();
                  }
                }, 300);
              }
            }, duration);
          }
          
          // Initialize
          initializeTheme();
          updateNotificationCount();
        });
        