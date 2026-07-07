import os

# 1. Add Onboarding Modal to index.html
def update_index():
    with open('index.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'id="onboarding-modal"' not in content:
        modal_html = """
    <!-- Onboarding Modal -->
    <div id="onboarding-modal" class="fixed inset-0 z-[80] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 hidden">
        <div class="max-w-md w-full bg-zinc-900 border border-white/10 rounded-[32px] p-8 md:p-10 text-center shadow-2xl relative overflow-hidden">
            <div class="absolute -top-32 -left-32 w-64 h-64 bg-[#d4af37] opacity-20 rounded-full blur-[80px]"></div>
            <h2 class="text-3xl font-bold mb-2">What seek ye?</h2>
            <p class="text-gray-400 mb-8">Let the Divine Helper guide your path today.</p>
            <div class="grid grid-cols-2 gap-4">
                <button class="onboard-btn glass-card p-4 rounded-2xl hover:border-[#d4af37]/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#d4af37]" data-focus="Peace">
                    <span class="text-2xl mb-2 block">🕊️</span> Peace
                </button>
                <button class="onboard-btn glass-card p-4 rounded-2xl hover:border-[#d4af37]/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#d4af37]" data-focus="Purpose">
                    <span class="text-2xl mb-2 block">🎯</span> Purpose
                </button>
                <button class="onboard-btn glass-card p-4 rounded-2xl hover:border-[#d4af37]/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#d4af37]" data-focus="Clarity">
                    <span class="text-2xl mb-2 block">👁️</span> Clarity
                </button>
                <button class="onboard-btn glass-card p-4 rounded-2xl hover:border-[#d4af37]/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#d4af37]" data-focus="Healing">
                    <span class="text-2xl mb-2 block">🌿</span> Healing
                </button>
            </div>
        </div>
    </div>
"""
        # Insert before closing body tag
        content = content.replace("</body>", modal_html + "\n</body>")
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(content)

# 2. Add "Save to Journal" button HTML to chat logic in script.js, plus TTS/STT, Timers, Journal rendering
def update_script():
    with open('script.js', 'r', encoding='utf-8') as f:
        content = f.read()

    # The API call prompt
    old_prompt = r"""const prompt = `You are the "Divine Helper" (DHRM), an AI assistant grounded in ancient Vedic wisdom (Bhagavad Gita, Upanishads, Patanjali Yoga Sutra).
The user will ask for advice or share a struggle.
Provide a concise, compassionate, and reflective answer (max 3 sentences).
End your answer with a citation to a specific verse or concept from the Vedic texts.
Format your response exactly like this:
[Your answer text here]
CITATION: [Book, Chapter X, Verse Y]

User says: "${message}"`;"""

    new_prompt = r"""const userFocus = localStorage.getItem('dhrm_focus') || 'general wisdom';
    const prompt = `You are the "Divine Helper" (DHRM), an AI assistant grounded in ancient Vedic wisdom (Bhagavad Gita, Upanishads, Patanjali Yoga Sutra).
The user has indicated they are currently seeking: ${userFocus}.
The user will ask for advice or share a struggle.
Provide a concise, compassionate, and reflective answer (max 3 sentences).
End your answer with a citation to a specific verse or concept from the Vedic texts.
Format your response exactly like this:
[Your answer text here]
CITATION: [Book, Chapter X, Verse Y]

User says: "${message}"`;"""

    content = content.replace(old_prompt, new_prompt)

    # Adding Journal & Voice & Timer Logic
    new_logic = """
// -------------------------------------
// NEW FEATURES: Journal, Voice, Timers
// -------------------------------------

// Onboarding Modal
const onboardingModal = document.getElementById('onboarding-modal');
if (onboardingModal) {
    if (!localStorage.getItem('dhrm_focus')) {
        onboardingModal.classList.remove('hidden');
        document.querySelectorAll('.onboard-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const focus = e.currentTarget.getAttribute('data-focus');
                localStorage.setItem('dhrm_focus', focus);
                onboardingModal.classList.add('hidden');
            });
        });
    }
}

// Moksha Log (Journal)
function saveToJournal(text, type = 'Reflection') {
    let entries = JSON.parse(localStorage.getItem('dhrm_journal') || '[]');
    entries.push({
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        text: text,
        type: type
    });
    localStorage.setItem('dhrm_journal', JSON.stringify(entries));
    // Optional feedback toast could go here
}

const journalEntriesContainer = document.getElementById('journal-entries');
if (journalEntriesContainer) {
    function renderJournal() {
        const entries = JSON.parse(localStorage.getItem('dhrm_journal') || '[]');
        if (entries.length === 0) {
            journalEntriesContainer.innerHTML = '<p class="text-center text-gray-500 italic">Your Moksha Log is empty. Save insights from the chat or complete your Daily Karm to begin.</p>';
            return;
        }
        journalEntriesContainer.innerHTML = entries.reverse().map(entry => `
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
    renderJournal();
    
    window.deleteJournalEntry = function(id) {
        let entries = JSON.parse(localStorage.getItem('dhrm_journal') || '[]');
        entries = entries.filter(e => e.id !== id);
        localStorage.setItem('dhrm_journal', JSON.stringify(entries));
        renderJournal();
    };
}

// Update addMessageToChat to include a Save button for DHRM messages
window.addMessageToChat = function(text, sender, citation) {
    if (!chatMessages) return;
    const wrapper = document.createElement('div');
    wrapper.className = sender === 'user' ? 'flex justify-end' : 'flex justify-start';
    const bubble = document.createElement('div');
    bubble.className = `${sender === 'user' ? 'chat-bubble-user text-black' : 'chat-bubble-dhrm'} rounded-2xl p-5 max-w-[85%] relative group`;
    
    let html = citation ? `${text}<div class="mt-2 text-[11px] text-[#d4af37] font-bold">${citation}</div>` : text;
    
    if (sender === 'dhrm') {
        // Add save to journal button
        const saveBtn = `<button class="absolute -right-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 hover:text-[#d4af37]" title="Save to Moksha Log" onclick="saveToJournal(\\`${text.replace(/"/g, '&quot;').replace(/'/g, "\\\\'")}\\`)">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
        </button>`;
        html += saveBtn;
        
        // Speak if enabled
        if (voiceEnabled) {
            speakText(text);
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
const karmButtons = document.querySelectorAll('.karm-btn'); // Assuming we add this class or modify existing buttons
if (karmButtons.length > 0) {
    // Actually, karm buttons in karm.html don't have a specific class, they are just buttons. 
    // Let's target them by their onclick or content.
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
                        // Audio removed as requested
                    }
                };
                updateTimer();
            });
        }
    }
});

"""
    # Append the new logic to the end of the script
    if "// NEW FEATURES" not in content:
        # We also need to remove the old addMessageToChat so it doesn't conflict
        old_add_message = """function addMessageToChat(text, sender, citation) {
    if (!chatMessages) return;
    const wrapper = document.createElement('div');
    wrapper.className = sender === 'user' ? 'flex justify-end' : 'flex justify-start';
    const bubble = document.createElement('div');
    bubble.className = `${sender === 'user' ? 'chat-bubble-user text-black' : 'chat-bubble-dhrm'} rounded-2xl p-5 max-w-[85%]"`;
    bubble.innerHTML = citation ? `${text}<div class="mt-2 text-[11px] text-[#d4af37] font-bold">${citation}</div>` : text;
    wrapper.appendChild(bubble);
    chatMessages.appendChild(wrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}"""
        content = content.replace(old_add_message, "")
        content += "\n" + new_logic
        with open('script.js', 'w', encoding='utf-8') as f:
            f.write(content)

update_index()
update_script()
print("JS features setup completed.")
