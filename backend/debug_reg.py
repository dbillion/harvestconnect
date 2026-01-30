import os
import django
from django.conf import settings

# Setup django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'harvestconnect.settings')
django.setup()

from api.serializers import RegisterSerializer

data = {
    "email": "shelluser@example.com",
    "password1": "TestPassword123!",
    "password2": "TestPassword123!",
    "first_name": "Shell",
    "last_name": "User",
    "role": "farmer"
}

serializer = RegisterSerializer(data=data)
if serializer.is_valid():
    print("Valid!")
    # user = serializer.save(None) # Needs request
else:
    print(serializer.errors)
