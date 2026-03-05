window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 1500);
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth Scroll
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

// Create Particles
function createParticles() {
    const container = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (10 + Math.random() * 10) + 's';
        container.appendChild(particle);
    }
}
createParticles();

// Three.js Hero Background
function initThreeJS() {
    const canvas = document.getElementById('hero-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create floating geometric shapes
    const geometries = [];
    const shapes = [];

    const geometryTypes = [
        new THREE.IcosahedronGeometry(0.5, 0),
        new THREE.OctahedronGeometry(0.5, 0),
        new THREE.TetrahedronGeometry(0.5, 0),
        new THREE.SphereGeometry(0.3, 16, 16)
    ];

    const colors = [0x2196F3, 0x7C4DFF, 0x00E5FF, 0x64B5F6];

    for (let i = 0; i < 4; i++) {
        const geometry = geometryTypes[Math.floor(Math.random() * geometryTypes.length)];
        const material = new THREE.MeshBasicMaterial({
            color: colors[Math.floor(Math.random() * colors.length)],
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = (Math.random() - 0.5) * 20;
        mesh.position.y = (Math.random() - 0.5) * 20;
        mesh.position.z = (Math.random() - 0.5) * 10;
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;

        shapes.push({
            mesh,
            speedX: (Math.random() - 0.5) * 0.01,
            speedY: (Math.random() - 0.5) * 0.01,
            speedZ: (Math.random() - 0.5) * 0.01,
            floatSpeed: 0.005 + Math.random() * 0.01,
            floatOffset: Math.random() * Math.PI * 2
        });

        scene.add(mesh);
    }

    // Add connecting lines
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x2196F3,
        transparent: true,
        opacity: 0.1
    });

    camera.position.z = 8;

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Animation loop
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;

        shapes.forEach((shape, i) => {
            shape.mesh.rotation.x += shape.speedX;
            shape.mesh.rotation.y += shape.speedY;
            shape.mesh.rotation.z += shape.speedZ;
            shape.mesh.position.y += Math.sin(time + shape.floatOffset) * 0.002;
        });

        // Camera parallax
        camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Initialize Three.js
initThreeJS();

// GSAP Scroll Animations
gsap.registerPlugin(ScrollTrigger);

// Fade in up animations
gsap.utils.toArray('.fade-in-up').forEach((element) => {
    gsap.fromTo(element,
        { opacity: 0, y: 50 },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: element,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        }
    );
});

// Benefit items stagger animation
gsap.utils.toArray('.benefit-item').forEach((item, i) => {
    gsap.fromTo(item,
        { opacity: 0, x: -50 },
        {
            opacity: 1,
            x: 0,
            duration: 0.6,
            delay: i * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        }
    );
});

// Feature cards 3D tilt effect
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// Chat functionality
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const typingIndicator = document.getElementById('typingIndicator');

function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message
    addMessage(message, true);
    chatInput.value = '';

    // Show typing indicator
    typingIndicator.style.display = 'flex';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Simulate VEE response
    setTimeout(() => {
        typingIndicator.style.display = 'none';
        const responses = [
            "That's interesting! I'd love to show you how VEE can help with that. Would you like to schedule a demo?",
            "Great question! Our AI can handle complex conversations and seamlessly transfer to humans when needed.",
            "Absolutely! VEE integrates with most major CRMs and marketing platforms. Which one do you use?",
            "I can help you with that! Many of our clients have seen 40% increase in conversions after implementing VEE."
        ];
        addMessage(responses[Math.floor(Math.random() * responses.length)], false);
    }, 2000);
}

function addMessage(text, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : ''}`;
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateY(20px)';
    messageDiv.innerHTML = `
                <div class="message-avatar ${isUser ? 'user' : 'vee'}">
                    <i class="fas ${isUser ? 'fa-user' : 'fa-robot'}"></i>
                </div>
                <div class="message-content">
                    <p>${text}</p>
                </div>
            `;
    chatMessages.insertBefore(messageDiv, typingIndicator);

    // Animate message
    setTimeout(() => {
        messageDiv.style.transition = 'all 0.5s ease';
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
    }, 100);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// Form submission
document.getElementById('demoForm').addEventListener('submit', (e) => {
    e.preventDefault();

    // Show success message
    const form = e.target;
    form.innerHTML = `
                <div class="text-center py-5">
                    <div class="mb-4">
                        <i class="fas fa-check-circle" style="font-size: 80px; color: #4CAF50;"></i>
                    </div>
                    <h3 class="mb-3">Thank You!</h3>
                    <p class="text-secondary">We've received your demo request. Our team will contact you within 24 hours.</p>
                </div>
            `;
});

// Auto-play chat animation
setInterval(() => {
    const messages = chatMessages.querySelectorAll('.message');
    messages.forEach((msg, i) => {
        setTimeout(() => {
            msg.style.animation = 'none';
            msg.offsetHeight; // Trigger reflow
            msg.style.animation = `messageSlide 0.5s ease forwards`;
            msg.style.animationDelay = `${i * 0.5}s`;
        }, i * 100);
    });
}, 10000);






// ============================================
// COUNTER ANIMATION FOR STATS
// ============================================
function animateCounter(element, target, suffix = '', duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    function updateCounter() {
        start += increment;
        if (start < target) {
            if (target % 1 !== 0) {
                element.textContent = start.toFixed(1) + suffix;
            } else {
                element.textContent = Math.floor(start) + suffix;
            }
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + suffix;
        }
    }

    updateCounter();
}

// Intersection Observer for counter animation
const statNumbers = document.querySelectorAll('.stat-number');

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            const text = element.textContent;

            if (text.includes('X')) {
                // Handle "2X-5X" format
                element.textContent = text;
            } else if (text.includes('%')) {
                const value = parseInt(text);
                animateCounter(element, value, '%');
            } else if (!isNaN(parseInt(text))) {
                const value = parseInt(text);
                animateCounter(element, value);
            }

            counterObserver.unobserve(element);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => counterObserver.observe(stat));

// ============================================
// USE CASE TABS ANIMATION
// ============================================
const useCaseTabs = document.querySelectorAll('#useCaseTab .nav-link');

useCaseTabs.forEach(tab => {
    tab.addEventListener('shown.bs.tab', function () {
        const targetPane = document.querySelector(this.getAttribute('data-bs-target'));
        const chatMessages = targetPane.querySelectorAll('.msg');

        chatMessages.forEach((msg, index) => {
            msg.style.opacity = '0';
            msg.style.transform = 'translateY(20px)';

            setTimeout(() => {
                msg.style.transition = 'all 0.4s ease';
                msg.style.opacity = '1';
                msg.style.transform = 'translateY(0)';
            }, index * 150);
        });
    });
});

const cards = document.querySelectorAll('.feature-layer');

cards.forEach(card => {

    card.addEventListener('mousemove', e => {

        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = -(y - centerY) / 12;
        const rotateY = (x - centerX) / 12;

        card.style.transform =
            `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;

    });

    card.addEventListener('mouseleave', () => {

        card.style.transform = "rotateX(0) rotateY(0)";

    });

});
