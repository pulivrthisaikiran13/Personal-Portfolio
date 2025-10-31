// --- TYPEWRITER EFFECT LOGIC ---
const roles = ["Software Developer", "Python Developer", "Web Developer", "Python/Django Programmer"];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const speed = 150; // Typing speed in ms
const deletionSpeed = 75; // Deletion speed in ms
const delay = 1500; // Delay before starting next action

function type() {
    const currentRole = roles[roleIndex];
    const target = document.getElementById('typing-text');
    
    if (!target) return; // Exit if element not found

    if (isDeleting) {
        // Deleting text
        target.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        // Typing text
        target.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? deletionSpeed : speed;

    if (!isDeleting && charIndex === currentRole.length) {
        // Done typing, set up for deletion
        typeSpeed = delay;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        // Done deleting, move to next role
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500; // Small pause before starting next word
    }

    setTimeout(type, typeSpeed);
}


// --- CUSTOM MODAL FUNCTIONS (REPLACING ALERT()) ---

function showFeedbackModal(message, isSuccess = true) {
    const modal = document.getElementById('feedback-modal');
    const messageElement = document.getElementById('modal-message');
    const iconElement = document.getElementById('modal-icon');
    const buttonElement = document.getElementById('modal-button');

    const isDarkMode = document.documentElement.classList.contains('dark');
    
    // Determine colors based on theme and success state
    const baseBgClass = isDarkMode ? 'bg-primary-dark' : 'bg-primary-light';
    const textColorClass = isDarkMode ? 'text-white' : 'text-gray-900';
    const borderColorClass = isSuccess ? 'border-accent' : 'border-red-500';
    
    const iconHTML = isSuccess 
        ? `<i data-lucide="check-circle" class="w-8 h-8 text-accent mx-auto mb-3"></i>` 
        : `<i data-lucide="x-circle" class="w-8 h-8 text-red-500 mx-auto mb-3"></i>`;
        
    const buttonColorClass = isSuccess 
        ? 'bg-accent text-secondary-dark hover:bg-teal-300' 
        : 'bg-red-600 text-white hover:opacity-90';

    // Set dynamic content and styles
    modal.querySelector('div').className = `${baseBgClass} p-8 rounded-lg shadow-xl max-w-sm w-full text-center border-t-4 ${borderColorClass}`;
    iconElement.innerHTML = iconHTML;
    messageElement.textContent = message;
    messageElement.className = `${textColorClass} text-lg font-semibold mb-6`;
    buttonElement.className = `px-4 py-2 rounded-md font-semibold transition-colors ${buttonColorClass}`;
    
    // Ensure Lucide icons are correctly rendered
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    modal.classList.add('show');
}

function hideFeedbackModal() {
    document.getElementById('feedback-modal').classList.remove('show');
}


// --- SCROLLSPY & SCROLL-TO-TOP LOGIC ---
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('header nav a, #mobile-menu-overlay nav a');
const scrollToTopBtn = document.getElementById('scrollToTopBtn');

function highlightActiveSection() {
    let currentSectionId = '';
    const scrollY = window.scrollY;

    // Find the section in view
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100; // 100px offset
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            currentSectionId = sectionId;
        }
    });

    // Highlight the corresponding nav link
    navLinks.forEach(link => {
        link.classList.remove('nav-active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
            link.classList.add('nav-active');
        }
    });

    // Special case for hero section (top of page)
    if (currentSectionId === '' && scrollY < 400) {
        navLinks.forEach(link => {
            if (link.getAttribute('href') === '#hero') {
                link.classList.add('nav-active');
            }
        });
    }
}

function toggleScrollButton() {
    if (scrollToTopBtn) {
        // UPDATED: Changed 500 to 200 to make it appear sooner
        if (window.scrollY > 200) {
            scrollToTopBtn.classList.remove('opacity-0');
            scrollToTopBtn.classList.add('opacity-100');
        } else {
            scrollToTopBtn.classList.remove('opacity-100');
            scrollToTopBtn.classList.add('opacity-0');
        }
    }
}


// --- DOCUMENT READY (jQuery) ---
$(document).ready(function() {

    // --- 1. THEME TOGGLE LOGIC ---
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeToggleBtnMobile = document.getElementById('theme-toggle-btn-mobile');
    
    const sunIcon = document.getElementById('theme-icon-sun');
    const moonIcon = document.getElementById('theme-icon-moon');
    const sunIconMobile = document.getElementById('theme-icon-sun-mobile');
    const moonIconMobile = document.getElementById('theme-icon-moon-mobile');

    // Helper function to update icons on both toggles
    function updateThemeIcons(isDarkMode) {
        if (isDarkMode) {
            moonIcon.classList.add('hidden');
            sunIcon.classList.remove('hidden');
            moonIconMobile.classList.add('hidden');
            sunIconMobile.classList.remove('hidden');
        } else {
            moonIcon.classList.remove('hidden');
            sunIcon.classList.add('hidden');
            moonIconMobile.classList.remove('hidden');
            sunIconMobile.classList.add('hidden');
        }
    }

    // Helper function to set the theme
    function setTheme(isDarkMode) {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
        }
        updateThemeIcons(isDarkMode);
    }

    // Initialize theme on page load
    const isDarkMode = localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setTheme(isDarkMode);

    // Attach click listeners to both buttons
    themeToggleBtn.addEventListener('click', () => {
        setTheme(localStorage.theme !== 'dark');
    });
    themeToggleBtnMobile.addEventListener('click', () => {
        setTheme(localStorage.theme !== 'dark');
    });

    // --- 2. SCROLLSPY & SCROLL-TO-TOP LISTENERS ---
    window.addEventListener('scroll', () => {
        highlightActiveSection();
        toggleScrollButton();
    });
    // Initial check
    highlightActiveSection();
    toggleScrollButton();


    // --- 3. START TYPEWRITER EFFECT ---
    type();

    // --- 4. RENDER LUCIDE ICONS ---
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --- 5. EMAILJS SUBMISSION LOGIC ---
    $("#contact-form").submit(function (event) {
        event.preventDefault();
        
        const submitBtn = document.getElementById('submit-btn');
        const originalBtnText = submitBtn.innerHTML;

        // 1. Show temporary "Sending..." message and disable button
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i data-lucide="loader-circle" class="w-5 h-5 animate-spin"></i> Sending...';
        
        // Render the new loader icon
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // 2. Initialize and Send via EmailJS
        emailjs.init("6wLHz8XqTl1l3Gdk6"); // Replace with your EmailJS User ID

        emailjs.sendForm('service_c8i3gdd', 'template_8a6wjyg', '#contact-form') // Replace with your Service & Template IDs
            .then(function (response) {
                // SUCCESS
                console.log('SUCCESS!', response.status, response.text);
                document.getElementById("contact-form").reset();
                showFeedbackModal("Message Sent Successfully!", true);
                
            }, function (error) {
                // FAILURE
                console.log('FAILED...', error);
                showFeedbackModal("Form Submission Failed! Please check your network and try again.", false);
                
            })
            .finally(() => {
                // 3. Re-enable button and restore original text
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            });
    });

    // --- 6. MOBILE MENU LOGIC ---
    const openBtn = document.getElementById('mobile-menu-open-btn');
    const closeBtn = document.getElementById('mobile-menu-close-btn');
    const overlay = document.getElementById('mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-menu-link');
    const body = document.body;

    openBtn.addEventListener('click', () => {
        overlay.classList.remove('hidden');
        body.classList.add('no-scroll');
    });

    closeBtn.addEventListener('click', () => {
        overlay.classList.add('hidden');
        body.classList.remove('no-scroll');
    });

    // Close menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            overlay.classList.add('hidden');
            body.classList.remove('no-scroll');
        });
    });

    // --- 7. SMART EMAIL LINK LOGIC ---
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
    const emailLinks = [
        document.getElementById('contact-info-email'),
        document.getElementById('footer-email')
    ];

    if (!isTouchDevice) {
        // It's a desktop, change all email links to open Gmail in a new tab
        emailLinks.forEach(link => {
            if (link) {
                link.href = 'https://mail.google.com/mail/?view=cm&fs=1&to=saikiranpulivarthi13@gmail.com';
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
            }
        });
    }
    // If it *is* a touch device, we do nothing and let the default 'mailto:' behavior work.
});

