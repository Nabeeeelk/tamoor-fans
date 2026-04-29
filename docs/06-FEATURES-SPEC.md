# ✨ Special Features - Detailed Specification

## Feature 1: Product Comparison

### State Management (Zustand):
```typescript
interface CompareStore {
  products: Product[];          // Max 2 products
  addProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
  clearAll: () => void;
  isInCompare: (id: string) => boolean;
}
```

### User Flow:
1. User browses products
2. Sees "+ Compare" button on every product card
3. Clicks compare on Product A -> appears in compare bar at bottom
4. Clicks compare on Product B -> appears next to A in bar
5. "Compare Now" button becomes active
6. User clicks "Compare Now" -> navigated to /compare
7. Side-by-side table shown
8. User can click "Remove" to remove one and add different product

### Compare Bar Component:
- Fixed position: bottom of screen, above bottom nav on mobile
- Smooth slide-up animation when first product added
- Shows product thumbnail + name (truncated)
- X button per product to remove
- "Compare" button disabled until 2 products added
- Persisted in localStorage (survives page refresh)

### Comparison Rows:
```
- Product Image
- Product Name
- Current Price (PKR)
- Original Price
- Wattage (highlight LOWER is better - green)
- Blade Size
- Speed (RPM)
- Airflow (CMM) (highlight HIGHER is better - green)
- Noise Level
- Warranty
- Colors Available
- Estimated Annual Savings (auto-calculated)
- Customer Rating
- Stock Status
- Add to Cart
```

### "Better Value" highlighting:
- For each numeric spec, highlight the winning cell in light green
- Add trophy icon next to better value
- For price: lower = green
- For airflow: higher = green
- For wattage: lower = green
- For warranty: higher = green

---

## Feature 2: Savings Calculator

### Calculation Formula:
```typescript
// Electricity units formula:
// Units = (Wattage * Hours * Days) / 1000

// For traditional fan (75W default):
const traditionalUnits = (75 * hoursPerDay * 365) / 1000;
const traditionalCost = traditionalUnits * electricityRate;

// For Taimoor fan (30W):
const taimoorUnits = (30 * hoursPerDay * 365) / 1000;
const taimoorCost = taimoorUnits * electricityRate;

// Savings:
const annualSavings = (traditionalCost - taimoorCost) * numberOfFans;
const monthlySavings = annualSavings / 12;

// Payback period:
const paybackMonths = productPrice / monthlySavings;

// CO2 reduction (bonus metric):
const co2Saved = (traditionalUnits - taimoorUnits) * 0.5 * numberOfFans;
// 0.5 kg CO2 per kWh (Pakistan grid average)
```

### Calculator UI Elements:
- **Slider 1:** Number of fans (1 to 10)
  - Visual: Row of fan icons that fill up as slider moves
- **Slider 2:** Hours per day (1 to 24)
  - Visual: Sun/moon icon changes with time
- **Input:** Electricity rate (PKR per unit)
  - Helper text: "NEPRA current rate: ~35-65 PKR/unit depending on slab"
- **Dropdown:** Compare against which Taimoor fan model

### Results Display (animated):
- Large PKR number that counts up with animation
- Breakdown card: Daily / Monthly / Annual
- "Pay for itself in X months" badge
- 🌱 CO2 savings stat
- Progress bar: Shows % saved
- Share button (share your savings on WhatsApp)

---

## Feature 3: Cart System (Zustand + localStorage)

```typescript
interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity: number, color?: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  couponCode: string | null;
  discountAmount: number;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => void;
}
```

### Cart Drawer:
- Opens from right side on desktop
- Full screen on mobile
- Shows cart items, update quantity, remove
- Shows coupon input
- Shows total
- Checkout button goes to /checkout
- Empty state with "Start Shopping" CTA

---

## Feature 4: Order Placement

### Checkout Flow:
1. User fills form (validated with Zod + React Hook Form)
2. Submit creates order via API route
3. API:
   - Validates data
   - Generates order number (TF-YYYY-XXXX)
   - Inserts into orders table
   - Inserts into order_items table
   - Decrements stock_quantity for each product
   - Sends confirmation email via Resend (if email provided)
   - Sends WhatsApp notification to business
4. Redirect to /order-confirmation/[orderId]

### Order Number Format:
```typescript
// TF-2024-0001
const generateOrderNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `TF-${year}-${random}`;
}
```

---

## Feature 5: WhatsApp Integration

### Business Notifications:
When order is placed, open this URL:
```
https://wa.me/923XXXXXXXXX?text=
NEW+ORDER+%23TF-2024-0001%0A
Customer:+Ahmed+Khan%0A
Phone:+03001234567%0A
City:+Lahore%0A
Total:+PKR+15,000%0A
Items:+2x+Ceiling+Fan+56%22
```

### Customer WhatsApp Chat Button:
```
https://wa.me/923XXXXXXXXX?text=Hello,+I+want+to+buy+Taimoor+Fans
```

---

## Feature 6: Order Tracking

### Track by Phone Number:
- Show all orders for that phone number
- Most recent on top
- Status timeline per order

### Track by Order Number:
- Show specific order details
- Full status history

### Status Steps Visual:
```
● Order Placed (always completed)
● Confirmed (check when confirmed)
● Processing / Packing
● Shipped (shows tracking number)
● Delivered ✓
```
