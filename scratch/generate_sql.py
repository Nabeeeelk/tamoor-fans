import json
import re

# Load extracted images
extracted_images_file = r"f:\taimoor fans\src\lib\constants\product_images_extracted.txt"
with open(extracted_images_file, 'r', encoding='utf-8') as f:
    extracted_data = [line.strip().rsplit('|', 1) for line in f if '|' in line]

# Load database products
# Format: [{"id":"...", "name":"..."}, ...]
db_products_raw = """
[{"id":"3e58022b-25bd-4126-9536-31d489424ea1","name":"Antique Fancy 4 Bladed"},{"id":"eaaaacd0-0201-4085-a4be-f7fc5bcdf5a5","name":"Antique Model"},{"id":"0f748b5d-5d41-4eef-afe1-96af4e83e0bf","name":"Classic Model"},{"id":"ca614df4-bf70-4a34-9b5d-15972204ceb2","name":"Diamond Model"},{"id":"9a453d0d-720c-42fb-bd6c-1cdabbc17f3c","name":"Eco"},{"id":"901d24c8-43b4-4235-a236-10843622935e","name":"Eco Smart"},{"id":"7656879c-e9f8-4abf-bd88-966dd0b1dace","name":"ECO"},{"id":"e60198b8-7746-441c-8f96-5fd636c31e0d","name":"Eco Supreme Model 20\\\""},{"id":"0682537e-f16a-4dee-ac4b-78a3d0bd5610","name":"Eco Supreme Model 24\\\""},{"id":"b0b9552d-5c31-417c-8b2a-26f61f07b0db","name":"Executive Fancy Pedestal Fan"},{"id":"251fb62f-6ccf-4c6c-b1a5-3dbabf91847e","name":"Antique Model AC/DC Inverter Fan"},{"id":"c847dfcf-2f3f-4de0-b872-a34175c98e65","name":"Eco Smart Digital Remote Fan"},{"id":"6e6fcd67-6a83-47ab-abfe-c9fa7fb1f440","name":"Galaxy Model AC/DC Ceiling Fan"},{"id":"7056ca99-1241-49e5-9ea8-ea7b80bc9c5a","name":"Galaxy Model"},{"id":"ed8263d0-4876-47eb-81d0-775954aa92c4","name":"Galaxy Model"},{"id":"244376ec-7eca-4aa6-acdf-7397b891e8d7","name":"Glamour Plus Model"},{"id":"277f5477-a290-4260-9dae-88e1d48b32df","name":"Glamour Steel Model"},{"id":"20ecfd06-ce01-416b-812d-0813a1a45c5f","name":"Magnetron HVLS Industrial"},{"id":"7a6fb45c-23f6-4b31-b4fa-410f75549114","name":"Magnum Model"},{"id":"eee2e7a4-232d-43a9-9e5e-8f03f09bb66a","name":"Magnum Model"},{"id":"b26e263e-9ff6-42f5-adac-97933997ee6d","name":"Magnum Model"},{"id":"95a10876-cc9e-4a14-a659-fa26c4fba451","name":"Mega Bracket 20\\\""},{"id":"f3a9528f-fc55-42fe-8b6f-b5292b39fea6","name":"Nebula Model"},{"id":"f7a175d0-1910-48d3-b49d-eff1b8f45742","name":"Executive Model"},{"id":"5c645d8d-e145-41c6-829f-c8c8109dc283","name":"Antique Model"},{"id":"c1f24332-01f4-4e93-b658-e0b3c5b48272","name":"Executive Plus Model"},{"id":"1b6adf12-b248-4c5d-92c8-0d7e8c8444ba","name":"Nova Model"},{"id":"3fbc140f-3801-47d7-a972-b68c2ac1a58b","name":"Ovate Luminous Model"},{"id":"5b8b7dd9-8373-49e2-b2f0-7bcc967143d6","name":"Ovate Metal Model"},{"id":"164de1a5-cb60-4689-ae1a-d1dc4c916b41","name":"Ovate Plus Model"},{"id":"c542ef94-999c-4441-b44f-0c793e88b3a1","name":"Prism Model"},{"id":"6cf74d45-0d6f-4950-97b0-46eb6c32116a","name":"Prism Model"},{"id":"b378bde6-09ff-4568-891d-2068ac317942","name":"Sapphire Model"},{"id":"43bcf3e6-6191-40b2-a3e9-978bafc4d62a","name":"Penta Grace Model"},{"id":"97922c6c-e85a-4ff9-b26b-289a25f63d29","name":"Sentinal Model"},{"id":"24d58f2b-49da-4f1a-a26d-ba1cce637279","name":"Skimmer (Madani) Heavy Duty"},{"id":"2d461df0-c32e-44f9-86b0-3fff47303319","name":"Super Pearl Fancy Model"},{"id":"c1e5fc93-b52c-42b4-a426-e62d5247dada","name":"Super Pearl Fancy Model"},{"id":"682a3cbd-0b68-444b-93a0-e41ae7611bc7","name":"Pearl Model"},{"id":"2bef5660-e0cb-489f-afa7-8cb063d152f9","name":"Super Pearl Model"},{"id":"0621e778-8979-4053-910f-7f1e8c4f01e5","name":"Tamoor Smart Air Purifier"},{"id":"f0a4beba-ff42-46d1-8e06-a691f1cf8fa2","name":"Vortex Rechargeable Model"},{"id":"ece2f4f5-45a2-407a-850f-2a610d52fb32","name":"Water Proof Model"},{"id":"65ce7669-4491-4e2b-97f9-b38d8b2b0710","name":"AC/DC Series"},{"id":"bd1a4593-67d4-4819-86a9-bd07422b06f6","name":"AC/DC RF Circuit"},{"id":"cf081bfc-6364-4f97-9af8-e4bbbe4d7d9b","name":"Sober Model"},{"id":"55c72928-3782-4d50-95b1-b03b3353a3a7","name":"Tamoor Intelligent Air Purifier"},{"id":"d13f11f4-b41c-48e7-bebc-9edb2a14afb0","name":"Water Proof Model"},{"id":"bc7836db-37e3-47ee-8d42-975cf1c2d93e","name":"Eco"},{"id":"14acd14d-9454-489b-9282-e85892820ea7","name":"AC/DC 20'' KIT"},{"id":"0a3a0616-0b78-44e7-aa71-1c2108af5d1e","name":"Marvel Model"},{"id":"ab96da10-afaa-442d-8f41-02f2e7bd5231","name":"AC/DC 24’’ Pedestal Circuit"},{"id":"dc087b60-506f-4a2c-ab5a-e184d544fd6c","name":"Air Purifier"},{"id":"8b3c3d2f-d69f-42c1-854b-5aed378e3067","name":"Air Purifier"},{"id":"f2ebf1e0-3c68-4056-b83f-dd82ca89a019","name":"DC BLDC Circuit Kit"},{"id":"f7fcfb03-d5bf-4007-9ccd-a36d6a302aa4","name":"Nimbus Model"},{"id":"8a613ae0-4ea8-4b68-a4df-855238a41dae","name":"Mega Bracket 24\\\"\"},{\"id\":\"f41cdf1a-402e-42d0-b4d9-fb4fcc25d944\",\"name\":\"Executive Fancy Model\"},{\"id\":\"c6977b3f-66ad-4738-8a14-8624b6654e66\",\"name\":\"Nova Brave Model\"},{\"id\":\"edea5b69-7538-4a7b-8bde-db1a69572b1c\",\"name\":\"Penta Fancy Model\"},{\"id\":\"ec526524-acbd-4937-9f04-02be44bf473d\",\"name\":\"Sober Model\"},{\"id\":\"fd1712e8-661f-4ffa-bf29-7bfb18ab33f2\",\"name\":\"Tamoor Washing & Drying Machine\"},{\"id\":\"45f712da-128b-4e9a-a058-a85bc48999d8\",\"name\":\"Executive Model\"},{\"id\":\"e925d33d-c416-40e2-8ab9-5caf7d49573e\",\"name\":\"Executive Model\"},{\"id\":\"e569d930-e25b-45c4-8e6f-df1b133e4ae4\",\"name\":\"Ovate Steel Model\"}]
"""
db_products = json.loads(db_products_raw)

def normalize(s):
    # Remove special chars and lowercase
    s = s.replace("&#39;", "'").replace("&quot;", '"').replace("&amp;", "&")
    return re.sub(r'[^a-z0-9]', '', s.lower())

# Match them
sql_updates = []
used_ids = set()

for title, image_url in extracted_data:
    norm_title = normalize(title)
    
    # Try exact match first
    matched = False
    for p in db_products:
        if normalize(p['name']) == norm_title:
            sql_updates.append(f"UPDATE products SET image_url = '{image_url}' WHERE id = '{p['id']}';")
            used_ids.add(p['id'])
            matched = True
            # Don't break, some products might share same name in different categories but we'll update all for now
            
    if not matched:
        # Try partial match or special cases
        for p in db_products:
            norm_db = normalize(p['name'])
            if norm_title in norm_db or norm_db in norm_title:
                if p['id'] not in used_ids:
                    sql_updates.append(f"UPDATE products SET image_url = '{image_url}' WHERE id = '{p['id']}';")
                    used_ids.add(p['id'])
                    matched = True
                    break

# Special cases if still missing
# ...

output_sql = r"f:\taimoor fans\scratch\update_images.sql"
with open(output_sql, 'w', encoding='utf-8') as f:
    f.write("\n".join(sql_updates))

print(f"Generated {len(sql_updates)} update statements to {output_sql}")
