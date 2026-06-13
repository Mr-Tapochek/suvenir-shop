from django.db import models
from users.models import CustomUser
from django.core.validators import MinValueValidator

class Category(models.Model):

    name = models.CharField(max_length=50, verbose_name='Название')

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'category'
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'

class Product(models.Model):
    
    name = models.CharField(max_length=50, verbose_name='Название')
    description = models.TextField(verbose_name='Описание')
    out_price = models.DecimalField(default=0.00, max_digits=10, decimal_places=2, verbose_name='Старая цена')
    sale_price = models.DecimalField(default=0.00, max_digits=10, decimal_places=2, verbose_name='Новая цена')
    image = models.ImageField(upload_to='product_image', verbose_name='Изображение', null=True)
    category = models.ForeignKey(Category, verbose_name='Категория', on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'product'
        verbose_name = 'Продукт'
        verbose_name_plural = 'Продукты'

class Cart(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='cart', verbose_name='Пользователь')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')
    class Meta:
        db_table = 'cart'
        verbose_name = 'Корзина'
        verbose_name_plural = 'Корзины'
    def __str__(self): return f"Корзина {self.user.username}"
    @property
    def total_price(self): return sum(item.total_price for item in self.items.all())
    @property
    def total_items(self): return sum(item.quantity for item in self.items.all())

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)])
    added_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        db_table = 'cart_item'
        verbose_name = 'Товар в корзине'
        verbose_name_plural = 'Товары в корзине'
        unique_together = ['cart', 'product']
    def __str__(self): return f"{self.quantity} x {self.product.name}"
    @property
    def total_price(self):
        price = self.product.sale_price if self.product.sale_price > 0 else self.product.out_price
        return price * self.quantity

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Ожидает обработки'),
        ('processing', 'В обработке'),
        ('shipped', 'Отправлен'),
        ('delivered', 'Доставлен'),
        ('cancelled', 'Отменен'),
    ]
    PAYMENT_CHOICES = [
        ('cash', 'Наличными курьеру'),
        ('card', 'Банковской картой курьеру'),
    ]
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='orders', verbose_name='Пользователь')
    address = models.TextField(verbose_name='Адрес доставки')
    delivery_date = models.DateField(null=True, verbose_name='Дата доставки')
    delivery_time = models.CharField(max_length=100, verbose_name='Время доставки')
    payment_method = models.CharField(max_length=10, choices=PAYMENT_CHOICES, verbose_name='Способ оплаты')
    total_price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Общая сумма')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name='Статус заказа')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')
    class Meta:
        db_table = 'order'
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'
    def __str__(self):
        return f"Заказ #{self.id} - {self.user.username}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items', verbose_name='Заказ')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, verbose_name='Товар')
    quantity = models.PositiveIntegerField(verbose_name='Количество')
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Цена на момент заказа')
    class Meta:
        db_table = 'order_item'
        verbose_name = 'Товар в заказе'
        verbose_name_plural = 'Товары в заказе'
    def __str__(self):
        return f"{self.quantity} x {self.product.name} в заказе #{self.order.id}"
    @property
    def total_price(self):
        return self.price * self.quantity