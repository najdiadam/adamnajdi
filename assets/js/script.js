// Enhanced Mobile Navigation Toggle and Website Functionality
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navbar = document.getElementById('navbar');
    
    // Enhanced navbar scroll effect with hide/show functionality
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Add scrolled class for styling
        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll (only on desktop)
        if (window.innerWidth > 768) {
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Mobile navigation toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animate hamburger menu
            const bars = navToggle.querySelectorAll('.bar');
            bars.forEach((bar, index) => {
                if (navMenu.classList.contains('active')) {
                    if (index === 0) bar.style.transform = 'rotate(45deg) translate(8px, 8px)';
                    else if (index === 1) bar.style.opacity = '0';
                    else bar.style.transform = 'rotate(-45deg) translate(8px, -8px)';
                } else {
                    bar.style.transform = 'none';
                    bar.style.opacity = '1';
                }
            });
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (navToggle) {
                    const bars = navToggle.querySelectorAll('.bar');
                    bars.forEach(bar => {
                        bar.style.transform = 'none';
                        bar.style.opacity = '1';
                    });
                }
            }
        });
    });
    
    // Set active nav link based on current page
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            if (linkHref === currentPage || 
                (currentPage === '' && linkHref === 'index.html') ||
                (currentPage === 'index.html' && linkHref === 'index.html')) {
                link.classList.add('active');
            }
        });
    }
    
    setActiveNavLink();
    
    // FIXED: Hero Photo Loading
    function initializeHeroPhoto() {
        const heroPhoto = document.querySelector('.hero-photo');
        const photoPlaceholder = document.querySelector('.photo-placeholder');
        
        if (heroPhoto && photoPlaceholder) {
            // Create image element to test loading
            const testImg = new Image();
            testImg.onload = function() {
                // Image loaded successfully, hide placeholder
                photoPlaceholder.style.display = 'none';
                heroPhoto.style.backgroundImage = `url('assets/images/adam-photo.jpg')`;
                heroPhoto.style.backgroundSize = 'cover';
                heroPhoto.style.backgroundPosition = 'center';
            };
            testImg.onerror = function() {
                // Image failed to load, keep placeholder visible
                console.log('Hero photo failed to load, keeping placeholder');
            };
            testImg.src = 'assets/images/adam-photo.jpg';
        }
    }
    
    // Initialize hero photo
    initializeHeroPhoto();
    
    // Photo error handling for navbar
    const navPhoto = document.querySelector('.nav-photo');
    if (navPhoto) {
        navPhoto.addEventListener('error', function() {
            this.style.display = 'none';
            const fallback = this.nextElementSibling;
            if (fallback && fallback.classList.contains('photo-fallback')) {
                fallback.style.display = 'flex';
            }
        });
        
        navPhoto.addEventListener('load', function() {
            const fallback = this.nextElementSibling;
            if (fallback && fallback.classList.contains('photo-fallback')) {
                fallback.style.display = 'none';
            }
        });
    }
    
    // Enhanced scroll animations with Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Enhanced stat counter animation
    function animateStats() {
        const stats = document.querySelectorAll('.animate-stat');
        
        const statsObserverOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const stat = entry.target;
                    const numberElement = stat.querySelector('.stat-number');
                    const targetNumber = parseInt(stat.dataset.number);
                    const suffix = stat.dataset.suffix || '';
                    
                    // Add counting class for animation
                    stat.classList.add('counting');
                    
                    // Animate number counting
                    let currentNumber = 0;
                    const increment = targetNumber / 60; // 60 frames for smooth animation
                    const duration = 2000; // 2 seconds
                    const frameTime = duration / 60;
                    
                    const countInterval = setInterval(() => {
                        currentNumber += increment;
                        
                        if (currentNumber >= targetNumber) {
                            currentNumber = targetNumber;
                            clearInterval(countInterval);
                            
                            // Add pulse effect after counting completes
                            setTimeout(() => {
                                stat.classList.add('pulse');
                                setTimeout(() => {
                                    stat.classList.remove('pulse');
                                }, 2000);
                            }, 500);
                        }
                        
                        // Update the number display with proper formatting
                        if (suffix === '+') {
                            numberElement.textContent = Math.floor(currentNumber) + suffix;
                        } else {
                            numberElement.textContent = Math.floor(currentNumber) + suffix;
                        }
                    }, frameTime);
                    
                    // Only animate once
                    statsObserver.unobserve(entry.target);
                }
            });
        }, statsObserverOptions);
        
        stats.forEach(stat => statsObserver.observe(stat));
    }
    
    // Initialize stat animations
    animateStats();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 100; // Account for fixed navbar
                window.scrollTo({
                   top: offsetTop,
                   behavior: 'smooth'
               });
           }
       });
   });
   
   // Loading animation
   window.addEventListener('load', () => {
       document.body.style.opacity = '1';
       document.body.style.transition = 'opacity 0.5s ease';
       
       // Remove any existing preloader
       const preloader = document.querySelector('.preloader');
       if (preloader) {
           preloader.style.opacity = '0';
           setTimeout(() => {
               preloader.remove();
           }, 500);
       }
   });
   
   // Contact form handling
   const contactForm = document.querySelector('.contact-form');
   if (contactForm) {
       contactForm.addEventListener('submit', function(e) {
           e.preventDefault();
           
           // Get form data
           const formData = new FormData(this);
           const data = Object.fromEntries(formData);
           
           // Simple validation
           if (!data.name || !data.email || !data.subject || !data.message) {
               showNotification('Please fill in all required fields.', 'error');
               return;
           }
           
           // Email validation
           const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
           if (!emailRegex.test(data.email)) {
               showNotification('Please enter a valid email address.', 'error');
               return;
           }
           
           // Show loading state
           const submitBtn = this.querySelector('button[type="submit"]');
           const originalText = submitBtn.innerHTML;
           submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
           submitBtn.disabled = true;
           
           // Simulate form submission (replace with actual form handling)
           setTimeout(() => {
               showNotification('Thank you for your message! I\'ll get back to you within 24-48 hours.', 'success');
               this.reset();
               submitBtn.innerHTML = originalText;
               submitBtn.disabled = false;
           }, 2000);
       });
   }
   
   // Notification system
   function showNotification(message, type = 'info') {
       // Remove existing notification
       const existingNotification = document.querySelector('.notification');
       if (existingNotification) {
           existingNotification.remove();
       }
       
       // Create notification element
       const notification = document.createElement('div');
       notification.className = `notification notification-${type}`;
       notification.innerHTML = `
           <div class="notification-content">
               <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
               <span>${message}</span>
               <button class="notification-close">
                   <i class="fas fa-times"></i>
               </button>
           </div>
       `;
       
       // Add styles
       notification.style.cssText = `
           position: fixed;
           top: 100px;
           right: 20px;
           background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
           color: white;
           padding: 1rem 1.5rem;
           border-radius: 0.5rem;
           box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
           z-index: 9999;
           transform: translateX(400px);
           transition: transform 0.3s ease;
           max-width: 400px;
       `;
       
       document.body.appendChild(notification);
       
       // Animate in
       setTimeout(() => {
           notification.style.transform = 'translateX(0)';
       }, 100);
       
       // Close button functionality
       const closeBtn = notification.querySelector('.notification-close');
       closeBtn.addEventListener('click', () => {
           notification.style.transform = 'translateX(400px)';
           setTimeout(() => notification.remove(), 300);
       });
       
       // Auto-remove after 5 seconds
       setTimeout(() => {
           if (notification.parentNode) {
               notification.style.transform = 'translateX(400px)';
               setTimeout(() => notification.remove(), 300);
           }
       }, 5000);
   }
   
   // Enhanced hover effects for cards
   const cards = document.querySelectorAll('.highlight-card, .timeline-item, .research-card, .project-card, .volunteer-item, .about-card, .interest-card, .interest-item');
   cards.forEach(card => {
       card.addEventListener('mouseenter', function() {
           if (!this.style.transform.includes('translateY')) {
               this.style.transform = 'translateY(-5px)';
           }
       });
       card.addEventListener('mouseleave', function() {
           if (this.style.transform.includes('translateY(-5px)')) {
               this.style.transform = 'translateY(0)';
           }
       });
   });
   
   // Enhanced social button effects
   const socialBtns = document.querySelectorAll('.social-btn, .footer-social a');
   socialBtns.forEach(btn => {
       btn.addEventListener('mouseenter', function() {
           this.style.transform = 'translateY(-2px) scale(1.05)';
       });
       btn.addEventListener('mouseleave', function() {
           this.style.transform = 'translateY(0) scale(1)';
       });
   });
   
   // Parallax effect for hero section (performance optimized)
   let ticking = false;
   function updateParallax() {
       const scrolled = window.pageYOffset;
       const heroElements = document.querySelectorAll('.hero, .page-header');
       
       heroElements.forEach(element => {
           if (element && scrolled < element.offsetHeight) {
               element.style.transform = `translateY(${scrolled * 0.1}px)`;
           }
       });
       ticking = false;
   }
   
   window.addEventListener('scroll', () => {
       if (!ticking) {
           requestAnimationFrame(updateParallax);
           ticking = true;
       }
   });
   
   // Skill bars animation (if present)
   const skillBars = document.querySelectorAll('.skill-progress');
   if (skillBars.length > 0) {
       const skillObserver = new IntersectionObserver((entries) => {
           entries.forEach(entry => {
               if (entry.isIntersecting) {
                   const skillBar = entry.target;
                   skillBar.style.animation = 'fillSkill 2s ease-out forwards';
                   skillObserver.unobserve(entry.target);
               }
           });
       }, { threshold: 0.5 });
       
       skillBars.forEach(bar => skillObserver.observe(bar));
   }
   
   // Dynamic typing effect for hero subtitle (performance optimized)
   const heroSubtitle = document.querySelector('.hero-subtitle');
   if (heroSubtitle && window.innerWidth > 768) {
       const text = heroSubtitle.textContent;
       const words = text.split(' ');
       let currentWord = 0;
       
       // Only run on desktop to avoid performance issues
       const typingInterval = setInterval(() => {
           if (currentWord < words.length - 1) {
               currentWord++;
           } else {
               currentWord = 0;
           }
           
           // Add a subtle highlight effect to the current word
           const highlightedText = words.map((word, index) => {
               if (index === currentWord) {
                   return `<span style="color: var(--primary-color); transition: color 0.5s ease;">${word}</span>`;
               }
               return word;
           }).join(' ');
           
           heroSubtitle.innerHTML = highlightedText;
       }, 3000);
       
       // Clean up interval when page is hidden
       document.addEventListener('visibilitychange', () => {
           if (document.hidden) {
               clearInterval(typingInterval);
           }
       });
   }
   
   // Performance optimization: Throttle resize events
   let resizeTimeout;
   window.addEventListener('resize', () => {
       clearTimeout(resizeTimeout);
       resizeTimeout = setTimeout(() => {
           // Recalculate any size-dependent features
           setActiveNavLink();
           initializeHeroPhoto(); // Re-check photo loading on resize
       }, 250);
   });
});

// Set initial body opacity for loading animation
document.body.style.opacity = '0';

// Utility function for throttling events
function throttle(func, wait) {
   let timeout;
   return function executedFunction(...args) {
       const later = () => {
           clearTimeout(timeout);
           func.apply(this, args);
       };
       clearTimeout(timeout);
       timeout = setTimeout(later, wait);
   };
}

// Utility function for debouncing events
function debounce(func, wait) {
   let timeout;
   return function executedFunction(...args) {
       const later = () => {
           clearTimeout(timeout);
           func.apply(this, args);
       };
       clearTimeout(timeout);
       timeout = setTimeout(later, wait);
   };
}

// Add scroll-to-top functionality
const scrollToTop = () => {
   window.scrollTo({
       top: 0,
       behavior: 'smooth'
   });
};

// Show scroll-to-top button when scrolled down
window.addEventListener('scroll', throttle(() => {
   const scrollBtn = document.querySelector('.scroll-to-top');
   if (scrollBtn) {
       if (window.scrollY > 300) {
           scrollBtn.style.opacity = '1';
           scrollBtn.style.pointerEvents = 'auto';
       } else {
           scrollBtn.style.opacity = '0';
           scrollBtn.style.pointerEvents = 'none';
       }
   }
}, 100));

// Enhanced error handling
window.addEventListener('error', (e) => {
   console.error('JavaScript error:', e.error);
});

// Service Worker registration (optional, for PWA features)
if ('serviceWorker' in navigator) {
   window.addEventListener('load', () => {
       // Register service worker for offline functionality (if you create one)
       // navigator.serviceWorker.register('/sw.js');
   });
}
