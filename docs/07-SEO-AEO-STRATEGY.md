# 🔍 SEO + Answer Engine Optimization Strategy

## Technical SEO

### Metadata (Next.js Metadata API)
Every page has unique metadata:

```typescript
// Homepage
export const metadata: Metadata = {
  title: 'Taimoor Fans - Pakistan\'s Best 30W Energy Saving Fans | Official Store',
  description: 'Buy Taimoor Fans online in Pakistan. Energy-efficient 30W BLDC ceiling fans that save 60% electricity. Free delivery. 2 year warranty. Order now!',
  keywords: ['taimoor fans', 'energy saving fans pakistan', '30 watt fans', 
             'bijli bachane wala fan', 'BLDC fan pakistan', 'taimoor fans price'],
  openGraph: {
    title: 'Taimoor Fans - Pakistan\'s Best Energy Saving Fans',
    description: '...',
    images: ['/og-image.jpg'],
    type: 'website',
    locale: 'en_PK',
  },
  twitter: {
    card: 'summary_large_image',
    title: '...',
  },
  alternates: {
    canonical: 'https://www.tamoorfans.com',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Product pages - dynamic
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.slug);
  return {
    title: `${product.name} - Buy Online | Taimoor Fans Pakistan`,
    description: `Buy ${product.name} at PKR ${product.price}. ${product.short_description}. Free delivery across Pakistan. 2-year warranty.`,
    openGraph: {
      images: [product.primary_image],
    },
  };
}
```

### JSON-LD Structured Data

**Product Page Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Taimoor 56\" Ceiling Fan 30W",
  "image": ["https://..."],
  "description": "Energy efficient 30W BLDC ceiling fan...",
  "brand": {
    "@type": "Brand",
    "name": "Taimoor Fans"
  },
  "sku": "TF-CF-56-30W",
  "offers": {
    "@type": "Offer",
    "url": "https://...",
    "priceCurrency": "PKR",
    "price": "12500",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Taimoor Fans"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "234"
  }
}
```

**Homepage Organization Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Taimoor Fans",
  "url": "https://www.tamoorfans.com",
  "logo": "https://...",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+92-XXX-XXXXXXX",
    "contactType": "customer service",
    "areaServed": "PK",
    "availableLanguage": ["English", "Urdu"]
  },
  "sameAs": [
    "https://facebook.com/...",
    "https://instagram.com/..."
  ]
}
```

**FAQ Schema (for AI Overview):**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much electricity does Taimoor Fan use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Taimoor fans use only 30 watts of electricity, compared to traditional ceiling fans that use 60-75 watts. This makes Taimoor fans 60% more energy efficient."
      }
    },
    {
      "@type": "Question", 
      "name": "How much can I save with Taimoor energy saving fans?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "With Taimoor 30W fans running 12 hours per day at PKR 50/unit, you save approximately PKR 8,000-10,000 per fan annually compared to traditional 75W fans."
      }
    },
    {
      "@type": "Question",
      "name": "Do Taimoor fans deliver all over Pakistan?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Taimoor Fans delivers to all cities in Pakistan including Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan and all other cities."
      }
    },
    {
      "@type": "Question",
      "name": "What is the warranty on Taimoor fans?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Taimoor fans come with a 2-year manufacturer warranty covering all manufacturing defects."
      }
    },
    {
      "@type": "Question",
      "name": "What is the price of Taimoor fans in Pakistan 2024?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Taimoor fans are available from PKR 8,000 to PKR 20,000 depending on the model and size."
      }
    }
  ]
}
```

### Sitemap (next-sitemap config)
```javascript
// next-sitemap.config.js
module.exports = {
  siteUrl: 'https://www.tamoorfans.com',
  generateRobotsTxt: true,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 7000,
  additionalPaths: async (config) => {
    // Add all product paths dynamically
    const products = await fetchAllProducts();
    return products.map(p => ({
      loc: `/products/${p.slug}`,
      lastmod: p.updated_at,
      priority: 0.9,
    }));
  },
};
```

## Content Strategy for AEO (Answer Engine Optimization)

### Target Questions (that AI models answer):
1. "best energy saving fans in pakistan"
2. "30 watt fan price in pakistan"
3. "bijli bachane wala fan kaun sa hai"
4. "taimoor fans price list 2024"
5. "best ceiling fan for pakistan electricity load shedding"
6. "BLDC fan vs normal fan comparison"
7. "how much electricity does a ceiling fan use in pakistan"

### Content Pages to Create:
1. **/blog/energy-saving-fans-pakistan** 
   "Complete Guide to Energy Saving Fans in Pakistan 2024"
   
2. **/blog/30-watt-vs-75-watt-fan**
   "30W vs 75W Fan: Real Cost Comparison with Pakistan Electricity Rates"
   
3. **/blog/bldc-fan-technology**
   "What is BLDC Fan Technology and Why it Saves Electricity"

4. **/savings-calculator** (already planned)
   This page itself answers "how much will I save" questions

### On-Page Content Requirements:
- Use question phrases naturally in headings
- Include Pakistani cities in product pages ("Delivery to Lahore, Karachi...")
- Add Urdu transliterations for key terms
- Write product descriptions answering: What is it? Why buy it? How does it save money?
- Include specific numbers: "30 watts", "60% savings", "PKR 8,000/year"

### URL Structure:
```
/products/                              # All products
/products/ceiling-fans-30w-56-inch      # Specific product
/category/ceiling-fans                  # Category
/savings-calculator                     # Calculator tool
/blog/                                  # Content hub
```

## Performance SEO (Core Web Vitals)

### Targets:
- LCP (Largest Contentful Paint): < 2.5s
- FID/INP: < 200ms
- CLS: < 0.1

### Implementation:
- Use next/image for ALL images
- Preload hero image
- Defer non-critical JavaScript
- Use ISR (Incremental Static Regeneration) for product pages
- Revalidate: 3600 (1 hour) for products
- CSS critical path inlined

```typescript
// Product page with ISR
export const revalidate = 3600;

// Homepage with ISR  
export const revalidate = 1800;
```

## Local SEO for Pakistan

### Include on Contact/About pages:
- Full physical address
- Pakistan phone format (+92)
- Service areas: All major cities
- Business hours in PKT timezone

### Google Business Profile:
- Note in README for client to update
- Same NAP (Name, Address, Phone) everywhere
