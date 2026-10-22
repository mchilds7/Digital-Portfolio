/**
 * Cybersecurity & Information Protection Interactive Scripts
 * Handles Password Entropy & Strength Lab, Passphrase Generator,
 * Phishing Threat Inspector, 10-Point Audit Checklist, and Knowledge Quiz
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Permanent Dark Mode Enforcement
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

  // 3. Scroll-spy for In-page Navigation Links
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

  // 4. Interactive Password Entropy & Strength Analyzer
  const pwdInput = document.getElementById('sec-password-input');
  const pwdToggleBtn = document.getElementById('sec-pwd-toggle');
  const meterFill = document.getElementById('sec-meter-fill');
  const meterLabel = document.getElementById('sec-meter-label');
  const entropyBitsEl = document.getElementById('sec-entropy-bits');
  const crackTimeEl = document.getElementById('sec-crack-time');
  const poolSizeEl = document.getElementById('sec-pool-size');

  const critLen = document.getElementById('crit-len');
  const critUpper = document.getElementById('crit-upper');
  const critLower = document.getElementById('crit-lower');
  const critNum = document.getElementById('crit-num');
  const critSym = document.getElementById('crit-sym');

  const generatePassphraseBtn = document.getElementById('generate-passphrase-btn');

  // Toggle Password Visibility
  if (pwdToggleBtn && pwdInput) {
    pwdToggleBtn.addEventListener('click', () => {
      const isPassword = pwdInput.getAttribute('type') === 'password';
      pwdInput.setAttribute('type', isPassword ? 'text' : 'password');
      pwdToggleBtn.textContent = isPassword ? '🔒' : '👁️';
      pwdToggleBtn.setAttribute('title', isPassword ? 'Hide password' : 'Show password');
    });
  }

  // Calculate Password Entropy and Crack Time
  const analyzePassword = (pwd) => {
    if (!pwd || pwd.length === 0) {
      if (meterFill) meterFill.style.width = '0%';
      if (meterLabel) {
        meterLabel.textContent = 'Awaiting Input';
        meterLabel.style.color = 'var(--text-muted)';
      }
      if (entropyBitsEl) entropyBitsEl.textContent = '0 bits';
      if (crackTimeEl) crackTimeEl.textContent = '0 seconds';
      if (poolSizeEl) poolSizeEl.textContent = '0 chars';

      [critLen, critUpper, critLower, critNum, critSym].forEach(el => el && el.classList.remove('valid'));
      return;
    }

    let pool = 0;
    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSymbol = /[^a-zA-Z0-9]/.test(pwd);
    const hasLen = pwd.length >= 12;

    if (hasLower) pool += 26;
    if (hasUpper) pool += 26;
    if (hasNumber) pool += 10;
    if (hasSymbol) pool += 33;

    // Update Criteria Checklist
    if (critLen) critLen.classList.toggle('valid', hasLen);
    if (critLower) critLower.classList.toggle('valid', hasLower);
    if (critUpper) critUpper.classList.toggle('valid', hasUpper);
    if (critNum) critNum.classList.toggle('valid', hasNumber);
    if (critSym) critSym.classList.toggle('valid', hasSymbol);

    // Calculate Entropy: E = L * log2(pool)
    const entropy = pool > 0 ? Math.round(pwd.length * (Math.log(pool) / Math.log(2))) : 0;
    if (entropyBitsEl) entropyBitsEl.textContent = `${entropy} bits`;
    if (poolSizeEl) poolSizeEl.textContent = `${pool} symbols`;

    // Estimate crack time assuming 100 Billion guesses/second (modern GPU cluster)
    // Combinations = pool ^ length = 2 ^ entropy
    const combinations = Math.pow(2, entropy);
    const seconds = combinations / 100000000000;

    let crackTimeStr = 'Instant';
    if (seconds < 1) {
      crackTimeStr = 'Instant (< 1 sec)';
    } else if (seconds < 60) {
      crackTimeStr = `${Math.round(seconds)} seconds`;
    } else if (seconds < 3600) {
      crackTimeStr = `${Math.round(seconds / 60)} minutes`;
    } else if (seconds < 86400) {
      crackTimeStr = `${Math.round(seconds / 3600)} hours`;
    } else if (seconds < 31536000) {
      crackTimeStr = `${Math.round(seconds / 86400)} days`;
    } else if (seconds < 31536000 * 100) {
      crackTimeStr = `${Math.round(seconds / 31536000)} years`;
    } else if (seconds < 31536000 * 1000000) {
      crackTimeStr = `${Math.round(seconds / (31536000 * 1000))} Thousand Years`;
    } else {
      crackTimeStr = 'Millions of Centuries 🔒';
    }

    if (crackTimeEl) crackTimeEl.textContent = crackTimeStr;

    // Determine strength bar & color
    let percent = Math.min(100, Math.round((entropy / 85) * 100));
    let strengthText = 'Weak';
    let strengthColor = '#ef4444'; // Red

    if (entropy >= 80) {
      strengthText = 'Military-Grade Entropy';
      strengthColor = '#10b981'; // Emerald
      percent = 100;
    } else if (entropy >= 60) {
      strengthText = 'Very Strong';
      strengthColor = '#34d399'; // Mint Emerald
    } else if (entropy >= 45) {
      strengthText = 'Moderate (Acceptable)';
      strengthColor = '#3b82f6'; // Blue
    } else if (entropy >= 30) {
      strengthText = 'Fair / Vulnerable';
      strengthColor = '#f59e0b'; // Amber
    } else {
      strengthText = 'Weak (Easily Cracked)';
      strengthColor = '#ef4444'; // Red
      percent = Math.max(10, percent);
    }

    if (meterFill) {
      meterFill.style.width = `${percent}%`;
      meterFill.style.backgroundColor = strengthColor;
    }
    if (meterLabel) {
      meterLabel.textContent = `${strengthText} (${percent}%)`;
      meterLabel.style.color = strengthColor;
    }

    updateSuggestions(pwd, entropy, hasLower, hasUpper, hasNumber, hasSymbol, hasLen);
  };

  const suggestionsListEl = document.getElementById('sec-suggestions-list');

  // Generate actionable suggestions for password improvement
  const updateSuggestions = (pwd, entropy, hasLower, hasUpper, hasNumber, hasSymbol, hasLen) => {
    if (!suggestionsListEl) return;

    if (!pwd || pwd.length === 0) {
      suggestionsListEl.innerHTML = `
        <li class="suggestion-item warning">
          <span>💡</span>
          <span>Type or generate a password above to evaluate length, complexity, and receive tailored improvement suggestions.</span>
        </li>
      `;
      return;
    }

    const suggestions = [];

    // 1. Length evaluation
    if (pwd.length < 8) {
      suggestions.push({
        type: 'danger',
        icon: '❌',
        text: 'Critical weakness: Password is under 8 characters. Modern GPU rigs can crack 8-character passwords in minutes. Increase length to at least 14–16+ characters.'
      });
    } else if (pwd.length < 12) {
      suggestions.push({
        type: 'warning',
        icon: '⚠️',
        text: 'Short length: At least 12–16 characters are strongly recommended to withstand automated brute-force attacks.'
      });
    } else if (pwd.length < 16) {
      suggestions.push({
        type: 'warning',
        icon: '👍',
        text: 'Good length (12+ chars). Extending to 16+ characters elevates cryptographic security to astronomical brute-force immunity.'
      });
    } else {
      suggestions.push({
        type: 'success',
        icon: '✅',
        text: 'Excellent length (16+ chars)! High character count provides the single strongest defense against cracking.'
      });
    }

    // 2. Complexity evaluations
    if (!hasUpper) {
      suggestions.push({
        type: 'warning',
        icon: '💡',
        text: 'Add uppercase letters (A-Z) to increase character set diversity.'
      });
    }
    if (!hasLower) {
      suggestions.push({
        type: 'warning',
        icon: '💡',
        text: 'Add lowercase letters (a-z) to increase permutation possibilities.'
      });
    }
    if (!hasNumber) {
      suggestions.push({
        type: 'warning',
        icon: '💡',
        text: 'Include numerical digits (0-9) to expand information entropy.'
      });
    }
    if (!hasSymbol) {
      suggestions.push({
        type: 'warning',
        icon: '💡',
        text: 'Include special symbols (!@#$%^&*) to break pattern-based automated dictionary attacks.'
      });
    }

    // 3. Predictable sequence & dictionary checks
    const lower = pwd.toLowerCase();
    const commonPatterns = ['password', '123456', 'qwerty', 'admin', 'welcome', 'caldwell', 'student', 'letmein', 'iloveyou', 'football', 'monkey', 'dragon', 'master'];
    const matchedWord = commonPatterns.find(word => lower.includes(word));
    if (matchedWord) {
      suggestions.push({
        type: 'danger',
        icon: '⚠️',
        text: `Contains predictable dictionary pattern ("${matchedWord}"). Attackers test common words and school names first.`
      });
    }

    if (/(.)\1{2,}/.test(pwd)) {
      suggestions.push({
        type: 'warning',
        icon: '⚠️',
        text: 'Avoid repetitive consecutive characters (e.g. "aaa" or "111") which diminish effective cryptographic entropy.'
      });
    }

    if (/123|234|345|456|567|678|789|abc|bcd|cde|def/i.test(pwd)) {
      suggestions.push({
        type: 'warning',
        icon: '⚠️',
        text: 'Avoid sequential number or letter patterns (e.g. "123" or "abc") which are easily guessed by dictionary tools.'
      });
    }

    if (entropy >= 75 && suggestions.filter(s => s.type === 'danger').length === 0) {
      suggestions.push({
        type: 'success',
        icon: '🛡️',
        text: 'Outstanding credential! High information entropy and diverse character sets provide robust brute-force defense.'
      });
    }

    suggestionsListEl.innerHTML = suggestions.map(s => `
      <li class="suggestion-item ${s.type}">
        <span>${s.icon}</span>
        <span>${s.text}</span>
      </li>
    `).join('');
  };

  if (pwdInput) {
    pwdInput.addEventListener('input', (e) => {
      analyzePassword(e.target.value);
    });
  }

  // Word list for memorable passphrase generation
  const words = [
    'falcon', 'harbor', 'summit', 'orbit', 'beacon', 'canvas', 'matrix', 'timber',
    'glacier', 'shield', 'cobalt', 'nebula', 'copper', 'fossil', 'granite', 'zenith',
    'voyage', 'lantern', 'meadow', 'quantum', 'cipher', 'vector', 'stride', 'anchor',
    'echo', 'quartz', 'vortex', 'silver', 'aurora', 'canyon', 'phoenix', 'forest'
  ];

  if (generatePassphraseBtn && pwdInput) {
    generatePassphraseBtn.addEventListener('click', () => {
      const selectedWords = [];
      for (let i = 0; i < 4; i++) {
        const randIdx = Math.floor(Math.random() * words.length);
        selectedWords.push(words[randIdx]);
      }
      const randomNum = Math.floor(Math.random() * 90 + 10);
      const symbols = ['!', '@', '#', '$', '%', '&'];
      const randomSym = symbols[Math.floor(Math.random() * symbols.length)];
      const generated = `${selectedWords.join('-')}-${randomNum}${randomSym}`;

      pwdInput.value = generated;
      pwdInput.setAttribute('type', 'text');
      if (pwdToggleBtn) pwdToggleBtn.textContent = '🔒';
      analyzePassword(generated);
    });
  }

  // 5. Interactive Phishing Threat Inspector
  const scenarioTabs = document.querySelectorAll('.scenario-tab');
  const inspectFlagsBtn = document.getElementById('inspect-flags-btn');
  const phishingAnalysis = document.getElementById('phishing-analysis');
  const emailSender = document.getElementById('phish-sender');
  const emailSubject = document.getElementById('phish-subject');
  const emailDate = document.getElementById('phish-date');
  const emailBody = document.getElementById('phish-body');
  const analysisList = document.getElementById('phish-analysis-list');

  const phishingScenarios = {
    scenario1: {
      title: 'IT Helpdesk Impersonation',
      sender: '<span class="red-flag-target" data-flag="1">IT-Support-Team &lt;helpdesk@caldwell-portal-verify.com&gt;</span>',
      subject: '<span class="red-flag-target" data-flag="2">[URGENT ACTION] Your Campus Portal Access Expires in 12 Hours</span>',
      date: 'Today at 08:14 AM',
      body: `
        <p>Dear Student / Faculty Member,</p>
        <p>We recently detected suspicious authentication attempts on your Caldwell University student account. To protect campus network security, your student credentials will be <strong class="red-flag-target" data-flag="2">permanently deactivated within 12 hours</strong> unless you verify your identity.</p>
        <p style="margin: 1.5rem 0;">
          <a href="#phishing-spotter" class="btn btn-primary red-flag-target" data-flag="3" style="pointer-events: none; background: #dc2626; border-color: #b91c1c;">
            👉 Verify Student Account Now
          </a>
        </p>
        <p><em>Link destination: <code class="red-flag-target" data-flag="3">http://login.caldwell-support-auth.com/verify-student?token=84812</code></em></p>
        <p style="margin-top: 1.5rem; font-size: 0.85rem; color: var(--text-muted);">
          Failure to complete verification will result in immediate suspension of Moodle, campus email, and course registration privileges.
        </p>
        <p style="margin-top: 1rem; font-size: 0.85rem; color: var(--text-muted);">
          Campus IT Security Operations Center<br>
          Automated Dispatch Node #492
        </p>
      `,
      flags: [
        {
          badge: 'Domain Spoofing',
          text: 'The sender domain <code>@caldwell-portal-verify.com</code> is an external imposter domain designed to mimic the genuine <code>@caldwell.edu</code> domain.'
        },
        {
          badge: 'Manufactured Urgency',
          text: 'Notice phrases like "Permanently deactivated within 12 hours." Attackers weaponize anxiety and artificial deadlines so victims click before thinking critically.'
        },
        {
          badge: 'Deceptive Link Target',
          text: 'The button points to an unencrypted HTTP URL (<code>http://login.caldwell-support-auth.com</code>) instead of the official Caldwell single-sign-on portal.'
        },
        {
          badge: 'Generic Greeting',
          text: '"Dear Student / Faculty Member" reveals mass-blasted shotgun phishing rather than legitimate university correspondence directed to you by name.'
        }
      ]
    },
    scenario2: {
      title: 'Bursar & Financial Aid Lure',
      sender: '<span class="red-flag-target" data-flag="1">Student Accounts Disbursal &lt;refunds@university-aid-deposit.org&gt;</span>',
      subject: '<span class="red-flag-target" data-flag="2">Notification: Electronic Student Refund Credit of $1,480.00 Ready</span>',
      date: 'Yesterday at 03:22 PM',
      body: `
        <p>Hello Student,</p>
        <p>Your Spring Semester tuition overpayment refund of <strong>$1,480.00</strong> has been processed by the university Bursar. However, our records show that your direct deposit banking routing information is missing or outdated.</p>
        <p>To claim these funds immediately, open the attached direct deposit form and input your bank account, routing number, and social security credentials:</p>
        <div style="background: rgba(239, 68, 68, 0.08); border: 1px dashed #ef4444; border-radius: 8px; padding: 1rem; margin: 1.25rem 0; display: inline-flex; align-items: center; gap: 0.75rem;">
          <span style="font-size: 1.5rem;">📎</span>
          <div>
            <strong class="red-flag-target" data-flag="3">Direct_Deposit_Refund_Form.pdf.exe</strong><br>
            <small style="color: var(--text-muted);">Size: 342 KB • File type: Application executable</small>
          </div>
        </div>
        <p style="margin-top: 1rem; font-size: 0.85rem; color: var(--text-muted);">
          Unclaimed funds will be forfeited back to state treasury reserves after 48 business hours.
        </p>
      `,
      flags: [
        {
          badge: 'Dangerous Double Extension',
          text: 'The attachment <code>.pdf.exe</code> is a malicious Windows executable pretending to be a PDF document. Opening it installs a trojan or keylogger.'
        },
        {
          badge: 'External Entity Domain',
          text: 'The sender uses <code>@university-aid-deposit.org</code>. Genuine bursar refunds are processed through official campus portals (like Nelnet or TouchNet), never random third-party domains.'
        },
        {
          badge: 'Sensitive Credential Harvesting',
          text: 'Financial aid departments already have your student profile on file and will never ask you to send full SSNs or bank credentials via unverified links or forms.'
        },
        {
          badge: 'Financial Bait & Scarcity',
          text: 'Using an unexpected windfall ($1,480.00) paired with a 48-hour forfeiture threat creates emotional temptation to bypass security caution.'
        }
      ]
    },
    scenario3: {
      title: 'Cloud Document Sharing Trap',
      sender: '<span class="red-flag-target" data-flag="1">Cloud Storage Notification &lt;no-reply@sharepoint-docs-notify.net&gt;</span>',
      subject: '<span class="red-flag-target" data-flag="2">Dr. Professor has shared "Course_Final_Exam_Review_Guide.docx" with you</span>',
      date: 'Today at 11:05 AM',
      body: `
        <p>Greetings,</p>
        <p>A faculty member has uploaded an important document for your review on the campus Microsoft 365 OneDrive tenant.</p>
        <div style="background: #1e293b; border-radius: 8px; padding: 1.25rem; margin: 1.25rem 0; text-align: center;">
          <p style="font-weight: 700; color: #fff; margin-bottom: 0.75rem;">📄 Course_Final_Exam_Review_Guide.docx</p>
          <a href="#phishing-spotter" class="btn btn-secondary red-flag-target" data-flag="3" style="pointer-events: none;">
            View Protected Document in Office 365 Online
          </a>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-muted);">
          This document is protected with enterprise encryption. You will be prompted to re-enter your campus password on the login screen to verify authorization.
        </p>
      `,
      flags: [
        {
          badge: 'Unspecified Professor / Identity',
          text: '"Dr. Professor" is a generic placeholder used by automated phishing scripts that scrape campus directory names without proper context.'
        },
        {
          badge: 'Credential Harvester Landing Page',
          text: 'The button directs to a replica Microsoft 365 login screen designed to harvest your campus email and password into an attacker database.'
        },
        {
          badge: 'Third-Party Notification Domain',
          text: 'Official Microsoft SharePoint / OneDrive notifications originate from <code>@sharepointonline.com</code> or <code>@microsoft.com</code>, never <code>@sharepoint-docs-notify.net</code>.'
        },
        {
          badge: 'Premature Password Re-entry Prompt',
          text: 'Legitimate single sign-on sessions on your trusted computer will seamlessly open shared documents without demanding sudden re-authentication.'
        }
      ]
    }
  };

  const loadScenario = (key) => {
    const data = phishingScenarios[key];
    if (!data) return;

    if (emailSender) emailSender.innerHTML = data.sender;
    if (emailSubject) emailSubject.innerHTML = data.subject;
    if (emailDate) emailDate.textContent = data.date;
    if (emailBody) emailBody.innerHTML = data.body;

    if (analysisList) {
      analysisList.innerHTML = data.flags.map(f => `
        <div class="flag-item">
          <span class="flag-badge">${f.badge}</span>
          <div>${f.text}</div>
        </div>
      `).join('');
    }

    if (phishingAnalysis) {
      phishingAnalysis.classList.remove('show');
    }
    if (inspectFlagsBtn) {
      inspectFlagsBtn.innerHTML = '🔍 Inspect Email Red Flags';
      inspectFlagsBtn.classList.remove('btn-primary');
      inspectFlagsBtn.classList.add('btn-secondary');
    }

    attachRedFlagListeners();
  };

  const attachRedFlagListeners = () => {
    const targets = document.querySelectorAll('.red-flag-target');
    targets.forEach(t => {
      t.addEventListener('click', () => {
        if (phishingAnalysis) {
          phishingAnalysis.classList.add('show');
          phishingAnalysis.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    });
  };

  scenarioTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      scenarioTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const key = tab.getAttribute('data-scenario');
      loadScenario(key);
    });
  });

  if (inspectFlagsBtn) {
    inspectFlagsBtn.addEventListener('click', () => {
      if (phishingAnalysis) {
        const isShown = phishingAnalysis.classList.toggle('show');
        inspectFlagsBtn.innerHTML = isShown ? '✓ Hide Red Flag Analysis' : '🔍 Inspect Email Red Flags';
        if (isShown) {
          document.querySelectorAll('.red-flag-target').forEach(t => t.classList.add('revealed'));
          phishingAnalysis.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          document.querySelectorAll('.red-flag-target').forEach(t => t.classList.remove('revealed'));
        }
      }
    });
  }

  // Load default scenario
  loadScenario('scenario1');

  // 6. Interactive 10-Point Student Cyber Hygiene Checklist
  const checkItems = document.querySelectorAll('.sec-check-item');
  const checklistTrackBar = document.getElementById('sec-checklist-bar');
  const checklistCountEl = document.getElementById('sec-checklist-count');
  const checklistBadge = document.getElementById('sec-checklist-badge');
  const STORAGE_KEY = 'mekhi_sec_checklist_v1';

  let checklistState = {};
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      checklistState = JSON.parse(saved);
    }
  } catch (e) {
    checklistState = {};
  }

  const updateChecklistUI = () => {
    let completedCount = 0;
    const totalCount = checkItems.length;

    checkItems.forEach((item, index) => {
      const checkbox = item.querySelector('input[type="checkbox"]');
      const isChecked = !!checklistState[index];
      if (checkbox) checkbox.checked = isChecked;

      item.classList.toggle('item-checked', isChecked);
      if (isChecked) completedCount++;
    });

    const percent = Math.round((completedCount / totalCount) * 100);

    if (checklistTrackBar) {
      checklistTrackBar.style.width = `${percent}%`;
    }
    if (checklistCountEl) {
      checklistCountEl.textContent = `${completedCount} of ${totalCount} items completed (${percent}%)`;
    }

    if (checklistBadge) {
      if (percent === 100) {
        checklistBadge.textContent = '⭐ Elite Cyber Defender';
        checklistBadge.style.background = 'rgba(16, 185, 129, 0.2)';
        checklistBadge.style.color = '#34d399';
        checklistBadge.style.borderColor = 'rgba(16, 185, 129, 0.4)';
      } else if (percent >= 70) {
        checklistBadge.textContent = '🔒 Advanced Hardening';
        checklistBadge.style.background = 'rgba(59, 130, 246, 0.2)';
        checklistBadge.style.color = '#60a5fa';
        checklistBadge.style.borderColor = 'rgba(59, 130, 246, 0.4)';
      } else if (percent >= 40) {
        checklistBadge.textContent = '🛡️ Basic Defense';
        checklistBadge.style.background = 'rgba(245, 158, 11, 0.2)';
        checklistBadge.style.color = '#fbbf24';
        checklistBadge.style.borderColor = 'rgba(245, 158, 11, 0.4)';
      } else {
        checklistBadge.textContent = '⚠️ Critical Vulnerability';
        checklistBadge.style.background = 'rgba(239, 68, 68, 0.2)';
        checklistBadge.style.color = '#fca5a5';
        checklistBadge.style.borderColor = 'rgba(239, 68, 68, 0.4)';
      }
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checklistState));
    } catch (e) {}
  };

  checkItems.forEach((item, index) => {
    const checkbox = item.querySelector('input[type="checkbox"]');

    item.addEventListener('click', (e) => {
      if (e.target.tagName !== 'INPUT') {
        checkbox.checked = !checkbox.checked;
      }
      checklistState[index] = checkbox.checked;
      updateChecklistUI();
    });

    if (checkbox) {
      checkbox.addEventListener('change', () => {
        checklistState[index] = checkbox.checked;
        updateChecklistUI();
      });
    }
  });

  updateChecklistUI();

  // 7. Interactive Cybersecurity Knowledge Quiz
  const quizForm = document.getElementById('security-quiz-form');
  const quizResultBox = document.getElementById('quiz-result');
  const scoreBadge = document.getElementById('score-badge');
  const scoreTitle = document.getElementById('score-title');
  const scoreAdvice = document.getElementById('score-advice');

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
        alert(`Please answer all ${totalQuestions} questions to calculate your cybersecurity readiness score.`);
        return;
      }

      quizResultBox.style.display = 'block';

      if (totalScore >= 9) {
        scoreBadge.textContent = `${totalScore} / 10`;
        scoreBadge.style.color = '#34d399';
        scoreTitle.textContent = '🛡️ Certified Cyber Defender (Top 5%)';
        scoreAdvice.innerHTML = 'Phenomenal job! You demonstrated deep comprehension of Strong Passwords and MFA, recognize sophisticated phishing tactics, understand malware infection vectors and prevention, value online privacy settings, and uphold ethical AI verification standards.';
      } else if (totalScore >= 6) {
        scoreBadge.textContent = `${totalScore} / 10`;
        scoreBadge.style.color = '#60a5fa';
        scoreTitle.textContent = '👍 Vigilant Tech User';
        scoreAdvice.innerHTML = 'Well done! You have a solid grasp of cyber hygiene and safe computing. Make sure to review the sections on malware prevention, social media privacy controls, and AI hallucination fact-checking to elevate your security mastery.';
      } else {
        scoreBadge.textContent = `${totalScore} / 10`;
        scoreBadge.style.color = '#f59e0b';
        scoreTitle.textContent = '⚠️ Elevated Security Risk';
        scoreAdvice.innerHTML = 'Important learning opportunity! Be extra cautious of urgency lures in emails, never reuse passwords across accounts, enable multi-factor authentication everywhere, install software updates regularly, and always verify AI-generated claims before using them.';
      }

      quizResultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }
});
