from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from .models import Server
from .serializer import ServerSerializer


class ServerListViewSet(viewsets.ViewSet):
    # Сразу из названия видно что он построен на уже готовых классах
    # Это очень удобно, потому что класс уже включает набор  преднаписанных методов
    # Таких как:
    # list, create, retrive, update, destroy
    # А этакже эти готовые viewsets очень удобны для настройки routers

    # Тут мы выбираем все сервера
    queryset = Server.objects.all()

    def list(self, request):
        # Находим параметр category в запросе
        # и писваиваем его переменной
        category = request.query_params.get("category")

        if category:
            # Если категория есть, то выполняется последующий код,
            # если категории нет в запросе, то вернутся
            # все сервера

            # Обратите внимание как мы получаем доступ к имени
            # категории через двойное подчеркивание. Именно по имени
            # категории мы будем искать сервера. По умолчанию они
            # ищутся по ID номеру

            self.queryset = self.queryset.filter(category__name=category)

        # Вот тут в сериалайзере присутвует приписка many.
        # Как я понял эта приписка обязательна если в подели
        # присутствует отношение многие ко многим. В нашем
        # случае она есть. Но если это не так нужно поправить этот комментарий
        serializer = ServerSerializer(self.queryset, many=True)

        # Ну и собственно возвращаем данные
        return Response(serializer.data)
