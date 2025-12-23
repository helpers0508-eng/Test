import os
import re

# Define role mappings
user_pages = [
    'user-dashboard-2.html',
    'user-bookings-page.html',
    'user-profile-page.html',
    'search-results-page-2.html',
    'service-details-page-2.html',
    'services-listing-page-2.html',
    'settings-page.html',
    'notifications-page.html'
]

helper_pages = [
    'helper-dashboard.html',
    'helper-bookings-page.html',
    'helper-profile-page.html',
    'helper-earnings-page.html',
    'helper-availability-page.html',
    'helper-registration-2.html'
]

admin_pages = [
    'admin-dashboard.html',
    'admin-users-management.html',
    'admin-helpers-management.html',
    'admin-bookings-management.html',
    'admin-services-management.html',
    'admin-payments-management.html',
    'admin-reviews-moderation.html',
    'admin-login-page.html'
]

def add_role_to_file(filepath, role):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace <body with <body data-role="role"
    content = re.sub(r'<body([^>]*)>', f'<body data-role="{role}"\\1>', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Added data-role='{role}' to {filepath}")

pages_dir = 'pages'

for filename in os.listdir(pages_dir):
    if filename in user_pages:
        add_role_to_file(os.path.join(pages_dir, filename), 'user')
    elif filename in helper_pages:
        add_role_to_file(os.path.join(pages_dir, filename), 'helper')
    elif filename in admin_pages:
        add_role_to_file(os.path.join(pages_dir, filename), 'admin')

print("Role markers added.")