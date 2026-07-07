import os

HTML_FILES = ['index.html', 'chat.html', 'philosophy.html', 'shanti.html', 'karm.html']

# 1. Update Navigation Bar to include Journal
def update_nav():
    nav_item = '<a href="journal.html" class="hover:text-[#d4af37] transition-colors">Journal</a>'
    for file in HTML_FILES:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if 'journal.html' not in content:
            # find Daily Karm link and insert after
            search_str = '<a href="karm.html" class="hover:text-[#d4af37] transition-colors">Daily Karm</a>'
            replace_str = search_str + '\n            ' + nav_item
            content = content.replace(search_str, replace_str)
            with open(file, 'w', encoding='utf-8') as f:
                f.write(content)

# 2. Add Voice UI to Chat.html
def update_chat():
    with open('chat.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'id="mic-btn"' not in content:
        # Update chat form with mic and speaker toggles
        old_form = """<form id="chat-form" class="mt-6 flex gap-4">
                    <input id="chat-input" type="text" class="flex-1 bg-black/50 border border-white/10 rounded-full px-6 py-4 text-base outline-none focus:border-[#d4af37]/60" placeholder="Type your question..." />
                    <button type="submit" class="gold-btn px-8 py-4 rounded-full text-base font-bold">Send</button>
                </form>"""
        new_form = """<form id="chat-form" class="mt-6 flex gap-4 items-center">
                    <button type="button" id="speaker-btn" class="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#d4af37]/20 transition-colors text-xl shrink-0" title="Toggle Voice Output">🔊</button>
                    <div class="relative flex-1 flex items-center">
                        <input id="chat-input" type="text" class="w-full bg-black/50 border border-white/10 rounded-full pl-6 pr-14 py-4 text-base outline-none focus:border-[#d4af37]/60" placeholder="Type your question..." />
                        <button type="button" id="mic-btn" class="absolute right-2 w-10 h-10 rounded-full bg-white/5 hover:bg-[#d4af37]/20 flex items-center justify-center transition-colors text-lg" title="Voice Input">🎤</button>
                    </div>
                    <button type="submit" class="gold-btn px-8 py-4 rounded-full text-base font-bold shrink-0">Send</button>
                </form>"""
        content = content.replace(old_form, new_form)
        with open('chat.html', 'w', encoding='utf-8') as f:
            f.write(content)

# 3. Create Journal.html
def create_journal():
    with open('index.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    start_marker = "<!-- Hero Section -->"
    end_marker = "<!-- Book Reader Modal -->"
    start_idx = content.find(start_marker)
    end_idx = content.find(end_marker)
    
    journal_content = """<!-- Journal Section -->
    <section class="py-32 px-6 min-h-[80vh] flex flex-col justify-center mt-16">
        <div class="max-w-4xl mx-auto w-full">
            <div class="reveal glass-card rounded-[40px] p-8 md:p-12 relative overflow-hidden text-center">
                <div class="text-5xl mb-6 animate-float">📝</div>
                <h3 class="text-4xl md:text-5xl font-extrabold mb-4 text-gradient">Moksha Log</h3>
                <p class="text-gray-400 text-lg mb-10">Your spiritual reflections and completed Karm.</p>
                <div id="journal-entries" class="space-y-6 text-left max-h-[60vh] overflow-y-auto chat-scroll pr-4">
                    <!-- Dynamic entries will appear here -->
                </div>
            </div>
        </div>
    </section>"""
    
    new_html = content[:start_idx] + journal_content + "\n\n    " + content[end_idx:]
    # Replace navbar in journal.html since it was created from index.html which may not have the updated nav if they run out of order
    search_str = '<a href="karm.html" class="hover:text-[#d4af37] transition-colors">Daily Karm</a>'
    nav_item = '<a href="journal.html" class="hover:text-[#d4af37] transition-colors">Journal</a>'
    if 'journal.html' not in new_html:
         new_html = new_html.replace(search_str, search_str + '\n            ' + nav_item)
         
    with open('journal.html', 'w', encoding='utf-8') as f:
        f.write(new_html)

update_nav()
update_chat()
create_journal()
print("HTML setup completed.")
