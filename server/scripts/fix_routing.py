import os
import re

# Mapping of link text to slug
link_mapping = {
    "About Us": "about-us-page.html",
    "Careers": "careers-page.html",
    "Press": "press---media-page.html",
    "FAQ": "faq-page.html",
    "Contact Us": "contact-us-page.html",
    "Help Center": "help---support-page.html",
    "Terms of Service": "terms-of-service-page.html",
    "Privacy Policy": "privacy-policy-page.html",
    "Forgot Password?": "forgot-password-page.html",
    "Sign up": "signup.html",
    "Sign In": "login.html",
    "Browse Services": "services-listing-page-2.html",
    "For Helpers": "helper-dashboard.html",
}

def update_links_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace href="#" with mapped paths
    def replace_href(match):
        link_text = match.group(1)
        if link_text in link_mapping:
            slug = link_mapping[link_text]
            if filepath == 'index.html':
                return f'href="/pages/{slug}"'
            else:
                return f'href="/pages/{slug}"'
        return match.group(0)

    content = re.sub(r'href="#"([^>]*>)([^<]*)</a>', lambda m: f'href="/pages/{link_mapping.get(m.group(2), "")}"{m.group(1)}{m.group(2)}</a>' if m.group(2) in link_mapping else m.group(0), content)

    # For specific cases
    content = re.sub(r'href="forgot-password.html"', 'href="/pages/forgot-password-page.html"', content)
    content = re.sub(r'href="signup.html"', 'href="/pages/signup.html"', content)
    content = re.sub(r'href="login.html"', 'href="/pages/login.html"', content)
    content = re.sub(r'href="terms.html"', 'href="/pages/terms-of-service-page.html"', content)
    content = re.sub(r'href="privacy.html"', 'href="/pages/privacy-policy-page.html"', content)

    # For index.html header buttons, change to links
    if filepath == 'index.html':
        content = re.sub(r'<button class="flex min-w-\[84px\] max-w-\[480px\] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-background-light dark:bg-background-dark/50 text-\[#111418\] dark:text-white text-sm font-bold leading-normal tracking-\[0\.015em\] border border-input-border dark:border-primary-dark/50 hover:bg-input-bg dark:hover:bg-primary-dark/20 transition-colors">\s*<span class="truncate">Log In</span>\s*</button>', '<a href="/pages/login.html" class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-background-light dark:bg-background-dark/50 text-[#111418] dark:text-white text-sm font-bold leading-normal tracking-[0.015em] border border-input-border dark:border-primary-dark/50 hover:bg-input-bg dark:hover:bg-primary-dark/20 transition-colors"><span class="truncate">Log In</span></a>', content)
        content = re.sub(r'<button class="flex min-w-\[84px\] max-w-\[480px\] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary hover:bg-primary-dark text-white text-sm font-bold leading-normal tracking-\[0\.015em\] transition-colors shadow-sm">\s*<span class="truncate">Sign Up</span>\s*</button>', '<a href="/pages/signup.html" class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary hover:bg-primary-dark text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors shadow-sm"><span class="truncate">Sign Up</span></a>', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Updated routing in {filepath}")

# Update index.html
update_links_in_file('index.html')

# Update all pages
pages_dir = 'pages'
for filename in os.listdir(pages_dir):
    if filename.endswith('.html'):
        filepath = os.path.join(pages_dir, filename)
        update_links_in_file(filepath)

print("Routing fixed.")