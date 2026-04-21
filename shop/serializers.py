from rest_framework import serializers
from .models import Product, CartItem, Cart, OrderItem, Order

class ProductSerializers(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializers(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'total_price', 'added_at', 'updated_at']
        read_only_fields = ['id', 'added_at', 'updated_at']
    def validate_product_id(self, value):
        if not Product.objects.filter(id=value).exists(): raise serializers.ValidationError("Товар не найден")
        return value

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total_items = serializers.IntegerField(read_only=True)
    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'total_price', 'total_items', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializers(read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'price', 'total_price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)
    class Meta:
        model = Order
        fields = ['id', 'address', 'delivery_time', 'payment_method', 'payment_method_display', 
                  'card_number', 'total_price', 'status', 'status_display', 'items', 'created_at', 'updated_at']
        read_only_fields = ['id', 'total_price', 'status', 'created_at', 'updated_at']

class CreateOrderSerializer(serializers.Serializer):
    address = serializers.CharField(required=True)
    delivery_date = serializers.DateField(required=True)
    delivery_time = serializers.CharField(required=True)
    payment_method = serializers.ChoiceField(choices=['cash', 'card'], required=True)
    card_number = serializers.CharField(required=False, allow_blank=True, max_length=19)

    def validate_card_number(self, value):
        payment_method = self.initial_data.get('payment_method')
        if payment_method == 'card' and not value:
            raise serializers.ValidationError("Номер карты обязателен при оплате картой")
        if value and not value.replace(' ', '').isdigit():
            raise serializers.ValidationError("Номер карты должен содержать только цифры")
        return value
    
    def validate_delivery_date(self, value):
        from datetime import date
        if value < date.today():
            raise serializers.ValidationError("Дата доставки не может быть в прошлом")
        return value