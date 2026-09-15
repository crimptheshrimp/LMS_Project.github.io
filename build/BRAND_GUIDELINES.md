# LearningHub Brand Guidelines

Based on the official brand specification document, these guidelines ensure consistent use of the LearningHub mark across all applications and materials.

## Brand Assets

### Logo Files
- `learninghub-icon.svg` — App icon (96×96px, knockout on Ink Pine)
- `learninghub-mark-small.svg` — Small master mark (under 40px)
- `learninghub-logo.svg` — Big master mark (40px and above)
- `learninghub-lockup.svg` — Horizontal lockup (mark + wordmark)
- `brandLogo.svg` — Boxed lockup variant (mark + wordmark with background)

## Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Ink Pine | #10262B | Primary mark color (stems) |
| Saffron | #E9A13B | Accent node (single use only) |
| Bone | #FAF8F5 | Background, knockout colors |

## Mark Masters

### Big Master (40px and above)
- Stroke width: 9/128 (0.703 units)
- Full stem heights
- S-curve crossbar
- Saffron node detached from curl
- **Use for**: Lockups, print, splash screens, marketing

**Minimum size**: 16px on screen, 8mm in print

### Small Master (under 40px)
- Stroke width: 13/128 (proportionally thicker)
- Shortened stems
- Crossbar amplitude halved
- Node dropped (not visible at small sizes)
- **Use for**: Favicons, app tiles, UI chrome

## Clear Space

Keep clear space on all four sides equal to one third of the mark's height. Nothing crosses it, including the wordmark in lockups.

## Brand Rules

### DO
- Use Ink Pine (#10262B) for the stems
- Use Bone (#FAF8F5) on dark backgrounds, solid black for single-colour print
- Scale both axes together (no stretching)
- Use the provided SVG files directly

### DO NOT
- Use the big master below 40px (crossbar closes, node turns to mud)
- Recolour the stems
- Add a second accent, outline, or drop shadow
- Stretch the mark
- Use below 16px on screen

## Wordmark

The wordmark is set in **Manrope**:
- "learning" — Light (300 weight)
- "hub" — Extra Bold (800 weight)

Use letter-spacing to maintain visual balance. In lockups, outline the type in SVG before distributing to third parties.

## Implementation

All logos are properly integrated into:
- `public/manifest.json` — Web app manifest
- `public/index.html` — Favicon and apple-touch-icon
- `src/App.css` — CSS variables for colors
- React components — Navbar, login, register, homepage

## Color Variables (CSS)

```css
--ink-pine: #10262B
--saffron: #E9A13B
--bone: #FAF8F5
```

These are defined in `src/App.css` root selector and available throughout the application.
