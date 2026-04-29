# 🤖 Agent Instructions - READ THIS FIRST

You are building a complete e-commerce website for **Taimoor Fans**, a Pakistani fan manufacturer.

## Your Mission
Build a world-class Next.js e-commerce website that is:
- Mobile-first (most important)
- Blazing fast
- Visually stunning with smooth animations
- Conversion-optimized
- SEO and AEO optimized

## Read Order (MANDATORY before coding)
1. Read `docs/00-PROJECT-OVERVIEW.md` - understand the project
2. Read `docs/01-TECH-STACK.md` - understand the tools
3. Read `docs/02-DATABASE-SCHEMA.md` - run this SQL first in Supabase
4. Read `docs/03-PROJECT-STRUCTURE.md` - create this folder structure
5. Read `docs/04-USER-WEBSITE.md` - build user pages
6. Read `docs/05-ADMIN-PANEL.md` - build admin panel
7. Read `docs/06-FEATURES-SPEC.md` - implement special features
8. Read `docs/07-SEO-AEO-STRATEGY.md` - add SEO throughout
9. Read `docs/08-ANIMATIONS-UI.md` - implement design system
10. Read `docs/09-DATA-MIGRATION.md` - migrate from original site
11. Read `docs/10-DEPLOYMENT.md` - prepare for deployment

## Reference Material
The folder `original-website/` contains the HTTrack copy of their current website.
Use it to:
- Extract all product information (names, prices, descriptions, specs)
- Get all product images
- Understand their category structure
- Copy any important company information

## Build Order (Follow Exactly)
1. Set up Next.js project with all dependencies from `docs/01-TECH-STACK.md`
2. Create folder structure from `docs/03-PROJECT-STRUCTURE.md`
3. Set up Supabase client (`src/lib/supabase/`)
4. Implement design system (colors, fonts, base components in `src/components/ui/`)
5. Build Layout components (Navbar, Footer, BottomNav)
6. Build Homepage sections one by one
7. Build Products listing page
8. Build Product detail page
9. Build Compare feature
10. Build Savings Calculator
11. Build Cart + Checkout
12. Build Admin Panel
13. Add SEO metadata to all pages
14. Add JSON-LD structured data
15. Run data migration from original-website folder
16. Performance optimization pass
17. Generate sitemap

## Critical Rules
- ALWAYS use TypeScript with proper types
- ALWAYS make components mobile-first (design for 375px width first)
- ALWAYS lazy load images with next/image
- ALWAYS add loading states to all async operations
- ALWAYS validate forms with Zod
- NEVER use any (TypeScript)
- NEVER skip error handling in API routes
- ALWAYS test the WhatsApp link format
- The 3D fan should have a CSS fallback for devices without WebGL

## Pakistan-Specific Requirements
- Display all prices in PKR format: "PKR 12,500"
- Phone number format: +92-XXX-XXXXXXX
- Include major Pakistani cities in city dropdown
- Cash on Delivery must be the DEFAULT payment method
- WhatsApp is more important than email for customer contact
- The website should feel fast even on slow 3G connections

## Design Requirements
- Primary green: #00A86B
- Secondary navy: #1E3A5F
- All animations use Framer Motion
- 3D fan uses React Three Fiber
- Smooth, professional, premium feel
- NOT cheap or cluttered

## When You Are Stuck
- Look at the original website in `original-website/` folder for content
- Refer to the specific docs file for that feature
- Prioritize mobile layout in all decisions
- When in doubt, make it simpler and faster

## Success Criteria
The website is done when:
✅ Homepage loads in under 2 seconds on mobile
✅ All products from original site are migrated
✅ Comparison feature works (add 2 products, compare side by side)
✅ Savings calculator works with correct math
✅ Orders can be placed and appear in admin panel
✅ Admin can update order status
✅ Admin can add/edit products
✅ Lighthouse mobile score is 90+
✅ All pages have correct meta titles and descriptions
✅ Structured data validates in Google's Rich Results Test
