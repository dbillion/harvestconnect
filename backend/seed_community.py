import os
import django
import random
from datetime import datetime, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'harvestconnect.settings')
django.setup()

from django.contrib.auth.models import User
from api.models import UserProfile, Product, Order, Category, ChatRoom

def seed():
    print("Seeding church data and transactions...")
    
    # Create some churches
    churches = ["Redeemer Community", "Grace Fellowship", "Lakeside Bible", "Harvest Bible Chapel"]
    locations = ["Accra", "Kumasi", "Tema", "East Legon"]
    
    # Ensure some users exist and have churches/locations
    users = User.objects.all()
    if users.count() < 10:
        print("Need at least 10 users to seed reliably. Please run your user factories first.")
        # Minimal fallback
        for i in range(10):
            u = User.objects.create_user(f'user_{i}@example.com', 'password')
            u.save()
        users = User.objects.all()

    for user in users:
        profile, _ = UserProfile.objects.get_or_create(user=user)
        profile.home_church = random.choice(churches)
        profile.location = random.choice(locations)
        # Random lat/lng around Accra
        profile.latitude = 5.6037 + random.uniform(-0.1, 0.1)
        profile.longitude = -0.1870 + random.uniform(-0.1, 0.1)
        profile.save()

    # Create Church Discovery Channels
    for church in churches:
        ChatRoom.objects.get_or_create(
            name=f"{church} Community",
            room_type='channel',
            church=church
        )
        
    for loc in locations:
        ChatRoom.objects.get_or_create(
            name=f"{loc} Discovery",
            room_type='channel',
            location=loc
        )

    # Seed Transactions for Analytics
    categories = Category.objects.all()
    if not categories:
        Category.objects.create(name="Greens", slug="greens")
        Category.objects.create(name="Tubers", slug="tubers")
        categories = Category.objects.all()

    # Create dummy orders
    for _ in range(50):
        buyer = random.choice(users)
        seller = random.choice(users)
        if buyer == seller: continue
        
        prod_data = [
            {
                "id": random.randint(1, 100),
                "title": f"Fresh Product {random.randint(1, 10)}",
                "price": str(random.randint(10, 100)),
                "quantity": random.randint(1, 5),
                "seller_id": seller.id,
                "category": random.choice(list(categories)).name
            }
        ]
        
        total = sum(float(p['price']) * p['quantity'] for p in prod_data)
        
        order = Order.objects.create(
            order_id=f"HC-{random.randint(10000, 99999)}",
            buyer=buyer,
            products=prod_data,
            total_amount=total,
            status=random.choice(['delivered', 'shipped', 'confirmed']),
            shipping_address="Seed Data Address",
            created_at=datetime.now() - timedelta(days=random.randint(0, 180))
        )
        # Update timestamp manually because auto_now_add
        Order.objects.filter(id=order.id).update(created_at=order.created_at)

    print("Seeding completed successfully!")

if __name__ == "__main__":
    seed()
