# Unified Design System Specification

## 1. Design philosophy and visual direction

This design system is built around a restrained, premium, and highly legible visual language. It combines the strongest characteristics of Apple’s typographic clarity, Notion’s calm neutrality, and Vercel’s polished product UI, without copying any one system wholesale.

The system intentionally avoids:

- generic SaaS visual noise
- excessive gradients
- noisy accent color proliferation
- oversized headline treatments
- over-rounded components without purpose
- decorative chrome that adds no usability value

Core design principles:

- Minimal, polished, and professional
- Strong readability across desktop, tablet, and mobile
- Calm neutral surfaces with precise accent use
- Clear hierarchy without visual clutter
- Semantic tokens over hardcoded values
- Shared design language across multiple application types
- Light and dark modes with one semantic token architecture
- Responsive behavior designed intentionally, not simply compressed
- Light background → dark foreground
- Dark background → light foreground

This system is intended for personal productivity tools, dashboards, content systems, and product-facing web apps while remaining visually consistent across the full ecosystem.

### Foreground/background rule

The design system follows one unbreakable rule:

- When a surface uses a light background, its text must use a dark foreground token.
- When a surface uses a dark background, its text must use a light foreground token.
- Components must never set text to a hardcoded light color on a light surface or dark color on a dark surface.

This rule is enforced by using semantic tokens such as `--bg-app`, `--bg-surface`, and `--fg-default` instead of direct color values.

---

## 2. Research and reference analysis using Dembrandt

The following reference websites were analyzed with Dembrandt and used as inspiration, not as direct implementation templates:

- notion.com
- apple.com
- vercel.com

### Notion

Observed traits:

- Off-white and near-white canvas colors
- Strong black or near-black text contrast
- Quiet borders and subtle dividers
- Spacious content blocks with generous rhythm
- Calm, low-noise UI layout language
- High readability for long-form writing and planning interfaces

Design takeaways:

- Ideal for neutral backgrounds and editorial comfort
- Strong reference for calm surfaces and structured layout density
- Good guidance for page-level rhythm and hierarchy in productivity apps

### Apple

Observed traits:

- Exceptional typographic polish and spacing discipline
- Strong use of system sans-serif stacks, especially SF Pro-like family styles
- Neutral palette dominated by black, white, silver, and cool gray
- High contrast without visual aggression
- Large whitespace and confidence in empty space
- Premium visual restraint and clear component structure

Design takeaways:

- Best signal for typography, spacing, and overall polish
- Strong reference for elegant hierarchy and product quality
- Directly informs the typography and layout logic of this system

### Vercel

Observed traits:

- Crisp modern product aesthetic
- Compact and efficient UI density
- Clean, technical feel with minimal noise
- Blue accent language used purposefully rather than broadly
- Strong component cleanliness and modern SaaS product appeal

Design takeaways:

- Good reference for component rhythm and functional clarity
- Strong guidance for modern UI density and interaction polish
- Useful for restrained accent usage without leaving the neutral foundation

### Synthesis

The final system intentionally blends:

- Apple’s typographic and spacing discipline
- Notion’s calm neutral surfaces and editorial readability
- Vercel’s modern product clarity and efficient interaction rhythm

This creates a design language that feels premium, quiet, and dependable, without becoming visually generic or overly decorative.

> Dembrandt analysis was used to review the visual patterns of Notion, Apple, and Vercel. These were treated as strategic references rather than literal templates.

---

## 3. Design token architecture

The design system uses a layered token model:

1. Primitive tokens — raw foundation values
2. Semantic tokens — purposeful meaning
3. Component tokens — usage-specific properties

This keeps the system extensible and consistent while avoiding hardcoded values across applications.

### 3.1 Primitive tokens

```css
:root {
  --primitive-white: #ffffff;
  --primitive-black: #0b0d10;
  --primitive-50: #f5f7f9;
  --primitive-100: #eef2f6;
  --primitive-200: #e4e8ee;
  --primitive-300: #d0d7df;
  --primitive-400: #a6b0bb;
  --primitive-500: #6b7280;
  --primitive-600: #4b5563;
  --primitive-700: #2f3745;
  --primitive-800: #1c2430;
  --primitive-900: #10161d;

  --primitive-blue-50: #edf5ff;
  --primitive-blue-100: #dfeeff;
  --primitive-blue-200: #bfdcff;
  --primitive-blue-300: #93c2ff;
  --primitive-blue-400: #60a4ff;
  --primitive-blue-500: #3d7ef6;
  --primitive-blue-600: #2b62d9;
  --primitive-blue-700: #1f4eb5;

  --primitive-green-50: #edfdf5;
  --primitive-green-500: #1f9d67;
  --primitive-green-600: #117a4f;

  --primitive-red-50: #fff1f2;
  --primitive-red-500: #dc4c5a;
  --primitive-red-600: #b6303d;

  --primitive-amber-50: #fff8eb;
  --primitive-amber-500: #d98a16;
  --primitive-amber-600: #b86a00;

  --primitive-cyan-50: #eefcff;
  --primitive-cyan-500: #0ea5e9;
}
```

### 3.2 Typography primitives

```css
:root {
  --font-sans: "SF Pro Display", "SF Pro Text", "Inter", "Segoe UI", sans-serif;
  --font-mono: "SFMono-Regular", "JetBrains Mono", "Fira Code", monospace;

  --text-xs: 12px;
  --text-sm: 14px;
  --text-base: 16px;
  --text-lg: 18px;
  --text-xl: 20px;
  --text-2xl: 24px;
  --text-3xl: 30px;
  --text-4xl: 36px;
  --text-5xl: 48px;

  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;

  --leading-tight: 1.2;
  --leading-normal: 1.5;
  --leading-relaxed: 1.7;
}
```

### 3.3 Spacing primitives

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
}
```

### 3.4 Radius and shadow primitives

```css
:root {
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-2xl: 24px;

  --shadow-xs: 0 1px 2px rgba(15, 23, 42, 0.04);
  --shadow-sm: 0 2px 8px rgba(15, 23, 42, 0.06);
  --shadow-md: 0 8px 20px rgba(15, 23, 42, 0.08);
  --shadow-lg: 0 16px 32px rgba(15, 23, 42, 0.1);
  --shadow-xl: 0 24px 48px rgba(15, 23, 42, 0.12);
}
```

### 3.5 Layout, motion, and layering primitives

```css
:root {
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1440px;

  --sidebar-width: 260px;
  --sidebar-width-collapsed: 72px;
  --header-height: 64px;

  --duration-fast: 120ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;

  --ease-default: cubic-bezier(0.2, 0, 0, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);

  --z-base: 0;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-fixed: 300;
  --z-overlay: 400;
  --z-modal: 500;
  --z-popover: 600;
  --z-tooltip: 700;
  --z-toast: 800;
}
```

---

## 4. Semantic token set

### 4.1 Light theme semantic tokens

```css
:root {
  --bg-app: var(--primitive-50);
  --bg-subtle: var(--primitive-100);
  --bg-surface: var(--primitive-white);
  --bg-surface-alt: #f9fafb;
  --bg-muted: #f3f4f6;
  --bg-elevated: var(--primitive-white);
  --bg-overlay: rgba(15, 23, 42, 0.5);

  --fg-default: var(--primitive-black);
  --fg-muted: #5b6470;
  --fg-subtle: #7b8593;
  --fg-inverse: var(--primitive-white);

  --border-default: #e4e8ee;
  --border-strong: #d0d7df;
  --border-muted: #edf1f5;

  --primary: #2b62d9;
  --primary-foreground: var(--primitive-white);
  --secondary: var(--primitive-100);
  --secondary-foreground: #111827;
  --accent: #3d7ef6;
  --accent-foreground: var(--primitive-white);

  --success: #1f9d67;
  --success-foreground: var(--primitive-white);
  --warning: #d98a16;
  --warning-foreground: #1f2937;
  --destructive: #dc4c5a;
  --destructive-foreground: var(--primitive-white);
  --info: #0ea5e9;
  --info-foreground: var(--primitive-white);

  --surface-card: var(--bg-surface);
  --surface-popover: var(--bg-surface);
  --surface-sidebar: var(--bg-subtle);
  --surface-hover: #f3f6fb;
  --surface-active: #eaf1ff;
  --surface-disabled: #edf1f5;

  --text-muted: var(--fg-muted);
  --text-subtle: var(--fg-subtle);
  --text-inverse: var(--fg-inverse);

  --input-bg: var(--primitive-white);
  --input-border: #d0d7df;
  --input-placeholder: #7b8593;

  --ring: rgba(59, 130, 246, 0.35);
  --shadow-card: 0 2px 8px rgba(15, 23, 42, 0.06);
  --shadow-overlay: 0 16px 32px rgba(15, 23, 42, 0.1);
}
```

### 4.2 Dark theme semantic tokens

```css
[data-theme='dark'] {
  --bg-app: #0b0d10;
  --bg-subtle: #121821;
  --bg-surface: #111827;
  --bg-surface-alt: #171f2d;
  --bg-muted: #1b2431;
  --bg-elevated: #151d29;
  --bg-overlay: rgba(2, 6, 23, 0.7);

  --fg-default: #edf2f7;
  --fg-muted: #b3bdd0;
  --fg-subtle: #8a94a6;
  --fg-inverse: #0b0d10;

  --border-default: #223041;
  --border-strong: #2a3b4d;
  --border-muted: #1b2431;

  --primary: #6aa4ff;
  --primary-foreground: #06111d;
  --secondary: #1a2533;
  --secondary-foreground: #edf2f7;
  --accent: #7bb7ff;
  --accent-foreground: #06111d;

  --success: #2bc67a;
  --success-foreground: #03140d;
  --warning: #f0b14a;
  --warning-foreground: #1e1200;
  --destructive: #f36676;
  --destructive-foreground: #1c090d;
  --info: #4ec0ff;
  --info-foreground: #06111d;

  --surface-card: var(--bg-surface);
  --surface-popover: #151d29;
  --surface-sidebar: #121821;
  --surface-hover: #172233;
  --surface-active: #1a2d46;
  --surface-disabled: #1b2431;

  --text-muted: var(--fg-muted);
  --text-subtle: var(--fg-subtle);
  --text-inverse: var(--fg-inverse);

  --input-bg: #111827;
  --input-border: #2a3b4d;
  --input-placeholder: #8a94a6;

  --ring: rgba(120, 170, 255, 0.42);
  --shadow-card: 0 8px 20px rgba(2, 6, 23, 0.35);
  --shadow-overlay: 0 20px 40px rgba(2, 6, 23, 0.45);
}
```

---

## 5. Typography scale and usage

### Base font system

```css
:root {
  --font-sans: "SF Pro Display", "SF Pro Text", "Inter", "Segoe UI", sans-serif;
  --font-mono: "SFMono-Regular", "JetBrains Mono", "Fira Code", monospace;
}
```

### Type scale

| Token | Size | Weight | Line Height | Usage |
| --- | --- | --- | --- | --- |
| `--text-xs` | 12px | 500 | 1.4 | labels, metadata |
| `--text-sm` | 14px | 400 | 1.5 | body secondary |
| `--text-base` | 16px | 400 | 1.6 | default body |
| `--text-lg` | 18px | 400 | 1.6 | larger body |
| `--text-xl` | 20px | 600 | 1.4 | card headings |
| `--text-2xl` | 24px | 600 | 1.3 | section headings |
| `--text-3xl` | 30px | 600 | 1.2 | large headings |
| `--text-4xl` | 36px | 600 | 1.2 | hero and major headings |
| `--text-5xl` | 48px | 600 | 1.1 | display headings |

### Heading model

- H1: 36-48px, weight 600, tight letter spacing, consistent rhythm
- H2: 24-30px, weight 600
- H3: 20-24px, weight 600
- H4: 18-20px, weight 600
- H5/H6: 16-18px, weight 600

### Body model

- Default body: 16px / 1.6 / 400
- Supportive text: 14px / 1.5 / 400
- Caption: 12px / 1.4 / 500
- Label: 12px / 1.4 / 600

Typography principles:

- Use strong hierarchy with whitespace rather than exaggerated size jumps
- Do not mix arbitrary typefaces within the same interface
- Keep weight usage limited to normal, medium, semibold, bold
- Favor generous line-height for readable body copy

---

## 6. Spacing, layout, and container system

### Spacing scale

The system uses an 8px base scale to keep rhythm predictable.

| Token | Value |
| --- | --- |
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 20px |
| `--space-6` | 24px |
| `--space-8` | 32px |
| `--space-10` | 40px |
| `--space-12` | 48px |
| `--space-16` | 64px |
| `--space-20` | 80px |
| `--space-24` | 96px |

### Layout guidance

- Page horizontal padding: 24px mobile, 32px tablet, 48px desktop
- Section spacing: 48-80px depending on hierarchy
- Card padding: 16-24px inner padding
- Form spacing: 12-16px between controls
- Screen container widths: 640, 768, 1024, 1280, 1440

### Container widths

```css
:root {
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1440px;
}
```

---

## 7. Border radius, borders, shadows, and layers

### Border radius scale

- `sm`: 8px
- `md`: 12px
- `lg`: 16px
- `xl`: 20px
- `2xl`: 24px

Recommended usage:

- Inputs: 10-12px
- Buttons: 10-12px
- Cards: 16-20px
- Side panels: 16-20px
- Modals: 20-24px

### Border widths

- Default: 1px
- Emphasis: 1px-2px
- Focus ring: 2px with soft ring color

### Shadow scale

- `xs`: subtle hover separation
- `sm`: default card surfaces
- `md`: elevated panels and popovers
- `lg`: modal surfaces and overlays
- `xl`: the most prominent floating surfaces

### Z-index system

```css
:root {
  --z-base: 0;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-fixed: 300;
  --z-overlay: 400;
  --z-modal: 500;
  --z-popover: 600;
  --z-tooltip: 700;
  --z-toast: 800;
}
```

---

## 8. Motion and interaction system

```css
:root {
  --duration-fast: 120ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;

  --ease-default: cubic-bezier(0.2, 0, 0, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
}
```

Motion principles:

- Preserve clarity and avoid excessive animation
- Prefer subtle transitions for focus, hover, and state changes
- Use consistent motion duration across components
- Keep dark-mode interactions feeling equally polished

---

## 9. Responsive design system

### Breakpoints

```css
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1440px;
}
```

### Mobile-first behavior

- Mobile surfaces should be designed intentionally, not simply scaled-down desktop layouts
- Reduce vertical density while preserving legibility and touch affordance
- Use larger touch targets and comfortable spacing for thumb reach
- Stack layout columns earlier for narrow screens
- Allow nav patterns to collapse into compact mobile structures

### Responsive rules

- Desktop: multi-column content grids, full navigation, standard density
- Tablet: slightly reduced content density, adaptive sidebars and cards
- Mobile: one-column layouts, simplified nav, larger tap targets, tighter but still readable type

---

## 10. Component visual standards

### Buttons

Primary:

- Fill accent or primary color
- High contrast foreground
- Strong hover state with slight darkening or color shift
- Focus ring with 2px outline
- Disabled style with reduced opacity and not clickable

Secondary:

- Neutral filled background or subtle border treatment
- Clear foreground contrast
- Minimal elevation and controlled hover feedback

Outline:

- Transparent background with border
- Strong focus state
- Good contrast on white and dark surfaces

Ghost:

- Transparent background
- Light hover background
- Useful for low-emphasis actions

Destructive:

- Red or warm accent foreground/background
- Consistent semantics across surface states
- Similar interaction pattern to primary button

### Inputs, textareas, and selects

- Background from `--input-bg`
- 1px border using `--input-border`
- Clear focus ring based on `--ring`
- Rounded corners from `--radius-md`
- Placeholder uses `--input-placeholder`
- Disabled states use subdued backgrounds and muted text

### Checkboxes and radio controls

- Use accent color for selected states
- Maintain accessible hit targets
- No excessive border styling; prefer minimal, crisp focus rings

### Cards

- Neutral backgrounds and subtle borders
- Soft shadows only where elevation is needed
- Clear padding and readable headings
- Rounded corners consistent with overall scale

### Modals and dialogs

- Subtle overlay with strong content separation
- Slight elevation and shadow for prominence
- Crisp header spacing and button alignment
- Clear focus trap and simple action grouping

### Navigation

- Use neutral surfaces and subtle hover states
- Distinguish active items through background tint or stronger text emphasis
- Keep product navigation consistent across family apps

### Tables and data surfaces

- Conservative borders and muted text for metadata
- Strong alignment and predictable spacing
- Minimal decorative treatment; functionality first

### Badges, tags, and status pills

- Small, rounded pills with strong semantic color meaning
- Do not overuse color as decoration
- Prefer semantic colors for status and state communication

### Tooltips, popovers, and dropdowns

- Elevated surfaces with soft shadow
- Simple border treatment
- High readability and clear relationship to trigger element

### Loading and empty states

- Avoid overly animated or noisy loaders
- Use neutral structure, simple motion, and strong spacing
- Empty states should guide the user toward the next action with clarity

---

## 11. Theme architecture and token governance

This design system uses a single semantic layer for both themes.

Rules:

- Components must never hardcode color values when a semantic token exists
- The same semantic token names are used in both light and dark themes
- Theme switching is centralized through CSS variables and `[data-theme='dark']`
- Primitive values are the lower-level source of truth
- Semantic tokens define meaning and naming
- Component-specific tokens should only be used when the component needs a special case

This ensures that all applications remain visually consistent without re-creating design choices in each app.

---

## 12. Recommended CSS variable architecture

```css
:root {
  /* Primitive */
  --primitive-white: #ffffff;
  --primitive-50: #f5f7f9;
  --primitive-100: #eef2f6;
  --primitive-200: #e4e8ee;
  --primitive-black: #0b0d10;

  /* Semantic */
  --bg-app: var(--primitive-50);
  --bg-surface: var(--primitive-white);
  --fg-default: var(--primitive-black);
  --primary: #2b62d9;
  --border-default: #e4e8ee;

  /* Component */
  --button-primary-bg: var(--primary);
  --button-primary-fg: var(--primitive-white);
  --input-bg: var(--primitive-white);
  --card-radius: var(--radius-lg);
}
```

This structure keeps semantic token naming stable while allowing design work to happen at the right level.

---

## 13. Tailwind CSS integration

Recommended approach:

- Use CSS variables as the source of truth
- Map semantic tokens into utility values using Tailwind theme config
- Keep design names semantic and reusable

Example:

```js
export default {
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg-app)',
        surface: 'var(--bg-surface)',
        primary: 'var(--primary)',
        border: 'var(--border-default)',
        text: 'var(--fg-default)',
      },
      fontFamily: {
        sans: ['SF Pro Display', 'SF Pro Text', 'Inter', 'Segoe UI', 'sans-serif'],
        mono: ['SFMono-Regular', 'JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
    },
  },
}
```

This keeps Tailwind composable without hardcoding app-specific visual decisions.

---

## 14. Example token implementation file

```css
:root {
  color-scheme: light;

  --font-sans: "SF Pro Display", "SF Pro Text", "Inter", "Segoe UI", sans-serif;
  --font-mono: "SFMono-Regular", "JetBrains Mono", "Fira Code", monospace;

  --primitive-white: #ffffff;
  --primitive-black: #0b0d10;
  --primitive-50: #f5f7f9;
  --primitive-100: #eef2f6;
  --primitive-200: #e4e8ee;
  --primitive-300: #d0d7df;
  --primitive-400: #a6b0bb;
  --primitive-500: #6b7280;
  --primitive-600: #4b5563;
  --primitive-700: #2f3745;
  --primitive-800: #1c2430;
  --primitive-900: #10161d;

  --bg-app: var(--primitive-50);
  --bg-subtle: var(--primitive-100);
  --bg-surface: var(--primitive-white);
  --fg-default: var(--primitive-black);
  --fg-muted: #5b6470;
  --fg-subtle: #7b8593;

  --primary: #2b62d9;
  --primary-foreground: var(--primitive-white);
  --secondary: var(--primitive-100);
  --secondary-foreground: #111827;
  --accent: #3d7ef6;
  --accent-foreground: var(--primitive-white);

  --border-default: #e4e8ee;
  --border-strong: #d0d7df;
  --ring: rgba(59, 130, 246, 0.35);

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-2xl: 24px;

  --space-2: 8px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
}

[data-theme='dark'] {
  color-scheme: dark;

  --bg-app: #0b0d10;
  --bg-subtle: #121821;
  --bg-surface: #111827;
  --fg-default: #edf2f7;
  --fg-muted: #b3bdd0;
  --fg-subtle: #8a94a6;

  --primary: #6aa4ff;
  --primary-foreground: #06111d;
  --secondary: #1a2533;
  --secondary-foreground: #edf2f7;
  --border-default: #223041;
}
```

---

## 15. Governance and maintainability rules

- One visual language across all future apps
- No application-specific color or spacing hardcoding when a token exists
- Semantic naming over raw values
- Use minimal color accents rather than broad palettes
- Keep the system small, coherent, and durable
- Prefer extending the system with new semantic tokens rather than custom one-off values
- Every new component must map to the existing token system before implementation

## Final outcome

This design system is intended to become the shared foundation of a personal application ecosystem: dashboards, productivity tools, content systems, portfolios, and future product experiences can all inherit the same design language while still varying in layout and functionality.

The result is a unified visual identity that feels premium, modern, calm, and consistent without becoming rigid or generic.


- base: 0
- dropdown: 10
- sticky nav: 20
- modal: 50
- toast: 70
- tooltip: 80

---

## 8. Responsive system

### Breakpoints

```css
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1440px;
}
```

### Layout rules

- Mobile-first design
- Containers use max-width: 1200px
- Padding scales down on mobile
- Navigation becomes drawer or compact layout under medium screens
- Typography should reduce gently on tablet/mobile without creating huge jumps
- Cards should stack vertically on narrow screens
- Tables should render as stacked/scrollable layouts on mobile

### Specific behaviors

- Small mobile: 320-480px, tighter paddings, larger tap targets, no dense multi-column layouts
- Tablet: 768-1024px, two-column layouts acceptable
- Desktop: 1024px+, more space for sidebars and content density

---

## 9. Component visual specifications

### Buttons

Primary:

- Background: `--primary`
- Foreground: `--primary-foreground`
- Height: 40-44px
- Border radius: 10-12px
- Hover: slightly darker blue
- Active: pressed state with darker background
- Focus: 2px ring using `--ring`
- Disabled: `--disabled-bg` with `--disabled-fg`

Secondary:

- Background: `--secondary`
- Foreground: `--secondary-foreground`
- Border: 1px solid `--border-default`
- Hover: `--hover-bg`
- Focus ring: `--ring`

Outline:

- Transparent background
- Border: `--border-default`
- Hover: subtle surface fill

Ghost:

- Transparent background with minimal hover fill
- Used for low-emphasis actions

Destructive:

- Background: `--destructive`
- Foreground: `--destructive-foreground`
- Same structural behavior as primary

### Inputs

- Height: 40-44px
- Radius: 10-12px
- Background: `--input-bg`
- Border: 1px solid `--input-border`
- Focus: 2px ring around field using `--ring`
- Placeholder: `--input-placeholder`
- Disabled: `--disabled-bg`
- Error: border red, ring red-soft, message text `--destructive`

### Textarea and Select

- Same base input system
- Resize: vertical only for textareas
- Selects include subtle chevron affordance
- Dropdown surfaces use subtle elevation and high contrast text

### Cards

- Background: `--bg-surface`
- Border: 1px solid `--border-default`
- Radius: 16px default
- Shadow: subtle `--shadow-sm`
- Hover: border strongens and shadow increases slightly

### Modal / dialog

- Background: `--bg-surface`
- Border: 1px solid `--border-default`
- Radius: 20px
- Shadow: `--shadow-lg`
- Header and footer spacing consistent with system scale
- Overflow handling and focus trap required

### Popover / dropdown / tooltip

- Solid surface background with subtle border
- Radius 12-16px
- Shadow: `--shadow-md`
- Text: `--fg-default`
- Hover states use low-contrast fills

### Tabs

- Compact height with 1px bottom border
- Active tab uses text `--fg-default`, underline or highlight accent
- Inactive tab uses muted text

### Tables

- Border-bottom rows, subtle alternating cell backgrounds optional
- Headings semibold and aligned
- Use consistent spacing and readable cell padding

### Navigation and sidebar

- Sidebar background: neutral surface color
- Navigation items use 8-12px radius and low emphasis states
- Active section uses stronger fill and visible selection
- Mobile nav collapses into a drawer or compact overlay

### Badges and status indicators

- Rounded-pill shapes
- Semantic background colors with strong contrast and clear meanings
- Use small text and compact vertical padding

### Skeletons and empty states

- Use neutral placeholders with subtle motion and the same radius scale
- Keep animations subtle and low-energy

---

## 10. Theme architecture

This design system uses a single semantic token model with a light and dark variant. Components should never hardcode theme-specific colors. Instead, they should read from semantic tokens.

Rules:

- Keep semantic names stable across themes
- Maintain the same hierarchy in both themes
- Dark mode should be deeper, more atmospheric, but still calm
- Use the same ring, surface, and border semantics across themes
- Use CSS custom properties as the source of truth

Recommended switching approach:

```css
:root {
  color-scheme: light;
}

[data-theme='dark'] {
  color-scheme: dark;
}
```

This allows all future applications to toggle themes centrally without component-level duplication.

---

## 11. Recommended CSS variable architecture

Use a layered token structure:

1. Primitive tokens: raw color, spacing, radius, type values
2. Semantic tokens: theme-aware surfaces, text, borders, interaction colors
3. Component-level tokens: button/field/card/tooltip configuration layers

This keeps the system extendable and prevents component code from depending on raw color literals.

Recommended structure:

```css
:root {
  --primitive-*;
  --font-*;
  --space-*;
  --radius-*;
  --shadow-*;
  --color-*;
  --bg-*;
  --fg-*;
  --border-*;
  --surface-*;
  --text-*;
}
```

Then define component-level tokens like:

```css
:root {
  --button-primary-bg: var(--primary);
  --button-primary-fg: var(--primary-foreground);
  --input-bg: var(--input-bg);
  --card-radius: var(--radius-lg);
  --dialog-shadow: var(--shadow-lg);
}
```

This is future-friendly and minimises duplication.

---

## 12. Recommended Tailwind CSS integration

Use CSS variables as the source of truth and map Tailwind theme values to them. This keeps design-system logic consistent across frameworks and custom CSS.

Example:

```css
@import "tailwindcss";

:root {
  --color-background: var(--bg-app);
  --color-foreground: var(--fg-default);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-muted: var(--fg-muted);
  --color-border: var(--border-default);
  --color-card: var(--bg-surface);
}
```

Then define a brand theme extension in Tailwind configuration if needed:

```ts
export default {
  theme: {
    extend: {
      colors: {
        background: 'var(--bg-app)',
        foreground: 'var(--fg-default)',
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        muted: 'var(--fg-muted)',
        border: 'var(--border-default)',
        card: 'var(--bg-surface)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      }
    }
  }
}
```

This avoids duplicating design decisions across several component libraries and keeps the system extensible.

---

## 13. Design system summary

This design system is intentionally quiet but premium. It uses neutral surfaces, clean typography, crisp spacing, and a restrained accent color to create a product language that can scale across any personal web application ecosystem.

It is intentionally not a generic SaaS template and not a bright brand-heavy system. Its strength is disciplined consistency: the same rules apply to dashboards, content tools, trackers, admin apps, and personal productivity interfaces.

The system is designed to be:

- Minimal but polished
- Professional and calm
- Readable and accessible
- Flexible across light and dark themes
- Reusable across all future products
- Easy to maintain with semantic tokens

---
