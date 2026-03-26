import translations from './i18n.js';

// ═══════════════ LOCALE MANAGEMENT ═══════════════
let currentLang = localStorage.getItem('lang') || 'en';
let currentRoles = translations[currentLang].roles;

function applyTranslations(lang) {
    const t = translations[lang];
    if (!t) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key] !== undefined) el.textContent = t[key];
    });

    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        if (t[key] !== undefined) el.innerHTML = t[key];
    });

    document.documentElement.lang = lang === 'vi' ? 'vi' : 'en';
    currentRoles = t.roles;

    const langLabel = document.querySelector('.lang-label');
    if (langLabel) langLabel.textContent = lang === 'vi' ? 'EN' : 'VI';
}

applyTranslations(currentLang);

const langToggle = document.getElementById('lang-toggle');
if (langToggle) {
    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'vi' ? 'en' : 'vi';
        localStorage.setItem('lang', currentLang);
        applyTranslations(currentLang);
        roleIndex = 0;
        charIndex = 0;
        isDeleting = false;
    });
}

// ═══════════════ INITIALIZE AOS ═══════════════
AOS.init({
    duration: 800,
    once: true,
    offset: 80,
    easing: 'ease-out-cubic',
});

// ═══════════════ PARTICLE NETWORK BACKGROUND ═══════════════
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouseX = 0, mouseY = 0;
let animationId;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

const particleColors = [
    { r: 99, g: 102, b: 241 },   // indigo
    { r: 56, g: 189, b: 248 },   // sky blue
    { r: 45, g: 212, b: 191 },   // teal
    { r: 139, g: 92, b: 246 },   // violet
    { r: 244, g: 114, b: 182 },  // pink
];

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.baseRadius = Math.random() * 1 + 0.8;
        this.radius = this.baseRadius;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.color = particleColors[Math.floor(Math.random() * particleColors.length)];
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulsePhase = Math.random() * Math.PI * 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Pulse effect
        this.pulsePhase += this.pulseSpeed;
        this.radius = this.baseRadius + Math.sin(this.pulsePhase) * 0.5;

        // Mouse attraction & glow near cursor
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 250) {
            this.x += dx * 0.005;
            this.y += dy * 0.005;
            // Boost size & opacity when near mouse
            const proximity = 1 - dist / 250;
            this.radius = this.baseRadius + proximity * 1.5;
            this.opacity = Math.min(0.9, this.opacity + proximity * 0.3);
        }

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
        const { r, g, b } = this.color;
        // Glow effect
        ctx.shadowBlur = 4;
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${this.opacity * 0.5})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity})`;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

const particleCount = Math.min(60, Math.floor(window.innerWidth / 22));
for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 160) {
                const opacity = (1 - dist / 160) * 0.25;
                const ci = particles[i].color;
                const cj = particles[j].color;
                const r = Math.round((ci.r + cj.r) / 2);
                const g = Math.round((ci.g + cj.g) / 2);
                const b = Math.round((ci.b + cj.b) / 2);
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }
        }
    }

    // Mouse connection lines — draw lines from cursor to nearby particles
    for (let i = 0; i < particles.length; i++) {
        const dx = mouseX - particles[i].x;
        const dy = mouseY - particles[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
            const opacity = (1 - dist / 140) * 0.3;
            const c = particles[i].color;
            ctx.beginPath();
            ctx.moveTo(mouseX, mouseY);
            ctx.lineTo(particles[i].x, particles[i].y);
            ctx.strokeStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${opacity})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    drawConnections();
    animationId = requestAnimationFrame(animateParticles);
}

animateParticles();

// ═══════════════ SCROLL PROGRESS BAR ═══════════════
const scrollProgress = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = scrollPercent + '%';
});

// ═══════════════ CUSTOM CURSOR ═══════════════
const cursor = document.getElementById('custom-cursor');
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

document.addEventListener('mousedown', () => cursor.style.transform = 'scale(0.7)');
document.addEventListener('mouseup', () => cursor.style.transform = 'scale(1)');

document.querySelectorAll('a, button, .project-card, .skill-tag, .marquee-tag').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(2)';
        cursor.style.opacity = '0.3';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursor.style.opacity = '0.5';
    });
});

// ═══════════════ 3D TILT EFFECT ═══════════════
document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -5;
        const rotateY = (x - centerX) / centerX * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.5s ease';
    });

    card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.1s ease';
    });
});

// ═══════════════ MAGNETIC BUTTONS ═══════════════
document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
        btn.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    });

    btn.addEventListener('mouseenter', () => {
        btn.style.transition = 'transform 0.1s ease';
    });
});

// ═══════════════ THEME TOGGLE ═══════════════
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const savedTheme = localStorage.getItem('theme') || 'dark';
body.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// ═══════════════ TYPING EFFECT ═══════════════
const typedElement = document.getElementById('typed-role');
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typeSpeed = 80;
const deleteSpeed = 40;
const pauseBetween = 2000;

function typeRole() {
    const currentRole = currentRoles[roleIndex % currentRoles.length];

    if (!isDeleting) {
        typedElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === currentRole.length) {
            isDeleting = true;
            setTimeout(typeRole, pauseBetween);
            return;
        }
    } else {
        typedElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % currentRoles.length;
        }
    }

    setTimeout(typeRole, isDeleting ? deleteSpeed : typeSpeed);
}

typeRole();

// ═══════════════ COUNTER ANIMATION ═══════════════
const statNumbers = document.querySelectorAll('.stat-number');
let countersAnimated = false;

function animateCounters() {
    if (countersAnimated) return;
    statNumbers.forEach(num => {
        const target = parseInt(num.getAttribute('data-target'));
        const duration = 1500;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            num.textContent = Math.round(eased * target);
            if (progress < 1) requestAnimationFrame(updateCounter);
        }
        requestAnimationFrame(updateCounter);
    });
    countersAnimated = true;
}

const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );
    observer.observe(statsSection);
}

// ═══════════════ HEADER SCROLL EFFECT ═══════════════
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
});

// ═══════════════ ACTIVE NAV HIGHLIGHTING ═══════════════
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-links a[href^="#"]');

function highlightNav() {
    const scrollPos = window.scrollY + 150;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        if (scrollPos >= top && scrollPos < top + height) {
            navLinksAll.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) link.classList.add('active');
            });
        }
    });
}

window.addEventListener('scroll', highlightNav);
highlightNav();

// ═══════════════ MOBILE MENU ═══════════════
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.querySelector('.nav-links');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ═══════════════ PROJECT IMAGE ICONS ═══════════════
const projectIcons = {
    'project-img-smartboard': { icon: '📋', label: 'Smart Board' },
    'project-img-karbon': { icon: '🌿', label: 'KarbonMap' },
    'project-img-nio': { icon: '💎', label: 'Nio Wallet' },
    'project-img-yield': { icon: '📈', label: 'Yield Aggregator' },
    'project-img-smartpos': { icon: '🛒', label: 'Smart-POS' },
};

Object.entries(projectIcons).forEach(([id, { icon, label }]) => {
    const el = document.getElementById(id);
    if (el) {
        el.innerHTML = `
            <div style="position:relative;z-index:1;text-align:center;">
                <div style="font-size:3rem;margin-bottom:0.5rem;">${icon}</div>
                <div style="font-size:0.85rem;color:rgba(255,255,255,0.7);font-weight:500;letter-spacing:1px;text-transform:uppercase;">${label}</div>
            </div>
        `;
    }
});

// ═══════════════ PROJECT MODAL ═══════════════
const modal = document.getElementById('project-modal');
const modalClose = modal.querySelector('.modal-close');

document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', (e) => {
        if (e.target.closest('a')) return; // Don't open modal for link clicks

        const title = card.querySelector('h3').textContent;
        const desc = card.querySelector('.project-info > p').textContent;
        const highlights = Array.from(card.querySelectorAll('.project-highlights li')).map(li => li.textContent);
        const tags = Array.from(card.querySelectorAll('.tag')).map(t => t.textContent);
        const imgEl = card.querySelector('.project-image');
        const iconData = projectIcons[imgEl.id];

        document.getElementById('modal-icon').textContent = iconData ? iconData.icon : '📱';
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-desc').textContent = desc;

        const highlightsList = document.getElementById('modal-highlights');
        highlightsList.innerHTML = highlights.map(h => `<li>${h}</li>`).join('');

        const tagsContainer = document.getElementById('modal-tags');
        tagsContainer.innerHTML = tags.map(t => `<span class="tag">${t}</span>`).join('');

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

modalClose.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ═══════════════ STAGGER ANIMATIONS ═══════════════
// Observe sections and add stagger class to children
const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const children = entry.target.querySelectorAll('.bento-item, .skill-category, .timeline-item, .project-card, .contact-card');
            children.forEach((child, i) => {
                child.style.opacity = '0';
                child.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    child.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    child.style.opacity = '1';
                    child.style.transform = 'translateY(0)';
                }, i * 100);
            });
            staggerObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('#about, #skills, #experience, #projects, #contact').forEach(section => {
    staggerObserver.observe(section);
});

// ═══════════════ SMOOTH REVEAL ON LOAD ═══════════════
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.6s ease';
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });
});
