# UI/UX Design Brief

## Design Goals

**Clean, trustworthy, direct, mobile-first, Myanmar-aware.**

- Clean: maximum whitespace, no decorative clutter
- Trustworthy: consistent typography, real product logos, no dark patterns
- Direct: one action per screen, no registration walls, no upsell interruptions
- Mobile-first: designed for 390px first, expanded for desktop
- Myanmar-aware: Walone font for Burmese text, large enough tap targets for on-screen keyboards

## Target Devices + Breakpoints

| Breakpoint | Width | Priority |
|------------|-------|----------|
| Mobile | 390px | Primary - Telegram in-app browser |
| Mobile L | 430px | High |
| Tablet | 768px | Medium |
| Desktop | 1280px+ | Low - admin panel primary use |

Mobile-first CSS. Desktop is enhancement, not baseline.

## Color System

Defined in `src/styles/globals.css` as CSS custom properties (oklch color space):

| Token | Value | Use |
|-------|-------|-----|
| `--background` | `oklch(1 0 0)` - pure white | Page background |
| `--foreground` | `oklch(0.16 0 0)` - near black | Body text |
| `--primary` | `oklch(0.16 0 0)` - near black | Primary buttons, strong elements |
| `--primary-foreground` | `oklch(0.99 0 0)` - near white | Text on primary buttons |
| `--secondary` | `oklch(0.955 0 0)` - light gray | Secondary button background |
| `--muted` | `oklch(0.965 0 0)` - very light gray | Muted backgrounds |
| `--muted-foreground` | `oklch(0.42 0 0)` - medium gray | Captions, secondary text |
| `--accent` | `oklch(0.95 0.018 255)` - light blue tint | Accent backgrounds |
| `--accent-foreground` | `oklch(0.3 0.12 255)` - blue | Text on accent |
| `--border` | `oklch(0.88 0 0)` - light gray | Dividers, input borders |
| `--destructive` | `oklch(0.58 0.22 27)` - red | Error states |

### Product tone colors (card accents)

| Tone | Token | Value |
|------|-------|-------|
| blue | `--blue` | `oklch(0.57 0.22 255)` |
| violet | `--violet` | `oklch(0.63 0.2 300)` |
| green | `--green` | `oklch(0.72 0.16 155)` |
| orange | `--orange` | `oklch(0.71 0.18 55)` |

## Typography

| Role | Font | Notes |
|------|------|-------|
| Display / brand | `Walone` (custom TTF) | Used for "digimium" wordmark and Myanmar text |
| Monospace / UI | system-ui monospace stack | Code, prices, metadata |
| Body | `-apple-system` sans stack | Paragraphs, descriptions |
| Myanmar text | `Walone`, `Myanmar Text`, sans-serif | `var(--font-myanmar)` |

Font files: `assets/fonts/` (Urbanist, Sahara, Walone). Walone served from `public/`.

### Scale (inferred from globals.css)

- h1: large display (landing title)
- h2: section headings
- h3: card headings, step headings
- body: base 16px equivalent
- small/caption: muted secondary labels

## Spacing System

Tailwind 4 spacing scale (base 4px). No custom scale - uses Tailwind defaults.

## Component Inventory

| Component | File | Purpose |
|-----------|------|---------|
| Button | `src/components/ui/button.tsx` | Primary, outline, ghost variants; size sm/lg |
| Card | `src/components/ui/card.tsx` | Base card wrapper |
| ProductCard | `src/components/ui/cards.tsx` | Store grid card with logo, name, price, add button |
| PricingCard | `src/components/ui/pricing-card.tsx` | Full product detail with duration picker + features |
| CartDrawer | `src/components/cart/cart-drawer.tsx` | Slide-in cart panel |
| LogoCloud | `src/components/ui/logo-cloud.tsx` | Scrolling product logo strip on home |
| DotPattern | `src/components/ui/dot-pattern.tsx` | Decorative background dots |
| Separator | `src/components/ui/separator.tsx` | Radix-based horizontal rule |
| PageCanvas | `src/components/layout/page-canvas.tsx` | Page wrapper with dot background |
| SiteLayout | `src/components/layout/site-layout.tsx` | Header + outlet for public pages |

## Interaction Patterns

- **Hover states:** subtle background shift on buttons and card actions
- **Cart badge:** item count on cart icon in header, updates immediately
- **Add to cart:** instant feedback - cart drawer opens automatically
- **Category filters:** `aria-pressed` toggle buttons, URL state via `?category=`
- **Search:** uncontrolled debounce-free filter (fast enough at current catalog size)
- **Plan picker:** horizontal scroll rail on mobile; `aria-pressed` active state
- **Loading:** "Loading..." text with `role="status"` during route lazy load + API fetch

## Accessibility Requirements

- WCAG 2.1 AA minimum
- All interactive elements keyboard-accessible
- `aria-label` on icon-only buttons
- `aria-pressed` on toggle buttons (category filters, plan picker)
- `aria-hidden` on decorative icons/elements
- `role="status"` on loading states
- Cart drawer focus management (focus trap when open)
- Reduced motion: `@media (prefers-reduced-motion)` - TBD, Framer Motion supports this via `useReducedMotion`
- Color contrast: white bg + near-black text (#111 equivalent) exceeds 7:1 ratio
- Touch targets: minimum 44x44px on all interactive elements

## Icon Set

**lucide-react** (`lucide-react` package). Icons used:
`ArrowRight`, `ArrowLeft`, `ShoppingBag`, `Search`, `SlidersHorizontal`, `MessageCircleMore`, `MousePointerClick`, `LockKeyhole`

## Dark Mode

**Not planned.** Design is intentionally bright and white to signal trustworthiness on mobile.

## Design References

- Figma: TBD
- Brand assets: `assets/` (logos in multiple formats, brand fonts)
- Product logos: `logos/` (individual PNG per product)
