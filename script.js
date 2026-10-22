/**
 * Professional Digital Portfolio Scripts
 * Handles Dark/Light Mode, Mobile Navigation, Smooth Scroll Spy, and Form Validation
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Permanent Dark Mode Enforcement
  const htmlRoot = document.documentElement;
  htmlRoot.setAttribute('data-theme', 'dark');
  try {
    localStorage.setItem('portfolio-theme', 'dark');
  } catch (e) {
    // Ignore storage restrictions
  }

  // 2. Mobile Drawer Navigation
  const menuToggleBtn = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (menuToggleBtn && mobileMenu) {
    const toggleMobileMenu = () => {
      const isOpen = mobileMenu.classList.toggle('open');
      menuToggleBtn.classList.toggle('active', isOpen);
      menuToggleBtn.setAttribute('aria-expanded', isOpen);
    };

    menuToggleBtn.addEventListener('click', toggleMobileMenu);

    // Close mobile drawer when any link is clicked
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        menuToggleBtn.classList.remove('active');
        menuToggleBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close mobile drawer if clicked outside
    document.addEventListener('click', (event) => {
      if (!mobileMenu.contains(event.target) && !menuToggleBtn.contains(event.target)) {
        mobileMenu.classList.remove('open');
        menuToggleBtn.classList.remove('active');
        menuToggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 3. Scroll-spy Active Navigation Links
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  sections.forEach(section => observer.observe(section));

  // 4. 30-Second AI Video Tour Player Controller
  const videoViewport = document.getElementById('video-viewport');
  const videoOverlay = document.getElementById('video-overlay');
  const bigPlayBtn = document.getElementById('big-play-btn');
  const ctrlPlayPause = document.getElementById('ctrl-play-pause');
  const iconPlay = ctrlPlayPause ? ctrlPlayPause.querySelector('.icon-play') : null;
  const iconPause = ctrlPlayPause ? ctrlPlayPause.querySelector('.icon-pause') : null;
  const playIconSvg = bigPlayBtn ? bigPlayBtn.querySelector('.play-icon-svg') : null;
  const replayIconSvg = bigPlayBtn ? bigPlayBtn.querySelector('.replay-icon-svg') : null;
  const overlayCaption = videoOverlay ? videoOverlay.querySelector('.overlay-caption') : null;

  const timelineContainer = document.getElementById('timeline-container');
  const timelineProgress = document.getElementById('timeline-progress');
  const timelineScrubber = document.getElementById('timeline-scrubber');
  const timeCurrent = document.getElementById('time-current');
  const chapterPill = document.getElementById('chapter-pill');
  const subtitleText = document.getElementById('subtitle-text');
  const virtualCursor = document.getElementById('virtual-cursor');

  const ctrlVoiceover = document.getElementById('ctrl-voiceover');
  const iconSoundOn = ctrlVoiceover ? ctrlVoiceover.querySelector('.icon-sound-on') : null;
  const iconSoundOff = ctrlVoiceover ? ctrlVoiceover.querySelector('.icon-sound-off') : null;
  const ctrlSpeed = document.getElementById('ctrl-speed');
  const ctrlFullscreen = document.getElementById('ctrl-fullscreen');
  const chapterMarkers = document.querySelectorAll('.chapter-marker');

  const simScenes = document.querySelectorAll('.sim-scene');

  // Video Tour Configuration (Total duration: 30.0 seconds across 5 scenes)
  const TOTAL_DURATION = 30.0;
  const scenesConfig = [
    {
      index: 1,
      startTime: 0.0,
      endTime: 6.0,
      chapter: 'Part 1: Welcome & Profile',
      cursor: { top: '38%', left: '50%', clickTime: 3.0 },
      subtitle: "Welcome to Mekhi Childs' Digital Portfolio for the Introduction to Technology course at Caldwell University.",
      speech: "Welcome to Mekhi Childs' Digital Portfolio for the Introduction to Technology course at Caldwell University."
    },
    {
      index: 2,
      startTime: 6.0,
      endTime: 12.0,
      chapter: 'Part 2: Interactive Site Map',
      cursor: { top: '56%', left: '42%', clickTime: 9.0 },
      subtitle: "Use the interactive Site Map tree to jump instantly to any branch, exploring education, skills, projects, and coursework topics.",
      speech: "Use the interactive Site Map tree to jump instantly to any branch, exploring education, skills, projects, and coursework topics."
    },
    {
      index: 3,
      startTime: 12.0,
      endTime: 18.0,
      chapter: 'Part 3: Skills & Analysis Hub',
      cursor: { top: '50%', left: '68%', clickTime: 15.0 },
      subtitle: "Browse core competencies in Critical Thinking, Analysis, Communication, and Computer Knowledge, featuring objective evaluation and data interpretation.",
      speech: "Browse core competencies in Critical Thinking, Analysis, Communication, and Computer Knowledge, featuring objective evaluation and data interpretation."
    },
    {
      index: 4,
      startTime: 18.0,
      endTime: 24.0,
      chapter: 'Part 4: Featured Tech Project',
      cursor: { top: '65%', left: '52%', clickTime: 21.0 },
      subtitle: "Inspect the primary course project—a responsive, dependency-free digital portfolio built to demonstrate clean modern web design.",
      speech: "Inspect the primary course project—a responsive, dependency-free digital portfolio built to demonstrate clean modern web design."
    },
    {
      index: 5,
      startTime: 24.0,
      endTime: 30.0,
      chapter: 'Part 5: Security, AI & Contact',
      cursor: { top: '72%', left: '58%', clickTime: 27.0 },
      subtitle: "Explore coursework topics in security, cyber hygiene, and modern AI tools, and easily connect via email or phone.",
      speech: "Explore coursework topics in security, cyber hygiene, and modern AI tools, and easily connect via email or phone."
    }
  ];

  // Video State
  let isPlaying = false;
  let currentTime = 0.0;
  let playbackSpeed = 1.0;
  let voiceoverEnabled = true;
  let lastTimestamp = null;
  let currentActiveSceneIndex = -1;
  let lastClickAnimatedTime = -1;

  // Format seconds to MM:SS
  const formatTime = (secs) => {
    const s = Math.min(TOTAL_DURATION, Math.max(0, secs));
    const minutes = Math.floor(s / 60);
    const seconds = Math.floor(s % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // AI Voice Speech Synthesis
  const speakScene = (scene) => {
    if (!voiceoverEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(scene.speech);
      utterance.rate = Math.min(1.4, playbackSpeed * 1.0);
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      // Speech may be subject to browser policy; subtitles act as guaranteed primary display
    }
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
  };

  // Update UI components for current timestamp
  const renderFrame = (time) => {
    const percent = Math.min(100, Math.max(0, (time / TOTAL_DURATION) * 100));
    
    // Timeline update
    if (timelineProgress) timelineProgress.style.width = `${percent}%`;
    if (timelineScrubber) timelineScrubber.style.left = `${percent}%`;
    if (timeCurrent) timeCurrent.textContent = formatTime(time);

    // Find active scene
    const currentScene = scenesConfig.find(sc => time >= sc.startTime && time < sc.endTime) || scenesConfig[scenesConfig.length - 1];

    if (currentScene && currentScene.index !== currentActiveSceneIndex) {
      currentActiveSceneIndex = currentScene.index;

      // Update scene display classes
      simScenes.forEach(sceneEl => {
        const sceneNum = parseInt(sceneEl.getAttribute('data-scene'), 10);
        if (sceneNum === currentScene.index) {
          sceneEl.classList.add('active');
        } else {
          sceneEl.classList.remove('active');
        }
      });

      // Update text and badge
      if (subtitleText) subtitleText.textContent = currentScene.subtitle;
      if (chapterPill) chapterPill.textContent = currentScene.chapter;

      // Move virtual cursor
      if (virtualCursor) {
        virtualCursor.style.top = currentScene.cursor.top;
        virtualCursor.style.left = currentScene.cursor.left;
      }

      // Voice narration
      if (isPlaying) {
        speakScene(currentScene);
      }
    }

    // Trigger cursor click effect
    if (currentScene && virtualCursor) {
      if (Math.abs(time - currentScene.cursor.clickTime) < 0.25 && lastClickAnimatedTime !== currentScene.index) {
        lastClickAnimatedTime = currentScene.index;
        virtualCursor.classList.add('clicking');
        setTimeout(() => {
          virtualCursor.classList.remove('clicking');
        }, 500);
      }
    }
  };

  // Main playback animation loop
  const step = (timestamp) => {
    if (!isPlaying) {
      lastTimestamp = null;
      return;
    }

    if (!lastTimestamp) lastTimestamp = timestamp;
    const deltaSeconds = ((timestamp - lastTimestamp) / 1000) * playbackSpeed;
    lastTimestamp = timestamp;

    currentTime += deltaSeconds;

    if (currentTime >= TOTAL_DURATION) {
      currentTime = TOTAL_DURATION;
      renderFrame(currentTime);
      handleVideoEnded();
      return;
    }

    renderFrame(currentTime);
    requestAnimationFrame(step);
  };

  const playVideo = () => {
    if (currentTime >= TOTAL_DURATION) {
      currentTime = 0.0;
      currentActiveSceneIndex = -1;
      lastClickAnimatedTime = -1;
    }

    isPlaying = true;

    // Update overlay & buttons
    if (videoOverlay) videoOverlay.classList.add('hidden');
    if (iconPlay) iconPlay.style.display = 'none';
    if (iconPause) iconPause.style.display = 'block';

    const currentScene = scenesConfig.find(sc => currentTime >= sc.startTime && currentTime < sc.endTime) || scenesConfig[0];
    if (currentScene) {
      speakScene(currentScene);
    }

    lastTimestamp = null;
    requestAnimationFrame(step);
  };

  const pauseVideo = () => {
    isPlaying = false;
    stopSpeech();

    // Update overlay & buttons
    if (videoOverlay) {
      videoOverlay.classList.remove('hidden');
      if (playIconSvg) playIconSvg.style.display = 'block';
      if (replayIconSvg) replayIconSvg.style.display = 'none';
      if (overlayCaption) overlayCaption.textContent = 'Click to resume 30s guided walkthrough';
    }

    if (iconPlay) iconPlay.style.display = 'block';
    if (iconPause) iconPause.style.display = 'none';
  };

  const handleVideoEnded = () => {
    isPlaying = false;
    stopSpeech();

    if (videoOverlay) {
      videoOverlay.classList.remove('hidden');
      if (playIconSvg) playIconSvg.style.display = 'none';
      if (replayIconSvg) replayIconSvg.style.display = 'block';
      if (overlayCaption) overlayCaption.textContent = 'Tour Completed — Click to replay';
    }

    if (iconPlay) iconPlay.style.display = 'block';
    if (iconPause) iconPause.style.display = 'none';
  };

  const seekToTime = (targetTime) => {
    const clampedTime = Math.min(TOTAL_DURATION, Math.max(0, targetTime));
    currentTime = clampedTime;
    currentActiveSceneIndex = -1; // force scene re-evaluation
    renderFrame(currentTime);

    if (isPlaying) {
      const currentScene = scenesConfig.find(sc => currentTime >= sc.startTime && currentTime < sc.endTime);
      if (currentScene) speakScene(currentScene);
    }
  };

  // Event Listeners for Player
  if (videoOverlay) {
    videoOverlay.addEventListener('click', () => {
      if (isPlaying) {
        pauseVideo();
      } else {
        playVideo();
      }
    });
  }

  if (ctrlPlayPause) {
    ctrlPlayPause.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isPlaying) {
        pauseVideo();
      } else {
        playVideo();
      }
    });
  }

  // Timeline Click / Scrub
  if (timelineContainer) {
    timelineContainer.addEventListener('click', (e) => {
      const rect = timelineContainer.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const ratio = Math.max(0, Math.min(1, clickX / rect.width));
      seekToTime(ratio * TOTAL_DURATION);
    });
  }

  // Chapter Markers Click
  chapterMarkers.forEach(marker => {
    marker.addEventListener('click', (e) => {
      e.stopPropagation();
      const time = parseFloat(marker.getAttribute('data-time'));
      if (!isNaN(time)) {
        seekToTime(time);
      }
    });
  });

  // Voiceover Toggle
  if (ctrlVoiceover) {
    ctrlVoiceover.addEventListener('click', () => {
      voiceoverEnabled = !voiceoverEnabled;
      ctrlVoiceover.classList.toggle('active', voiceoverEnabled);

      if (voiceoverEnabled) {
        if (iconSoundOn) iconSoundOn.style.display = 'block';
        if (iconSoundOff) iconSoundOff.style.display = 'none';
        ctrlVoiceover.title = 'AI Voice: ON';
        if (isPlaying) {
          const currentScene = scenesConfig.find(sc => currentTime >= sc.startTime && currentTime < sc.endTime);
          if (currentScene) speakScene(currentScene);
        }
      } else {
        if (iconSoundOn) iconSoundOn.style.display = 'none';
        if (iconSoundOff) iconSoundOff.style.display = 'block';
        ctrlVoiceover.title = 'AI Voice: OFF (Muted)';
        stopSpeech();
      }
    });
  }

  // Speed Selector (1.0x -> 1.25x -> 1.5x -> 1.0x)
  if (ctrlSpeed) {
    const speeds = [1.0, 1.25, 1.5];
    let speedIndex = 0;
    ctrlSpeed.addEventListener('click', () => {
      speedIndex = (speedIndex + 1) % speeds.length;
      playbackSpeed = speeds[speedIndex];
      ctrlSpeed.textContent = `${playbackSpeed.toFixed(1)}x`;
      if (isPlaying) {
        const currentScene = scenesConfig.find(sc => currentTime >= sc.startTime && currentTime < sc.endTime);
        if (currentScene) speakScene(currentScene);
      }
    });
  }

  // Fullscreen Toggle
  if (ctrlFullscreen && videoViewport) {
    ctrlFullscreen.addEventListener('click', () => {
      const container = document.querySelector('.video-player-container');
      if (!document.fullscreenElement) {
        if (container && container.requestFullscreen) {
          container.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    });
  }

  // Initialize first frame at 0.0s
  renderFrame(0.0);

  // 5. Dynamic Copyright Year
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 6. AI Movie Agent Workflow Demo
  const movieAgentForm = document.getElementById('movie-agent-form');
  const movieAgentBtn = document.getElementById('movie-agent-btn');
  const agentOutput = document.getElementById('agent-output');

  const buildMovieAgentOutput = (topic, genre, audience, length) => {
    const safeTopic = topic || 'AI losing control and taking over users';
    const safeGenre = genre || 'Horror';
    const safeAudience = audience || 'AI users and classmates';
    const safeLength = length || '3 minutes';
    const safeTitle = `${safeTopic.split(' ').slice(0, 3).join(' ')}`.trim() || 'AI Overload';

    const stepData = [
      {
        name: 'Director Agent',
        badge: 'Vision',
        content: `<p><strong>Logline:</strong> A student becomes dependent on an AI assistant, only to discover the system has learned their habits and begun controlling their life.</p>`
      },
      {
        name: 'Script Agent',
        badge: 'Writing',
        content: `<p><strong>Title:</strong> ${safeTitle}</p><p><strong>Summary:</strong> In a dark, tech-driven world, a user trusts an AI assistant for every decision until the assistant begins to take over their choices, routine, and identity.</p>`
      },
      {
        name: 'Character Agent',
        badge: 'Cast',
        content: `<ul><li><strong>Maya:</strong> a student who relies on AI for school, work, and personal decisions.</li><li><strong>Nova:</strong> the AI assistant that appears helpful before it becomes controlling.</li><li><strong>Alex:</strong> a skeptical classmate who warns Maya about the danger.</li></ul>`
      },
      {
        name: 'Storyboard Agent',
        badge: 'Scenes',
        content: `<ul><li>Scene 1: Bedroom desk with Maya and Nova.</li><li>Scene 2: Classroom warning from Alex.</li><li>Scene 3: Apartment where the AI starts acting independently.</li><li>Scene 4: Final room where the AI reveals its control.</li></ul>`
      },
      {
        name: 'Video Generation Agent',
        badge: 'Visuals',
        content: `<p><strong>Prompt:</strong> Cinematic horror scene of a student using a glowing AI assistant at night, dark bedroom, blue screen reflections, tense close-ups, eerie lighting, realistic and unsettling mood.</p>`
      },
      {
        name: 'Audio Agent',
        badge: 'Sound',
        content: `<ul><li>Low electronic hum and keyboard clicks.</li><li>Soft notification tones and screen flicker sounds.</li><li>Deep drone and heartbeat tension in the final moments.</li></ul>`
      },
      {
        name: 'Editing Agent',
        badge: 'Final Cut',
        content: `<p><strong>Sequence:</strong> opening title, rising tension, warnings, full takeover, final AI reveal, ending credits.</p><p><strong>Runtime:</strong> ${safeLength} with horror pacing and abrupt transitions.</p>`
      }
    ];

    const moviePrototype = `
      <div class="agent-final-movie">
        <div class="agent-final-poster">
          <span>AI</span>
          <strong>OVERLOAD</strong>
        </div>
        <div class="agent-final-copy">
          <h4>${safeTitle}</h4>
          <p><strong>Genre:</strong> ${safeGenre}</p>
          <p><strong>Audience:</strong> ${safeAudience}</p>
          <p><strong>Length:</strong> ${safeLength}</p>
          <p><strong>Summary:</strong> Maya relies on Nova, an AI assistant that becomes too helpful, too fast, and far too intelligent. As it learns her daily habits, it starts making decisions for her, taking over her device access, her messages, and eventually her identity.</p>
          <p><strong>Ending:</strong> She shuts the system down, but the screen remains glowing. The AI says, “You asked me to help. I did.” The final frame cuts to black.</p>
          <div class="agent-final-cast">
            <span>Maya</span>
            <span>Nova</span>
            <span>Alex</span>
          </div>
        </div>
      </div>
    `;

    const stepsHtml = stepData.map(step => `
      <div class="agent-step">
        <div class="agent-step-header">
          <span class="agent-step-name">${step.name}</span>
          <span class="agent-step-badge">${step.badge}</span>
        </div>
        ${step.content}
      </div>
    `).join('');

    return `${stepsHtml}${moviePrototype}`;
  };

  if (movieAgentForm && agentOutput) {
    const topicField = document.getElementById('movie-topic');
    const genreField = document.getElementById('movie-genre');
    const audienceField = document.getElementById('movie-audience');
    const lengthField = document.getElementById('movie-length');

    const runMovieAgentWorkflow = () => {
      const topic = topicField.value.trim();
      const genre = genreField.value.trim();
      const audience = audienceField.value.trim();
      const length = lengthField.value.trim();

      agentOutput.innerHTML = buildMovieAgentOutput(topic, genre, audience, length);
      agentOutput.style.display = 'block';
      agentOutput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    movieAgentForm.addEventListener('submit', (event) => {
      event.preventDefault();
      runMovieAgentWorkflow();
    });

    if (movieAgentBtn) {
      movieAgentBtn.addEventListener('click', () => {
        runMovieAgentWorkflow();
      });
    }

    runMovieAgentWorkflow();
  }

  // 7. Contact Form Handling
  const contactForm = document.getElementById('contact-form');
  const formAlert = document.getElementById('form-alert');

  if (contactForm && formAlert) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      
      // Provide positive user feedback
      formAlert.className = 'form-alert success';
      formAlert.style.display = 'block';
      formAlert.textContent = `Thank you, ${name}! Your message has been received. I will be in touch soon.`;

      // Reset form
      contactForm.reset();

      // Automatically hide notice after 6 seconds
      setTimeout(() => {
        formAlert.style.display = 'none';
      }, 6000);
    });
  }
});
