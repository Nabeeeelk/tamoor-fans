const fs = require('fs');
const path = require('path');

// Basic HTML entity decoder
function decodeEntities(text) {
  if (!text) return '';
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&#x3D;/g, '=')
    .replace(/&#x60;/g, '`')
    .replace(/&ndash;/g, '-')
    .replace(/&mdash;/g, '-')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const productsDir = 'f:\\taimoor fans\\original-website\\taimoor fans original\\www.tamoorfans.com\\products';
const cdnDir = 'f:\\taimoor fans\\original-website\\taimoor fans original\\cdn.shopify.com\\s\\files\\1\\0856\\7767\\0720\\files';

const files = fs.readdirSync(productsDir).filter(f => f.endsWith('.html'));
const cdnFiles = fs.existsSync(cdnDir) ? fs.readdirSync(cdnDir) : [];

const products = [];

files.forEach((file) => {
  const filePath = path.join(productsDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');

  // Extract Name from <title> or og:title
  let name = '';
  const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/i);
  if (titleMatch) {
    name = titleMatch[1].split(/[–|-]/)[0].trim();
  }
  if (!name) {
    const ogTitleMatch = content.match(/property="og:title"\s+content="(.*?)"/i);
    if (ogTitleMatch) name = ogTitleMatch[1];
  }
  name = decodeEntities(name).replace(' - Tamoor Fans', '').trim();

  // Extract Price from og:price:amount or JSON-LD
  let price = 0;
  const ogPriceMatch = content.match(/property="og:price:amount"\s+content="([\d.,]+)"/i);
  if (ogPriceMatch) {
    price = parseFloat(ogPriceMatch[1].replace(/,/g, ''));
  }

  if (price === 0) {
    const jsonLdMatch = content.match(/<script type=['"]application\/ld\+json['"]>([\s\S]*?)<\/script>/i);
    if (jsonLdMatch) {
      try {
        const json = JSON.parse(jsonLdMatch[1]);
        const offers = Array.isArray(json) ? json[0].offers : json.offers;
        if (offers && offers.price) price = parseFloat(offers.price);
      } catch (e) {}
    }
  }

  // Extract Description from og:description or meta description
  let description = '';
  const ogDescMatch = content.match(/property="og:description"\s+content="(.*?)"/i);
  if (ogDescMatch) description = ogDescMatch[1];
  if (!description) {
    const metaDescMatch = content.match(/name="description"\s+content="(.*?)"/i);
    if (metaDescMatch) description = metaDescMatch[1];
  }
  description = decodeEntities(description);

  // Extract Image
  let fullImageUrl = '';
  const ogImageMatch = content.match(/property="og:image"\s+content="(.*?)"/i);
  if (ogImageMatch) fullImageUrl = ogImageMatch[1];
  const localFilename = fullImageUrl ? path.basename(fullImageUrl.split('?')[0]) : '';

  let verifiedLocalPath = null;
  if (localFilename) {
    if (cdnFiles.includes(localFilename)) {
      verifiedLocalPath = localFilename;
    } else {
      const baseName = localFilename.split('_')[0];
      const match = cdnFiles.find(f => f.startsWith(baseName) && (f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.webp')));
      if (match) verifiedLocalPath = match;
    }
  }

  // Extract Category
  let category = 'Uncategorized';
  const catMatch = content.match(/item_category:\s*"(.*?)"/i);
  if (catMatch) category = decodeEntities(catMatch[1]);

  const slug = file.replace('.html', '');

  if (name && (price > 0 || slug.includes('circuit') || slug.includes('remote'))) {
    products.push({
      name,
      slug,
      price: price || 0,
      description,
      category,
      originalImageUrl: fullImageUrl,
      localFilename: verifiedLocalPath || localFilename,
      imageFound: !!verifiedLocalPath
    });
  }
});

const uniqueProducts = Array.from(new Map(products.map(p => [p.slug, p])).values());
fs.writeFileSync('f:\\taimoor fans\\scratch\\scraped_products.json', JSON.stringify(uniqueProducts, null, 2));
console.log(`Extracted ${uniqueProducts.length} unique products.`);
console.log(`Images found: ${uniqueProducts.filter(p => p.imageFound).length}/${uniqueProducts.length}`);
