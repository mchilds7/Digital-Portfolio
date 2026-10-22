/**
 * The Internet: Architecture, Protocols & Web Technologies
 * Interactive controller for internet.html
 * Author: Mekhi Childs (Caldwell University)
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

  // 3. Scroll-spy for Desktop Nav Links
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

  // 4. Interactive URL Anatomy Inspector
  const urlSegments = document.querySelectorAll('.url-segment');
  const urlDetailTitle = document.getElementById('url-detail-title');
  const urlDetailText = document.getElementById('url-detail-text');

  const segmentDescriptions = {
    protocol: {
      title: '🔒 Scheme / Protocol: https://',
      text: 'Specifies Hypertext Transfer Protocol Secure. Indicates that communication between the browser and server is encrypted end-to-end via Transport Layer Security (TLS 1.3), guarding credentials, cookies, and traffic against interception by third parties on public Wi-Fi or compromised routers.'
    },
    subdomain: {
      title: '🏢 Subdomain: my.',
      text: 'A distinct prefix pointing to a specific subsection or delegated server cluster of the primary domain. For colleges and institutions, subdomains like "my.", "canvas.", or "portal." partition student authentication services from public informational sites.'
    },
    domain: {
      title: '🏷️ Second-Level Domain (SLD): caldwell',
      text: 'The registered organizational name that identifies the institution, company, or entity. Domain names are registered through accredited registrars under policies set by ICANN (Internet Corporation for Assigned Names and Numbers).'
    },
    tld: {
      title: '🌐 Top-Level Domain (TLD): .edu',
      text: 'The highest hierarchical domain level under the DNS root zone. The ".edu" sponsored TLD is strictly restricted to accredited post-secondary educational institutions in the United States, providing verified institutional authority.'
    },
    port: {
      title: '🚪 Destination Port: :443',
      text: 'The logical software port number on the host machine. Port 443 is the standard default port for HTTPS traffic (whereas Port 80 is unencrypted HTTP, and Port 22 is SSH). Because 443 is standard for HTTPS, modern web browsers typically conceal it in the address bar.'
    },
    path: {
      title: '📂 Resource Path: /student/portal',
      text: 'Specifies the hierarchical location of the requested resource or application route on the web server or cloud storage bucket. In modern single-page applications or web frameworks, this maps to specific controller endpoints or views.'
    },
    query: {
      title: '❓ Query String: ?id=2026',
      text: 'Passes key-value parameters to the server for dynamic processing, filtering, or session state. Preceded by a question mark ("?"), multiple pairs are separated by ampersands ("&"). Sensitive tokens or passwords should never be passed in query strings as they get stored in server access logs.'
    },
    hash: {
      title: '⚓ Anchor / Hash Fragment: #grades',
      text: 'An internal anchor identifying a specific bookmark element with that ID on the page. Unlike the path or query string, the hash fragment is processed entirely client-side by the browser and is never sent in HTTP request headers to the remote server.'
    }
  };

  urlSegments.forEach(segment => {
    segment.addEventListener('click', () => {
      urlSegments.forEach(s => s.classList.remove('active'));
      segment.classList.add('active');

      const key = segment.getAttribute('data-part');
      if (segmentDescriptions[key]) {
        urlDetailTitle.innerHTML = segmentDescriptions[key].title;
        urlDetailText.innerHTML = segmentDescriptions[key].text;
      }
    });
  });

  // 5. Interactive Packet & DNS Request Simulator
  const urlInput = document.getElementById('sim-url-input');
  const btnRunSim = document.getElementById('btn-run-sim');
  const btnStepSim = document.getElementById('btn-step-sim');
  const btnResetSim = document.getElementById('btn-reset-sim');
  const presetBtns = document.querySelectorAll('.sim-preset-btn');
  const logBody = document.getElementById('terminal-log-body');
  const metricIp = document.getElementById('metric-ip');
  const metricRtt = document.getElementById('metric-rtt');
  const metricProto = document.getElementById('metric-proto');
  const metricCipher = document.getElementById('metric-cipher');
  const stepNodes = document.querySelectorAll('.pipeline-step-node');

  // Preset domains and simulated resolution data
  const simulatedDomainDatabase = {
    'caldwell.edu': {
      ip: '198.51.100.24',
      ipv6: '2606:4700:3037::ac43:8833',
      rtt: '28 ms',
      tls: 'TLS 1.3 / HTTP/2',
      cipher: 'TLS_AES_256_GCM_SHA384',
      org: 'Caldwell University, Caldwell NJ'
    },
    'fbi.gov': {
      ip: '104.18.25.10',
      ipv6: '2606:4700::6812:190a',
      rtt: '19 ms',
      tls: 'TLS 1.3 / HTTP/3 (QUIC)',
      cipher: 'TLS_CHACHA20_POLY1305_SHA256',
      org: 'Federal Bureau of Investigation (GovCloud)'
    },
    'google.com': {
      ip: '142.250.190.46',
      ipv6: '2607:f8b0:4004:837::200e',
      rtt: '11 ms',
      tls: 'TLS 1.3 / HTTP/3',
      cipher: 'TLS_AES_128_GCM_SHA256',
      org: 'Google LLC (BGP Anycast)'
    },
    'wikipedia.org': {
      ip: '208.80.154.224',
      ipv6: '2620:0:861:ed1a::1',
      rtt: '34 ms',
      tls: 'TLS 1.3 / HTTP/2',
      cipher: 'TLS_AES_256_GCM_SHA384',
      org: 'Wikimedia Foundation, Ashburn VA'
    }
  };

  let currentStep = 0;
  let isRunningAuto = false;
  let simTimer = null;

  const getCleanDomain = () => {
    let raw = urlInput.value.trim().toLowerCase();
    raw = raw.replace(/^https?:\/\//i, '').split('/')[0].split(':')[0];
    return raw || 'caldwell.edu';
  };

  const getTargetData = (domain) => {
    if (simulatedDomainDatabase[domain]) {
      return simulatedDomainDatabase[domain];
    }
    // Generate pseudo-deterministic data for custom typed domains
    return {
      ip: `198.18.${Math.floor(Math.random() * 200 + 10)}.${Math.floor(Math.random() * 250 + 2)}`,
      ipv6: '2001:db8:85a3::8a2e:370:7334',
      rtt: `${Math.floor(Math.random() * 30 + 18)} ms`,
      tls: 'TLS 1.3 / HTTP/2',
      cipher: 'TLS_AES_256_GCM_SHA384',
      org: `${domain} Hosted Infrastructure`
    };
  };

  const appendLog = (prefixClass, prefixText, message) => {
    const time = new Date().toISOString().split('T')[1].slice(0, 8);
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `<span class="log-time">[${time}]</span> <span class="${prefixClass}">[${prefixText}]</span> ${message}`;
    logBody.appendChild(entry);
    logBody.scrollTop = logBody.scrollHeight;
  };

  const setNodeState = (stepIndex, state) => {
    stepNodes.forEach((node, idx) => {
      if (idx < stepIndex) {
        node.classList.remove('active');
        node.classList.add('completed');
      } else if (idx === stepIndex) {
        node.classList.add('active');
        node.classList.remove('completed');
      } else {
        node.classList.remove('active');
        node.classList.remove('completed');
      }
    });
  };

  const resetSimulation = () => {
    if (simTimer) clearTimeout(simTimer);
    isRunningAuto = false;
    currentStep = 0;
    logBody.innerHTML = '<div class="log-entry" style="color: #64748b;">Simulator ready. Select a domain and click "Simulate Web Request" or "Step Forward".</div>';
    stepNodes.forEach(n => {
      n.classList.remove('active');
      n.classList.remove('completed');
    });
    metricIp.textContent = '--.--.--.--';
    metricRtt.textContent = '-- ms';
    metricProto.textContent = 'None';
    metricCipher.textContent = 'None';
  };

  const executeStep = (stepNumber) => {
    const domain = getCleanDomain();
    const data = getTargetData(domain);
    const tld = domain.split('.').pop();

    setNodeState(stepNumber - 1, 'active');

    switch (stepNumber) {
      case 1:
        appendLog('log-prefix-dns', 'STEP 1: BROWSER CACHE', `Inspecting local browser DNS cache & OS hosts file for "${domain}"... ⚠️ Cache miss (TTL expired). Delegating to recursive DNS resolver.`);
        break;

      case 2:
        appendLog('log-prefix-dns', 'STEP 2: RECURSIVE RESOLVER', `Query dispatched via UDP port 53 to Recursive Resolver 1.1.1.1. Checking ISP / Cloudflare cache... ⚠️ Root referral required.`);
        break;

      case 3:
        appendLog('log-prefix-dns', 'STEP 3: ROOT & TLD NAMESERVER', `Querying IANA Root Nameserver [a.root-servers.net] → Referred to ".${tld}" TLD Authoritative Nameserver cluster.`);
        break;

      case 4:
        metricIp.textContent = data.ip;
        appendLog('log-prefix-dns', 'STEP 4: AUTHORITATIVE DNS', `Querying Authoritative DNS for "${domain}" → Received A Record: <strong>${data.ip}</strong> and AAAA: <code>${data.ipv6}</code>. (${data.org})`);
        break;

      case 5:
        appendLog('log-prefix-tcp', 'STEP 5: TCP 3-WAY HANDSHAKE', `Initiating TCP connection to ${data.ip}:443: [1] SYN sent → [2] SYN-ACK received from remote host → [3] ACK returned. Full duplex connection established.`);
        break;

      case 6:
        metricCipher.textContent = data.cipher;
        appendLog('log-prefix-tls', 'STEP 6: TLS 1.3 NEGOTIATION', `Exchanging cryptographic parameters: ClientHello → ServerHello. Validated X.509 Certificate Chain signed by trusted Root CA. Session encrypted with <strong>${data.cipher}</strong>.`);
        break;

      case 7:
        metricRtt.textContent = data.rtt;
        metricProto.textContent = data.tls;
        appendLog('log-prefix-http', 'STEP 7: HTTP/2 REQUEST & 200 OK', `Sending encrypted HTTP GET / HTTP/2 stream... Server returned: <strong>HTTP/2 200 OK</strong> (28.4 KB payload, gzip-compressed). Browser paints DOM!`);
        appendLog('log-prefix-success', 'SUCCESS', `✨ Packet cycle complete. Round-trip time: ${data.rtt}. Safe & authenticated connection.`);
        stepNodes[6].classList.remove('active');
        stepNodes[6].classList.add('completed');
        break;
    }
  };

  const stepForward = () => {
    if (currentStep >= 7) {
      currentStep = 0;
      resetSimulation();
    }
    currentStep++;
    executeStep(currentStep);
  };

  const runFullSimulation = () => {
    resetSimulation();
    isRunningAuto = true;
    currentStep = 1;

    const runNext = () => {
      if (!isRunningAuto || currentStep > 7) {
        isRunningAuto = false;
        return;
      }
      executeStep(currentStep);
      currentStep++;
      if (currentStep <= 7) {
        simTimer = setTimeout(runNext, 700);
      }
    };

    runNext();
  };

  if (btnRunSim) btnRunSim.addEventListener('click', runFullSimulation);
  if (btnStepSim) btnStepSim.addEventListener('click', stepForward);
  if (btnResetSim) btnResetSim.addEventListener('click', resetSimulation);

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      urlInput.value = btn.getAttribute('data-domain');
      resetSimulation();
    });
  });

  // 6. Interactive Quiz & Scorecard Controller
  const quizForm = document.getElementById('internet-quiz-form');
  const quizResultBox = document.getElementById('quiz-result');
  const scoreBadge = document.getElementById('score-badge');
  const scoreTitle = document.getElementById('score-title');
  const scoreAdvice = document.getElementById('score-advice');

  // Radio button styling on select
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
        alert(`Please answer all ${totalQuestions} scenario questions to view your Internet Architecture scorecard.`);
        return;
      }

      // Display tailored feedback (Scale: 0 to 10 points)
      quizResultBox.style.display = 'block';

      if (totalScore >= 9) {
        scoreBadge.textContent = `${totalScore} / 10`;
        scoreBadge.style.color = '#34d399'; // Emerald
        scoreTitle.textContent = '🌟 Internet Architecture Knowledge Master';
        scoreAdvice.innerHTML = 'Masterful performance! You demonstrate an in-depth understanding of packet switching, TCP vs UDP design trade-offs, DNS resolution mechanics, and the operational distinction between the Deep Web and Dark Web.';
      } else if (totalScore >= 6) {
        scoreBadge.textContent = `${totalScore} / 10`;
        scoreBadge.style.color = '#60a5fa'; // Blue
        scoreTitle.textContent = '👍 Strong Networking & Cyber Literacy';
        scoreAdvice.innerHTML = 'Well done! You have a solid grasp of fundamental internet infrastructure and security. Reviewing the nuances of DNS lookup hierarchies and network protocols will strengthen your understanding.';
      } else {
        scoreBadge.textContent = `${totalScore} / 10`;
        scoreBadge.style.color = '#f59e0b'; // Amber
        scoreTitle.textContent = '⚠️ Developing Network Fundamentals';
        scoreAdvice.innerHTML = 'A good effort, but there are vital networking concepts to revisit: review how packet switching reroutes data independently around network outages, how HTTPS TLS certificates prevent Man-in-the-Middle eavesdropping, and the critical difference between the World Wide Web and the physical Internet.';
      }

      quizResultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  // 7. Interactive Checklist Item Click-to-Check
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

  // =========================================================================
  // 8. Part 2: AI Chatbot Engine (NetBot AI)
  // =========================================================================
  const chatThread = document.getElementById('chat-thread');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const chatClearBtn = document.getElementById('chat-clear-btn');
  const chatStatusText = document.getElementById('chat-status-text');
  const chatPromptChips = document.querySelectorAll('.chat-prompt-chip');

  if (chatThread && chatForm && chatInput) {
    const getFormattedTime = () => {
      const now = new Date();
      return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const scrollToBottom = () => {
      chatThread.scrollTop = chatThread.scrollHeight;
    };

    const appendUserMessage = (text) => {
      const row = document.createElement('div');
      row.className = 'chat-msg-row user-row';
      row.innerHTML = `
        <div class="chat-avatar-small">👤</div>
        <div class="chat-bubble">
          <p>${escapeHTML(text)}</p>
          <span class="chat-timestamp">${getFormattedTime()}</span>
        </div>
      `;
      chatThread.appendChild(row);
      scrollToBottom();
    };

    const appendBotMessage = (htmlContent) => {
      const row = document.createElement('div');
      row.className = 'chat-msg-row bot-row';
      row.innerHTML = `
        <div class="chat-avatar-small">🤖</div>
        <div class="chat-bubble">
          ${htmlContent}
          <span class="chat-timestamp">${getFormattedTime()}</span>
        </div>
      `;
      chatThread.appendChild(row);
      scrollToBottom();
    };

    const showTypingIndicator = () => {
      const row = document.createElement('div');
      row.className = 'chat-msg-row bot-row typing-row';
      row.id = 'chat-typing-row';
      row.innerHTML = `
        <div class="chat-avatar-small">🤖</div>
        <div class="chat-bubble typing-bubble">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
        </div>
      `;
      chatThread.appendChild(row);
      scrollToBottom();
    };

    const removeTypingIndicator = () => {
      const typingRow = document.getElementById('chat-typing-row');
      if (typingRow) typingRow.remove();
    };

    const escapeHTML = (str) => {
      return str.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag));
    };

    // Comprehensive AI Knowledge Base & Synthesis Engine
    const generateAIAnswer = (query) => {
      const q = query.toLowerCase().trim();

      // 1. Packet Switching / How the Internet Works
      if (q.includes('packet') || (q.includes('how') && q.includes('internet') && q.includes('work')) || q.includes('how data travel')) {
        return `
          <p><strong>How the Internet Works & Packet Switching:</strong></p>
          <p>The Internet functions as a decentralized global mesh of billions of computers communicating through the <strong>TCP/IP protocol suite</strong>. It operates using <strong>packet switching</strong>:</p>
          <ul>
            <li><strong>Chunking:</strong> Large files, videos, or messages are broken into thousands of tiny units called <em>data packets</em>.</li>
            <li><strong>Headers:</strong> Each packet is stamped with a Source IP address, Destination IP address, and a sequence number.</li>
            <li><strong>Dynamic Routing:</strong> Routers analyze network traffic in real time and forward packets along the fastest available paths across terrestrial fiber or undersea cables.</li>
            <li><strong>Reassembly:</strong> The receiving computer uses TCP to reassemble the packets in sequence, requesting retransmissions if any packet was lost.</li>
          </ul>
          <p>This decentralized design prevents single points of failure, allowing traffic to self-heal and route around broken physical lines.</p>
        `;
      }

      // 2. Internet Service Providers (ISPs)
      if (q.includes('isp') || q.includes('provider') || q.includes('comcast') || q.includes('verizon') || q.includes('bandwidth')) {
        return `
          <p><strong>Internet Service Providers (ISPs):</strong></p>
          <p>An ISP is the commercial telecommunications gateway company (like Verizon, Comcast Xfinity, AT&T, or Spectrum) that connects local devices to the broader global Internet:</p>
          <ul>
            <li><strong>The Three Tiers:</strong> <em>Tier 3</em> provides residential/mobile broadband; <em>Tier 2</em> manages regional networks; <em>Tier 1</em> owns global transcontinental fiber backbones with settlement-free peering.</li>
            <li><strong>DHCP IP Assignment:</strong> When your router boots up, your ISP dynamically assigns your home a public IP address using the Dynamic Host Configuration Protocol.</li>
          </ul>
        `;
      }

      // 3. Web Browsers
      if (q.includes('browser') || q.includes('chrome') || q.includes('safari') || q.includes('firefox') || q.includes('dom') || q.includes('render')) {
        return `
          <p><strong>Web Browsers:</strong></p>
          <p>A web browser (Google Chrome, Apple Safari, Firefox, Edge) is a client application software program that requests, translates, and displays resources from the World Wide Web:</p>
          <ul>
            <li><strong>Fetching:</strong> Dispatches encrypted HTTPS requests to web servers over port 443 and validates SSL/TLS certificates.</li>
            <li><strong>Parsing & The DOM:</strong> Transforms raw HTML code into the Document Object Model (DOM) tree and calculates visual styles via the CSSOM.</li>
            <li><strong>Painting & JavaScript:</strong> High-performance JavaScript engines (like Google V8) execute interactive code, calculate layout dimensions, and paint pixels onto your screen.</li>
            <li><strong>Security Sandboxing:</strong> Browsers isolate tabs into sandboxed system processes so malicious scripts in one tab cannot access private cookies or banking data in another.</li>
          </ul>
        `;
      }

      // 4. Search Engines vs Browsers
      if ((q.includes('search engine') && q.includes('browser')) || q.includes('difference between an isp and a web browser') || q.includes('isp vs')) {
        return `
          <p><strong>Clarifying Core Distinctions:</strong></p>
          <ul>
            <li><strong>The ISP (The Physical Road):</strong> Supplies the physical connectivity, cables, and IP address that connect your house to the global network.</li>
            <li><strong>The Web Browser (The Vehicle):</strong> The software program installed on your laptop (e.g. Chrome, Safari) used to open and visually render HTML/CSS websites.</li>
            <li><strong>The Search Engine (The GPS / Directory):</strong> A cloud service (e.g. Google, Bing) that crawls and indexes billions of pages so you can find URLs when you don't know the exact address.</li>
          </ul>
          <p>In short: You pay your <em>ISP</em> for connection, open your <em>browser</em> to view pages, and search on a <em>search engine</em> to find them!</p>
        `;
      }

      // 5. Search Engines / Crawling / Indexing / Ranking
      if (q.includes('search engine') || q.includes('google') || q.includes('crawl') || q.includes('spider') || q.includes('index') || q.includes('rank')) {
        return `
          <p><strong>How Search Engines Work:</strong></p>
          <p>Search engines do not search the live web at the moment you type; they query their own colossal pre-built database index across three distinct steps:</p>
          <ol>
            <li><strong>Web Crawling (Spiders):</strong> Automated bots (like Googlebot) traverse the web continuously by following links from page to page.</li>
            <li><strong>Indexing:</strong> Discovered pages are analyzed for keywords, headers, structure, and media, then cataloged in a massive distributed database (the <em>Search Index</em>).</li>
            <li><strong>Ranking & Serving:</strong> Complex algorithms assess hundreds of ranking signals (relevance, domain trustworthiness, high-quality backlinks, page speed, mobile responsiveness) in milliseconds to display ordered Search Engine Results Pages (SERPs).</li>
          </ol>
        `;
      }

      // 6. Undersea Submarine Cables
      if (q.includes('undersea') || q.includes('cable') || q.includes('ocean') || q.includes('submarine') || q.includes('atlantic') || q.includes('fiber')) {
        return `
          <p><strong>Submarine Undersea Fiber-Optic Cables:</strong></p>
          <p>A surprising physical reality of the modern Internet is that <strong>over 99% of all international communications</strong> travel through cables resting on the ocean floor, not through satellites:</p>
          <ul>
            <li><strong>Global Scale:</strong> Over 550 commercial subsea cables span more than 1.4 million kilometers across every ocean on Earth.</li>
            <li><strong>Speed of Light:</strong> Data travels as infrared laser pulses bouncing inside glass fiber cores, crossing the Atlantic Ocean in approximately 60 milliseconds.</li>
            <li><strong>Physical Defense:</strong> Near shorelines, cables are wrapped in heavy steel armoring and buried beneath seabed trenches to protect against fishing trawlers and ship anchors.</li>
          </ul>
        `;
      }

      // 7. TCP vs UDP
      if (q.includes('tcp') || q.includes('udp') || q.includes('handshake') || q.includes('transport layer')) {
        return `
          <p><strong>TCP vs. UDP (Transport Layer Protocols):</strong></p>
          <p>The Transport Layer dictates whether communication prioritizes <strong>guaranteed reliability</strong> or <strong>minimum latency</strong>:</p>
          <ul>
            <li><strong>TCP (Transmission Control Protocol):</strong> Connection-oriented. Uses a <em>Three-Way Handshake (SYN → SYN-ACK → ACK)</em>. Guarantees packet delivery, checks errors, and retransmits dropped data. Essential for web browsing (HTTP), banking, and email.</li>
            <li><strong>UDP (User Datagram Protocol):</strong> Connectionless and lightweight. "Fire and forget" with zero retransmission overhead. Dropped packets are discarded. Essential for live streaming (Twitch, Zoom), multiplayer gaming, and fast DNS queries.</li>
          </ul>
        `;
      }

      // 9. DNS (Domain Name System)
      if (q.includes('dns') || q.includes('domain') || q.includes('url') || q.includes('resolve')) {
        return `
          <p><strong>The Domain Name System (DNS):</strong></p>
          <p>DNS is the "phonebook of the Internet." Because computers route data using numerical IP addresses, DNS translates human-friendly domains (like <code>caldwell.edu</code>) into routable addresses (like <code>198.51.100.24</code>):</p>
          <ol>
            <li><strong>Browser & OS Cache:</strong> Checks if the address was visited recently.</li>
            <li><strong>Recursive Resolver:</strong> Queries your ISP or public resolvers like Cloudflare (1.1.1.1) or Google (8.8.8.8).</li>
            <li><strong>Root & TLD Servers:</strong> Refers the query to the Top-Level Domain nameserver (e.g., <code>.edu</code>).</li>
            <li><strong>Authoritative Nameserver:</strong> Returns the exact A (IPv4) or AAAA (IPv6) address record so your browser can initiate the connection!</li>
          </ol>
        `;
      }

      // 10. IPv4 vs IPv6
      if (q.includes('ipv4') || q.includes('ipv6') || q.includes('ip address')) {
        return `
          <p><strong>IPv4 vs. IPv6 Addresses:</strong></p>
          <ul>
            <li><strong>IPv4 (32-bit):</strong> Uses four numeric octets (e.g. <code>192.0.2.1</code>). Yields approximately 4.3 billion addresses—which the modern world exhausted due to the explosion of smartphones, laptops, and IoT devices.</li>
            <li><strong>IPv6 (128-bit):</strong> Uses eight hexadecimal blocks (e.g. <code>2001:0db8:85a3::8a2e:0370:7334</code>). Provides \(3.4 \times 10^{38}\) unique addresses—enough to assign billions of IPs to every grain of sand on Earth!</li>
          </ul>
        `;
      }

      // 11. Deep Web vs Dark Web
      if (q.includes('deep web') || q.includes('dark web') || q.includes('surface web') || q.includes('tor')) {
        return `
          <p><strong>The Three Layers of Cyberspace:</strong></p>
          <ul>
            <li><strong>Surface Web (~4–10%):</strong> Public pages indexed by search engines (Wikipedia, news sites, public university pages).</li>
            <li><strong>Deep Web (~90–95%):</strong> Legitimate private data protected behind passwords, forms, and databases (Canvas portals, online banking, student records, private medical charts).</li>
            <li><strong>Dark Web (&lt;1%):</strong> Encrypted overlay networks requiring specialized routing tools like Tor (.onion). Conceals identities through multi-layered relays; used both by whistleblowers/journalists and illicit marketplaces.</li>
          </ul>
        `;
      }

      // 12. Cybersecurity / Wi-Fi / VPN / HTTPS
      if (q.includes('security') || q.includes('wifi') || q.includes('wi-fi') || q.includes('vpn') || q.includes('https') || q.includes('password') || q.includes('hack')) {
        return `
          <p><strong>Essential Network Security & Privacy:</strong></p>
          <ul>
            <li><strong>HTTPS (TLS 1.3):</strong> Ensures all data exchanged between your browser and the website is encrypted end-to-end, preventing eavesdroppers from stealing session cookies or passwords.</li>
            <li><strong>Public Wi-Fi Risks:</strong> Open networks can expose traffic to Man-in-the-Middle (MitM) packet sniffing. Always use a trusted VPN to tunnel and encrypt your data.</li>
            <li><strong>DNS-over-HTTPS (DoH):</strong> Encrypts your DNS lookup queries so your ISP or local network snooper cannot see which domains you visit.</li>
            <li><strong>WPA3 Wi-Fi:</strong> The modern wireless encryption standard that protects home Wi-Fi against offline dictionary attacks.</li>
          </ul>
        `;
      }

      // 12. Mekhi Childs / Caldwell University / Coursework
      if (q.includes('mekhi') || q.includes('caldwell') || q.includes('portfolio') || q.includes('who made') || q.includes('author')) {
        return `
          <p><strong>About This Digital Portfolio:</strong></p>
          <p>This website was created by <strong>Mekhi Childs</strong>, an undergraduate student at <strong>Caldwell University</strong> for the <em>Introduction to Technology</em> course.</p>
          <p>The project highlights core competencies in critical thinking, analytical reasoning, communication, computer fundamentals, digital citizenship, and network technologies. You can explore the main portfolio and project sections at <a href="index.html" class="content-link">Portfolio Home</a>!</p>
        `;
      }

      // 13. Greetings & Conversational Queries
      if (q.startsWith('hi') || q.startsWith('hello') || q.startsWith('hey') || q === 'help' || q.includes('who are you')) {
        return `
          <p>Hello! 👋 I am <strong>NetBot AI</strong>, your interactive study companion for Mekhi's Digital Portfolio.</p>
          <p>I can help explain:</p>
          <ul>
            <li><strong>How the Internet works</strong> & packet switching</li>
            <li><strong>Internet Service Providers (ISPs)</strong> & broadband tiers</li>
            <li><strong>Web browsers</strong> & the DOM rendering pipeline</li>
            <li><strong>Search engines</strong> & crawling algorithms</li>
          </ul>
          <p>What would you like to explore? Type any question or click a suggestion chip above!</p>
        `;
      }

      if (q.includes('thank') || q.includes('awesome') || q.includes('cool') || q.includes('great')) {
        return `
          <p>You're very welcome! 😊 I'm glad I could help explain how these Internet technologies operate. Feel free to ask more questions or try our interactive <strong>Packet Flight Simulator</strong> further down the page!</p>
        `;
      }

      // 14. Intelligent Fallback / Generalized Synthesis
      return `
        <p><strong>AI Analysis & Overview:</strong></p>
        <p>Thank you for asking about <em>"${escapeHTML(query)}"</em>! In the context of computer networking and Internet technologies:</p>
        <ul>
          <li><strong>Network Foundations:</strong> All Internet services rely on the standardized <strong>TCP/IP stack</strong>, where application data is encapsulated into packets and routed through ISPs and undersea cables.</li>
          <li><strong>Client & Server Interaction:</strong> When you initiate actions online, your <strong>web browser</strong> formulates an HTTP/HTTPS request, resolves destinations via <strong>DNS</strong>, and renders the server's response.</li>
          <li><strong>Network Security:</strong> Network protocols and security tools help protect data as it moves between connected devices.</li>
        </ul>
        <p>Would you like to know more about <strong>how packets switch</strong>, how <strong>ISPs route data</strong>, or how <strong>search engines index pages</strong>? Try asking about one of those topics!</p>
      `;
    };

    // Part 3: photo-to-avatar generation and a dedicated digital-person chat.
    const personPhotoInput = document.getElementById('digital-person-photo');
    const personStyleInput = document.getElementById('digital-person-style');
    const personGenerateButton = document.getElementById('digital-person-generate');
    const personGenerationStatus = document.getElementById('digital-person-generation-status');
    const personPreview = document.getElementById('digital-person-preview');
    const personPlaceholder = document.getElementById('digital-person-placeholder');
    const personChatImage = document.getElementById('digital-person-chat-image');
    const personChatPlaceholder = document.getElementById('digital-person-chat-placeholder');
    const personThread = document.getElementById('digital-person-thread');
    const personChatForm = document.getElementById('digital-person-chat-form');
    const personChatInput = document.getElementById('digital-person-chat-input');
    const personChatSend = document.getElementById('digital-person-chat-send');
    const personChatStatus = document.getElementById('digital-person-chat-status');
    const personChatClear = document.getElementById('digital-person-clear-btn');
    const personPromptChips = document.querySelectorAll('.digital-person-prompt-chip');

    if (personPhotoInput && personGenerateButton && personPreview && personThread && personChatForm && personChatInput && personChatSend) {
      let sourceImageData = '';
      let personChatBusy = false;
      let photoSelectionVersion = 0;

      const setGenerationStatus = (message, isError = false) => {
        personGenerationStatus.textContent = message;
        personGenerationStatus.classList.toggle('is-error', isError);
      };

      const readBlobAsDataURL = blob => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('The selected photo could not be read.'));
        reader.readAsDataURL(blob);
      });

      const createPhotoDataURL = async file => {
        const bitmap = await createImageBitmap(file);
        const scale = Math.min(1, 1024 / Math.max(bitmap.width, bitmap.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(bitmap.width * scale));
        canvas.height = Math.max(1, Math.round(bitmap.height * scale));
        const context = canvas.getContext('2d');
        if (!context) {
          bitmap.close();
          throw new Error('This browser could not prepare the photo for upload.');
        }
        context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        bitmap.close();
        const compressedImage = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.84));
        if (!compressedImage) throw new Error('This browser could not compress the selected photo.');
        return readBlobAsDataURL(compressedImage);
      };

      const setPersonaImage = imageDataUrl => {
        personPreview.src = imageDataUrl;
        personPreview.alt = 'AI-generated digital person based on your photo';
        personPreview.hidden = false;
        personPlaceholder.hidden = true;
        personChatImage.src = imageDataUrl;
        personChatImage.hidden = false;
        personChatPlaceholder.hidden = true;
        document.querySelectorAll('.digital-person-message-avatar').forEach(avatar => {
          const image = document.createElement('img');
          image.src = imageDataUrl;
          image.alt = '';
          avatar.replaceChildren(image);
        });
      };

      const appendPersonMessage = (text, isPerson = false) => {
        const row = document.createElement('div');
        row.className = `chat-msg-row ${isPerson ? 'bot-row' : 'user-row'}`;
        const avatar = document.createElement('div');
        avatar.className = `chat-avatar-small${isPerson ? ' digital-person-message-avatar' : ''}`;
        if (isPerson) {
          if (personChatImage && !personChatImage.hidden) {
            const image = document.createElement('img');
            image.src = personChatImage.src;
            image.alt = '';
            avatar.appendChild(image);
          } else {
            avatar.textContent = '👤';
          }
        } else {
          avatar.textContent = '👤';
        }
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble';
        if (isPerson) {
          bubble.innerHTML = text;
        } else {
          const paragraph = document.createElement('p');
          paragraph.textContent = text;
          bubble.appendChild(paragraph);
        }
        const timestamp = document.createElement('span');
        timestamp.className = 'chat-timestamp';
        timestamp.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        bubble.appendChild(timestamp);
        row.append(avatar, bubble);
        personThread.appendChild(row);
        personThread.scrollTop = personThread.scrollHeight;
      };

      personPhotoInput.addEventListener('change', async () => {
        const selectionVersion = ++photoSelectionVersion;
        const file = personPhotoInput.files[0];
        sourceImageData = '';
        personGenerateButton.disabled = true;
        personPreview.hidden = true;
        personPreview.removeAttribute('src');
        personPlaceholder.hidden = false;
        personChatImage.hidden = true;
        personChatImage.removeAttribute('src');
        personChatPlaceholder.hidden = false;
        if (!file) {
          setGenerationStatus('Choose a photo to get started.');
          return;
        }

        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
          personPhotoInput.value = '';
          setGenerationStatus('Choose a JPG, PNG, or WEBP photo.', true);
          return;
        }
        if (file.size > 10 * 1024 * 1024) {
          personPhotoInput.value = '';
          setGenerationStatus('That photo is larger than 10 MB. Choose a smaller image.', true);
          return;
        }

        setGenerationStatus('Preparing your photo for the AI image tool...');
        try {
          const photoData = await createPhotoDataURL(file);
          if (selectionVersion !== photoSelectionVersion) return;
          if (photoData.length > 4_200_000) {
            throw new Error('The photo could not be compressed enough. Choose a smaller image.');
          }
          sourceImageData = photoData;
          personPreview.src = sourceImageData;
          personPreview.alt = 'Uploaded photo preview for your digital person';
          personPreview.hidden = false;
          personPlaceholder.hidden = true;
          personGenerateButton.disabled = false;
          setGenerationStatus('Photo ready. Select Generate My Digital Person to send it to OpenAI.');
        } catch (error) {
          if (selectionVersion !== photoSelectionVersion) return;
          personPhotoInput.value = '';
          setGenerationStatus(error.message, true);
        }
      });

      personGenerateButton.addEventListener('click', async () => {
        if (!sourceImageData) {
          setGenerationStatus('Upload a photo before generating your digital person.', true);
          return;
        }
        personGenerateButton.disabled = true;
        personPhotoInput.disabled = true;
        setGenerationStatus('Sending your photo securely to OpenAI and generating your digital person...');
        try {
          const response = await fetch('/.netlify/functions/generate-avatar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageDataUrl: sourceImageData,
              style: personStyleInput?.value.trim() || ''
            })
          });
          let result;
          try {
            result = await response.json();
          } catch {
            if (response.status === 404) {
              throw new Error('The avatar function is not deployed. Deploy this site on Netlify with its function enabled.');
            }
            throw new Error('The avatar service returned an unreadable response.');
          }
          if (!response.ok) {
            throw new Error(result.error || `Avatar generation failed (${response.status}).`);
          }
          if (typeof result.imageBase64 !== 'string' || !/^[A-Za-z0-9+/]+={0,2}$/.test(result.imageBase64)) {
            throw new Error('The avatar service returned an invalid image.');
          }
          setPersonaImage(`data:image/jpeg;base64,${result.imageBase64}`);
          setGenerationStatus('Your digital person is ready. Start a conversation below.');
        } catch (error) {
          setGenerationStatus(error.message || 'Avatar generation failed. Please try again.', true);
        } finally {
          personPhotoInput.disabled = false;
          personGenerateButton.disabled = !sourceImageData;
        }
      });

      const submitPersonQuestion = question => {
        const text = question.trim();
        if (!text || personChatBusy) return;
        appendPersonMessage(text);
        personChatInput.value = '';
        personChatBusy = true;
        personChatInput.disabled = true;
        personChatSend.disabled = true;
        if (personChatClear) personChatClear.disabled = true;
        personChatStatus.textContent = '● Your digital person is thinking...';
        personChatStatus.style.color = '#06b6d4';

        const typingRow = document.createElement('div');
        typingRow.className = 'chat-msg-row bot-row';
        typingRow.id = 'digital-person-typing-row';
        typingRow.innerHTML = `
          <div class="chat-avatar-small digital-person-message-avatar">👤</div>
          <div class="chat-bubble typing-bubble">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
          </div>
        `;
        personThread.appendChild(typingRow);
        personThread.scrollTop = personThread.scrollHeight;

        window.setTimeout(() => {
          typingRow.remove();
          const answer = generateAIAnswer(text).replace(/NetBot AI/g, 'your digital person');
          appendPersonMessage(answer, true);
          personChatBusy = false;
          personChatInput.disabled = false;
          personChatSend.disabled = false;
          if (personChatClear) personChatClear.disabled = false;
          personChatStatus.textContent = '● Ready';
          personChatStatus.style.color = '#10b981';
          personChatInput.focus();
        }, 500);
      };

      personChatForm.addEventListener('submit', event => {
        event.preventDefault();
        submitPersonQuestion(personChatInput.value);
      });
      personPromptChips.forEach(chip => {
        chip.addEventListener('click', () => submitPersonQuestion(chip.dataset.prompt || ''));
      });

      personChatClear?.addEventListener('click', () => {
        personThread.innerHTML = `
          <div class="chat-msg-row bot-row">
            <div class="chat-avatar-small digital-person-message-avatar">👤</div>
            <div class="chat-bubble">
              <p><strong>Conversation reset!</strong> I’m your digital person. Ask me about Internet technology, networking, or web protocols.</p>
              <span class="chat-timestamp">Just now</span>
            </div>
          </div>
        `;
        if (personChatImage && !personChatImage.hidden) {
          const image = document.createElement('img');
          image.src = personChatImage.src;
          image.alt = '';
          personThread.querySelector('.digital-person-message-avatar').replaceChildren(image);
        }
        personChatStatus.textContent = '● Ready';
        personChatStatus.style.color = '#10b981';
      });
    }

    const handleUserSubmit = (e) => {
      if (e) e.preventDefault();
      const userText = chatInput.value.trim();
      if (!userText) return;

      // Append user bubble
      appendUserMessage(userText);
      chatInput.value = '';
      chatInput.disabled = true;
      chatSendBtn.disabled = true;
      if (chatStatusText) {
        chatStatusText.textContent = '● NetBot is generating answer...';
        chatStatusText.style.color = '#06b6d4';
      }

      showTypingIndicator();
      // Realistic AI generation delay (600ms)
      setTimeout(() => {
        removeTypingIndicator();
        const botReply = generateAIAnswer(userText);
        appendBotMessage(botReply);

        chatInput.disabled = false;
        chatSendBtn.disabled = false;
        if (chatStatusText) {
          chatStatusText.textContent = '● Ready';
          chatStatusText.style.color = '#10b981';
        }
        chatInput.focus();
      }, 650);
    };

    chatForm.addEventListener('submit', handleUserSubmit);

    // Suggestion prompt chips click
    chatPromptChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const prompt = chip.getAttribute('data-prompt');
        if (prompt) {
          chatInput.value = prompt;
          handleUserSubmit();
        }
      });
    });

    // Clear chat conversation button
    if (chatClearBtn) {
      chatClearBtn.addEventListener('click', () => {
        chatThread.innerHTML = `
          <div class="chat-msg-row bot-row">
            <div class="chat-avatar-small">🤖</div>
            <div class="chat-bubble">
              <p>
                <strong>Conversation reset!</strong> I am <strong>NetBot AI</strong>, your interactive Internet Technologies study assistant for Mekhi Childs' Digital Portfolio at <strong>Caldwell University</strong>.
              </p>
              <p>
                Feel free to ask a new question about <strong>how the Internet works</strong>, <strong>ISPs</strong>, <strong>web browsers</strong>, <strong>search engines</strong>, or <strong>cyber law</strong>!
              </p>
              <span class="chat-timestamp">${getFormattedTime()}</span>
            </div>
          </div>
        `;
        if (chatStatusText) {
          chatStatusText.textContent = '● Ready';
          chatStatusText.style.color = '#10b981';
        }
        chatInput.focus();
      });
    }
  }
});
