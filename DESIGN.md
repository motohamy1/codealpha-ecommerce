---
name: LUXE
description: Raw, high-contrast, avant-garde design system for premium e-commerce.
colors:
  primary: "#1c1917"
  neutral-bg: "#fafaf9"
  surface: "#ffffff"
  muted: "#78716c"
  border: "#e7e5e4"
typography:
  display:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "clamp(2.5rem, 7vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  body:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  none: "0px"
  sm: "2px"
  md: "4px"
spacing:
  sm: "12px"
  md: "16px"
  lg: "20px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.sm}"
    padding: "14px 28px"
  button-primary-hover:
    backgroundColor: "{colors.muted}"
---

# Design System: LUXE

## 1. Overview

**Creative North Star: "The Brutalist Gallery"**

LUXE's visual language is built around raw, structured grid systems, high-contrast frames, and exposed layout skeletons. Rejecting the soft, over-rounded, and cream-saturated design clichés of contemporary e-commerce, LUXE frames luxury products as pieces of fine art in an avant-garde digital gallery. The interface is unapologetically structured, relying on heavy alignments and stark contrasts to convey premium value.

**Key Characteristics:**
- Exposed layout grids and high-contrast borders
- Extreme typographic scaling
- Razor-sharp corners with minimal rounding
- Absence of decorative ambient shadows in favor of flat structural layers

## 2. Colors

The palette is composed of stark, raw neutrals that emphasize product photography above all else.

### Primary
- **Stark Ink** (#1c1917): Used for solid interactive states, body copy, and structural frames. Represents stability and authority.

### Neutral
- **Off-Canvas** (#fafaf9): The backdrop that grounds the gallery, preventing the pure-white surfaces from feeling overly sterile.
- **Gallery Surface** (#ffffff): Used for cards, drawers, and modal containers. Stands out cleanly against the off-canvas bg.
- **Exposed Border** (#e7e5e4): The concrete-like gray used to draw grid lines, dividers, and component boundaries.
- **Muted Stone** (#78716c): Used for secondary metadata and disabled states.

### Named Rules
**The Stark Separation Rule.** Background colors must never blend into each other. Every surface boundary must be marked either by a strict border (#e7e5e4) or a direct transition between #ffffff and #fafaf9.

## 3. Typography

**Display Font:** ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif
**Body Font:** ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif

**Character:** A high-contrast sans-serif pairing that utilizes tight tracking and dramatic sizing to mimic modern high-fashion editorial print.

### Hierarchy
- **Display** (700, clamp(2.5rem, 7vw, 4.5rem), 1.05): Used for main hero headers. Drives the visual hierarchy of the page.
- **Headline** (700, 2rem, 1.15): Used for page section titles.
- **Title** (600, 1.25rem, 1.25): Used for product titles and drawer headers.
- **Body** (400, 1rem, 1.5): Used for descriptions, prose, and informational copy. Checked for readability to stay within 65–75ch.
- **Label** (500, 0.75rem, 1.2, uppercase): Used for navigation links, category indicators, and action triggers.

### Named Rules
**The Editorial Weight Rule.** Never pair weights that are adjacent (e.g. 400 and 500 in the same visual block). Contrast must be absolute: either regular body text (400) or bold editorial title text (600+).

## 4. Elevation

The elevation system is entirely flat and structural. The interface rejects standard drop shadows and ambient glow, opting instead to communicate depth through layout layering, solid borders, and stark color blocking.

### Named Rules
**The No-Glow Rule.** Traditional box shadows are strictly prohibited. Depths and containers are indicated solely through border outlines (1px #e7e5e4) and contrast shifts (Gallery Surface #ffffff vs. Off-Canvas #fafaf9).

## 5. Components

Every component has a sculpted, striking silhouette featuring sharp corners and heavy outline strokes.

### Buttons
- **Shape:** Minimal border-radius (2px).
- **Primary:** Solid Stark Ink (#1c1917) background with Gallery Surface (#ffffff) text. Padding is (14px 28px).
- **Hover / Focus:** Transitions to Muted Stone (#78716c) background. Under prefers-reduced-motion, the background color switches instantly.

### Cards / Containers
- **Corner Style:** Low-radius sharp edges (4px).
- **Background:** Gallery Surface (#ffffff).
- **Shadow Strategy:** 100% flat with no shadow.
- **Border:** Stark 1px outline stroke (#e7e5e4).
- **Internal Padding:** Spaced using the lg scale step (20px).

### Inputs / Fields
- **Style:** 1px Exposed Border (#e7e5e4) stroke with 0px radius.
- **Focus:** 1px Stark Ink (#1c1917) outline stroke. No ambient glow or shadow.

### Navigation
- **Style:** Sticky header with a solid Exposed Border (#e7e5e4) bottom frame. Nav links use the uppercase Label style (500 weight, 0.75rem) with solid hover borders instead of background shifts.

## 6. Do's and Don'ts

### Do:
- **Do** enforce minimal border-radius values (0px for inputs/inputs focus, ≤4px for cards and containers, ≤2px for buttons).
- **Do** align components to a strict exposed grid, separating sections with a 1px Exposed Border (#e7e5e4) frame.
- **Do** use OKLCH values in CSS for color declarations to ensure wide-gamut compatibility.

### Don't:
- **Don't** use any form of traditional soft drop shadows or ghost-card shadows.
- **Don't** use cream-colored warm-neutral backgrounds or generic SaaS warm-neutral palettes.
- **Don't** add side-stripe borders or kickers/eyebrows on every section as a default scaffold.
- **Don't** use border-radius values exceeding 4px on layout elements.
