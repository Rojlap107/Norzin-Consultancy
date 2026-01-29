// Pro Max Animations and Interactions for Norzin Consultancy

document.addEventListener('DOMContentLoaded', () => {
    // Navigation Scroll Effect
    const navbar = document.querySelector('.navbar-pro');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.style.top = '1rem';
                navbar.style.width = 'calc(100% - 2rem)';
                navbar.style.borderRadius = '20px';
            } else {
                navbar.style.top = 'var(--space-lg)';
                navbar.style.width = 'calc(100% - var(--space-4xl))';
                navbar.style.borderRadius = '100px';
            }
        });
    }

    // Theme Switcher Logic
    const themeToggle = document.querySelector('.theme-toggle');
    const htmlElement = document.documentElement;

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeToggle) return;
        themeToggle.innerHTML = theme === 'dark'
            ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707.707M12 5a7 7 0 100 14 7 7 0 000-14z"/></svg>'
            : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>';
    }

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link:not(.services-toggle)');
    const servicesToggle = document.querySelector('.services-toggle');
    const subMenu = document.querySelector('.mobile-sub-menu');

    if (mobileMenuBtn && mobileMenuOverlay) {
        mobileMenuBtn.addEventListener('click', () => {
            const isActive = mobileMenuOverlay.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            document.body.style.overflow = isActive ? 'hidden' : '';
        });

        // Close menu when a regular link is clicked
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuOverlay.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Toggle Services Sub-menu
        if (servicesToggle && subMenu) {
            servicesToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                subMenu.classList.toggle('active');
                servicesToggle.textContent = subMenu.classList.contains('active') ? 'Services -' : 'Services +';
            });
        }
    }

    // Intersection Observer for Reveal Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // --- Original Reveal Animations ---
    document.querySelectorAll('.fade-up, .bento-item, .service-card-pro, .insight-card-pro').forEach(el => {
        el.classList.add('fade-up');
        revealObserver.observe(el);
    });

    // --- Clickable Cards Support ---
    document.querySelectorAll('.card-clickable').forEach(card => {
        card.addEventListener('click', () => {
            const url = card.getAttribute('data-url');
            if (url) window.location.href = url;
        });
    });

    // Magnetic Button Effect (Subtle)
    const magneticBtns = document.querySelectorAll('.btn-pro');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.02)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0, 0) scale(1)`;
        });
    });

    // Mouse Tracking Glow
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    document.addEventListener('mousemove', (e) => {
        glow.style.transform = `translate(${e.clientX - 100}px, ${e.clientY - 100}px)`;
    });

    // --- Insights Blog System ---
    const articlesGrid = document.getElementById('articlesGrid');
    const paginationContainer = document.getElementById('pagination');
    const searchInput = document.getElementById('searchInput');
    const tagsContainer = document.getElementById('tagsContainer');
    const homepageInsightsGrid = document.getElementById('homepageInsightsGrid');

    // Elements for single article page
    const articleTitleEl = document.getElementById('articleTitle');
    const articleBodyEl = document.getElementById('articleBody');

    let allArticles = [];
    let filteredArticles = [];
    let currentPage = 1;
    const articlesPerPage = 10;
    let currentTag = 'all';
    let searchQuery = '';

    // Initialize Blog System
    if (articlesGrid || articleTitleEl || homepageInsightsGrid) {
        fetchArticles();
    }

    async function fetchArticles() {
        try {
            // Updated Path to match server location
            const response = await fetch('/data/articles.json');
            if (!response.ok) throw new Error(`Failed to load articles: ${response.statusText}`);
            const data = await response.json();
            allArticles = data.articles;

            if (articlesGrid) {
                // Main Insights Page
                filterArticles();
            } else if (articleTitleEl) {
                // Single Article Page
                const urlParams = new URLSearchParams(window.location.search);
                const articleId = urlParams.get('id');
                if (articleId) {
                    loadSingleArticle(articleId);
                }
            }

            // Homepage Insights (Independent check)
            if (homepageInsightsGrid) {
                renderHomepageInsights();
            }

        } catch (error) {
            console.error('Error fetching articles:', error);
            if (articlesGrid) {
                articlesGrid.innerHTML = '<p style="text-align:center; padding: 2rem;">Unable to load insights. Please try refreshing the page.</p>';
            }
            if (homepageInsightsGrid) {
                homepageInsightsGrid.innerHTML = '<p style="text-align:center; padding: 2rem; width: 100%;">Unable to load insights.</p>';
            }
        }
    }

    function renderHomepageInsights() {
        const homepageInsightsGrid = document.getElementById('homepageInsightsGrid');
        if (!homepageInsightsGrid) return;

        homepageInsightsGrid.innerHTML = '';
        const latestArticles = allArticles.slice(0, 3);

        latestArticles.forEach(article => {
            const card = document.createElement('div');
            card.className = 'related-card fade-up'; // Use related-card style
            const articleUrl = `/insights/article/?id=${article.id}`;

            // Text-only content matching "Related Articles" format
            card.innerHTML = `
                <div class="insight-content related-content">
                    <span class="insight-category">${article.tags ? article.tags[0] : 'Insight'}</span>
                    <h4 class="insight-title related-title">${article.title}</h4>
                </div>
            `;

            card.addEventListener('click', () => {
                window.location.href = articleUrl;
            });

            homepageInsightsGrid.appendChild(card);
            // Reuse existing observer if available
            if (typeof revealObserver !== 'undefined') {
                revealObserver.observe(card);
            } else {
                card.classList.add('visible');
            }
        });
    }

    function filterArticles() {
        filteredArticles = allArticles.filter(article => {
            const matchesTag = currentTag === 'all' || (article.tags && article.tags.includes(currentTag));
            const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesTag && matchesSearch;
        });

        currentPage = 1;
        renderArticles();
        renderPagination();
    }

    function renderArticles() {
        if (!articlesGrid) return;

        articlesGrid.innerHTML = '';

        if (filteredArticles.length === 0) {
            articlesGrid.innerHTML = '<p style="text-align:center; padding: 2rem; width: 100%;">No articles found.</p>';
            return;
        }

        const start = (currentPage - 1) * articlesPerPage;
        const end = start + articlesPerPage;
        const pageArticles = filteredArticles.slice(start, end);

        pageArticles.forEach(article => {
            const card = document.createElement('div');
            card.className = 'insight-card-pro fade-up';
            const articleUrl = `/insights/article/?id=${article.id}`;
            const imageUrl = article.image || '/images/articles/capacity-building.jpg';

            card.innerHTML = `
                <div class="insight-image">
                    <img src="${imageUrl}" alt="${article.title}" loading="lazy">
                    <div class="insight-overlay">
                        <span class="read-more">Read Article</span>
                    </div>
                </div>
                <div class="insight-content">
                    <div class="insight-meta">
                        <span class="insight-date">${formatDate(article.date)}</span>
                        <span class="insight-category">${article.tags ? article.tags[0] : 'Insight'}</span>
                    </div>
                    <h3 class="insight-title">${article.title}</h3>
                    <p class="insight-excerpt">${article.excerpt}</p>
                </div>
            `;

            card.addEventListener('click', () => {
                window.location.href = articleUrl;
            });

            articlesGrid.appendChild(card);
            revealObserver.observe(card);
        });
    }

    function renderPagination() {
        if (!paginationContainer) return;
        paginationContainer.innerHTML = '';

        const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
        if (totalPages <= 1) return;

        if (currentPage > 1) {
            const prevBtn = document.createElement('button');
            prevBtn.className = 'page-btn';
            prevBtn.innerText = '←';
            prevBtn.addEventListener('click', () => changePage(currentPage - 1));
            paginationContainer.appendChild(prevBtn);
        }

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                const btn = document.createElement('button');
                btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
                btn.innerText = i;
                btn.addEventListener('click', () => changePage(i));
                paginationContainer.appendChild(btn);
            } else if (
                (i === currentPage - 2 && i > 1) ||
                (i === currentPage + 2 && i < totalPages)
            ) {
                const span = document.createElement('span');
                span.innerText = '...';
                span.className = 'page-ellipsis';
                paginationContainer.appendChild(span);
            }
        }

        if (currentPage < totalPages) {
            const nextBtn = document.createElement('button');
            nextBtn.className = 'page-btn';
            nextBtn.innerText = '→';
            nextBtn.addEventListener('click', () => changePage(currentPage + 1));
            paginationContainer.appendChild(nextBtn);
        }
    }

    function changePage(page) {
        currentPage = page;
        renderArticles();
        renderPagination();
        const section = document.querySelector('.section');
        if (section) section.scrollIntoView({ behavior: 'smooth' });
    }

    function formatDate(dateString) {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    function loadSingleArticle(id) {
        const article = allArticles.find(a => a.id === id);
        if (!article) {
            if (articleTitleEl) articleTitleEl.innerText = "Article Not Found";
            return;
        }

        document.title = `${article.title} | Norzin Consultancy`;

        if (articleTitleEl) articleTitleEl.innerText = article.title;

        const dateEl = document.getElementById('articleDate');
        if (dateEl) dateEl.innerText = formatDate(article.date);

        const tagEl = document.getElementById('articleTag');
        if (tagEl && article.tags) tagEl.innerText = article.tags[0];

        const imageEl = document.getElementById('articleImage');
        if (imageEl) {
            imageEl.src = article.image || '/images/articles/capacity-building.jpg';
            imageEl.alt = article.title;
        }

        if (articleBodyEl) articleBodyEl.innerHTML = article.content;

        renderRelatedArticles(article);
    }

    function renderRelatedArticles(currentArticle) {
        const relatedGrid = document.getElementById('relatedArticlesGrid');
        if (!relatedGrid) return;

        relatedGrid.innerHTML = '';

        const related = allArticles.filter(a =>
            a.id !== currentArticle.id &&
            a.tags && currentArticle.tags &&
            a.tags.some(t => currentArticle.tags.includes(t))
        ).slice(0, 3);

        const articlesToShow = related.length > 0 ? related : allArticles.filter(a => a.id !== currentArticle.id).slice(0, 3);

        // Ensure the grid has the correct class for 3 columns
        relatedGrid.className = 'articles-grid related-grid';

        articlesToShow.forEach(article => {
            const card = document.createElement('div');
            card.className = 'related-card fade-up';
            // No image, just text content
            card.innerHTML = `
                <div class="insight-content related-content">
                    <span class="insight-category">${article.tags ? article.tags[0] : 'Insight'}</span>
                    <h4 class="insight-title related-title">${article.title}</h4>
                </div>
            `;
            card.addEventListener('click', () => {
                window.location.href = `/insights/article/?id=${article.id}`;
            });
            relatedGrid.appendChild(card);
            revealObserver.observe(card);
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            filterArticles();
        });
    }

    if (tagsContainer) {
        const buttons = tagsContainer.querySelectorAll('.tag-filter');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentTag = btn.getAttribute('data-tag');
                filterArticles();
            });
        });
    }
});

const style = document.createElement('style');
style.textContent = `
    .cursor-glow {
        position: fixed;
        top: 0;
        left: 0;
        width: 200px;
        height: 200px;
        background: radial-gradient(circle, rgba(202, 138, 4, 0.05) 0%, transparent 70%);
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s linear;
    }
`;
document.head.appendChild(style);
