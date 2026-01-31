import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'harvestconnect.settings')
django.setup()

from api.models import ChatRoom
from api.serializers import ChatRoomSerializer
from django.contrib.auth.models import User

def test_serializer():
    user = User.objects.first()
    data = {
        'name': 'jude',
        'church': 'Test Church',
        'location': 'Test Location',
        'room_type': 'group'
    }
    serializer = ChatRoomSerializer(data=data)
    if serializer.is_valid():
        print("Valid!")
    else:
        print("Errors:", serializer.errors)

if __name__ == "__main__":
    test_serializer()
