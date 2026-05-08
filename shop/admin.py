from django.contrib import admin
from .models import Category, Product, CartItem, Cart, Order, OrderItem

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'out_price', 'sale_price', 'image', 'category')
    list_filter = ['category']
    search_fields = ['name']

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'id')
    search_fields = ['name']

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

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):  
    list_display = ('id', 'order', 'product', 'quantity', 'price', 'total_price')
    search_fields = ('order__user__username', 'product__name')
    
    def total_price(self, obj):
        return obj.total_price
    total_price.short_description = 'Сумма'

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'total_price', 'payment_method', 'status', 'created_at')
    list_filter = ('status', 'payment_method', 'created_at')
    search_fields = ('user__username', 'user__email', 'address')
    readonly_fields = ('created_at', 'updated_at')