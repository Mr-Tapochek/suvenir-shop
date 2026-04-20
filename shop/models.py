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