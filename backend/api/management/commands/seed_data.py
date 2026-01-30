import random
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import UserProfile, Category, Product, BlogPost, Artist, Review
from faker import Faker
from django.utils.text import slugify
from decimal import Decimal
import uuid

fake = Faker()

class Command(BaseCommand):
    help = 'Seeds the database with robust practice data for Marketplace, Articles, and Reviews'

    def handle(self, *args, **kwargs):
        self.stdout.write('Starting robust seeding...')
        
        # 1. Clear existing data
        self.stdout.write('Clearing existing data...')
        Review.objects.all().delete()
        Product.objects.all().delete()
        BlogPost.objects.all().delete()
        Artist.objects.all().delete()
        # Keep superusers but clear profiles
        UserProfile.objects.all().delete()
        # Delete non-staff users
        User.objects.filter(is_staff=False).delete()

        # 2. Create Categories
        self.stdout.write('Creating categories...')
        categories_data = [
            {'name': 'Fresh Produce', 'icon': 'Sprout', 'description': 'Farm-fresh fruits and vegetables directly from local growers.'},
            {'name': 'Handcrafted Goods', 'icon': 'Hammer', 'description': 'Unique, handmade items crafted by local artisans.'},
            {'name': 'Professional Services', 'icon': 'Tool', 'description': 'Reliable skilled trades and professional local services.'},
            {'name': 'Dairy & Eggs', 'icon': 'Egg', 'description': 'Fresh dairy and pasture-raised eggs from local farms.'},
            {'name': 'Baked Goods', 'icon': 'Croissant', 'description': 'Artisan breads, pastries, and treats baked with love.'},
        ]
        
        categories = []
        for cat in categories_data:
            c, _ = Category.objects.get_or_create(
                name=cat['name'],
                defaults={'icon': cat['icon'], 'description': cat['description']}
            )
            categories.append(c)

        # 3. Create Users with different roles
        self.stdout.write('Creating core practice users...')
        roles_list = ['buyer', 'farmer', 'tradesman', 'artisan']
        password = 'PracticePassword123'
        
        for role in roles_list:
            email = f'{role}@harvestconnect.local'
            user, created = User.objects.get_or_create(
                username=email,
                defaults={
                    'email': email,
                    'first_name': f"{role.capitalize()}User",
                    'last_name': 'Seed',
                }
            )
            user.set_password(password)
            user.save()
            
            # Ensure profile exists and has correct role
            profile, _ = UserProfile.objects.get_or_create(user=user)
            profile.role = role
            profile.bio = f"This is a {role} account for testing HarvestConnect features."
            profile.location = "Heritage Valley"
            profile.verified = True
            profile.save()
            
            self.stdout.write(f'Verified account for {role}: {email}')

        # Re-fetch users
        all_users = list(User.objects.filter(is_staff=False))
        seller_users = [u for u in all_users if UserProfile.objects.get(user=u).role != 'buyer']
        buyer_user = next(u for u in all_users if UserProfile.objects.get(user=u).role == 'buyer')

        # 4. Create Marketplace Products
        self.stdout.write('Seeding Marketplace (Products)...')
        product_examples = {
            'farmer': [
                "Organic Heirloom Tomatoes", "Fresh Kale Bunch", "Wildflower Honey", 
                "Pasture Raised Eggs", "Sweet Summer Corn", "Crisp Gala Apples"
            ],
            'artisan': [
                "Handcrafted Oak Table", "Ceramic Pasta Bowl", "Organic Lavender Soap", 
                "Wool Knit Scarf", "Custom Leather Wallet", "Hand-painted Landscape"
            ],
            'tradesman': [
                "Basic Garden Shed Kit", "Custom Wood Gate", "Wrought Iron Wall Hook", 
                "Repaired Vintage Lantern", "Hand-forged Firepit", "Cedar Birdhouse"
            ]
        }

        created_products = []
        for user in all_users:
            profile = UserProfile.objects.get(user=user)
            role = profile.role
            if role in product_examples:
                self.stdout.write(f'Generating products for {role} ({user.email})...')
                for item_name in product_examples[role]:
                    try:
                        # Map categories to unsplash topics
                        topic = "product"
                        if role == 'farmer': topic = "farm,produce"
                        elif role == 'artisan': topic = "handmade,craft"
                        elif role == 'tradesman': topic = "tools,workshop"
                        
                        image_url = f"https://images.unsplash.com/photo-{random.randint(1500000000000, 1600000000000)}?auto=format&fit=crop&q=80&w=800"
                        # Actually simpler to use a topic search URL if the model allows it, 
                        # but direct IDs or curated lists are safer. Let's use source.unsplash.com equivalent or fixed list.
                        
                        p = Product.objects.create(
                            seller=user,
                            title=item_name,
                            slug=f"{slugify(item_name)}-{uuid.uuid4().hex[:4]}",
                            description=fake.paragraph(nb_sentences=5),
                            category=random.choice(categories),
                            price=Decimal(random.randrange(15, 250)),
                            quantity=random.randint(5, 100),
                            status='active',
                            # Use a more reliable way to get images
                            image=f"https://loremflickr.com/800/600/{topic.split(',')[0]}?random={random.randint(1,1000)}"
                        )
                        created_products.append(p)
                    except Exception as e:
                        self.stdout.write(self.style.ERROR(f'Failed to create product {item_name}: {e}'))

        # 5. Create Hub Articles (Blog Posts)
        self.stdout.write('Seeding Article Hub (Blog Posts)...')
        article_titles = [
            "10 Tips for Healthier Soil This Spring",
            "Inside the Studio: Crafting the Perfect Ceramic Bowl",
            "Why Local Produce Actually Tastes Better",
            "Restoring Heritage: The Art of Traditional Blacksmithing",
            "Seasonal Eating Guide: Winter Root Vegetables",
            "Sustainable Farming: Our Journey to Organic Certification",
            "Community Spotlight: The Heritage Valley Market",
            "DIY Garden Shed: A Step-by-Step Guide",
        ]
        
        blog_categories = ['farming', 'artisanship', 'faith', 'sustainability', 'market-updates']
        blog_topics = {
            'farming': 'farm,agriculture',
            'artisanship': 'handicraft,pottery',
            'faith': 'church,community',
            'sustainability': 'ecology,nature',
            'market-updates': 'market,vegetables'
        }
        
        if seller_users:
            for i, title in enumerate(article_titles):
                author = random.choice(seller_users)
                cat = random.choice(blog_categories)
                topic = blog_topics.get(cat, 'community')
                try:
                    BlogPost.objects.create(
                        title=title,
                        slug=f"{slugify(title)}-{uuid.uuid4().hex[:4]}",
                        excerpt=fake.sentence(nb_words=20),
                        content="".join([f"<p>{p}</p>" for p in fake.paragraphs(nb=6)]),
                        category=cat,
                        author=author,
                        featured=(i < 3),
                        image=f"https://loremflickr.com/1200/800/{topic}?random={random.randint(1,1000)}",
                        published=True
                    )
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'Failed to create article {title}: {e}'))

        # 6. Create Reviews
        self.stdout.write('Seeding Product Reviews...')
        review_titles = ["Excellent quality!", "Great value", "Highly recommend", "Solid product", "Just okay"]
        for product in created_products:
            # Each product gets 1-2 reviews
            for _ in range(random.randint(1, 2)):
                try:
                    Review.objects.create(
                        product=product,
                        reviewer=buyer_user,
                        rating=random.randint(4, 5),
                        title=random.choice(review_titles),
                        comment=fake.sentence(nb_words=15)
                    )
                except Exception:
                    pass # unique_together might trigger if we tried same user twice

        # 7. Create Artist Profiles
        self.stdout.write('Seeding Artist Profiles...')
        for user in all_users:
            profile = UserProfile.objects.get(user=user)
            if profile.role == 'artisan':
                Artist.objects.get_or_create(
                    user=user,
                    defaults={
                        'name': f"{user.first_name} {user.last_name}",
                        'specialty': "Handcrafted Woodwork & Ceramics",
                        'bio': "Dedicated to preserving traditional crafting methods in the heart of Heritage Valley.",
                        'featured': True
                    }
                )

        self.stdout.write(self.style.SUCCESS('\nSuccessfully seeded COMPLETE database!'))
        self.stdout.write(f'Marketplace: {Product.objects.count()} active listings')
        self.stdout.write(f'Articles: {BlogPost.objects.count()} published posts')
        self.stdout.write(f'Reviews: {Review.objects.count()} customer reviews')
        self.stdout.write(f'All seed users share password: {password}')
