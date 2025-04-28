

/**
 * Delta Students - Advanced Page Animations & Features (mo.js)
 *
 * This script initializes page features like icons, copyright year,
 * and implements various JavaScript-driven animations including:
 * - Intersection Observer based scroll animations with staggering
 * - Scroll-based header style changes
 * - Simple parallax effect on designated elements
 * - Mouse-tracking tilt effect on cards
 * - Character-by-character text reveal animations
 * - Optimized event handling using debouncing.
 *
 * Assumes HTML structure includes classes like: .animate-on-scroll, .parallax-effect,
 * .tilt-effect, .text-reveal, and elements like header, #current-year.
 * Also assumes feather.replace() is needed for footer social icons.
 */
document.addEventListener('DOMContentLoaded', function() {
    'use strict'; // Enable strict mode

    console.info("DOM fully loaded. Initializing Delta Students page features...");

    // --- Global Configuration ---
    const CONFIG = {
        ENABLE_DEBUG_LOGGING: false, // Set to true for verbose console logs
        SCROLL_ANIMATION_SELECTOR: '.animate-on-scroll', // Class for elements animated on scroll
        VISIBLE_CLASS: 'is-visible',                  // Class added when element is visible
        OBSERVER_THRESHOLD: 0.15,                     // Percentage visibility to trigger animation
        HEADER_SHRINK_THRESHOLD: 50,                  // Pixels scrolled before header shrinks
        HEADER_ELEMENT_SELECTOR: 'header',            // Selector for the main header element
        HEADER_SHRUNK_CLASS: 'header-shrunk',         // Class added to header when shrunk
        PARALLAX_ELEMENT_SELECTOR: '.parallax-effect',// Class for parallax elements (e.g., hero image container)
        PARALLAX_INTENSITY: 0.2,                      // Default parallax intensity (overridden by data-attribute)
        TILT_EFFECT_SELECTOR: '.tilt-effect',         // Class for elements with mouse tilt (like feature cards)
        TILT_MAX_ROTATION: 5,                         // Max degrees of tilt
//         TEXT_REVEAL_SELECTOR: '.text-reveal',         // Class for elements needing text reveal (like hero headline)
        TEXT_REVEAL_CHAR_DELAY: 30,                   // Milliseconds between character reveals
        DEBOUNCE_DELAY: 100,                          // Milliseconds for debouncing scroll/resize events
        STAGGER_GROUPS: [                             // Configuration for staggered animations
            { group: '.features-grid', item: '.feature', baseDelay: 0.1, increment: 0.1 },
            { group: '.testimonial-slider', item: '.testimonial', baseDelay: 0.15, increment: 0.12 },
            // Add more groups here if needed
        ],
        FEATHER_ICON_SELECTOR: '[data-feather]',      // Default selector Feather Icons might use (though not directly used by replace())
        COPYRIGHT_YEAR_ELEMENT_ID: 'current-year',    // ID for the copyright year span
    };

    // --- Utility Functions ---

    /**
     * Debounce function to limit the rate at which a function can fire.
     * @param {Function} func - The function to debounce.
     * @param {number} wait - The delay in milliseconds.
     * @param {boolean} immediate - Fire immediately then wait.
     * @returns {Function} The debounced function.
     */
    function debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const context = this;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    /**
     * Logs messages only if debug mode is enabled.
     * @param {string} level - 'log', 'info', 'warn', 'error'.
     * @param {...any} args - Arguments to log.
     */
    function debugLog(level, ...args) {
        if (CONFIG.ENABLE_DEBUG_LOGGING && console[level]) {
            console[level](...args);
        }
    }

    // --- Core Feature Initialization ---

    /**
     * Main function to orchestrate the setup of various page features.
     */
    function initializePageFeatures() {
        debugLog('info', 'Starting feature initialization...');
        setupFeatherIcons(); // Still needed for footer social icons
        setupCopyrightYear();
        setupScrollDependentFeatures(); // Handles animations, parallax, header change
        setupInteractionFeatures();   // Handles mouse tilt, text reveal
        debugLog('info', 'Feature initialization complete.');
    }

    /**
     * Replaces feather icon placeholders (used in footer) with SVG icons.
     */
    function setupFeatherIcons() {
        if (typeof feather !== 'undefined' && typeof feather.replace === 'function') {
            try {
                feather.replace();
                debugLog('info', "Feather icons initialized (for footer social icons).");
            } catch (error) {
                console.error("Feather icons replacement failed:", error);
            }
        } else {
            if (document.querySelector('.feather')) {
                 console.warn("Feather icons script not found or doesn't have replace method, but elements with '.feather' class exist.");
            } else {
                 debugLog('info', "Feather icons script not loaded (expected if only using inline SVGs elsewhere).");
            }
        }
    }

    /**
     * Sets the current year in the specified element.
     */
    function setupCopyrightYear() {
        const yearSpan = document.getElementById(CONFIG.COPYRIGHT_YEAR_ELEMENT_ID);
        if (yearSpan) {
            try {
                yearSpan.textContent = new Date().getFullYear();
                debugLog('info', "Copyright year updated.");
            } catch (error) {
                console.error("Failed to set copyright year:", error);
            }
        } else {
            console.warn(`Copyright year span element (#${CONFIG.COPYRIGHT_YEAR_ELEMENT_ID}) not found.`);
        }
    }

    // --- Scroll Dependent Features ---

    /**
     * Sets up features that depend on scroll position or visibility.
     */
    function setupScrollDependentFeatures() {
        setupScrollAnimations();
        setupHeaderScrollBehavior();
        // Note: Parallax effect was removed from hero image when switching to background image
        // setupParallaxEffect(); // Keep if you apply .parallax-effect elsewhere

        window.addEventListener('scroll', debounce(handleScrollUpdates, 10), { passive: true });
        handleScrollUpdates(); // Initial call
    }

    /**
     * Handler for scroll events, triggers updates for relevant features.
     */
    function handleScrollUpdates() {
        updateHeaderOnScroll();
        // updateParallaxElements(); // Keep if parallax is used elsewhere
    }

    /**
     * Sets up Intersection Observer for scroll-triggered animations
     * and applies staggered delays where configured.
     */
    function setupScrollAnimations() {
        if (!('IntersectionObserver' in window)) {
            console.warn("IntersectionObserver is not supported. Scroll animations disabled.");
            document.querySelectorAll(CONFIG.SCROLL_ANIMATION_SELECTOR)
                .forEach(el => el.classList.add(CONFIG.VISIBLE_CLASS));
            return;
        }

        debugLog('info', "Setting up Intersection Observer for scroll animations...");

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: CONFIG.OBSERVER_THRESHOLD,
        };

        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    debugLog('log', "Element intersecting:", entry.target);
                    entry.target.classList.add(CONFIG.VISIBLE_CLASS);
                    observer.unobserve(entry.target);
                }
            });
        };

        const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);
        const animatedElements = document.querySelectorAll(CONFIG.SCROLL_ANIMATION_SELECTOR);

        if (animatedElements.length > 0) {
            debugLog('info', `Observing ${animatedElements.length} elements for scroll animation.`);
            animatedElements.forEach(element => {
                scrollObserver.observe(element);
            });
            applyStaggeredDelays(CONFIG.STAGGER_GROUPS);
        } else {
            debugLog('info', "No elements found for scroll animation based on selector:", CONFIG.SCROLL_ANIMATION_SELECTOR);
        }
    }

    /**
     * Applies staggered transition delays to items within specified groups.
     * @param {Array<Object>} groupsConfig - Configuration array.
     */
    function applyStaggeredDelays(groupsConfig) {
        if (!groupsConfig || groupsConfig.length === 0) {
            debugLog('info', "No stagger groups configured.");
            return;
        }
        debugLog('info', "Applying staggered animation delays...");
        groupsConfig.forEach(config => {
            const { group: groupSelector, item: itemSelector, baseDelay = 0.1, increment = 0.08 } = config;
            document.querySelectorAll(groupSelector).forEach(groupElement => {
                const itemsToStagger = groupElement.querySelectorAll(`${itemSelector}${CONFIG.SCROLL_ANIMATION_SELECTOR}`);
                if (itemsToStagger.length > 0) {
                     debugLog('log', `Applying stagger to ${itemsToStagger.length} items in group:`, groupElement);
                    itemsToStagger.forEach((item, index) => {
                        const delay = baseDelay + index * increment;
                        item.style.transitionDelay = `${delay.toFixed(2)}s`;
                    });
                }
            });
        });
    }

    /**
     * Adds/Removes shrunk class to header based on scroll position.
     */
    function setupHeaderScrollBehavior() {
        const header = document.querySelector(CONFIG.HEADER_ELEMENT_SELECTOR);
        if (!header) {
            console.warn(`Header element ('${CONFIG.HEADER_ELEMENT_SELECTOR}') not found for scroll behavior.`);
            return;
        }
        debugLog('info', 'Setting up header scroll behavior.');
    }

    /**
     * Updates header class based on current scroll position.
     * Called by the debounced scroll handler.
     */
    function updateHeaderOnScroll() {
        const header = document.querySelector(CONFIG.HEADER_ELEMENT_SELECTOR);
        if (!header) return;

        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        const isShrunk = header.classList.contains(CONFIG.HEADER_SHRUNK_CLASS);

        if (scrollY > CONFIG.HEADER_SHRINK_THRESHOLD) {
            if (!isShrunk) header.classList.add(CONFIG.HEADER_SHRUNK_CLASS);
        } else {
            if (isShrunk) header.classList.remove(CONFIG.HEADER_SHRUNK_CLASS);
        }
    }

    // --- Parallax functions (Keep if applying .parallax-effect elsewhere) ---
    /**
     * Finds parallax elements and prepares them.
     */
    /* // Uncomment if using parallax elsewhere
    function setupParallaxEffect() {
        const parallaxElements = document.querySelectorAll(CONFIG.PARALLAX_ELEMENT_SELECTOR);
        if (parallaxElements.length === 0) {
            debugLog('info', "No parallax elements found.");
            return;
        }
        debugLog('info', `Setting up parallax for ${parallaxElements.length} elements.`);
    }
    */

    /**
     * Updates the transform property of parallax elements based on scroll.
     * Called by the debounced scroll handler. Uses requestAnimationFrame for smoothness.
     */
    /* // Uncomment if using parallax elsewhere
    function updateParallaxElements() {
        const parallaxElements = document.querySelectorAll(CONFIG.PARALLAX_ELEMENT_SELECTOR);
        if (parallaxElements.length === 0) return;

        const scrollY = window.pageYOffset || document.documentElement.scrollTop;

        window.requestAnimationFrame(() => {
            parallaxElements.forEach(el => {
                const intensity = parseFloat(el.dataset.parallaxIntensity) || CONFIG.PARALLAX_INTENSITY;
                const movement = -(scrollY * intensity);
                el.style.transform = `translateY(${movement.toFixed(1)}px)`;
            });
        });
    }
    */

    // --- Interaction Based Features ---

    /**
     * Sets up features triggered by direct user interaction (mouse, etc.).
     */
    function setupInteractionFeatures() {
        setupMouseTiltEffect();
        setupTextReveal();
    }

    /**
     * Adds event listeners for mouse-based card tilt effect.
     */
    function setupMouseTiltEffect() {
        const tiltElements = document.querySelectorAll(CONFIG.TILT_EFFECT_SELECTOR);
        if (tiltElements.length === 0) {
            debugLog('info', "No tilt elements found.");
            return;
        }
        debugLog('info', `Setting up tilt effect for ${tiltElements.length} elements.`);

        tiltElements.forEach(element => {
            element.style.transition = 'transform 0.1s ease-out';
            element.style.willChange = 'transform';

            element.addEventListener('mousemove', (e) => handleTiltMouseMove(e, element));
            element.addEventListener('mouseleave', () => resetTilt(element));
        });
    }

    /**
     * Handles mouse movement over a tiltable element to calculate rotation.
     * Uses requestAnimationFrame for performance.
     * @param {MouseEvent} e - The mouse event.
     * @param {HTMLElement} element - The element being hovered.
     */
    function handleTiltMouseMove(e, element) {
        const rect = element.getBoundingClientRect();
        const elementX = e.clientX - rect.left;
        const elementY = e.clientY - rect.top;

        const { width, height } = rect;
        const centerX = width / 2;
        const centerY = height / 2;

        const deltaX = elementX - centerX;
        const deltaY = elementY - centerY;

        const rotateY = (deltaX / centerX) * CONFIG.TILT_MAX_ROTATION;
        const rotateX = -(deltaY / centerY) * CONFIG.TILT_MAX_ROTATION;

        window.requestAnimationFrame(() => {
             element.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(1)}deg) rotateY(${rotateY.toFixed(1)}deg) scale(1.03)`;
        });
    }

    /**
     * Resets the tilt effect when the mouse leaves the element.
     * Uses requestAnimationFrame for performance.
     * @param {HTMLElement} element - The element to reset.
     */
    function resetTilt(element) {
         window.requestAnimationFrame(() => {
            element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
         });
    }

    /**
     * Initializes character-by-character text reveal animations.
     */
    function setupTextReveal() {
        const revealElements = document.querySelectorAll(CONFIG.TEXT_REVEAL_SELECTOR);
        if (revealElements.length === 0) {
            debugLog('info', "No text reveal elements found.");
            return;
        }
        debugLog('info', `Setting up text reveal for ${revealElements.length} elements.`);

        revealElements.forEach(element => {
            prepareTextReveal(element);
            // Trigger reveal after a delay (or could be tied to scroll observer)
            const delay = parseInt(element.dataset.revealDelay) || 300;
            setTimeout(() => startTextReveal(element), delay);
        });
    }

    /**
     * Wraps each character of the text content in a span, preparing for animation.
     * --- THIS FUNCTION IS REVISED ---
     * @param {HTMLElement} element - The element containing text to reveal.
     */
    function prepareTextReveal(element) {
        const originalText = element.textContent || '';
        if (!originalText.trim()) return;

        element.textContent = ''; // Clear original static text
        element.style.opacity = 1; // Ensure container itself is visible

        originalText.split('').forEach(char => {
            const span = document.createElement('span');
            span.className = 'reveal-char';
            // Set initial styles (hidden state)
            span.style.opacity = '0';
            span.style.transform = 'translateY(10px)'; // Start slightly down
            span.style.display = 'inline-block'; // Needed for transform
            // Define the transition: property, duration, easing function
            // NO DELAY defined here in the transition property itself.
            span.style.transition = `opacity 0.3s ease-out, transform 0.3s ease-out`;
            span.style.willChange = 'opacity, transform'; // Performance hint

            // Handle whitespace correctly
            span.innerHTML = (char === ' ') ? ' ' : char; // Use non-breaking space
            element.appendChild(span);
        });
         debugLog('log', `Prepared ${originalText.length} characters for reveal in`, element);
    }

    /**
     * Starts the animation sequence for revealing characters using staggered timeouts.
     * --- THIS FUNCTION REMAINS THE SAME, uses setTimeout to trigger transition start ---
     * @param {HTMLElement} element - The element containing character spans.
     */
    function startTextReveal(element) {
        const chars = element.querySelectorAll('.reveal-char');
        if (chars.length === 0) return;

        debugLog('log', `Starting text reveal animation for`, element);
        chars.forEach((span, index) => {
            // Use setTimeout to apply the final styles after a calculated delay.
            // This delay causes the *start* of the transition to be staggered.
            setTimeout(() => {
                // Apply final styles (visible state)
                span.style.opacity = '1';
                span.style.transform = 'translateY(0)';
            }, index * CONFIG.TEXT_REVEAL_CHAR_DELAY);
        });
    }


    // --- Execute Initialization ---
    try {
        initializePageFeatures();
    } catch(error) {
        console.error("An error occurred during page feature initialization:", error);
    }

}); // End of DOMContentLoaded listener


