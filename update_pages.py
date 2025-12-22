import os
import re

pages_dir = 'pages'

# Read the standard head content from index.html
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()
    # Extract the head section
    head_match = re.search(r'<head>(.*?)</head>', content, re.DOTALL)
    if head_match:
        standard_head = head_match.group(1).strip()
    else:
        print("Could not find head in index.html")
        exit(1)

# Function to update a single HTML file
def update_html_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove inline <style> blocks
    content = re.sub(r'<style[^>]*>.*?</style>', '', content, flags=re.DOTALL | re.IGNORECASE)

    # Remove inline <script id="tailwind-config">
    content = re.sub(r'<script[^>]*id="tailwind-config"[^>]*>.*?</script>', '', content, flags=re.DOTALL | re.IGNORECASE)

    # Determine the path prefix
    if filepath.startswith('pages/'):
        prefix = '../'
    else:
        prefix = ''

    # Modify standard head for correct paths
    modified_head = standard_head.replace('href="assets/', f'href="{prefix}assets/')
    modified_head = modified_head.replace('src="assets/', f'src="{prefix}assets/')

    # Replace the head with the modified head
    content = re.sub(r'<head>.*?</head>', f'<head>\n{modified_head}\n</head>', content, flags=re.DOTALL | re.IGNORECASE)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Updated {filepath}")

# Update all HTML files in pages/
for filename in os.listdir(pages_dir):
    if filename.endswith('.html'):
        filepath = os.path.join(pages_dir, filename)
        update_html_file(filepath)

print("All pages updated.")