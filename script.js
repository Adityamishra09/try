// DOM Elements
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
const projectGrid = document.querySelector('.project-grid');

// Sample projects data
const projects = [
    {
        title: "Project 1",
        description: "A full-stack web application built with React and Node.js",
        image: "./image/aditya1.png", // Use placeholder image
        technologies: ["React", "Node.js", "MongoDB"],
        github: "#", // Replace with actual GitHub link
        demo: "#" // Replace with actual demo link
    },
    {
        title: "Project 2",
        description: "A responsive portfolio website with modern design",
        image: "./image/aditya1.png", // Use placeholder image
        technologies: ["HTML", "CSS", "JavaScript"],
        github: "#", // Replace with actual GitHub link
        demo: "#" // Replace with actual demo link
    },
    {
        title: "Project 3",
        description: "Description for Project 3.",
        image: "./image/aditya1.png", // Use placeholder image
        technologies: ["Technology 1", "Technology 2"],
        github: "#", // Replace with actual GitHub link
        demo: "#" // Replace with actual demo link
    },
    {
        title: "Project 4",
        description: "Description for Project 4.",
        image: "./image/aditya1.png", // Use placeholder image
        technologies: ["Technology A", "Technology B"],
        github: "#", // Replace with actual GitHub link
        demo: "#" // Replace with actual demo link
    },
    {
        title: "Project 5",
        description: "Description for Project 5.",
        image: "./image/aditya1.png", // Use placeholder image
        technologies: ["Tech X", "Tech Y", "Tech Z"],
        github: "#", // Replace with actual GitHub link
        demo: "#" // Replace with actual demo link
    },
    {
        title: "Project 6",
        description: "Description for Project 6.",
        image: "./image/aditya1.png", // Use placeholder image
        technologies: ["Framework P", "Library Q"],
        github: "#", // Replace with actual GitHub link
        demo: "#" // Replace with actual demo link
    }
];

// Mobile Navigation Toggle
navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu after clicking
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
});

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Hero section animation
gsap.from('.hero-content', {
    duration: 1,
    y: 100,
    opacity: 0,
    ease: 'power4.out'
});

// About section animation
gsap.from('.about-content', {
    scrollTrigger: {
        trigger: '.about',
        start: 'top 80%'
    },
    duration: 1,
    y: 50,
    opacity: 0,
    ease: 'power3.out'
});

// Skills animation
gsap.from('.skill-tag', {
    scrollTrigger: {
        trigger: '.skills',
        start: 'top 80%'
    },
    duration: 0.5,
    y: 20,
    opacity: 0,
    stagger: 0.1,
    ease: 'back.out(1.7)'
});

// Projects animation
gsap.from('.project-card', {
    scrollTrigger: {
        trigger: '.projects',
        start: 'top 80%'
    },
    duration: 0.8,
    y: 50,
    opacity: 0,
    stagger: 0.2,
    ease: 'power3.out'
});

// Generate project cards
function createProjectCard(project) {
    return `
        <div class="project-card">
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}">
            </div>
            <div class="project-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="project-links">
                    <a href="${project.github}" target="_blank" class="btn primary">GitHub</a>
                    <a href="${project.demo}" target="_blank" class="btn secondary">Live Demo</a>
                </div>
            </div>
        </div>
    `;
}

// Render projects with duplicates for infinite scroll
function renderProjects() {
    const projectGrid = document.querySelector('.project-grid');
    if (!projectGrid) return;

    // Create initial set of cards
    const initialCards = projects.map(project => createProjectCard(project)).join('');
    
    // Create duplicate set for infinite scroll
    const duplicateCards = projects.map(project => createProjectCard(project)).join('');
    
    // Combine both sets
    projectGrid.innerHTML = initialCards + duplicateCards;
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProjects();
    initProjectsAutoScroll();
    
    // Reinitialize on window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(initProjectsAutoScroll, 250);
    });
});

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 8px;
        color: white;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
    }

    .notification.show {
        transform: translateY(0);
        opacity: 1;
    }

    .notification.success {
        background: #10B981;
    }

    .notification.error {
        background: #EF4444;
    }

    .notification.info {
        background: #3B82F6;
    }

    .project-card {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
    }

    .project-card:hover {
        transform: translateY(-5px);
    }

    .project-image {
        width: 100%;
        height: 200px;
        overflow: hidden;
    }

    .project-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .project-content {
        padding: 1.5rem;
    }

    .project-tech {
        margin: 1rem 0;
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .tech-tag {
        background: var(--section-bg);
        padding: 0.25rem 0.75rem;
        border-radius: 15px;
        font-size: 0.8rem;
    }

    .project-links {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
    }

    .project-links .btn {
        flex: 1;
        text-align: center;
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
    }
`;
document.head.appendChild(style);

// NEW: Statistics Counting Animation
function animateNumber(element, target) {
    let obj = { value: 0 };
    gsap.to(obj, { 
        value: target, 
        duration: 2, // Default duration (2 seconds) - adjust this to change speed
        roundProps: 'value',
        onUpdate: function() {
            element.textContent = Math.floor(obj.value) + '+';
        }
    });
}

// Trigger stats animation when the About section is visible
const statItems = document.querySelectorAll('.stat-item');
const aboutStatsSection = document.querySelector('.about-stats');

if (aboutStatsSection && statItems.length > 0) {
    ScrollTrigger.create({
        trigger: aboutStatsSection,
        start: 'top 80%', // When the top of the section is 80% from the viewport top
        toggleActions: 'play none none none', // Play the animation once
        onEnter: () => {
            statItems.forEach(item => {
                const numberSpan = item.querySelector('.stat-number');
                if (numberSpan) {
                    // Get the target number from the text content (e.g., '10+')
                    const target = parseInt(numberSpan.textContent.replace('+', ''));
                    if (!isNaN(target)) {
                        // Temporarily set text to 0+ to prepare for animation
                         numberSpan.textContent = '0+'; 
                        animateNumber(numberSpan, target);
                    }
                }
            });
        }
    });
}

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formStatus = document.querySelector('.form-status');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Show loading state
        contactForm.classList.add('sending');
        submitBtn.classList.add('loading');
        formStatus.textContent = '';
        
        try {
            // Get form data
            const formData = new FormData(contactForm);
            
            // Log form data for debugging
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }
            
            // Submit form
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData
            });
            
            // Log response for debugging
            console.log('Response status:', response.status);
            const responseText = await response.text();
            console.log('Response text:', responseText);
            
            if (response.ok) {
                // Clear form immediately
                contactForm.reset();
                
                // Reset all form fields to initial state
                const inputs = contactForm.querySelectorAll('input, textarea');
                inputs.forEach(input => {
                    input.value = '';
                    // Reset label position
                    const label = input.nextElementSibling;
                    if (label && label.tagName === 'LABEL') {
                        label.classList.remove('active');
                    }
                });
                
                // Show success state
                submitBtn.classList.remove('loading');
                submitBtn.classList.add('success');
                formStatus.textContent = 'Message sent successfully! You will receive an auto-reply shortly.';
                formStatus.classList.add('success');
                
                // Reset button and form state after 2 seconds
                setTimeout(() => {
                    submitBtn.classList.remove('success');
                    contactForm.classList.remove('sending');
                    formStatus.textContent = '';
                    formStatus.classList.remove('success');
                }, 2000);
            } else {
                console.error('Form submission failed:', responseText);
                throw new Error('Failed to send message. Please try again.');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            // Show error state
            submitBtn.classList.remove('loading');
            formStatus.textContent = error.message || 'Failed to send message. Please try again.';
            formStatus.classList.add('error');
            contactForm.classList.remove('sending');
            
            // Reset error state after 3 seconds
            setTimeout(() => {
                formStatus.textContent = '';
                formStatus.classList.remove('error');
            }, 3000);
        }
    });
}

// Projects Auto-scroll
function initProjectsAutoScroll() {
    const projectGrid = document.querySelector('.project-grid');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (!projectGrid || projectCards.length === 0) return;
    
    // Clear any existing clones
    const existingClones = projectGrid.querySelectorAll('.project-card.clone');
    existingClones.forEach(clone => clone.remove());
    
    // Clone cards for infinite scroll effect
    const cardsToClone = Array.from(projectCards).slice(0, Math.ceil(projectCards.length / 2));
    cardsToClone.forEach(card => {
        const clone = card.cloneNode(true);
        clone.classList.add('clone');
        projectGrid.appendChild(clone);
    });
    
    // Optimize animation performance
    projectGrid.style.willChange = 'transform';
    
    // Handle animation reset
    let isAnimating = true;
    projectGrid.addEventListener('animationend', () => {
        if (!isAnimating) return;
        
        // Reset animation without visual glitch
        requestAnimationFrame(() => {
            projectGrid.style.animation = 'none';
            projectGrid.offsetHeight; // Force reflow
            projectGrid.style.animation = null;
        });
    });
    
    // Pause/Resume on hover with smooth transition
    projectGrid.addEventListener('mouseenter', () => {
        isAnimating = false;
        projectGrid.style.animationPlayState = 'paused';
    });
    
    projectGrid.addEventListener('mouseleave', () => {
        isAnimating = true;
        projectGrid.style.animationPlayState = 'running';
    });
    
    // Adjust animation speed based on number of cards
    const baseDuration = 40; // Base duration in seconds
    const cardCount = projectCards.length;
    const duration = Math.max(baseDuration, cardCount * 3); // At least 3 seconds per card
    projectGrid.style.animationDuration = `${duration}s`;
    
    // Handle visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            projectGrid.style.animationPlayState = 'paused';
        } else {
            projectGrid.style.animationPlayState = 'running';
        }
    });
} 