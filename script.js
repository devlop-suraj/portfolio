// Welcome Animation Controller
function initWelcomeAnimation() {
    const welcomeOverlay = document.getElementById('welcomeOverlay');
    const synth = window.speechSynthesis;
    
    // Check if user has already seen the welcome animation (session storage)
    const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcome');
    
    if (hasSeenWelcome) {
        // Skip animation if already seen in this session
        welcomeOverlay.style.display = 'none';
        return;
    }
    
    // Speak welcome message
    setTimeout(() => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance("Welcome! Let's explore my portfolio!");
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.volume = 0.85;
            
            const voices = synth.getVoices();
            const preferredVoice = voices.find(voice => voice.name.includes('Google US English')) || voices[0];
            if (preferredVoice) {
                utterance.voice = preferredVoice;
            }
            
            synth.speak(utterance);
        }
    }, 500);
    
    // Hide welcome screen after 3 seconds
    setTimeout(() => {
        welcomeOverlay.classList.add('hide');
        sessionStorage.setItem('hasSeenWelcome', 'true');
        
        // Remove from DOM after animation completes
        setTimeout(() => {
            welcomeOverlay.style.display = 'none';
        }, 500);
    }, 3000);
}

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId === '#home') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            const target = document.querySelector(targetId);
            if (target) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(15, 15, 35, 0.95)';
        navbar.style.boxShadow = '0 4px 24px 0 rgba(0, 212, 255, 0.15), 0 1.5px 0 0 #00d4ff';
    } else {
        navbar.style.background = 'rgba(15, 15, 35, 0.85)';
        navbar.style.boxShadow = '0 4px 24px 0 rgba(0, 212, 255, 0.08), 0 1.5px 0 0 #00d4ff';
    }
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.skill-category, .project-card, .stat, .contact-item');
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

// Contact Form Handling
function initContactForm() {
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Get form data
            const formData = new FormData(this);
            
            // Submit to Formspree
            fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                    this.reset(); // Clear form
                } else {
                    showNotification('Failed to send message. Please try again.', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Failed to send message. Please try again.', 'error');
            })
            .finally(() => {
                // Reset button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        });
    }
}

// Enhanced notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        hideNotification(notification);
    });
}

function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Typing animation for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation when page loads
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 50);
        }, 1000);
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Skills progress animation
function animateSkills() {
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            item.style.transition = 'all 0.6s ease';
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 100);
        }, index * 100);
    });
}

// Trigger skills animation when skills section is visible
const skillsSection = document.querySelector('.skills');
if (skillsSection) {
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkills();
                skillsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    skillsObserver.observe(skillsSection);
}

// Counter animation for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat h3');
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current) + '+';
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target + '+';
            }
        };
        
        updateCounter();
    });
}

// Trigger counter animation when about section is visible
const aboutSection = document.querySelector('.about');
if (aboutSection) {
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                aboutObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    aboutObserver.observe(aboutSection);
}

// Add hover effects to project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add click effects to buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Initialize all animations when page loads
window.addEventListener('load', () => {
    // Add fade-in class to all sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
    
    // Smooth reveal of hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        setTimeout(() => {
            heroContent.style.opacity = '0';
            heroContent.style.transform = 'translateY(30px)';
            heroContent.style.transition = 'all 1s ease';
            
            setTimeout(() => {
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
            }, 100);
        }, 500);
    }
}); 

// AI Agent Dynamic Name Effect
function createDynamicNameEffect() {
    const nameElement = document.getElementById('dynamicName');
    const originalName = 'Suraj Kumar';
    const glitchCharacters = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    // Set data attribute for CSS glitch effect
    nameElement.setAttribute('data-text', originalName);
    
    // Create glitch effect
    function glitchText() {
        let glitchedName = '';
        for (let i = 0; i < originalName.length; i++) {
            if (Math.random() < 0.1) {
                glitchedName += glitchCharacters[Math.floor(Math.random() * glitchCharacters.length)];
            } else {
                glitchedName += originalName[i];
            }
        }
        nameElement.textContent = glitchedName;
        
        setTimeout(() => {
            nameElement.textContent = originalName;
        }, 100);
    }
    
    // Trigger glitch effect periodically
    setInterval(glitchText, 3000);
    
    // Add hover effect
    nameElement.addEventListener('mouseenter', () => {
        nameElement.style.animation = 'glitch 0.5s infinite';
    });
    
    nameElement.addEventListener('mouseleave', () => {
        nameElement.style.animation = 'glitch 3s infinite';
    });
}

// AI Agent Status Updates with Percentage Control
function updateAIStatus() {
    const statusItems = document.querySelectorAll('.status-item');
    const processingText = document.querySelector('.processing-text');
    const processingPercentage = document.querySelector('.processing-percentage');
    const processingFill = document.querySelector('.processing-fill');
    
    const statusMessages = [
        'NEURAL NET: ONLINE',
        'PROCESSING: OPTIMAL',
        'MEMORY: STABLE',
        'CONNECTIONS: SECURE',
        'AI CORE: ACTIVE',
        'LEARNING: ENABLED'
    ];
    
    const processingMessages = [
        'INITIALIZING PERSONALITY MATRIX...',
        'ANALYZING SKILL PATTERNS...',
        'PROCESSING EXPERIENCE DATA...',
        'OPTIMIZING NEURAL PATHWAYS...',
        'SYNCHRONIZING KNOWLEDGE BASE...',
        'READY FOR INTERACTION...'
    ];
    
    let statusIndex = 0;
    let processingIndex = 0;
    let percentage = 0;
    let isIncreasing = true;
    
    // Control percentage and loading animation
    function updatePercentage() {
        if (isIncreasing) {
            percentage += 2;
            if (percentage >= 100) {
                percentage = 100;
                isIncreasing = false;
            }
        } else {
            percentage -= 2;
            if (percentage <= 0) {
                percentage = 0;
                isIncreasing = true;
            }
        }
        
        if (processingPercentage) {
            processingPercentage.textContent = Math.round(percentage) + '%';
        }
        
        if (processingFill) {
            processingFill.style.width = percentage + '%';
        }
    }
    
    // Update percentage every 60ms (16.67 FPS for smooth animation)
    setInterval(updatePercentage, 60);
    
    setInterval(() => {
        statusItems[1].textContent = statusMessages[statusIndex];
        statusIndex = (statusIndex + 1) % statusMessages.length;
    }, 4000);
    
    setInterval(() => {
        processingText.textContent = processingMessages[processingIndex];
        processingIndex = (processingIndex + 1) % processingMessages.length;
    }, 3000);
}

// Matrix Rain Effect
function createMatrixRain() {
    const matrixContainer = document.querySelector('.matrix-rain');
    if (!matrixContainer) return;
    
    const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const columns = Math.floor(window.innerWidth / 20);
    
    for (let i = 0; i < columns; i++) {
        const column = document.createElement('div');
        column.style.position = 'absolute';
        column.style.left = i * 20 + 'px';
        column.style.top = '-100px';
        column.style.color = '#00ff00';
        column.style.fontSize = '14px';
        column.style.fontFamily = 'monospace';
        column.style.opacity = '0.3';
        column.style.animation = `matrix-fall ${5 + Math.random() * 5}s linear infinite`;
        column.style.animationDelay = Math.random() * 5 + 's';
        
        let text = '';
        for (let j = 0; j < 20; j++) {
            text += characters[Math.floor(Math.random() * characters.length)] + '<br>';
        }
        column.innerHTML = text;
        
        matrixContainer.appendChild(column);
    }
}

// AI Scan Effect
function createAIScanEffect() {
    const scanLine = document.querySelector('.scan-line');
    if (!scanLine) return;
    
    // Create multiple scan lines
    for (let i = 0; i < 3; i++) {
        const newScanLine = scanLine.cloneNode(true);
        newScanLine.style.animationDelay = i * 0.7 + 's';
        scanLine.parentNode.appendChild(newScanLine);
    }
}

// Interactive AI Responses
function createAIInteractions() {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        section.addEventListener('mouseenter', () => {
            const statusBar = document.querySelector('.ai-text');
            if (statusBar) {
                statusBar.textContent = 'ANALYZING SECTION...';
                setTimeout(() => {
                    statusBar.textContent = 'AI AGENT ACTIVE';
                }, 1000);
            }
        });
    });
    
    // Add click effects to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const processingText = document.querySelector('.processing-text');
            if (processingText) {
                processingText.textContent = 'PROCESSING REQUEST...';
                setTimeout(() => {
                    processingText.textContent = 'REQUEST COMPLETED';
                    setTimeout(() => {
                        processingText.textContent = 'INITIALIZING PERSONALITY MATRIX...';
                    }, 1000);
                }, 1500);
            }
        });
    });
}

// AI Agent Voice Simulation
function simulateAIVoice() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    function createBeep(frequency, duration) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    }
    
    // Create beep on certain interactions
    document.addEventListener('click', () => {
        if (Math.random() < 0.3) {
            createBeep(800 + Math.random() * 400, 0.1);
        }
    });
}

// Initialize all AI effects
document.addEventListener('DOMContentLoaded', () => {
    createDynamicNameEffect();
    updateAIStatus();
    createMatrixRain();
    createAIScanEffect();
    createAIInteractions();
    
    // Initialize voice simulation after user interaction
    document.addEventListener('click', () => {
        simulateAIVoice();
    }, { once: true });
});

// Enhanced scroll effects for AI theme
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
        
        // Add parallax to tech overlay
        const techOverlay = document.querySelector('.tech-overlay');
        if (techOverlay) {
            techOverlay.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    }
    
    // Update AI status based on scroll
    const statusItems = document.querySelectorAll('.status-item');
    if (statusItems.length > 0) {
        const scrollPercentage = (scrolled / (document.body.scrollHeight - window.innerHeight)) * 100;
        statusItems[0].textContent = `SCROLL: ${Math.round(scrollPercentage)}%`;
    }
}); 

// Teddy Bear Cursor Effect with Text-to-Speech
function initTeddyCursor() {
    const teddies = document.querySelectorAll('.teddy');
    const speechBubble = document.getElementById('teddySpeech');
    const speechText = document.getElementById('speechText');
    
    // Initialize Speech Synthesis
    const synth = window.speechSynthesis;
    let currentUtterance = null;
    
    // Ensure voices are loaded (important for consistent speech)
    let voicesLoaded = false;
    function loadVoices() {
        const voices = synth.getVoices();
        if (voices.length > 0) {
            voicesLoaded = true;
            console.log('✅ Voices loaded:', voices.length);
        }
    }
    
    // Load voices immediately
    loadVoices();
    
    // Also listen for voiceschanged event (some browsers need this)
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    // Section messages
    const sectionMessages = {
        'home': "Hey I'm your teddy, How may I assist you?",
        'about': "Hey! You're learning about me!",
        'experience': "Hey! You're watching my Experience!",
        'skills': "Check out my awesome Skills!",
        'projects': "Look at my cool Projects!",
        'responsibilities': "See my Positions of Responsibility!",
        'contact': "Let's get in touch!"
    };
    
    // Messages with emojis for display (emojis don't speak well)
    const sectionMessagesDisplay = {
        'home': "Hey I'm your teddy, How may I assist you? 🐻",
        'about': "Hey! You're learning about me! 📖",
        'experience': "Hey! You're watching my Experience! 💼",
        'skills': "Check out my awesome Skills! 🚀",
        'projects': "Look at my cool Projects! 💻",
        'responsibilities': "See my Positions of Responsibility! 🌟",
        'contact': "Let's get in touch! 📧"
    };
    
    let currentSection = 'home';
    let speechTimeout = null;
    
    // Show initial message
    setTimeout(() => {
        showMessage(sectionMessages['home'], sectionMessagesDisplay['home']);
    }, 1000);
    
    // Track mouse movement
    document.addEventListener('mousemove', (event) => {
        teddies.forEach(teddy => {
            teddy.style.left = event.clientX + 'px';
            teddy.style.top = event.clientY + 'px';
        });
    });
    
    // Observe sections for intersection
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-80px 0px -80px 0px'
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                console.log('Section detected:', sectionId); // Debug log
                if (sectionId && sectionId !== currentSection && sectionMessages[sectionId]) {
                    currentSection = sectionId;
                    console.log('Showing message for:', sectionId); // Debug log
                    showMessage(sectionMessages[sectionId], sectionMessagesDisplay[sectionId]);
                }
            }
        });
    }, observerOptions);
    
    // Observe all sections
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Also observe hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.id = 'home';
        sectionObserver.observe(heroSection);
    }
    
    // Function to speak the message
    function speakMessage(text) {
        // Cancel any ongoing speech
        if (synth.speaking) {
            synth.cancel();
        }
        
        // Check if speech synthesis is supported
        if ('speechSynthesis' in window) {
            // Wait a bit to ensure voices are loaded and speech is ready
            setTimeout(() => {
                // Create a new utterance
                currentUtterance = new SpeechSynthesisUtterance(text);
                
                // Configure voice properties for natural, pleasant sound
                currentUtterance.rate = 1.0;  // Speed (0.1 to 10) - normal, natural pace
                currentUtterance.pitch = 1.0; // Pitch (0 to 2) - normal, natural pitch
                currentUtterance.volume = 0.85; // Volume (0 to 1) - comfortable listening level
                
                // Try to get a suitable voice
                const voices = synth.getVoices();
                
                // Voice selection priority for natural voice:
                // 1. Try Google US English (most natural)
                // 2. Try Microsoft voices (good quality)
                // 3. Try any clear English voice
                // 4. Fallback to default
                const preferredVoice = 
                    voices.find(voice => voice.name.includes('Google US English')) ||
                    voices.find(voice => voice.name.includes('Google') && voice.lang.startsWith('en')) ||
                    voices.find(voice => voice.name.includes('Microsoft Zira') || voice.name.includes('Microsoft David')) ||
                    voices.find(voice => voice.lang === 'en-US') ||
                    voices.find(voice => voice.lang.startsWith('en')) ||
                    voices[0];
                
                if (preferredVoice) {
                    currentUtterance.voice = preferredVoice;
                    console.log('🎤 Using voice:', preferredVoice.name);
                }
                
                // Optional: Add event listeners
                currentUtterance.onstart = () => {
                    console.log('🐻 Teddy is speaking...');
                };
                
                currentUtterance.onend = () => {
                    console.log('🐻 Teddy finished speaking');
                };
                
                currentUtterance.onerror = (event) => {
                    console.error('Speech synthesis error:', event.error);
                    // Retry once if interrupted or canceled
                    if (event.error === 'interrupted' || event.error === 'canceled') {
                        console.log('🔄 Retrying speech...');
                        setTimeout(() => {
                            if (!synth.speaking) {
                                synth.speak(currentUtterance);
                            }
                        }, 100);
                    }
                };
                
                // Resume if paused (fix for some browsers)
                if (synth.paused) {
                    synth.resume();
                }
                
                // Speak the message
                synth.speak(currentUtterance);
                
                console.log('🎙️ Speaking:', text);
            }, 100); // Small delay to ensure speech synthesis is ready
        } else {
            console.warn('Speech synthesis not supported in this browser');
        }
    }
    
    function showMessage(speechMessage, displayMessage) {
        if (speechText && speechBubble) {
            // Clear existing timeout
            if (speechTimeout) {
                clearTimeout(speechTimeout);
            }
            
            // Update text and show bubble
            speechText.textContent = displayMessage;
            speechBubble.classList.add('show');
            
            // Speak the message (without emojis)
            speakMessage(speechMessage);
            
            // Hide after 3 seconds
            speechTimeout = setTimeout(() => {
                speechBubble.classList.remove('show');
            }, 3000);
        }
    }
}

// Initialize teddy bear cursor when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize welcome animation first
    initWelcomeAnimation();
    
    // Initialize teddy bear cursor
    initTeddyCursor();
    
    // Initialize contact form
    initContactForm();
    
    // Initialize download button
    initDownloadButton();
    
    // Initialize animated stars
    initAnimatedStars();
}); 

// Download CV Button Enhancement
function initDownloadButton() {
    const downloadBtn = document.querySelector('.btn-secondary');
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            // Add loading state
            this.classList.add('downloading');
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner"></i> Downloading...';
            
            // Simulate download delay for better UX
            setTimeout(() => {
                // Remove loading state
                this.classList.remove('downloading');
                this.innerHTML = originalText;
                
                // Show success notification
                showNotification('CV downloaded successfully! 📄', 'success');
            }, 1500);
        });
    }
}

// Animated Stars Background
function initAnimatedStars() {
    const starsContainer = document.getElementById('starsContainer');
    if (!starsContainer) return;
    
    const numStars = 150; // Number of twinkling stars
    const numShootingStars = 3; // Number of shooting stars
    
    // Create twinkling stars
    for (let i = 0; i < numStars; i++) {
        createStar();
    }
    
    // Create shooting stars periodically
    setInterval(() => {
        createShootingStar();
    }, 3000);
    
    function createStar() {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random star properties
        const sizes = ['small', 'medium', 'large'];
        const colors = ['white', 'blue', 'gold'];
        const size = sizes[Math.floor(Math.random() * sizes.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        star.classList.add(size, color);
        
        // Random position
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        
        // Random animation duration
        const duration = 2 + Math.random() * 4; // 2-6 seconds
        const delay = Math.random() * 2; // 0-2 seconds delay
        
        star.style.left = x + 'px';
        star.style.top = y + 'px';
        star.style.setProperty('--duration', duration + 's');
        star.style.animationDelay = delay + 's';
        
        starsContainer.appendChild(star);
        
        // Remove and recreate star periodically for variety
        setTimeout(() => {
            if (star.parentNode) {
                star.parentNode.removeChild(star);
                createStar();
            }
        }, (duration + delay) * 1000 + 5000);
    }
    
    function createShootingStar() {
        const shootingStar = document.createElement('div');
        shootingStar.className = 'shooting-star';
        
        // Random starting position (left side of screen)
        const startY = Math.random() * window.innerHeight * 0.5; // Top half of screen
        const duration = 2 + Math.random() * 2; // 2-4 seconds
        
        shootingStar.style.top = startY + 'px';
        shootingStar.style.setProperty('--duration', duration + 's');
        
        starsContainer.appendChild(shootingStar);
        
        // Remove shooting star after animation
        setTimeout(() => {
            if (shootingStar.parentNode) {
                shootingStar.parentNode.removeChild(shootingStar);
            }
        }, duration * 1000);
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        // Clear existing stars and recreate
        starsContainer.innerHTML = '';
        for (let i = 0; i < numStars; i++) {
            createStar();
        }
    });
}