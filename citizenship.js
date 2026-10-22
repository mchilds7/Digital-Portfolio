/**
 * Digital Citizenship Interactive Scripts
 * Handles category filtering, interactive quiz scorecard, mobile menu, and checklist tracking
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Enforce Dark Mode
  document.documentElement.setAttribute('data-theme', 'dark');

  // 2. Mobile Drawer Navigation
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      menuToggle.classList.toggle('active', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        mobileMenu.classList.remove('open');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 3. 9 Elements Category Filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const elementCards = document.querySelectorAll('.element-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      elementCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 4. Interactive Quiz / Scorecard Controller
  const quizForm = document.getElementById('citizenship-quiz-form');
  const quizResultBox = document.getElementById('quiz-result');
  const scoreBadge = document.getElementById('score-badge');
  const scoreTitle = document.getElementById('score-title');
  const scoreAdvice = document.getElementById('score-advice');

  // Highlight selected radio label option
  const radioInputs = document.querySelectorAll('.quiz-option-label input[type="radio"]');
  radioInputs.forEach(input => {
    input.addEventListener('change', () => {
      const parentName = input.getAttribute('name');
      document.querySelectorAll(`input[name="${parentName}"]`).forEach(sibling => {
        sibling.closest('.quiz-option-label').classList.remove('selected');
      });
      input.closest('.quiz-option-label').classList.add('selected');
    });
  });

  if (quizForm) {
    quizForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let totalScore = 0;
      let answeredCount = 0;
      const totalQuestions = 5;

      for (let i = 1; i <= totalQuestions; i++) {
        const selected = quizForm.querySelector(`input[name="q${i}"]:checked`);
        if (selected) {
          totalScore += parseInt(selected.value, 10);
          answeredCount++;
        }
      }

      if (answeredCount < totalQuestions) {
        alert(`Please answer all ${totalQuestions} questions to view your digital citizenship assessment score.`);
        return;
      }

      // Display custom tailored feedback based on score (Scale: 0 to 10 points)
      quizResultBox.style.display = 'block';

      if (totalScore >= 9) {
        scoreBadge.textContent = `${totalScore} / 10`;
        scoreBadge.style.color = '#34d399'; // Emerald
        scoreTitle.textContent = '🌟 Exemplary Digital Citizen & Tech Role Model';
        scoreAdvice.innerHTML = 'Outstanding! You consistently exercise situational awareness, practice sound digital hygiene, respect intellectual property, critically verify information, and uphold ethical standards online. You embody the principles of the REP model.';
      } else if (totalScore >= 6) {
        scoreBadge.textContent = `${totalScore} / 10`;
        scoreBadge.style.color = '#60a5fa'; // Blue
        scoreTitle.textContent = '👍 Conscientious Digital Citizen';
        scoreAdvice.innerHTML = 'Great job! You have strong instincts for online safety and ethics. Focusing on deeper fact-checking (the SIFT method) and reviewing account privacy settings regularly will help elevate your digital citizenship to the master level.';
      } else {
        scoreBadge.textContent = `${totalScore} / 10`;
        scoreBadge.style.color = '#f59e0b'; // Amber
        scoreTitle.textContent = '⚠️ Developing Digital Awareness';
        scoreAdvice.innerHTML = 'You are on your way, but there are important areas to protect: verify sources before sharing, avoid reusing passwords, check digital privacy permissions, and remember that digital footprints are permanent.';
      }

      quizResultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  // 5. Scroll-spy for In-page Navigation Links
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else if (link.getAttribute('href').startsWith('#')) {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  // 6. Interactive Checklist Item Click-to-Check
  const checkItems = document.querySelectorAll('.check-item');
  checkItems.forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      const isDone = item.classList.toggle('item-completed');
      if (isDone) {
        item.style.opacity = '0.6';
        item.style.textDecoration = 'line-through';
      } else {
        item.style.opacity = '1';
        item.style.textDecoration = 'none';
      }
    });
  });
});
