# ⚙️ Admin Panel Specification

## Access
- URL: /admin
- Auth: Supabase Auth email/password
- Only pre-created admin accounts can log in
- Protected by middleware

## Middleware Protection
```typescript
// middleware.ts
// Check for admin session on all /admin/* routes
// Redirect to /admin/login if not authenticated
// Use Supabase SSR session check
```

---

## Admin Layout
**Sidebar** (desktop) / **Bottom tabs** (mobile):
- 🏠 Dashboard
- 📦 Orders (with unread badge)
- 🌀 Products
- 📁 Categories
- ⭐ Reviews (pending badge)
- 🎯 Coupons
- 🖼️ Banners
- 💬 Messages (unread badge)
- ⚙️ Settings
- 🚪 Logout

---

## Dashboard Page (/admin)

### Stats Cards (top row):
- Today's Orders (number + trend)
- Today's Revenue (PKR)
- Pending Orders (number - highlight red if > 0)
- Total Products
- Low Stock Products (< 5 units - highlight red)

### Charts:
- Orders this week (line chart - simple CSS bars)
- Revenue this month

### Recent Orders Table:
- Last 10 orders
- Quick status update dropdown per row
- Click to view full order

### Quick Actions:
- Add New Product
- View Pending Orders
- Check Messages

---

## Orders Management (/admin/orders)

### Orders List:
- Search by order number, customer name, phone
- Filter by status, date range, city
- Table columns:
  - Order # (click to open)
  - Customer Name + Phone
  - Items count
  - Total PKR
  - City
  - Payment method
  - Status (colored badge + dropdown to change)
  - Date
  - Actions (View, Print)

### Single Order Page (/admin/orders/[id]):
- Full customer details
- Items ordered with images
- Pricing breakdown
- Status update with note
- Add tracking number + courier
- Status history timeline
- Print order button
- Send WhatsApp to customer button

---

## Products Management (/admin/products)

### Products List:
- Search by name, SKU
- Filter by category, stock status
- Table: Image, Name, Category, Price, Stock, Status, Actions
- Toggle active/inactive
- Quick stock edit inline

### Add/Edit Product Form (/admin/products/new or /[id]):
**Tab 1: Basic Info**
- Product Name
- Slug (auto-generated from name, editable)
- Category (dropdown)
- SKU
- Short Description
- Full Description (rich text)
- Tags

**Tab 2: Pricing & Stock**
- Price (PKR)
- Original Price (for showing discount)
- Stock Quantity
- Low stock alert threshold

**Tab 3: Technical Specs**
- Wattage
- Blade Size
- RPM
- Airflow (CMM)
- Noise Level
- Warranty Years
- Colors Available (tag input)
- Custom specs (key-value pairs, add more button)

**Tab 4: Images**
- Drag and drop image upload
- Multiple images
- Set primary image
- Reorder images
- Upload directly to Supabase Storage

**Tab 5: SEO**
- Meta Title
- Meta Description
- Preview of Google search result

**Checkboxes:** Featured, New Arrival, Active

---

## Reviews Management (/admin/reviews)

### Features:
- Pending reviews count (badge)
- List: Product, Customer, Rating, Review text, Date
- Approve / Reject / Delete buttons
- Filter by product, rating, status

---

## Coupons (/admin/coupons)

### Features:
- Create coupon: Code, Type (% or fixed), Value, Min order, Expiry, Usage limit
- List active/inactive coupons
- Usage statistics
- Deactivate coupon

---

## Banners (/admin/banners)

### Features:
- Upload hero banner images
- Set title, subtitle, CTA text, CTA link
- Reorder banners
- Toggle active/inactive

---

## Site Settings (/admin/settings)

### Sections:
**General:**
- Site name, Tagline
- Contact phone, WhatsApp, Email
- Physical address

**Shipping:**
- Default shipping fee
- Free shipping threshold

**Social Media Links**

**Calculator Defaults:**
- Traditional fan wattage (default 75)
- Electricity rate default (PKR/unit)

**Update button saves to site_settings table**

---

## Admin Authentication

```typescript
// Create admin user in Supabase:
// Dashboard -> Authentication -> Users -> Invite User
// Or use SQL:
// SELECT auth.create_user(email, password)

// Admin middleware check:
// 1. Get session from Supabase
// 2. Check if user exists and is admin
// 3. Could store admin emails in site_settings or
//    use a separate admin_users table
```
