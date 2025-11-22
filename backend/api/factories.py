"""
Factory definitions for generating test data with Faker
"""
import factory
from faker import Faker
from django.contrib.auth.models import User
from api.models import (
    UserProfile, Category, BlogPost, Product, Review, Order, Artist
)

fake = Faker()


class UserFactory(factory.django.DjangoModelFactory):
    """Factory for creating test users"""
    class Meta:
        model = User

    username = factory.Faker('user_name')
    email = factory.Faker('email')
    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    is_active = True


class UserProfileFactory(factory.django.DjangoModelFactory):
    """Factory for creating user profiles"""
    class Meta:
        model = UserProfile

    user = factory.SubFactory(UserFactory)
    role = factory.Faker('random_element', elements=[
        'buyer', 'seller', 'artisan', 'tradesman', 'farmer'
    ])
    bio = factory.Faker('text', max_nb_chars=500)
    phone = factory.Faker('phone_number')
    location = factory.Faker('city')
    is_verified = True
    faith_based = factory.Faker('boolean')


class CategoryFactory(factory.django.DjangoModelFactory):
    """Factory for creating categories"""
    class Meta:
        model = Category

    name = factory.Faker('word')
    slug = factory.LazyAttribute(lambda o: o.name.lower().replace(' ', '-'))
    description = factory.Faker('sentence', nb_words=10)
    icon = factory.Faker('random_element', elements=[
        'leaf', 'apple', 'basket', 'flower', 'carrot', 'wheat',
        'tools', 'hammer', 'wrench', 'palette', 'brush', 'camera'
    ])


class BlogPostFactory(factory.django.DjangoModelFactory):
    """Factory for creating blog posts"""
    class Meta:
        model = BlogPost

    title = factory.Faker('sentence', nb_words=6)
    slug = factory.LazyAttribute(lambda o: o.title.lower().replace(' ', '-')[:50])
    excerpt = factory.Faker('sentence', nb_words=15)
    content = factory.Faker('text', max_nb_chars=2000)
    category = factory.LazyAttribute(lambda o: fake.random_element([
        'all-posts', 'stories', 'tips-tricks', 'event-recaps', 'artisan-spotlights'
    ]))
    author = factory.SubFactory(UserFactory)
    featured = factory.Faker('boolean', chance_of_getting_true=30)
    image = factory.Faker('image_url')
    views = factory.Faker('random_int', min=0, max=10000)
    published = True


class ProductFactory(factory.django.DjangoModelFactory):
    """Factory for creating products"""
    class Meta:
        model = Product

    seller = factory.SubFactory(UserFactory)
    title = factory.Faker('sentence', nb_words=4)
    slug = factory.LazyAttribute(lambda o: o.title.lower().replace(' ', '-')[:50])
    description = factory.Faker('text', max_nb_chars=1000)
    category = factory.SubFactory(CategoryFactory)
    price = factory.Faker('pydecimal', left_digits=4, right_digits=2, positive=True)
    quantity = factory.Faker('random_int', min=1, max=100)
    status = factory.Faker('random_element', elements=['active', 'inactive', 'sold'])
    image = factory.Faker('image_url')
    images = factory.LazyAttribute(lambda o: [
        fake.image_url() for _ in range(fake.random_int(1, 3))
    ])
    rating = factory.Faker('pyfloat', left_digits=1, right_digits=1, min_value=0, max_value=5)


class ReviewFactory(factory.django.DjangoModelFactory):
    """Factory for creating reviews"""
    class Meta:
        model = Review

    product = factory.SubFactory(ProductFactory)
    reviewer = factory.SubFactory(UserFactory)
    rating = factory.Faker('random_int', min=1, max=5)
    title = factory.Faker('sentence', nb_words=4)
    comment = factory.Faker('text', max_nb_chars=500)
    helpful_count = factory.Faker('random_int', min=0, max=50)


class OrderFactory(factory.django.DjangoModelFactory):
    """Factory for creating orders"""
    class Meta:
        model = Order

    order_id = factory.Sequence(lambda n: f"HC-{fake.uuid4()}")  
    buyer = factory.SubFactory(UserFactory)
    products = factory.LazyAttribute(lambda o: [
        {
            'id': fake.random_int(1, 1000),
            'title': fake.sentence(nb_words=3),
            'price': float(fake.pydecimal(left_digits=3, right_digits=2, positive=True)),
            'quantity': fake.random_int(1, 5)
        }
        for _ in range(fake.random_int(1, 5))
    ])
    total_amount = factory.Faker('pydecimal', left_digits=5, right_digits=2, positive=True)
    status = factory.Faker('random_element', elements=[
        'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'
    ])
    shipping_address = factory.Faker('address')
    payment_method = factory.Faker('random_element', elements=[
        'credit_card', 'debit_card', 'paypal', 'bank_transfer'
    ])
    notes = factory.Faker('text', max_nb_chars=300)


class ArtistFactory(factory.django.DjangoModelFactory):
    """Factory for creating featured artists"""
    class Meta:
        model = Artist

    user = factory.SubFactory(UserFactory)
    name = factory.Faker('name')
    specialty = factory.Faker('word')
    bio = factory.Faker('text', max_nb_chars=500)
    profile_image = factory.Faker('image_url')
    portfolio_url = factory.Faker('url')
    social_media = factory.LazyAttribute(lambda o: {
        'instagram': f"@{fake.user_name()}",
        'twitter': f"@{fake.user_name()}",
        'facebook': fake.user_name(),
    })
    featured = True
