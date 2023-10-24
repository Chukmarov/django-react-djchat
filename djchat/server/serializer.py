from rest_framework import serializers

from .models import Category, Server


class ServerSerializer(serializers.ModelSerializer):
    # Этот сериалайзер возвразщает все данные модели Server
    # Ну в целом это из кода даже видно
    class Meta:
        model = Server
        fields = "__all__"
