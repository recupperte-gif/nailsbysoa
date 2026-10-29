---
name: Cyber McBling
colors:
  surface: '#131317'
  surface-dim: '#131317'
  surface-bright: '#39393d'
  surface-container-lowest: '#0e0e12'
  surface-container-low: '#1b1b1f'
  surface-container: '#1f1f23'
  surface-container-high: '#2a292e'
  surface-container-highest: '#353439'
  on-surface: '#e4e1e7'
  on-surface-variant: '#e1bdc7'
  inverse-surface: '#e4e1e7'
  inverse-on-surface: '#303034'
  outline: '#a88891'
  outline-variant: '#594048'
  surface-tint: '#ffb0c9'
  primary: '#ffb0c9'
  on-primary: '#640035'
  primary-container: '#ff479a'
  on-primary-container: '#58002e'
  inverse-primary: '#b90066'
  secondary: '#ffb1c8'
  on-secondary: '#650033'
  secondary-container: '#cf056f'
  on-secondary-container: '#ffe6eb'
  tertiary: '#ffb1c6'
  on-tertiary: '#650030'
  tertiary-container: '#ec5f90'
  on-tertiary-container: '#590029'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffd9e3'
  primary-fixed-dim: '#ffb0c9'
  on-primary-fixed: '#3e001e'
  on-primary-fixed-variant: '#8d004d'
  secondary-fixed: '#ffd9e2'
  secondary-fixed-dim: '#ffb1c8'
  on-secondary-fixed: '#3e001d'
  on-secondary-fixed-variant: '#8e004a'
  tertiary-fixed: '#ffd9e1'
  tertiary-fixed-dim: '#ffb1c6'
  on-tertiary-fixed: '#3f001b'
  on-tertiary-fixed-variant: '#8b0d46'
  background: '#131317'
  on-background: '#e4e1e7'
  surface-variant: '#353439'
typography:
  display-lg:
    fontFamily: Syne
    fontSize: 56px
    fontWeight: '800'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Syne
    fontSize: 38px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Syne
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Syne
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Syne
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Syne
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 30px
    letterSpacing: 0em
  headline-sm:
    fontFamily: Syne
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: 0em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.04em
  label-md:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.06em
  label-sm:
    fontFamily: Space Grotesk
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system channels mid-2000s McBling culture fused with early web maximalism, MySpace custom CSS nostalgia, and neon-drenched punk-pop vibrancy. It speaks to digital natives, Gen Z revivalists, fashion-forward creators, and subculture communities craving unapologetic expression over muted corporate minimalism.

### Key Aesthetic Tenets
- **Audacious Glamour & Punk Edge:** High-gloss bubblegum saturation clashes directly against pitch blacks and deep berry shadows, evoking rhinestone flip phones, studded belts, glossy magazines, and bedroom poster collages.
- **Graphic Contrast & Sharp Definition:** Heavy outlines, neon glow halos, and chromatic drop shadows establish instant hierarchy and tactile presence.
- **Playful Maximalism:** Layered surfaces, sticker-like emblems, glitter-esque highlights, and expressive, condensed display typography create an immersive retro-futuristic fantasy.

## Colors

The palette is engineered around hyper-saturated magenta-pink tones set against an ink-black background to maximize drama and evoke the 2000s club-glam atmosphere.

### Palette Architecture
- **Primary (`#fa3893`):** Bubblegum Neon Pink. Used for primary interactive triggers, glowing active states, hero display text, and high-impact micro-interactions.
- **Secondary (`#e62680`):** Hot Fuchsia Pink. Drives supporting badges, focused outlines, hover states, and gradient blends alongside the primary color.
- **Tertiary (`#94174d`):** Deep Plum / Velvet Magenta. Provides low-key tonal container surfaces, inset borders, and dimmed ambient accents that ground the neon brightness.
- **Neutral Canvas (`#0e0e12`):** Carbon Onyx. Serves as the primary dark backdrop, preventing pure stark `#000000` clipping while offering pure contrast for neon elements.
- **Surface Elevation (`#1a1520` & `#291a26`):** Deep plum-tinted dark surfaces for cards, modals, and input panels.
- **Foreground / Text (`#fff5fa`):** Soft Glaze White. Carries primary legibility with a delicate pink cast to avoid sterile coldness. Muted typography relies on `#b896a8`.

## Typography

The typographical hierarchy strikes a deliberate balance between Y2K editorial excess and clean digital utility:

- **Display & Headings (Syne):** Bold, sculpted, and theatrical. Heavy weights project an edgy, celebrity-magazine energy. Display headlines may employ uppercase treatment with tight letter-spacing for intense visual punch.
- **Body Text (Plus Jakarta Sans):** Smooth, friendly, and geometrically balanced. Provides effortless legibility for dense descriptions, messages, and editorial copy against dark backdrops.
- **Metadata & Labels (Space Grotesk):** Adds a technical, cybernetic 2000s gadget feel for badges, metadata, button text, and system tags.

## Layout & Spacing

Layouts follow an expressive grid rhythm that blends structured responsive cards with layered, overlapping visual elements reminiscent of sticker collages and desktop window stacks.

### Responsive Breakpoints
- **Desktop (1200px+):** 12-column fluid grid, 2rem margins, 1.25rem gutters. Enables rich multi-panel layouts, floating sticker sidebars, and expansive banner modules.
- **Tablet (768px – 1199px):** 8-column layout, 1.5rem margins, 1rem gutters. Columns collapse into balanced two-card grids.
- **Mobile (320px – 767px):** 4-column layout, 1rem margins, 0.75rem gutters. Single-column stacks with tactile thumb-reach tap zones.

Spacing rules prioritize compact density within card modules coupled with bold, deliberate gaps between distinct thematic sections.

## Elevation & Depth

Visual depth rejects standard neutral grey shadows in favor of hard-edged pop-punk offsets and saturated hot-magenta neon auras:

1. **Hard Offset Cast Shadows (Y2K Pop-Brutalism):**
   - Active interactive modules, stickers, and cards utilize sharp 2px to 4px unblurred shadows in `#000000` or `#94174d`, creating an extruded, vinyl-decal look.
2. **Neon Core & Chromatic Glow:**
   - Primary buttons and active states cast soft ambient blurs (`0 0 16px rgba(250, 56, 147, 0.45)`).
   - Focused inputs and toggles feature a multi-layer ring combining a 1px solid `#fa3893` stroke with an outer 4px diffused pink dispersion.
3. **Gloss & Sheen Overlays:**
   - Selected surfaces and hero banners employ a delicate top-lit glossy gradient sheen (`linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 100%)`) mimicking resin badges, acrylic charms, and liquid-crystal gadget displays.

## Shapes

The shape vocabulary blends pill-capsule tags with rounded rectangle frames (`roundedness: 2`), reflecting the curvy hardware styling of mid-2000s handheld consoles, lip gloss tubes, and flip phones.

- **Micro Controls & Badges:** Full capsule curves (`9999px`) provide bubbly, playful touchpoints.
- **Cards, Modals & Dialogs:** 0.5rem base radius with 1rem (`rounded-lg`) outer shells and crisp 1.5px to 2px outlines in `#94174d` or `#fa3893`.
- **Decorative Accents:** 4-point sparkle star polygons, heart cutouts, and slanted diagonal borders add authentic McBling character without disrupting clean structural alignment.

## Components

### Buttons
- **Primary:** Neon bubblegum background (`#fa3893`) with bright white text (`#ffffff`), 2px solid `#ffffff` internal border highlight, and an offset bottom-right shadow (`3px 3px 0px #94174d`). On hover, intensifies glow and elevates with `-1px -1px` translation.
- **Secondary:** Transparent background, 2px border in `#e62680`, text in `#fa3893`. On hover, fills with `rgba(230, 38, 128, 0.15)`.
- **Ghost:** Minimal text button in `#fff5fa`, transitioning to neon pink underline and glow on hover.

### Chips & Badges
- Pill-shaped (`rounded-full`) with Space Grotesk uppercase text.
- Plated styling using deep plum bases (`#291a26`) framed in 1px `#fa3893`, optionally prepended with micro star icons.

### Cards
- Surfaces rendered in dark violet-black (`#1a1520`) with 1.5px solid borders in `#94174d`.
- Header zones can include subtle horizontal pinstriping or hot pink accent ribbons. Hover states ignite a soft perimeter aura (`0 0 12px rgba(250, 56, 147, 0.25)`).

### Input Fields
- Dark inset backgrounds (`#0e0e12`) framed in 1.5px `#94174d`. Text renders in crisp `#fff5fa` with placeholder text in `#b896a8`.
- Active focus triggers an instant 2px solid `#fa3893` stroke paired with a glowing neon halo.

### Checkboxes & Radios
- Boxy rounded-sm checkboxes and circular radios edged with 2px `#e62680`.
- Checked state fills with `#fa3893` accompanied by a high-contrast white heart or custom checkmark glyph.

### List Items & Dividers
- Separated by faint gradient lines that fade from transparent to `#e62680` and back to transparent.
- Interactive list rows trigger a sweep of magenta-to-plum gradient backdrops on hover.