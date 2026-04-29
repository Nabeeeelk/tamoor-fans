# 📁 Complete Project Structure

```
taimoor-fans/
├── public/
│   ├── favicon.ico
│   ├── logo.png
│   ├── logo-white.png
│   ├── og-image.jpg              # 1200x630 Open Graph image
│   ├── fan-3d-model.glb          # 3D fan model for Three.js
│   └── icons/
│       └── (PWA icons)
│
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout with providers
│   │   ├── page.tsx              # Homepage
│   │   ├── globals.css           # Global styles
│   │   │
│   │   ├── (shop)/               # Route group for shop pages
│   │   │   ├── products/
│   │   │   │   ├── page.tsx      # All products listing
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx  # Single product detail
│   │   │   ├── category/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx  # Category products
│   │   │   ├── compare/
│   │   │   │   └── page.tsx      # Product comparison page
│   │   │   ├── cart/
│   │   │   │   └── page.tsx      # Shopping cart
│   │   │   └── checkout/
│   │   │       └── page.tsx      # Checkout form
│   │   │
│   │   ├── (info)/               # Route group for info pages
│   │   │   ├── about/
│   │   │   │   └── page.tsx
│   │   │   ├── contact/
│   │   │   │   └── page.tsx
│   │   │   ├── savings-calculator/
│   │   │   │   └── page.tsx      # Standalone calculator page
│   │   │   ├── track-order/
│   │   │   │   └── page.tsx      # Order tracking page
│   │   │   └── privacy-policy/
│   │   │       └── page.tsx
│   │   │
│   │   ├── order-confirmation/
│   │   │   └── [orderId]/
│   │   │       └── page.tsx      # Order success page
│   │   │
│   │   ├── admin/                # Admin panel
│   │   │   ├── layout.tsx        # Admin layout (auth protected)
│   │   │   ├── login/
│   │   │   │   └── page.tsx      # Admin login
│   │   │   ├── page.tsx          # Admin dashboard
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx      # Orders list
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx  # Single order detail
│   │   │   ├── products/
│   │   │   │   ├── page.tsx      # Products list
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx  # Add product
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx  # Edit product
│   │   │   ├── categories/
│   │   │   │   └── page.tsx      # Manage categories
│   │   │   ├── reviews/
│   │   │   │   └── page.tsx      # Manage reviews
│   │   │   ├── banners/
│   │   │   │   └── page.tsx      # Manage hero banners
│   │   │   ├── coupons/
│   │   │   │   └── page.tsx      # Manage coupons
│   │   │   ├── messages/
│   │   │   │   └── page.tsx      # Contact messages
│   │   │   └── settings/
│   │   │       └── page.tsx      # Site settings
│   │   │
│   │   └── api/                  # API Routes
│   │       ├── products/
│   │       │   └── route.ts
│   │       ├── orders/
│   │       │   ├── route.ts      # Create order
│   │       │   └── [id]/
│   │       │       └── route.ts  # Get/Update order
│   │       ├── track-order/
│   │       │   └── route.ts
│   │       ├── reviews/
│   │       │   └── route.ts
│   │       ├── newsletter/
│   │       │   └── route.ts
│   │       ├── contact/
│   │       │   └── route.ts
│   │       ├── coupons/
│   │       │   └── [code]/
│   │       │       └── route.ts
│   │       ├── upload/
│   │       │   └── route.ts      # Image upload to Supabase Storage
│   │       └── admin/
│   │           ├── orders/
│   │           │   └── route.ts
│   │           ├── products/
│   │           │   └── route.ts
│   │           └── dashboard-stats/
│   │               └── route.ts
│   │
│   ├── components/
│   │   ├── ui/                   # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── StarRating.tsx
│   │   │   └── Toast.tsx
│   │   │
│   │   ├── layout/               # Layout components
│   │   │   ├── Navbar.tsx        # Mobile-first top navigation
│   │   │   ├── MobileMenu.tsx    # Slide-in mobile menu
│   │   │   ├── Footer.tsx        # Footer with links
│   │   │   ├── BottomNav.tsx     # Mobile bottom navigation bar
│   │   │   └── WhatsAppButton.tsx # Floating WhatsApp button
│   │   │
│   │   ├── home/                 # Homepage sections
│   │   │   ├── HeroSection.tsx   # 3D fan hero
│   │   │   ├── FanCanvas.tsx     # Three.js 3D component
│   │   │   ├── WhyChooseUs.tsx   # Feature highlights
│   │   │   ├── FeaturedProducts.tsx
│   │   │   ├── SavingsCalculatorPreview.tsx
│   │   │   ├── StatsCounter.tsx  # Animated numbers
│   │   │   ├── Testimonials.tsx  # Customer reviews slider
│   │   │   ├── HowItWorks.tsx    # 3 step process
│   │   │   ├── CategoryShowcase.tsx
│   │   │   └── NewsletterBanner.tsx
│   │   │
│   │   ├── products/             # Product components
│   │   │   ├── ProductCard.tsx   # Grid product card
│   │   │   ├── ProductGrid.tsx   # Products grid layout
│   │   │   ├── ProductFilter.tsx # Filter sidebar
│   │   │   ├── ProductImages.tsx # Image gallery with zoom
│   │   │   ├── ProductInfo.tsx   # Product details
│   │   │   ├── ProductSpecs.tsx  # Specifications table
│   │   │   ├── AddToCartButton.tsx
│   │   │   ├── AddToCompare.tsx  # Compare button
│   │   │   └── RelatedProducts.tsx
│   │   │
│   │   ├── compare/              # Compare feature
│   │   │   ├── CompareBar.tsx    # Fixed bottom compare bar
│   │   │   ├── CompareTable.tsx  # Side by side comparison
│   │   │   └── CompareProvider.tsx
│   │   │
│   │   ├── calculator/           # Savings calculator
│   │   │   └── SavingsCalculator.tsx
│   │   │
│   │   ├── cart/                 # Cart components
│   │   │   ├── CartDrawer.tsx    # Slide-in cart
│   │   │   ├── CartItem.tsx
│   │   │   └── CartSummary.tsx
│   │   │
│   │   ├── checkout/             # Checkout components
│   │   │   ├── CheckoutForm.tsx
│   │   │   └── OrderSummary.tsx
│   │   │
│   │   └── admin/                # Admin panel components
│   │       ├── AdminSidebar.tsx
│   │       ├── AdminHeader.tsx
│   │       ├── DashboardStats.tsx
│   │       ├── OrdersTable.tsx
│   │       ├── ProductsTable.tsx
│   │       ├── ProductForm.tsx
│   │       ├── ImageUploader.tsx
│   │       ├── OrderDetail.tsx
│   │       └── ReviewsManager.tsx
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts         # Browser client
│   │   │   ├── server.ts         # Server client
│   │   │   └── admin.ts          # Admin client (service role)
│   │   ├── hooks/
│   │   │   ├── useCart.ts        # Zustand cart store
│   │   │   ├── useCompare.ts     # Zustand compare store
│   │   │   ├── useProducts.ts    # Products data hook
│   │   │   └── useOrders.ts      # Orders data hook
│   │   ├── utils/
│   │   │   ├── formatters.ts     # Price, date formatters
│   │   │   ├── orderNumber.ts    # Generate order numbers
│   │   │   └── cn.ts             # Tailwind class merger
│   │   ├── validations/
│   │   │   ├── order.schema.ts   # Zod order validation
│   │   │   └── product.schema.ts # Zod product validation
│   │   └── constants/
│   │       ├── cities.ts         # Pakistani cities list
│   │       └── calculator.ts     # Calculator constants
│   │
│   └── types/
│       ├── database.types.ts     # Auto-generated Supabase types
│       ├── product.types.ts
│       ├── order.types.ts
│       └── cart.types.ts
│
├── original-website/             # HTTrack copy (reference only)
│   └── (all scraped files)
│
├── docs/                         # This documentation folder
│
├── next.config.js
│   ├── ...
├── tailwind.config.js
├── tsconfig.json
├── .env.local
├── .env.example
├── package.json
```
