from django.contrib import admin
from .models import Category, Product, CartItem, Cart

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'out_price', 'sale_price', 'image', 'category')
    search_fields = ('name', 'category')

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'total_items', 'total_price', 'created_at')
    search_fields = ('user__username', 'user__email')
    readonly_fields = ('created_at', 'updated_at')
    def total_items(self, obj): return obj.total_items
    def total_price(self, obj): return obj.total_price

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'cart', 'product', 'quantity', 'total_price', 'added_at')
    search_fields = ('cart__user__username', 'product__name')
    readonly_fields = ('added_at', 'updated_at')
    def total_price(self, obj): return obj.total_price    