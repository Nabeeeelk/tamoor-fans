import os
import re

products_dir = r"f:\taimoor fans\original-website\taimoor fans original\www.tamoorfans.com\products"
output_file = r"f:\taimoor fans\src\lib\constants\product_images_extracted.txt"

image_mapping = []

if not os.path.exists(products_dir):
    print(f"Directory not found: {products_dir}")
    exit(1)

for filename in os.listdir(products_dir):
    if filename.endswith(".html"):
        filepath = os.path.join(products_dir, filename)
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
                # Extract title
                title_match = re.search(r'<title>\s*(.*?)\s*&ndash; Tamoor Fans</title>', content, re.IGNORECASE | re.DOTALL)
                title = title_match.group(1).strip() if title_match else filename.replace('.html', '')
                
                # Extract og:image
                image_match = re.search(r'<meta property="og:image" content="(.*?)"', content, re.IGNORECASE)
                image_url = image_match.group(1) if image_match else None
                
                if image_url:
                    # Clean URL if it's relative
                    if image_url.startswith('../'):
                        image_url = "https://www.tamoorfans.com" + image_url.replace('../', '/')
                    
                    image_mapping.append(f"{title}|{image_url}")
        except Exception as e:
            print(f"Error reading {filename}: {e}")

with open(output_file, 'w', encoding='utf-8') as f:
    f.write("\n".join(image_mapping))

print(f"Extracted {len(image_mapping)} image mappings to {output_file}")
