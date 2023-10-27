from rest_framework import serializers

from .models import Category, Server, Channel


class ChannelSerialaizer(serializers.ModelSerializer):
    # Этот сериалайзер возвращает все даные модели Channel
    class Meta:
        model = Channel
        fields = "__all__"


class ServerSerializer(serializers.ModelSerializer):
    # Этот параметр есть в модели Server,
    # просто мы подсказываем сериалайзеру
    # на какой другой сериалайзер ему ссылаться
    # Также нужно обратить внимание на параметр
    # many= True, без него не будут
    # прогружаться все каналы, да и вообще
    # все перестанет работать.
    channel_server = ChannelSerialaizer(many=True)

    # Этот сериалайзер возвразщает все данные модели Server
    class Meta:
        model = Server
        fields = "__all__"
