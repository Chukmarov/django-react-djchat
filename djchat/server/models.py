from django.conf import settings
from django.db import models
from django.shortcuts import get_object_or_404
from django.dispatch import receiver
from .validators import validate_image_file_extension, validate_icon_image_size


# Изменение 8d452c57-c72a-4fc1-a55c-6ddff9fd3024
# Cмысл такой что мы добавляем функцию которая
# будет загружать путь иконки при сохранении.
# Обратите внимание что такая же функция пояляется
# в модели Category. Я полагаю instance и filename
# будет загружаться из модели FileField
def category_icon_upload_path(instance, filename):
    return f"category/{instance.id}/category_icon/{filename}"


# Конец изменения 8d452c57-c72a-4fc1-a55c-6ddff9fd3024


# Изменения 6bc64868-d84a-4b97-8ba8-46316e4da92f
def server_icon_upload_path(instance, filename):
    return f"server/{instance.id}/server_icon/{filename}"


def server_banner_upload_path(instance, filename):
    return f"server/{instance.id}/server_banner/{filename}"


# Конец изменения 6bc64868-d84a-4b97-8ba8-46316e4da92f


class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    # Изменения 8d452c57-c72a-4fc1-a55c-6ddff9fd3024
    icon = models.FileField(
        upload_to=category_icon_upload_path,
        null=True,
        blank=True,
    )
    # конец изменения 8d452c57-c72a-4fc1-a55c-6ddff9fd3024

    # изменения c2649619-ae44-4865-9401- 9bdf8ffff47b
    # Эта часть об удалении старой иконки при перезаписи
    # новой или удалении объекта вообще.
    # Для Начала необходимо проверить существует ли
    # вообще объект или создается впервые. Если нет,
    # то просто сохраняется как обычный объект,
    # а вот если существует, то она достает
    # объект используя shortcuts (get_object_or_404).
    # Как только объект возвращен, то проверяется наличие иконки,
    # если есть и она не равна, то старая удалятеся и
    # сохраняется новая. Ну вообще лучше почитать про shortcuts.
    def save(self, *args, **kwargs):
        if self.id:
            existing = get_object_or_404(Category, id=self.id)
            if existing.icon != self.icon:
                existing.icon.delete(save=False)
        super(Category, self).save(*args, **kwargs)

    # вторая часть тоже необходима чтобы удалять
    # существующую исонку, но если в первом случае
    # была замена, в этой части мы удаляем иконку
    # если удаляется также и объект, в данном случае
    # категория. Здесь для этих целей применяется @receiver (django.signals).
    # Это своего рода слушатель событий. В данном случае
    # мы слушаем удаление у объекта category. После
    # этого перебираем все поля в объекте, находим
    # поле иконка. Смотрим есть ли вообще файл.
    # Если есть, то удаляем. Обратите внимание что
    # при удалении мы просим его не сохранять,
    # так как после удаления все сохранится и без нас
    @receiver(models.signals.pre_delete, sender="server.Category")
    def category_delete_files(sender, instance, **kwargs):
        for field in instance._meta.fields:
            if field.name == "icon":
                file = getattr(instance, field.name)
                if file:
                    file.delete(save=False)

    # конец изменения c2649619-ae44-4865-9401- 9bdf8ffff47b

    def __str__(self):
        return self.name


class Server(models.Model):
    name = models.CharField(max_length=100)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="server_owner"
    )
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name="server_category"
    )
    description = models.CharField(max_length=250, null=True)
    member = models.ManyToManyField(settings.AUTH_USER_MODEL)

    def __str__(self):
        return self.name


class Channel(models.Model):
    name = models.CharField(max_length=100)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="channel_owner"
    )
    topic = models.CharField(max_length=100)
    server = models.ForeignKey(
        Server, on_delete=models.CASCADE, related_name="channel_server"
    )
    # Изменения 6bc64868-d84a-4b97-8ba8-46316e4da92f
    # Здесь мы расширяем нашу модель для возможности загрузки баннеров и иконок
    banner = models.ImageField(
        upload_to=server_banner_upload_path,
        null=True,
        blank=True,
        validators=[validate_image_file_extension],
    )
    icon = models.ImageField(
        upload_to=server_icon_upload_path,
        null=True,
        blank=True,
        validators=[validate_image_file_extension, validate_icon_image_size],
    )
    # Конец изменения 6bc64868-d84a-4b97-8ba8-46316e4da92f

    # Изменения 6bc64868-d84a-4b97-8ba8-46316e4da92f
    # В этом изменении мы проверяем какую
    # иконку и какой баннер сохраняет
    # пользователь на сервере. Если она
    # присутствует уже , то меняем ее на новую,
    # а старую удаляем. Также ресивером слушаем
    # удаление сервера , если серве удаляется,
    # то картинка также подлежит удалению.
    # Но все это имеется ввиду удаляется из
    # нашей файловой системы. Т.к. напомню
    # что в базе данных хранится только путь.
    # Сама картинка там не хранится.
    def save(self, *args, **kwargs):
        self.name = self.name.lower()
        if self.id:
            existing = get_object_or_404(Category, id=self.id)
            if existing.icon != self.icon:
                existing.icon.delete(save=False)
            if existing.banner != self.banner:
                existing.banner.delete(save=False)
        super(Category, self).save(*args, **kwargs)

    @receiver(models.signals.pre_delete, sender="server.Server")
    def category_delete_files(sender, instance, **kwargs):
        for field in instance._meta.fields:
            if field.name == "icon" or field.name == "banner":
                file = getattr(instance, field.name)
                if file:
                    file.delete(save=False)

    # Конец изменения 6bc64868-d84a-4b97-8ba8-46316e4da92f
    def __str__(self):
        return self.name
