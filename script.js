/* ===== LOADING BAY ===== */
function initLoadingBay() {
    const loadingBay = document.getElementById('loading-bay');
    const facility = document.getElementById('facility');
    const loadingPercent = document.querySelector('.loading-percent');

    if (!loadingBay || !facility || !loadingPercent) {
        console.error('SECTOR 7 // CRITICAL: Loading bay elements not found');
        return;
    }

    let percent = 0;
    const percentInterval = setInterval(() => {
        percent += Math.floor(Math.random() * 15) + 5;
        if (percent >= 100) {
            percent = 100;
            clearInterval(percentInterval);
        }
        loadingPercent.textContent = percent + '%';
    }, 200);

    setTimeout(() => {
        loadingBay.style.opacity = '0';
        loadingBay.style.transition = 'opacity 0.8s ease';

        setTimeout(() => {
            loadingBay.classList.add('hidden');
            facility.classList.remove('hidden');
            void facility.offsetWidth;
            facility.classList.add('visible');

            // Initialize all systems
            try {
                initThreeJS();
                initAtmosphere();
                initTypewriter();
                initMetrics();
                initScrollAnimations();
                initClock();
                initMouseEffects();
                initActiveNavTracking();
                initDataTicker();
                initFooterSystems();
            } catch (err) {
                console.error('SECTOR 7 // SYSTEM INIT FAILURE:', err);
            }
        }, 800);
    }, 3500);
}

// Run immediately if DOM is ready, or wait for it
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoadingBay);
} else {
    initLoadingBay();
}

/* ===== CLOCK ===== */
function initClock() {
    const clock = document.getElementById('facility-time');
    if (!clock) return;

    function update() {
        const now = new Date();
        clock.textContent = now.toLocaleTimeString('en-US', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    update();
    setInterval(update, 1000);
}

/* ===== TYPEWRITER ===== */
function initTypewriter() {
    const phrases = [
        'I build production backends that scale.',
        'I optimize LLMs until they scream.',
        'I run quantum circuits on real QPUs.',
        'I do not fit into your JD box.',
        'And that is the point.'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const element = document.getElementById('typewriter-text');
    if (!element) return;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            element.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            element.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 30 : 60;

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            speed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            speed = 500;
        }

        setTimeout(type, speed);
    }

    setTimeout(type, 800);
}

/* ===== METRICS ANIMATION ===== */
function initMetrics() {
    const rings = document.querySelectorAll('.ring-fill');
    const values = document.querySelectorAll('.metric-value');

    rings.forEach(ring => {
        const target = parseInt(ring.dataset.target);
        const circumference = 2 * Math.PI * 45;
        const offset = circumference - (target / 100) * circumference;

        setTimeout(() => {
            ring.style.strokeDashoffset = offset;
        }, 500);
    });

    values.forEach((val, index) => {
        const target = parseInt(val.dataset.target);
        const duration = 2000;
        const start = performance.now();

        setTimeout(() => {
            function update(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const ease = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(target * ease);
                val.textContent = current.toString().padStart(index === 0 ? 3 : 2, '0');

                if (progress < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
        }, index * 200);
    });
}

/* ===== THREE.JS ORBITAL DEVICE ===== */
function initThreeJS() {
    const container = document.getElementById('orbital-canvas');
    if (!container || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: container, alpha: true, antialias: true });
    
    const size = Math.min(window.innerWidth * 0.3, 500);
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create orbital rings
    const ringGroup = new THREE.Group();

    const ringConfigs = [
        { radius: 1.8, tube: 0.03, color: 0x00d4ff, speed: 0.005 },
        { radius: 1.4, tube: 0.025, color: 0x0088aa, speed: -0.008 },
        { radius: 1.0, tube: 0.02, color: 0x00d4ff, speed: 0.012 },
        { radius: 0.6, tube: 0.015, color: 0x44aaff, speed: -0.015 }
    ];

    const rings = [];

    ringConfigs.forEach(config => {
        const geometry = new THREE.TorusGeometry(config.radius, config.tube, 16, 100);
        const material = new THREE.MeshBasicMaterial({ 
            color: config.color,
            transparent: true,
            opacity: 0.6,
            wireframe: true
        });
        const ring = new THREE.Mesh(geometry, material);
        ring.userData.speed = config.speed;
        ring.userData.rotationAxis = new THREE.Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5
        ).normalize();
        ringGroup.add(ring);
        rings.push(ring);
    });

    // Central orb
    const orbGeometry = new THREE.SphereGeometry(0.25, 32, 32);
    const orbMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.8
    });
    const orb = new THREE.Mesh(orbGeometry, orbMaterial);

    // Orb glow
    const glowGeometry = new THREE.SphereGeometry(0.4, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.15
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);

    scene.add(ringGroup);
    scene.add(orb);
    scene.add(glow);

    camera.position.z = 4;

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    });

    function animate() {
        requestAnimationFrame(animate);

        // Rotate rings
        rings.forEach(ring => {
            ring.rotateOnAxis(ring.userData.rotationAxis, ring.userData.speed);
        });

        // Mouse-follow rotation
        targetRotationX = mouseY * 0.3;
        targetRotationY = mouseX * 0.3;

        ringGroup.rotation.x += (targetRotationX - ringGroup.rotation.x) * 0.05;
        ringGroup.rotation.y += (targetRotationY - ringGroup.rotation.y) * 0.05;

        // Pulse orb
        const time = Date.now() * 0.002;
        orb.scale.setScalar(1 + Math.sin(time) * 0.1);
        glow.scale.setScalar(1 + Math.sin(time * 0.5) * 0.2);

        renderer.render(scene, camera);
    }

    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        const newSize = Math.min(window.innerWidth * 0.3, 500);
        renderer.setSize(newSize, newSize);
    });
}

/* ===== ATMOSPHERIC CANVAS ===== */
function initAtmosphere() {
    const canvas = document.getElementById('atmosphere-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    // Create particles
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 2 + 0.5,
            speedX: (Math.random() - 0.5) * 0.3,
            speedY: (Math.random() - 0.5) * 0.3,
            opacity: Math.random() * 0.3 + 0.1
        });
    }

    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            // Mouse repulsion
            const dx = p.x - mouseX;
            const dy = p.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 150) {
                const force = (150 - dist) / 150;
                p.speedX += (dx / dist) * force * 0.5;
                p.speedY += (dy / dist) * force * 0.5;
            }

            p.x += p.speedX;
            p.y += p.speedY;

            // Friction
            p.speedX *= 0.98;
            p.speedY *= 0.98;

            // Wrap around
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            // Draw
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 212, 255, ${p.opacity})`;
            ctx.fill();
        });

        // Draw connections
        particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(0, 212, 255, ${0.1 * (1 - dist / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });
        });

        requestAnimationFrame(animate);
    }

    animate();
}

/* ===== SCROLL ANIMATIONS (GSAP + ScrollTrigger) ===== */
function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('SECTOR 7 // GSAP not loaded - scroll animations disabled');
        // Show all content without animations
        document.querySelectorAll('.containment-interior, .chamber-interior, .vault-interior, .transmit-interior').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.style.pointerEvents = 'auto';
        });
        document.querySelectorAll('.containment-gate-overlay, .chamber-gate-overlay, .vault-door-overlay, .transmit-hatch').forEach(el => {
            el.style.display = 'none';
        });
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // ===== DOSSIER CONTAINMENT - SCROLL PINNED GATE =====
    initDossierGateSequence();

    // ===== SYSTEMS CHAMBER - SCROLL PINNED GATE =====
    initSystemsGateSequence();

    // ===== VAULT ARCHIVE - SCROLL PINNED DOOR =====
    initVaultDoorSequence();

    // ===== TRANSMIT HATCH - SCROLL PINNED =====
    initTransmitHatchSequence();

    // ===== SKILL BARS - Set initial widths from CSS vars =====
    document.querySelectorAll('.skill-bar').forEach(bar => {
        const width = bar.style.getPropertyValue('--width');
        if (width) {
            bar.dataset.targetWidth = width;
        }
    });

    // ===== ARCHIVE TAPES =====
    gsap.utils.toArray('.tape').forEach((tape, i) => {
        if (tape) {
            gsap.from(tape, {
                scrollTrigger: {
                    trigger: tape,
                    start: 'top 90%',
                    toggleActions: 'play none none reverse'
                },
                x: -100,
                opacity: 0,
                duration: 0.6,
                delay: i * 0.2,
                ease: 'power3.out'
            });
        }
    });

    // ===== COM PANELS =====
    gsap.utils.toArray('.com-panel').forEach((panel, i) => {
        if (panel) {
            gsap.from(panel, {
                scrollTrigger: {
                    trigger: panel,
                    start: 'top 90%',
                    toggleActions: 'play none none reverse'
                },
                y: 40,
                opacity: 0,
                duration: 0.5,
                delay: i * 0.1,
                ease: 'power3.out'
            });
        }
    });
}

/* ===== DOSSIER CONTAINMENT - SCROLL SEQUENCE ===== */
function initDossierGateSequence() {
    const containmentSection = document.querySelector('.containment-section');
    const gateOverlay = document.querySelector('.containment-gate-overlay');
    const gateLeft = document.querySelector('.section-gate .gate-left');
    const gateRight = document.querySelector('.section-gate .gate-right');
    
    if (!containmentSection || !gateOverlay) return;

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: containmentSection,
            start: 'top top',
            end: '+=200%',
            pin: true,
            scrub: 0.5,
            snap: {
                snapTo: (progress) => {
                    if (progress < 0.25) return 0;
                    if (progress < 0.75) return 0.5;
                    return 1;
                },
                duration: { min: 0.2, max: 0.4 },
                delay: 0,
                ease: 'power2.inOut'
            },
            onUpdate: (self) => {
                const progress = self.progress;
                
                if (progress < 0.5) {
                    gateOverlay.classList.remove('gate-opening', 'gate-open');
                    containmentSection.classList.remove('interior-visible');
                    
                    const statusTexts = document.querySelectorAll('.gate-status');
                    statusTexts.forEach(text => {
                        if (progress > 0.3 && progress < 0.5) {
                            text.textContent = 'OPENING...';
                            text.style.color = '#f5c211';
                        } else {
                            text.textContent = 'SCROLL TO ACCESS';
                            text.style.color = '#6c7086';
                        }
                    });
                } else if (progress >= 0.5 && progress < 0.8) {
                    gateOverlay.classList.add('gate-opening');
                    gateOverlay.classList.remove('gate-open');
                    containmentSection.classList.remove('interior-visible');
                } else {
                    gateOverlay.classList.add('gate-open');
                    gateOverlay.classList.remove('gate-opening');
                    containmentSection.classList.add('interior-visible');
                }
            },
            onLeaveBack: () => {
                gateOverlay.classList.remove('gate-opening', 'gate-open');
                containmentSection.classList.remove('interior-visible');
            }
        }
    });

    if (gateLeft) {
        tl.fromTo(gateLeft, 
            { x: '0%' },
            { x: '-100%', rotateY: 10, duration: 1, ease: 'power2.inOut' },
            0.5
        );
    }
    
    if (gateRight) {
        tl.fromTo(gateRight,
            { x: '0%' },
            { x: '100%', rotateY: -10, duration: 1, ease: 'power2.inOut' },
            0.5
        );
    }

    tl.to(gateOverlay,
        { opacity: 0, pointerEvents: 'none', duration: 0.3 },
        0.8
    );

    tl.to('.containment-interior',
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        0.85
    );

    tl.fromTo('.containment-interior .interior-header',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
        0.9
    );

    tl.fromTo('.specimen',
        { opacity: 0, y: 60, rotateX: 15 },
        { opacity: 1, y: 0, rotateX: 0, stagger: 0.12, duration: 0.6, ease: 'power3.out' },
        0.95
    );
}

/* ===== SYSTEMS CHAMBER - SCROLL SEQUENCE ===== */
function initSystemsGateSequence() {
    const chamberSection = document.querySelector('.chamber-section');
    const gateOverlay = document.querySelector('.chamber-gate-overlay');
    const doorLeft = document.querySelector('.chamber-door .door-left');
    const doorRight = document.querySelector('.chamber-door .door-right');
    
    if (!chamberSection || !gateOverlay) return;

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: chamberSection,
            start: 'top top',
            end: '+=200%',
            pin: true,
            scrub: 0.5,
            snap: {
                snapTo: (progress) => {
                    if (progress < 0.25) return 0;
                    if (progress < 0.75) return 0.5;
                    return 1;
                },
                duration: { min: 0.2, max: 0.4 },
                delay: 0,
                ease: 'power2.inOut'
            },
            onUpdate: (self) => {
                const progress = self.progress;
                
                if (progress < 0.5) {
                    gateOverlay.classList.remove('gate-opening', 'gate-open');
                    chamberSection.classList.remove('interior-visible');
                    
                    const statusTexts = document.querySelectorAll('.door-status');
                    statusTexts.forEach(text => {
                        if (progress > 0.3 && progress < 0.5) {
                            text.textContent = 'OPENING...';
                            text.style.color = '#00d4ff';
                        } else {
                            text.textContent = 'SCROLL TO ACCESS';
                            text.style.color = '#6c7086';
                        }
                    });
                } else if (progress >= 0.5 && progress < 0.8) {
                    gateOverlay.classList.add('gate-opening');
                    gateOverlay.classList.remove('gate-open');
                    chamberSection.classList.remove('interior-visible');
                } else {
                    gateOverlay.classList.add('gate-open');
                    gateOverlay.classList.remove('gate-opening');
                    chamberSection.classList.add('interior-visible');
                }
            },
            onLeaveBack: () => {
                gateOverlay.classList.remove('gate-opening', 'gate-open');
                chamberSection.classList.remove('interior-visible');
            }
        }
    });

    if (doorLeft) {
        tl.fromTo(doorLeft, 
            { x: '0%' },
            { x: '-100%', rotateY: 15, duration: 1, ease: 'power2.inOut' },
            0.5
        );
    }
    
    if (doorRight) {
        tl.fromTo(doorRight,
            { x: '0%' },
            { x: '100%', rotateY: -15, duration: 1, ease: 'power2.inOut' },
            0.5
        );
    }

    tl.to(gateOverlay,
        { opacity: 0, pointerEvents: 'none', duration: 0.3 },
        0.8
    );

    tl.to('.chamber-interior',
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        0.85
    );

    tl.fromTo('.tube',
        { opacity: 0, y: 40, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.4, ease: 'power2.out' },
        0.9
    );

    tl.fromTo('.readout-module',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.4, ease: 'power2.out' },
        1.0
    );

    tl.add(() => {
        document.querySelectorAll('.chamber-interior .skill-bar').forEach(bar => {
            const targetWidth = bar.dataset.targetWidth || bar.style.getPropertyValue('--width');
            if (targetWidth) {
                gsap.fromTo(bar, 
                    { width: '0%' },
                    { width: targetWidth, duration: 1.5, ease: 'power3.out' }
                );
            }
        });
    }, 1.1);
}

/* ===== VAULT ARCHIVE - SCROLL PINNED DOOR SEQUENCE ===== */
function initVaultDoorSequence() {
    const vaultSection = document.querySelector('.vault-section');
    const doorOverlay = document.querySelector('.vault-door-overlay');
    const sealRing = document.querySelector('.seal-ring');
    
    if (!vaultSection || !doorOverlay) return;

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: vaultSection,
            start: 'top top',
            end: '+=200%',
            pin: true,
            scrub: 0.5,
            snap: {
                snapTo: (progress) => {
                    if (progress < 0.25) return 0;
                    if (progress < 0.75) return 0.5;
                    return 1;
                },
                duration: { min: 0.2, max: 0.4 },
                delay: 0,
                ease: 'power2.inOut'
            },
            onUpdate: (self) => {
                const progress = self.progress;
                
                if (progress < 0.5) {
                    doorOverlay.classList.remove('door-opening', 'door-open');
                    vaultSection.classList.remove('interior-visible');
                    
                    const statusText = document.querySelector('.vault-status');
                    if (statusText) {
                        if (progress > 0.3 && progress < 0.5) {
                            statusText.textContent = 'DECRYPTING...';
                            statusText.style.color = '#f5c211';
                        } else {
                            statusText.textContent = 'SCROLL TO DECRYPT';
                            statusText.style.color = '#6c7086';
                        }
                    }
                } else if (progress >= 0.5 && progress < 0.8) {
                    doorOverlay.classList.add('door-opening');
                    doorOverlay.classList.remove('door-open');
                    vaultSection.classList.remove('interior-visible');
                } else {
                    doorOverlay.classList.add('door-open');
                    doorOverlay.classList.remove('door-opening');
                    vaultSection.classList.add('interior-visible');
                }
            },
            onLeaveBack: () => {
                doorOverlay.classList.remove('door-opening', 'door-open');
                vaultSection.classList.remove('interior-visible');
            }
        }
    });

    if (sealRing) {
        tl.fromTo(sealRing,
            { rotation: 0 },
            { rotation: 720, duration: 1, ease: 'power2.inOut' },
            0.5
        );
    }

    tl.to(doorOverlay,
        { opacity: 0, pointerEvents: 'none', duration: 0.3 },
        0.8
    );

    tl.to('.vault-interior',
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        0.85
    );

    tl.fromTo('.archive-header',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
        0.9
    );

    tl.fromTo('.archive-timeline',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
        0.95
    );

    tl.fromTo('.mission-card',
        { opacity: 0, y: 60, rotateX: 15 },
        { opacity: 1, y: 0, rotateX: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out' },
        1.0
    );

    tl.fromTo('.archive-stats',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        1.2
    );
}

/* ===== TRANSMIT HATCH - SCROLL SEQUENCE ===== */
/* ===== TRANSMIT HATCH - SCROLL SEQUENCE (FIXED) ===== */
function initTransmitHatchSequence() {
    const transmitSection = document.querySelector('.transmit-section');
    const hatchOverlay = document.querySelector('.transmit-hatch');
    const hatchWheel = document.querySelector('.hatch-wheel');
    
    if (!transmitSection || !hatchOverlay) return;

    // Set initial hidden state via GSAP, not CSS
    gsap.set('.transmit-interior', { opacity: 0, y: 40, pointerEvents: 'none' });
    gsap.set('.com-panel', { opacity: 0, y: 40, rotateX: 10 });

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: transmitSection,
            start: 'top top',
            end: '+=200%',
            pin: true,
            scrub: 0.5,
            snap: {
                snapTo: (progress) => {
                    if (progress < 0.25) return 0;
                    if (progress < 0.75) return 0.5;
                    return 1;
                },
                duration: { min: 0.2, max: 0.4 },
                delay: 0,
                ease: 'power2.inOut'
            },
            onUpdate: (self) => {
                const progress = self.progress;
                
                if (progress < 0.5) {
                    hatchOverlay.classList.remove('hatch-opening', 'hatch-open');
                    
                    const statusText = document.querySelector('.transmit-hatch .scroll-text');
                    if (statusText) {
                        if (progress > 0.3 && progress < 0.5) {
                            statusText.textContent = 'UNLOCKING...';
                            statusText.style.color = '#f38ba8';
                        } else {
                            statusText.textContent = 'SCROLL TO OPEN';
                            statusText.style.color = '#f38ba8';
                        }
                    }
                } else if (progress >= 0.5 && progress < 0.8) {
                    hatchOverlay.classList.add('hatch-opening');
                    hatchOverlay.classList.remove('hatch-open');
                } else {
                    hatchOverlay.classList.add('hatch-open');
                    hatchOverlay.classList.remove('hatch-opening');
                }
            },
            onLeaveBack: () => {
                hatchOverlay.classList.remove('hatch-opening', 'hatch-open');
                // Reset interior visibility when scrolling back up
                gsap.set('.transmit-interior', { opacity: 0, y: 40, pointerEvents: 'none' });
                gsap.set('.com-panel', { opacity: 0, y: 40, rotateX: 10 });
            }
        }
    });

    if (hatchWheel) {
        tl.fromTo(hatchWheel,
            { rotation: 0, scale: 1 },
            { rotation: 360, scale: 1.1, duration: 0.8, ease: 'power2.in' },
            0.5
        );
    }

    tl.to(hatchOverlay,
        { opacity: 0, scale: 1.3, duration: 0.4, ease: 'power2.out' },
        0.7
    );

    // Reveal interior container first
    tl.to('.transmit-interior',
        { opacity: 1, y: 0, pointerEvents: 'auto', duration: 0.5, ease: 'power2.out' },
        0.85
    );

    // Stagger in header
    tl.fromTo('.transmit-header',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
        0.9
    );

    // Stagger in console
    tl.fromTo('.transmit-console',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        0.95
    );

    // Stagger in contact panels - CRITICAL FIX: use fromTo with explicit initial state
    tl.fromTo('.com-panel',
        { opacity: 0, y: 40, rotateX: 10 },
        { opacity: 1, y: 0, rotateX: 0, stagger: 0.1, duration: 0.5, ease: 'power3.out' },
        1.0
    );

    // Stagger in stats
    tl.fromTo('.transmit-stats',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
        1.2
    );
}
/* ===== FOOTER SYSTEMS ===== */
function initFooterSystems() {
    // Uptime counter
    const uptimeEl = document.getElementById('uptime-counter');
    if (uptimeEl) {
        const startTime = Date.now();
        
        function updateUptime() {
            const elapsed = Date.now() - startTime;
            const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));
            const hours = Math.floor((elapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
            
            uptimeEl.textContent = 
                String(days).padStart(2, '0') + ':' +
                String(hours).padStart(2, '0') + ':' +
                String(minutes).padStart(2, '0') + ':' +
                String(seconds).padStart(2, '0');
        }
        
        updateUptime();
        setInterval(updateUptime, 1000);
    }

    // Terminal line cycling
    const terminalBody = document.getElementById('footer-terminal');
    if (terminalBody) {
        const logEntries = [
            'Facility systems initialized',
            'All sectors nominal',
            'Connection established',
            'End of file reached',
            'Monitoring active',
            'Heartbeat signal sent',
            'Cache cleared',
            'Session verified'
        ];
        
        let logIndex = 0;
        
        function updateTerminal() {
            const lines = terminalBody.querySelectorAll('.terminal-line');
            if (lines.length === 0) return;
            
            const now = new Date();
            const timestamp = '[' + 
                String(now.getHours()).padStart(2, '0') + ':' +
                String(now.getMinutes()).padStart(2, '0') + ':' +
                String(now.getSeconds()).padStart(2, '0') + ']';
            
            for (let i = 0; i < lines.length - 1; i++) {
                const nextLine = lines[i + 1];
                if (nextLine) {
                    lines[i].innerHTML = nextLine.innerHTML;
                    lines[i].className = nextLine.className;
                }
            }
            
            const lastLine = lines[lines.length - 1];
            if (lastLine) {
                lastLine.innerHTML = '<span class="timestamp">' + timestamp + '</span> ' + logEntries[logIndex];
                lastLine.classList.add('active');
            }
            
            lines.forEach((line, i) => {
                if (i < lines.length - 2) {
                    line.classList.remove('active');
                }
            });
            
            logIndex = (logIndex + 1) % logEntries.length;
        }
        
        setInterval(updateTerminal, 4000);
    }

    // Scroll to top button
    const scrollTopBtn = document.getElementById('scroll-top');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > window.innerHeight) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });
        
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

/* ===== MOUSE EFFECTS ===== */
function initMouseEffects() {
    // Parallax on specimen cards
    document.querySelectorAll('.specimen-casing').forEach(casing => {
        casing.addEventListener('mousemove', (e) => {
            const rect = casing.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            casing.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-4px)`;
        });

        casing.addEventListener('mouseleave', () => {
            casing.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateY(0)';
        });
    });

    // Console button glow follow
    document.querySelectorAll('.console-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            btn.style.setProperty('--mouse-x', x + 'px');
            btn.style.setProperty('--mouse-y', y + 'px');
        });
    });
}

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ===== RANDOM GLITCH ===== */
const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

function randomGlitch() {
    const elements = document.querySelectorAll('.specimen-name, .interior-title, .module-title');
    if (elements.length === 0) return;

    const target = elements[Math.floor(Math.random() * elements.length)];
    const originalText = target.textContent;

    let iterations = 0;
    const interval = setInterval(() => {
        if (iterations >= 5) {
            target.textContent = originalText;
            clearInterval(interval);
            return;
        }

        target.textContent = originalText.split('').map((char, i) => {
            if (char === ' ') return ' ';
            if (Math.random() < 0.3) {
                return glitchChars[Math.floor(Math.random() * glitchChars.length)];
            }
            return char;
        }).join('');

        iterations++;
    }, 50);
}

setInterval(() => {
    if (Math.random() < 0.2) randomGlitch();
}, 12000);

/* ===== ACTIVE NAV BUTTON TRACKING ===== */
function initActiveNavTracking() {
    const navButtons = document.querySelectorAll('.console-btn');
    const sections = document.querySelectorAll('section[id]');

    // Click handler
    navButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            navButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Scroll-based active state
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navButtons.forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.getAttribute('href') === '#' + id) {
                        btn.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));
}

/* ===== DATA TICKER ROTATION ===== */
function initDataTicker() {
    const tickers = [
        'SYS: ONLINE // CONTAINMENT: STABLE // QPU: IDLE // BACKEND: ACTIVE // ML_PIPELINE: RUNNING // ALL SECTORS NOMINAL // ',
        'TEMP: 294K // PRESSURE: 101.3kPa // RADIATION: 0.02mSv // HUMIDITY: 45% // ATMOSPHERE: BREATHABLE // ',
        'NETWORK: SECURE // ENCRYPTION: AES-256 // FIREWALL: ACTIVE // INTRUSION: NONE DETECTED // ',
        'POWER: 98.7% // GRID: STABLE // BACKUP: CHARGED // COOLING: NOMINAL // VENTILATION: ACTIVE // '
    ];

    const tickerEl = document.querySelector('.ticker-text');
    if (!tickerEl) return;

    let currentTicker = 0;

    setInterval(() => {
        currentTicker = (currentTicker + 1) % tickers.length;
        tickerEl.style.opacity = '0';
        setTimeout(() => {
            tickerEl.textContent = tickers[currentTicker] + tickers[currentTicker];
            tickerEl.style.opacity = '1';
        }, 300);
    }, 8000);
}

/* ===== CONSOLE EASTER EGG ===== */
console.log('%c SECTOR 7 FACILITY ', 'background: #00d4ff; color: #0f0f14; font-family: monospace; font-size: 20px; font-weight: bold; padding: 4px 8px;');
console.log('%c ULLAS_CL // CLEARANCE: ALPHA ', 'color: #00d4ff; font-family: monospace; font-size: 14px;');
console.log('%c All systems operational. ', 'color: #3a3f4a; font-family: monospace; font-size: 12px;');