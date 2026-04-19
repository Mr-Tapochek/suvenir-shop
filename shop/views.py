from django.shortcuts import render
from .models import Product
from rest_framework import viewsets
from .serializers import ProductSerializers
from rest_framework.pagination import PageNumberPagination

class SimplePagination(PageNumberPagination):
    page_size = 3
    page_size_query_param = 'page_size'
    max_page_size = 100

class ProductViewSet(viewsets.ModelViewSet):
    pagination_class = SimplePagination
    queryset = Product.objects.all()
    serializer_class = ProductSerializers
