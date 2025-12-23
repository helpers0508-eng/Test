import os
import re

pages_dir = 'pages'

for filename in os.listdir(pages_dir):
    if filename.endswith('.html'):
        filepath = os.path.join(pages_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        content = content.replace('href="assets/', 'href="../assets/')
        content = content.replace('src="assets/', 'src="../assets/')
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed {filepath}")