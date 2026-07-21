---
name: Luminous Office
colors:
  surface: '#f9f9ff'
  surface-dim: '#d8dae2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3fc'
  surface-container: '#ecedf6'
  surface-container-high: '#e6e8f0'
  surface-container-highest: '#e0e2ea'
  on-surface: '#181c21'
  on-surface-variant: '#414752'
  inverse-surface: '#2d3037'
  inverse-on-surface: '#eff0f9'
  outline: '#717783'
  outline-variant: '#c1c6d4'
  surface-tint: '#005faf'
  primary: '#005dac'
  on-primary: '#ffffff'
  primary-container: '#1976d2'
  on-primary-container: '#fffdff'
  inverse-primary: '#a5c8ff'
  secondary: '#4f6169'
  on-secondary: '#ffffff'
  secondary-container: '#d2e6ef'
  on-secondary-container: '#55676f'
  tertiary: '#944700'
  on-tertiary: '#ffffff'
  tertiary-container: '#ba5b00'
  on-tertiary-container: '#fffeff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d4e3ff'
  primary-fixed-dim: '#a5c8ff'
  on-primary-fixed: '#001c3a'
  on-primary-fixed-variant: '#004786'
  secondary-fixed: '#d2e6ef'
  secondary-fixed-dim: '#b6cad2'
  on-secondary-fixed: '#0b1e24'
  on-secondary-fixed-variant: '#374951'
  tertiary-fixed: '#ffdbc7'
  tertiary-fixed-dim: '#ffb688'
  on-tertiary-fixed: '#311300'
  on-tertiary-fixed-variant: '#733600'
  background: '#f9f9ff'
  on-background: '#181c21'
  surface-variant: '#e0e2ea'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  container-max: 1440px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

The design system is centered on clarity, efficiency, and cognitive ease. Designed for administrative professionals managing complex contract lifecycles, the aesthetic prioritizes a "calm-tech" environment. By leveraging a blend of **Minimalism** and **Soft Modernism**, the interface reduces visual noise to help users focus on high-stakes documentation and data entry.

The target audience requires a tool that feels reliable yet modern—moving away from the sterile, rigid nature of legacy enterprise software toward a more approachable, fluid experience. The UI evokes a sense of "digital breathing room" through generous whitespace and a soft, cohesive color palette.

## Colors

The color strategy utilizes a hierarchical approach to guide the user's eye. 

- **Primary Blue (#1976D2):** Reserved for primary actions, active states, and critical navigation landmarks. 
- **Soft Blue Wash (#E3F2FD):** Used for large surface areas like sidebars or active row backgrounds to soften the interface.
- **Deep Slate (#2C3E50):** The primary ink for all body text and headings to ensure WCAG AA readability without the harshness of pure black.
- **Pastel Accents:** Used sparingly for status indicators (e.g., "Draft", "Signed", "Pending"). These are desaturated to maintain the calm atmosphere.
- **Background (#F8F9FA):** A cool-tinted off-white that prevents screen glare during extended usage periods.

## Typography

This design system employs **Inter** for its exceptional legibility and neutral, professional character. 

- **Hierarchy:** Use `headline-lg` for dashboard overviews and `title-lg` for contract titles within lists.
- **Readability:** Body text uses `body-md` (14px) for data-heavy tables and `body-lg` (16px) for standard forms and documentation prose.
- **Spacing:** Tighten letter spacing slightly on larger headlines to maintain a modern, "tucked" look. Increase letter spacing on `label-md` for clarity in small-caps or uppercase contexts.

## Layout & Spacing

The layout follows a **Fluid Grid** model with a maximum container width of 1440px. 

- **Grid:** A 12-column system is used for desktop. Sidebars should occupy a fixed 280px width, while the content area remains fluid.
- **Rhythm:** An 8px linear scale (referenced as `base * n`) governs all padding and margins to ensure mathematical harmony.
- **Negative Space:** Use `xl` (40px) spacing between major sections (e.g., between a header and a data table) to prevent the UI from feeling cramped.
- **Mobile:** On mobile devices, margins reduce to 16px and the grid collapses to a single column, with cards stackable vertically.

## Elevation & Depth

Depth is established through **Tonal Layering** and **Ambient Shadows**. Instead of traditional heavy drop shadows, this design system uses soft, diffused "glow" shadows that utilize the primary blue or neutral slate as a tint.

- **Level 0 (Base):** Background surface (#F8F9FA). No shadow.
- **Level 1 (Cards/Lists):** White surface (#FFFFFF) with a very soft 4px blur, 2% opacity shadow. Used for standard data rows.
- **Level 2 (Modals/Dropdowns):** White surface with a 12px blur, 8% opacity shadow. 
- **Interaction:** On hover, clickable cards should transition from Level 1 to Level 2 elevation with a 200ms ease-in-out curve.

## Shapes

The shape language is consistently **Rounded**. High-radius corners are used to communicate a friendly and approachable tool.

- **Standard Elements:** Buttons, input fields, and small chips use `rounded` (0.5rem).
- **Containers:** Dashboard cards and large content modules use `rounded-lg` (1rem).
- **Specialty Elements:** Search bars and "Status" badges should use `rounded-xl` (1.5rem) or fully pill-shaped paths to distinguish them from actionable buttons.

## Components

### Buttons
- **Primary:** Solid `#1976D2` with white text. Rounded 0.5rem. Subtle lift on hover.
- **Secondary:** Ghost style with `#1976D2` border and light blue tint on hover.
- **Tertiary:** Text-only for less frequent actions like "Cancel" or "View Details."

### Input Fields
- Inputs feature a soft grey border (#D1D5DB) that transitions to Primary Blue on focus. 
- Background is white for contrast against the light grey page background. 
- Include generous internal padding (12px 16px) for a premium feel.

### Cards & Tables
- **Contract Cards:** Feature a Level 1 elevation. Use a vertical primary-colored bar on the left edge to denote "Active" or "Critical" status.
- **Data Tables:** Remove vertical borders. Use thin horizontal separators (#EDF2F7). Header row uses `label-md` typography.

### Chips & Badges
- Used for contract status (e.g., "Exported", "Signed"). 
- Backgrounds use the Pastel Tones (e.g., Pastel Green for Signed). 
- Font weight is Medium (500) for legibility at small sizes.

### Contract Previewer
- A specialized component with a white "paper" surface, slightly higher elevation (Level 2), and fixed aspect ratio to simulate the physical contract being exported.