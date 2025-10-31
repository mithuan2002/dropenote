# Design Guidelines: Influencer Coupon Campaign PWA

## Design Approach

**Selected Approach:** Utility-First Design System inspired by productivity tools (Linear, Notion) with Stripe's trust-building clarity

**Rationale:** This MVP prioritizes speed, reliability, and clarity across three distinct user flows. Store staff need instant verification at checkout, followers need confidence when sharing their WhatsApp number, and influencers need clear campaign performance data. The design must work flawlessly on mobile devices in real-world retail environments.

## Core Design Principles

1. **Speed First:** Every interaction optimized for mobile touch targets and quick task completion
2. **Role Clarity:** Distinct visual hierarchy for each user type while maintaining brand cohesion
3. **Trust Through Simplicity:** Clean, professional interface builds confidence in the coupon system
4. **Offline Resilience:** Visual feedback for PWA offline capabilities

## Typography

**Font Families:**
- Primary: Inter (Google Fonts) - Clean, readable at all sizes, excellent for data display
- Monospace: JetBrains Mono - For coupon codes (increases scannability and distinction)

**Type Scale:**
- Display (Campaign names): text-3xl font-bold (influencer portal)
- Headings: text-2xl font-semibold (portal titles)
- Subheadings: text-xl font-medium (section headers)
- Body: text-base font-normal (forms, descriptions)
- Captions: text-sm font-medium (labels, metadata)
- Coupon Codes: text-4xl font-mono font-bold tracking-wider (high emphasis)

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, and 12 consistently
- Micro spacing: p-2, gap-2 (tight groupings)
- Standard spacing: p-4, gap-4, mb-6 (form elements, cards)
- Section spacing: py-8, px-4 (mobile containers)
- Large spacing: py-12 (desktop section breaks)

**Grid System:**
- Mobile: Single column, full-width with px-4 container padding
- Desktop: max-w-4xl centered containers for all portals
- Cards/Analytics: grid-cols-1 md:grid-cols-2 for metrics display

## Component Library

### Navigation & Role Selection
**Homepage Portal Selector:**
- Three large touch-friendly cards (min-h-32) in vertical stack on mobile
- Each card shows icon, role title, and one-line description
- Active state: subtle elevation and border accent

**Portal Headers:**
- Fixed top bar with role identifier and logout
- Height: h-16 with centered title
- Minimal, non-distracting

### Forms (Critical Component)
**Follower Coupon Request Form:**
- Single-page form with 2 inputs: Name (text) and WhatsApp Number (tel)
- Input fields: h-12 with p-4, rounded-lg borders
- Labels: text-sm mb-2 above each field
- Submit button: w-full h-12 rounded-lg with clear CTA text
- Validation: Inline error messages in text-sm below fields

**Store Staff Verification Form:**
- Large coupon code input: h-16 text-center with monospace font
- Immediate validation feedback after input
- Purchase amount input appears after successful verification
- Two-step process: Verify → Enter Amount → Confirm

### Data Display

**Coupon Code Display (Post-Form Submission):**
- Hero-sized code: text-5xl font-mono font-bold in center of card
- Card: rounded-xl with p-8, subtle shadow
- Supporting text: "Show this code at checkout" in text-base below
- Copy button: Secondary button with icon

**Analytics Cards (Influencer Portal):**
- Grid of metric cards: 2 columns on mobile
- Each card: p-6 rounded-lg
- Large number: text-3xl font-bold
- Label: text-sm text-muted below number
- Metrics: Codes Generated, Redeemed, Total Sales

**Campaign List:**
- Card-based list with campaign name, discount, and expiration
- Each card: p-4 rounded-lg mb-4
- Status badge (Active/Expired): text-xs px-3 py-1 rounded-full

### Buttons

**Primary Actions:**
- Height: h-12, full rounded-lg
- Text: text-base font-semibold
- States: Distinct hover, active, and disabled states built-in

**Secondary Actions:**
- Same height, outlined style
- Used for "Copy Code" and auxiliary actions

### Feedback & States

**Loading States:**
- Inline spinners for form submissions
- Skeleton screens for analytics (simple pulse animation)

**Success/Error Messages:**
- Toast-style notifications: Fixed bottom positioning
- Auto-dismiss after 3 seconds
- Success: Checkmark icon + message
- Error: Alert icon + clear error text

**Empty States:**
- Centered icon + heading + description
- "Create your first campaign" for new influencers
- "No codes redeemed yet" for analytics

## PWA-Specific Elements

**Install Prompt:**
- Subtle banner at top: h-14 with dismissible option
- "Install App" CTA with download icon
- Shows once per session

**Offline Indicator:**
- Small badge in header when offline
- Minimal, non-intrusive

**App Icon Considerations:**
- Simple, recognizable symbol for coupon/campaign
- High contrast for visibility on various backgrounds

## Responsive Behavior

**Mobile (Default):**
- Full-width cards and forms with px-4 container padding
- Stack all elements vertically
- Touch targets minimum 44x44px

**Desktop (md: breakpoint and above):**
- Centered containers max-w-4xl
- Two-column analytics grids
- Increased padding: px-8

## Page Structures

**Role Selection Homepage:**
- Centered logo/title at top (py-8)
- Three role selection cards in vertical stack
- Minimal footer with app version

**Follower Campaign Page:**
- Campaign header with influencer name and discount details (py-6)
- Form card centered (max-w-md mx-auto)
- Success state shows large coupon code card

**Store Staff Portal:**
- Quick-access verification form immediately visible
- Recent verifications list below (scrollable)
- No navigation clutter

**Influencer Dashboard:**
- Active campaigns list (scrollable cards)
- Analytics grid for selected campaign
- "Create Campaign" floating action button (bottom-right on desktop, full-width on mobile)

## Images

**Hero Section:** No large hero images - this is a utility app prioritizing function over marketing visuals

**Icons:** Use Heroicons (outline style) throughout for consistency
- Portal selection: User icon, Store icon, Tag icon
- Actions: Plus, Check, X, Copy icons
- Analytics: Chart, Users, Currency icons

**Trust Elements:** 
- Small verification checkmarks next to validated codes
- Lock icon for secure WhatsApp number collection (subtle, in form)

This design creates a professional, trustworthy coupon verification system that works flawlessly across all three user types while maintaining the lightweight, focused MVP scope.