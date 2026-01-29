
import json
import os

JSON_FILE = '/Users/tenzinpaljor/Desktop/Norzin Consultancy/Norzin Consultancy Website/public/data/articles.json'

IMAGE_MAPPING = {
    'AI Integration': '/images/articles/ai-integration.jpg',
    'Financial Strategy': '/images/articles/financial-strategy.jpg',
    'Business Strategy': '/images/articles/business-strategy.jpg',
    'Operational Excellence': '/images/articles/operational-excellence.jpg',
    'Capacity Building': '/images/articles/capacity-building.jpg'
}

def update_images():
    if not os.path.exists(JSON_FILE):
        print(f"File not found: {JSON_FILE}")
        return

    with open(JSON_FILE, 'r') as f:
        data = json.load(f)

    articles = data.get('articles', [])
    updated_count = 0

    for article in articles:
        tags = article.get('tags', [])
        if tags:
            primary_tag = tags[0]
            if primary_tag in IMAGE_MAPPING:
                article['image'] = IMAGE_MAPPING[primary_tag]
                updated_count += 1
            else:
                # Fallback
                article['image'] = '/images/articles/capacity-building.jpg'
                updated_count += 1
    
    with open(JSON_FILE, 'w') as f:
        json.dump(data, f, indent=2)
    
    print(f"Updated images for {updated_count} articles.")

if __name__ == "__main__":
    update_images()
