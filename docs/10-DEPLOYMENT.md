# 🚀 Deployment Guide

## Vercel Deployment

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: Taimoor Fans website"
git remote add origin https://github.com/yourusername/taimoor-fans.git
git push -u origin main
```

### Step 2: Connect to Vercel
1. Go to vercel.com
2. Import GitHub repository
3. Framework: Next.js (auto-detected)
4. Add Environment Variables:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - RESEND_API_KEY
   - NEXT_PUBLIC_SITE_URL
   - NEXT_PUBLIC_GA_ID

### Step 3: Domain Configuration
```
In Vercel dashboard:
- Add custom domain
- Update DNS records at domain registrar
- Vercel auto-provisions SSL

In Supabase dashboard:
- Add domain to allowed origins
- Update Auth redirect URLs
```

## Performance Checklist

```
Before going live, verify:
□ Lighthouse score 90+ on mobile
□ All images in WebP format
□ No console errors
□ All forms submit correctly
□ WhatsApp links work
□ Order placement end-to-end tested
□ Admin panel login works
□ Product images load correctly
□ Sitemap generated at /sitemap.xml
□ robots.txt at /robots.txt
□ OG images show correctly (test with og:debugger)
□ Structured data validates (Google Rich Results Test)
□ All redirects from old site set up (if same domain)
```

## next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
    formats: ['image/webp'],
  },
  compress: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

## Supabase Production Setup

```
1. Create new Supabase project for production
2. Run all SQL from 02-DATABASE-SCHEMA.md
3. Create storage buckets
4. Set up email auth for admin
5. Run seed script with production Supabase credentials
6. Test all RLS policies
7. Enable Supabase realtime for admin orders page (optional)
```

## Post-Launch

### Week 1:
- Monitor Vercel analytics
- Check for any errors in Vercel logs
- Submit sitemap to Google Search Console
- Submit sitemap to Bing Webmaster Tools
- Set up Google Analytics 4

### Week 2:
- Check Core Web Vitals in Search Console
- Monitor order flow
- Get client feedback and fix issues

### Ongoing:
- Update ISR revalidation times based on content update frequency
- Monitor Supabase usage (free tier limits)
- Regular content updates for SEO
