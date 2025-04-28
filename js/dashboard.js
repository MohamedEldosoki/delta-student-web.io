/**
 * Delta Students Dashboard
 * Enhanced JavaScript with modular design and advanced features
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize core functionality
  initHeader();
  initThemeToggle();
  initNotifications();
  initModals();
  initStudyTimer();
  initGreeting();
  initCurrentDate();
  initTaskList();
  initNotes();
  initQuotes();
  initProgressBars();
  
  setTimeout(() => {
      showToast('Welcome Back!', 'Your study dashboard is ready.', 'info');
  }, 1500);
});

function initHeader() {
  let lastScrollTop = 0;
  const header = document.querySelector('.main-header');
  const threshold = 100;
  
  window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Add scrolled class for shadow effect
      if (scrollTop > 10) {
          header.classList.add('scrolled');
      } else {
          header.classList.remove('scrolled');
      }
      
      // Hide/show header based on scroll direction
      if (scrollTop > lastScrollTop && scrollTop > threshold) {
          // Scrolling down
          header.classList.add('hidden');
      } else {
          // Scrolling up
          header.classList.remove('hidden');
      }
      
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For mobile bounce effect
  }, { passive: true });
  
  // Mobile menu toggle
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  
  if (menuToggle) {
      menuToggle.addEventListener('click', () => {
          mainNav.classList.toggle('open');
          menuToggle.setAttribute('aria-expanded', 
              mainNav.classList.contains('open') ? 'true' : 'false');
      });
  }
}

// Theme toggle functionality
function initThemeToggle() {
  const themeToggle = document.querySelector('.theme-toggle');
  const htmlElement = document.documentElement;
  
  // Set initial theme based on localStorage or preferred color scheme
  const currentTheme = localStorage.getItem('theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  
  htmlElement.setAttribute('data-theme', currentTheme);
  updateThemeToggleIcon(currentTheme);
  
  // Toggle theme on button click
  if (themeToggle) {
      themeToggle.addEventListener('click', () => {
          const newTheme = htmlElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
          htmlElement.setAttribute('data-theme', newTheme);
          localStorage.setItem('theme', newTheme);
          updateThemeToggleIcon(newTheme);
          
          showToast(
              newTheme === 'dark' ? 'Dark Mode Enabled' : 'Light Mode Enabled', 
              'Your dashboard theme has been updated.', 
              'info'
          );
      });
  }
  
  // Update theme toggle icon
  function updateThemeToggleIcon(theme) {
      if (themeToggle) {
          themeToggle.innerHTML = theme === 'dark' 
              ? '<i class="fas fa-sun" aria-hidden="true"></i>' 
              : '<i class="fas fa-moon" aria-hidden="true"></i>';
          
          themeToggle.setAttribute('aria-label', 
              theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      }
  }
}

// Notifications panel
function initNotifications() {
  const notificationsToggle = document.querySelector('.notifications-toggle');
  const notificationsPanel = document.querySelector('.notifications-panel');
  
  if (notificationsToggle && notificationsPanel) {
      notificationsToggle.addEventListener('click', (e) => {
          e.stopPropagation();
          notificationsPanel.classList.toggle('visible');
          notificationsToggle.classList.toggle('active');
          
          notificationsToggle.setAttribute('aria-expanded', 
              notificationsPanel.classList.contains('visible') ? 'true' : 'false');
      });
      
      // Close when clicking outside
      document.addEventListener('click', (e) => {
          if (!notificationsPanel.contains(e.target) && !notificationsToggle.contains(e.target)) {
              notificationsPanel.classList.remove('visible');
              notificationsToggle.classList.remove('active');
              notificationsToggle.setAttribute('aria-expanded', 'false');
          }
      });
      
      // Mark all as read button
      const markAllReadBtn = notificationsPanel.querySelector('.btn-text');
      if (markAllReadBtn) {
          markAllReadBtn.addEventListener('click', () => {
              document.querySelectorAll('.notification-item.unread').forEach(item => {
                  item.classList.remove('unread');
              });
              
              const badge = notificationsToggle.querySelector('.badge');
              if (badge) {
                  badge.style.display = 'none';
              }
              
              showToast('Notifications Cleared', 'All notifications marked as read.', 'success');
          });
      }
  }
}

// Modal functionality
function initModals() {
  const modalTriggers = document.querySelectorAll('[data-modal]');
  
  modalTriggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
          const modalId = trigger.getAttribute('data-modal');
          const modal = document.getElementById(modalId);
          
          if (modal) {
              openModal(modal);
          }
      });
  });
  
  // Specific modal triggers
  const addResourceBtn = document.getElementById('add-resource');
  const resourceModal = document.getElementById('resource-modal');
  
  if (addResourceBtn && resourceModal) {
      addResourceBtn.addEventListener('click', () => {
          openModal(resourceModal);
      });
  }
  
  // Close buttons
  document.querySelectorAll('.modal-close, .modal-cancel').forEach(closeBtn => {
      closeBtn.addEventListener('click', () => {
          const modal = closeBtn.closest('.modal-container');
          closeModal(modal);
      });
  });
  
  // Close on outside click
  document.querySelectorAll('.modal-container').forEach(container => {
      container.addEventListener('click', (e) => {
          if (e.target === container) {
              closeModal(container);
          }
      });
  });
  
  // Resource form submission
  const resourceForm = document.getElementById('resource-form');
  if (resourceForm) {
      resourceForm.addEventListener('submit', (e) => {
          e.preventDefault();
          
          // Get form values
          const title = document.getElementById('resource-title').value;
          const type = document.getElementById('resource-type').value;
          
          // Add a new resource card
          addNewResource(title, type);
          
          // Close the modal
          closeModal(resourceModal);
          
          // Show success toast
          showToast('Resource Added', 'Your study resource has been saved.', 'success');
      });
  }
  
  // Open modal function
  function openModal(modal) {
      modal.classList.add('visible');
      
      // Trap focus inside modal
      const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      firstElement.focus();
      
      // Prevent scrolling of background
      document.body.style.overflow = 'hidden';
  }
  
  // Close modal function
  function closeModal(modal) {
      modal.classList.remove('visible');
      document.body.style.overflow = '';
  }
  
  // Add new resource function
  function addNewResource(title, type) {
      const resourcesGrid = document.querySelector('.resources-grid');
      
      if (!resourcesGrid) return;
      
      // Determine icon based on type
      let icon = 'book';
      if (type === 'video') icon = 'video';
      if (type === 'website') icon = 'globe';
      if (type === 'document') icon = 'file-pdf';
      
      const resourceCard = document.createElement('a');
      resourceCard.href = '#';
      resourceCard.className = 'resource-card';
      resourceCard.innerHTML = `
          <div class="resource-icon"><i class="fas fa-${icon}" aria-hidden="true"></i></div>
          <h4>${title}</h4>
          <p>Added ${new Date().toLocaleDateString()}</p>
      `;
      
      // Animation for new resource
      resourceCard.style.opacity = '0';
      resourceCard.style.transform = 'scale(0.8)';
      
      resourcesGrid.appendChild(resourceCard);
      
      // Trigger animation
      setTimeout(() => {
          resourceCard.style.opacity = '1';
          resourceCard.style.transform = 'scale(1)';
          resourceCard.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
      }, 50);
  }
}

// Study Timer & Pomodoro
function initStudyTimer() {
  const startBtn = document.getElementById('start-timer');
  const pauseBtn = document.getElementById('pause-timer');
  const resetBtn = document.getElementById('reset-timer');
  const modeToggle = document.getElementById('timer-mode-toggle');
  const minutesDisplay = document.getElementById('timer-minutes');
  const secondsDisplay = document.getElementById('timer-seconds');
  
  if (!startBtn || !pauseBtn || !resetBtn || !modeToggle || !minutesDisplay || !secondsDisplay) return;
  
  let timerInterval;
  let minutes = 25;
  let seconds = 0;
  let isRunning = false;
  let isPaused = false;
  let isPomodoro = false;
  let pomodoroRound = 0;
  
  // Update timer display
  function updateDisplay() {
      minutesDisplay.textContent = minutes.toString().padStart(2, '0');
      secondsDisplay.textContent = seconds.toString().padStart(2, '0');
  }
  
  // Start timer
  startBtn.addEventListener('click', () => {
      if (isRunning) return;
      
      isRunning = true;
      isPaused = false;
      startBtn.disabled = true;
      pauseBtn.disabled = false;
      resetBtn.disabled = false;
      
      // Minute and second calculation
      timerInterval = setInterval(() => {
          if (seconds > 0) {
              seconds--;
          } else if (minutes > 0) {
              minutes--;
              seconds = 59;
          } else {
              // Timer complete
              clearInterval(timerInterval);
              isRunning = false;
              startBtn.disabled = false;
              
              // Play sound
              const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
              audio.play();
              
              if (isPomodoro) {
                  handlePomodoroComplete();
              } else {
                  showToast('Timer Complete', 'Your study session has ended!', 'success');
              }
          }
          
          updateDisplay();
      }, 1000);
  });
  
  // Pause timer
  pauseBtn.addEventListener('click', () => {
      if (!isRunning) return;
      
      if (isPaused) {
          // Resume
          isPaused = false;
          pauseBtn.innerHTML = '<i class="fas fa-pause" aria-hidden="true"></i> Pause';
          
          // Restart the interval
          timerInterval = setInterval(() => {
              if (seconds > 0) {
                  seconds--;
              } else if (minutes > 0) {
                  minutes--;
                  seconds = 59;
              } else {
                  clearInterval(timerInterval);
                  isRunning = false;
                  startBtn.disabled = false;
                  
                  if (isPomodoro) {
                      handlePomodoroComplete();
                  } else {
                      showToast('Timer Complete', 'Your study session has ended!', 'success');
                  }
              }
              
              updateDisplay();
          }, 1000);
      } else {
          // Pause
          isPaused = true;
          pauseBtn.innerHTML = '<i class="fas fa-play" aria-hidden="true"></i> Resume';
          clearInterval(timerInterval);
      }
  });
  
  // Reset timer
  resetBtn.addEventListener('click', () => {
      clearInterval(timerInterval);
      isRunning = false;
      isPaused = false;
      startBtn.disabled = false;
      pauseBtn.disabled = true;
      resetBtn.disabled = true;
      pauseBtn.innerHTML = '<i class="fas fa-pause" aria-hidden="true"></i> Pause';
      
      // Reset to initial time
      if (isPomodoro) {
          minutes = pomodoroRound % 2 === 0 ? 25 : 5;
      } else {
          minutes = 25;
      }
      seconds = 0;
      updateDisplay();
  });
  
  // Toggle Pomodoro mode
  modeToggle.addEventListener('change', () => {
      isPomodoro = modeToggle.checked;
      pomodoroRound = 0;
      
      // Reset timer when changing modes
      clearInterval(timerInterval);
      isRunning = false;
      isPaused = false;
      startBtn.disabled = false;
      pauseBtn.disabled = true;
      resetBtn.disabled = true;
      
      minutes = isPomodoro ? 25 : 25;
      seconds = 0;
      updateDisplay();
      
      showToast(
          isPomodoro ? 'Pomodoro Mode Enabled' : 'Standard Timer Mode', 
          isPomodoro ? 'Work for 25 minutes, then take a 5-minute break.' : 'Timer set for 25 minutes.', 
          'info'
      );
  });
  
  // Handle Pomodoro completion
  function handlePomodoroComplete() {
      pomodoroRound++;
      
      if (pomodoroRound % 2 === 0) {
          // End of break, start work session
          minutes = 25;
          showToast('Break Complete', 'Time to get back to work!', 'success');
      } else {
          // End of work session, start break
          minutes = 5;
          showToast('Pomodoro Complete', 'Great job! Take a 5-minute break.', 'success');
      }
      
      seconds = 0;
      updateDisplay();
      startBtn.disabled = false;
  }
  
  // Initialize display
  updateDisplay();
}

// Personalized greeting
function initGreeting() {
  const greetingElement = document.getElementById('greeting');
  if (!greetingElement) return;
  
  // Get user name from URL params or localStorage
  const urlParams = new URLSearchParams(window.location.search);
  let name = urlParams.get('name') || localStorage.getItem('userName') || '';
  
  if (name) {
      name = decodeURIComponent(name);
      localStorage.setItem('userName', name);
      greetingElement.textContent = `Welcome back, ${name}!`;
  }
  
  // Get time of day for greeting
  const hour = new Date().getHours();
  let greeting = 'Welcome back';
  
  if (hour < 12) {
      greeting = 'Good morning';
  } else if (hour < 18) {
      greeting = 'Good afternoon';
  } else {
      greeting = 'Good evening';
  }
  
  if (name) {
      greetingElement.textContent = `${greeting}, ${name}!`;
  } else {
      greetingElement.textContent = `${greeting}!`;
  }
}

// Current date display
function initCurrentDate() {
  const currentDateEl = document.getElementById('current-date');
  if (!currentDateEl) return;
  
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  currentDateEl.textContent = now.toLocaleDateString(undefined, options);
}

// Task list functionality
function initTaskList() {
  const taskInput = document.getElementById('new-task-input');
  const addTaskBtn = document.getElementById('add-task');
  const taskList = document.getElementById('task-list');
  const toggleCompletedBtn = document.querySelector('.toggle-completed');
  
  if (!taskInput || !addTaskBtn || !taskList) return;
  
  let showCompleted = false;
  
  // Load tasks from localStorage
  loadTasks();
  
  // Add task from input
  addTaskBtn.addEventListener('click', () => {
      addNewTask();
  });
  
  // Add task on Enter key
  taskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
          addNewTask();
      }
  });
  
  // Toggle completed tasks visibility
  if (toggleCompletedBtn) {
      toggleCompletedBtn.addEventListener('click', () => {
          showCompleted = !showCompleted;
          toggleCompletedBtn.textContent = showCompleted ? 'Hide completed' : 'Show completed';
          
          // Update visibility of completed tasks
          document.querySelectorAll('#task-list li').forEach(li => {
              const isCompleted = li.querySelector('input[type="checkbox"]').checked;
              
              if (isCompleted) {
                  li.style.display = showCompleted ? 'flex' : 'none';
              }
          });
      });
  }
  
  // Function to add a new task
  function addNewTask() {
      const taskText = taskInput.value.trim();
      if (taskText === '') return;
      
      // Create task object
      const task = {
          id: Date.now(),
          text: taskText,
          completed: false,
          createdAt: new Date().toISOString()
      };
      
      // Add to DOM
      addTaskToDOM(task);
      
      // Save to localStorage
      saveTask(task);
      
      // Clear input
      taskInput.value = '';
      taskInput.focus();
  }
  
  // Add task to DOM
  function addTaskToDOM(task) {
      const li = document.createElement('li');
      li.dataset.id = task.id;
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.completed;
      checkbox.addEventListener('change', toggleTaskCompletion);
      
      const taskContent = document.createElement('span');
      taskContent.className = 'task-content';
      taskContent.textContent = task.text;
      
      if (task.completed) {
          taskContent.style.textDecoration = 'line-through';
          taskContent.style.opacity = '0.7';
          
          // Hide if showing completed is off
          if (!showCompleted) {
              li.style.display = 'none';
          }
      }
      
      const actions = document.createElement('div');
      actions.className = 'task-actions';
      
      const editBtn = document.createElement('button');
      editBtn.className = 'edit';
      editBtn.innerHTML = '<i class="fas fa-pencil-alt" aria-hidden="true"></i>';
      editBtn.addEventListener('click', editTask);
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete';
      deleteBtn.innerHTML = '<i class="fas fa-trash-alt" aria-hidden="true"></i>';
      deleteBtn.addEventListener('click', deleteTask);
      
      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);
      
      li.appendChild(checkbox);
      li.appendChild(taskContent);
      li.appendChild(actions);
      
      // Apply entrance animation
      li.style.opacity = '0';
      li.style.transform = 'translateX(20px)';
      
      taskList.appendChild(li);
      
      // Trigger animation
      setTimeout(() => {
          li.style.opacity = '1';
          li.style.transform = 'translateX(0)';
      }, 10);
  }
  
  // Toggle task completion
  function toggleTaskCompletion(e) {
      const li = e.target.closest('li');
      const taskId = parseInt(li.dataset.id);
      const taskContent = li.querySelector('.task-content');
      const isCompleted = e.target.checked;
      
      // Update visual style
      if (isCompleted) {
          taskContent.style.textDecoration = 'line-through';
          taskContent.style.opacity = '0.7';
          
          // Hide if showing completed is off
          if (!showCompleted) {
              li.style.opacity = '0';
              li.style.height = '0';
              li.style.margin = '0';
              li.style.padding = '0';
              li.style.overflow = 'hidden';
              
              setTimeout(() => {
                  li.style.display = 'none';
                  li.style.height = '';
                  li.style.margin = '';
                  li.style.padding = '';
                  li.style.overflow = '';
                  li.style.opacity = '1';
              }, 300);
          }
          
          showToast('Task Completed', 'Great job completing your task!', 'success');
      } else {
          taskContent.style.textDecoration = 'none';
          taskContent.style.opacity = '1';
          li.style.display = 'flex';
      }
      
      // Update in localStorage
      updateTaskCompletion(taskId, isCompleted);
  }
  
  // Edit task
  function editTask(e) {
      const li = e.target.closest('li');
      const taskId = parseInt(li.dataset.id);
      const taskContent = li.querySelector('.task-content');
      const currentText = taskContent.textContent;
      
      // Create an input for editing
      const input = document.createElement('input');
      input.type = 'text';
      input.value = currentText;
      input.className = 'edit-task-input';
      input.style.flex = '1';
      input.style.padding = '4px 8px';
      input.style.border = '1px solid var(--primary)';
      input.style.borderRadius = '4px';
      
      // Replace the text with the input
      taskContent.innerHTML = '';
      taskContent.appendChild(input);
      input.focus();
      input.select();
      
      // Save on blur or Enter
      const saveEdit = () => {
          const newText = input.value.trim();
          
          if (newText && newText !== currentText) {
              taskContent.textContent = newText;
              updateTaskText(taskId, newText);
              showToast('Task Updated', 'Your task has been updated.', 'info');
          } else {
              taskContent.textContent = currentText;
          }
      };
      
      input.addEventListener('blur', saveEdit);
      input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
              saveEdit();
          }
      });
  }
  
  // Delete task
  function deleteTask(e) {
      const li = e.target.closest('li');
      const taskId = parseInt(li.dataset.id);
      
      // Animation
      li.style.opacity = '0';
      li.style.height = `${li.offsetHeight}px`;
      li.style.paddingTop = '0';
      li.style.paddingBottom = '0';
      li.style.marginTop = '0';
      li.style.marginBottom = '0';
      
      setTimeout(() => {
          li.style.height = '0';
          
          setTimeout(() => {
              li.remove();
              removeTask(taskId);
              showToast('Task Removed', 'Your task has been deleted.', 'info');
          }, 300);
      }, 300);
  }
  
  // Save task to localStorage
  function saveTask(task) {
      let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      tasks.push(task);
      localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  
  // Load tasks from localStorage
  function loadTasks() {
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      
      // Sort by completion status and creation date
      tasks.sort((a, b) => {
          if (a.completed === b.completed) {
              return new Date(b.createdAt) - new Date(a.createdAt);
          }
          return a.completed ? 1 : -1;
      });
      
      tasks.forEach(task => {
          addTaskToDOM(task);
      });
  }
  
  // Update task completion in localStorage
  function updateTaskCompletion(taskId, completed) {
      let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      const taskIndex = tasks.findIndex(task => task.id === taskId);
      
      if (taskIndex !== -1) {
          tasks[taskIndex].completed = completed;
          localStorage.setItem('tasks', JSON.stringify(tasks));
      }
  }
  
  // Update task text in localStorage
  function updateTaskText(taskId, newText) {
      let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      const taskIndex = tasks.findIndex(task => task.id === taskId);
      
      if (taskIndex !== -1) {
          tasks[taskIndex].text = newText;
          localStorage.setItem('tasks', JSON.stringify(tasks));
      }
  }
  
  // Remove task from localStorage
  function removeTask(taskId) {
      let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      tasks = tasks.filter(task => task.id !== taskId);
      localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  
  // Add some starter tasks if empty
  if (taskList.children.length === 0) {
      setTimeout(() => {
          if (taskList.children.length === 0) {
              const starterTasks = [
                  'Complete physics homework',
                  'Read chapter 5 of textbook',
                  'Prepare for tomorrow\'s quiz'
              ];
              
              starterTasks.forEach((text, index) => {
                  setTimeout(() => {
                      taskInput.value = text;
                      addNewTask();
                  }, index * 500);
              });
          }
      }, 1000);
  }
}

// Notes functionality
function initNotes() {
  const noteInput = document.getElementById('note-input');
  const saveNoteBtn = document.getElementById('save-note');
  const clearNoteBtn = document.getElementById('clear-note');
  const displayedNotes = document.getElementById('displayed-notes');
  const clearAllNotesBtn = document.getElementById('clear-all-notes');
  
  // Formatting buttons
  const boldBtn = document.getElementById('format-bold');
  const italicBtn = document.getElementById('format-italic');
  const listBtn = document.getElementById('format-list');
  
  if (!noteInput || !saveNoteBtn || !displayedNotes) return;
  
  // Load notes from localStorage
  loadNotes();
  
  // Save note
  saveNoteBtn.addEventListener('click', saveNote);
  
  // Clear current note
  if (clearNoteBtn) {
      clearNoteBtn.addEventListener('click', () => {
          noteInput.value = '';
          noteInput.focus();
      });
  }
  
  // Clear all notes
  if (clearAllNotesBtn) {
      clearAllNotesBtn.addEventListener('click', () => {
          if (confirm('Are you sure you want to clear all notes?')) {
              displayedNotes.innerHTML = '';
              localStorage.removeItem('notes');
              showToast('Notes Cleared', 'All notes have been deleted.', 'info');
          }
      });
  }
  
  // Keyboard shortcut for saving (Ctrl+Enter)
  noteInput.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
          saveNote();
      }
  });
  
  // Text formatting buttons
  if (boldBtn) {
      boldBtn.addEventListener('click', () => {
          insertFormat('**', '**');
      });
  }
  
  if (italicBtn) {
      italicBtn.addEventListener('click', () => {
          insertFormat('*', '*');
      });
  }
  
  if (listBtn) {
      listBtn.addEventListener('click', () => {
          insertListItem();
      });
  }
  
  // Save note function
  function saveNote() {
      const noteText = noteInput.value.trim();
      
      if (noteText === '') return;
      
      // Create note object
      const note = {
          id: Date.now(),
          text: noteText,
          createdAt: new Date().toLocaleString()
      };
      
      // Add to DOM
      addNoteToDOM(note);
      
      // Save to localStorage
      saveNoteToStorage(note);
      
      // Clear input
      noteInput.value = '';
      noteInput.focus();
      
      showToast('Note Saved', 'Your note has been saved successfully.', 'success');
  }
  
  // Add note to DOM
  function addNoteToDOM(note) {
      const noteElement = document.createElement('p');
      
      // Simple markdown parsing
      const formattedText = parseMarkdown(note.text);
      
      noteElement.innerHTML = formattedText;
      noteElement.dataset.id = note.id;
      
      // Add timestamp
      const timestamp = document.createElement('small');
      timestamp.style.display = 'block';
      timestamp.style.marginTop = '8px';
      timestamp.style.color = 'var(--medium)';
      timestamp.style.fontStyle = 'italic';
      timestamp.textContent = note.createdAt;
      
      noteElement.appendChild(timestamp);
      
      // Double-click to delete
      noteElement.addEventListener('dblclick', () => {
          deleteNote(note.id, noteElement);
      });
      
      // Initial state for animation
      noteElement.style.opacity = '0';
      noteElement.style.transform = 'translateY(20px)';
      
      displayedNotes.prepend(noteElement);
      
      // Trigger animation
      setTimeout(() => {
          noteElement.style.opacity = '1';
          noteElement.style.transform = 'translateY(0)';
      }, 10);
  }
  
  // Delete note
  function deleteNote(id, element) {
      // Animation
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
          element.remove();
          
          // Remove from localStorage
          let notes = JSON.parse(localStorage.getItem('notes')) || [];
          notes = notes.filter(note => note.id !== id);
          localStorage.setItem('notes', JSON.stringify(notes));
          
          showToast('Note Deleted', 'Your note has been removed.', 'info');
      }, 300);
  }
  
  // Save note to localStorage
  function saveNoteToStorage(note) {
      let notes = JSON.parse(localStorage.getItem('notes')) || [];
      notes.unshift(note); // Add to beginning
      localStorage.setItem('notes', JSON.stringify(notes));
  }
  
  // Load notes from localStorage
  function loadNotes() {
      const notes = JSON.parse(localStorage.getItem('notes')) || [];
      
      notes.forEach((note, index) => {
          setTimeout(() => {
              addNoteToDOM(note);
          }, index * 100); // Staggered animation
      });
  }
  
  // Insert formatting into the note input
  function insertFormat(start, end) {
      const startPos = noteInput.selectionStart;
      const endPos = noteInput.selectionEnd;
      const selectedText = noteInput.value.substring(startPos, endPos);
      const beforeText = noteInput.value.substring(0, startPos);
      const afterText = noteInput.value.substring(endPos);
      
      // If text is selected, wrap it with format tags
      if (selectedText) {
          noteInput.value = beforeText + start + selectedText + end + afterText;
          noteInput.selectionStart = startPos + start.length;
          noteInput.selectionEnd = endPos + start.length;
      } else {
          // If no text is selected, just insert the tags
          noteInput.value = beforeText + start + end + afterText;
          noteInput.selectionStart = startPos + start.length;
      }
      
      noteInput.focus();
  }
  
  // Insert a list item
  function insertListItem() {
      const pos = noteInput.selectionStart;
      const text = noteInput.value;
      
      // Find the start of the current line
      let lineStart = pos;
      while (lineStart > 0 && text[lineStart - 1] !== '\n') {
          lineStart--;
      }
      
      // Insert list item marker at the start of the line
      const beforeText = text.substring(0, lineStart);
      const currentLine = text.substring(lineStart, pos);
      const afterText = text.substring(pos);
      
      // If line already has a list marker, remove it (toggle behavior)
      if (currentLine.startsWith('- ')) {
          noteInput.value = beforeText + currentLine.substring(2) + afterText;
          noteInput.selectionStart = pos - 2;
          noteInput.selectionEnd = pos - 2;
      } else {
          noteInput.value = beforeText + '- ' + currentLine + afterText;
          noteInput.selectionStart = pos + 2;
          noteInput.selectionEnd = pos + 2;
      }
      
      noteInput.focus();
  }
  
  // Simple markdown parser
  function parseMarkdown(text) {
      // Bold text: **text** -> <strong>text</strong>
      text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      // Italic text: *text* -> <em>text</em>
      text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
      
      // List items: - item -> • item with bullet
      text = text.replace(/^- (.*)/gm, '• $1');
      
      // Automatic links
      text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
      
      // New lines
      text = text.replace(/\n/g, '<br>');
      
      return text;
  }
  
  // Add a sample note if there are no notes
  if (displayedNotes.children.length === 0) {
      setTimeout(() => {
          if (displayedNotes.children.length === 0) {
              const sampleNote = {
                  id: Date.now(),
                  text: "**Important Exam Tips:**\n- Review chapter summaries\n- Create flashcards for key concepts\n- Practice with past-year questions\n\nDon't forget to join the study group tomorrow!",
                  createdAt: new Date().toLocaleString()
              };
              
              addNoteToDOM(sampleNote);
              saveNoteToStorage(sampleNote);
          }
      }, 1000);
  }
}

// Motivational quotes
function initQuotes() {
  const quoteElement = document.getElementById('daily-quote');
  const authorElement = document.getElementById('quote-author');
  const newQuoteButton = document.getElementById('new-quote');
  
  if (!quoteElement || !authorElement) return;
  
  const quotes = [
      {
          text: "The secret of getting ahead is getting started. The secret of getting started is breaking your complex overwhelming tasks into small manageable tasks, and then starting on the first one.",
          author: "Mark Twain"
      },
      {
          text: "Education is the most powerful weapon which you can use to change the world.",
          author: "Nelson Mandela"
      },
      {
          text: "The beautiful thing about learning is that nobody can take it away from you.",
          author: "B.B. King"
      },
      {
          text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
          author: "Dr. Seuss"
      },
      {
          text: "It does not matter how slowly you go as long as you do not stop.",
          author: "Confucius"
      },
      {
          text: "Success is no accident. It is hard work, perseverance, learning, studying, sacrifice and most of all, love of what you are doing.",
          author: "Pelé"
      },
      {
          text: "The expert in anything was once a beginner.",
          author: "Helen Hayes"
      },
      {
          text: "The future belongs to those who believe in the beauty of their dreams.",
          author: "Eleanor Roosevelt"
      }
  ];
  
  // Show a random quote
  function showRandomQuote() {
      // Fade out
      quoteElement.style.opacity = '0';
      authorElement.style.opacity = '0';
      
      setTimeout(() => {
          const randomIndex = Math.floor(Math.random() * quotes.length);
          const quote = quotes[randomIndex];
          
          quoteElement.textContent = quote.text;
          authorElement.textContent = `— ${quote.author}`;
          
          // Fade in
          quoteElement.style.opacity = '1';
          authorElement.style.opacity = '1';
      }, 500);
  }
  
  // Set quote on page load
  if (quoteElement.textContent.trim() === "" || authorElement.textContent.trim() === "") {
      showRandomQuote();
  }
  
  // New quote button
  if (newQuoteButton) {
      newQuoteButton.addEventListener('click', showRandomQuote);
  }
}

// Progress bar animations
function initProgressBars() {
  const progressBars = document.querySelectorAll('.progress-bar-fill');
  
  progressBars.forEach(bar => {
      const width = bar.getAttribute('data-width') || bar.style.width || '0%';
      
      // Reset width to 0 initially
      bar.style.width = '0%';
      
      // Create a threshold function to check if element is in viewport
      const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {if (entry.isIntersecting) {
            // Element is in viewport, animate the progress bar
            setTimeout(() => {
                bar.style.width = width;
            }, 300);
            
            // Unobserve after animation
            observer.unobserve(bar);
        }
    });
}, { threshold: 0.2 });

// Start observing
observer.observe(bar);
});
}

// Toast notification system
function showToast(title, message, type = 'primary') {
// Create toast container if it doesn't exist
let toastContainer = document.querySelector('.toast-container');

if (!toastContainer) {
toastContainer = document.createElement('div');
toastContainer.className = 'toast-container';
toastContainer.setAttribute('aria-live', 'polite');
document.body.appendChild(toastContainer);
}

// Create toast element
const toast = document.createElement('div');
toast.className = `toast toast-${type}`;

// Set icon based on type
let icon = 'info-circle';
if (type === 'success') icon = 'check-circle';
if (type === 'warning') icon = 'exclamation-triangle';
if (type === 'error') icon = 'times-circle';

toast.innerHTML = `
<i class="fas fa-${icon}" aria-hidden="true"></i>
<div class="toast-content">
    <div class="toast-title">${title}</div>
    <div class="toast-message">${message}</div>
</div>
<button class="toast-close" aria-label="Close notification">
    <i class="fas fa-times" aria-hidden="true"></i>
</button>
`;

toastContainer.appendChild(toast);

// Show animation
setTimeout(() => {
toast.classList.add('show');

// Accessibility focus
toast.setAttribute('role', 'alert');
toast.setAttribute('aria-live', 'assertive');
}, 10);

// Close button functionality
const closeBtn = toast.querySelector('.toast-close');
if (closeBtn) {
closeBtn.addEventListener('click', () => {
    closeToast(toast);
});
}

// Auto-close after 5 seconds
setTimeout(() => {
closeToast(toast);
}, 5000);

// Helper function to close toast with animation
function closeToast(toastElement) {
toastElement.classList.remove('show');

// Remove after animation completes
setTimeout(() => {
    if (toastElement.parentElement) {
        toastElement.parentElement.removeChild(toastElement);
    }
    
    // Remove container if empty
    if (toastContainer.children.length === 0) {
        toastContainer.remove();
    }
}, 300);
}

return toast;
}

// Scroll animations
function initScrollAnimations() {
const animatedElements = document.querySelectorAll('.overview-card, .schedule-section, .todo-section, .notes-section, .notes-display-section, .resources-section, .motivation-section');

const observer = new IntersectionObserver((entries) => {
entries.forEach(entry => {
    if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
    }
});
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

animatedElements.forEach(element => {
// Set initial state if not already animated
if (element.style.opacity !== '1') {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(element);
}
});
}

// Analytics data visualization (mock data)
function initAnalytics() {
// This would integrate with an actual charting library like Chart.js
// For this example, we'll just create a placeholder
const analyticsSection = document.querySelector('.analytics-section');
if (!analyticsSection) return;

// Create a canvas for the chart
const canvas = document.createElement('canvas');
canvas.id = 'study-analytics';
canvas.width = 400;
canvas.height = 200;
analyticsSection.appendChild(canvas);

// Mock chart drawing - in a real application, would use Chart.js or similar
try {
const ctx = canvas.getContext('2d');

// Background
ctx.fillStyle = '#f4f8ff';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Chart title
ctx.fillStyle = '#007bff';
ctx.font = 'bold 14px Poppins, sans-serif';
ctx.fillText('Weekly Study Hours', 20, 30);

// X-axis
ctx.strokeStyle = '#dee2e6';
ctx.beginPath();
ctx.moveTo(40, 160);
ctx.lineTo(380, 160);
ctx.stroke();

// Y-axis
ctx.beginPath();
ctx.moveTo(40, 40);
ctx.lineTo(40, 160);
ctx.stroke();

// Data (mock study hours for 7 days)
const data = [2, 3.5, 1, 4.5, 3, 5, 2.5];

// Draw bars
const barWidth = 40;
const spacing = 10;
const max = Math.max(...data);
const scale = 100 / max;

for (let i = 0; i < data.length; i++) {
    const x = 60 + i * (barWidth + spacing);
    const height = data[i] * scale;
    const y = 160 - height;
    
    // Bar gradient
    const gradient = ctx.createLinearGradient(x, y, x, 160);
    gradient.addColorStop(0, '#007bff');
    gradient.addColorStop(1, '#cce5ff');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, barWidth, height);
    
    // Day label
    ctx.fillStyle = '#555';
    ctx.font = '12px Poppins, sans-serif';
    ctx.fillText(['M', 'T', 'W', 'T', 'F', 'S', 'S'][i], x + barWidth/2 - 5, 175);
}
} catch (e) {
console.error('Error creating analytics chart:', e);
}
}

// Keyboard shortcuts
function initKeyboardShortcuts() {
// Add global keyboard shortcuts
document.addEventListener('keydown', (e) => {
// Ctrl+/ - Show help modal with keyboard shortcuts
if (e.ctrlKey && e.key === '/') {
    e.preventDefault();
    showHelpModal();
}

// Ctrl+D - Toggle dark mode
if (e.ctrlKey && e.key === 'd') {
    e.preventDefault();
    const htmlElement = document.documentElement;
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update theme toggle button
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.innerHTML = newTheme === 'dark' 
            ? '<i class="fas fa-sun" aria-hidden="true"></i>' 
            : '<i class="fas fa-moon" aria-hidden="true"></i>';
    }
    
    showToast(
        newTheme === 'dark' ? 'Dark Mode Enabled' : 'Light Mode Enabled', 
        'Keyboard shortcut: Ctrl+D',
        'info'
    );
}

// Ctrl+T - Focus on timer
if (e.ctrlKey && e.key === 't') {
    e.preventDefault();
    const startTimerBtn = document.getElementById('start-timer');
    if (startTimerBtn) {
        startTimerBtn.focus();
        showToast('Timer Selected', 'Keyboard shortcut: Ctrl+T', 'info');
    }
}

// Ctrl+N - Focus on new task input
if (e.ctrlKey && e.key === 'n') {
    e.preventDefault();
    const taskInput = document.getElementById('new-task-input');
    if (taskInput) {
        taskInput.focus();
        showToast('Add Task Selected', 'Keyboard shortcut: Ctrl+N', 'info');
    }
}
});

// Show help modal with keyboard shortcuts
function showHelpModal() {
// Check if modal already exists
let helpModal = document.getElementById('keyboard-shortcuts-modal');

if (!helpModal) {
    // Create modal
    helpModal = document.createElement('div');
    helpModal.id = 'keyboard-shortcuts-modal';
    helpModal.className = 'modal-container';
    
    helpModal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>Keyboard Shortcuts</h3>
                <button class="modal-close" aria-label="Close modal">
                    <i class="fas fa-times" aria-hidden="true"></i>
                </button>
            </div>
            <div class="modal-body">
                <table style="width: 100%;">
                    <thead>
                        <tr>
                            <th style="text-align: left;">Shortcut</th>
                            <th style="text-align: left;">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><kbd>Ctrl</kbd> + <kbd>/</kbd></td>
                            <td>Show this help dialog</td>
                        </tr>
                        <tr>
                            <td><kbd>Ctrl</kbd> + <kbd>D</kbd></td>
                            <td>Toggle dark/light mode</td>
                        </tr>
                        <tr>
                            <td><kbd>Ctrl</kbd> + <kbd>T</kbd></td>
                            <td>Focus on timer</td>
                        </tr>
                        <tr>
                            <td><kbd>Ctrl</kbd> + <kbd>N</kbd></td>
                            <td>Add new task</td>
                        </tr>
                        <tr>
                            <td><kbd>Ctrl</kbd> + <kbd>Enter</kbd></td>
                            <td>Save current note</td>
                        </tr>
                        <tr>
                            <td><kbd>Esc</kbd></td>
                            <td>Close dialog/modal</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    document.body.appendChild(helpModal);
    
    // Close button functionality
    const closeBtn = helpModal.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            helpModal.classList.remove('visible');
            setTimeout(() => {
                helpModal.remove();
            }, 300);
        });
    }
    
    // Close on Escape key
    helpModal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            helpModal.classList.remove('visible');
            setTimeout(() => {
                helpModal.remove();
            }, 300);
        }
    });
    
    // Close on outside click
    helpModal.addEventListener('click', (e) => {
        if (e.target === helpModal) {
            helpModal.classList.remove('visible');
            setTimeout(() => {
                helpModal.remove();
            }, 300);
        }
    });
}

// Show modal with animation
setTimeout(() => {
    helpModal.classList.add('visible');
}, 10);

// Focus on the modal for keyboard navigation
const modalContent = helpModal.querySelector('.modal');
if (modalContent) {
    modalContent.setAttribute('tabindex', '-1');
    modalContent.focus();
}
}
}

// Initialize everything when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
// Core initialization functions
initHeader();
initThemeToggle();
initNotifications();
initModals();
initStudyTimer();
initGreeting();
initCurrentDate();
initTaskList();
initNotes();
initQuotes();
initProgressBars();
initScrollAnimations();
initKeyboardShortcuts();

// Optional features that might not be on all pages
if (document.querySelector('.analytics-section')) {
initAnalytics();
}

// Show welcome toast with delay
setTimeout(() => {
showToast('Welcome Back!', 'Your study dashboard is ready.', 'info');
}, 1500);

// Log to console
console.log('Delta Students Dashboard initialized successfully!');
});