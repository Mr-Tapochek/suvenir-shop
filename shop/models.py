from django.db import models

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
