document.addEventListener('DOMContentLoaded', function() {
          // Current date and greeting
          updateDateTime();
          
          // Task filter tabs
          setupFilterTabs();
          
          // View toggle
          setupViewToggle();
          
          // Task actions
          setupTaskActions();
          
          // Add task functionality
          setupAddTask();
          
          // Edit task modal
          setupTaskModal();
          
          // Task checkboxes
          setupTaskCheckboxes();
      });
      
      // Update date and time in the header
      function updateDateTime() {
          const currentDateElem = document.getElementById('current-date');
          const greetingElem = document.getElementById('greeting');
          const now = new Date();
          
          // Format date: Monday, April 7, 2025
          const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
          currentDateElem.textContent = now.toLocaleDateString('en-US', options);
          
          // Personalized greeting based on time of day
          const hour = now.getHours();
          let greeting = 'Good morning';
          
          if (hour >= 12 && hour < 18) {
              greeting = 'Good afternoon';
          } else if (hour >= 18) {
              greeting = 'Good evening';
          }
          
          // Get username from the greeting text and keep it
          const usernameMatch = greetingElem.textContent.match(/,\s(.+)!!/);
          const username = usernameMatch ? usernameMatch[1] : 'Mohamed Eldosoki';
          
          greetingElem.textContent = `${greeting}, ${username}!!`;
      }
      
      // Setup filter tabs
      function setupFilterTabs() {
          const filterTabs = document.querySelectorAll('.filter-tab');
          
          filterTabs.forEach(tab => {
              tab.addEventListener('click', () => {
                  // Remove active class from all tabs
                  filterTabs.forEach(t => t.classList.remove('active'));
                  
                  // Add active class to clicked tab
                  tab.classList.add('active');
                  
                  // Filter tasks based on the selected filter
                  const filter = tab.dataset.filter;
                  filterTasks(filter);
              });
          });
      }
      
      // Filter tasks based on selected filter
      function filterTasks(filter) {
          const tasks = document.querySelectorAll('.task-item');
          const today = new Date();
          const weekLater = new Date(today);
          weekLater.setDate(today.getDate() + 7);
          
          tasks.forEach(task => {
              const dueText = task.querySelector('.task-due').textContent;
              const dueMatch = dueText.match(/Dec (\d+)th/);
              
              if (filter === 'all') {
                  task.style.display = 'flex';
                  return;
              }
              
              if (!dueMatch) {
                  task.style.display = 'none';
                  return;
              }
              
              const dueDay = parseInt(dueMatch[1]);
              const dueDate = new Date(2025, 11, dueDay); // December (11) 2025
              
              switch (filter) {
                  case 'today':
                      task.style.display = dueDate.toDateString() === today.toDateString() ? 'flex' : 'none';
                      break;
                  case 'week':
                      task.style.display = dueDate <= weekLater ? 'flex' : 'none';
                      break;
                  case 'upcoming':
                      task.style.display = dueDate > weekLater ? 'flex' : 'none';
                      break;
                  default:
                      task.style.display = 'flex';
              }
          });
      }
      
      // Setup view toggle
      function setupViewToggle() {
          const viewButtons = document.querySelectorAll('.view-btn');
          const tasksList = document.querySelector('.tasks-list-container');
          
          viewButtons.forEach(btn => {
              btn.addEventListener('click', () => {
                  // Remove active class from all buttons
                  viewButtons.forEach(b => b.classList.remove('active'));
                  
                  // Add active class to clicked button
                  btn.classList.add('active');
                  
                  // Toggle view
                  const view = btn.dataset.view;
                  if (view === 'kanban') {
                      tasksList.classList.add('kanban-view');
                  } else {
                      tasksList.classList.remove('kanban-view');
                  }
              });
          });
      }
      
      // Setup task actions
      function setupTaskActions() {
          const editButtons = document.querySelectorAll('.task-action-btn:first-child');
          const deleteButtons = document.querySelectorAll('.task-action-btn:nth-child(2)');
          
          // Edit task
          editButtons.forEach(btn => {
              btn.addEventListener('click', event => {
                  event.stopPropagation();
                  const taskItem = btn.closest('.task-item');
                  openEditTaskModal(taskItem);
              });
          });
          
          // Delete task
          deleteButtons.forEach(btn => {
              btn.addEventListener('click', event => {
                  event.stopPropagation();
                  const taskItem = btn.closest('.task-item');
                  
                  // Simple confirmation before deleting
                  if (confirm('Are you sure you want to delete this task?')) {
                      taskItem.style.height = '0';
                      taskItem.style.opacity = '0';
                      taskItem.style.marginBottom = '0';
                      taskItem.style.padding = '0';
                      
                      setTimeout(() => {
                          taskItem.remove();
                          updateTaskCounters();
                      }, 300);
                  }
              });
          });
      }
      
      // Open edit task modal
      function openEditTaskModal(taskItem) {
          const modal = document.getElementById('task-edit-modal');
          const taskTitle = taskItem.querySelector('h4').textContent;
          const taskSubject = taskItem.querySelector('.task-tag').textContent;
          let taskPriority = 'medium';
          
          if (taskItem.classList.contains('priority-high')) {
              taskPriority = 'high';
          } else if (taskItem.classList.contains('priority-low')) {
              taskPriority = 'low';
          }
          
          // Populate modal fields
          document.getElementById('edit-task-title').value = taskTitle;
          document.getElementById('edit-task-subject').value = taskSubject.toLowerCase();
          document.getElementById('edit-task-priority').value = taskPriority;
          
          // Show modal
          modal.classList.add('visible');
          
          // Close modal when clicking on the close button
          const closeButton = modal.querySelector('.modal-close');
          closeButton.addEventListener('click', () => {
              modal.classList.remove('visible');
          });
          
          // Close modal when clicking on the cancel button
          const cancelButton = modal.querySelector('.modal-cancel');
          cancelButton.addEventListener('click', () => {
              modal.classList.remove('visible');
          });
          
          // Close modal when clicking outside
          modal.addEventListener('click', event => {
              if (event.target === modal) {
                  modal.classList.remove('visible');
              }
          });
          
          // Save task changes
          const form = document.getElementById('edit-task-form');
          form.addEventListener('submit', event => {
              event.preventDefault();
              
              const newTitle = document.getElementById('edit-task-title').value;
              const newSubject = document.getElementById('edit-task-subject').value;
              const newPriority = document.getElementById('edit-task-priority').value;
              
              // Update task item
              taskItem.querySelector('h4').textContent = newTitle;
              
              // Update subject tag
              const taskTag = taskItem.querySelector('.task-tag');
              taskTag.textContent = newSubject.charAt(0).toUpperCase() + newSubject.slice(1);
              taskTag.className = `task-tag ${newSubject}`;
              
              // Update priority
              taskItem.className = taskItem.className.replace(/priority-(low|medium|high)/, `priority-${newPriority}`);
              
              // Close modal
              modal.classList.remove('visible');
          });
      }
      
      // Setup add task functionality
      function setupAddTask() {
          const addTaskButton = document.getElementById('add-task');
          const taskInput = document.getElementById('new-task-input');
          const taskTypeSelect = document.getElementById('task-type');
          const taskList = document.getElementById('task-list');
          
          addTaskButton.addEventListener('click', () => {
              const taskText = taskInput.value.trim();
              
              if (taskText === '') {
                  // Show error if the input is empty
                  taskInput.classList.add('error');
                  setTimeout(() => {
                      taskInput.classList.remove('error');
                  }, 1000);
                  return;
              }
              
              // Create a new task item
              const taskItem = document.createElement('li');
              taskItem.className = 'task-item priority-medium';
              taskItem.innerHTML = `
                  <div class="task-checkbox">
                      <input type="checkbox" id="task-new">
                      <label for="task-new"></label>
                  </div>
                  <div class="task-content">
                      <h4>${taskText}</h4>
                      <div class="task-meta">
                          <span class="task-tag ${taskTypeSelect.value}">${taskTypeSelect.options[taskTypeSelect.selectedIndex].text}</span>
                          <span class="task-due"><i class="fas fa-calendar-alt"></i> Due in 7 days</span>
                      </div>
                  </div>
                  <div class="task-priority">
                      <span class="priority-indicator"></span>
                  </div>
                  <div class="task-actions">
                      <button class="task-action-btn"><i class="fas fa-edit"></i></button>
                      <button class="task-action-btn"><i class="fas fa-trash-alt"></i></button>
                      <button class="task-action-btn"><i class="fas fa-ellipsis-v"></i></button>
                  </div>
              `;
              
              // Add the new task to the list
              taskList.prepend(taskItem);
              
              // Update task ID to be unique
              const newCheckbox = taskItem.querySelector('input[type="checkbox"]');
              const newId = `task-${Date.now()}`;
              newCheckbox.id = newId;
              newCheckbox.nextElementSibling.setAttribute('for', newId);
              
              // Clear input
              taskInput.value = '';
              
              // Add event listeners to the new task
              setupTaskActions();
              setupTaskCheckboxes();
              
              // Update task counters
              updateTaskCounters();
              
              // Apply entrance animation
              taskItem.style.opacity = '0';
              taskItem.style.transform = 'translateX(20px)';
              
              setTimeout(() => {
                  taskItem.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                  taskItem.style.opacity = '1';
                  taskItem.style.transform = 'translateX(0)';
              }, 10);
          });
          
          // Add task on Enter key press
          taskInput.addEventListener('keypress', event => {
              if (event.key === 'Enter') {
                  addTaskButton.click();
              }
          });
      }
      
      // Setup task checkboxes
      function setupTaskCheckboxes() {
          const checkboxes = document.querySelectorAll('.task-checkbox input[type="checkbox"]');
          
          checkboxes.forEach(checkbox => {
              checkbox.addEventListener('change', () => {
                  const taskItem = checkbox.closest('.task-item');
                  
                  if (checkbox.checked) {
                      taskItem.classList.add('completed');
                      taskItem.style.opacity = '0.6';
                      
                      // Move completed task to the bottom after a delay
                      setTimeout(() => {
                          taskItem.remove();
                          document.getElementById('task-list').appendChild(taskItem);
                      }, 500);
                  } else {
                      taskItem.classList.remove('completed');
                      taskItem.style.opacity = '1';
                  }
                  
                  // Update task counters
                  updateTaskCounters();
              });
          });
      }
      
      // Update task counters
      function updateTaskCounters() {
          const totalTasks = document.querySelectorAll('.task-item').length;
          const completedTasks = document.querySelectorAll('.task-item.completed').length;
          const upcomingTasks = totalTasks - completedTasks;
          
          // Update metrics
          document.querySelectorAll('.metric-value')[0].textContent = totalTasks;
          document.querySelectorAll('.metric-value')[1].textContent = completedTasks;
          document.querySelectorAll('.metric-value')[2].textContent = upcomingTasks;
          
          // Update completion percentage
          const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
          const circle = document.querySelector('.circle-progress');
          const circumference = 2 * Math.PI * 25; // 2πr where r=25
          const dashoffset = circumference * (1 - completionPercentage / 100);
          
          circle.style.strokeDasharray = circumference;
          circle.style.strokeDashoffset = dashoffset;
          document.querySelector('.circle-text').textContent = `${completionPercentage}%`;
      }
      
      // Setup task modal
      function setupTaskModal() {
          const modal = document.getElementById('task-edit-modal');
          
          // Close modal when clicking outside
          window.addEventListener('click', event => {
              if (event.target === modal) {
                  modal.classList.remove('visible');
              }
          });
          
          // Close modal with Escape key
          document.addEventListener('keydown', event => {
              if (event.key === 'Escape' && modal.classList.contains('visible')) {
                  modal.classList.remove('visible');
              }
          });
      }
      