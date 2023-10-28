from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.exceptions import ValidationError, AuthenticationFailed
from rest_framework.response import Response
from .models import Server
from .serializer import ServerSerializer
from django.db.models import Count


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

        # Находим параметр qty в запросе и
        # присваиваем его переменной
        qty = request.query_params.get("qty")

        # Этот параметр мы также ловим в запросе.
        # Если он присутвует и равняется true,
        # то присваиваем его переменной
        by_user = request.query_params.get("by_user") == "true"

        # Нижеследующий параметр необходим для
        # фильтрации серверов по id сервера
        by_serverid = request.query_params.get("by_serverid")

        # Нижеследующий параметр отслеживает
        # нужно ли подсчитывать кол-во
        # подписчиков на данный сервер или нет.
        with_num_members = request.query_params.get("with_num_members") == "true"

        if by_user or by_serverid and not request.user.is_authenticated:
            # Здесь мы проверям зарегистрован ли пользователь, чтоб просить фильтрацию по пользователю или же по номеру сервера.
            raise AuthenticationFailed()

        if category:
            # Если категория есть, то выполняется последующий код,
            # если категории нет в запросе, то вернутся
            # все сервера

            # Обратите внимание как мы получаем доступ к имени
            # категории через двойное подчеркивание. Именно по имени
            # категории мы будем искать сервера. По умолчанию они
            # ищутся по ID номеру

            self.queryset = self.queryset.filter(category__name=category)

        if by_user:
            # Если в запросе присутвует параметр by_user.
            # То мы находим Id пользователя и присваиваем
            # его переменой, после чего фильтруем ранее
            # полученные данные. Важно что он должен стоять
            # и именно перед урезанием массива , т.е.
            # перед if qty. Иначе сервер начинает ругаться.
            user_id = request.user.id
            self.queryset = self.queryset.filter(member=user_id)

        if with_num_members:
            # Этот парамтер проверяет есть ли условие в
            # запросе, если есть, то суммирует кол-во
            # участников, которые подписаны на данный сервер.
            # Нужно обратить внимание, что тут вдруг
            # появляется переменная num_members, которая
            # ранее нигде не создавалась. Эта переменная
            # будет указана в serializer объекта.
            # С тем же самым именем. У вас может возникнуть вопрос ,
            #  почему мы используем класс Count, разве
            # мы не можем посчитать его другими функциями.
            # Я полагаю можем. Но через класс нам удобнее
            # обратся к параметру по имени и не
            # прописывать длинные портянки. Также
            # нужно обратить внимание что нужно
            # теперь добавить num_members в сериалайзер,
            # так как django не поймет как его нужно отображать
            self.queryset = self.queryset.annotate(num_members=Count("member"))

        if qty:
            # Если в запросе указано кол-во, то мы просто
            # отфильтровываем выдачу согласно заданному кол-ву.
            # Простая нарезка списков/сетов

            self.queryset = self.queryset[: int(qty)]

        if by_serverid:
            # Здесь мы начинаем фильтровать сервера
            # по id номеру. Но у нас могут возникнуть
            # проблемы в том плане что может быть указан
            # номер сервера, который вообще не присутсвует
            # в списке серверов, а также может быть
            # задан вообще не номер, а набор букв.
            # На этот случай нам нужно предусмотреть обработку ошибок.
            try:
                self.queryset = self.queryset.filter(id=by_serverid)
                if not self.queryset.exists():
                    # Тут мы проверяем присутвует ли
                    # вообще такой номер сервера в базе
                    raise ValidationError(
                        detail=f"Server with id {by_serverid} not found"
                    )
            except ValueError:
                # Тут обработчик ошибок поймает исключение, если вместо номера сервера было задано что-то другое (буквыб символыб прочее ..)
                raise ValidationError(detail=f"Server value error")

        # Ниже в сериалайзере присутвует приписка many.
        # Как я понял эта приписка обязательна если в подели
        # присутствует отношение многие ко многим. В нашем
        # случае она есть. Но если это не так нужно поправить этот комментарий
        #
        # Также обрати внимание на контекст.
        # Это поле передается в сериалайзер для того,
        # чтоб он смог понять нужно ли это поле
        # отображать или нет. Мне кажется это не
        # элегантное решение. Наверняка есть какое
        # то решения не уровне самого сериалайзера.
        # Возможно можно прописать какую то функцию.
        # Но как одно из решений имеет место быть
        serializer = ServerSerializer(
            self.queryset, many=True, context={"num_members": with_num_members}
        )

        # Ну и собственно возвращаем данные
        return Response(serializer.data)
