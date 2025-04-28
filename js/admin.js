/**
 * Delta Students Admin Dashboard
 * Main JavaScript file for the admin dashboard functionality
 */

document.addEventListener('DOMContentLoaded', function() {
          // Initialize all dashboard components
          initializeSidebar();
          initializeDataTables();
          initializePagination();
          initializeActionButtons();
          initializeProgressBars();
          initializeAnalyticsChart();
          initializeNotifications();
          initializeThemeToggle();
          welcomeMessage();
      });
      
      
      function welcomeMessage() {
          setTimeout(() => {
              showToast('Welcome to Delta Students Admin Dashboard', 'info');
          }, 1000);
      }
      
    
      function initializeSidebar() {
          const sidebarItems = document.querySelectorAll('.sidebar ul li a');
          
          sidebarItems.forEach(item => {
              item.addEventListener('click', function(e) {
                  e.preventDefault();
                  
                  // Remove active class from all items
                  document.querySelectorAll('.sidebar ul li').forEach(li => {
                      li.classList.remove('active');
                  });
                  
                  // Add active class to clicked item
                  this.parentElement.classList.add('active');
                  
                  // Get section name and show corresponding content
                  const sectionName = this.textContent.trim();
                  const sectionId = this.getAttribute('href').substring(1);
                  showSectionContent(sectionName, sectionId);
              });
          });
      
          // Create mobile sidebar toggle if it doesn't exist
          if (!document.querySelector('.sidebar-toggle')) {
              const toggleButton = document.createElement('button');
              toggleButton.classList.add('sidebar-toggle');
              toggleButton.setAttribute('aria-label', 'Toggle Sidebar Navigation');
              toggleButton.setAttribute('aria-expanded', 'false');
              toggleButton.innerHTML = '<i class="fas fa-bars"></i>';
              
              const dashboardContent = document.querySelector('.dashboard-content');
              dashboardContent.insertBefore(toggleButton, dashboardContent.firstChild);
              
              toggleButton.addEventListener('click', function() {
                  const sidebar = document.querySelector('.sidebar');
                  sidebar.classList.toggle('mobile-active');
                  
                  const isExpanded = sidebar.classList.contains('mobile-active');
                  this.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
                  
                  // Add overlay for mobile if needed
                  if (isExpanded) {
                      if (!document.querySelector('.sidebar-overlay')) {
                          const overlay = document.createElement('div');
                          overlay.classList.add('sidebar-overlay');
                          document.body.appendChild(overlay);
                          
                          overlay.addEventListener('click', function() {
                              sidebar.classList.remove('mobile-active');
                              toggleButton.setAttribute('aria-expanded', 'false');
                              this.remove();
                          });
                      }
                  } else {
                      const overlay = document.querySelector('.sidebar-overlay');
                      if (overlay) overlay.remove();
                  }
              });
          }
      }
      
      /**
       * Show the content section based on sidebar navigation
       */
      function showSectionContent(sectionName, sectionId) {
          console.log(`Showing content for: ${sectionName} (${sectionId})`);
          
          // Find the corresponding section and highlight it
          let targetSection;
          
          switch (sectionId) {
              case 'dashboard':
                  // Highlight all overview cards
                  document.querySelectorAll('.overview-card').forEach(card => {
                      highlightElement(card);
                  });
                  break;
              case 'users':
                  targetSection = document.getElementById('user-management');
                  break;
              case 'schedules':
                  targetSection = document.getElementById('schedule-management');
                  break;
              case 'subjects':
                  targetSection = document.getElementById('subjects-exams');
                  break;
              case 'analytics':
                  targetSection = document.getElementById('analytics-reports');
                  break;
              case 'notifications':
                  targetSection = document.getElementById('notification-management');
                  break;
              case 'settings':
                  targetSection = document.getElementById('system-settings');
                  break;
              default:
                  // Find a section with a matching heading
                  document.querySelectorAll('.section-card').forEach(card => {
                      const heading = card.querySelector('h3');
                      if (heading && heading.textContent.includes(sectionName)) {
                          targetSection = card;
                      }
                  });
          }
          
          if (targetSection) {
              highlightElement(targetSection);
              
              // Scroll to the section if not visible
              targetSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
          
          // Show a notification
          showToast(`Navigated to ${sectionName}`, 'info');
      }
      
      /**
       * Highlight an element with a subtle animation
       */
      function highlightElement(element) {
          // Remove existing animations
          element.style.animation = 'none';
          
          // Force reflow
          void element.offsetWidth;
          
          // Add pulse animation
          element.style.animation = 'pulse 1s';
          
          // Remove animation after it completes
          setTimeout(() => {
              element.style.animation = '';
          }, 1000);
      }
      
      /**
       * Initialize data tables with search and sort functionality
       */
      function initializeDataTables() {
          const tables = document.querySelectorAll('.data-table table');
          
          tables.forEach(table => {
              const tableContainer = table.closest('.section-card');
              const tableHeader = tableContainer.querySelector('.section-header');
              
              // Add search feature if it doesn't exist yet
              if (!tableHeader.querySelector('.search-container')) {
                  const searchContainer = document.createElement('div');
                  searchContainer.classList.add('search-container');
                  searchContainer.innerHTML = `
                      <input type="text" class="search-input" placeholder="Search..." aria-label="Search table">
                      <i class="fas fa-search search-icon"></i>
                  `;
                  
                  // Insert search before the actions buttons
                  const actions = tableHeader.querySelector('.actions');
                  if (actions) {
                      tableHeader.insertBefore(searchContainer, actions);
                  } else {
                      tableHeader.appendChild(searchContainer);
                  }
                  
                  // Add search functionality
                  const searchInput = searchContainer.querySelector('.search-input');
                  searchInput.addEventListener('keyup', function() {
                      const searchTerm = this.value.toLowerCase();
                      const rows = table.querySelectorAll('tbody tr');
                      
                      rows.forEach(row => {
                          const text = row.textContent.toLowerCase();
                          if (text.includes(searchTerm)) {
                              row.style.display = '';
                          } else {
                              row.style.display = 'none';
                          }
                      });
                      
                      // Update table info
                      updateTableInfo(tableContainer, rows);
                  });
              }
              
              // Add sorting functionality to table headers
              const headers = table.querySelectorAll('thead th');
              headers.forEach((header, index) => {
                  if (!header.hasAttribute('data-sortable') || header.getAttribute('data-sortable') !== 'false') {
                      header.classList.add('sortable');
                      header.setAttribute('tabindex', '0');
                      header.setAttribute('role', 'button');
                      header.setAttribute('aria-label', `Sort by ${header.textContent}`);
                      
                      // Add sort indicator
                      if (!header.querySelector('.sort-indicator')) {
                          const indicator = document.createElement('span');
                          indicator.classList.add('sort-indicator');
                          indicator.innerHTML = ' <i class="fas fa-sort"></i>';
                          header.appendChild(indicator);
                      }
                      
                      // Add click event for sorting
                      header.addEventListener('click', function() {
                          sortTable(table, index);
                      });
                      
                      // Add keyboard support for accessibility
                      header.addEventListener('keydown', function(e) {
                          if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              sortTable(table, index);
                          }
                      });
                  }
              });
          });
      }
      
      /**
       * Update table information after search
       */
      function updateTableInfo(container, rows) {
          const visibleRows = Array.from(rows).filter(row => row.style.display !== 'none').length;
          const totalRows = rows.length;
          
          // Update pagination info if it exists
          const pagination = container.querySelector('.pagination span');
          if (pagination) {
              const originalText = pagination.getAttribute('data-original-text') || pagination.textContent;
              
              // Store original text if not already stored
              if (!pagination.getAttribute('data-original-text')) {
                  pagination.setAttribute('data-original-text', originalText);
              }
              
              if (visibleRows < totalRows) {
                  pagination.textContent = `Showing ${visibleRows} of ${totalRows} entries`;
              } else {
                  pagination.textContent = originalText;
              }
          }
      }
      
      /**
       * Sort table function
       */
      function sortTable(table, columnIndex) {
          const thead = table.querySelector('thead');
          const tbody = table.querySelector('tbody');
          const thList = thead.querySelectorAll('th');
          const rows = Array.from(tbody.querySelectorAll('tr'));
          
          // Determine sort direction
          const th = thList[columnIndex];
          const currentDirection = th.getAttribute('aria-sort');
          const newDirection = currentDirection === 'ascending' ? 'descending' : 'ascending';
          
          // Update aria-sort attribute on all headers
          thList.forEach(header => {
              header.removeAttribute('aria-sort');
              if (header.querySelector('.sort-indicator')) {
                  header.querySelector('.sort-indicator').innerHTML = ' <i class="fas fa-sort"></i>';
              }
          });
          
          // Set new sort direction on current header
          th.setAttribute('aria-sort', newDirection);
          if (th.querySelector('.sort-indicator')) {
              th.querySelector('.sort-indicator').innerHTML = newDirection === 'ascending' 
                  ? ' <i class="fas fa-sort-up"></i>' 
                  : ' <i class="fas fa-sort-down"></i>';
          }
          
          // Sort the rows
          rows.sort((rowA, rowB) => {
              const cellA = rowA.querySelectorAll('td')[columnIndex];
              const cellB = rowB.querySelectorAll('td')[columnIndex];
              
              // Skip if cells don't exist
              if (!cellA || !cellB) return 0;
              
              // Get values for comparison
              let valA = cellA.textContent.trim();
              let valB = cellB.textContent.trim();
              
              // Handle status cells differently
              const statusA = cellA.querySelector('.status');
              const statusB = cellB.querySelector('.status');
              
              if (statusA && statusB) {
                  valA = statusA.textContent.trim();
                  valB = statusB.textContent.trim();
              }
              
              // Check if values are dates
              const dateA = isDate(valA) ? new Date(valA) : null;
              const dateB = isDate(valB) ? new Date(valB) : null;
              
              // Check if values are numbers
              const numA = !isNaN(parseFloat(valA)) ? parseFloat(valA) : null;
              const numB = !isNaN(parseFloat(valB)) ? parseFloat(valB) : null;
              
              // Compare based on data type
              if (dateA && dateB) {
                  return newDirection === 'ascending' ? dateA - dateB : dateB - dateA;
              } else if (numA !== null && numB !== null) {
                  return newDirection === 'ascending' ? numA - numB : numB - numA;
              } else {
                  // String comparison
                  return newDirection === 'ascending' 
                      ? valA.localeCompare(valB) 
                      : valB.localeCompare(valA);
              }
          });
          
          // Re-append rows in the sorted order with animation
          rows.forEach((row, index) => {
              // Add delay to create cascade effect
              setTimeout(() => {
                  row.classList.add('sorting');
                  tbody.appendChild(row);
                  
                  // Remove class after animation
                  setTimeout(() => {
                      row.classList.remove('sorting');
                  }, 300);
              }, index * 30); 
          });
          
          // Show a notification
          showToast(`Table sorted by ${th.textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim()}`, 'info');
      }
      
      /**
       * Check if a string represents a date
       */
      function isDate(dateString) {
          // Various date formats that might be used
          const datePattern = /^\d{4}-\d{2}-\d{2}$/; // yyyy-mm-dd
          const datePattern2 = /^\d{1,2}\/\d{1,2}\/\d{4}$/; // mm/dd/yyyy or m/d/yyyy
          
          if (!datePattern.test(dateString) && !datePattern2.test(dateString)) {
              return false;
          }
          
          const date = new Date(dateString);
          return !isNaN(date.getTime());
      }
      
      /**
       * Initialize pagination controls
       */
      function initializePagination() {
          const paginationContainers = document.querySelectorAll('.pagination');
          
          paginationContainers.forEach(container => {
              const prevButton = container.querySelector('button:first-child');
              const nextButton = container.querySelector('button:last-child');
              const pageInfo = container.querySelector('span');
              
              if (!prevButton || !nextButton || !pageInfo) return;
              
              // Extract current page and total pages
              const pageText = pageInfo.textContent;
              const matches = pageText.match(/Page (\d+) of (\d+)/);
              
              if (!matches) return;
              
              let currentPage = parseInt(matches[1]);
              const totalPages = parseInt(matches[2]);
              
              // Update buttons state based on current page
              function updatePaginationState() {
                  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
                  
                  // Update button states
                  prevButton.disabled = currentPage <= 1;
                  prevButton.classList.toggle('disabled', currentPage <= 1);
                  nextButton.disabled = currentPage >= totalPages;
                  nextButton.classList.toggle('disabled', currentPage >= totalPages);
                  
                  // Update aria attributes
                  prevButton.setAttribute('aria-disabled', currentPage <= 1);
                  nextButton.setAttribute('aria-disabled', currentPage >= totalPages);
              }
              
              // Initialize button states
              updatePaginationState();
              
              // Add click handlers if not already present
              if (!prevButton.hasAttribute('data-pagination-initialized')) {
                  prevButton.setAttribute('data-pagination-initialized', 'true');
                  
                  prevButton.addEventListener('click', function(e) {
                      e.preventDefault();
                      if (currentPage > 1) {
                          currentPage--;
                          updatePaginationState();
                          
                          // In a real app, you'd fetch new data here
                          simulatePaginationDataLoad(this);
                      }
                  });
              }
              
              if (!nextButton.hasAttribute('data-pagination-initialized')) {
                  nextButton.setAttribute('data-pagination-initialized', 'true');
                  
                  nextButton.addEventListener('click', function(e) {
                      e.preventDefault();
                      if (currentPage < totalPages) {
                          currentPage++;
                          updatePaginationState();
                          
                          // In a real app, you'd fetch new data here
                          simulatePaginationDataLoad(this);
                      }
                  });
              }
          });
      }
      
      /**
       * Simulate data loading for pagination
       */
      function simulatePaginationDataLoad(buttonElement) {
          // Find the associated table
          const sectionCard = buttonElement.closest('.section-card');
          const table = sectionCard ? sectionCard.querySelector('table') : null;
          
          if (!table) return;
          
          // Add loading state
          table.classList.add('loading');
          const tbody = table.querySelector('tbody');
          const loadingRow = document.createElement('tr');
          loadingRow.classList.add('loading-row');
          loadingRow.innerHTML = `<td colspan="${table.querySelectorAll('thead th').length}" class="loading-cell">
              <div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Loading data...</div>
          </td>`;
          
          // Save original rows
          const originalRows = Array.from(tbody.querySelectorAll('tr:not(.loading-row)'));
          
          // Clear table and show loading
          tbody.innerHTML = '';
          tbody.appendChild(loadingRow);
          
          // Simulate delay and then restore with "new" data
          setTimeout(() => {
              tbody.innerHTML = '';
              
              // Create slightly different data
              originalRows.forEach(row => {
                  const newRow = row.cloneNode(true);
                  
                  // Modify some data to simulate different page content
                  const cells = newRow.querySelectorAll('td');
                  if (cells.length > 2) {
                      // Change dates if present
                      const dateCell = Array.from(cells).find(cell => isDate(cell.textContent.trim()));
                      if (dateCell) {
                          const date = new Date(dateCell.textContent.trim());
                          date.setDate(date.getDate() + Math.floor(Math.random() * 30));
                          dateCell.textContent = date.toISOString().split('T')[0];
                      }
                      
                      // Randomly change status
                      if (Math.random() > 0.5) {
                          const statusCell = Array.from(cells).find(cell => 
                              cell.querySelector('.status')
                          );
                          
                          if (statusCell) {
                              const status = statusCell.querySelector('.status');
                              if (status.classList.contains('active')) {
                                  status.classList.remove('active');
                                  status.classList.add('inactive');
                                  status.textContent = 'Inactive';
                              } else {
                                  status.classList.remove('inactive');
                                  status.classList.add('active');
                                  status.textContent = 'Active';
                              }
                          }
                      }
                      
                      // Ensure action buttons have event listeners
                      const actionCell = newRow.querySelector('.action-buttons');
                      if (actionCell) {
                          const actionLinks = actionCell.querySelectorAll('a');
                          actionLinks.forEach(link => {
                              link.removeAttribute('data-initialized');
                          });
                      }
                  }
                  
                  tbody.appendChild(newRow);
              });
              
              table.classList.remove('loading');
              
              // Re-initialize action buttons on the new rows
              initializeActionButtons();
              
              showToast('Data updated successfully', 'success');
          }, 800);
      }
      
      /**
       * Initialize all action buttons
       */
      function initializeActionButtons() {
          // Primary action buttons
          const actionButtons = document.querySelectorAll('.btn-primary, .btn-secondary');
          
          actionButtons.forEach(button => {
              if (!button.hasAttribute('data-initialized')) {
                  button.setAttribute('data-initialized', 'true');
                  
                  button.addEventListener('click', function(e) {
                      e.preventDefault();
                      
                      // Skip if disabled
                      if (this.disabled || this.classList.contains('disabled')) return;
                      
                      const buttonText = this.textContent.trim();
                      const sectionCard = this.closest('.section-card');
                      const sectionType = sectionCard ? sectionCard.querySelector('h3').textContent.trim() : '';
                      
                      // Special case for report generation
                      if (this.classList.contains('generate-report-btn')) {
                          generateReport();
                          return;
                      }
                      
                      // Special case for settings
                      if (this.classList.contains('settings-btn')) {
                          showModal('settings', 'System Settings');
                          return;
                      }
                      
                      // Special case for logout
                      if (this.classList.contains('logout-btn')) {
                          confirmLogout();
                          return;
                      }
                      
                      // Handle based on button text
                      if (buttonText.includes('Add') || buttonText.includes('Create')) {
                          showModal('create', sectionType);
                      } else if (buttonText.includes('Generate')) {
                          generateReport();
                      } else if (buttonText.includes('Send')) {
                          showModal('notification', 'Send Notification');
                      } else if (buttonText.includes('Settings')) {
                          showModal('settings', 'System Settings');
                      } else if (buttonText.includes('Logout')) {
                          confirmLogout();
                      } else {
                          showToast(`Button clicked: ${buttonText}`, 'info');
                      }
                  });
              }
          });
          
          // Table action icons
          const tableActions = document.querySelectorAll('.action-buttons a, .list-actions a, .notification-actions a');
          
          tableActions.forEach(action => {
              if (!action.hasAttribute('data-initialized')) {
                  action.setAttribute('data-initialized', 'true');
                  
                  action.addEventListener('click', function(e) {
                      e.preventDefault();
                      
                      const actionType = this.getAttribute('title') || this.getAttribute('aria-label');
                      let itemId, itemName;
                      
                      // Try to get item info from closest row or list item
                      const row = this.closest('tr');
                      if (row) {
                          const cells = row.querySelectorAll('td');
                          itemId = cells[0].textContent.trim();
                          itemName = cells.length > 1 ? cells[1].textContent.trim() : itemId;
                      } else {
                          const listItem = this.closest('li');
                          if (listItem) {
                              const linkElement = listItem.querySelector('a');
                              itemName = linkElement ? linkElement.textContent.trim() : listItem.textContent.trim();
                              itemId = itemName;
                          }
                      }
                      
                      if (actionType.includes('View')) {
                          showModal('view', itemId, { name: itemName });
                      } else if (actionType.includes('Edit')) {
                          showModal('edit', itemId, { name: itemName });
                      } else if (actionType.includes('Delete')) {
                          confirmDelete(itemId, itemName);
                      }
                  });
              }
          });
          
          // List item links
          const listItems = document.querySelectorAll('.data-list ul li a');
          
          listItems.forEach(item => {
              if (!item.hasAttribute('data-initialized')) {
                  item.setAttribute('data-initialized', 'true');
                  
                  item.addEventListener('click', function(e) {
                      e.preventDefault();
                      const itemName = this.textContent.trim();
                      showModal('view', itemName, { name: itemName });
                  });
              }
          });
      }
      
      /**
       * Initialize and animate progress bars
       */
      function initializeProgressBars() {
          const progressBars = document.querySelectorAll('.progress-bar-fill');
          
          // Reset progress bars
          progressBars.forEach(bar => {
              const width = bar.style.width;
              bar.style.width = '0';
              
              // Create animation
              setTimeout(() => {
                  bar.style.transition = 'width 1.5s ease-out';
                  bar.style.width = width;
              }, 300);
          });
      }
      
      /**
       * Initialize analytics chart
       */
      function initializeAnalyticsChart() {
          const canvas = document.getElementById('analyticsChart');
          if (!canvas) return;
          
          // Get the container dimensions
          const container = canvas.parentNode;
          canvas.width = container.clientWidth;
          canvas.height = 300;
          
          // Draw a chart
          drawAnalyticsChart(canvas);
          
          // Handle window resize
          window.addEventListener('resize', function() {
              // Update canvas dimensions
              canvas.width = container.clientWidth;
              canvas.height = 300;
              
              // Redraw chart
              drawAnalyticsChart(canvas);
          });
      }
      
      /**
       * Draw the analytics chart
       */
      function drawAnalyticsChart(canvas) {
          const ctx = canvas.getContext('2d');
          const width = canvas.width;
          const height = canvas.height;
          
          // Clear canvas
          ctx.clearRect(0, 0, width, height);
          
          // Background
          ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--white').trim();
          ctx.fillRect(0, 0, width, height);
          
          // Data for the chart
          const data = [65, 59, 80, 81, 56, 55, 40, 75, 85, 90, 65, 70];
          const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const maxValue = Math.max(...data);
          
          const padding = 40;
          const chartWidth = width - padding * 2;
          const chartHeight = height - padding * 2;
          const barWidth = (chartWidth / data.length) * 0.7;
          const barSpacing = (chartWidth / data.length) * 0.3;
          
          // Draw grid lines
          ctx.beginPath();
          ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--light-gray').trim();
          ctx.lineWidth = 1;
          
          // Horizontal grid lines
          for (let i = 0; i <= 5; i++) {
              const y = padding + chartHeight - (i / 5) * chartHeight;
              ctx.moveTo(padding, y);
              ctx.lineTo(width - padding, y);
          }
          
          // Vertical grid lines
          for (let i = 0; i < data.length; i++) {
              const x = padding + i * (barWidth + barSpacing) + barWidth / 2;
              ctx.moveTo(x, padding);
              ctx.lineTo(x, height - padding);
          }
          
          ctx.stroke();
          
          // Draw data bars
          data.forEach((value, index) => {
              const x = padding + index * (barWidth + barSpacing);
              const barHeight = (value / maxValue) * chartHeight;
              const y = height - padding - barHeight;
              
              // Bar
              const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
              ctx.fillStyle = primaryColor;
              ctx.fillRect(x, y, barWidth, barHeight);
              
              // Bar highlight
              const gradient = ctx.createLinearGradient(x, y, x + barWidth, y);
              gradient.addColorStop(0, 'rgba(255,255,255,0.3)');
              gradient.addColorStop(1, 'rgba(255,255,255,0)');
              ctx.fillStyle = gradient;
              ctx.fillRect(x, y, barWidth, barHeight);
              
              // Value text
              ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--dark').trim();
              ctx.font = '12px Poppins, sans-serif';
              ctx.textAlign = 'center';
              ctx.fillText(value.toString(), x + barWidth / 2, y - 10);
              
              // Label text
              ctx.fillText(labels[index], x + barWidth / 2, height - padding / 2);
          });
          
          // Draw axes
          ctx.beginPath();
          ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--medium').trim();
          ctx.lineWidth = 2;
          
          // X-axis
          ctx.moveTo(padding, height - padding);
          ctx.lineTo(width - padding, height - padding);
          
          // Y-axis
          ctx.moveTo(padding, height - padding);
          ctx.lineTo(padding, padding);
          
          ctx.stroke();
          
          // Draw title
          ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
          ctx.font = 'bold 16px Poppins, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Monthly Student Activity', width / 2, padding / 2);
      }
      
      /**
       * Initialize notification system
       */
      function initializeNotifications() {
          // Create toast container if it doesn't exist
          if (!document.querySelector('.toast-container')) {
              const toastContainer = document.createElement('div');
              toastContainer.classList.add('toast-container');
              document.body.appendChild(toastContainer);
          }
          
          // Handle existing notification interactions
          const notificationItems = document.querySelectorAll('.notification-item');
          notificationItems.forEach(item => {
              if (!item.hasAttribute('data-initialized')) {
                  item.setAttribute('data-initialized', 'true');
                  
                  // Add hover animation
                  item.addEventListener('mouseenter', function() {
                      this.classList.add('highlight');
                  });
                  
                  item.addEventListener('mouseleave', function() {
                      this.classList.remove('highlight');
                  });
              }
          });
      }
      
      /**
       * Show toast notification
       */
      function showToast(message, type = 'info') {
          // Make sure container exists
          if (!document.querySelector('.toast-container')) {
              initializeNotifications();
          }
          
          const toastContainer = document.querySelector('.toast-container');
          const toast = document.createElement('div');
          toast.classList.add('toast', `toast-${type}`);
          toast.setAttribute('role', 'alert');
          
          // Get appropriate icon
          let icon;
          switch(type) {
              case 'success': icon = '<i class="fas fa-check-circle"></i>'; break;
              case 'error': icon = '<i class="fas fa-exclamation-circle"></i>'; break;
              case 'warning': icon = '<i class="fas fa-exclamation-triangle"></i>'; break;
              default: icon = '<i class="fas fa-info-circle"></i>';
          }
          
          toast.innerHTML = `
              ${icon}
              <span>${message}</span>
              <button class="toast-close" aria-label="Close notification"><i class="fas fa-times"></i></button>
          `;
          
          toastContainer.appendChild(toast);
          
          // Animate in with delay to allow DOM update
          setTimeout(() => {
              toast.classList.add('show');
          }, 10);
          
          // Auto hide after 5 seconds
          const timeoutId = setTimeout(() => {
              closeToast(toast);
          }, 5000);
          
          // Close button functionality
          toast.querySelector('.toast-close').addEventListener('click', function() {
              clearTimeout(timeoutId);
              closeToast(toast);
          });
          
          return toast;
      }
      
      /**
       * Close a toast notification
       */
      function closeToast(toast) {
          toast.classList.remove('show');
          
          // Remove after animation completes
          setTimeout(() => {
              if (toast.parentNode) {
                  toast.parentNode.removeChild(toast);
              }
          }, 300);
      }
      
      /**
       * Initialize theme toggle functionality
       */
      function initializeThemeToggle() {
          // Get theme toggle button
          const themeToggle = document.querySelector('.theme-toggle');
          
          if (themeToggle) {
              themeToggle.addEventListener('click', function() {
                  document.body.classList.toggle('dark-theme');
                  
                  // Update button icon
                  const icon = themeToggle.querySelector('i');
                  if (document.body.classList.contains('dark-theme')) {
                      icon.classList.replace('fa-moon', 'fa-sun');
                      themeToggle.setAttribute('aria-label', 'Toggle light mode');
                  } else {
                      icon.classList.replace('fa-sun', 'fa-moon');
                      themeToggle.setAttribute('aria-label', 'Toggle dark mode');
                  }
                  
                  // Save preference
                  const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
                  localStorage.setItem('delta-theme', theme);
                  
                  showToast(`Switched to ${theme} theme`, 'info');
              });
              
              // Apply saved theme on load
              const savedTheme = localStorage.getItem('delta-theme');
              if (savedTheme === 'dark') {
                  document.body.classList.add('dark-theme');
                  themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
                  themeToggle.setAttribute('aria-label', 'Toggle light mode');
              }
          }
      }
      
      /**
       * Show a modal dialog
       */
      function showModal(type, itemId, data = {}) {
          // Create or get modal container
          const modalContainer = document.querySelector('.modal-container');
          modalContainer.innerHTML = ''; // Clear any existing modals
          
          const modal = document.createElement('div');
          modal.classList.add('modal');
          
          // Determine modal content based on type
          let title = '';
          let content = '';
          
          switch(type) {
              case 'create':
                  title = `Create New ${itemId.replace('Management', '').trim()}`;
                  content = createFormForEntity(itemId);
                  break;
              case 'view':
                  title = `View Details: ${data.name || itemId}`;
                  content = generateViewContent(itemId, data);
                  break;
              case 'edit':
                  title = `Edit: ${data.name || itemId}`;
                  content = createFormForEntity(itemId, true, data);
                  break;
              case 'notification':
                  title = 'Send New Notification';
                  content = `
                      <form id="notification-form" class="form">
                          <div class="form-group">
                              <label for="notification-title">Title</label>
                              <input type="text" id="notification-title" required>
                          </div>
                          <div class="form-group">
                              <label for="notification-message">Message</label>
                              <textarea id="notification-message" rows="4" required></textarea>
                          </div>
                          <div class="form-group">
                              <label for="notification-recipients">Recipients</label>
                              <select id="notification-recipients" required>
                                  <option value="all">All Users</option>
                                  <option value="students">Students Only</option>
                                  <option value="admins">Administrators Only</option>
                              </select>
                          </div>
                          <div class="form-actions">
                              <button type="button" class="btn btn-secondary modal-cancel">Cancel</button>
                              <button type="submit" class="btn btn-primary">Send Notification</button>
                          </div>
                      </form>
                  `;
                  break;
              case 'settings':
                  title = 'System Settings';
                  content = `
                      <form id="settings-form" class="form">
                          <div class="form-group">
                              <label for="setting-theme">Theme</label>
                              <select id="setting-theme">
                                  <option value="light" ${!document.body.classList.contains('dark-theme') ? 'selected' : ''}>Light</option>
                                  <option value="dark" ${document.body.classList.contains('dark-theme') ? 'selected' : ''}>Dark</option>
                                  <option value="system">System Default</option>
                              </select>
                          </div>
                          <div class="form-group">
                              <label for="setting-language">Language</label>
                              <select id="setting-language">
                                  <option value="en" selected>English</option>
                                  <option value="fr">French</option>
                                  <option value="es">Spanish</option>
                                  <option value="de">German</option>
                              </select>
                          </div>
                          <div class="form-group">
                              <label for="setting-notifications">Email Notifications</label>
                              <select id="setting-notifications">
                                  <option value="all">All Notifications</option>
                                  <option value="important">Important Only</option>
                                  <option value="none">None</option>
                              </select>
                          </div>
                          <div class="form-actions">
                              <button type="button" class="btn btn-secondary modal-cancel">Cancel</button>
                              <button type="submit" class="btn btn-primary">Save Settings</button>
                          </div>
                      </form>
                  `;
                  break;
              case 'confirm':
                  title = data.name || 'Confirmation';
                  content = data.customContent || `<p>Are you sure?</p>`;
                  break;
              default:
                  title = itemId;
                  content = `<p>Information about ${data.name || itemId}</p>`;
          }
          
          // Create modal HTML
          modal.innerHTML = `
              <div class="modal-content">
                  <div class="modal-header">
                      <h3>${title}</h3>
                      <button class="modal-close" aria-label="Close modal"><i class="fas fa-times"></i></button>
                  </div>
                  <div class="modal-body">
                      ${content}
                  </div>
              </div>
          `;
          
          modalContainer.appendChild(modal);
          modalContainer.style.display = 'flex';
          
          // Trap focus inside modal for accessibility
          trapFocusInModal(modal);
          
          // Add animation
          setTimeout(() => {
              modal.classList.add('show');
          }, 10);
          
          // Add event listeners
          modal.querySelector('.modal-close').addEventListener('click', closeModal);
          
          // Add cancel button handlers
          const cancelButtons = modal.querySelectorAll('.modal-cancel');
          cancelButtons.forEach(button => {
              button.addEventListener('click', closeModal);
          });
          
          // Handle form submission
          const form = modal.querySelector('form');
          if (form) {
              form.addEventListener('submit', function(e) {
                  e.preventDefault();
                  
                  // Simulate form validation
                  const requiredFields = form.querySelectorAll('[required]');
                  let isValid = true;
                  
                  requiredFields.forEach(field => {
                      if (!field.value.trim()) {
                          isValid = false;
                          field.classList.add('invalid');
                          
                          // Add error message if not already present
                          if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('error-message')) {
                              const errorMessage = document.createElement('div');
                              errorMessage.classList.add('error-message');
                              errorMessage.textContent = 'This field is required';
                              field.parentNode.insertBefore(errorMessage, field.nextSibling);
                          }
                      } else {
                          field.classList.remove('invalid');
                          if (field.nextElementSibling && field.nextElementSibling.classList.contains('error-message')) {
                              field.parentNode.removeChild(field.nextElementSibling);
                          }
                      }
                  });
                  
                  if (!isValid) {
                      showToast('Please fill in all required fields', 'error');
                      return;
                  }
                  
                  // Simulate processing
                  const submitButton = form.querySelector('button[type="submit"]');
                  submitButton.disabled = true;
                  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                  
                  setTimeout(() => {
                      // Show success message
                      showToast(`${title} completed successfully`, 'success');
                      
                      // For settings, apply changes
                      if (form.id === 'settings-form') {
                          applySettings(form);
                      }
                      
                      // Close modal
                      closeModal();
                  }, 1000);
              });
          }
          
          // Close modal when clicking outside
          modalContainer.addEventListener('click', function(e) {
              if (e.target === modalContainer) {
                  closeModal();
              }
          });
          
          // Close on escape key
          document.addEventListener('keydown', function(e) {
              if (e.key === 'Escape' && modalContainer.style.display === 'flex') {
                  closeModal();
              }
          });
      }
      
      /**
       * Apply settings from settings form
       */
      function applySettings(form) {
          // Apply theme
          const themeSelect = form.querySelector('#setting-theme');
          if (themeSelect) {
              const theme = themeSelect.value;
              
              if (theme === 'dark') {
                  document.body.classList.add('dark-theme');
                  const themeToggle = document.querySelector('.theme-toggle');
                  if (themeToggle && themeToggle.querySelector('i')) {
                      themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
                  }
              } else if (theme === 'light') {
                  document.body.classList.remove('dark-theme');
                  const themeToggle = document.querySelector('.theme-toggle');
                  if (themeToggle && themeToggle.querySelector('i')) {
                      themeToggle.querySelector('i').classList.replace('fa-sun', 'fa-moon');
                  }
              }
              
              localStorage.setItem('delta-theme', theme);
          }
          
          // Other settings would be handled similarly
      }
      
      /**
       * Trap focus inside modal for accessibility
       */
      function trapFocusInModal(modal) {
          const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
          
          if (focusableElements.length === 0) return;
          
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];
          
          // Focus the first element
          setTimeout(() => {
              firstElement.focus();
          }, 100);
          
          // Trap focus inside modal
          modal.addEventListener('keydown', function(e) {
              if (e.key === 'Tab') {
                  // Shift + Tab
                  if (e.shiftKey) {
                      if (document.activeElement === firstElement) {
                          e.preventDefault();
                          lastElement.focus();
                      }
                  // Tab
                  } else {
                      if (document.activeElement === lastElement) {
                          e.preventDefault();
                          firstElement.focus();
                      }
                  }
              }
          });
      }
      
      /**
       * Close the currently open modal
       */
      function closeModal() {
          const modal = document.querySelector('.modal');
          if (!modal) return;
          
          modal.classList.remove('show');
          
          setTimeout(() => {
              const modalContainer = document.querySelector('.modal-container');
              modalContainer.style.display = 'none';
              modalContainer.innerHTML = '';
              
              // Return focus to the element that opened the modal
              if (document.activeElement) {
                  document.activeElement.blur();
              }
          }, 300);
      }
      
      /**
       * Generate view content for an item
       */
      function generateViewContent(itemId, data) {
          // For a real app, you would fetch this data from your backend
          let content = '<div class="view-details">';
          
          if (itemId.startsWith('#STUDENT')) {
              content += `
                  <div class="view-header">
                      <div class="view-avatar">
                          <i class="fas fa-user-graduate"></i>
                      </div>
                      <div class="view-title">
                          <h4>${data.name || 'Student User'}</h4>
                          <p>Student Account</p>
                      </div>
                  </div>
                  <div class="view-body">
                      <div class="detail-row">
                          <div class="detail-label">User ID:</div>
                          <div class="detail-value">${itemId}</div>
                      </div>
                      <div class="detail-row">
                          <div class="detail-label">Email:</div>
                          <div class="detail-value">student@example.com</div>
                      </div>
                      <div class="detail-row">
                          <div class="detail-label">Status:</div>
                          <div class="detail-value"><span class="status active">Active</span></div>
                      </div>
                      <div class="detail-row">
                          <div class="detail-label">Joined:</div>
                          <div class="detail-value">2023-05-15</div>
                      </div>
                      <div class="detail-row">
                          <div class="detail-label">Last Login:</div>
                          <div class="detail-value">2023-11-10 14:30</div>
                      </div>
                  </div>
              `;
          } else if (itemId.startsWith('#ADMIN')) {
              content += `
                  <div class="view-header">
                      <div class="view-avatar">
                          <i class="fas fa-user-shield"></i>
                      </div>
                      <div class="view-title">
                          <h4>${data.name || 'Admin User'}</h4>
                          <p>Administrator Account</p>
                      </div>
                  </div>
                  <div class="view-body">
                      <div class="detail-row">
                          <div class="detail-label">User ID:</div>
                          <div class="detail-value">${itemId}</div>
                      </div>
                      <div class="detail-row">
                          <div class="detail-label">Email:</div>
                          <div class="detail-value">admin@example.com</div>
                      </div>
                      <div class="detail-row">
                          <div class="detail-label">Status:</div>
                          <div class="detail-value"><span class="status inactive">Inactive</span></div>
                      </div>
                      <div class="detail-row">
                          <div class="detail-label">Role:</div>
                          <div class="detail-value">System Administrator</div>
                      </div>
                      <div class="detail-row">
                          <div class="detail-label">Permissions:</div>
                          <div class="detail-value">Full Access</div>
                      </div>
                  </div>
              `;
          } else if (itemId.startsWith('#SCHD')) {
              content += `
                  <div class="view-header">
                      <div class="view-avatar">
                          <i class="fas fa-calendar-alt"></i>
                      </div>
                      <div class="view-title">
                          <h4>${data.name || 'Study Schedule'}</h4>
                          <p>Created by studentUser</p>
                      </div>
                  </div>
                  <div class="view-body">
                      <div class="detail-row">
                          <div class="detail-label">Schedule ID:</div>
                          <div class="detail-value">${itemId}</div>
                      </div>
                      <div class="detail-row">
                          <div class="detail-label">Created:</div>
                          <div class="detail-value">2023-09-01</div>
                      </div>
                      <div class="detail-row">
                          <div class="detail-label">Status:</div>
                          <div class="detail-value"><span class="status active">Active</span></div>
                      </div>
                      <div class="detail-row">
                          <div class="detail-label"> <div class="detail-row">
                    <div class="detail-label">Subjects:</div>
                    <div class="detail-value">Computer Science, Calculus I</div>
                </div>
            </div>
            <div class="schedule-preview">
                <h4>Schedule Preview</h4>
                <table class="mini-schedule">
                    <thead>
                        <tr>
                            <th>Day</th>
                            <th>Time</th>
                            <th>Subject</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Monday</td>
                            <td>9:00 - 11:00</td>
                            <td>Computer Science</td>
                        </tr>
                        <tr>
                            <td>Wednesday</td>
                            <td>13:00 - 15:00</td>
                            <td>Calculus I</td>
                        </tr>
                        <tr>
                            <td>Friday</td>
                            <td>10:00 - 12:00</td>
                            <td>Computer Science</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    } else if (itemId.startsWith('#TEACHER')) {
        content += `
            <div class="view-header">
                <div class="view-avatar">
                    <i class="fas fa-chalkboard-teacher"></i>
                </div>
                <div class="view-title">
                    <h4>${data.name || 'Teacher User'}</h4>
                    <p>Teacher Account</p>
                </div>
            </div>
            <div class="view-body">
                <div class="detail-row">
                    <div class="detail-label">User ID:</div>
                    <div class="detail-value">${itemId}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Email:</div>
                    <div class="detail-value">teacher@example.com</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Status:</div>
                    <div class="detail-value"><span class="status active">Active</span></div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Department:</div>
                    <div class="detail-value">Computer Science</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Classes:</div>
                    <div class="detail-value">CS101, CS202, CS303</div>
                </div>
            </div>
        `;
    } else if (itemId.includes('Exam')) {
        content += `
            <div class="view-header">
                <div class="view-avatar">
                    <i class="fas fa-file-alt"></i>
                </div>
                <div class="view-title">
                    <h4>${data.name || itemId}</h4>
                    <p>Examination Details</p>
                </div>
            </div>
            <div class="view-body">
                <div class="detail-row">
                    <div class="detail-label">Exam Name:</div>
                    <div class="detail-value">${data.name || itemId}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Subject:</div>
                    <div class="detail-value">Computer Science</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Date:</div>
                    <div class="detail-value">2023-12-15</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Time:</div>
                    <div class="detail-value">9:00 AM - 12:00 PM</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Location:</div>
                    <div class="detail-value">Room 302</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Status:</div>
                    <div class="detail-value"><span class="status active">Scheduled</span></div>
                </div>
            </div>
        `;
    } else if (itemId.includes('Computer Science') || itemId.includes('Calculus') || itemId.includes('Physics')) {
        content += `
            <div class="view-header">
                <div class="view-avatar">
                    <i class="fas fa-book"></i>
                </div>
                <div class="view-title">
                    <h4>${data.name || itemId}</h4>
                    <p>Subject Details</p>
                </div>
            </div>
            <div class="view-body">
                <div class="detail-row">
                    <div class="detail-label">Subject:</div>
                    <div class="detail-value">${data.name || itemId}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Code:</div>
                    <div class="detail-value">${itemId.includes('Computer') ? 'CS101' : (itemId.includes('Calculus') ? 'MATH101' : 'PHYS101')}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Department:</div>
                    <div class="detail-value">${itemId.includes('Computer') ? 'Computer Science' : (itemId.includes('Calculus') ? 'Mathematics' : 'Physics')}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Credits:</div>
                    <div class="detail-value">3</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Students:</div>
                    <div class="detail-value">42</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Status:</div>
                    <div class="detail-value"><span class="status active">Active</span></div>
                </div>
            </div>
        `;
    } else {
        // Generic content for other types
        content += `
            <div class="view-header">
                <div class="view-avatar">
                    <i class="fas fa-file-alt"></i>
                </div>
                <div class="view-title">
                    <h4>${data.name || itemId}</h4>
                    <p>Item Details</p>
                </div>
            </div>
            <div class="view-body">
                <div class="detail-row">
                    <div class="detail-label">ID:</div>
                    <div class="detail-value">${itemId}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Created:</div>
                    <div class="detail-value">2023-10-15</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Status:</div>
                    <div class="detail-value"><span class="status active">Active</span></div>
                </div>
            </div>
        `;
    }
    
    // Add action buttons
    content += `
        <div class="view-actions">
            <button class="btn btn-secondary modal-cancel">Close</button>
            <button class="btn btn-primary edit-button">Edit</button>
        </div>
    `;
    
    content += '</div>';
    
    return content;
}

/**
 * Create form for different entity types
 */
function createFormForEntity(entityType, isEdit = false, data = {}) {
    let formHTML = '<form class="form">';
    
    if (entityType.includes('User')) {
        formHTML += `
            <div class="form-group">
                <label for="user-username">Username</label>
                <input type="text" id="user-username" ${isEdit ? 'value="' + (data.name || 'sampleUser') + '"' : ''} required>
            </div>
            <div class="form-group">
                <label for="user-email">Email</label>
                <input type="email" id="user-email" ${isEdit ? 'value="user@example.com"' : ''} required>
            </div>
            <div class="form-group">
                <label for="user-role">Role</label>
                <select id="user-role" required>
                    <option value="student" ${isEdit && data.name && data.name.includes('student') ? 'selected' : ''}>Student</option>
                    <option value="admin" ${isEdit && data.name && data.name.includes('admin') ? 'selected' : ''}>Administrator</option>
                    <option value="teacher" ${isEdit && data.name && data.name.includes('prof') ? 'selected' : ''}>Teacher</option>
                </select>
            </div>
            <div class="form-group">
                <label for="user-status">Status</label>
                <select id="user-status" required>
                    <option value="active" ${isEdit ? 'selected' : ''}>Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending Approval</option>
                </select>
            </div>
            <div class="form-group">
                <label for="user-permissions">Permissions</label>
                <div class="checkbox-group">
                    <label class="checkbox">
                        <input type="checkbox" id="perm-view" ${isEdit ? 'checked' : ''}>
                        View Content
                    </label>
                    <label class="checkbox">
                        <input type="checkbox" id="perm-create" ${isEdit ? 'checked' : ''}>
                        Create Content
                    </label>
                    <label class="checkbox">
                        <input type="checkbox" id="perm-edit">
                        Edit Content
                    </label>
                    <label class="checkbox">
                        <input type="checkbox" id="perm-delete">
                        Delete Content
                    </label>
                </div>
            </div>
        `;
    } else if (entityType.includes('Schedule')) {
        formHTML += `
            <div class="form-group">
                <label for="schedule-name">Schedule Name</label>
                <input type="text" id="schedule-name" ${isEdit ? 'value="' + (data.name || 'Sample Schedule') + '"' : ''} required>
            </div>
            <div class="form-group">
                <label for="schedule-description">Description</label>
                <textarea id="schedule-description" rows="3">${isEdit ? 'This is a sample study schedule' : ''}</textarea>
            </div>
            <div class="form-group">
                <label for="schedule-owner">Owner</label>
                <input type="text" id="schedule-owner" ${isEdit ? 'value="studentUser"' : ''} required>
            </div>
            <div class="form-group">
                <label for="schedule-start-date">Start Date</label>
                <input type="date" id="schedule-start-date" ${isEdit ? 'value="2023-11-01"' : ''} required>
            </div>
            <div class="form-group">
                <label for="schedule-end-date">End Date</label>
                <input type="date" id="schedule-end-date" ${isEdit ? 'value="2023-12-31"' : ''} required>
            </div>
            <div class="form-group">
                <label for="schedule-status">Status</label>
                <select id="schedule-status" required>
                    <option value="active" ${isEdit ? 'selected' : ''}>Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="draft">Draft</option>
                </select>
            </div>
            <div class="form-group">
                <label>Subjects</label>
                <div class="checkbox-group">
                    <label class="checkbox">
                        <input type="checkbox" id="subj-cs" ${isEdit ? 'checked' : ''}>
                        Computer Science
                    </label>
                    <label class="checkbox">
                        <input type="checkbox" id="subj-math" ${isEdit ? 'checked' : ''}>
                        Calculus I
                    </label>
                    <label class="checkbox">
                        <input type="checkbox" id="subj-physics">
                        Physics
                    </label>
                </div>
            </div>
        `;
    } else if (entityType.includes('Subject')) {
        formHTML += `
            <div class="form-group">
                <label for="subject-name">Subject Name</label>
                <input type="text" id="subject-name" ${isEdit ? 'value="' + (data.name || 'Introduction to Computer Science') + '"' : ''} required>
            </div>
            <div class="form-group">
                <label for="subject-code">Subject Code</label>
                <input type="text" id="subject-code" ${isEdit ? 'value="CS101"' : ''} required>
            </div>
            <div class="form-group">
                <label for="subject-credits">Credits</label>
                <input type="number" id="subject-credits" min="1" max="6" ${isEdit ? 'value="3"' : ''} required>
            </div>
            <div class="form-group">
                <label for="subject-description">Description</label>
                <textarea id="subject-description" rows="4">${isEdit ? 'This course provides an introduction to computer science concepts...' : ''}</textarea>
            </div>
            <div class="form-group">
                <label for="subject-department">Department</label>
                <select id="subject-department" required>
                    <option value="cs" ${isEdit && data.name && data.name.includes('Computer') ? 'selected' : ''}>Computer Science</option>
                    <option value="math" ${isEdit && data.name && data.name.includes('Calculus') ? 'selected' : ''}>Mathematics</option>
                    <option value="phys" ${isEdit && data.name && data.name.includes('Physics') ? 'selected' : ''}>Physics</option>
                    <option value="eng">English</option>
                    <option value="hist">History</option>
                </select>
            </div>
        `;
    } else if (entityType.includes('Exam')) {
        formHTML += `
            <div class="form-group">
                <label for="exam-name">Exam Name</label>
                <input type="text" id="exam-name" ${isEdit ? 'value="' + (data.name || 'CS101 Midterm Exam') + '"' : ''} required>
            </div>
            <div class="form-group">
                <label for="exam-subject">Subject</label>
                <select id="exam-subject" required>
                    <option value="cs101" ${isEdit && data.name && data.name.includes('CS101') ? 'selected' : ''}>CS101 - Introduction to Computer Science</option>
                    <option value="math101" ${isEdit && data.name && data.name.includes('MATH101') ? 'selected' : ''}>MATH101 - Calculus I</option>
                    <option value="phys101">PHYS101 - Physics I</option>
                </select>
            </div>
            <div class="form-group">
                <label for="exam-date">Date</label>
                <input type="date" id="exam-date" ${isEdit ? 'value="2023-12-15"' : ''} required>
            </div>
            <div class="form-group">
                <label for="exam-time">Time</label>
                <input type="time" id="exam-time" ${isEdit ? 'value="14:00"' : ''} required>
            </div>
            <div class="form-group">
                <label for="exam-duration">Duration (minutes)</label>
                <input type="number" id="exam-duration" min="15" max="240" ${isEdit ? 'value="120"' : ''} required>
            </div>
            <div class="form-group">
                <label for="exam-location">Location</label>
                <input type="text" id="exam-location" ${isEdit ? 'value="Room 302"' : ''}>
            </div>
            <div class="form-group">
                <label for="exam-type">Exam Type</label>
                <select id="exam-type" required>
                    <option value="midterm" ${isEdit && data.name && data.name.includes('Midterm') ? 'selected' : ''}>Midterm</option>
                    <option value="final" ${isEdit && data.name && data.name.includes('Final') ? 'selected' : ''}>Final</option>
                    <option value="quiz">Quiz</option>
                    <option value="makeup">Make-up Exam</option>
                </select>
            </div>
        `;
    } else if (entityType.includes('Notification')) {
        formHTML += `
            <div class="form-group">
                <label for="notification-title">Title</label>
                <input type="text" id="notification-title" ${isEdit ? 'value="' + (data.name || 'System Notification') + '"' : ''} required>
            </div>
            <div class="form-group">
                <label for="notification-message">Message</label>
                <textarea id="notification-message" rows="4" required>${isEdit ? 'This is an important system notification.' : ''}</textarea>
            </div>
            <div class="form-group">
                <label for="notification-type">Type</label>
                <select id="notification-type" required>
                    <option value="info" ${isEdit ? 'selected' : ''}>Information</option>
                    <option value="warning">Warning</option>
                    <option value="alert">Alert</option>
                    <option value="update">System Update</option>
                </select>
            </div>
            <div class="form-group">
                <label for="notification-recipients">Recipients</label>
                <select id="notification-recipients" required>
                    <option value="all" ${isEdit ? 'selected' : ''}>All Users</option>
                    <option value="students">Students Only</option>
                    <option value="teachers">Teachers Only</option>
                    <option value="admins">Administrators Only</option>
                </select>
            </div>
            <div class="form-group">
                <label for="notification-schedule">Schedule</label>
                <input type="datetime-local" id="notification-schedule" ${isEdit ? 'value="2023-11-20T10:00"' : ''}>
                <div class="help-text">Leave blank to send immediately</div>
            </div>
        `;
    } else {
        // Generic form
        formHTML += `
            <div class="form-group">
                <label for="item-name">Name</label>
                <input type="text" id="item-name" ${isEdit ? 'value="' + (data.name || 'Sample Item') + '"' : ''} required>
            </div>
            <div class="form-group">
                <label for="item-description">Description</label>
                <textarea id="item-description" rows="4">${isEdit ? 'Sample description for this item.' : ''}</textarea>
            </div>
            <div class="form-group">
                <label for="item-status">Status</label>
                <select id="item-status" required>
                    <option value="active" ${isEdit ? 'selected' : ''}>Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>
        `;
    }
    
    // Add form actions
    formHTML += `
        <div class="form-actions">
            <button type="button" class="btn btn-secondary modal-cancel">Cancel</button>
            <button type="submit" class="btn btn-primary">${isEdit ? 'Update' : 'Create'}</button>
        </div>
    </form>`;
    
    return formHTML;
}

/**
 * Confirm delete dialog
 */
function confirmDelete(itemId, itemName) {
    showModal('confirm', 'Confirm Delete', {
        name: itemName || itemId,
        customContent: `
            <div class="confirm-dialog">
                <div class="confirm-icon warning">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <div class="confirm-message">
                    <p>Are you sure you want to delete <strong>${itemName || itemId}</strong>?</p>
                    <p class="warning-text">This action cannot be undone.</p>
                </div>
                <div class="confirm-actions">
                    <button class="btn btn-secondary modal-cancel">Cancel</button>
                    <button class="btn btn-danger confirm-delete">Delete</button>
                </div>
            </div>
        `
    });
    
    // Add delete confirmation handler
    setTimeout(() => {
        const deleteButton = document.querySelector('.confirm-delete');
        if (deleteButton) {
            deleteButton.addEventListener('click', function() {
                // Show loading state
                this.disabled = true;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deleting...';
                
                // Simulate delete operation with delay
                setTimeout(() => {
                    closeModal();
                    
                    // Remove from UI if found
                    let elementRemoved = false;
                    
                    // Check data tables
                    const rows = document.querySelectorAll('tbody tr');
                    rows.forEach(row => {
                        if (row.querySelector('td') && row.querySelector('td').textContent.includes(itemId)) {
                            // Add deletion animation
                            row.style.transition = 'all 0.5s ease';
                            row.style.backgroundColor = 'rgba(220, 53, 69, 0.1)';
                            row.style.opacity = '0';
                            row.style.transform = 'translateX(20px)';
                            
                            // Remove after animation
                            setTimeout(() => {
                                row.remove();
                            }, 500);
                            
                            elementRemoved = true;
                        }
                    });
                    
                    // Check list items
                    const listItems = document.querySelectorAll('.data-list li');
                    listItems.forEach(item => {
                        const itemContent = item.textContent;
                        if (itemContent.includes(itemName) || itemContent.includes(itemId)) {
                            // Add deletion animation
                            item.style.transition = 'all 0.5s ease';
                            item.style.backgroundColor = 'rgba(220, 53, 69, 0.1)';
                            item.style.opacity = '0';
                            item.style.transform = 'translateX(20px)';
                            
                            // Remove after animation
                            setTimeout(() => {
                                item.remove();
                            }, 500);
                            
                            elementRemoved = true;
                        }
                    });
                    
                    // Check notification items
                    const notificationItems = document.querySelectorAll('.notification-item');
                    notificationItems.forEach(item => {
                        const itemContent = item.textContent;
                        if (itemContent.includes(itemName) || itemContent.includes(itemId)) {
                            // Add deletion animation
                            item.style.transition = 'all 0.5s ease';
                            item.style.backgroundColor = 'rgba(220, 53, 69, 0.1)';
                            item.style.opacity = '0';
                            item.style.height = '0';
                            item.style.padding = '0';
                            item.style.margin = '0';
                            
                            // Remove after animation
                            setTimeout(() => {
                                item.remove();
                            }, 500);
                            
                            elementRemoved = true;
                        }
                    });
                    
                    if (elementRemoved) {
                        showToast(`${itemName || itemId} has been deleted`, 'success');
                    } else {
                        showToast(`Item was deleted from the database`, 'success');
                    }
                }, 1000);
            });
        }
    }, 100);
}

/**
 * Confirm logout
 */
function confirmLogout() {
    showModal('confirm', 'Logout Confirmation', {
        customContent: `
            <div class="confirm-dialog">
                <div class="confirm-icon">
                    <i class="fas fa-sign-out-alt"></i>
                </div>
                <div class="confirm-message">
                    <p>Are you sure you want to logout?</p>
                    <p>Any unsaved changes will be lost.</p>
                </div>
                <div class="confirm-actions">
                    <button class="btn btn-secondary modal-cancel">Cancel</button>
                    <button class="btn btn-primary confirm-logout">Logout</button>
                </div>
            </div>
        `
    });
    
    // Add logout confirmation handler
    setTimeout(() => {
        const logoutButton = document.querySelector('.confirm-logout');
        if (logoutButton) {
            logoutButton.addEventListener('click', function() {
                // Show loading state
                this.disabled = true;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging out...';
                
                // Simulate logout process
                setTimeout(() => {
                    showToast('Logged out successfully', 'success');
                    
                    // Simulate redirect to login page
                    setTimeout(() => {
                        // In a real application, this would redirect to the login page
                        // For now, we'll just reload the current page
                        window.location.href = 'index.html';
                    }, 1000);
                }, 1000);
            });
        }
    }, 100);
}

/**
 * Generate report function
 */
function generateReport() {
    showToast('Generating report, please wait...', 'info');
    
    // Create loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.classList.add('loading-overlay');
    loadingOverlay.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <span>Generating Report...</span>
        </div>
    `;
    document.body.appendChild(loadingOverlay);
    
    // Simulate report generation (would connect to a backend API in a real app)
    setTimeout(() => {
        // Simulate report creation
        const reportDate = new Date().toISOString().split('T')[0];
        const reportName = `delta_students_report_${reportDate}.pdf`;
        
        // Show report preview modal
        showModal('view', 'Report Generated', {
            name: 'System Report',
            customContent: `
                <div class="report-preview">
                    <div class="report-icon">
                        <i class="fas fa-file-pdf"></i>
                    </div>
                    <div class="report-info">
                        <h4>Report Successfully Generated</h4>
                        <p>Your report <strong>${reportName}</strong> is ready to download.</p>
                        <p>Generated on: ${new Date().toLocaleString()}</p>
                        <p>Contains data for: User Activity, Schedules, Exam Results</p>
                    </div>
                    <div class="report-actions">
                        <button class="btn btn-secondary modal-cancel">Close</button>
                        <button class="btn btn-primary download-report">Download Report</button>
                    </div>
                </div>
            `
        });
        
        // Remove loading overlay
        document.body.removeChild(loadingOverlay);
        
        // Add download handler
        setTimeout(() => {
            const downloadButton = document.querySelector('.download-report');
            if (downloadButton) {
                downloadButton.addEventListener('click', function() {
                    // In a real app, this would trigger a file download
                    // Simulate download by creating a fake anchor link
                    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
                    
                    setTimeout(() => {
                        showToast('Report downloaded successfully', 'success');
                        closeModal();
                    }, 1000);
                });
            }
        }, 100);
    }, 2000);
}