from django.conf.urls import include, url

from . import views
urlpatterns = [
    url(r'^$', views.saveData, name='saveData'),
]

#  urlpatterns =patterns( 
#     url(r'^$', views.index, name='index')
# );