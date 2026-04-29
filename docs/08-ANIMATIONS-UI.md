# 🎨 Animations, UI Design System & Visual Identity

## Color Palette

```css
:root {
  /* Primary Brand Colors */
  --brand-primary: #00A86B;      /* Emerald Green - main CTA */
  --brand-primary-dark: #007A4D;  /* Darker green hover */
  --brand-primary-light: #E8F8F2; /* Light green background */
  
  /* Secondary */
  --brand-secondary: #1E3A5F;    /* Deep Navy Blue */
  --brand-secondary-light: #2D5F9E; /* Lighter blue */
  
  /* Accent */
  --accent-yellow: #FFB800;      /* Energy/electricity yellow */
  --accent-orange: #FF6B35;      /* Urgency/sale */
  
  /* Neutrals */
  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-200: #E5E7EB;
  --gray-600: #4B5563;
  --gray-900: #111827;
  
  /* Status */
  --success: #10B981;
  --warning: #F59E0B;
  --error: #EF4444;
  --info: #3B82F6;
  
  /* Backgrounds */
  --bg-hero: linear-gradient(135deg, #1E3A5F 0%, #0D1F3C 100%);
  --bg-calculator: linear-gradient(135deg, #00A86B 0%, #007A4D 100%);
}
```

## Typography

```css
/* Headings: Poppins */
/* Body: Inter */

h1 { font-size: clamp(28px, 5vw, 56px); font-weight: 700; }
h2 { font-size: clamp(22px, 3.5vw, 40px); font-weight: 600; }
h3 { font-size: clamp(18px, 2.5vw, 28px); font-weight: 600; }
body { font-size: 16px; line-height: 1.6; }
```

## Animation Specifications

### 1. Hero Fan (Three.js)

```typescript
// FanCanvas.tsx implementation guide:

// Fan parts to model with Three.js primitives:
// - Base plate: CylinderGeometry(0.5, 0.6, 0.1, 32)
// - Center hub: CylinderGeometry(0.2, 0.2, 0.3, 32)
// - 5 Blades: BoxGeometry(2, 0.05, 0.4) each rotated 72deg apart
// - Cage ring: TorusGeometry(2.2, 0.05, 8, 64)

// Materials:
// - Body: MeshStandardMaterial({ color: '#C0C0C0', metalness: 0.8, roughness: 0.2 })
// - Blades: MeshStandardMaterial({ color: '#8B4513', roughness: 0.8 }) // Wood color

// Animation states:
// - idle: rotation.y += 0.005 per frame (slow)
// - hover: rotation.y += 0.02 per frame
// - clicked: rotation.y += 0.1 for 60 frames then back to idle

// Lighting:
// - AmbientLight intensity 0.5
// - DirectionalLight from top-right, intensity 1
// - PointLight below with blue tint (electricity feel)

// Camera:
// - Position: [0, 2, 5]
// - Looking at fan center
// - Slight auto-orbit on mobile (gyroscope if available)

// Fallback for devices that don't support WebGL:
// Show CSS animated fan SVG instead
```

### 2. Page Transitions
```typescript
// Use Framer Motion layout animations
// Wrap pages in AnimatePresence

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20 },
};
```

### 3. Scroll Animations (Viewport-triggered)
```typescript
// Apply to all sections
const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: 'easeOut' }
  },
};

// Stagger children
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

// Usage:
<motion.div
  variants={fadeUpVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-50px" }}
>
```

### 4. Stats Counter Animation
```typescript
// Animate numbers counting up when scrolled into view
// Use framer-motion useMotionValue + useTransform
// Or simple useEffect with requestAnimationFrame

// Example: 0 -> 50,000 over 2 seconds with easeOut
```

### 5. Product Card Hover
```typescript
// CSS + Framer Motion:
// - Translate Y: -8px
// - Box shadow increase
// - Image scale: 1.05
// Transition: 0.3s ease

<motion.div
  whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
  transition={{ duration: 0.3 }}
>
```

### 6. Button Interactions
```typescript
// Primary button:
<motion.button
  whileHover={{ scale: 1.03 }}
  whileTap={{ scale: 0.97 }}
  // Also add ripple effect on click
>

// Add to Cart success animation:
// Button text changes to "✓ Added!" with green flash
// Cart icon in nav bounces
```

### 7. Cart Bounce Animation
```typescript
// When item added to cart, the cart icon in navbar/bottom nav:
// - Scales up to 1.3 then back to 1
// - Shows count badge with scale animation
// Duration: 400ms
```

### 8. Loading States

**Page Loading:**
- Spinning fan SVG (brand colored)
- Full page overlay on initial load

**Skeleton Screens:**
```typescript
// ProductCard Skeleton:
// - Gray pulsing rectangle for image
// - Gray lines for text
// - Use animate-pulse Tailwind class
```

**Button Loading:**
```typescript
// Replace button text with spinning circle
// Keep button disabled
// Prevent double submission
```

---

## Mobile UI Patterns

### Touch Interactions:
- Swipe left/right on product images
- Swipe down to close modals/drawers
- Pull to refresh on product listing
- Long press on product for quick view

### Mobile-Specific Styling:
```css
/* Ensure no horizontal scroll */
body { overflow-x: hidden; }

/* Touch-friendly tap targets */
button, a { min-height: 44px; min-width: 44px; }

/* Remove tap highlight */
* { -webkit-tap-highlight-color: transparent; }

/* iOS safe areas */
.bottom-nav {
  padding-bottom: env(safe-area-inset-bottom);
}
```

---

## Component Styling Guide

### Primary Button:
```tsx
<button className="
  bg-brand-primary hover:bg-brand-primary-dark
  text-white font-semibold
  px-6 py-3 rounded-xl
  w-full md:w-auto
  flex items-center justify-center gap-2
  transition-all duration-300
  shadow-lg shadow-green-500/20
  active:scale-95
">
```

### Product Card:
```
Rounded-2xl, white bg, subtle shadow
Image: aspect-square, object-cover, rounded-t-2xl
Content: p-4
Name: font-semibold, gray-900, line-clamp-2
Price: text-xl, font-bold, brand-primary
Original: line-through, gray-400
Badges: top-3 left-3, absolute, rounded-full
```

### Section Headers:
```
Small colored label above (e.g., "★ ENERGY SAVING")
Large heading below
Optional subtitle below that
Centered on mobile, left on desktop
Decorative underline or dot accent
```
