---
name: Modern Enterprise Linear
colors:
  surface: '#faf8ff'
  surface-dim: '#d9d9e5'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3fe'
  surface-container: '#ededf9'
  surface-container-high: '#e7e7f3'
  surface-container-highest: '#e1e2ed'
  on-surface: '#191b23'
  on-surface-variant: '#434655'
  inverse-surface: '#2e3039'
  inverse-on-surface: '#f0f0fb'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#0060ac'
  on-secondary: '#ffffff'
  secondary-container: '#64a8fe'
  on-secondary-container: '#003c70'
  tertiary: '#943700'
  on-tertiary: '#ffffff'
  tertiary-container: '#bc4800'
  on-tertiary-container: '#ffede6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#d4e3ff'
  secondary-fixed-dim: '#a4c9ff'
  on-secondary-fixed: '#001c39'
  on-secondary-fixed-variant: '#004883'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb596'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#7d2d00'
  background: '#faf8ff'
  on-background: '#191b23'
  surface-variant: '#e1e2ed'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  display-md:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: '1.25'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.25'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
  section-padding: 64px
---

## Brand & Style

The design system is engineered for a high-performance SaaS environment, balancing the rigorous clarity required for enterprise tools with the aesthetic polish of modern product design. The personality is professional, precise, and unobtrusive, prioritizing user flow and data density without sacrificing visual breathing room.

The style draws heavily from **Modern Minimalism** and **Corporate/Modern** movements. It utilizes a restrained color palette, subtle tonal layering, and precision-engineered typography to evoke a sense of reliability and technical sophistication. The user interface remains invisible until needed, using generous whitespace to reduce cognitive load and premium soft shadows to establish a clear spatial hierarchy.

## Colors

This design system uses a logic-driven color architecture. The primary blue is used sparingly for call-to-action elements and active states, while the secondary light blue provides subtle accents and focus indicators.

The neutral scale is optimized for legibility and structural separation. The main background creates a soft canvas that allows white card surfaces to "pop" via subtle elevation. Borders are kept light to maintain a clean aesthetic, used primarily to define zones without adding visual noise. Status colors are saturated and distinct, ensuring critical system feedback is immediate and unambiguous.

## Typography

The typography system relies exclusively on Inter, a typeface designed for screen legibility. For large titles (Display and Headline-LG), a tight negative letter-spacing of -0.04em is applied to create a sophisticated, editorial look that feels grounded and intentional.

Body copy is optimized for long-form reading and data consumption with a generous 1.6 line-height, preventing text-heavy dashboards from feeling cramped. Labels use increased font weights and slight tracking adjustments to ensure they are distinguishable from body text at smaller sizes.

## Layout & Spacing

This design system employs a **Fluid Grid** model with a 12-column layout for desktop and a single-column layout for mobile. A strict 4px baseline grid ensures vertical rhythm across all components.

Spacing is used as a functional tool to group related information. Surfaces like cards should use a minimum internal padding of 24px (stack-lg) to maintain the premium, spacious feel of the brand. Layouts should prioritize center-alignment for marketing pages and left-aligned, high-efficiency sidebar layouts for the application core. Transitions between breakpoints (Mobile: <768px, Tablet: 768px-1024px, Desktop: >1024px) should be fluid, with margins expanding as screen real estate increases.

## Elevation & Depth

Visual hierarchy is established through **Tonal Layers** and **Ambient Shadows**. This design system avoids harsh borders in favor of depth-based separation.

1.  **Level 0 (Base):** The main background (#F8FAFC) acts as the furthest layer.
2.  **Level 1 (Surface):** Section containers and cards (#FFFFFF) sit on top of the base. They use a very soft, diffused shadow: `0 4px 6px -1px rgba(15, 23, 42, 0.05), 0 2px 4px -2px rgba(15, 23, 42, 0.05)`.
3.  **Level 2 (Interaction):** Popovers, dropdowns, and modals use a more pronounced shadow to indicate temporary elevation: `0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.1)`.

Consistent 1px borders (#E5E7EB) are used only on Level 1 surfaces when they are adjacent to other white surfaces to provide necessary definition.

## Shapes

The shape language is defined by the **Rounded** profile, using a base 16px (1rem) corner radius for primary containers and cards. This large radius softens the professional aesthetic, making the enterprise software feel approachable and modern.

Buttons and input fields should follow this curvature at a slightly smaller scale (8px) to maintain a cohesive look across different component sizes. Small elements like tags or chips may use the "Pill" variation for high-contrast shape distinction.

## Components

**Buttons:** Primary buttons use the Primary Blue (#2563EB) with white text. On hover, they transition to #1D4ED8. Secondary buttons use a white background with a 1px border (#E5E7EB) and Primary Headings text color.

**Input Fields:** Borders use #E5E7EB with a 4px (Soft) or 8px (Rounded) corner radius. On focus, the border shifts to Primary Blue with a 3px soft outer glow (using the Secondary Accent color at 20% opacity).

**Cards:** Cards are the primary container. They must feature a white background, the Level 1 shadow, and a 16px corner radius. Internal padding should be a minimum of 24px.

**Chips/Tags:** Used for status. They should utilize a "light" version of the status color for the background (10% opacity) and the "bold" status color for the text (e.g., Success text on a light green background).

**Lists:** Interactive list items should have a subtle hover state (#F8FAFC) and use 16px of vertical padding to ensure touch targets are accessible and the interface feels uncrowded.

**Data Tables:** Use a transparent background for the header row with `label-sm` typography. Row separators should be 1px solid #E5E7EB. Cell text should use `body-sm`.