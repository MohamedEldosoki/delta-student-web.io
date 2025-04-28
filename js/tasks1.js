/**
 * Delta Students Productivity Tools
 * Advanced implementation with sound support, state management, and localStorage persistence
 */

// Main application module using IIFE pattern for encapsulation
const ProductivityApp = (function() {
          'use strict';
          
          // Configuration
          const config = {
              sounds: {
                  timerComplete: 'assets/sounds/timer-complete.mp3',
                  buttonClick: 'assets/sounds/button-click.mp3',
                  notification: 'assets/sounds/notification.mp3',
                  taskAdded: 'assets/sounds/task-added.mp3',
                  taskCompleted: 'assets/sounds/task-completed.mp3'
              },
              defaultTimerDuration: 25,
              defaultBreakDuration: 5,
              storageKeys: {
                  matrixTasks: 'delta_matrix_tasks',
                  smartGoals: 'delta_smart_goals',
                  timerSettings: 'delta_timer_settings',
                  pomodoroCycles: 'delta_pomodoro_cycles'
              }
          };
          
          // DOM elements - store references to avoid repeated DOM queries
          let elements = {};
          
          // State management
          const state = {
              timer: {
                  minutes: config.defaultTimerDuration,
                  seconds: 0,
                  isRunning: false,
                  isPaused: false,
                  isBreak: false,
                  totalSeconds: config.defaultTimerDuration * 60,
                  remainingSeconds: config.defaultTimerDuration * 60,
                  interval: null,
                  startTime: null,
                  pausedTime: 0,
                  cycles: 0
              },
              sound: {
                  enabled: true,
                  volume: 0.7
              },
              notifications: {
                  isOpen: false
              },
              mobileMenu: {
                  isOpen: false
              }
          };
          
          /**
           * Sound Manager Module
           * Handles loading and playing sounds with error handling
           */
          const SoundManager = (function() {
              const soundCache = {};
              
              // Preload sounds for better performance
              function preloadSounds() {
                  Object.keys(config.sounds).forEach(key => {
                      loadSound(key, config.sounds[key]);
                  });
              }
              
              function loadSound(name, url) {
                  try {
                      const audio = new Audio(url);
                      audio.preload = 'auto';
                      soundCache[name] = audio;
                      return true;
                  } catch (error) {
                      console.error(`Failed to load sound: ${name}`, error);
                      return false;
                  }
              }
              
              function play(name) {
                  if (!state.sound.enabled) return;
                  
                  try {
                      if (!soundCache[name]) {
                          loadSound(name, config.sounds[name]);
                      }
                      
                      const sound = soundCache[name];
                      if (sound) {
                          sound.volume = state.sound.volume;
                          sound.currentTime = 0;
                          
                          // Return the promise to allow chaining
                          return sound.play().catch(error => {
                              // Autoplay might be blocked or other playback error
                              console.warn(`Sound playback failed: ${name}`, error);
                          });
                      }
                  } catch (error) {
                      console.error(`Error playing sound: ${name}`, error);
                  }
              }
              
              function setVolume(level) {
                  state.sound.volume = Math.max(0, Math.min(1, level));
                  
                  // Update volume for all cached sounds
                  Object.values(soundCache).forEach(sound => {
                      sound.volume = state.sound.volume;
                  });
              }
              
              function toggleMute() {
                  state.sound.enabled = !state.sound.enabled;
                  return state.sound.enabled;
              }
              
              return {
                  preloadSounds,
                  play,
                  setVolume,
                  toggleMute
              };
          })();
          
          /**
           * Storage Manager Module
           * Handles saving and retrieving data from localStorage with error handling
           */
          const StorageManager = (function() {
              function save(key, data) {
                  try {
                      const serialized = JSON.stringify(data);
                      localStorage.setItem(key, serialized);
                      return true;
                  } catch (error) {
                      console.error(`Failed to save data for key: ${key}`, error);
                      return false;
                  }
              }
              
              function load(key, defaultValue = null) {
                  try {
                      const serialized = localStorage.getItem(key);
                      return serialized ? JSON.parse(serialized) : defaultValue;
                  } catch (error) {
                      console.error(`Failed to load data for key: ${key}`, error);
                      return defaultValue;
                  }
              }
              
              function remove(key) {
                  try {
                      localStorage.removeItem(key);
                      return true;
                  } catch (error) {
                      console.error(`Failed to remove data for key: ${key}`, error);
                      return false;
                  }
              }
              
              return {
                  save,
                  load,
                  remove
              };
          })();
          
          /**
           * UI Manager Module
           * Handles UI updates and animations
           */
          const UIManager = (function() {
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
                  toast.setAttribute('role', 'alert');
                  
                  // Add icon based on type
                  let icon = 'info-circle';
                  if (type === 'success') icon = 'check-circle';
                  if (type === 'warning') icon = 'exclamation-triangle';
                  if (type === 'error') icon = 'exclamation-circle';
                  
                  toast.innerHTML = `
                      <div class="toast-content">
                          <i class="fas fa-${icon}"></i>
                          <span>${message}</span>
                      </div>
                      <button class="toast-close" aria-label="Close notification">
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
                      closeToast(toast);
                  });
                  
                  // Auto close after duration
                  const timeoutId = setTimeout(() => {
                      closeToast(toast);
                  }, duration);
                  
                  // Store timeout ID
                  toast.dataset.timeoutId = timeoutId;
                  
                  function closeToast(toastElement) {
                      // Clear timeout if it exists
                      if (toastElement.dataset.timeoutId) {
                          clearTimeout(parseInt(toastElement.dataset.timeoutId));
                      }
                      
                      // Animate out
                      toastElement.classList.remove('show');
                      
                      // Remove after animation
                      setTimeout(() => {
                          if (toastElement.parentNode) {
                              toastElement.parentNode.removeChild(toastElement);
                          }
                      }, 300);
                  }
                  
                  return toast;
              }
              
              function formatTime(minutes, seconds) {
                  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
              }
              
              function updateTimerDisplay(minutes, seconds) {
                  if (elements.timerMinutes && elements.timerSeconds) {
                      elements.timerMinutes.textContent = String(minutes).padStart(2, '0');
                      elements.timerSeconds.textContent = String(seconds).padStart(2, '0');
                  }
              }
              
              function updateProgressBar(percentage) {
                  if (elements.progressBar) {
                      elements.progressBar.style.width = `${percentage}%`;
                      
                      // Update colors based on percentage for visual feedback
                      if (percentage < 30) {
                          elements.progressBar.style.backgroundColor = 'var(--success)';
                      } else if (percentage < 70) {
                          elements.progressBar.style.backgroundColor = 'var(--warning)';
                      } else {
                          elements.progressBar.style.backgroundColor = 'var(--danger)';
                      }
                  }
              }
              
              function createTaskElement(text, quadrant) {
                  const li = document.createElement('li');
                  
                  const span = document.createElement('span');
                  span.textContent = text;
                  li.appendChild(span);
                  
                  // Add control buttons
                  const controls = document.createElement('div');
                  controls.className = 'task-controls';
                  
                  // Complete button
                  const completeBtn = document.createElement('button');
                  completeBtn.innerHTML = '<i class="fas fa-check"></i>';
                  completeBtn.title = 'Mark as completed';
                  completeBtn.className = 'complete-btn';
                  completeBtn.addEventListener('click', function(e) {
                      e.stopPropagation();
                      li.classList.toggle('completed');
                      SoundManager.play('taskCompleted');
                      
                      // Save state after changes
                      saveMatrixTasks();
                  });
                  controls.appendChild(completeBtn);
                  
                  // Delete button
                  const deleteBtn = document.createElement('button');
                  deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
                  deleteBtn.title = 'Delete task';
                  deleteBtn.className = 'delete-btn';
                  deleteBtn.addEventListener('click', function(e) {
                      e.stopPropagation();
                      // Animation before removal
                      li.classList.add('removing');
                      setTimeout(() => {
                          li.remove();
                          saveMatrixTasks();
                      }, 300);
                  });
                  controls.appendChild(deleteBtn);
                  
                  li.appendChild(controls);
                  
                  // Double click to edit
                  li.addEventListener('dblclick', function() {
                      const currentText = span.textContent;
                      
                      // Create edit form
                      const form = document.createElement('form');
                      const input = document.createElement('input');
                      input.type = 'text';
                      input.value = currentText;
                      input.className = 'edit-task-input';
                      
                      form.appendChild(input);
                      li.innerHTML = '';
                      li.appendChild(form);
                      
                      // Focus the input
                      input.focus();
                      
                      // Handle form submission
                      form.addEventListener('submit', function(e) {
                          e.preventDefault();
                          const newText = input.value.trim();
                          
                          if (newText) {
                              // Recreate the list item with new text
                              li.innerHTML = '';
                              const newSpan = document.createElement('span');
                              newSpan.textContent = newText;
                              li.appendChild(newSpan);
                              li.appendChild(controls);
                              
                              // Save changes
                              saveMatrixTasks();
                          } else {
                              // If empty, remove the task
                              li.remove();
                              saveMatrixTasks();
                          }
                      });
                      
                      // Handle blur event
                      input.addEventListener('blur', function() {
                          form.dispatchEvent(new Event('submit'));
                      });
                      
                      // Handle Escape key to cancel editing
                      input.addEventListener('keydown', function(e) {
                          if (e.key === 'Escape') {
                              li.innerHTML = '';
                              const newSpan = document.createElement('span');
                              newSpan.textContent = currentText;
                              li.appendChild(newSpan);
                              li.appendChild(controls);
                          }
                      });
                  });
                  
                  return li;
              }
              
              function createGoalElement(title, details) {
                  const li = document.createElement('li');
                  li.className = 'goal-item';
                  
                  // Progress tracking
                  const progressContainer = document.createElement('div');
                  progressContainer.className = 'goal-progress';
                  
                  const progressBar = document.createElement('div');
                  progressBar.className = 'progress-bar';
                  
                  const progressFill = document.createElement('div');
                  progressFill.className = 'progress-bar-fill';
                  progressFill.style.width = '0%';
                  
                  progressBar.appendChild(progressFill);
                  progressContainer.appendChild(progressBar);
                  
                  const progressValue = document.createElement('span');
                  progressValue.className = 'progress-value';
                  progressValue.textContent = '0%';
                  progressContainer.appendChild(progressValue);
                  
                  // Goal content
                  const content = document.createElement('div');
                  content.className = 'goal-content';
                  
                  const titleEl = document.createElement('h4');
                  titleEl.textContent = title;
                  content.appendChild(titleEl);
                  
                  if (details) {
                      const detailsEl = document.createElement('p');
                      detailsEl.textContent = details;
                      content.appendChild(detailsEl);
                  }
                  
                  // Goal controls
                  const controls = document.createElement('div');
                  controls.className = 'goal-controls';
                  
                  const progressInput = document.createElement('input');
                  progressInput.type = 'range';
                  progressInput.min = '0';
                  progressInput.max = '100';
                  progressInput.value = '0';
                  progressInput.className = 'progress-slider';
                  progressInput.addEventListener('input', function() {
                      const value = this.value;
                      progressFill.style.width = `${value}%`;
                      progressValue.textContent = `${value}%`;
                      
                      // Update class based on progress
                      li.classList.remove('not-started', 'in-progress', 'completed');
                      if (value < 1) {
                          li.classList.add('not-started');
                      } else if (value < 100) {
                          li.classList.add('in-progress');
                      } else {
                          li.classList.add('completed');
                          SoundManager.play('taskCompleted');
                      }
                      
                      // Save state
                      saveGoals();
                  });
                  controls.appendChild(progressInput);
                  
                  const deleteBtn = document.createElement('button');
                  deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
                  deleteBtn.className = 'delete-btn';
                  deleteBtn.title = 'Delete goal';
                  deleteBtn.addEventListener('click', function() {
                      // Animation before removal
                      li.classList.add('removing');
                      setTimeout(() => {
                          li.remove();
                          saveGoals();
                      }, 300);
                  });
                  controls.appendChild(deleteBtn);
                  
                  // Assemble the goal item
                  li.appendChild(progressContainer);
                  li.appendChild(content);
                  li.appendChild(controls);
                  
                  return li;
              }
              
              return {
                  showToast,
                  formatTime,
                  updateTimerDisplay,
                  updateProgressBar,
                  createTaskElement,
                  createGoalElement
              };
          })();
          
          /**
           * Pomodoro Timer Module
           * Handles timer functionality
           */
          const PomodoroTimer = (function() {
              function initialize() {
                  // Load saved settings
                  const savedSettings = StorageManager.load(config.storageKeys.timerSettings, {
                      workDuration: config.defaultTimerDuration,
                      breakDuration: config.defaultBreakDuration,
                      sound: 'sound1.mp3'
                  });
                  
                  // Apply saved settings
                  if (elements.workDuration) {
                      elements.workDuration.value = savedSettings.workDuration;
                  }
                  
                  if (elements.breakDuration) {
                      elements.breakDuration.value = savedSettings.breakDuration;
                  }
                  
                  if (elements.soundSelect) {
                      elements.soundSelect.value = savedSettings.sound;
                  }
                  
                  // Set initial state
                  state.timer.minutes = savedSettings.workDuration;
                  state.timer.seconds = 0;
                  state.timer.totalSeconds = savedSettings.workDuration * 60;
                  state.timer.remainingSeconds = savedSettings.workDuration * 60;
                  
                  // Display initial time
                  UIManager.updateTimerDisplay(state.timer.minutes, state.timer.seconds);
                  
                  // Load previous cycles
                  state.timer.cycles = StorageManager.load(config.storageKeys.pomodoroCycles, 0);
                  updateCyclesDisplay();
              }
              
              function startTimer() {
                  if (state.timer.isRunning) return;
                  
                  SoundManager.play('buttonClick');
                  
                  // Update state
                  state.timer.isRunning = true;
                  state.timer.isPaused = false;
                  
                  // Record start time accounting for previously elapsed time
                  state.timer.startTime = Date.now() - (state.timer.pausedTime * 1000);
                  
                  // Update UI
                  updateButtonStates();
                  
                  // Start the interval
                  state.timer.interval = setInterval(updateTimer, 100); // More frequent updates for smoother progress
                  
                  // Notification
                  UIManager.showToast(`Timer started: ${state.timer.isBreak ? 'Break time' : 'Focus time'}`, 'info');
              }
              
              function pauseTimer() {
                  if (!state.timer.isRunning || state.timer.isPaused) return;
                  
                  SoundManager.play('buttonClick');
                  
                  // Clear interval
                  clearInterval(state.timer.interval);
                  
                  // Update state
                  state.timer.isPaused = true;
                  state.timer.pausedTime = (Date.now() - state.timer.startTime) / 1000;
                  
                  // Update UI
                  updateButtonStates();
                  
                  // Notification
                  UIManager.showToast('Timer paused', 'warning');
              }
              
              function resumeTimer() {
                  if (!state.timer.isPaused) return;
                  
                  SoundManager.play('buttonClick');
                  
                  // Update state
                  state.timer.isPaused = false;
                  state.timer.startTime = Date.now() - (state.timer.pausedTime * 1000);
                  
                  // Start the interval
                  state.timer.interval = setInterval(updateTimer, 100);
                  
                  // Update UI
                  updateButtonStates();
                  
                  // Notification
                  UIManager.showToast('Timer resumed', 'info');
              }
              
              function resetTimer() {
                  SoundManager.play('buttonClick');
                  
                  // Clear interval
                  clearInterval(state.timer.interval);
                  
                  // Reset time to the current mode (work or break)
                  if (state.timer.isBreak) {
                      const breakDuration = parseInt(elements.breakDuration.value) || config.defaultBreakDuration;
                      state.timer.minutes = breakDuration;
                      state.timer.totalSeconds = breakDuration * 60;
                  } else {
                      const workDuration = parseInt(elements.workDuration.value) || config.defaultTimerDuration;
                      state.timer.minutes = workDuration;
                      state.timer.totalSeconds = workDuration * 60;
                  }
                  
                  // Reset state
                  state.timer.seconds = 0;
                  state.timer.isRunning = false;
                  state.timer.isPaused = false;
                  state.timer.remainingSeconds = state.timer.totalSeconds;
                  state.timer.pausedTime = 0;
                  
                  // Update UI
                  UIManager.updateTimerDisplay(state.timer.minutes, state.timer.seconds);
                  UIManager.updateProgressBar(0);
                  updateButtonStates();
                  
                  // Notification
                  UIManager.showToast('Timer reset', 'info');
              }
              
              function updateTimer() {
                  // Calculate elapsed seconds based on start time (more accurate than decrementing)
                  const elapsedSeconds = Math.floor((Date.now() - state.timer.startTime) / 1000);
                  state.timer.remainingSeconds = Math.max(0, state.timer.totalSeconds - elapsedSeconds);
                  
                  // Calculate minutes and seconds
                  state.timer.minutes = Math.floor(state.timer.remainingSeconds / 60);
                  state.timer.seconds = state.timer.remainingSeconds % 60;
                  
                  // Update UI
                  UIManager.updateTimerDisplay(state.timer.minutes, state.timer.seconds);
                  
                  // Calculate progress
                  const progress = 100 - (state.timer.remainingSeconds / state.timer.totalSeconds * 100);
                  UIManager.updateProgressBar(progress);
                  
                  // Check if timer completed
                  if (state.timer.remainingSeconds <= 0) {
                      timerCompleted();
                  }
              }
              
              function timerCompleted() {
                  // Clear interval
                  clearInterval(state.timer.interval);
                  
                  // Play completion sound
                  SoundManager.play('timerComplete');
                  
                  // Update state
                  state.timer.isRunning = false;
                  state.timer.isPaused = false;
                  
                  // Handle different completion scenarios
                  if (state.timer.isBreak) {
                      // Break is over, switch back to work mode
                      state.timer.isBreak = false;
                      
                      // Update cycles if completing a full work+break cycle
                      state.timer.cycles++;
                      StorageManager.save(config.storageKeys.pomodoroCycles, state.timer.cycles);
                      updateCyclesDisplay();
                      
                      // Reset for work time
                      const workDuration = parseInt(elements.workDuration.value) || config.defaultTimerDuration;
                      state.timer.minutes = workDuration;
                      state.timer.seconds = 0;
                      state.timer.totalSeconds = workDuration * 60;
                      state.timer.remainingSeconds = workDuration * 60;
                      
                      // Notification
                      UIManager.showToast('Break completed! Ready for next focus session.', 'success', 5000);
                  } else {
                      // Work is over, switch to break mode
                      state.timer.isBreak = true;
                      
                      // Reset for break time
                      const breakDuration = parseInt(elements.breakDuration.value) || config.defaultBreakDuration;
                      state.timer.minutes = breakDuration;
                      state.timer.seconds = 0;
                      state.timer.totalSeconds = breakDuration * 60;
                      state.timer.remainingSeconds = breakDuration * 60;
                      
                      // Notification
                      UIManager.showToast('Focus session completed! Time for a break.', 'success', 5000);
                  }
                  
                  // Update UI
                  UIManager.updateTimerDisplay(state.timer.minutes, state.timer.seconds);
                  UIManager.updateProgressBar(0);
                  updateButtonStates();
                  updateTimerModeDisplay();
              }
              
              function updateButtonStates() {
                  if (elements.startTimer) {
                      elements.startTimer.disabled = state.timer.isRunning && !state.timer.isPaused;
                      elements.startTimer.textContent = state.timer.isPaused ? 'Resume' : 'Start';
                  }
                  
                  if (elements.pauseTimer) {
                      elements.pauseTimer.disabled = !state.timer.isRunning || state.timer.isPaused;
                  }
                  
                  if (elements.resetTimer) {
                      elements.resetTimer.disabled = !state.timer.isRunning && !state.timer.isPaused && 
                          state.timer.remainingSeconds === state.timer.totalSeconds;
                  }
              }
              
              function updateTimerModeDisplay() {
                  if (elements.timerModeDisplay) {
                      elements.timerModeDisplay.textContent = state.timer.isBreak ? 'Break Time' : 'Focus Time';
                      elements.timerModeDisplay.className = state.timer.isBreak ? 'timer-mode break' : 'timer-mode focus';
                  }
              }
              
              function updateCyclesDisplay() {
                  if (elements.cyclesDisplay) {
                      elements.cyclesDisplay.textContent = state.timer.cycles;
                  }
              }
              
              function togglePomodoroMode() {
                  // Toggle Pomodoro technique mode or manual mode
                  const pomodoroMode = elements.timerModeToggle?.checked || false;
                  
                  // Show or hide relevant settings
                  if (elements.breakSettingsContainer) {
                      elements.breakSettingsContainer.style.display = pomodoroMode ? 'block' : 'none';
                  }
                  
                  // Update UI
                  if (pomodoroMode) {
                      UIManager.showToast('Pomodoro technique enabled: Alternate between focus and break periods', 'info');
                  } else {
                      UIManager.showToast('Manual timer mode: Timer will stop when completed', 'info');
                  }
              }
              
              return {
                  initialize,
                  startTimer,
                  pauseTimer,
                  resumeTimer,
                  resetTimer,
                  togglePomodoroMode
              };
          })();
          
          /**
           * Eisenhower Matrix Module
           * Handles matrix task management
           */
          const EisenhowerMatrix = (function() {
              function initialize() {
                  // Load saved tasks
                  const savedTasks = StorageManager.load(config.storageKeys.matrixTasks, {
                      do: [],
                      decide: [],
                      delegate: [],
                      delete: []
                  });
                  
                  // Render saved tasks
                  Object.keys(savedTasks).forEach(quadrant => {
                      const taskList = document.querySelector(`.task-list[data-quadrant="${quadrant}"]`);
                      if (taskList) {
                          savedTasks[quadrant].forEach(task => {
                              const taskElement = UIManager.createTaskElement(task.text, quadrant);
                              if (task.completed) {
                                  taskElement.classList.add('completed');
                              }
                              taskList.appendChild(taskElement);
                          });
                      }
                  });
              }
              
              function addTask() {
                  const taskText = elements.matrixTaskInput?.value.trim();
                  const quadrant = elements.matrixQuadrantSelect?.value;
                  
                  if (!taskText || !quadrant) return;
                  
                  const taskList = document.querySelector(`.task-list[data-quadrant="${quadrant}"]`);
                  if (taskList) {
                      // Create and add task element
                      const taskElement = UIManager.createTaskElement(taskText, quadrant);
                      taskList.appendChild(taskElement);
                      
                      // Play sound
                      SoundManager.play('taskAdded');
                      
                      // Show toast
                      UIManager.showToast(`Task added to ${formatQuadrantName(quadrant)}`, 'success');
                      
                      // Clear input
                      elements.matrixTaskInput.value = '';
                      
                      // Save state
                      saveMatrixTasks();
                  }
              }
              
              function formatQuadrantName(quadrant) {
                  const names = {
                      do: 'Do First',
                      decide: 'Decide When',
                      delegate: 'Delegate',
                      delete: 'Delete'
                  };
                  return names[quadrant] || quadrant;
              }
              
              return {
                  initialize,
                  addTask
              };
          })();
          
          /**
           * SMART Goals Module
           * Handles goal management
           */
          const SmartGoals = (function() {
              function initialize() {
                  // Load saved goals
                  const savedGoals = StorageManager.load(config.storageKeys.smartGoals, []);
                  
                  // Render saved goals
                  if (elements.goalList) {
                      savedGoals.forEach(goal => {
                          const goalElement = UIManager.createGoalElement(goal.title, goal.details);
                          
                          // Set progress
                          const progressSlider = goalElement.querySelector('.progress-slider');
                          const progressFill = goalElement.querySelector('.progress-bar-fill');
                          const progressValue = goalElement.querySelector('.progress-value');
                          
                          if (progressSlider && progressFill && progressValue) {
                              progressSlider.value = goal.progress;
                              progressFill.style.width = `${goal.progress}%`;
                              progressValue.textContent = `${goal.progress}%`;
                              
                              // Set appropriate class
                              if (goal.progress < 1) {
                                  goalElement.classList.add('not-started');
                              } else if (goal.progress < 100) {
                                  goalElement.classList.add('in-progress');
                              } else {
                                  goalElement.classList.add('completed');
                              }
                          }
                          
                          elements.goalList.appendChild(goalElement);
                      });
                  }
              }
              
              function addGoal() {
                  const title = elements.goalText?.value.trim();
                  const details = elements.goalDetails?.value.trim();
                  
                  if (!title) return;
                  
                  if (elements.goalList) {
                      // Create and add goal element
                      const goalElement = UIManager.createGoalElement(title, details);
                      elements.goalList.appendChild(goalElement);
                      
                      // Play sound
                      SoundManager.play('taskAdded');
                      
                      // Show toast
                      UIManager.showToast('New SMART goal added', 'success');
                      
                      // Clear inputs
                      elements.goalText.value = '';
                      elements.goalDetails.value = '';
                      
                      // Save state
                      saveGoals();
                  }
              }
              
              return {
                  initialize,
                  addGoal
              };
          })();
          
          // Helper Functions
          function saveMatrixTasks() {
              const tasks = {
                  do: [],
                  decide: [],
                  delegate: [],
                  delete: []
              };
              
              // Gather all tasks from the DOM
              Object.keys(tasks).forEach(quadrant => {
                  const taskList = document.querySelector(`.task-list[data-quadrant="${quadrant}"]`);
                  if (taskList) {
                      taskList.querySelectorAll('li').forEach(li => {
                          const text = li.querySelector('span')?.textContent;
                          const completed = li.classList.contains('completed');
                          
                          if (text) {
                              tasks[quadrant].push({
                                  text, 
                                  completed
                              });
                          }
                      });
                  }
              });
              
              // Save to storage
              StorageManager.save(config.storageKeys.matrixTasks, tasks);
          }
          
          function saveGoals() {
              const goals = [];
              
              if (elements.goalList) {
                  elements.goalList.querySelectorAll('.goal-item').forEach(item => {
                      const title = item.querySelector('h4')?.textContent;
                      const details = item.querySelector('p')?.textContent || '';
                      const progress = parseInt(item.querySelector('.progress-slider')?.value || '0');
                      
                      if (title) {
                          goals.push({
                              title,
                              details,
                              progress
                          });
                      }
                  });
              }
              
              // Save to storage
              StorageManager.save(config.storageKeys.smartGoals, goals);
          }
          
          function saveTimerSettings() {
              const settings = {
                  workDuration: parseInt(elements.workDuration?.value) || config.defaultTimerDuration,
                  breakDuration: parseInt(elements.breakDuration?.value) || config.defaultBreakDuration,
                  sound: elements.soundSelect?.value || 'sound1.mp3'
              };
              
              // Save to storage
              StorageManager.save(config.storageKeys.timerSettings, settings);
          }
          
          // Initialize the application
          function initialize() {
              // Gather DOM elements
              cacheElements();
              
              // Initialize modules
              setupEventListeners();
              SoundManager.preloadSounds();
              
              // Initialize features
              PomodoroTimer.initialize();
              EisenhowerMatrix.initialize();
              SmartGoals.initialize();
              
              // Show welcome message
              setTimeout(() => {
                  UIManager.showToast('Welcome to Delta Students Productivity Tools!', 'info', 5000);
              }, 500);
          }
          
          function cacheElements() {
              // Store references to DOM elements
              elements = {
                  // Header and navigation
                  notificationToggle: document.querySelector('.notifications-toggle'),
                  notificationsPanel: document.getElementById('notifications-panel'),
                  mobileMenuToggle: document.querySelector('.mobile-menu-toggle'),
                  mainNav: document.querySelector('.main-nav'),
                  
                  // Pomodoro Timer
                  timerMinutes: document.getElementById('timer-minutes'),
                  timerSeconds: document.getElementById('timer-seconds'),
                  startTimer: document.getElementById('start-timer'),
                  pauseTimer: document.getElementById('pause-timer'),
                  resetTimer: document.getElementById('reset-timer'),
                  progressBar: document.querySelector('.timer-progress-bar'),
                  workDuration: document.getElementById('work-duration'),
                  breakDuration: document.getElementById('break-duration'),
                  soundSelect: document.getElementById('sound-select'),
                  timerModeToggle: document.querySelector('#timer-mode-toggle'),
                  timerModeDisplay: document.querySelector('.current-task'),
                  breakSettingsContainer: document.querySelector('.timer-settings'),
                  presetButtons: document.querySelectorAll('.presets button'),
                  cyclesDisplay: document.querySelector('#cycles-count'),
                  
                  // Eisenhower Matrix
                  matrixTaskInput: document.getElementById('matrix-task-input'),
                  matrixQuadrantSelect: document.getElementById('matrix-quadrant-select'),
                  addMatrixTaskButton: document.getElementById('add-matrix-task'),
                  
                  // SMART Goals
                  goalText: document.getElementById('goal-text'),
                  goalDetails: document.getElementById('goal-details'),
                  addGoalButton: document.getElementById('add-goal'),
                  goalList: document.getElementById('goal-list')
              };
          }
          
          function setupEventListeners() {
              // Notification panel toggle
              if (elements.notificationToggle && elements.notificationsPanel) {
                  elements.notificationToggle.addEventListener('click', function() {
                      elements.notificationsPanel.classList.toggle('visible');
                      elements.notificationToggle.classList.toggle('active');
                      state.notifications.isOpen = elements.notificationsPanel.classList.contains('visible');
                      
                      if (state.notifications.isOpen) {
                          SoundManager.play('notification');
                      }
                  });
                  
                  // Close notifications when clicking outside
                  document.addEventListener('click', function(event) {
                      if (state.notifications.isOpen && 
                          !elements.notificationsPanel.contains(event.target) && 
                          !elements.notificationToggle.contains(event.target)) {
                          elements.notificationsPanel.classList.remove('visible');
                          elements.notificationToggle.classList.remove('active');
                          state.notifications.isOpen = false;
                      }
                  });
              }
              
              // Mobile menu toggle
              if (elements.mobileMenuToggle && elements.mainNav) {
                  elements.mobileMenuToggle.addEventListener('click', function() {
                      elements.mainNav.classList.toggle('open');
                      state.mobileMenu.isOpen = elements.mainNav.classList.contains('open');
                      SoundManager.play('buttonClick');
                  });
              }
              
              // Timer controls
              if (elements.startTimer) {
                  elements.startTimer.addEventListener('click', function() {
                      if (state.timer.isPaused) {
                          PomodoroTimer.resumeTimer();
                      } else {
                          PomodoroTimer.startTimer();
                      }
                  });
              }
              
              if (elements.pauseTimer) {
                  elements.pauseTimer.addEventListener('click', function() {
                      PomodoroTimer.pauseTimer();
                  });
              }
              
              if (elements.resetTimer) {
                  elements.resetTimer.addEventListener('click', function() {
                      PomodoroTimer.resetTimer();
                  });
              }
              
              // Timer settings
              if (elements.workDuration || elements.breakDuration || elements.soundSelect) {
                  // Save settings when changed
                  const settingsElements = [elements.workDuration, elements.breakDuration, elements.soundSelect];
                  settingsElements.forEach(element => {
                      if (element) {
                          element.addEventListener('change', function() {
                              saveTimerSettings();
                              
                              // Reset timer if not running
                              if (!state.timer.isRunning) {
                                  // Update timer display with new work duration
                                  const workDuration = parseInt(elements.workDuration?.value) || config.defaultTimerDuration;
                                  state.timer.minutes = workDuration;
                                  state.timer.seconds = 0;
                                  state.timer.totalSeconds = workDuration * 60;
                                  state.timer.remainingSeconds = workDuration * 60;
                                  
                                  // Update UI
                                  UIManager.updateTimerDisplay(state.timer.minutes, state.timer.seconds);
                                  UIManager.updateProgressBar(0);
                              }
                          });
                      }
                  });
              }
              
              // Timer mode toggle
              if (elements.timerModeToggle) {
                  elements.timerModeToggle.addEventListener('change', function() {
                      PomodoroTimer.togglePomodoroMode();
                  });
              }
              
              // Preset buttons
              if (elements.presetButtons) {
                  elements.presetButtons.forEach(button => {
                      button.addEventListener('click', function() {
                          if (state.timer.isRunning) return; // Don't change if timer is running
                          
                          SoundManager.play('buttonClick');
                          
                          const workTime = parseInt(this.getAttribute('data-work'));
                          const breakTime = parseInt(this.getAttribute('data-break'));
                          
                          if (elements.workDuration) elements.workDuration.value = workTime;
                          if (elements.breakDuration) elements.breakDuration.value = breakTime;
                          
                          // Update timer display
                          state.timer.minutes = workTime;
                          state.timer.seconds = 0;
                          state.timer.totalSeconds = workTime * 60;
                          state.timer.remainingSeconds = workTime * 60;
                          
                          // Update UI
                          UIManager.updateTimerDisplay(state.timer.minutes, state.timer.seconds);
                          UIManager.updateProgressBar(0);
                          
                          // Save settings
                          saveTimerSettings();
                          
                          // Show toast
                          UIManager.showToast(`Preset applied: ${workTime} min work / ${breakTime} min break`, 'info');
                      });
                  });
              }
              
              // Eisenhower Matrix
              if (elements.addMatrixTaskButton) {
                  elements.addMatrixTaskButton.addEventListener('click', function() {
                      EisenhowerMatrix.addTask();
                  });
              }
              
              if (elements.matrixTaskInput) {
                  elements.matrixTaskInput.addEventListener('keydown', function(e) {
                      if (e.key === 'Enter') {
                          e.preventDefault();
                          EisenhowerMatrix.addTask();
                      }
                  });
              }
              
              // SMART Goals
              if (elements.addGoalButton) {
                  elements.addGoalButton.addEventListener('click', function() {
                      SmartGoals.addGoal();
                  });
              }
              
              // Allow form submission with Enter key
              if (elements.goalText) {
                  elements.goalText.addEventListener('keydown', function(e) {
                      if (e.key === 'Enter') {
                          e.preventDefault();
                          SmartGoals.addGoal();
                      }
                  });
              }
              
              // Handle page visibility changes
              document.addEventListener('visibilitychange', function() {
                  if (document.hidden) {
                      // Page is hidden, pause timer if running
                      if (state.timer.isRunning && !state.timer.isPaused) {
                          PomodoroTimer.pauseTimer();
                      }
                  }
              });
              
              // Handle before unload to save state
              window.addEventListener('beforeunload', function() {
                  saveMatrixTasks();
                  saveGoals();
                  saveTimerSettings();
              });
          }
          
          // Public API
          return {
              initialize
          };
      })();
      
      // Initialize the application when the DOM is ready
      document.addEventListener('DOMContentLoaded', function() {
          ProductivityApp.initialize();
      });
      