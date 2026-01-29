
import os
import json
import zipfile
import re
import xml.etree.ElementTree as ET
from datetime import datetime

ARTICLES_DIR = '/Users/tenzinpaljor/Desktop/Norzin Consultancy/Norzin Consultancy Website/public/articles'
OUTPUT_FILE = '/Users/tenzinpaljor/Desktop/Norzin Consultancy/Norzin Consultancy Website/public/data/articles.json'

TAG_MAPPING = {
    'AI Integration': ['AI', 'ChatGPT', 'GPT', 'Artificial Intelligence', 'Bot'],
    'Financial Strategy': ['Financial', 'Investing', 'Budget', 'Money', 'Fixed Deposits', 'Audit', 'Emergency Fund', 'FD', 'Mutual Funds'],
    'Business Strategy': ['Business', 'Market', 'Branding', 'Scaling', 'Startup', 'Growth', 'Partnerships'],
    'Operational Excellence': ['HR', 'Teams', 'Leaders', 'SOPs', 'Systems', 'Processes', 'Productivity', 'Culture', 'Management', 'Efficiency'],
    'Capacity Building': ['Canva', 'LinkedIn', 'Skills', 'Students', 'Career', 'Workplace', 'Design', 'Resume', 'Interview', 'Professionals']
}

def get_tag(title):
    title_lower = title.lower()
    for tag, keywords in TAG_MAPPING.items():
        for keyword in keywords:
            if keyword.lower() in title_lower:
                return tag
    return 'Capacity Building' # Default fallback

def read_docx(file_path):
    try:
        with zipfile.ZipFile(file_path) as docx:
            xml_content = docx.read('word/document.xml')
            tree = ET.fromstring(xml_content)
            
            # XML namespaces
            namespaces = {
                'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
            }
            
            text_parts = []
            for p in tree.findall('.//w:p', namespaces):
                texts = [node.text for node in p.findall('.//w:t', namespaces) if node.text]
                if texts:
                    text_parts.append(''.join(texts))
            
            return text_parts
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return []

def create_html_content(paragraphs, title):
    html = ""
    clean_paragraphs = []
    
    # Filter out metadata lines
    skip_prefixes = [
        "Meta Title:", "Meta Description:", "Title:", "Primary Keyword:", 
        "Secondary Keyword:", "Focus Keyword:", "Permalink:", 
        "Suggested External Link:", "Anchor Text:", "Anchor Text for External Link:"
    ]
    
    for p in paragraphs:
        p_stripped = p.strip()
        if not p_stripped:
            continue
            
        # Check if line starts with any metadata prefix
        is_metadata = False
        for prefix in skip_prefixes:
            if p_stripped.lower().startswith(prefix.lower()):
                is_metadata = True
                break
        
        if not is_metadata:
            clean_paragraphs.append(p_stripped)

    # Remove the first paragraph if it's very similar to the main title (duplicate heading)
    if clean_paragraphs:
        first_para = clean_paragraphs[0].lower()
        main_title = title.lower()
        # Simple similarity check: if one is contained in the other or very close
        if main_title in first_para or first_para in main_title or title == clean_paragraphs[0]:
            clean_paragraphs.pop(0)

    for p in clean_paragraphs:
        if len(p) < 100 and not p.endswith('.'): # Assume headings are short and don't end in period
            html += f"<h3>{p}</h3>"
        else:
            html += f"<p>{p}</p>"
    return html

def process_articles():
    articles = []
    
    # Check if dir exists
    if not os.path.exists(ARTICLES_DIR):
        print(f"Directory not found: {ARTICLES_DIR}")
        return

    files = [f for f in os.listdir(ARTICLES_DIR) if f.endswith('.docx') and not f.startswith('~$')]
    files.sort()

    for i, filename in enumerate(files):
        print(f"Processing: {filename}")
        file_path = os.path.join(ARTICLES_DIR, filename)
        
        # Title from filename
        title = filename.replace('.docx', '')
        
        # ID from title
        article_id = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')
        
        # Tag
        tag = get_tag(title)
        
        # Content
        paragraphs = read_docx(file_path)
        content = create_html_content(paragraphs, title)
        
        # Excerpt generation safely
        # We need to re-apply the cleaning logic here or just rely on the content generation which is already done.
        # But 'content' is HTML.
        # Let's extract specific valid paragraph for excerpt.
        
        # Quick clean for excerpt
        valid_excerpt = "Click to read more..."
        skip_prefixes = [
            "Meta Title:", "Meta Description:", "Title:", "Primary Keyword:", 
            "Secondary Keyword:", "Focus Keyword:", "Permalink:", 
            "Suggested External Link:", "Anchor Text:", "Anchor Text for External Link:"
        ]
        
        for p in paragraphs:
            p_stripped = p.strip()
            if not p_stripped: continue
            
            is_metadata = False
            for prefix in skip_prefixes:
                if p_stripped.lower().startswith(prefix.lower()):
                    is_metadata = True
                    break
            
            # Additional check: Skip if it looks like the title
            if not is_metadata:
                 if title.lower() in p_stripped.lower() and len(p_stripped) < len(title) + 20: 
                     continue # likely the duplicate title
                 
                 valid_excerpt = p_stripped
                 break

        excerpt = valid_excerpt
        if len(excerpt) > 150:
            excerpt = excerpt[:147] + "..."

        # Image path (placeholder for now, will generate later)
        image_path = f"/images/articles/{article_id}.jpg"

        article = {
            "id": article_id,
            "title": title,
            "author": "Norzin Consultancy",
            "date": "2026-01-29",
            "tags": [tag],
            "image": image_path,
            "excerpt": excerpt,
            "content": content
        }
        articles.append(article)

    # Write to JSON
    with open(OUTPUT_FILE, 'w') as f:
        json.dump({"articles": articles}, f, indent=2)
    
    print(f"Successfully processed {len(articles)} articles.")

if __name__ == "__main__":
    process_articles()
