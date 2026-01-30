import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'harvestconnect.settings')
django.setup()

from django.contrib.sites.models import Site
from allauth.socialaccount.models import SocialApp
from decouple import config

def setup_social_apps():
    # Ensure site exists
    site, _ = Site.objects.get_or_create(id=1, defaults={'domain': 'localhost:3000', 'name': 'HarvestConnect'})
    
    # Setup Google
    google_id = config('GOOGLE_OAUTH2_CLIENT_ID', default='')
    google_secret = config('GOOGLE_OAUTH2_CLIENT_SECRET', default='')
    
    if google_id and google_secret:
        app, created = SocialApp.objects.get_or_create(
            provider='google',
            defaults={
                'name': 'Google Login',
                'client_id': google_id,
                'secret': google_secret,
            }
        )
        if not created:
            app.client_id = google_id
            app.secret = google_secret
            app.save()
        app.sites.add(site)
        print("Google SocialApp configured.")

    # Setup GitHub
    github_id = config('GITHUB_OAUTH2_CLIENT_ID', default='')
    github_secret = config('GITHUB_OAUTH2_CLIENT_SECRET', default='')
    
    if github_id and github_secret:
        app, created = SocialApp.objects.get_or_create(
            provider='github',
            defaults={
                'name': 'GitHub Login',
                'client_id': github_id,
                'secret': github_secret,
            }
        )
        if not created:
            app.client_id = github_id
            app.secret = github_secret
            app.save()
        app.sites.add(site)
        print("GitHub SocialApp configured.")

if __name__ == "__main__":
    setup_social_apps()
