# Mekhi — Digital Portfolio & Professional Showcase

A fast, responsive, and modern personal resume and work showcase website built with HTML5, CSS3, and JavaScript, with a Netlify Function for secure AI avatar generation.

---

## 🚀 Quick Start (Instant Local Preview)

The static pages can be previewed locally without a build step:

1. **In Finder**: Go to `Documents` > `Digital Portfolio`, and **double-click `index.html`**. It will open directly in Safari, Chrome, or your default browser.
2. **From Terminal**: You can run:
   ```bash
   open index.html
   ```

The AI avatar generator requires its Netlify Function and an OpenAI API key. Opening `internet.html` directly from Finder displays the page, but cannot run the server-side image-generation request. To test it locally, run `npx netlify-cli dev` from the project folder and open the local URL printed by the command.

---

## 🎨 Features Included

- **Digital Citizenship Webpage**: Interactive guide (`digital-citizenship.html`) to the 9 Elements of Digital Citizenship, the REP Framework, digital law and privacy, AI ethics, a self-assessment quiz, and a digital hygiene checklist.
- **The Internet Architecture Webpage**: Deep-dive academic resource and interactive laboratory (`internet.html`) featuring:
  - **Part 1: Internet Technologies**: In-depth explanations in student voice of How the Internet Works, Internet Service Providers (ISPs), Web Browsers, and Search Engines, supported by high-res diagram infographics and authoritative hyperlinks.
  - **Part 2: AI Chatbot (NetBot AI)**: Interactive study assistant for questions about networking, ISPs, browsers, search engines, and network protocols.
  - **Part 3: AI Digital Person**: Upload a photo, generate a personalized avatar with the OpenAI Images API, display it in the chat, and ask the digital person questions. The photo is sent to OpenAI through a Netlify Function; the API key is kept in Netlify environment variables.
  - **Interactive Learning Lab**: 7-stage live Packet & DNS Flight Simulator, interactive URL anatomy inspector, knowledge quiz, and network hygiene checklist.
- **Software Guide**: A dedicated overview (`software.html`) of system, application, and utility software, productivity applications, cloud collaboration, and safe software habits.
- **Computer Hardware Webpage**: Dedicated course guide (`hardware.html`) covering CPU, RAM, motherboard, storage (SSD/HDD), GPU, power supply, cooling, and ports, with category filters, an IPOS workflow, a comparison table, and hardware care habits.
- **Cybersecurity & Safety Webpage**: Dedicated academic guide (`security.html`) featuring comprehensive coverage of **Strong Passwords** (characteristics, uniqueness, password managers, and MFA), **Phishing Attacks** (social engineering mechanics, real-world examples, and recognition cues), **Malware** (viruses, ransomware, spyware, infection pathways, and prevention), **Online Privacy** (personal data protection, data collection, privacy settings, safe browsing, and social media precautions), and **AI Ethics** (algorithmic bias, privacy risks, deepfakes, hallucination verification, and intellectual property respect), supported by interactive password entropy tools, phishing spotter simulations, a 10-point audit checklist, and a knowledge quiz.
- **Permanent Dark Mode**: Clean, immersive high-contrast dark theme configured across all devices with zero flicker.
- **30-Second AI Video Tour**: Interactive widescreen video player with animated simulated screen walkthrough, synchronized browser AI voiceover, closed captions, and scrubbing timeline.
- **Interactive Site Map Tree**: Clickable hierarchical ASCII tree navigation to jump to any section.
- **Hero & Profile Card**: Displays your title, bio tagline, availability status, and social links.
- **About Me & Education**: High-level background, personal pillars, and degree/certification history.
- **Course Topics & Academic Concepts**: Structured deep-dives into Safety & Security in Technology and AI in Education.
- **Featured Projects**: Showcase cards with gradient banners, tags, descriptions, and links.
- **Skills Categorization**: Neatly grouped skill badges (Critical Thinking, Analysis, Communication, Computer Knowledge, AI & Tech Tools).
- **Interactive Contact Section**: Contact information and interactive form with instant client-side feedback.

---

## ✏️ How to Personalize Your Site

All content is clean and organized inside [`index.html`](index.html):

| What to Edit | Where to Look in `index.html` |
| :--- | :--- |
| **Your Name & Title** | Search for `Mekhi` or `<h1 class="hero-title">` |
| **Social Media / Email** | Search for `hero-socials` and `contact-details` to update links and your email |
| **About Bio** | Find `<section id="about">` |
| **Course Topics** | Find `<section id="security">` and `<section id="ai">` to customize study topics |
| **Projects** | Find `<section id="projects">` to update titles, descriptions, and demo links |
| **Skills** | Find `<section id="skills">` to update the skill pill badges |
| **Color Scheme** | Check the top of [`styles.css`](styles.css) under `:root` to adjust `--primary` or `--accent` |

---

## 🌐 Publishing Online for Free

When you are ready to share your portfolio with recruiters, clients, or colleagues, you can host it completely free:

### Option A: Netlify (Required for AI Avatar Generation)
The avatar backend is in [`netlify/functions/generate-avatar.mjs`](netlify/functions/generate-avatar.mjs). [`netlify.toml`](netlify.toml) configures the site and function directories.

1. Publish this project to a Git repository and import it into [Netlify](https://app.netlify.com/). A static drag-and-drop deployment does not deploy the function.
2. In the Netlify site settings, add `OPENAI_API_KEY` as an environment variable, then redeploy. Never put the key in HTML, JavaScript, or a public repository.
3. Use an OpenAI API project with image-generation access and billing configured. Consider setting an appropriate usage budget.
4. Open the deployed `internet.html` page to use the digital person.

Photos are compressed in the browser before upload, sent to OpenAI only when the user requests generation, and are not stored by this site's function. OpenAI processes the photo to return the generated avatar.

### Option B: GitHub Pages (Static Pages Only)
1. Create a free account at [github.com](https://github.com).
2. Create a repository named `portfolio` (or `<your-username>.github.io`).
3. Upload these files (`index.html`, `styles.css`, `script.js`).
4. In repository **Settings** > **Pages**, set the source to `main` branch and click **Save**.
5. Your static portfolio will be live at `https://<your-username>.github.io/portfolio`. GitHub Pages does not run the Netlify avatar-generation function, so Part 3 avatar generation will not work there.

### Option C: Vercel
1. Go to [vercel.com](https://vercel.com).
2. Import your GitHub repository or deploy via the Vercel dashboard.
3. The included avatar backend is a Netlify Function; it must be ported to a Vercel Function before avatar generation will work on Vercel.
