document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('js-loaded');

    // 1. Theme Toggle (Dark/Light Mode)
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check local storage for theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            body.setAttribute('data-theme', 'dark');
            updateThemeIcon('dark');
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeToggleBtn) return;
        if (theme === 'dark') {
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }

    // 2. Mobile Menu Toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // 3. Header Scroll Effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 4. Scroll Reveal Animation (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');

    // ARTICLE PAGES: If this is an article page (has .article-body), activate ALL reveals immediately
    // so content is never blank when a user opens an article.
    const isArticlePage = document.querySelector('.article-body') !== null;

    if (isArticlePage) {
        // Show everything immediately — no animation delay on article pages
        revealElements.forEach(el => el.classList.add('active'));
    } else {
        // HOME / INDEX: Use intersection observer for scroll animation
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.05,
            rootMargin: "0px 0px 80px 0px"
        });

        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            // Already visible on load — activate immediately
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.classList.add('active');
            } else {
                revealObserver.observe(el);
            }
        });

        // If navigated with a hash (#guide-section etc.), activate that section's reveals
        if (window.location.hash) {
            setTimeout(() => {
                revealElements.forEach(el => el.classList.add('active'));
            }, 150);
        }
    }

    // Initialize Learning Progress
    initProgressTracking();
    
    // Initialize ScrollSpy for Navigation
    initScrollSpy();
    
    // Initialize Pattern Filters
    initPatternFilter();
    
    // Initialize Back to Top Button
    initBackToTop();
});

// 5. Toast Notification System
function showToast(message, type = 'success') {
    // Remove existing toast if any
    const existing = document.querySelector('.toast-notification');
    if (existing) {
        existing.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    
    let icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    
    toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
    
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// -----------------------------------------------------------------------------
// ScrollSpy for Navigation (Dynamic Active Tab)
// -----------------------------------------------------------------------------
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (sections.length === 0) return; // Only run on pages with sections

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150; // offset for header
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        // Special case for top of page (Home)
        if (scrollY < 200 && document.getElementById('guide-section')) {
            current = 'home'; 
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (current === 'home' && link.getAttribute('href') === 'index.html') {
                link.classList.add('active');
            } else if (current && link.getAttribute('href').includes('#' + current)) {
                link.classList.add('active');
            }
        });
    });
}

// -----------------------------------------------------------------------------
// Learning Progress Tracking System
// -----------------------------------------------------------------------------
const TOTAL_ARTICLES = 9; // We have 9 main articles in Knowledge Base (including Stitch Directory)

function initProgressTracking() {
    // 1. Reading Progress Bar (Scroll)
    const progressBar = document.createElement('div');
    progressBar.id = 'reading-progress';
    progressBar.style.cssText = 'position:fixed;top:0;left:0;height:4px;background:var(--accent);z-index:9999;width:0%;transition:width 0.1s;';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + "%";
    });

    // 2. Mark as Read Logic
    const markReadBtn = document.getElementById('mark-read-btn');
    if (markReadBtn) {
        const articleId = markReadBtn.getAttribute('data-article-id');
        let readArticles = JSON.parse(localStorage.getItem('readArticles') || '[]');

        // Check if already read
        if (readArticles.includes(articleId)) {
            markReadBtn.innerHTML = '<i class="fas fa-check-double"></i> อ่านจบแล้ว';
            markReadBtn.classList.add('btn-read');
            markReadBtn.style.background = 'var(--text-secondary)';
            markReadBtn.style.color = 'var(--bg-primary)';
            markReadBtn.disabled = true;
        }

        markReadBtn.addEventListener('click', () => {
            if (!readArticles.includes(articleId)) {
                readArticles.push(articleId);
                localStorage.setItem('readArticles', JSON.stringify(readArticles));
                showToast('บันทึกความคืบหน้าการเรียนรู้เรียบร้อยแล้ว!', 'success');
                
                markReadBtn.innerHTML = '<i class="fas fa-check-double"></i> อ่านจบแล้ว';
                markReadBtn.classList.add('btn-read');
                markReadBtn.style.background = 'var(--text-secondary)';
                markReadBtn.style.color = 'var(--bg-primary)';
                markReadBtn.disabled = true;
            }
        });
    }

    // 3. Update Progress Bar in index.html (Knowledge Base)
    const overallProgress = document.getElementById('overall-progress-bar');
    const overallProgressText = document.getElementById('overall-progress-text');
    if (overallProgress && overallProgressText) {
        let readArticles = JSON.parse(localStorage.getItem('readArticles') || '[]');
        const progressPercentage = Math.round((readArticles.length / TOTAL_ARTICLES) * 100);
        overallProgress.style.width = progressPercentage + '%';
        overallProgressText.textContent = `${progressPercentage}% (${readArticles.length}/${TOTAL_ARTICLES} บทความ)`;
        
        // Highlight completed cards
        readArticles.forEach(id => {
            const card = document.getElementById(`card-${id}`);
            if (card) {
                card.style.borderColor = 'var(--accent)';
                const badge = card.querySelector('.bento-badge') || document.createElement('span');
                badge.className = 'bento-badge';
                badge.style.cssText = 'position:absolute;top:1rem;right:1rem;background:var(--accent);color:white;padding:0.2rem 0.5rem;border-radius:10px;font-size:0.8rem;z-index:10;';
                badge.innerHTML = '<i class="fas fa-check"></i> เรียนแล้ว';
                if (!card.querySelector('.bento-badge')) card.appendChild(badge);
            }
        });

        // GAMIFICATION: 100% Completion Unlock
        if (progressPercentage === 100) {
            const certificateEl = document.getElementById('certificate-unlock');
            if (certificateEl && certificateEl.style.display === 'none') {
                certificateEl.style.display = 'block';
                // Delay confetti slightly so user sees the unlock
                setTimeout(() => {
                    shootConfetti();
                    showToast('🎉 ยินดีด้วย! คุณปลดล็อกใบประกาศนียบัตรแล้ว!', 'success');
                }, 500);
            }
        }
    }
}

// -----------------------------------------------------------------------------
// Gamification: Confetti Animation Engine
// -----------------------------------------------------------------------------
function shootConfetti() {
    const duration = 3000; // 3 seconds
    const end = Date.now() + duration;
    const colors = ['#B88B7D', '#9E7467', '#D4A89A', '#ffffff', '#ffd700'];

    (function frame() {
        // Create 2-3 particles per frame
        for (let i = 0; i < 3; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = Math.random() * 20 + 10 + 'px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.zIndex = '10000';
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            confetti.style.transition = 'top 3s cubic-bezier(0.1, 0.8, 0.3, 1), transform 3s ease-in, opacity 3s ease-in';
            
            document.body.appendChild(confetti);

            // Trigger animation
            setTimeout(() => {
                confetti.style.top = '100vh';
                confetti.style.transform = `rotate(${Math.random() * 720}deg)`;
                confetti.style.opacity = '0';
            }, 10);

            // Cleanup
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

// -----------------------------------------------------------------------------
// Pattern Filtering System
// -----------------------------------------------------------------------------
function initPatternFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const patternItems = document.querySelectorAll('.pattern-item');

    if (filterBtns.length === 0 || patternItems.length === 0) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => {
                b.classList.remove('btn-primary', 'active');
                b.classList.add('btn-secondary');
            });
            
            // Add active class to clicked button
            btn.classList.remove('btn-secondary');
            btn.classList.add('btn-primary', 'active');

            const filterValue = btn.getAttribute('data-filter');

            patternItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'flex';
                    // Trigger animation again
                    item.style.animation = 'none';
                    item.offsetHeight; // trigger reflow
                    item.style.animation = null;
                    item.classList.add('visible');
                } else {
                    item.style.display = 'none';
                    item.classList.remove('visible');
                }
            });
        });
    });
}

// -----------------------------------------------------------------------------
// Back to Top Button
// -----------------------------------------------------------------------------
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
