// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfdC_0WmnGSewlf_8jFruICQbgNZacV-Y",
  authDomain: "dhrm-48be8.firebaseapp.com",
  projectId: "dhrm-48be8",
  storageBucket: "dhrm-48be8.firebasestorage.app",
  messagingSenderId: "865105006717",
  appId: "1:865105006717:web:8136af5dce57adda08e114",
  measurementId: "G-J08WQ9301N"
};

// Initialize Firebase if the SDK is loaded
let auth = null;
let db = null;
let currentUser = null;
let currentSessionId = null;

if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
}

// Loading Logic
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if(loader) {
        const minLoaderTime = 1500;
        const elapsed = typeof performance !== 'undefined' ? performance.now() : 0;
        const remaining = Math.max(0, minLoaderTime - elapsed);

        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                document.body.style.overflowY = 'auto';
                if(typeof checkScroll === 'function') checkScroll();
            }, 800);
        }, remaining);
    } else {
        document.body.style.overflowY = 'auto';
        if(typeof checkScroll === 'function') checkScroll();
    }
});

// Toggle Mobile Menu
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    if(menu) menu.classList.toggle('hidden');
}
window.toggleMenu = toggleMenu;

const drishtiQuotes = {
    en: [
        { quote: 'Focus on your duty, not the outcome.', citation: 'Bhagavad Gita 2.47' },
        { quote: 'The mind is both friend and enemy.', citation: 'Bhagavad Gita 6.5' },
        { quote: 'Peace comes to one free from craving.', citation: 'Bhagavad Gita 2.70' }
    ],
    hi: [
        { quote: 'कर्म करते रहो, फल की चिंता मत करो।', citation: 'श्रीमद्भगवद्गीता 2.47' },
        { quote: 'मनुष्य का मन ही मित्र और शत्रु है।', citation: 'श्रीमद्भगवद्गीता 6.5' },
        { quote: 'इच्छाओं से मुक्त व्यक्ति को शांति मिलती है।', citation: 'श्रीमद्भगवद्गीता 2.70' }
    ]
};

const bookContent = {
    gita: {
        en: 'The Bhagavad Gita teaches focused action, inner steadiness, and devotion without attachment to outcomes.',
        hi: 'भगवद्गीता निस्वार्थ कर्म, आंतरिक स्थिरता और परिणामों से अनासक्ति का मार्ग सिखाती है।'
    },
    upanishads: {
        en: 'The Upanishads inquire into the Self, consciousness, and the unity underlying apparent diversity.',
        hi: 'उपनिषद आत्मा, चेतना और विविधता के भीतर एकता की गहन खोज करते हैं।'
    },
    yoga: {
        en: 'Yoga Sutra presents a practical method to quiet the mind and cultivate sustained clarity.',
        hi: 'योगसूत्र मन को स्थिर करने और स्पष्टता विकसित करने की व्यावहारिक विधि देता है।'
    }
};

const langUI = {
    en: { btn: 'EN', placeholder: 'Type your question...', drishtiBtn: 'Get New Drishti', chatThinking: 'DHRM is contemplating...' },
    hi: { btn: 'HI', placeholder: 'अपना प्रश्न लिखें...', drishtiBtn: 'नई दृष्टि पाएं', chatThinking: 'DHRM विचार कर रहा है...' }
};

let currentLanguage = localStorage.getItem('dhrm_lang') === 'hi' ? 'hi' : 'en';

const drishtiQuoteEl = document.getElementById('drishti-quote');
const drishtiCitationEl = document.getElementById('drishti-citation');
const newDrishtiBtn = document.getElementById('new-drishti-btn');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const chatTyping = document.getElementById('chat-typing');
const langToggleBtn = document.getElementById('lang-toggle-btn');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const themeToggleBtnMobile = document.getElementById('theme-toggle-btn-mobile');
const bookReaderModal = document.getElementById('book-reader-modal');
const bookReaderCloseBtn = document.getElementById('book-reader-close');
const bookReaderTitle = document.getElementById('book-reader-title');
const bookReaderContent = document.getElementById('book-reader-content');
let currentTheme = localStorage.getItem('dhrm_theme') === 'light' ? 'light' : 'dark';

function setTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('dhrm_theme', theme);
    document.body.classList.toggle('light-theme', theme === 'light');
    const label = theme === 'light' ? 'Dark Theme' : 'Light Theme';
    if(themeToggleBtn) themeToggleBtn.textContent = label;
    if(themeToggleBtnMobile) themeToggleBtnMobile.textContent = label;
}

function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('dhrm_lang', lang);
    if(langToggleBtn) langToggleBtn.textContent = langUI[lang].btn;
    if(chatInput) chatInput.placeholder = langUI[lang].placeholder;
    if(newDrishtiBtn) newDrishtiBtn.textContent = langUI[lang].drishtiBtn;
    if(chatTyping) {
        const textSpan = chatTyping.querySelector('span');
        if (textSpan) textSpan.textContent = langUI[lang].chatThinking;
    }
    if(drishtiQuoteEl) getNewDrishti();
}

function getNewDrishti() {
    if(!drishtiQuoteEl) return;
    const list = drishtiQuotes[currentLanguage];
    const pick = list[Math.floor(Math.random() * list.length)];
    drishtiQuoteEl.textContent = pick.quote;
    drishtiCitationEl.textContent = pick.citation;
}

async function getGeminiResponse(message) {
    const userFocus = localStorage.getItem('dhrm_focus') || 'general wisdom';
    
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message, focus: userFocus })
        });

        if (!response.ok) throw new Error('Proxy returned error response');
        
        const parsed = await response.json();
        return { 
            solution: parsed.solution || "",
            shlok: parsed.shlok || "",
            reference: parsed.reference || "",
            explanation: parsed.explanation || ""
        };
    } catch (error) {
        console.error("Gemini API Error:", error);
        return { 
            solution: currentLanguage === 'hi' 
                ? 'यह गहरा प्रश्न है। अपने कर्तव्य पर केंद्रित रहें और मन को स्थिर रखें।' 
                : 'That is a deep question. Stay anchored in right action and inner steadiness.', 
            shlok: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।',
            reference: 'Bhagavad Gita 2.47',
            explanation: 'तुम्हें अपना कर्म करने का अधिकार है, किन्तु कर्म के फलों के तुम अधिकारी नहीं हो।'
        };
    }
}

async function openBookReader(bookId, title) {
    if(!bookReaderModal) return;
    bookReaderTitle.textContent = title;
    bookReaderModal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');

    if (bookId !== 'gita') {
        // Fallback for Upanishads and Yoga Sutra
        const content = bookContent[bookId] ? bookContent[bookId][currentLanguage] : 'Content not available.';
        bookReaderContent.innerHTML = `<div class="text-lg md:text-xl text-gray-300 leading-relaxed font-serif max-w-2xl mx-auto p-4">${content}</div>`;
        return;
    }

    // Interactive Bhagavad Gita Reader UI
    bookReaderContent.innerHTML = `
        <div class="flex flex-col md:flex-row gap-6 h-full min-h-0 text-left pb-4">
            <!-- Sidebar: Chapter & Verse Selector -->
            <div class="w-full md:w-64 flex flex-col border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-4 flex-shrink-0 min-h-0">
                <label class="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Select Chapter</label>
                <select id="gita-chapter-select" class="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none mb-4 focus:border-[#d4af37]/60">
                    <option value="" disabled selected>Loading chapters...</option>
                </select>
                
                <label class="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Select Verse</label>
                <div id="gita-verse-list" class="flex-1 overflow-y-auto pr-1 flex flex-col gap-1 chat-scroll text-xs min-h-[150px]">
                    <div class="text-gray-500 italic p-3 text-center">Choose a chapter first.</div>
                </div>
            </div>
            
            <!-- Main Content Area: Verse Details -->
            <div id="gita-verse-details" class="flex-1 overflow-y-auto pr-2 chat-scroll min-h-0 flex flex-col justify-center items-center py-6 text-center text-gray-500 italic">
                Select a verse to start reading.
            </div>
        </div>
    `;

    const chapterSelect = document.getElementById('gita-chapter-select');
    const verseList = document.getElementById('gita-verse-list');
    const verseDetails = document.getElementById('gita-verse-details');

    try {
        // 1. Fetch chapters
        const res = await fetch('/api/gita/chapters');
        if (!res.ok) throw new Error("Failed to load chapters");
        const chapters = await res.json();
        
        chapterSelect.innerHTML = '<option value="" disabled selected>-- Select Chapter --</option>' + 
            chapters.map(c => `<option value="${c.chapter_number}">Chapter ${c.chapter_number}: ${c.name_translation || c.name}</option>`).join('');

        // 2. Chapter change handler
        chapterSelect.addEventListener('change', async () => {
            const chapNum = chapterSelect.value;
            verseList.innerHTML = '<div class="text-gray-500 italic p-3 text-center">Loading verses...</div>';
            verseDetails.innerHTML = 'Select a verse to start reading.';
            verseDetails.classList.add('text-center', 'italic', 'text-gray-500');

            try {
                const vRes = await fetch(`/api/gita/chapters/${chapNum}/verses`);
                if (!vRes.ok) throw new Error("Failed to load verses");
                const verses = await vRes.json();
                
                verseList.innerHTML = verses.map(v => `
                    <button class="gita-verse-btn w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 transition-all text-xs" data-chap="${chapNum}" data-verse="${v.verse_number}">
                        Verse ${v.verse_number}
                    </button>
                `).join('');

                // Verse click handlers
                document.querySelectorAll('.gita-verse-btn').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        // Highlight active verse button
                        document.querySelectorAll('.gita-verse-btn').forEach(b => {
                            b.classList.remove('bg-white/10', 'border-[#d4af37]/40', 'text-[#d4af37]');
                        });
                        e.currentTarget.classList.add('bg-white/10', 'border-[#d4af37]/40', 'text-[#d4af37]');

                        const chap = e.currentTarget.getAttribute('data-chap');
                        const vNum = e.currentTarget.getAttribute('data-verse');
                        loadVerseDetails(chap, vNum);
                    });
                });
            } catch (err) {
                console.error("Verses load error:", err);
                verseList.innerHTML = '<div class="text-red-400 p-3 text-center">Error loading verses.</div>';
            }
        });

    } catch (err) {
        console.error("Chapters load error:", err);
        chapterSelect.innerHTML = '<option value="" disabled>Error loading chapters</option>';
    }

    async function loadVerseDetails(chapNum, verseNum) {
        verseDetails.innerHTML = '<div class="h-full flex items-center justify-center text-gray-500 italic">Contemplating verse...</div>';
        verseDetails.classList.add('text-center', 'italic');

        try {
            const res = await fetch(`/api/gita/chapters/${chapNum}/verses/${verseNum}`);
            if (!res.ok) throw new Error("Failed to load verse details");
            const data = await res.json();

            verseDetails.classList.remove('text-center', 'italic');
            
            // Format Sanskrit lines
            const formattedSanskrit = data.text ? data.text.split('\n').map(line => line.trim()).filter(line => line.length > 0).join('<br>') : '';
            const formattedTransliteration = data.transliteration ? data.transliteration.split('\n').map(line => line.trim()).filter(line => line.length > 0).join('<br>') : '';

            // Group translations by language
            const hindiTrans = data.translations.filter(t => t.lang === 'hindi');
            const englishTrans = data.translations.filter(t => t.lang === 'english');

            verseDetails.innerHTML = `
                <div class="w-full flex flex-col gap-6 font-sans">
                    <!-- Sanskrit Text block -->
                    <div class="p-6 rounded-2xl bg-[#f97316]/5 border border-[#f97316]/20 text-center">
                        <div class="text-[#f97316] text-xl md:text-2xl font-bold font-serif leading-relaxed tracking-wide mb-3">
                            ${formattedSanskrit}
                        </div>
                        <div class="text-xs text-gray-400 italic leading-relaxed font-serif">
                            ${formattedTransliteration}
                        </div>
                    </div>

                    <!-- Translations selector -->
                    <div class="flex justify-between items-center bg-white/5 border border-white/10 rounded-2xl p-4 flex-wrap gap-3">
                        <div class="flex items-center gap-3">
                            <label class="text-xs text-gray-400 font-bold uppercase tracking-wider">Translation By:</label>
                            <select id="gita-author-select" class="bg-zinc-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-[#d4af37]/60">
                                ${hindiTrans.map((t, idx) => `<option value="hindi_${idx}">[HI] ${t.authorName}</option>`).join('')}
                                ${englishTrans.map((t, idx) => `<option value="english_${idx}">[EN] ${t.authorName}</option>`).join('')}
                            </select>
                        </div>
                        <button id="save-verse-btn" class="gold-btn px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                            Save to Moksha Log
                        </button>
                    </div>

                    <!-- Selected translation text box -->
                    <div class="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                        <p id="gita-translation-display" class="text-gray-200 leading-relaxed text-sm md:text-base font-serif">
                            <!-- Selected translation text here -->
                        </p>
                    </div>
                </div>
            `;

            // Setup Translation switcher
            const authorSelect = document.getElementById('gita-author-select');
            const translationDisplay = document.getElementById('gita-translation-display');
            const saveBtn = document.getElementById('save-verse-btn');

            const updateTranslationDisplay = () => {
                const val = authorSelect.value;
                if (!val) return;
                const [lang, idxStr] = val.split('_');
                const idx = parseInt(idxStr);
                const list = lang === 'hindi' ? hindiTrans : englishTrans;
                translationDisplay.textContent = list[idx] ? list[idx].description : 'No translation available.';
            };

            authorSelect.addEventListener('change', updateTranslationDisplay);
            updateTranslationDisplay(); // Initial trigger

            // Setup Save to Journal handler
            saveBtn.addEventListener('click', () => {
                const translationText = translationDisplay.textContent;
                const authorText = authorSelect.options[authorSelect.selectedIndex].text;
                const journalText = `Saved Verse: Bhagavad Gita Chapter ${chapNum}, Verse ${verseNum}\n\n"${formattedSanskrit.replace(/<br>/g, ' | ')}"\n\nTranslation (${authorText}): "${translationText}"`;
                
                saveToJournal(journalText, 'Scripture Study');
                saveBtn.textContent = "Saved ✓";
                saveBtn.classList.add('opacity-50', 'cursor-not-allowed');
                saveBtn.disabled = true;
            });

        } catch (err) {
            console.error("Verse details error:", err);
            verseDetails.innerHTML = '<div class="text-red-400 p-6 text-center">Failed to load verse details.</div>';
        }
    }
}

if(newDrishtiBtn) newDrishtiBtn.addEventListener('click', getNewDrishti);

if(chatForm) {
    chatForm.onsubmit = null; // Remove any inline onsubmit
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Ensure a session exists if logged in
        if (currentUser && !currentSessionId) {
            currentSessionId = 'session_' + Date.now();
        }
        
        addMessageToChat(message, 'user');
        chatInput.value = '';
        chatTyping.classList.remove('hidden');
        
        // Save user message to Firestore
        if (currentUser && db && currentSessionId) {
            await saveMessageToFirestore(currentSessionId, {
                text: message,
                sender: 'user',
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        // Call Gemini API
        const answer = await getGeminiResponse(message);
        
        chatTyping.classList.add('hidden');
        addMessageToChat(answer, 'dhrm');
        
        // Save DHRM response to Firestore
        if (currentUser && db && currentSessionId) {
            await saveMessageToFirestore(currentSessionId, {
                data: answer,
                sender: 'dhrm',
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
    });
}

if(langToggleBtn) langToggleBtn.addEventListener('click', () => setLanguage(currentLanguage === 'en' ? 'hi' : 'en'));
if(themeToggleBtn) themeToggleBtn.addEventListener('click', () => setTheme(currentTheme === 'dark' ? 'light' : 'dark'));
if(themeToggleBtnMobile) {
    themeToggleBtnMobile.addEventListener('click', () => {
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
        toggleMenu();
    });
}
if(bookReaderCloseBtn) {
    bookReaderCloseBtn.addEventListener('click', () => {
        bookReaderModal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    });
}

// Rewire existing cards to modal reader behavior.
const bookCards = document.querySelectorAll('.book-card');
if(bookCards.length > 0) {
    bookCards.forEach((card, idx) => {
        const map = [
            { id: 'gita', title: 'Bhagavad Gita' },
            { id: 'upanishads', title: 'Upanishads' },
            { id: 'yoga', title: 'Patanjali Yoga Sutra' }
        ];
        const item = map[idx];
        if (!item) return;
        card.setAttribute('href', '#');
        card.addEventListener('click', (e) => {
            e.preventDefault();
            openBookReader(item.id, item.title);
        });
    });
}

setLanguage(currentLanguage);
setTheme(currentTheme);

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    if (window.scrollY > 50) {
        if (document.body.classList.contains('light-theme')) {
            nav.classList.add('bg-[#fffbf0]/90', 'backdrop-blur-xl', 'py-3', 'border-[#d4af37]/40');
            nav.classList.remove('bg-black/80', 'border-white/10');
        } else {
            nav.classList.add('bg-black/80', 'backdrop-blur-xl', 'py-3', 'border-white/10');
            nav.classList.remove('bg-[#fffbf0]/90', 'border-[#d4af37]/40');
        }
        nav.classList.remove('py-4', 'border-transparent');
    } else {
        nav.classList.remove('bg-black/80', 'bg-[#fffbf0]/90', 'backdrop-blur-xl', 'py-3', 'border-white/10', 'border-[#d4af37]/40');
        nav.classList.add('py-4', 'border-transparent');
    }
});

// Intersection Observer for Reveal Effects
const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

function checkScroll() {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
        revealObserver.observe(el);
    });
}

// Initialize global variables for Chakra 3D rotation
let chakraRotation = 0;
let lastScrollY = window.scrollY || 0;

// Parallax and Chakra Rotation Effect
window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    const parallaxes = document.querySelectorAll('.parallax');
    parallaxes.forEach(item => {
        const speed = item.getAttribute('data-speed');
        const yPos = -(currentScrollY * speed);
        item.style.transform = `translateY(${yPos}px)`;
    });

    // Chakra Rotation
    const chakra = document.getElementById('chakra-bg');
    if (chakra) {
        const deltaY = currentScrollY - lastScrollY;
        
        // Dynamic speed multiplier based on scroll speed
        const scrollSpeed = Math.abs(deltaY);
        const dynamicMultiplier = 1 + (scrollSpeed * 0.02);
        
        // Base rotation factor scaled by scroll speed and direction
        const rotationDelta = deltaY * 0.15 * dynamicMultiplier;
        chakraRotation += rotationDelta;
        
        chakra.style.transform = `rotate(${chakraRotation}deg)`;
        
        lastScrollY = currentScrollY;
    }
});

// Onboarding Modal
const onboardingModal = document.getElementById('onboarding-modal');
if (onboardingModal) {
    if (!localStorage.getItem('dhrm_focus')) {
        onboardingModal.classList.remove('hidden');
        document.querySelectorAll('.onboard-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const focus = e.currentTarget.getAttribute('data-focus');
                localStorage.setItem('dhrm_focus', focus);
                if (currentUser && db) {
                    try {
                        await db.collection('users').doc(currentUser.uid).set({ focus: focus }, { merge: true });
                    } catch (err) {
                        console.error("Error setting focus in Firestore:", err);
                    }
                }
                onboardingModal.classList.add('hidden');
            });
        });
    }
}

// Moksha Log (Journal)
async function saveToJournal(text, type = 'Reflection') {
    const entry = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        text: text,
        type: type
    };

    if (currentUser && db) {
        try {
            await db.collection('users').doc(currentUser.uid).collection('journal').doc(String(entry.id)).set(entry);
        } catch (e) {
            console.error("Firestore Save Error:", e);
        }
    } else {
        let entries = JSON.parse(localStorage.getItem('dhrm_journal') || '[]');
        entries.push(entry);
        localStorage.setItem('dhrm_journal', JSON.stringify(entries));
    }
    
    if (typeof renderJournal === 'function') renderJournal();
}

const journalEntriesContainer = document.getElementById('journal-entries');
if (journalEntriesContainer) {
    async function renderJournal() {
        let entries = [];
        if (currentUser && db) {
            try {
                const snapshot = await db.collection('users').doc(currentUser.uid).collection('journal').orderBy('id', 'desc').get();
                snapshot.forEach(doc => {
                    entries.push(doc.data());
                });
            } catch (e) {
                console.error("Firestore Read Error:", e);
                entries = JSON.parse(localStorage.getItem('dhrm_journal') || '[]');
                entries.reverse();
            }
        } else {
            entries = JSON.parse(localStorage.getItem('dhrm_journal') || '[]');
            entries.reverse();
        }

        if (entries.length === 0) {
            journalEntriesContainer.innerHTML = '<p class="text-center text-gray-500 italic">Your Moksha Log is empty. Save insights from the chat or complete your Daily Karm to begin.</p>';
            return;
        }
        
        journalEntriesContainer.innerHTML = entries.map(entry => `
            <div class="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#d4af37]/30 transition-colors">
                <div class="flex justify-between items-center mb-3">
                    <span class="text-xs font-bold uppercase tracking-wider text-[#d4af37]">${entry.type}</span>
                    <span class="text-xs text-gray-500">${entry.date}</span>
                </div>
                <p class="text-gray-300 leading-relaxed">${entry.text}</p>
                <button onclick="deleteJournalEntry(${entry.id})" class="mt-4 text-xs text-red-400 hover:text-red-300 transition-colors">Delete</button>
            </div>
        `).join('');
    }
    window.renderJournal = renderJournal;
    renderJournal();
    
    window.deleteJournalEntry = async function(id) {
        if (currentUser && db) {
            try {
                await db.collection('users').doc(currentUser.uid).collection('journal').doc(String(id)).delete();
            } catch (e) {
                console.error("Firestore Delete Error:", e);
            }
        } else {
            let entries = JSON.parse(localStorage.getItem('dhrm_journal') || '[]');
            entries = entries.filter(e => e.id !== id);
            localStorage.setItem('dhrm_journal', JSON.stringify(entries));
        }
        renderJournal();
    };
}

// Update addMessageToChat to include a Save button for DHRM messages
window.addMessageToChat = function(textOrData, sender, citation) {
    if (!chatMessages) return;
    const wrapper = document.createElement('div');
    wrapper.className = `${sender === 'user' ? 'flex justify-end' : 'flex justify-start'} chat-message-fade`;
    const bubble = document.createElement('div');
    bubble.className = `${sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-dhrm'} rounded-2xl p-5 max-w-[85%] relative group`;
    
    let html = '';
    let saveText = '';
    let speakTextStr = '';

    if (sender === 'user') {
        html = typeof textOrData === 'string' ? textOrData : textOrData.text;
    } else {
        if (typeof textOrData === 'object' && textOrData.solution) {
            html = `
                <div class="dhrm-solution mb-3">${textOrData.solution}</div>
                <div class="dhrm-shlok text-xl md:text-2xl font-bold my-5 text-center font-serif leading-relaxed tracking-wide">${textOrData.shlok}</div>
                <div class="dhrm-reference text-[11px] font-bold text-center tracking-widest uppercase mb-4">${textOrData.reference}</div>
                <div class="dhrm-explanation leading-relaxed" style="font-family: 'Mangal', 'Arial Unicode MS', sans-serif;">${textOrData.explanation}</div>
            `;
            saveText = `${textOrData.solution} | ${textOrData.shlok} - ${textOrData.reference}`;
            speakTextStr = textOrData.solution;
        } else {
            // Fallback for string messages
            html = citation ? `<div class="dhrm-solution">${textOrData}</div><div class="dhrm-reference mt-2 text-[11px] font-bold">${citation}</div>` : `<div class="dhrm-solution">${textOrData}</div>`;
            saveText = textOrData;
            speakTextStr = textOrData;
        }

        // Add save to journal button
        const safeSaveText = saveText.replace(/"/g, '&quot;').replace(/'/g, "\\'");
        const saveBtn = `<button class="absolute -right-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 hover:text-[#d4af37]" title="Save to Moksha Log" onclick="saveToJournal(\`${safeSaveText}\`)">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
        </button>`;
        html += saveBtn;
        
        // Speak if enabled
        if (voiceEnabled) {
            speakText(speakTextStr);
        }
    }
    
    bubble.innerHTML = html;
    wrapper.appendChild(bubble);
    chatMessages.appendChild(wrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Voice Interface (Mantra Mode)
let voiceEnabled = false;
const speakerBtn = document.getElementById('speaker-btn');
if (speakerBtn) {
    speakerBtn.addEventListener('click', () => {
        voiceEnabled = !voiceEnabled;
        speakerBtn.innerHTML = voiceEnabled ? '🔊' : '🔇';
        speakerBtn.classList.toggle('text-[#d4af37]', voiceEnabled);
        if (!voiceEnabled) window.speechSynthesis.cancel();
    });
}

function speakText(text) {
    if (!('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    // Optional: Try to find a good voice
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(v => v.lang.includes('hi'));
    if (currentLanguage === 'hi' && hindiVoice) utterance.voice = hindiVoice;
    window.speechSynthesis.speak(utterance);
}

const micBtn = document.getElementById('mic-btn');
if (micBtn && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    micBtn.addEventListener('click', () => {
        recognition.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
        recognition.start();
        micBtn.classList.add('bg-red-500/50', 'animate-pulse');
    });
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (chatInput) chatInput.value = transcript;
        micBtn.classList.remove('bg-red-500/50', 'animate-pulse');
        // Auto submit
        if(chatForm) chatForm.dispatchEvent(new Event('submit'));
    };
    
    recognition.onerror = () => {
        micBtn.classList.remove('bg-red-500/50', 'animate-pulse');
    };
    recognition.onend = () => {
        micBtn.classList.remove('bg-red-500/50', 'animate-pulse');
    };
} else if (micBtn) {
    micBtn.style.display = 'none'; // hide if not supported
}

// Daily Karm - Save to Journal
const karmButtons = document.querySelectorAll('.karm-btn'); 
if (karmButtons.length > 0) {
    document.querySelectorAll('button').forEach(btn => {
        if (btn.textContent.includes('Mark Complete') || btn.textContent.includes('Complete')) {
            btn.addEventListener('click', (e) => {
                const taskCard = e.target.closest('.glass-card');
                if (taskCard) {
                    const taskTitle = taskCard.querySelector('h3').textContent;
                    saveToJournal(`Completed Task: ${taskTitle}`, 'Daily Karm');
                    btn.textContent = "Completed ✓";
                    btn.classList.add('opacity-50', 'cursor-not-allowed');
                    btn.disabled = true;
                }
            });
        }
    });
}

// Shanti Room Timers
document.querySelectorAll('button').forEach(btn => {
    if (btn.textContent.includes('Play')) {
        const titleEl = btn.parentElement.querySelector('h3');
        if (titleEl && titleEl.textContent.includes('Min')) {
            btn.addEventListener('click', (e) => {
                if (btn.disabled) return;
                
                // Extract minutes from title
                const mins = parseInt(titleEl.textContent);
                if (isNaN(mins)) return;
                
                btn.disabled = true;
                btn.classList.add('bg-[#d4af37]/20', 'text-[#d4af37]');
                
                let timeLeft = mins * 60;
                const updateTimer = () => {
                    const m = Math.floor(timeLeft / 60);
                    const s = timeLeft % 60;
                    btn.textContent = `${m}:${s.toString().padStart(2, '0')}`;
                    
                    if (timeLeft > 0) {
                        timeLeft--;
                        setTimeout(updateTimer, 1000);
                    } else {
                        btn.textContent = "Complete ✓";
                        saveToJournal(`Completed ${mins} Minute Meditation`, 'Meditation');
                    }
                };
                updateTimer();
            });
        }
    }
});

// -------------------------------------
// FIREBASE AUTH & FIREBASE SYNC LOGIC
// -------------------------------------

// Listen for Auth changes
if (auth) {
    auth.onAuthStateChanged((user) => {
        currentUser = user;
        updateAuthUI();
        if (user) {
            syncGuestLogsToCloud();
            if (typeof renderJournal === 'function') renderJournal();
            loadPreviousChatsList();
            
            // Sync user focus if local storage has one
            const localFocus = localStorage.getItem('dhrm_focus');
            if (localFocus && db) {
                db.collection('users').doc(user.uid).set({ focus: localFocus }, { merge: true })
                  .catch(e => console.error("Error syncing focus on login:", e));
            }
        } else {
            if (typeof renderJournal === 'function') renderJournal();
            if (document.getElementById('previous-chats-list')) {
                document.getElementById('previous-chats-list').innerHTML = 
                    '<div class="text-xs text-gray-500 italic p-3 text-center">Login to save and view previous chats.</div>';
            }
        }
    });
}

function updateAuthUI() {
    const loginBtn = document.getElementById('login-btn');
    if (!loginBtn) return;
    
    if (currentUser) {
        const photoURL = currentUser.photoURL || '';
        const name = currentUser.displayName || 'Seeker';
        loginBtn.innerHTML = `
            <div class="flex items-center gap-2 cursor-pointer group relative">
                ${photoURL ? `<img src="${photoURL}" class="w-6 h-6 rounded-full border border-[#d4af37]/50" />` : `<div class="w-6 h-6 rounded-full bg-[#d4af37] text-black flex items-center justify-center font-bold text-[10px]">${name[0]}</div>`}
                <span class="text-xs font-semibold max-w-[80px] truncate">${name}</span>
                <div class="absolute right-0 top-full mt-2 w-28 bg-[#05070a]/95 border border-white/10 rounded-xl py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto shadow-xl z-50">
                    <button onclick="handleLogout()" class="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-white/5 transition-colors">Logout</button>
                </div>
            </div>
        `;
        loginBtn.onclick = null;
    } else {
        loginBtn.innerHTML = 'Login';
        loginBtn.onclick = handleLogin;
    }
}

async function handleLogin() {
    if (!auth) {
        alert("Firebase Auth SDK is not loaded.");
        return;
    }
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        await auth.signInWithPopup(provider);
    } catch (e) {
        console.error("Login failed:", e);
        alert("Google Sign-In failed. Please try again.");
    }
}

async function handleLogout() {
    if (!auth) return;
    try {
        await auth.signOut();
        currentUser = null;
        currentSessionId = null;
        if (chatMessages) {
            chatMessages.innerHTML = `
                <div class="chat-bubble-dhrm rounded-2xl p-5 max-w-[85%] self-start chat-message-fade">
                    Namaste. I am the Divine Helper. Ask what is on your mind. You can start with stress, purpose, fear, or work.
                </div>
            `;
        }
    } catch (e) {
        console.error("Logout failed:", e);
    }
}
window.handleLogout = handleLogout;
window.handleLogin = handleLogin;

async function syncGuestLogsToCloud() {
    if (!currentUser || !db) return;
    const guestJournal = JSON.parse(localStorage.getItem('dhrm_journal') || '[]');
    if (guestJournal.length === 0) return;
    
    try {
        const batch = db.batch();
        guestJournal.forEach(entry => {
            const ref = db.collection('users').doc(currentUser.uid).collection('journal').doc(String(entry.id));
            batch.set(ref, entry);
        });
        await batch.commit();
        localStorage.removeItem('dhrm_journal');
        console.log("Guest logs synced to Firestore.");
    } catch (e) {
        console.error("Error syncing guest logs:", e);
    }
}

// Chat Sessions & Previous Chats Sidebar logic
const previousChatsList = document.getElementById('previous-chats-list');
const newChatBtn = document.getElementById('new-chat-btn');

if (newChatBtn) {
    newChatBtn.addEventListener('click', () => {
        startNewChatSession();
    });
}

function startNewChatSession() {
    currentSessionId = 'session_' + Date.now();
    if (chatMessages) {
        chatMessages.innerHTML = `
            <div class="chat-bubble-dhrm rounded-2xl p-5 max-w-[85%] self-start chat-message-fade">
                Namaste. I am the Divine Helper. Ask what is on your mind. You can start with stress, purpose, fear, or work.
            </div>
        `;
    }
    highlightActiveSession(currentSessionId);
}

async function loadPreviousChatsList() {
    if (!previousChatsList || !currentUser || !db) return;
    try {
        const snapshot = await db.collection('users').doc(currentUser.uid).collection('sessions').orderBy('timestamp', 'desc').get();
        if (snapshot.empty) {
            previousChatsList.innerHTML = '<div class="text-xs text-gray-500 italic p-3 text-center">No previous chats. Start a new one!</div>';
            return;
        }
        
        let html = '';
        snapshot.forEach(doc => {
            const session = doc.data();
            const dateStr = session.timestamp ? new Date(session.timestamp.toDate()).toLocaleDateString() : '';
            html += `
                <button onclick="loadChatSession('${doc.id}')" id="session-btn-${doc.id}" class="w-full text-left p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all text-xs flex flex-col gap-1 text-gray-300">
                    <span class="font-bold truncate text-white">${session.title || 'Untitled Session'}</span>
                    <span class="text-[10px] text-gray-500">${dateStr}</span>
                </button>
            `;
        });
        previousChatsList.innerHTML = html;
        if (currentSessionId) highlightActiveSession(currentSessionId);
    } catch (e) {
        console.error("Firestore Read Sessions Error:", e);
    }
}

window.loadChatSession = async function(sessionId) {
    if (!db || !currentUser || !chatMessages) return;
    currentSessionId = sessionId;
    highlightActiveSession(sessionId);
    
    chatMessages.innerHTML = '<div class="text-center text-xs text-gray-500 italic p-6">Loading conversation...</div>';
    
    try {
        const snapshot = await db.collection('users').doc(currentUser.uid).collection('sessions').doc(sessionId).collection('messages').orderBy('timestamp', 'asc').get();
        chatMessages.innerHTML = '';
        if (snapshot.empty) {
            chatMessages.innerHTML = `
                <div class="chat-bubble-dhrm rounded-2xl p-5 max-w-[85%] self-start chat-message-fade">
                    This session has no messages. Ask something to begin.
                </div>
            `;
            return;
        }
        
        snapshot.forEach(doc => {
            const msg = doc.data();
            if (msg.sender === 'user') {
                addMessageToChat(msg.text, 'user');
            } else {
                addMessageToChat(msg.data || msg.text, 'dhrm', msg.citation);
            }
        });
    } catch (e) {
        console.error("Firestore Load Messages Error:", e);
        chatMessages.innerHTML = '<div class="text-center text-xs text-red-400 p-6">Failed to load conversation history.</div>';
    }
};

function highlightActiveSession(sessionId) {
    if (!previousChatsList) return;
    previousChatsList.querySelectorAll('button').forEach(btn => {
        btn.classList.remove('bg-white/10', 'border-[#d4af37]/40', 'text-white');
        btn.classList.add('text-gray-300');
    });
    const activeBtn = document.getElementById(`session-btn-${sessionId}`);
    if (activeBtn) {
        activeBtn.classList.add('bg-white/10', 'border-[#d4af37]/40', 'text-white');
        activeBtn.classList.remove('text-gray-300');
    }
}

async function saveMessageToFirestore(sessionId, messageObj) {
    if (!currentUser || !db) return;
    try {
        const sessionRef = db.collection('users').doc(currentUser.uid).collection('sessions').doc(sessionId);
        const sessionDoc = await sessionRef.get();
        if (!sessionDoc.exists) {
            let title = 'New Conversation';
            if (messageObj.sender === 'user') {
                title = messageObj.text.length > 25 ? messageObj.text.substring(0, 25) + '...' : messageObj.text;
            }
            await sessionRef.set({
                title: title,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            loadPreviousChatsList();
        }
        await sessionRef.collection('messages').add(messageObj);
    } catch (e) {
        console.error("Error saving message to Firestore:", e);
    }
}
