from django.contrib import admin
from django.urls import path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework.routers import DefaultRouter
from server.views import ServerListViewSet

# Вот тут создается отдельный класс роутеров и регистриуется
# специальный путь, который имеет встроенные классы , которые
# умеют работать с ViewSets. обрабатывают такие запросы как
# list, create, retrive, update, destroy и т.д.
# router также могут работать со всякими рекизитами запроса
# примерно такими:
# http://127.0.0.1:8000/api/server/select/?category=Cat1
router = DefaultRouter()
router.register("api/server/select", ServerListViewSet)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/schema/swagger-ui/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
] + router.urls
