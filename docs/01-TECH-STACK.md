# 🛠 Tech Stack Specification

## Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v3 + Custom CSS Variables
- **Animations:** Framer Motion + Three.js (for 3D fan)
- **Icons:** Lucide React + React Icons
- **Font:** Inter (body) + Poppins (headings) - Google Fonts
- **Image Optimization:** Next.js built-in Image component

## Backend / API
- **API Routes:** Next.js App Router API Routes
- **Authentication:** Supabase Auth (admin panel)
- **File Storage:** Supabase Storage (product images)
- **Email:** Resend (order confirmations, contact forms)

## Database
- **Primary DB:** Supabase (PostgreSQL)
- **ORM:** Supabase JS Client (no heavy ORM needed)
- **Caching:** Next.js fetch caching + ISR

## 3D & Animations
- **3D Graphics:** Three.js + React Three Fiber + Drei
- **Page Animations:** Framer Motion
- **Scroll Animations:** Framer Motion viewport
- **Loading:** Custom fan-spin loader

## SEO & Performance
- **SEO:** Next.js Metadata API
- **Structured Data:** JSON-LD schemas
- **Sitemap:** next-sitemap
- **Analytics:** Vercel Analytics + Google Analytics 4

## Deployment
- **Hosting:** Vercel (Pro plan recommended)
- **Database:** Supabase (Free tier to start)
- **Domain:** Client's existing domain or new one
- **CDN:** Vercel Edge Network (automatic)

## Development Tools
- **Package Manager:** npm
- **Linting:** ESLint + Prettier
- **Git:** GitHub repository

## Package List (package.json dependencies)
```json
{
  "dependencies": {
    "next": "14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "typescript": "^5.4.0",
    "@supabase/supabase-js": "^2.43.0",
    "@supabase/ssr": "^0.4.0",
    "framer-motion": "^11.2.0",
    "three": "^0.165.0",
    "@react-three/fiber": "^8.16.0",
    "@react-three/drei": "^9.105.0",
    "tailwindcss": "^3.4.0",
    "lucide-react": "^0.379.0",
    "react-icons": "^5.2.0",
    "resend": "^3.2.0",
    "next-sitemap": "^4.2.3",
    "@vercel/analytics": "^1.3.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.3.0",
    "react-hot-toast": "^2.4.1",
    "zustand": "^4.5.2",
    "react-hook-form": "^7.51.0",
    "zod": "^3.23.0",
    "@hookform/resolvers": "^3.4.0",
    "sharp": "^0.33.0"
  }
}
```

## Environment Variables Required
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Email
RESEND_API_KEY=your_resend_api_key

# App
NEXT_PUBLIC_SITE_URL=https://www.tamoorfans.com
NEXT_PUBLIC_GA_ID=your_google_analytics_id

# Admin
ADMIN_SECRET=your_admin_secret_key
```
