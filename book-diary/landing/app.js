/**
 * Book Diary Landing Page Interactivity
 * Coordinates interactive phone mockup simulations and pre-launch waitlist registrations.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. FAQ Accordion Logic
  // ==========================================================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const panel = item.querySelector('.faq-panel');

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other FAQ items for clean accordion effect
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
          otherItem.querySelector('.faq-panel').style.maxHeight = null;
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
        panel.style.maxHeight = null;
      } else {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });


  // ==========================================================================
  // 2. Waitlist Registration Logic
  // ==========================================================================
  const baseCount = 1420;
  const waitlistCountElem = document.getElementById('waitlist-count');
  const quickForm = document.getElementById('hero-quick-form');
  const mainForm = document.getElementById('waitlist-form');
  const successState = document.getElementById('waitlist-success');
  const registeredEmailElem = document.getElementById('registered-email');
  const ticketNumberElem = document.getElementById('ticket-number');
  const resetBtn = document.getElementById('btn-reset-waitlist');

  // Retrieve existing waitlist signups from localStorage to maintain count
  const getStoredRegistrations = () => {
    try {
      const stored = localStorage.getItem('book_diary_waitlist');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  };

  const updateWaitlistCountDisplay = () => {
    const totalCount = baseCount + getStoredRegistrations().length;
    if (waitlistCountElem) {
      waitlistCountElem.textContent = totalCount.toLocaleString();
    }
  };

  // Set initial count
  updateWaitlistCountDisplay();

  // Save new waitlist entry
  const registerUser = (name, email, persona) => {
    const currentList = getStoredRegistrations();
    
    // Check if email already registered
    const exists = currentList.some(user => user.email.toLowerCase() === email.toLowerCase());
    
    if (!exists) {
      currentList.push({ name, email, persona, date: new Date().toISOString() });
      localStorage.setItem('book_diary_waitlist', JSON.stringify(currentList));
    }
    
    // Trigger count increment
    updateWaitlistCountDisplay();
    
    // Calculate custom ticket position
    const position = baseCount + currentList.length;
    return position;
  };

  // Show signup success panel
  const handleSuccessUI = (email, ticketPos) => {
    // Hide form, show success state
    mainForm.style.display = 'none';
    successState.style.display = 'flex';
    
    // Update labels
    registeredEmailElem.textContent = email;
    ticketNumberElem.textContent = `#${ticketPos.toLocaleString()}`;
    
    // Scroll waitlist section into focus
    document.getElementById('waitlist').scrollIntoView({ behavior: 'smooth' });
  };

  // Bottom Main Form Submission
  if (mainForm) {
    mainForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('user-name').value.trim();
      const email = document.getElementById('user-email').value.trim();
      const persona = document.querySelector('input[name="persona"]:checked')?.value || 'bookworm';
      
      const queuePosition = registerUser(name, email, persona);
      handleSuccessUI(email, queuePosition);
    });
  }

  // Top Quick Form Submission
  if (quickForm) {
    quickForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const emailInput = quickForm.querySelector('.quick-email-input');
      const email = emailInput.value.trim();
      
      // Auto register with generic name and default role
      const queuePosition = registerUser('Early Adopter', email, 'bookworm');
      
      // Clear quick input
      emailInput.value = '';
      
      // Transition to success screen
      handleSuccessUI(email, queuePosition);
    });
  }

  // Reset form to register another email
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      successState.style.display = 'none';
      mainForm.style.display = 'flex';
      mainForm.reset();
    });
  }


  // ==========================================================================
  // 3. Interactive Smartphone Preview Simulation
  // ==========================================================================
  
  // App elements to update
  const appScrollArea = document.querySelector('.app-content-scroll');
  const tabItems = document.querySelectorAll('.tab-item');
  const streakPill = document.getElementById('app-streak-pill');
  
  // Save base home page HTML to reload later
  const homeHtmlContent = appScrollArea.innerHTML;
  
  // Core dynamic variables for mockup interaction
  let activeBookPages = 144;
  const activeBookTotal = 200;
  let weeklyPagesRead = 214;
  let weeklyReadingHours = 4.2;
  let streakDays = 12;
  
  // Add listeners for dynamic interactive elements on Home view
  const initializeHomeInteractivity = () => {
    const updateProgressBtn = document.getElementById('btn-update-progress');
    const openNotesBtn = document.getElementById('btn-open-notes');
    
    // Mock progress update incrementor
    if (updateProgressBtn) {
      updateProgressBtn.addEventListener('click', () => {
        if (activeBookPages < activeBookTotal) {
          // Add 14 pages
          activeBookPages = Math.min(activeBookPages + 14, activeBookTotal);
          weeklyPagesRead += 14;
          weeklyReadingHours = parseFloat((weeklyReadingHours + 0.3).toFixed(1));
          
          // Calculate percentage
          const pct = Math.round((activeBookPages / activeBookTotal) * 100);
          
          // Update DOM inside phone mock
          const progressFill = document.getElementById('active-progress-fill');
          const progressPct = document.getElementById('active-progress-pct');
          const progressPages = document.getElementById('active-progress-pages');
          const statPages = document.getElementById('stat-pages');
          const statHours = document.getElementById('stat-hours');
          
          if (progressFill) progressFill.style.width = `${pct}%`;
          if (progressPct) progressPct.textContent = `${pct}%`;
          if (progressPages) progressPages.textContent = `${activeBookPages} / ${activeBookTotal} pages`;
          if (statPages) statPages.textContent = weeklyPagesRead;
          if (statHours) statHours.textContent = weeklyReadingHours;
          
          // Complete state check
          if (activeBookPages === activeBookTotal) {
            updateProgressBtn.textContent = 'Completed! 🎉';
            updateProgressBtn.style.backgroundColor = '#2E7D32';
            
            // Celebrate visually inside quote/notes
            const quoteText = document.getElementById('quote-text');
            const quoteBook = document.getElementById('quote-book-tag');
            const quotePage = document.getElementById('quote-page-tag');
            const quoteTime = document.getElementById('quote-time');
            
            if (quoteText) quoteText.textContent = "“The fear of suffering is worse than the suffering itself. And no heart has ever suffered when it goes in search of its dreams.”";
            if (quoteBook) quoteBook.textContent = "The Alchemist";
            if (quotePage) quotePage.textContent = "Finished! 🌟";
            if (quoteTime) quoteTime.textContent = "Just now";
          }
        } else {
          // Reset mock state to try again
          activeBookPages = 0;
          updateProgressBtn.textContent = 'Update Progress';
          updateProgressBtn.style.backgroundColor = 'var(--color-primary)';
          
          const progressFill = document.getElementById('active-progress-fill');
          const progressPct = document.getElementById('active-progress-pct');
          const progressPages = document.getElementById('active-progress-pages');
          
          if (progressFill) progressFill.style.width = `0%`;
          if (progressPct) progressPct.textContent = `0%`;
          if (progressPages) progressPages.textContent = `0 / ${activeBookTotal} pages`;
        }
      });
    }

    if (openNotesBtn) {
      openNotesBtn.addEventListener('click', () => {
        // Toggle view to quote/scrapbook preview section
        const quoteCard = document.querySelector('.quote-card');
        if (quoteCard) {
          quoteCard.style.transform = 'scale(1.05)';
          quoteCard.style.borderColor = 'var(--color-primary)';
          setTimeout(() => {
            quoteCard.style.transform = 'scale(1)';
            quoteCard.style.borderColor = 'rgba(0,0,0,0.06)';
          }, 400);
        }
      });
    }
  };

  // App Streak clicker interaction
  if (streakPill) {
    streakPill.addEventListener('click', () => {
      streakDays += 1;
      streakPill.textContent = `🔥 ${streakDays} days`;
      streakPill.style.transform = 'scale(1.15)';
      setTimeout(() => {
        streakPill.style.transform = 'scale(1)';
      }, 150);
    });
  }

  // Initialize Home actions first
  initializeHomeInteractivity();

  // ==========================================================================
  // Helper functions & Interactivity for Bookshelf Simulation
  // ==========================================================================
  
  // Helper to show custom dynamic toast notifications inside the phone screen
  const showPhoneToast = (message) => {
    // Remove existing toast if any
    const existingToast = document.querySelector('.phone-toast');
    if (existingToast) {
      existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'phone-toast';
    toast.innerHTML = `<i class="ti ti-circle-check"></i> <span>${message}</span>`;
    
    // Append toast to the phone screen
    const phoneScreen = document.getElementById('app-screen');
    if (phoneScreen) {
      phoneScreen.appendChild(toast);
      
      // Auto fade out after 2.5 seconds
      setTimeout(() => {
        toast.classList.add('fade-out');
        toast.addEventListener('animationend', () => {
          toast.remove();
        });
      }, 2500);
    }
  };

  // Pool of premium random books to add
  const extraBooksPool = [
    { title: "1984", author: "George Orwell", status: "want", pages: 328, read: 0, coverClass: "cover-teal", icon: "ti-eye" },
    { title: "The Hobbit", author: "J.R.R. Tolkien", status: "reading", pages: 310, read: 95, coverClass: "cover-orange", icon: "ti-dragon" },
    { title: "Educated", author: "Tara Westover", status: "done", pages: 352, read: 352, coverClass: "cover-purple", icon: "ti-school" },
    { title: "Deep Work", author: "Cal Newport", status: "reading", pages: 304, read: 120, coverClass: "cover-blue", icon: "ti-battery-automotive" },
    { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", status: "want", pages: 499, read: 0, coverClass: "cover-pink", icon: "ti-brain" }
  ];
  let poolIndex = 0;

  const initializeBookshelfInteractivity = () => {
    const bookshelfView = appScrollArea.querySelector('.bookshelf-view');
    if (!bookshelfView) return;

    const searchInput = bookshelfView.querySelector('.bookshelf-search-input');
    const tabPills = bookshelfView.querySelectorAll('.tab-pill');
    const bookList = bookshelfView.querySelector('#bookshelf-book-list');
    const countLabel = bookshelfView.querySelector('#bookshelf-count-label');
    const btnAdd = bookshelfView.querySelector('#btn-bookshelf-add');

    // Function to filter the book list based on current active tab and search query
    const filterBooks = () => {
      const activeTab = bookshelfView.querySelector('.tab-pill.active');
      const activeFilter = activeTab ? activeTab.getAttribute('data-filter') : 'all';
      const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';

      const bookItems = bookList.querySelectorAll('.book-item');
      let visibleCount = 0;

      bookItems.forEach(item => {
        const title = item.getAttribute('data-title').toLowerCase();
        const author = item.getAttribute('data-author').toLowerCase();
        const status = item.getAttribute('data-status');

        const matchesFilter = activeFilter === 'all' || status === activeFilter;
        const matchesSearch = title.includes(searchQuery) || author.includes(searchQuery);

        if (matchesFilter && matchesSearch) {
          item.style.display = 'flex';
          visibleCount++;
        } else {
          item.style.display = 'none';
        }
      });

      // Update count label
      if (countLabel) {
        countLabel.textContent = `${visibleCount} ${visibleCount === 1 ? 'book' : 'books'}`;
      }
    };

    // 1. Tab Pill filter event listeners
    tabPills.forEach(pill => {
      pill.addEventListener('click', () => {
        tabPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        filterBooks();
      });
    });

    // 2. Search input live search
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        filterBooks();
      });
    }

    // 3. Add Book dynamic injection logic
    if (btnAdd) {
      btnAdd.addEventListener('click', () => {
        const bookData = extraBooksPool[poolIndex];
        // Cycle index
        poolIndex = (poolIndex + 1) % extraBooksPool.length;

        // Construct new book HTML elements
        const bookItem = document.createElement('div');
        bookItem.className = 'book-item';
        bookItem.setAttribute('data-status', bookData.status);
        bookItem.setAttribute('data-title', bookData.title);
        bookItem.setAttribute('data-author', bookData.author);
        
        let progressHtml = '';
        if (bookData.status === 'done') {
          progressHtml = `
            <div class="progress-row">
              <span class="progress-label">${bookData.pages} / ${bookData.pages} pages</span>
              <span class="progress-pct">100%</span>
            </div>
            <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:100%"></div></div>
            <span class="badge badge-done">Completed</span>
          `;
        } else if (bookData.status === 'reading') {
          const pct = Math.round((bookData.read / bookData.pages) * 100);
          progressHtml = `
            <div class="progress-row">
              <span class="progress-label">${bookData.read} / ${bookData.pages} pages</span>
              <span class="progress-pct">${pct}%</span>
            </div>
            <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
          `;
        } else {
          progressHtml = `<span class="badge badge-want">Want to Read</span>`;
        }

        bookItem.innerHTML = `
          <div class="book-cover ${bookData.coverClass}">
            <div class="cover-spine"></div>
            <i class="ti ${bookData.icon}" aria-hidden="true"></i>
          </div>
          <div class="book-meta">
            <div class="book-title">${bookData.title}</div>
            <div class="book-author">${bookData.author}</div>
            ${progressHtml}
          </div>
          <div class="icon-btn btn-book-options"><i class="ti ti-dots-vertical" aria-hidden="true"></i></div>
        `;

        // Prepend to the top of book list
        bookList.insertBefore(bookItem, bookList.firstChild);

        // Animate new item entry
        bookItem.style.transform = 'scale(0.8)';
        bookItem.style.opacity = '0';
        setTimeout(() => {
          bookItem.style.transform = 'scale(1)';
          bookItem.style.opacity = '1';
        }, 50);

        // Update list filtering and count
        filterBooks();

        // Show a gorgeous success toast inside simulator!
        showPhoneToast(`Added "${bookData.title}" to library!`);

        // Add options click handler to the new item
        bindOptionsClick(bookItem.querySelector('.btn-book-options'), bookData.title);
      });
    }

    // Helper function to bind dots vertical click interaction
    const bindOptionsClick = (btn, title) => {
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          showPhoneToast(`Options for "${title}" coming soon!`);
        });
      }
    };

    // Bind dots-vertical action button listeners to existing items
    const optionBtns = bookList.querySelectorAll('.btn-book-options');
    optionBtns.forEach(btn => {
      const title = btn.closest('.book-item').getAttribute('data-title');
      bindOptionsClick(btn, title);
    });
  };

  const initializeProfileInteractivity = () => {
    const profileView = appScrollArea.querySelector('.profile-view');
    if (!profileView) return;

    // Toggle switch logic
    const toggles = profileView.querySelectorAll('.toggle-bg');
    toggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOff = toggle.classList.toggle('off');
        const rowLabel = toggle.closest('.ios-row').querySelector('.ios-row-label').textContent;
        const stateText = isOff ? 'Disabled' : 'Enabled';
        showPhoneToast(`${rowLabel}: ${stateText}`);
      });
    });

    // Custom alerts for settings rows
    const clickableRows = profileView.querySelectorAll('.ios-row');
    clickableRows.forEach(row => {
      row.addEventListener('click', (e) => {
        // Skip clicking if the click originated from the toggle switch itself
        if (e.target.closest('.toggle-bg')) return;
        
        const label = row.querySelector('.ios-row-label').textContent;
        
        // Handle custom feedback for different types of settings
        if (label === 'Reminder Time') {
          showPhoneToast('Reminder scheduled at 21:00');
        } else if (label === "What's New") {
          showPhoneToast('You are on the latest version!');
        } else if (label === 'Version') {
          showPhoneToast('Book Diary v1.0.0 (Premium)');
        } else {
          showPhoneToast(`Opened settings for "${label}"`);
        }
      });
    });
  };

  // Tab View Swapping Logic
  tabItems.forEach(tab => {
    tab.addEventListener('click', () => {
      const selectedTab = tab.getAttribute('data-tab');

      // Update active state in navigation tabs
      tabItems.forEach(item => {
        item.classList.remove('active');
        item.querySelector('.tab-icon').classList.remove('active');
        item.querySelector('.tab-label').classList.remove('active');
      });

      tab.classList.add('active');
      tab.querySelector('.tab-icon').classList.add('active');
      tab.querySelector('.tab-label').classList.add('active');

      // Populate layout details for respective app view
      if (selectedTab === 'home') {
        appScrollArea.innerHTML = homeHtmlContent;
        // Re-bind click event listeners to new DOM nodes
        initializeHomeInteractivity();
      } 
      else if (selectedTab === 'library') {
        appScrollArea.innerHTML = `
          <div class="bookshelf-view">
            <div class="topbar">
              <span class="topbar-title">Bookshelf</span>
              <button class="btn-add" id="btn-bookshelf-add" aria-label="Add book">
                <i class="ti ti-plus" aria-hidden="true"></i>
              </button>
            </div>

            <div class="search-bar">
              <i class="ti ti-search" aria-hidden="true"></i>
              <input type="text" class="bookshelf-search-input" placeholder="Search books, authors..." />
            </div>

            <div class="tabs-scroll-wrap">
              <div class="tabs-row">
                <div class="tab-pill active" data-filter="all">All</div>
                <div class="tab-pill" data-filter="want">Want to Read</div>
                <div class="tab-pill" data-filter="reading">Reading</div>
                <div class="tab-pill" data-filter="done">Completed</div>
              </div>
            </div>

            <div class="count-bar">
              <span class="count-label" id="bookshelf-count-label">5 books</span>
              <div class="sort-btn">
                <i class="ti ti-arrows-sort" style="font-size:14px" aria-hidden="true"></i>
                <span>Sort</span>
              </div>
            </div>

            <div class="book-list" id="bookshelf-book-list">
              <div class="book-item" data-status="done" data-title="The Great Gatsby" data-author="F. Scott Fitzgerald">
                <div class="book-cover cover-orange">
                  <div class="cover-spine"></div>
                  <i class="ti ti-crown" aria-hidden="true"></i>
                </div>
                <div class="book-meta">
                  <div class="book-title">The Great Gatsby</div>
                  <div class="book-author">F. Scott Fitzgerald</div>
                  <div class="progress-row">
                    <span class="progress-label">180 / 180 pages</span>
                    <span class="progress-pct">100%</span>
                  </div>
                  <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:100%"></div></div>
                  <span class="badge badge-done">Completed</span>
                </div>
                <div class="icon-btn btn-book-options"><i class="ti ti-dots-vertical" aria-hidden="true"></i></div>
              </div>

              <div class="book-item" data-status="reading" data-title="Sapiens: A Brief History of Humankind" data-author="Yuval Noah Harari">
                <div class="book-cover cover-teal">
                  <div class="cover-spine"></div>
                  <i class="ti ti-world" aria-hidden="true"></i>
                </div>
                <div class="book-meta">
                  <div class="book-title">Sapiens: A Brief History of Humankind</div>
                  <div class="book-author">Yuval Noah Harari</div>
                  <div class="progress-row">
                    <span class="progress-label">186 / 414 pages</span>
                    <span class="progress-pct">45%</span>
                  </div>
                  <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:45%"></div></div>
                </div>
                <div class="icon-btn btn-book-options"><i class="ti ti-dots-vertical" aria-hidden="true"></i></div>
              </div>

              <div class="book-item" data-status="want" data-title="How to Win Friends & Influence People" data-author="Dale Carnegie">
                <div class="book-cover cover-purple">
                  <div class="cover-spine"></div>
                  <i class="ti ti-users" aria-hidden="true"></i>
                </div>
                <div class="book-meta">
                  <div class="book-title">How to Win Friends & Influence People</div>
                  <div class="book-author">Dale Carnegie</div>
                  <span class="badge badge-want">Want to Read</span>
                </div>
                <div class="icon-btn btn-book-options"><i class="ti ti-dots-vertical" aria-hidden="true"></i></div>
              </div>

              <div class="book-item" data-status="done" data-title="Atomic Habits" data-author="James Clear">
                <div class="book-cover cover-blue">
                  <div class="cover-spine"></div>
                  <i class="ti ti-flame" aria-hidden="true"></i>
                </div>
                <div class="book-meta">
                  <div class="book-title">Atomic Habits</div>
                  <div class="book-author">James Clear</div>
                  <div class="progress-row">
                    <span class="progress-label">320 / 320 pages</span>
                    <span class="progress-pct">100%</span>
                  </div>
                  <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:100%"></div></div>
                  <span class="badge badge-done">Completed</span>
                </div>
                <div class="icon-btn btn-book-options"><i class="ti ti-dots-vertical" aria-hidden="true"></i></div>
              </div>

              <div class="book-item" data-status="want" data-title="The Alchemist" data-author="Paulo Coelho">
                <div class="book-cover cover-pink">
                  <div class="cover-spine"></div>
                  <i class="ti ti-stars" aria-hidden="true"></i>
                </div>
                <div class="book-meta">
                  <div class="book-title">The Alchemist</div>
                  <div class="book-author">Paulo Coelho</div>
                  <span class="badge badge-want">Want to Read</span>
                </div>
                <div class="icon-btn btn-book-options"><i class="ti ti-dots-vertical" aria-hidden="true"></i></div>
              </div>
            </div>
          </div>
        `;
        
        // Initialize dynamic search, filter pills, and add book actions
        initializeBookshelfInteractivity();
      } 
      else if (selectedTab === 'discover') {
        appScrollArea.innerHTML = `
          <div class="discover-view animate-fade">
            <h3 style="font-size:18px; font-weight:600; color:var(--color-dark); margin-bottom:14px">Explore</h3>
            
            <!-- Custom Search Box -->
            <div style="background:#FFF; border:0.5px solid rgba(0,0,0,0.06); border-radius:12px; display:flex; align-items:center; gap:8px; padding:10px 14px; margin-bottom:18px">
              <i class="ti ti-search" style="color:var(--color-muted); font-size:16px"></i>
              <span style="font-size:12px; color:var(--color-muted)">Search authors, titles, notes...</span>
            </div>

            <!-- Categories -->
            <p class="section-title" style="margin: 0 0 10px;">Recommended Topics</p>
            <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:20px">
              <span style="background:#FFF; border:0.5px solid rgba(0,0,0,0.06); font-size:11px; padding:6px 12px; border-radius:15px; cursor:pointer">🧠 Psychology</span>
              <span style="background:#FFF; border:0.5px solid rgba(0,0,0,0.06); font-size:11px; padding:6px 12px; border-radius:15px; cursor:pointer">🏛️ Philosophy</span>
              <span style="background:#FFF; border:0.5px solid rgba(0,0,0,0.06); font-size:11px; padding:6px 12px; border-radius:15px; cursor:pointer">📈 Self-Growth</span>
              <span style="background:#FFF; border:0.5px solid rgba(0,0,0,0.06); font-size:11px; padding:6px 12px; border-radius:15px; cursor:pointer">✨ Fiction</span>
            </div>

            <!-- Curated Book of the Day -->
            <p class="section-title" style="margin: 0 0 10px;">Popular in Book Diary</p>
            <div class="book-card" style="margin-bottom:0">
              <div class="book-cover" style="background:#DDD5C7">
                <div class="book-spine"></div>
                <i class="ti ti-flame" style="font-size:20px; color:#C8622A"></i>
              </div>
              <div class="book-info">
                <div class="book-title" style="font-size:13px">Deep Work</div>
                <div class="book-author" style="font-size:11px; margin-bottom:6px">Cal Newport</div>
                <p style="font-size:11px; line-height:1.4; color:var(--color-muted); margin-bottom:8px">"Rules for focused success in a distracted world."</p>
                <button class="btn-primary" style="padding:4px 10px; font-size:11px; border-radius:6px; width:fit-content; border:none; background:var(--color-primary); color:#FFF; cursor:pointer">Add to Queue</button>
              </div>
            </div>
          </div>
        `;
      } 
      else if (selectedTab === 'profile') {
        appScrollArea.innerHTML = `
          <div class="profile-view animate-fade">
            <div class="section-label">Statistics</div>
            <div class="ios-card">
              <div class="goal-bar-wrap">
                <div class="goal-row">
                  <span class="goal-title">2026 Reading Goal</span>
                  <span class="goal-pct">60%</span>
                </div>
                <div class="goal-bar-bg"><div class="goal-bar-fill"></div></div>
                <div class="goal-sub">18 / 30 books · 12 books to go</div>
              </div>
              <div class="stat-grid">
                <div class="stat-cell">
                  <div class="stat-icon-wrap" style="background:#FFF0E6">
                    <i class="ti ti-books" style="color:#C8622A" aria-hidden="true"></i>
                  </div>
                  <div class="stat-text">
                    <div class="stat-num">18</div>
                    <div class="stat-label">Books Read</div>
                  </div>
                </div>
                <div class="stat-cell">
                  <div class="stat-icon-wrap" style="background:#E8F4FF">
                    <i class="ti ti-notes" style="color:#185FA5" aria-hidden="true"></i>
                  </div>
                  <div class="stat-text">
                    <div class="stat-num">142</div>
                    <div class="stat-label">Notes Captured</div>
                  </div>
                </div>
                <div class="stat-cell">
                  <div class="stat-icon-wrap" style="background:#F0EEFF">
                    <i class="ti ti-quote" style="color:#534AB7" aria-hidden="true"></i>
                  </div>
                  <div class="stat-text">
                    <div class="stat-num">87</div>
                    <div class="stat-label">Quotes Saved</div>
                  </div>
                </div>
                <div class="stat-cell">
                  <div class="stat-icon-wrap" style="background:#E6FAF2">
                    <i class="ti ti-clock" style="color:#0F6E56" aria-hidden="true"></i>
                  </div>
                  <div class="stat-text">
                    <div class="stat-num">124h</div>
                    <div class="stat-label">Total Hours</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="section-label">Notifications</div>
            <div class="ios-card">
              <div class="ios-row">
                <div class="ios-icon-wrap" style="background:#FF6B35">
                  <i class="ti ti-bell" aria-hidden="true"></i>
                </div>
                <span class="ios-row-label">Daily Reading Reminder</span>
                <div class="toggle-bg"><div class="toggle-knob"></div></div>
              </div>
              <div class="ios-row">
                <div class="ios-icon-wrap" style="background:#5856D6">
                  <i class="ti ti-clock" aria-hidden="true"></i>
                </div>
                <span class="ios-row-label">Reminder Time</span>
                <div class="ios-row-right">
                  <span class="ios-badge-text">21:00</span>
                  <i class="ti ti-chevron-right chevron" aria-hidden="true"></i>
                </div>
              </div>
              <div class="ios-row">
                <div class="ios-icon-wrap" style="background:#34C759">
                  <i class="ti ti-trophy" aria-hidden="true"></i>
                </div>
                <span class="ios-row-label">Achievement Alerts</span>
                <div class="toggle-bg off"><div class="toggle-knob"></div></div>
              </div>
            </div>

            <div class="section-label">Community</div>
            <div class="ios-card">
              <div class="ios-row">
                <div class="ios-icon-wrap" style="background:#FF9500">
                  <i class="ti ti-star" aria-hidden="true"></i>
                </div>
                <span class="ios-row-label">Rate on App Store</span>
                <i class="ti ti-chevron-right chevron" aria-hidden="true"></i>
              </div>
              <div class="ios-row">
                <div class="ios-icon-wrap" style="background:#007AFF">
                  <i class="ti ti-message" aria-hidden="true"></i>
                </div>
                <span class="ios-row-label">Send Feedback</span>
                <i class="ti ti-chevron-right chevron" aria-hidden="true"></i>
              </div>
              <div class="ios-row">
                <div class="ios-icon-wrap" style="background:#FF3B30">
                  <i class="ti ti-bug" aria-hidden="true"></i>
                </div>
                <span class="ios-row-label">Report a Bug</span>
                <i class="ti ti-chevron-right chevron" aria-hidden="true"></i>
              </div>
              <div class="ios-row">
                <div class="ios-icon-wrap" style="background:#30B0C7">
                  <i class="ti ti-bulb" aria-hidden="true"></i>
                </div>
                <span class="ios-row-label">Request a Feature</span>
                <i class="ti ti-chevron-right chevron" aria-hidden="true"></i>
              </div>
            </div>

            <div class="section-label">Information</div>
            <div class="ios-card" style="margin-bottom:0">
              <div class="ios-row">
                <div class="ios-icon-wrap" style="background:#FF2D55">
                  <i class="ti ti-sparkles" aria-hidden="true"></i>
                </div>
                <span class="ios-row-label">What's New</span>
                <div class="ios-row-right">
                  <span style="background:#FF3B30;color:#fff;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600">New</span>
                  <i class="ti ti-chevron-right chevron" aria-hidden="true"></i>
                </div>
              </div>
              <div class="ios-row">
                <div class="ios-icon-wrap" style="background:#636366">
                  <i class="ti ti-lock" aria-hidden="true"></i>
                </div>
                <span class="ios-row-label">Privacy Policy</span>
                <i class="ti ti-chevron-right chevron" aria-hidden="true"></i>
              </div>
              <div class="ios-row">
                <div class="ios-icon-wrap" style="background:#8E8E93">
                  <i class="ti ti-file-text" aria-hidden="true"></i>
                </div>
                <span class="ios-row-label">Terms of Service</span>
                <i class="ti ti-chevron-right chevron" aria-hidden="true"></i>
              </div>
              <div class="ios-row">
                <div class="ios-icon-wrap" style="background:#AEAEB2">
                  <i class="ti ti-info-circle" aria-hidden="true"></i>
                </div>
                <span class="ios-row-label">Version</span>
                <span class="ios-badge-text">1.0.0</span>
              </div>
            </div>
          </div>
        `;
        initializeProfileInteractivity();
      }
    });
  });

});
