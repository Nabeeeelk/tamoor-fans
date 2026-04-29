# 🌐 User Website - Complete Specification

## Page 1: Homepage (/)

### Section 1: Hero Section
**Design:** Full viewport height, dark navy/deep blue gradient background
**Mobile Layout:** Single column, fan on top, text below

**Elements:**
- Animated tagline: "Pakistan Ka Sabse Energy Efficient Fan"
  (use typing animation)
- Subtitle: "Save up to 60% on electricity bills with our 30W BLDC fans"
- Two CTA buttons:
  1. "Shop Now" (primary - brand green/teal)
  2. "Calculate Savings" (secondary - outline)
- **3D Interactive Fan:**
  - Centered on screen
  - Slowly rotating fan blades using Three.js
  - On "Shop Now" click: fan speeds up dramatically for 1 second
  - On hover: subtle speed increase
  - Fan has realistic lighting with ambient + directional lights
  - Fallback: CSS animated fan SVG if Three.js fails to load
- Floating badge: "30 Watts Only" with electric bolt icon
- Scroll indicator at bottom (animated arrow)

**Code approach for 3D fan:**
```tsx
// Use React Three Fiber
// Create a simple 3D fan with:
// - Circular base (cylinder geometry)
// - 5 blade shapes (extruded shapes or box geometry)
// - Center hub
// - Fan cage (wireframe cylinder)
// Animate rotation using useFrame hook
// Speed up on button click via state
```

### Section 2: Trust Stats Bar
**Background:** White with subtle shadow
**Stats (animated counter on scroll):**
- ⚡ 30 Watts Consumption
- 🏭 25+ Years Experience
- 🌟 50,000+ Happy Customers
- 🔧 2 Years Warranty
- 🚀 Same Day Dispatch

### Section 3: Why Choose Taimoor Fans
**Layout:** 2x2 grid on mobile, 4 columns on desktop
**Cards with icons (animated on scroll - fade up):**
1. **Energy Saving** - Uses only 30W vs 75W traditional
2. **High Airflow** - Same or better air delivery
3. **Silent Operation** - Ultra quiet BLDC motor
4. **Long Life** - Premium quality components
5. **All Pakistan Delivery** - Fast shipping nationwide
6. **Money Back** - Satisfaction guarantee

### Section 4: Featured Products
**Title:** "Best Selling Fans"
**Layout:** Horizontal scroll on mobile, 3-column grid on desktop
**Shows:** 6 featured products from database
**Product Card contains:**
- Product image (lazy loaded)
- Name
- Price in PKR
- Wattage badge (30W)
- Compare button (+ icon)
- Add to Cart button
- Hover animation: card lifts up with shadow

### Section 5: Savings Calculator Preview
**Background:** Green gradient section
**Title:** "How Much Will YOU Save?"
**Interactive calculator embedded in homepage:**
- Input: Hours used per day (slider 1-24)
- Input: Number of fans (1-10 stepper)
- Input: Electricity rate (default 50 PKR/unit)
- Output: Shows animated number of annual savings in PKR
- CTA: "See Full Breakdown" -> /savings-calculator

### Section 6: How It Works
**Steps (horizontal scroll on mobile):**
1. Choose Your Fan (browse icon)
2. Place Order Online (cart icon)
3. We Deliver to Your Door (truck icon)
4. Start Saving Electricity (lightning icon)

### Section 7: Category Showcase
**Cards for each product category:**
- Ceiling Fans
- Pedestal Fans
- Table Fans
- Exhaust Fans
**Each card:** Image, category name, product count, arrow
**Animation:** Staggered fade-in on scroll

### Section 8: Social Proof / Testimonials
**Design:** Dark section, white text
**Layout:** Horizontal carousel (swipeable on mobile)
**Each testimonial:**
- Star rating (5 stars)
- Review text
- Customer name + city
- Verified purchase badge
**Auto-play carousel with manual swipe support**

### Section 9: Newsletter/WhatsApp Section
**Background:** Brand color gradient
**Title:** "Get Exclusive Deals First!"
**Options:**
- Email signup form
- "Join WhatsApp Group" button -> opens WhatsApp link

---

## Page 2: Products Listing (/products)

### Features:
- **Filter panel** (bottom sheet on mobile, sidebar on desktop):
  - By category
  - By price range (PKR slider)
  - By wattage
  - By blade size
  - Sort: Price low/high, Newest, Popular
- **Search bar** at top
- **Grid:** 2 columns on mobile, 3-4 on desktop
- **Product Count** shown
- **Infinite scroll** or pagination (prefer pagination for SEO)
- **Active filters** shown as pills with X to remove

### Product Card (mobile optimized):
```
[Product Image - 1:1 ratio]
[Badges: NEW | SALE | 30W]
Product Name
★★★★★ (4.8) 234 reviews
PKR 12,500  ~~PKR 15,000~~
[+ Compare] [Add to Cart]
```

---

## Page 3: Product Detail (/products/[slug])

### Mobile Layout (TOP to BOTTOM):
1. **Image Gallery** - Full width, swipeable, dots indicator
2. **Product Name** (h1 for SEO)
3. **Star Rating** + review count link
4. **Price** - Current price, crossed original if on sale
5. **Wattage Badge** - "Only 30W - Save 60% Electricity"
6. **Color Selection** - Circular swatches
7. **Quantity Selector** + Add to Cart (sticky bottom bar on mobile)
8. **Savings Badge** - "Save PKR 8,000/year with this fan"
9. **Key Features** - Icon list (5 bullet points)
10. **Free Shipping Notice** - If applicable
11. **Specifications Table** - Full specs from database
12. **Description** - Rich text
13. **Reviews Section** - List + Add review form
14. **Related Products** - Horizontal scroll

### Sticky Add to Cart (Mobile):
```
Fixed at bottom of screen while scrolling:
[Product Name] [PKR 12,500] [Add to Cart Button]
```

### Schema Markup for this page:
- Product schema (JSON-LD)
- BreadcrumbList schema
- Review/AggregateRating schema

---

## Page 4: Compare (/compare)

### Design:
- Fixed compare bar appears at bottom when user adds product to compare
- Compare bar shows product thumbnails with X to remove
- "Compare Now" button in bar
- Compare page shows side-by-side table

### Compare Bar (Fixed Bottom):
```
[Fan Image 1] [x]  [Fan Image 2] [x]  [Compare Now Button]
Shown above mobile bottom navigation
```

### Compare Table Layout:
```
Feature          | Fan A          | Fan B
----------------------------------------
Image            | [img]          | [img]
Price            | PKR 12,500     | PKR 15,000
Wattage          | 30W            | 75W            
Blade Size       | 56"            | 56"
RPM              | 380            | 350
Airflow          | 210 CMM        | 200 CMM
Warranty         | 2 Years        | 1 Year
Annual Savings   | PKR 8,000      | PKR 2,000
Rating           | ★★★★★         | ★★★★☆
```
- Green highlight for better value cells
- "Add to Cart" button for each column

---

## Page 5: Savings Calculator (/savings-calculator)

### Full Calculator Page:
**Title:** "Calculate Your Electricity Savings with Taimoor Fans"

**Calculator Inputs:**
- Number of fans in house (1-20 slider)
- Current fan type (60W / 75W / 100W - radio buttons)
- Taimoor fan model to compare (dropdown)
- Daily usage hours (slider 1-24)
- Electricity rate PKR/unit (editable, default 50)
- Days per year (default 365, adjust for seasonal)

**Results Display:**
```
CURRENT COST (Traditional Fan)
Daily Cost:      PKR 45
Monthly Cost:    PKR 1,350
Annual Cost:     PKR 16,200

WITH TAIMOOR FAN (30W)
Daily Cost:      PKR 18
Monthly Cost:    PKR 540
Annual Cost:     PKR 6,480

💰 YOU SAVE: PKR 9,720/year
   That's PKR 810/month!
   Fan pays for itself in: 14 months
```

**Visual:** Bar chart or animated progress bars showing comparison
**CTA:** "Shop Energy Saving Fans" button

---

## Page 6: Cart (/cart)

### Cart Drawer (Slide from right, mobile full screen):
- Cart items list with image, name, price, quantity controls
- Subtotal
- Shipping fee
- Coupon code input
- Total
- Checkout button
- Empty state with "Start Shopping" CTA

---

## Page 7: Checkout (/checkout)

### Mobile-first single page form:

**Section 1: Contact Info**
- Full Name*
- Phone Number* (with +92 prefix)
- Email (optional)

**Section 2: Delivery Address**
- Address Line*
- City* (searchable dropdown - all Pakistan cities)
- Province*

**Section 3: Payment**
- Cash on Delivery (default, highlighted)
- Bank Transfer (secondary option)

**Section 4: Order Summary**
- Products list
- Subtotal, shipping, total
- Coupon input

**Place Order Button:**
- Large, full width, green
- Loading state with spinner

---

## Page 8: Order Confirmation (/order-confirmation/[orderId])

### Design:
- Big green checkmark animation (Framer Motion)
- "Order Placed Successfully!"
- Order number (large, copyable)
- Order summary
- "Track Your Order" link
- WhatsApp order notification to business
- "Continue Shopping" button

---

## Page 9: Track Order (/track-order)

### Design:
- Input field: Phone number or order number
- Submit button
- Shows order status with visual progress steps:
  [Order Placed] -> [Confirmed] -> [Dispatched] -> [Delivered]
- Current status highlighted
- Tracking number + courier info if available

---

## Page 10: Contact (/contact)

### Sections:
- WhatsApp click to chat (most prominent)
- Phone number (click to call)
- Email
- Contact form (name, phone, message)
- Map embed (optional)
- Business hours

---

## Mobile-Specific Features

### Bottom Navigation Bar (Fixed)
```
[🏠 Home] [📦 Products] [🔄 Compare] [🛒 Cart] [👤 Account]
```
Always visible on mobile (below iPhone safe area)

### Floating WhatsApp Button
- Green WhatsApp icon floating on right side
- Message: "Need help? Chat with us!"
- Pre-filled WhatsApp message with "Hi, I want to buy Taimoor Fans"

### Mobile Performance Requirements
- Images: WebP format, lazy loaded, srcset
- Fonts: Subset, preloaded
- No layout shift (CLS < 0.1)
- Touch targets: minimum 44x44px
- Swipeable carousels (native touch events)
