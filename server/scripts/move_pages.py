import os
import shutil
import re

frontend_dir = 'frontend'
pages_dir = 'pages'

if not os.path.exists(pages_dir):
    os.makedirs(pages_dir)

for root, dirs, files in os.walk(frontend_dir):
    for file in files:
        if file == 'code.html':
            # Get the relative path
            rel_path = os.path.relpath(root, frontend_dir)
            # Slugify the name
            slug = re.sub(r'[^a-zA-Z0-9]', '-', rel_path).strip('-').lower()
            if not slug:
                slug = 'page'
            new_file = f"{slug}.html"
            src = os.path.join(root, file)
            dst = os.path.join(pages_dir, new_file)
            shutil.copy(src, dst)
            print(f"Copied {src} to {dst}")