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
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
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

// Cursor Movement Effects
let cursorTrail, cursorParticles = [], cursorRipples = [];
let isMoving = false;
let moveTimeout;

function initCursorEffects() {
    // Create cursor trail
    cursorTrail = document.createElement('div');
    cursorTrail.className = 'cursor-trail';
    document.body.appendChild(cursorTrail);

    // Create cursor detector overlay
    const cursorDetector = document.createElement('div');
    cursorDetector.className = 'cursor-detector';
    document.body.appendChild(cursorDetector);

    // Track cursor movement
    let lastX = 0, lastY = 0;
    let moveCount = 0;

    document.addEventListener('mousemove', (e) => {
        const currentX = e.clientX;
        const currentY = e.clientY;
        
        // Check if cursor actually moved
        if (Math.abs(currentX - lastX) > 2 || Math.abs(currentY - lastY) > 2) {
            moveCount++;
            
            if (!isMoving) {
                isMoving = true;
                activateCursorEffects();
            }
            
            // Update cursor trail position
            cursorTrail.style.left = currentX - 10 + 'px';
            cursorTrail.style.top = currentY - 10 + 'px';
            cursorTrail.classList.add('active');
            
            // Create particles every few movements
            if (moveCount % 3 === 0) {
                createCursorParticle(currentX, currentY);
            }
            
            // Create ripple effect occasionally
            if (moveCount % 10 === 0) {
                createCursorRipple(currentX, currentY);
            }
            
            // Create floating particles
            if (moveCount % 5 === 0) {
                createFloatingParticle(currentX, currentY);
            }
            
            lastX = currentX;
            lastY = currentY;
            
            // Reset movement timeout
            clearTimeout(moveTimeout);
            moveTimeout = setTimeout(() => {
                isMoving = false;
                deactivateCursorEffects();
            }, 1000); // Deactivate after 1 second of no movement
        }
    });

    // Handle cursor leaving window
    document.addEventListener('mouseleave', () => {
        isMoving = false;
        deactivateCursorEffects();
    });
}

function activateCursorEffects() {
    // Activate tech overlay
    const techOverlay = document.querySelector('.tech-overlay');
    if (techOverlay) {
        techOverlay.classList.add('cursor-active');
        techOverlay.classList.remove('cursor-inactive');
    }
    
    // Activate circuit pattern
    const circuitPattern = document.querySelector('.circuit-pattern');
    if (circuitPattern) {
        circuitPattern.classList.add('cursor-active');
    }
}

function deactivateCursorEffects() {
    // Deactivate cursor trail
    if (cursorTrail) {
        cursorTrail.classList.remove('active');
    }
    
    // Deactivate tech overlay
    const techOverlay = document.querySelector('.tech-overlay');
    if (techOverlay) {
        techOverlay.classList.remove('cursor-active');
        techOverlay.classList.add('cursor-inactive');
    }
    
    // Deactivate circuit pattern
    const circuitPattern = document.querySelector('.circuit-pattern');
    if (circuitPattern) {
        circuitPattern.classList.remove('cursor-active');
    }
}

function createCursorParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'cursor-particle';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    document.body.appendChild(particle);
    
    cursorParticles.push(particle);
    
    // Remove particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
        cursorParticles = cursorParticles.filter(p => p !== particle);
    }, 1000);
}

function createCursorRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'cursor-ripple';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    document.body.appendChild(ripple);
    
    cursorRipples.push(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
        cursorRipples = cursorRipples.filter(r => r !== ripple);
    }, 1000);
}

function createFloatingParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'floating-particle';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    document.body.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, 3000);
}

// Initialize cursor effects when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    
    // Initialize cursor effects
    initCursorEffects();
    
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