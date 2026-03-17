// Initialize AOS (Animate on Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100,
});

// Custom Cursor Tracking
const cursor = document.getElementById('custom-cursor');
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

document.addEventListener('mousedown', () => cursor.style.transform = 'scale(0.8)');
document.addEventListener('mouseup', () => cursor.style.transform = 'scale(1)');

// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
body.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Blog Posts Injection
const blogPosts = [
    {
        title: "The Future of JavaScript in 2026",
        date: "March 15, 2026",
        excerpt: "Exploring new proposals and features in ECMAScript and how they change our workflow."
    },
    {
        title: "Why Minimalist Design Wins",
        date: "February 28, 2026",
        excerpt: "Less is more. How to achieve a premium feel with clean layouts and whitespace."
    },
    {
        title: "Optimizing Web Performance",
        date: "January 14, 2026",
        excerpt: "Techniques for achieving 100/100 Lighthouse scores on mobile and desktop."
    }
];

const blogContainer = document.getElementById('blog-posts');
if (blogContainer) {
    blogPosts.forEach(post => {
        const card = document.createElement('a');
        card.href = "#";
        card.className = "blog-card glass";
        card.innerHTML = `
            <span class="date">${post.date}</span>
            <h3>${post.title}</h3>
            <p>${post.excerpt}</p>
        `;
        blogContainer.appendChild(card);
    });
}

// Header Scroll Effect (Improved)
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
});

// Example of dynamic content or interaction
const namePlaceholder = document.getElementById('name-placeholder');
if (namePlaceholder) {
    namePlaceholder.addEventListener('click', () => {
        const colors = ['#38bdf8', '#818cf8', '#2dd4bf'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        namePlaceholder.style.transition = 'color 0.5s ease';
        namePlaceholder.style.color = randomColor;
    });
}
