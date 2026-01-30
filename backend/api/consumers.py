import json
from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
from .models import ChatRoom, ChatMessage
from django.contrib.auth.models import User

class ChatConsumer(JsonWebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'
        self.user = self.scope['user']

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

        # Notify others that user joined
        if self.user.is_authenticated:
            self.send_presence('online')

    def disconnect(self, close_code):
        # Notify others that user left
        if self.user.is_authenticated:
            self.send_presence('offline')

        # Leave room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

    def receive_json(self, content):
        msg_type = content.get('type', 'message')
        user_id = content.get('user_id')
        
        if msg_type == 'message':
            message = content.get('message')
            try:
                user = User.objects.get(id=user_id)
                room, _ = ChatRoom.objects.get_or_create(name=self.room_name)
                
                ChatMessage.objects.create(
                    room=room,
                    sender=user,
                    content=message
                )

                async_to_sync(self.channel_layer.group_send)(
                    self.room_group_name,
                    {
                        'type': 'chat_message',
                        'message': message,
                        'user_id': user.id,
                        'username': user.username
                    }
                )
            except User.DoesNotExist:
                pass
        
        elif msg_type == 'typing':
            is_typing = content.get('typing', False)
            username = content.get('username', 'Someone')
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'user_typing',
                    'username': username,
                    'typing': is_typing,
                    'user_id': user_id
                }
            )

    def chat_message(self, event):
        self.send_json({
            'type': 'message',
            'message': event['message'],
            'user_id': event['user_id'],
            'username': event['username']
        })

    def user_typing(self, event):
        self.send_json({
            'type': 'typing',
            'username': event['username'],
            'typing': event['typing'],
            'user_id': event['user_id']
        })

    def send_presence(self, status):
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'presence_update',
                'username': self.user.username,
                'status': status,
                'user_id': self.user.id
            }
        )

    def presence_update(self, event):
        self.send_json({
            'type': 'presence',
            'username': event['username'],
            'status': event['status'],
            'user_id': event['user_id']
        })
