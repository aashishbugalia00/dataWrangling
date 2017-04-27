from pymongo import MongoClient
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import ast
import yaml

@csrf_exempt
def saveData(request):
	client = MongoClient("mongodb://localhost:27017")
	db = client.demo
	data = request.GET['data']
	outputRes=''
	if data !='':
		e = data.encode('ascii', 'ignore')
		s = yaml.load(e)
		db.mongodbInHouse.insert(s)
		outputRes='Success'
	else:
		outputRes = 'Fail'

	
	return JsonResponse({'responseData':outputRes})