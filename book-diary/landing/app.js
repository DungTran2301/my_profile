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
          <div class="library-view animate-fade">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px;">
              <h3 style="font-size:18px; font-weight:600; color:var(--color-dark)">My Shelves</h3>
              <i class="ti ti-plus" style="font-size:18px; color:var(--color-primary); cursor:pointer"></i>
            </div>
            
            <!-- Book Categories Tabs -->
            <div style="display:flex; gap:8px; overflow-x:auto; padding-bottom:12px; scrollbar-width:none">
              <span style="background:var(--color-primary); color:#FFF; font-size:11px; padding:5px 12px; border-radius:15px; font-weight:600">All (8)</span>
              <span style="background:#FFF; color:var(--color-muted); font-size:11px; padding:5px 12px; border-radius:15px; border:0.5px solid rgba(0,0,0,0.06)">To Read</span>
              <span style="background:#FFF; color:var(--color-muted); font-size:11px; padding:5px 12px; border-radius:15px; border:0.5px solid rgba(0,0,0,0.06)">Reading</span>
            </div>

            <!-- Virtual Shelf Row 1 -->
            <div style="margin-top:14px">
              <p class="section-title" style="margin: 0 0 10px;">Reading Now</p>
              <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px">
                <div style="display:flex; flex-direction:column; align-items:center; cursor:pointer">
                  <div class="book-cover" style="width:72px; height:100px; background:#DFD2C4">
                    <div class="book-spine"></div>
                    <span style="font-size:10px; text-align:center; padding:10px; font-weight:600; color:#4E3524">ALCHEMIST</span>
                  </div>
                  <span style="font-size:10px; font-weight:600; margin-top:6px; text-align:center; overflow:hidden; text-overflow:ellipsis; width:100%; white-space:nowrap">The Alchemist</span>
                </div>
                
                <div style="display:flex; flex-direction:column; align-items:center; cursor:pointer">
                  <div class="book-cover" style="width:72px; height:100px; background:#C1CCD8">
                    <div class="book-spine"></div>
                    <span style="font-size:10px; text-align:center; padding:10px; font-weight:600; color:#2B3D52">MAN'S SEARCH</span>
                  </div>
                  <span style="font-size:10px; font-weight:600; margin-top:6px; text-align:center; overflow:hidden; text-overflow:ellipsis; width:100%; white-space:nowrap">Man's Search</span>
                </div>
                
                <div style="display:flex; flex-direction:column; align-items:center; cursor:pointer">
                  <div class="book-cover" style="width:72px; height:100px; background:#DDD0C8">
                    <div class="book-spine"></div>
                    <span style="font-size:10px; text-align:center; padding:10px; font-weight:600; color:#5D4436">SAPIENS</span>
                  </div>
                  <span style="font-size:10px; font-weight:600; margin-top:6px; text-align:center; overflow:hidden; text-overflow:ellipsis; width:100%; white-space:nowrap">Sapiens</span>
                </div>
              </div>
            </div>

            <!-- Virtual Shelf Row 2 -->
            <div style="margin-top:24px">
              <p class="section-title" style="margin: 0 0 10px;">Next in Queue</p>
              <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px">
                <div style="opacity:0.85; display:flex; flex-direction:column; align-items:center; cursor:pointer">
                  <div class="book-cover" style="width:72px; height:100px; background:#DFDFDF">
                    <div class="book-spine"></div>
                    <i class="ti ti-lock" style="font-size:16px; color:#666"></i>
                  </div>
                  <span style="font-size:10px; font-weight:500; margin-top:6px; text-align:center">1984</span>
                </div>
                <div style="opacity:0.85; display:flex; flex-direction:column; align-items:center; cursor:pointer">
                  <div class="book-cover" style="width:72px; height:100px; background:#E5DFCE">
                    <div class="book-spine"></div>
                    <i class="ti ti-lock" style="font-size:16px; color:#666"></i>
                  </div>
                  <span style="font-size:10px; font-weight:500; margin-top:6px; text-align:center">Atomic Habits</span>
                </div>
                <div style="border:1px dashed var(--color-muted); width:72px; height:100px; border-radius:8px; display:flex; flex-direction:column; align-items:center; justify-content:center; cursor:pointer">
                  <i class="ti ti-plus" style="font-size:20px; color:var(--color-muted)"></i>
                  <span style="font-size:8px; font-weight:600; color:var(--color-muted); margin-top:4px">ADD BOOK</span>
                </div>
              </div>
            </div>
          </div>
        `;
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
          <div class="profile-view animate-fade" style="text-align:center; padding:10px 4px 0">
            <!-- Avatar mockup -->
            <div style="width:68px; height:68px; border-radius:50%; background:var(--color-primary); color:#FFF; display:flex; align-items:center; justify-content:center; font-size:22px; font-weight:700; margin:0 auto 10px; border:2px solid #FFF; box-shadow:0 4px 10px rgba(0,0,0,0.1)">JD</div>
            <h3 style="font-size:16px; font-weight:600; color:var(--color-dark); margin-bottom:2px">Jane Doe</h3>
            <span style="font-size:11px; color:var(--color-muted)">Book Enthusiast</span>
            
            <!-- Small dashboard metrics grid -->
            <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:10px; margin-top:20px">
              <div style="background:#FFF; border-radius:12px; padding:12px; border:0.5px solid rgba(0,0,0,0.05); text-align:center">
                <span style="font-size:18px; font-weight:700; color:var(--color-primary)">18</span>
                <p style="font-size:10px; color:var(--color-muted); margin-top:2px">Books Completed</p>
              </div>
              <div style="background:#FFF; border-radius:12px; padding:12px; border:0.5px solid rgba(0,0,0,0.05); text-align:center">
                <span style="font-size:18px; font-weight:700; color:var(--color-primary)">68</span>
                <p style="font-size:10px; color:var(--color-muted); margin-top:2px">Saved Highlights</p>
              </div>
            </div>

            <!-- Achievement badges -->
            <p class="section-title" style="margin: 20px 0 8px; text-align:left">Earned Badges</p>
            <div style="display:flex; justify-content:flex-start; gap:12px">
              <div style="display:flex; flex-direction:column; align-items:center" title="10-day reading streak badge">
                <span style="font-size:22px; background:#FFF; width:42px; height:42px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 6px rgba(0,0,0,0.05); border:0.5px solid rgba(0,0,0,0.05)">🔥</span>
                <span style="font-size:8px; font-weight:600; margin-top:4px">Streak Hero</span>
              </div>
              <div style="display:flex; flex-direction:column; align-items:center" title="Logged 50 highlights badge">
                <span style="font-size:22px; background:#FFF; width:42px; height:42px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 6px rgba(0,0,0,0.05); border:0.5px solid rgba(0,0,0,0.05)">✍️</span>
                <span style="font-size:8px; font-weight:600; margin-top:4px">Scribe</span>
              </div>
              <div style="display:flex; flex-direction:column; align-items:center" title="Finished first classic badge">
                <span style="font-size:22px; background:#FFF; width:42px; height:42px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 6px rgba(0,0,0,0.05); border:0.5px solid rgba(0,0,0,0.05)">🏛️</span>
                <span style="font-size:8px; font-weight:600; margin-top:4px">Classic Lover</span>
              </div>
            </div>
          </div>
        `;
      }
    });
  });

});
