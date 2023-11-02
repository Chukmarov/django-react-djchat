from django.core.exceptions import ValidationError
from PIL import Image
import os


# Суть этого валидатора проста.
# Он просто проверяет размеры изображения.
# Если они равны , то они менее 70х70,
# то пропускает. Если менее, то нет.
# В этом валидаторе мы используем библиотеку
# pillow. Обрати внимание на класс Image
def validate_icon_image_size(image):
    if image:
        with Image.open(image) as img:
            if img.width > 70 or img.height > 70:
                raise ValidationError(
                    f"The maximum allowed dimensions for the image are 70x70. You uploaded : {img.size}"
                )


# Этот валидатор проверяет формат картинки.
# По сути он просто берет имя, делит его
# и выбирает только разрешение картинки.
# После сверяет его со списком разрешенных
# и говорит все ли ок, или же нет.
def validate_image_file_extension(value):
    ext = os.path.splitext(value.name)[1]
    valid_extensions = [".jpg", ".jpeg", ".png", ".gif"]
    if not ext.lower() in valid_extensions:
        raise ValidationError("Unsupported file extension")
