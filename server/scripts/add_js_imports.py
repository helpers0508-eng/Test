import os

# Common JS files for all pages
common_js = [
    '../assets/js/ui.js'
]

# Page-specific JS
page_js = {
    'login.html': ['../assets/js/auth.js', '../assets/js/forms.js'],
    'signup.html': ['../assets/js/auth.js', '../assets/js/forms.js'],
    'forgot-password-page.html': ['../assets/js/auth.js', '../assets/js/forms.js'],
    'otp-verification-page.html': ['../assets/js/auth.js', '../assets/js/forms.js'],
    'user-dashboard-2.html': ['../assets/js/auth.js'],
    'helper-dashboard.html': ['../assets/js/auth.js'],
    'admin-dashboard.html': ['../assets/js/auth.js'],
    'services-listing-page-2.html': ['../assets/js/booking.js'],
    'service-details-page-2.html': ['../assets/js/booking.js'],
    'booking-flow---service-selection-2.html': ['../assets/js/booking.js'],
    'booking-confirmation-page-2.html': ['../assets/js/booking.js']
}

def add_js_to_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the closing </head> tag
    head_end = content.find('</head>')
    if head_end == -1:
        return

    # Get page filename
    filename = os.path.basename(filepath)

    # Collect JS files for this page
    js_files = common_js.copy()
    if filename in page_js:
        js_files.extend(page_js[filename])

    # Create script tags
    script_tags = '\n'.join([f'<script src="{js_file}"></script>' for js_file in js_files])

    # Insert before </head>
    new_content = content[:head_end] + script_tags + '\n' + content[head_end:]

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"Added JS imports to {filepath}")

# Add to index.html
add_js_to_file('index.html')

# Add to all pages
pages_dir = 'pages'
for filename in os.listdir(pages_dir):
    if filename.endswith('.html'):
        filepath = os.path.join(pages_dir, filename)
        add_js_to_file(filepath)

print("JS imports added to all pages.")