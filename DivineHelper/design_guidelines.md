# DHRM (Divine Helper, Reclaiming Moksha) Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from spiritual wellness apps like Calm and Headspace, combined with traditional Hindu visual language. Creating a serene, culturally-rooted interface that balances modern UX patterns with spiritual reverence.

## Core Design Principles
1. **Sacred Minimalism**: Clean layouts that evoke temple architecture's tranquility
2. **Cultural Authenticity**: Genuine Hindu aesthetic without stereotypical kitsch
3. **Gentle Interactivity**: Smooth, respectful animations that enhance without distracting
4. **Bilingual Harmony**: Seamless English/Hindi integration with appropriate typography

## Color Palette
- **Primary Saffron**: `#FF9933` - CTAs, active states, energy
- **Sacred Gold**: `#DAA520` - accents, highlights, divine elements
- **Deep Maroon**: `#800020` - headers, emphasis, grounding
- **Peacock Blue**: `#1E90FF` - meditation elements, calm sections
- **Cream Background**: `#FFF8DC` - main backgrounds, cards
- **White**: Pure white for text containers and contrast

## Typography
- **Headings**: Playfair Display (serif, elegant) - resembles Devanagari script's grace
- **Body Text**: Inter (clean, highly readable for English/Hindi)
- **Sanskrit Shlokas**: Noto Serif Devanagari (authentic, readable)
- **Hierarchy**: h1 (text-4xl), h2 (text-3xl), h3 (text-2xl), body (text-base), small (text-sm)

## Layout System
**Tailwind Spacing Units**: Consistent use of 4, 6, 8, 12, 16, 20 for rhythmic spacing
- **Page Padding**: px-4 md:px-8 lg:px-16, py-8 md:py-12
- **Component Spacing**: gap-6 for grids, space-y-4 for vertical stacks
- **Card Padding**: p-6 md:p-8

## Navigation
**Top Navigation Bar**:
- Fixed header with subtle shadow
- Logo on left (lotus symbol + "DHRM" text)
- Navigation links centered (Home, Divya Drishti, DHRM Chat, Dhyan, Karm, Books, About)
- Language toggle (EN/हिं) and user trophy badge on right
- Mobile: Hamburger menu with slide-in drawer

## Interactive Animations
- **Hover Effects**: 
  - Cards: scale-105 transition with subtle shadow increase
  - Buttons: brightness shift with smooth transitions
  - Links: underline animation from left to right
- **Cursor Interactions**: Custom cursor trail effect (subtle particle trail in saffron/gold)
- **Page Transitions**: Fade-in on mount (0.3s duration)
- **Micro-interactions**: Button press springs, checkbox checkmarks animate, streak flames flicker

## Component Library

### Home Page
- **Hero Section**: Full-width with gradient background (cream to soft saffron), centered content
- **Welcoming Message**: Large Sanskrit greeting with translation below
- **Feature Cards Grid**: 3-column (desktop), showcasing main features with icons
- **Daily Inspiration**: Featured quote card with decorative borders

### Divya Drishti Page
- **Quote Display Card**: Large centered card (max-w-2xl), ornamental borders in gold
- **Quote Text**: Larger serif font with shadow
- **"New Drishti" Button**: Prominent saffron button with lotus icon
- **Background**: Subtle mandala pattern overlay (low opacity)

### DHRM Chat Page
- **Chat Container**: Full height, split design
- **Message Bubbles**: User (peacock blue, right-aligned), AI (cream with maroon border, left-aligned)
- **Sanskrit Shloka Display**: Distinct card within AI responses - gold border, Devanagari font, translation below, citation in small italic text
- **Input Area**: Bottom-fixed with send button, auto-expanding textarea

### Dhyan (Meditation) Page
- **Timer Selection**: Horizontal pill buttons (5min, 10min, 15min, 30min, 45min, 1hr) - active state in peacock blue
- **Timer Display**: Huge circular countdown (text-6xl) in center
- **Controls**: Play/Pause/Reset buttons below timer with clear icons
- **Motivational Text**: Rotating quotes appear below controls during meditation
- **Audio Indicator**: Subtle wave animation when music plays
- **Background**: Gradient from peacock blue to deep purple

### Karm (Daily Tasks) Page
- **Streak Bar**: Horizontal progress bar at top showing consecutive days, flame icon at end
- **Trophy Badge**: Display next to username in header when active
- **Task List**: Checkboxes with task descriptions, completion animations
- **Daily Reset Timer**: Small countdown showing time until tasks reset
- **Add Task Input**: Bottom-fixed input with "+" button

### Books Page
- **Book Grid**: 3-column card layout with book covers (decorative placeholders)
- **Book Cards**: Hover lift effect, title and description
- **Modal Viewer**: Full-screen overlay with close button, scrollable text content, cream background
- **Typography**: Larger line-height for comfortable reading

### Contact/About Us Page
- **Form Layout**: Single column, centered (max-w-lg)
- **Input Fields**: Bordered with focus states in saffron
- **Submit Button**: Full-width, prominent
- **Success Message**: Animated checkmark with fade-in

## Images
**Hero Image**: Large background image on Home page - serene Hindu temple or meditation scene (sunrise/golden hour lighting), with content overlayed using semi-transparent cream card with backdrop-blur
**Divya Drishti**: Background pattern of lotus flowers or mandalas (subtle, low opacity)
**Books Page**: Decorative book cover images (traditional Hindu scripture aesthetics)
**About Page**: Team/mission image showing peaceful meditation or temple setting

## Responsive Breakpoints
- **Mobile**: Single column, stacked navigation, larger touch targets
- **Tablet (md)**: 2-column grids, expanded navigation
- **Desktop (lg)**: 3-column grids, full feature set

## Accessibility
- High contrast ratios maintained across color combinations
- Focus states clearly visible (ring-2 ring-saffron)
- ARIA labels for icon buttons
- Keyboard navigation support throughout