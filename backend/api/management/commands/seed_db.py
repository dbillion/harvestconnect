"""
Django management command to seed the database with test data
Usage: python manage.py seed_db --users 10 --products 20 --posts 15
"""
from django.core.management.base import BaseCommand
from django.db import transaction
from django.contrib.auth.models import User
from api.factories import (
    UserFactory, CategoryFactory, BlogPostFactory,
    ProductFactory, ReviewFactory, OrderFactory, ArtistFactory
)
from api.models import UserProfile


class Command(BaseCommand):
    help = 'Seed database with test data using Faker'

    def add_arguments(self, parser):
        parser.add_argument(
            '--users',
            type=int,
            default=10,
            help='Number of users to create'
        )
        parser.add_argument(
            '--categories',
            type=int,
            default=5,
            help='Number of categories to create'
        )
        parser.add_argument(
            '--products',
            type=int,
            default=20,
            help='Number of products to create'
        )
        parser.add_argument(
            '--posts',
            type=int,
            default=15,
            help='Number of blog posts to create'
        )
        parser.add_argument(
            '--reviews',
            type=int,
            default=30,
            help='Number of reviews to create'
        )
        parser.add_argument(
            '--orders',
            type=int,
            default=10,
            help='Number of orders to create'
        )
        parser.add_argument(
            '--artists',
            type=int,
            default=5,
            help='Number of featured artists to create'
        )
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing data before seeding'
        )

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🌱 Starting database seeding...'))

        # Clear existing data if requested
        if options['clear']:
            self.clear_data()

        try:
            # Create categories first
            self.stdout.write('Creating categories...')
            categories = CategoryFactory.create_batch(options['categories'])
            self.stdout.write(self.style.SUCCESS(
                f"✓ Created {len(categories)} categories"
            ))

            # Create users and profiles
            self.stdout.write('Creating users and profiles...')
            users = []
            for _ in range(options['users']):
                user = UserFactory.create()
                # Ensure UserProfile exists (it should be auto-created via signals)
                UserProfile.objects.get_or_create(user=user)
                users.append(user)
            self.stdout.write(self.style.SUCCESS(
                f"✓ Created {len(users)} users with profiles"
            ))

            # Create blog posts
            self.stdout.write('Creating blog posts...')
            posts = []
            for _ in range(options['posts']):
                post = BlogPostFactory.create(author=users[_ % len(users)])
                posts.append(post)
            self.stdout.write(self.style.SUCCESS(
                f"✓ Created {len(posts)} blog posts"
            ))

            # Create products
            self.stdout.write('Creating products...')
            products = []
            for _ in range(options['products']):
                # Only sellers can have products
                seller = users[_ % len(users)]
                seller_profile, _ = UserProfile.objects.get_or_create(user=seller)
                seller_profile.role = 'seller'
                seller_profile.save()
                
                product = ProductFactory.create(
                    seller=seller,
                    category=categories[_ % len(categories)]
                )
                products.append(product)
            self.stdout.write(self.style.SUCCESS(
                f"✓ Created {len(products)} products"
            ))

            # Create reviews
            self.stdout.write('Creating reviews...')
            reviews = []
            review_pairs = set()  # Track (product, reviewer) pairs
            attempts = 0
            max_attempts = options['reviews'] * 3
            
            while len(reviews) < options['reviews'] and attempts < max_attempts:
                attempts += 1
                if products:
                    product = products[attempts % len(products)]
                    reviewer = users[(attempts + 1) % len(users)]
                    pair = (product.id, reviewer.id)
                    
                    if pair not in review_pairs:
                        try:
                            review = ReviewFactory.create(
                                product=product,
                                reviewer=reviewer
                            )
                            reviews.append(review)
                            review_pairs.add(pair)
                        except Exception:
                            pass  # Skip if duplicate
            
            self.stdout.write(self.style.SUCCESS(
                f"✓ Created {len(reviews)} reviews"
            ))

            # Create orders
            self.stdout.write('Creating orders...')
            orders = []
            for _ in range(options['orders']):
                order = OrderFactory.create(buyer=users[_ % len(users)])
                orders.append(order)
            self.stdout.write(self.style.SUCCESS(
                f"✓ Created {len(orders)} orders"
            ))

            # Create featured artists
            self.stdout.write('Creating featured artists...')
            artists = []
            for _ in range(options['artists']):
                # Make some users as artisans
                artisan = users[_ % len(users)]
                artisan_profile, _ = UserProfile.objects.get_or_create(user=artisan)
                artisan_profile.role = 'artisan'
                artisan_profile.save()
                
                artist = ArtistFactory.create(user=artisan)
                artists.append(artist)
            self.stdout.write(self.style.SUCCESS(
                f"✓ Created {len(artists)} featured artists"
            ))

            # Summary
            self.stdout.write(self.style.SUCCESS('\n' + '='*50))
            self.stdout.write(self.style.SUCCESS('✅ Database seeding completed successfully!'))
            self.stdout.write(self.style.SUCCESS('='*50))
            self.stdout.write(f'📊 Total records created:')
            self.stdout.write(f'  • Users: {len(users)}')
            self.stdout.write(f'  • Categories: {len(categories)}')
            self.stdout.write(f'  • Blog Posts: {len(posts)}')
            self.stdout.write(f'  • Products: {len(products)}')
            self.stdout.write(f'  • Reviews: {len(reviews)}')
            self.stdout.write(f'  • Orders: {len(orders)}')
            self.stdout.write(f'  • Artists: {len(artists)}')
            self.stdout.write('\n💡 Test Login:')
            self.stdout.write('  Username: admin')
            self.stdout.write('  Password: admin123')

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'❌ Error during seeding: {str(e)}'))
            raise

    def clear_data(self):
        """Clear existing data before seeding"""
        self.stdout.write('Clearing existing data...')
        from api.models import (
            UserProfile, Category, BlogPost, Product, Review, Order, Artist
        )
        from django.contrib.auth.models import User
        
        # Delete in order to respect foreign keys
        Review.objects.all().delete()
        Order.objects.all().delete()
        Product.objects.all().delete()
        BlogPost.objects.all().delete()
        Artist.objects.all().delete()
        UserProfile.objects.all().delete()
        User.objects.filter(is_staff=False, is_superuser=False).delete()
        Category.objects.all().delete()
        
        self.stdout.write(self.style.SUCCESS('✓ Data cleared'))
