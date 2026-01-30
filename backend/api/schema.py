import graphene
from graphene_django import DjangoObjectType
from .models import Order, Product, Category, UserProfile, Project
from django.db.models import Sum, Count, Avg
from django.db.models.functions import TruncMonth
import json

class CategoryType(DjangoObjectType):
    class Meta:
        model = Category
        fields = "__all__"

class ProductType(DjangoObjectType):
    class Meta:
        model = Product
        fields = "__all__"

class OrderType(DjangoObjectType):
    class Meta:
        model = Order
        fields = "__all__"

class ProjectType(DjangoObjectType):
    class Meta:
        model = Project
        fields = "__all__"

class AnalyticsType(graphene.ObjectType):
    total_sales = graphene.Float()
    total_orders = graphene.Int()
    average_order_value = graphene.Float()
    sales_by_category = graphene.JSONString()
    monthly_revenue = graphene.JSONString()
    sales_by_church = graphene.JSONString()
    sales_by_location = graphene.JSONString()

class Query(graphene.ObjectType):
    all_categories = graphene.List(CategoryType)
    all_products = graphene.List(ProductType)
    all_projects = graphene.List(ProjectType)
    
    analytics = graphene.Field(AnalyticsType)

    def resolve_all_categories(self, info):
        return Category.objects.all()

    def resolve_all_products(self, info):
        return Product.objects.all()

    def resolve_all_projects(self, info):
        return Project.objects.all()

    def resolve_analytics(self, info):
        # Overall Stats
        total_sales = Order.objects.exclude(status='cancelled').aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        total_orders = Order.objects.exclude(status='cancelled').count()
        avg_order = total_sales / total_orders if total_orders > 0 else 0

        # Monthly Revenue
        monthly = Order.objects.exclude(status='cancelled') \
            .annotate(month=TruncMonth('created_at')) \
            .values('month') \
            .annotate(revenue=Sum('total_amount')) \
            .order_by('month')
        
        monthly_data = {str(item['month']): float(item['revenue']) for item in monthly}

        # Church & Location Breakdown
        church_breakdown = {}
        location_breakdown = {}
        
        all_orders = Order.objects.exclude(status='cancelled')
        for order in all_orders:
            church = order.buyer.profile.home_church or "Other"
            loc = order.buyer.profile.location or "Other"
            
            church_breakdown[church] = church_breakdown.get(church, 0) + float(order.total_amount)
            location_breakdown[loc] = location_breakdown.get(loc, 0) + float(order.total_amount)

        # Category Breakdown (Simplified)
        cat_breakdown = {}
        
        return AnalyticsType(
            total_sales=float(total_sales),
            total_orders=total_orders,
            average_order_value=float(avg_order),
            monthly_revenue=json.dumps(monthly_data),
            sales_by_category=json.dumps(cat_breakdown),
            sales_by_church=json.dumps(church_breakdown),
            sales_by_location=json.dumps(location_breakdown)
        )

import json # needed for json.dumps
