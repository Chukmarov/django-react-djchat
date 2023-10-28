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

    # Этот параметр говорит Django что это
    # поле не ссылается на модель, а
    # просчитывается отдельно и у него своя логика.
    # Её нужно описать отдельным методом ниже
    # в этом же классе, иначе Django выдаст ошибку
    num_members = serializers.SerializerMethodField()

    # Этот сериалайзер возвразщает все данные модели Server
    class Meta:
        model = Server
        # Т.к. в поле mebers может
        # быть слишком много пользвателей,
        # лучше его исключить из ответа.
        # И возвращать не все поля
        # Это было ранее:
        # fields = "__all__"
        # Теперь:
        exclude = ("member",)

    def get_num_members(self, obj):
        # Эта функция описыват логику отображения
        # annotation, которая указана во views.py
        # num_members . Обратите внимание что мы
        # ранее указли переменную num_members,
        # эта функиция продолжене этой функции

        if hasattr(obj, "num_members"):
            return obj.num_members
        else:
            return None

    def to_representation(self, instance):
        # Эта функция написана только для
        # того чтоб сериалайзер мог скрывать
        # или отображать параметр num_members
        # в зависимости от того есть ли такой
        # контекст в запросе или нет. Контекст
        # передается из view.py этого же модуля.
        # Что удобно , то в запросе уже
        # присутсвует True или None
        data = super().to_representation(instance)
        num_members = self.context.get("num_members")
        if not num_members:
            data.pop("num_members", None)
        return data
